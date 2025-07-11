import { createContainer, asClass, asValue, asFunction, aliasTo, AwilixContainer } from 'awilix';
import { RegistrationConfig, IIoC, JsonRegistrationConfig, ClassConstructor, JsonValue, DependencyConfig } from './types';

/**
 * IoC container wrapper over Awilix to manage dependency registration and resolution.
 * Enhanced with support for class arguments, nested dependencies, and JSON configuration.
 */
export class IoC implements IIoC {
  private container: AwilixContainer;

  constructor() {
    this.container = createContainer();
  }

  /**
   * Registers dependencies from configurations.
   * @param configs - An array of registration configurations.
   */
  async register(configs: RegistrationConfig[]): Promise<void> {
    // First pass: register all dependencies without nested dependencies
    for (const config of configs) {
      if (!config.dependencies || config.dependencies.length === 0) {
        await this.registerSingle(config);
      }
    }

    // Second pass: register dependencies that have references
    for (const config of configs) {
      if (config.dependencies && config.dependencies.length > 0) {
        await this.registerSingle(config);
      }
    }
  }

  /**
   * Processes dependency configurations and resolves references
   * @param dependencies - Array of dependency configurations
   * @returns Array of resolved registration configurations
   */
  private async processDependencies(dependencies: DependencyConfig[]): Promise<RegistrationConfig[]> {
    const resolvedConfigs: RegistrationConfig[] = [];
    
    for (const dep of dependencies) {
      if (dep.type === 'ref') {
        // This is a reference - find the existing configuration
        const existingConfig = this.findConfigByKey(dep.target as string);
        if (existingConfig) {
          resolvedConfigs.push(existingConfig);
        } else {
          throw new Error(`Reference '${dep.target}' not found in registered dependencies.`);
        }
      } else {
        // This is an inline configuration - convert to RegistrationConfig
        const registrationConfig: RegistrationConfig = {
          key: dep.key,
          target: dep.target,
          type: dep.type,
          lifetime: dep.lifetime,
          path: dep.path,
          args: dep.args,
          dependencies: dep.dependencies
        };
        resolvedConfigs.push(registrationConfig);
      }
    }
    
    return resolvedConfigs;
  }

  /**
   * Stores registered configurations for reference resolution
   */
  private registeredConfigs: Map<string, RegistrationConfig> = new Map();

  /**
   * Finds a configuration by its key
   * @param key - The key to search for
   * @returns The found configuration or undefined
   */
  private findConfigByKey(key: string): RegistrationConfig | undefined {
    return this.registeredConfigs.get(key);
  }

  /**
   * Registers dependencies from JSON configuration.
   * This method allows for JSON-serializable dependency configuration.
   *
   * @param configs - An array of JSON-serializable registration configurations
   * @param classRegistry - Registry of class constructors for JSON config
   */
  async registerFromJson(configs: JsonRegistrationConfig[], classRegistry: { [key: string]: ClassConstructor }): Promise<void> {
    // Convert JSON configs to regular configs
    const convertedConfigs: RegistrationConfig[] = configs.map(config => this.convertJsonConfig(config, classRegistry));
    
    // Register using the standard method
    await this.register(convertedConfigs);
  }

  /**
   * Registers a single dependency with enhanced support for class arguments and dependency injection.
   *
   * @param config - The registration configuration.
   */
  private async registerSingle(config: RegistrationConfig): Promise<void> {
    const { key, target, type = 'class', lifetime = 'transient', path, args, dependencies } = config;

    // Handle reference case
    if (type === 'ref') {
      const existingConfig = this.findConfigByKey(target as string);
      if (existingConfig) {
        // Copy the existing configuration with potential overrides
        const mergedConfig = { ...existingConfig, ...config };
        mergedConfig.type = existingConfig.type; // Keep original type, not 'ref'
        await this.registerSingle(mergedConfig);
        return;
      } else {
        throw new Error(`Reference '${target}' not found in registered dependencies.`);
      }
    }

    // Generate the key if not explicitly provided
    const dependencyKey = key ?? this.determineKey(target);

    if (!dependencyKey) {
      throw new Error('Unable to determine the key for the dependency registration.');
    }

    // Store the configuration for reference resolution
    this.registeredConfigs.set(dependencyKey, config);

    // Handle registration types
    switch (type) {
      case 'value':
        this.container.register(dependencyKey, asValue(target)); // Register a value
        break;

      case 'function':
        if (typeof target !== 'function') {
          throw new Error(`Invalid target for type 'function' for key '${dependencyKey}'. Must be a function.`);
        }
        this.container.register(dependencyKey, asFunction(target)[lifetime]()); // Register a function
        break;

      case 'alias':
        this.container.register(dependencyKey, aliasTo(target)); // Register an alias
        break;

      case 'class':
        await this.registerClass(dependencyKey, target, lifetime, path, args, dependencies);
        break;

      default:
        throw new Error(`Unsupported type '${type}' for dependency registration.`);
    }
  }

