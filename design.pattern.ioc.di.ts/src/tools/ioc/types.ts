import { Lifetime } from 'awilix';

/**
 * Represents a value that can be serialized to JSON format.
 */
export type IJSON = string | number | boolean | null | IJSON[] | { [key: string]: IJSON };

/**
 * Class constructor interface with proper typing.
 */
export type IClassConstructor<T = {}> = new (...args: any[]) => T;

/**
 * Function type for dependency injection purposes.
 */
export type IFunction<T = any> = (...args: any[]) => T;

export type IDependencyMap = { [key: string]: IDependency };

export type IDependencyList = IDependency[];

export type IDependencyType = 'class' | 'value' | 'function' | 'method' | 'action' | 'alias' | 'ref' | 'auto';

export type IDependencyLifetime = 'singleton' | 'transient' | 'scoped';

/**
 * Unified dependency configuration interface for all registration scenarios.
 * Supports direct registration, auto-registration, and nested dependencies.
 */
export interface IDependency {
  /**
   * Registration key for the dependency in the container.
   * If not provided, inferred from class name or target.
   */
  key?: string;

  /**
   * Target: class constructor, function, value, or reference key.
   * Optional for auto-registration where target is discovered automatically.
   */
  target?: any;

  /**
   * Regular expression pattern for auto-registration file matching.
   * Defaults to '.*' if not specified.
   */
  regex?: string;

  /**
   * Dependency registration type strategy.
   */
  type?: IDependencyType;

  /**
   * Dependency registration type strategy.
   */
  as?: IDependencyType;

  /**
   * Instance lifecycle management strategy.
   * Controls creation, caching, and reuse behavior.
   */
  lifetime?: IDependencyLifetime;

  /**
   * Directory path for dynamic imports during auto-registration.
   */
  path?: string;

  /**
   * Direct file path for module imports.
   * Takes precedence over path/target combination.
   */
  file?: string;

  /**
   * Static arguments passed to class constructor before dependencies.
   */
  args?: IJSON[];

  /**
   * Nested dependencies injected as object parameter.
   * Supports both array and object format configurations.
   */
  dependencies?: IDependencyList | IDependencyMap;
}

/**
 * IoC container interface defining dependency injection contract.
 */
export interface IIoC {
  /**
   * Registers multiple dependencies from configuration array.
   */
  register(dependencies: IDependency[] | IDependencyMap): Promise<void>;

  /**
   * Unregisters dependencies from container by keys.
   */
  unregister(keys: string[]): void;

  /**
   * Resolves dependency with auto-registration support.
   */
  resolve<T = any>(key: string): Promise<T>;

  /**
   * Resolves dependency synchronously without auto-registration.
   */
  resolveSync<T = any>(key: string): T;

  /**
   * Gets all registered dependency configurations.
   */
  readonly config: IDependency[];
} 