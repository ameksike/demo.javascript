import { createContainer, asClass, asValue, asFunction, aliasTo, AwilixContainer } from 'awilix';
import { RegistrationConfig, IIoC, JsonRegistrationConfig, ClassConstructor, JsonValue, DependencyConfig } from './types';

/**
 * Optimized IoC container wrapper over Awilix.
 * Enhanced with support for class arguments, nested dependencies, and JSON configuration.
 * 
 * Key optimizations:
 * - Eliminated code duplication in dependency resolution
 * - Simplified complex methods with better separation of concerns
 * - Improved performance through strategic caching and reduced operations
 * - Enhanced clarity with focused, single-responsibility methods
 */
export class IoC implements IIoC {
  private readonly container: AwilixContainer;
  private readonly registeredConfigs = new Map<string, RegistrationConfig>();

  // Performance optimization: Cache commonly used patterns
  private readonly propertyNameCache = new Map<string, string>();
  
  // Error messages for consistency
  private static readonly ERRORS = {
    REFERENCE_NOT_FOUND: (ref: string) => `Reference '${ref}' not found in registered dependencies.`,
    INVALID_TARGET: (key: string, type: string) => `Invalid target for type '${type}' for key '${key}'.`,
    MISSING_PATH: (target: string) => `Path is required for dynamic imports when target is a string ('${target}').`,
    CANNOT_DETERMINE_KEY: () => 'Unable to determine the key for the dependency registration.',
    UNREGISTER_NOT_FOUND: (key: string) => `Cannot unregister: Dependency with key "${key}" does not exist.`,
    FUNCTION_REQUIRED: (key: string) => `Invalid target for type 'function' for key '${key}'. Must be a function.`,
    UNSUPPORTED_TYPE: (type: string) => `Unsupported type '${type}' for dependency registration.`
  };

  /**
   * Initializes a new IoC container with Awilix as the underlying DI framework.
   * Sets up internal maps for configuration caching and property name optimization.
   */
  constructor() {
    this.container = createContainer();
  }

  /**
   * Registers dependencies from configurations using optimized two-pass approach.
   * First pass: dependencies without references
   * Second pass: dependencies with references (to ensure proper resolution order)
   */
  async register(configs: RegistrationConfig[]): Promise<void> {
    const [withoutDeps, withDeps] = this.partitionConfigs(configs);
    
    // Register dependencies without references first
    await this.registerBatch(withoutDeps);
    
    // Register dependencies with references second
    await this.registerBatch(withDeps);
  }

  /**
   * Registers dependencies from JSON configuration.
   */
  async registerFromJson(configs: JsonRegistrationConfig[], classRegistry: Record<string, ClassConstructor>): Promise<void> {
    const convertedConfigs = configs.map(config => this.convertJsonConfig(config, classRegistry));
    await this.register(convertedConfigs);
  }

  // === CORE REGISTRATION METHODS ===

  /**
   * Partitions configurations into those with and without dependencies for optimal registration order.
   */
  private partitionConfigs(configs: RegistrationConfig[]): [RegistrationConfig[], RegistrationConfig[]] {
    const withoutDeps: RegistrationConfig[] = [];
    const withDeps: RegistrationConfig[] = [];
    
    for (const config of configs) {
      if (!config.dependencies?.length) {
        withoutDeps.push(config);
      } else {
        withDeps.push(config);
      }
    }
    
    return [withoutDeps, withDeps];
  }

  /**
   * Registers a batch of configurations.
   */
  private async registerBatch(configs: RegistrationConfig[]): Promise<void> {
    for (const config of configs) {
      await this.registerSingle(config);
    }
  }

