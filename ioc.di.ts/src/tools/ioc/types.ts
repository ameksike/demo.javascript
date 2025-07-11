import { Lifetime } from 'awilix';

/**
 * Configuration object for registering dependencies.
 */
export type RegistrationConfig = {
  key?: string;                              // The key to register the dependency; if not provided, inferred from class name or string.
  target: any;                               // The target to register: Class, function, value, alias, or string (for dynamic imports).
  type?: 'class' | 'value' | 'function' | 'alias'; // The type of dependency being registered; defaults to 'class'.
  lifetime?: 'singleton' | 'transient' | 'scoped';  // The lifecycle of the dependency; defaults to 'transient'.
  path?: string;                             // Path for dynamic imports if the target is a string.
};

/**
 * IoC container interface - defines the contract for dependency injection containers
 */
export interface IIoC {
  /**
   * Registers dependencies based on the provided configuration objects.
   * @param configs - An array of registration configurations.
   */
  register(configs: RegistrationConfig[]): Promise<void>;

  /**
   * Unregisters dependencies from the container based on their keys.
   * @param keys - An array of keys to unregister.
   */
  unregister(keys: string[]): void;

  /**
   * Resolves a dependency from the container.
   * @param key - The key of the dependency to resolve.
   * @returns The resolved dependency.
   */
  resolve<T>(key: string): T;
  resolve(key: string): any;
} 