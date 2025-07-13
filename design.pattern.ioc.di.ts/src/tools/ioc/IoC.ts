import { createContainer, asClass, asValue, asFunction, aliasTo, AwilixContainer } from 'awilix';
import { ServiceConfig, IIoC, JsonRegistrationConfig, ClassConstructor, JsonValue } from './types';

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
  private readonly registeredConfigs = new Map<string, ServiceConfig>();
  
  // Auto-registration configurations (regex patterns)
  private readonly autoRegistrationPatterns: ServiceConfig[] = [];
  
  // Cache for resolved auto-registrations to avoid re-processing
  private readonly autoRegistrationCache = new Map<string, boolean>();
  
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
   * Registers dependencies based on the provided configuration objects.
   * 
   * This method processes a batch of service configurations and registers them
   * with the IoC container. It supports various dependency types including classes,
   * functions, values, aliases, references, and auto-registration configurations.
   * 
   * @param configs - Array of service configurations to register
   * @returns Promise that resolves when all dependencies are registered
   * 
   * @example
   * ```typescript
   * await ioc.register([
   *   { key: 'logger', target: Logger, type: 'class', lifetime: 'singleton' },
   *   { key: 'autoService', target: 'DataManager', type: 'auto', path: '../../components' }
   * ]);
   * ```
   */
  async register(configs: ServiceConfig[]): Promise<void> {
    // Store configurations in registeredConfigs for tracking
    for (const config of configs) {
      const key = config.key ?? this.determineKey(config.target);
      if (key) this.registeredConfigs.set(key, config);
    }

    // Partition configurations: regular vs auto-registration
    const [regularConfigs, autoConfigs] = this.partitionConfigs(configs);
    
    // Store auto-registration configurations for later dynamic loading
    this.storeAutoRegistrationConfigs(autoConfigs);
    
    // Register regular configurations immediately
    if (regularConfigs.length > 0) {
      await this.registerBatch(regularConfigs);
    }
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
   * Partitions configurations into regular and auto-registration groups.
   * 
   * @param configs - Array of service configurations to partition
   * @returns Tuple containing [regularConfigs, autoConfigs]
   */
  private partitionConfigs(configs: ServiceConfig[]): [ServiceConfig[], ServiceConfig[]] {
    const regularConfigs: ServiceConfig[] = [];
    const autoConfigs: ServiceConfig[] = [];

    for (const config of configs) {
      if (config.type === 'auto') {
        autoConfigs.push(config);
      } else {
        regularConfigs.push(config);
      }
    }

    return [regularConfigs, autoConfigs];
  }

  /**
   * Registers a batch of configurations with optimized dependency resolution.
   * 
   * @param configs - Array of service configurations to register
   */
  private async registerBatch(configs: ServiceConfig[]): Promise<void> {
    // Partition by dependency complexity for optimal registration order
    const [withoutDeps, withDeps] = this.partitionByDependencies(configs);
    
    // Register dependencies without references first
    for (const config of withoutDeps) {
      await this.registerSingle(config);
    }
    
    // Register dependencies with references second
    for (const config of withDeps) {
      await this.registerSingle(config);
    }
  }

  /**
   * Partitions configurations by dependency complexity for optimal registration order.
   * 
   * @param configs - Array of service configurations to partition
   * @returns Tuple containing [withoutDeps, withDeps]
   */
  private partitionByDependencies(configs: ServiceConfig[]): [ServiceConfig[], ServiceConfig[]] {
    const withoutDeps: ServiceConfig[] = [];
    const withDeps: ServiceConfig[] = [];

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
   * Registers a single dependency with optimized type handling.
   */
  private async registerSingle(config: ServiceConfig): Promise<void> {
    const { key, target, type = 'class', lifetime = 'transient', path, args, dependencies, file } = config;

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
    await this.executeRegistrationStrategy(dependencyKey, target, type, lifetime, path, args, dependencies, file);
  }



  /**
   * Handles reference type registrations.
   */
  private async handleReference(config: ServiceConfig): Promise<void> {
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
    dependencies?: ServiceConfig[],
    file?: string
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
        await this.registerClass(key, target, lifetime, path, args, dependencies, file);
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
    dependencies?: ServiceConfig[],
    file?: string
  ): Promise<void> {
    const classConstructor = await this.resolveClassConstructor(key, target, path, file);
    
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
   * Resolves class constructor from target (string or function) with enhanced module resolution.
   * 
   * Features:
   * - Prioritizes export default over named exports
   * - Supports direct file paths via `file` parameter
   * - Optimized module resolution with performance improvements
   * - Flexible fallback mechanism for different export patterns
   * 
   * @param key - The dependency key for error reporting
   * @param target - The target class (function or string)
   * @param path - Base path for module resolution (used with target)
   * @param file - Direct file path (takes precedence over path/target)
   * @returns Promise resolving to the class constructor
   */
  private async resolveClassConstructor(key: string, target: any, path?: string, file?: string): Promise<ClassConstructor> {
    // Fast path: if target is already a function, return it directly
    if (typeof target === 'function') {
      return target as ClassConstructor;
    }
    
    if (typeof target === 'string') {
      // Determine module path with priority: file > path/target
      const modulePath = file ?? (path ? `${path}/${target}` : null);
      
      if (!modulePath) {
        throw new Error(IoC.ERRORS.MISSING_PATH(target));
      }
      
      try {
        // Import module with optimized resolution
      const importedModule = await import(modulePath);
        
        // Performance optimization: Use fastest resolution strategy
        return this.resolveConstructorFromModule(importedModule, target, key);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to import module '${modulePath}' for dependency '${key}': ${errorMessage}`);
      }
    }
    
    throw new Error(IoC.ERRORS.INVALID_TARGET(key, 'class'));
  }
  
  /**
   * Resolves constructor from imported module with prioritized export resolution.
   * 
   * Resolution priority:
   * 1. Export default (highest priority)
   * 2. Named export matching target name
   * 3. First available export (fallback)
   * 
   * @param importedModule - The imported module object
   * @param target - The target name for named export lookup
   * @param key - The dependency key for error reporting
   * @returns The resolved class constructor
   */
  private resolveConstructorFromModule(importedModule: any, target: string, key: string): ClassConstructor {
    // Priority 1: Export default (most common and performant)
    if (importedModule.default) {
      return importedModule.default as ClassConstructor;
    }
    
    // Priority 2: Named export matching target name
    if (importedModule[target]) {
      return importedModule[target] as ClassConstructor;
    }
    
    // Priority 3: First available export (fallback)
    const exportedValues = Object.values(importedModule);
    if (exportedValues.length > 0) {
      return exportedValues[0] as ClassConstructor;
    }
    
    // No valid exports found
    throw new Error(`No valid constructor found in module for dependency '${key}'. Expected default export or named export '${target}'.`);
  }

  /**
   * Creates an optimized factory function for class instantiation.
   * Consolidates all factory function creation logic into a single, reusable method.
   */
  private createFactoryFunction(
    classConstructor: ClassConstructor,
    args?: JsonValue[],
    dependencies?: ServiceConfig[]
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
  private resolveDependencyObject(cradle: any, dependencies: ServiceConfig[]): Record<string, any> {
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
  private resolveDependencyNames(dep: ServiceConfig): { propertyName: string; targetKey: string } {
    if (dep.type === 'ref') {
      const targetKey = dep.target as string;
      const propertyName = dep.key ?? targetKey;
      return { propertyName, targetKey };
    }
    
    // Use awilix's built-in camelCase conversion
    const propertyName = dep.key ?? this.determineKey(dep.target) ?? 'unknown';
    return { propertyName, targetKey: propertyName };
  }

  // === JSON CONFIGURATION METHODS ===

  /**
   * Converts JSON configuration to regular service configuration.
   */
  private convertJsonConfig(config: JsonRegistrationConfig, classRegistry: Record<string, ClassConstructor>): ServiceConfig {
    const convertedConfig: ServiceConfig = {
      key: config.key,
      type: config.type,
      lifetime: config.lifetime,
      path: config.path,
      file: config.file,
      args: config.args,
      regex: config.regex,
      target: config.target && config.type === 'class' && classRegistry[config.target] 
        ? classRegistry[config.target] 
        : config.target
    };

    return convertedConfig;
  }

  /**
   * Stores auto-registration configurations for later dynamic loading.
   * 
   * @param autoConfigs - Array of auto-registration configurations
   */
  private storeAutoRegistrationConfigs(autoConfigs: ServiceConfig[]): void {
    for (const config of autoConfigs) {
      // Set default regex if not provided
      if (!config.regex) {
        config.regex = '.*';
      }
      this.autoRegistrationPatterns.push(config);
    }
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
   * Resolves a dependency from the container with auto-registration support.
   * 
   * If the dependency is not found in the container, it attempts to auto-register
   * it using stored regex patterns before resolving. This is the primary resolution method.
   * 
   * @template T - The expected type of the resolved dependency
   * @param key - The key of the dependency to resolve
   * @returns The resolved dependency instance
   * 
   * @example
   * ```typescript
   * const logger = await ioc.resolve<Logger>('logger');
   * const dataManager = await ioc.resolve<DataManager>('DataManager');
   * ```
   * 
   * @throws Error if dependency cannot be resolved or auto-registered
   */
  async resolve<T>(key: string): Promise<T> {
    try {
      // Try to resolve from container first (fast path)
      return this.container.resolve<T>(key);
    } catch (error) {
      // If not found, try auto-registration (asynchronous)
      const autoRegistered = await this.tryAutoRegistration(key);
      if (autoRegistered) {
        return this.container.resolve<T>(key);
      }
      
      // If no auto-registration pattern matches, throw original error
      throw error;
    }
  }

  /**
   * Resolves a dependency from the container synchronously without auto-registration.
   * 
   * This method provides fast synchronous resolution for performance-critical scenarios
   * where auto-registration is not needed.
   * 
   * @template T - The expected type of the resolved dependency
   * @param key - The key of the dependency to resolve
   * @returns The resolved dependency instance
   * 
   * @example
   * ```typescript
   * const logger = ioc.resolveSync<Logger>('logger');
   * ```
   * 
   * @throws Error if dependency cannot be resolved
   */
  resolveSync<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  /**
   * @deprecated Use resolve() instead. This method is kept for backward compatibility.
   */
  async resolveAsync<T>(key: string): Promise<T> {
    return this.resolve<T>(key);
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

  /**
   * Attempts to auto-register a dependency using regex patterns.
   * 
   * @param key - The key to auto-register
   * @returns True if auto-registration was successful, false otherwise
   */
  private async tryAutoRegistration(key: string): Promise<boolean> {
    // Check cache first to avoid re-processing
    if (this.autoRegistrationCache.has(key)) {
      return this.autoRegistrationCache.get(key)!;
    }

    // Find matching regex pattern
    const matchingPattern = this.autoRegistrationPatterns.find(pattern => {
      const regexPattern = pattern.regex || '.*'; // Default to match everything
      const regex = new RegExp(regexPattern);
      return regex.test(key);
    });

    if (!matchingPattern) {
      this.autoRegistrationCache.set(key, false);
      return false;
    }

    try {
      // Perform asynchronous auto-registration
      await this.performAutoRegistration(key, matchingPattern);
      this.autoRegistrationCache.set(key, true);
      console.log(`✅ Auto-registered dependency: ${key}`);
      return true;
    } catch (error) {
      this.autoRegistrationCache.set(key, false);
      console.warn(`⚠️ Failed to auto-register dependency '${key}': ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Performs auto-registration for a specific key using a matching pattern.
   * 
   * @param key - The key to auto-register
   * @param pattern - The matching auto-registration pattern
   * @throws Error if auto-registration fails
   */
  private async performAutoRegistration(key: string, pattern: ServiceConfig): Promise<void> {
    // Determine the module path
    const modulePath = pattern.file ?? (pattern.path ? `${pattern.path}/${key}` : null);
    
    if (!modulePath) {
      throw new Error(`No path specified for auto-registration of '${key}'`);
    }

    try {
      // Asynchronous module loading using dynamic import
      const importedModule = await import(modulePath);
      
      // Get the constructor from the module
      const constructor = this.resolveConstructorFromModule(importedModule, key, key);
      
      // Create the service configuration
      const serviceConfig: ServiceConfig = {
        key,
        target: constructor,
        type: 'class',
        lifetime: pattern.lifetime ?? 'transient',
        dependencies: pattern.dependencies,
        args: pattern.args
      };

      // Register the dependency asynchronously
      await this.registerSingle(serviceConfig);
      
    } catch (error) {
      throw new Error(`Failed to load module '${modulePath}' for auto-registration of '${key}': ${error instanceof Error ? error.message : String(error)}`);
    }
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