  /**
   * Registers a single dependency with optimized type handling.
   */
  private async registerSingle(config: RegistrationConfig): Promise<void> {
    const { key, target, type = 'class', lifetime = 'transient', path, args, dependencies } = config;

    // Handle reference case with early return pattern
    if (type === 'ref') {
      await this.handleReference(config);
      return;
    }

    const dependencyKey = key ?? this.determineKey(target);
    if (!dependencyKey) {
      throw new Error(IoC.ERRORS.CANNOT_DETERMINE_KEY());
    }

    // Cache configuration for reference resolution
    this.registeredConfigs.set(dependencyKey, config);

    // Use strategy pattern for registration types
    await this.executeRegistrationStrategy(dependencyKey, target, type, lifetime, path, args, dependencies);
  }

  /**
   * Handles reference type registrations.
   */
  private async handleReference(config: RegistrationConfig): Promise<void> {
    const existingConfig = this.registeredConfigs.get(config.target as string);
    if (!existingConfig) {
      throw new Error(IoC.ERRORS.REFERENCE_NOT_FOUND(config.target as string));
    }
    
    // Merge configurations with original type preserved
    const mergedConfig = { 
      ...existingConfig, 
      ...config, 
      type: existingConfig.type 
    };
    
    await this.registerSingle(mergedConfig);
  }

  /**
   * Executes the appropriate registration strategy based on type.
   */
  private async executeRegistrationStrategy(
    key: string,
    target: any,
    type: string,
    lifetime: 'singleton' | 'transient' | 'scoped',
    path?: string,
    args?: JsonValue[],
    dependencies?: DependencyConfig[]
  ): Promise<void> {
    switch (type) {
      case 'value':
        this.container.register(key, asValue(target));
        break;
        
      case 'function':
        this.registerFunction(key, target, lifetime);
        break;
        
      case 'alias':
        this.container.register(key, aliasTo(target));
        break;
        
      case 'class':
        await this.registerClass(key, target, lifetime, path, args, dependencies);
        break;
        
      default:
        throw new Error(IoC.ERRORS.UNSUPPORTED_TYPE(type));
    }
  }

  /**
   * Registers a function with validation.
   */
  private registerFunction(key: string, target: any, lifetime: 'singleton' | 'transient' | 'scoped'): void {
    if (typeof target !== 'function') {
      throw new Error(IoC.ERRORS.FUNCTION_REQUIRED(key));
    }
    this.container.register(key, asFunction(target)[lifetime]());
  }

  /**
   * Optimized class registration with simplified logic.
   */
  private async registerClass(
    key: string,
    target: any,
    lifetime: 'singleton' | 'transient' | 'scoped',
    path?: string,
    args?: JsonValue[],
    dependencies?: DependencyConfig[]
  ): Promise<void> {
    const classConstructor = await this.resolveClassConstructor(key, target, path);
    
    // Use simple class registration for cases without special configuration
    if (!args?.length && !dependencies?.length) {
      this.container.register(key, asClass(classConstructor)[lifetime]());
      return;
    }

    // Create optimized factory function for complex cases
    const factoryFunction = this.createFactoryFunction(classConstructor, args, dependencies);
    this.container.register(key, asFunction(factoryFunction)[lifetime]());
  }

  /**
   * Resolves class constructor from target (string or function).
   */
  private async resolveClassConstructor(key: string, target: any, path?: string): Promise<ClassConstructor> {
    if (typeof target === 'function') {
      return target as ClassConstructor;
    }
    
    if (typeof target === 'string') {
      if (!path) {
        throw new Error(IoC.ERRORS.MISSING_PATH(target));
      }
      
      const modulePath = `${path}/${target}`;
      const importedModule = await import(modulePath);
      return Object.values(importedModule)[0] as ClassConstructor;
    }
    
    throw new Error(IoC.ERRORS.INVALID_TARGET(key, 'class'));
  }

