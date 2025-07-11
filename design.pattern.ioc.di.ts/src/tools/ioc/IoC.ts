import { createContainer, asClass, asValue, asFunction, aliasTo, Lifetime, AwilixContainer } from 'awilix';
import { RegistrationConfig, IIoC, JsonRegistrationConfig, ClassConstructor, JsonValue } from './types';

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
   * Registers dependencies based on the provided configuration objects.
   * Enhanced to support class arguments and nested dependencies.
   *
   * @param configs - An array of registration configurations.
   */
  async register(configs: RegistrationConfig[]): Promise<void> {
    // First pass: register nested dependencies
    for (const config of configs) {
      if (config.dependencies) {
        const nestedConfigs = Object.values(config.dependencies);
        await this.register(nestedConfigs);
      }
    }

    // Second pass: register main dependencies
    for (const config of configs) {
      await this.registerSingle(config);
    }
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

    // Generate the key if not explicitly provided
    const dependencyKey = key ?? this.determineKey(target);

    if (!dependencyKey) {
      throw new Error('Unable to determine the key for the dependency registration.');
    }

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
    dependencies?: { [key: string]: RegistrationConfig }
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
        if (dependencies) {
          const depObject: { [key: string]: any } = {};
          for (const [depKey, depConfig] of Object.entries(dependencies)) {
            const resolvedKey = depConfig.key ?? this.determineKey(depConfig.target);
            if (resolvedKey) {
              depObject[depKey] = cradle[resolvedKey];
            }
          }
          resolvedDependencies.push(depObject);
        }
        
        return new classConstructor(...resolvedDependencies);
      };
      
      this.container.register(key, asFunction(factoryFunction)[lifetime]());
    } else if (dependencies) {
      // Only dependencies, no static args - use inject
      const injectionFunction = this.createInjectionFunction(undefined, dependencies);
      const classRegistration = asClass(classConstructor).inject(injectionFunction);
      this.container.register(key, classRegistration[lifetime]());
    } else {
      // No args or dependencies - simple class registration
      this.container.register(key, asClass(classConstructor)[lifetime]());
    }
  }

  /**
   * Creates an injection function for dependency injection (without static arguments).
   *
   * @param dependencies - Nested dependencies to inject
   * @returns The injection function
   */
  private createInjectionFunction(args?: JsonValue[], dependencies?: { [key: string]: RegistrationConfig }): (cradle: any) => any {
    return (cradle: any) => {
      const result: any = {};

      // Add dependency injections
      if (dependencies) {
        for (const [depKey, depConfig] of Object.entries(dependencies)) {
          const resolvedKey = depConfig.key ?? this.determineKey(depConfig.target);
          if (resolvedKey) {
            result[depKey] = cradle[resolvedKey];
          }
        }
      }

      return result;
    };
  }

  /**
   * Converts a JSON configuration to a regular registration configuration.
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
      convertedConfig.dependencies = {};
      for (const [key, depConfig] of Object.entries(config.dependencies)) {
        convertedConfig.dependencies[key] = this.convertJsonConfig(depConfig, classRegistry);
      }
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