  /**
   * Registers a class with enhanced support for constructor arguments and dependency injection.
   *
   * @param key - The dependency key
   * @param target - The class constructor or string for dynamic import
   * @param lifetime - The lifecycle of the dependency
   * @param path - Path for dynamic imports
   * @param args - Arguments to pass to the class constructor
   * @param dependencies - Nested dependencies to inject
   */
  private async registerClass(
    key: string,
    target: any,
    lifetime: 'singleton' | 'transient' | 'scoped',
    path?: string,
    args?: JsonValue[],
    dependencies?: DependencyConfig[]
  ): Promise<void> {
    let classConstructor: ClassConstructor;

    // Resolve the class constructor
    if (typeof target === 'string') {
      // Dynamic import
      if (!path) {
        throw new Error(`Path is required for dynamic imports when target is a string ('${target}').`);
      }
      const modulePath = `${path}/${target}`;
      const importedModule = await import(modulePath);
      classConstructor = Object.values(importedModule)[0] as ClassConstructor;
    } else if (typeof target === 'function') {
      // Direct class reference
      classConstructor = target as ClassConstructor;
    } else {
      throw new Error(`Invalid target for type 'class' for key '${key}'. Must be a class or string for dynamic import.`);
    }

    // If we have static arguments, use a factory function approach
    if (args && args.length > 0) {
      const factoryFunction = (cradle: any) => {
        // If we have dependencies, resolve them from the cradle
        const resolvedDependencies: any[] = [];
        
        // Add static arguments first
        resolvedDependencies.push(...args);
        
        // Add resolved dependencies if any
        if (dependencies && dependencies.length > 0) {
          const depObject: { [key: string]: any } = {};
          for (const dep of dependencies) {
            let propertyName: string;
            let targetKey: string;
            
            if (dep.type === 'ref') {
              // Reference case
              targetKey = dep.target as string;
              propertyName = dep.key ?? this.inferPropertyName(targetKey);
            } else {
              // Inline case
              propertyName = dep.key ?? this.determineKey(dep.target) ?? 'unknown';
              targetKey = propertyName;
            }
            
            depObject[propertyName] = cradle[targetKey];
          }
          resolvedDependencies.push(depObject);
        }
        
        return new classConstructor(...resolvedDependencies);
      };
      
      this.container.register(key, asFunction(factoryFunction)[lifetime]());
    } else if (dependencies && dependencies.length > 0) {
      // Dependencies but no static args - use factory function for better control
      const factoryFunction = (cradle: any) => {
        const depObject: { [key: string]: any } = {};
        for (const dep of dependencies) {
          let propertyName: string;
          let targetKey: string;
          
          if (dep.type === 'ref') {
            // Reference case
            targetKey = dep.target as string;
            propertyName = dep.key ?? this.inferPropertyName(targetKey);
          } else {
            // Inline case
            propertyName = dep.key ?? this.determineKey(dep.target) ?? 'unknown';
            targetKey = propertyName;
          }
          
          depObject[propertyName] = cradle[targetKey];
        }
        
        return new classConstructor(depObject);
      };
      
      this.container.register(key, asFunction(factoryFunction)[lifetime]());
    } else {
      // No args or dependencies - simple class registration
      this.container.register(key, asClass(classConstructor)[lifetime]());
    }
  }

  /**
   * Infers the property name for dependency injection from a target key
   * @param targetKey - The target key to resolve
   * @returns The inferred property name
   */
  private inferPropertyName(targetKey: string): string {
    // Map common logger keys to 'logger' property
    if (targetKey.toLowerCase().includes('logger')) {
      return 'logger';
    }
    
    // Remove common suffixes and return camelCase
    const cleaned = targetKey
      .replace(/Service$/, '')
      .replace(/Component$/, '')
      .replace(/Manager$/, '');
    
    // Convert to camelCase if needed
    return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
  }