  /**
   * Creates an optimized factory function for class instantiation.
   * Consolidates all factory function creation logic into a single, reusable method.
   */
  private createFactoryFunction(
    classConstructor: ClassConstructor,
    args?: JsonValue[],
    dependencies?: DependencyConfig[]
  ): (cradle: any) => any {
    return (cradle: any) => {
      // Handle static arguments
      if (args?.length) {
        const resolvedArgs = [...args];
        
        // Add dependency object if dependencies exist
        if (dependencies?.length) {
          const dependencyObject = this.resolveDependencyObject(cradle, dependencies);
          resolvedArgs.push(dependencyObject);
        }
        
        return new classConstructor(...resolvedArgs);
      }
      
      // Handle dependency-only case (most common)
      if (dependencies?.length) {
        const dependencyObject = this.resolveDependencyObject(cradle, dependencies);
        return new classConstructor(dependencyObject);
      }
      
      // Fallback (shouldn't reach here based on earlier checks)
      return new classConstructor();
    };
  }

  /**
   * Resolves dependency object from cradle using cached property names for performance.
   */
  private resolveDependencyObject(cradle: any, dependencies: DependencyConfig[]): Record<string, any> {
    const dependencyObject: Record<string, any> = {};
    
    for (const dep of dependencies) {
      const { propertyName, targetKey } = this.resolveDependencyNames(dep);
      dependencyObject[propertyName] = cradle[targetKey];
    }
    
    return dependencyObject;
  }

  /**
   * Resolves property and target names for a dependency with caching.
   */
  private resolveDependencyNames(dep: DependencyConfig): { propertyName: string; targetKey: string } {
    if (dep.type === 'ref') {
      const targetKey = dep.target as string;
      const propertyName = dep.key ?? this.getCachedPropertyName(targetKey);
      return { propertyName, targetKey };
    }
    
    // Inline case
    const propertyName = dep.key ?? this.determineKey(dep.target) ?? 'unknown';
    return { propertyName, targetKey: propertyName };
  }

  /**
   * Gets cached property name or generates and caches it.
   */
  private getCachedPropertyName(targetKey: string): string {
    let propertyName = this.propertyNameCache.get(targetKey);
    if (!propertyName) {
      propertyName = this.inferPropertyName(targetKey);
      this.propertyNameCache.set(targetKey, propertyName);
    }
    return propertyName;
  }

  /**
   * Optimized property name inference with better pattern matching.
   */
  private inferPropertyName(targetKey: string): string {
    const lowerKey = targetKey.toLowerCase();
    
    // Quick checks for common patterns
    if (lowerKey.includes('logger')) return 'logger';
    if (lowerKey.includes('service')) return lowerKey.replace(/service$/i, '');
    if (lowerKey.includes('repository')) return lowerKey.replace(/repository$/i, '');
    
    // Remove common suffixes and convert to camelCase
    const cleaned = targetKey
      .replace(/(?:Service|Component|Manager|Repository|Handler)$/i, '')
      .replace(/^[A-Z]/, char => char.toLowerCase());
    
    return cleaned || targetKey.toLowerCase();
  }

  // === JSON CONFIGURATION METHODS ===

  /**
   * Converts JSON configuration to regular registration configuration.
   */
  private convertJsonConfig(config: JsonRegistrationConfig, classRegistry: Record<string, ClassConstructor>): RegistrationConfig {
    const convertedConfig: RegistrationConfig = {
      key: config.key,
      type: config.type,
      lifetime: config.lifetime,
      path: config.path,
      args: config.args,
      target: config.type === 'class' && classRegistry[config.target] 
        ? classRegistry[config.target] 
        : config.target
    };

    return convertedConfig;
  }

  // === UTILITY METHODS ===

  /**
   * Optimized key determination with better type checking.
   */
  private determineKey(target: any): string | undefined {
    if (typeof target === 'string') return target;
    if (typeof target === 'function' && target.name) return target.name;
    return undefined;
  }

  // === PUBLIC API METHODS ===

  /**
   * Unregisters multiple dependencies from the container.
   * Removes both the Awilix registration and internal configuration cache.
   * 
   * @param keys - Array of dependency keys to unregister
   * @throws {Error} If any key is not found in the container
   * 
   * @example
   * ```typescript
   * ioc.unregister(['logger', 'database']);
   * ```
   */
  unregister(keys: string[]): void {
    for (const key of keys) {
      if (!this.container.registrations[key]) {
        throw new Error(IoC.ERRORS.UNREGISTER_NOT_FOUND(key));
      }
      delete this.container.registrations[key];
      this.registeredConfigs.delete(key);
    }
  }

