import { Lifetime } from 'awilix';

/**
 * Represents a value that can be serialized to JSON
 */
export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

/**
 * Unified service configuration for dependency injection.
 * This type serves all registration scenarios including:
 * - Direct service registration
 * - JSON-serializable configuration
 * - Nested dependency configuration
 * - Auto-registration patterns
 */
export type ServiceConfig = {
  key?: string;                              // The key to register the dependency; if not provided, inferred from class name or string
  target?: any;                              // The target: Class, function, value, alias, string, or reference key (optional for auto-registration)
  regex?: string;                            // Regular expression pattern for auto-registration (used with type: 'auto')
  type?: 'class' | 'value' | 'function' | 'alias' | 'ref' | 'auto'; // The type of dependency being registered; defaults to 'class'
  lifetime?: 'singleton' | 'transient' | 'scoped';  // The lifecycle of the dependency; defaults to 'transient'
  path?: string;                             // Path for dynamic imports if the target is a string
  file?: string;                             // Direct file path for module imports (takes precedence over path/target combination)
  args?: JsonValue[];                        // Arguments to pass to class constructor when type is 'class'
  dependencies?: ServiceConfig[] | { [key: string]: ServiceConfig }; // Nested dependencies as array or object
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
   * @param configs - An array of JSON-serializable service configurations
   * @param classRegistry - Registry of class constructors for JSON config (optional)
   */
  registerFromJson(configs: ServiceConfig[], classRegistry?: { [key: string]: ClassConstructor }): Promise<void>;

  /**
   * Unregisters dependencies from the container based on their keys.
   * @param keys - An array of keys to unregister.
   */
  unregister(keys: string[]): void;

  /**
   * Resolves a dependency from the container with auto-registration support.
   * If the dependency is not found, attempts to auto-register it using regex patterns.
   * @param key - The key of the dependency to resolve.
   * @returns The resolved dependency.
   */
  resolve<T>(key: string): Promise<T>;
  resolve(key: string): Promise<any>;

  /**
   * Resolves a dependency from the container synchronously without auto-registration.
   * @param key - The key of the dependency to resolve.
   * @returns The resolved dependency.
   */
  resolveSync<T>(key: string): T;
  resolveSync(key: string): any;

  /**
   * @deprecated Use resolve() instead. This method is kept for backward compatibility.
   */
  resolveAsync<T>(key: string): Promise<T>;
  resolveAsync(key: string): Promise<any>;

  /**
   * Exports current container configuration to JSON format
   * @returns Array of service configurations
   */
  exportToJson(): ServiceConfig[];
} 