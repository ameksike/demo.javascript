import { Lifetime } from 'awilix';

/**
 * Represents a value that can be serialized to JSON
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Unified service configuration for dependency injection.
 * Used for both main service registration and nested dependency configuration.
 * 
 * This unified type simplifies the concept by eliminating redundancy between
 * DependencyConfig and RegistrationConfig, which had identical structures.
 */
export type ServiceConfig = {
  key?: string;                              // The key to register the dependency; if not provided, inferred from class name or string
  target: any;                               // The target: Class, function, value, alias, string, or reference key
  type?: 'class' | 'value' | 'function' | 'alias' | 'ref'; // The type of dependency being registered; defaults to 'class'
  lifetime?: 'singleton' | 'transient' | 'scoped';  // The lifecycle of the dependency; defaults to 'transient'
  path?: string;                             // Path for dynamic imports if the target is a string
  file?: string;                             // Direct file path for module imports (takes precedence over path/target combination)
  args?: JsonValue[];                        // Arguments to pass to class constructor when type is 'class'
  dependencies?: ServiceConfig[];            // Nested dependencies as array
};

/**
 * @deprecated Use ServiceConfig instead. This type is kept for backward compatibility.
 * Will be removed in a future version.
 */
export type RegistrationConfig = ServiceConfig;

/**
 * @deprecated Use ServiceConfig instead. This type is kept for backward compatibility.
 * Will be removed in a future version.
 */
export type DependencyConfig = ServiceConfig;

/**
 * Enhanced registration configuration for JSON serialization
 * This version uses string references for targets to make it JSON-serializable
 */
export type JsonRegistrationConfig = {
  key?: string;                              // The key to register the dependency
  target: string;                            // String reference to the class/function/value
  type?: 'class' | 'value' | 'function' | 'alias'; // The type of dependency being registered
  lifetime?: 'singleton' | 'transient' | 'scoped';  // The lifecycle of the dependency
  path?: string;                             // Path for dynamic imports
  file?: string;                             // Direct file path for module imports (takes precedence over path/target combination)
  args?: JsonValue[];                        // Arguments to pass to class constructor
  dependencies?: { [key: string]: JsonRegistrationConfig }; // Nested dependencies
};

/**
 * Class constructor type with proper typing
 */
export type ClassConstructor<T = {}> = new (...args: any[]) => T;

/**
 * Function type for dependency injection
 */
export type DependencyFunction<T = any> = (...args: any[]) => T;

/**
 * IoC container interface - defines the contract for dependency injection containers
 */
export interface IIoC {
  /**
   * Registers dependencies based on the provided configuration objects.
   * @param configs - An array of service configurations.
   */
  register(configs: ServiceConfig[]): Promise<void>;

  /**
   * Registers dependencies from JSON configuration
   * @param configs - An array of JSON-serializable registration configurations
   * @param classRegistry - Registry of class constructors for JSON config
   */
  registerFromJson(configs: JsonRegistrationConfig[], classRegistry: { [key: string]: ClassConstructor }): Promise<void>;

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