  /**
   * Converts a JSON configuration to a regular registration configuration.
   * TODO: Update to support new DependencyConfig[] format
   *
   * @param config - The JSON configuration
   * @param classRegistry - Registry of class constructors
   * @returns The converted configuration
   */
  private convertJsonConfig(config: JsonRegistrationConfig, classRegistry: { [key: string]: ClassConstructor }): RegistrationConfig {
    const convertedConfig: RegistrationConfig = {
      key: config.key,
      type: config.type,
      lifetime: config.lifetime,
      path: config.path,
      args: config.args,
      target: config.target
    };

    // Resolve target from class registry if it's a class type
    if (config.type === 'class' && classRegistry[config.target]) {
      convertedConfig.target = classRegistry[config.target];
    }

    // Convert nested dependencies
    if (config.dependencies) {
      // convertedConfig.dependencies = {};
      // for (const [key, depConfig] of Object.entries(config.dependencies)) {
      //   convertedConfig.dependencies[key] = this.convertJsonConfig(depConfig, classRegistry);
      // }
      // TODO: Convert to DependencyConfig[] format
      // For now, leaving this commented to avoid compilation errors
      // convertedConfig.dependencies = [];
    }

    return convertedConfig;
  }

  /**
   * Unregisters dependencies from the container based on their keys.
   * Note: This removes dependencies from the internal registrations.
   *
   * @param keys - An array of keys to unregister.
   */
  unregister(keys: string[]): void {
    for (const key of keys) {
      if (!this.container.registrations[key]) {
        throw new Error(`Cannot unregister: Dependency with key "${key}" does not exist.`);
      }
      // Remove from registrations (awilix doesn't have direct unregister)
      delete this.container.registrations[key];
    }
  }

  /**
   * Resolves a dependency from the container.
   *
   * @param key - The key of the dependency to resolve.
   * @returns The resolved dependency.
   */
  resolve<T>(key: string): T;
  resolve(key: string): any;
  resolve<T>(key: string): T {
    return this.container.resolve<T>(key);
  }

  /**
   * Gets the current container instance
   * @returns The Awilix container instance
   */
  getContainer(): AwilixContainer {
    return this.container;
  }

  /**
   * Gets all registered dependency keys
   * @returns Array of registered keys
   */
  getRegisteredKeys(): string[] {
    return Object.keys(this.container.registrations);
  }

  /**
   * Checks if a key is registered
   * @param key - The key to check
   * @returns True if the key is registered
   */
  isRegistered(key: string): boolean {
    return key in this.container.registrations;
  }

  /**
   * Creates a scoped container for managing request-scoped dependencies
   * @returns A new scoped container
   */
  createScope(): AwilixContainer {
    return this.container.createScope();
  }

  /**
   * Exports the current configuration as JSON-serializable format
   * @returns JSON-serializable configuration
   */
  exportToJson(): JsonRegistrationConfig[] {
    // This is a simplified export - in a real implementation, 
    // you'd want to store the original configurations
    const configs: JsonRegistrationConfig[] = [];
    
    for (const key of this.getRegisteredKeys()) {
      // This is a basic implementation - you'd enhance this based on your needs
      configs.push({
        key,
        target: key, // Simplified - you'd need to store original target info
        type: 'class' // Simplified - you'd need to store original type info
      });
    }
    
    return configs;
  }

  /**
   * Loads configuration from JSON file
   * @param configPath - Path to the JSON configuration file
   * @param classRegistry - Registry of class constructors
   */
  async loadFromJsonFile(configPath: string, classRegistry: { [key: string]: ClassConstructor }): Promise<void> {
    const fs = await import('fs');
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    await this.registerFromJson(configData, classRegistry);
  }

  /**
   * Saves configuration to JSON file
   * @param configPath - Path to save the JSON configuration
   */
  async saveToJsonFile(configPath: string): Promise<void> {
    const fs = await import('fs');
    const config = this.exportToJson();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  }

  /**
   * Determines the default key for a dependency based on its type.
   *
   * @param target - The dependency target.
   * @returns The inferred key.
   */
  private determineKey(target: any): string | undefined {
    if (typeof target === 'string') {
      return target; // Use the string directly
    } else if (typeof target === 'function' && target.name) {
      return target.name; // Use the class name
    }
    return undefined; // Cannot determine a key
  }
} 