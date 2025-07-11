import { createContainer, asClass, asValue, asFunction, aliasTo, Lifetime, AwilixContainer } from 'awilix';
import { RegistrationConfig, IIoC } from './types';

/**
 * IoC container wrapper over Awilix to manage dependency registration and resolution.
 */
export class IoC implements IIoC {
  private container: AwilixContainer;

  constructor() {
    this.container = createContainer();
  }

  /**
   * Registers dependencies based on the provided configuration objects.
   *
   * @param configs - An array of registration configurations.
   */
  async register(configs: RegistrationConfig[]): Promise<void> {
    for (const config of configs) {
      const { key, target, type = 'class', lifetime = 'transient', path } = config;

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
          if (typeof target === 'string') {
            // Dynamic import
            if (!path) {
              throw new Error(`Path is required for dynamic imports when target is a string ('${target}').`);
            }
            const modulePath = `${path}/${target}`; // Resolve the module path
            const importedModule = await import(modulePath); // Dynamic import using ES modules
            const classConstructor = Object.values(importedModule)[0]; // Assume the first exported entity is the class
            this.container.register(
              dependencyKey,
              asClass(classConstructor as any)[lifetime]() // Register dynamically imported class
            );
          } else if (typeof target === 'function') {
            // Register a class directly
            this.container.register(
              dependencyKey,
              asClass(target)[lifetime]()
            );
          } else {
            throw new Error(`Invalid target for type 'class' for key '${dependencyKey}'. Must be a class or string for dynamic import.`);
          }
          break;

        default:
          throw new Error(`Unsupported type '${type}' for dependency registration.`);
      }
    }
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