  /**
   * Resolves a dependency from the container by key.
   * 
   * @template T - The expected type of the resolved dependency
   * @param key - The key of the dependency to resolve
   * @returns The resolved dependency instance
   * @throws {Error} If the key is not registered in the container
   * 
   * @example
   * ```typescript
   * const logger = ioc.resolve<Logger>('logger');
   * const userService = ioc.resolve<UserService>('userService');
   * ```
   */
  resolve<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  /**
   * Gets the underlying Awilix container instance.
   * Useful for advanced container operations or integration with other libraries.
   * 
   * @returns The Awilix container instance
   * 
   * @example
   * ```typescript
   * const awilixContainer = ioc.getContainer();
   * const scope = awilixContainer.createScope();
   * ```
   */
  getContainer(): AwilixContainer {
    return this.container;
  }

  /**
   * Gets all registered dependency keys from the container.
   * 
   * @returns Array of all registered dependency keys
   * 
   * @example
   * ```typescript
   * const keys = ioc.getRegisteredKeys();
   * console.log('Registered dependencies:', keys);
   * ```
   */
  getRegisteredKeys(): string[] {
    return Object.keys(this.container.registrations);
  }

  /**
   * Checks if a dependency is registered in the container.
   * 
   * @param key - The key to check for registration
   * @returns True if the key is registered, false otherwise
   * 
   * @example
   * ```typescript
   * if (ioc.isRegistered('logger')) {
   *   const logger = ioc.resolve<Logger>('logger');
   * }
   * ```
   */
  isRegistered(key: string): boolean {
    return key in this.container.registrations;
  }

  /**
   * Creates a new scope from the container.
   * Scopes allow for request-specific or context-specific dependency resolution.
   * 
   * @returns A new Awilix container scope
   * 
   * @example
   * ```typescript
   * const requestScope = ioc.createScope();
   * requestScope.register('requestId', asValue(generateRequestId()));
   * ```
   */
  createScope(): AwilixContainer {
    return this.container.createScope();
  }

  // === FILE I/O METHODS (Simplified) ===

  /**
   * Exports the current container configuration to JSON format.
   * Note: This is a simplified export that creates basic class registrations.
   * Complex configurations with dependencies may not be fully represented.
   * 
   * @returns Array of JSON registration configurations
   * 
   * @example
   * ```typescript
   * const jsonConfig = ioc.exportToJson();
   * console.log('Container configuration:', jsonConfig);
   * ```
   */
  exportToJson(): JsonRegistrationConfig[] {
    return this.getRegisteredKeys().map(key => ({
      key,
      target: key,
      type: 'class' as const
    }));
  }

  /**
   * Loads dependency configuration from a JSON file.
   * Requires a class registry to map string class names to actual constructors.
   * 
   * @param configPath - Path to the JSON configuration file
   * @param classRegistry - Map of class names to constructors
   * @throws {Error} If file cannot be read or JSON is invalid
   * 
   * @example
   * ```typescript
   * const classRegistry = {
   *   Logger: Logger,
   *   UserService: UserService
   * };
   * await ioc.loadFromJsonFile('./config.json', classRegistry);
   * ```
   */
  async loadFromJsonFile(configPath: string, classRegistry: Record<string, ClassConstructor>): Promise<void> {
    const fs = await import('fs');
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    await this.registerFromJson(configData, classRegistry);
  }

  /**
   * Saves the current container configuration to a JSON file.
   * Uses the simplified export format from exportToJson().
   * 
   * @param configPath - Path where the JSON configuration should be saved
   * @throws {Error} If file cannot be written
   * 
   * @example
   * ```typescript
   * await ioc.saveToJsonFile('./container-config.json');
   * ```
   */
  async saveToJsonFile(configPath: string): Promise<void> {
    const fs = await import('fs');
    const config = this.exportToJson();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }
} 