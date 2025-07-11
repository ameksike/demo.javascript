Below is the optimized and updated implementation of the `IoC` class with enhanced readability, support for TypeScript ES modules (`import` for dynamic imports instead of `require`), inclusion of the `type: 'function'` option, and improved performance. It also offers both generic and non-generic options for dependency resolution (`resolve<T>` and `resolve`).

### Implementation: IoC (Inversion of Control)

#### Code
```typescript
import { createContainer, asClass, asValue, asFunction, aliasTo, Lifetime, Container } from 'awilix';

/**
 * Configuration object for registering dependencies.
 */
export type RegistrationConfig = {
  key?: string;          // The key to register the dependency; if not provided, inferred from class name or string.
  target: any;           // The target to register: Class, function, value, alias, or string (for dynamic imports).
  type?: 'class' | 'value' | 'function' | 'alias'; // The type of dependency being registered; defaults to 'class'.
  lifetime?: Lifetime;   // The lifecycle of the dependency ('singleton' or 'transient'); defaults to 'transient'.
  path?: string;         // Path for dynamic imports if the target is a string.
};

/**
 * IoC container wrapper over Awilix to manage dependency registration and resolution.
 */
export class IoC {
  private container: Container;

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
      const { key, target, type = 'class', lifetime = Lifetime.TRANSIENT, path } = config;

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
          this.container.register(dependencyKey, asFunction(target)[lifetime === Lifetime.SINGLETON ? 'singleton' : 'transient']()); // Register a function
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
              asClass(classConstructor)[lifetime === Lifetime.SINGLETON ? 'singleton' : 'transient']() // Register dynamically imported class
            );
          } else if (typeof target === 'function') {
            // Register a class directly
            this.container.register(
              dependencyKey,
              asClass(target)[lifetime === Lifetime.SINGLETON ? 'singleton' : 'transient']()
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
   *
   * @param keys - An array of keys to unregister.
   */
  unregister(keys: string[]): void {
    for (const key of keys) {
      if (!this.container.registrations[key]) {
        throw new Error(`Cannot unregister: Dependency with key "${key}" does not exist.`);
      }
      this.container.unregister(key);
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
```

---

### **Features & Improvements**

1. **Dynamic Imports with ES Modules (`await import`)**:
   - Instead of using `require`, this implementation uses TypeScript's `import()` for dynamic imports, ensuring compatibility with modern TypeScript and ES Modules.

2. **Support for All Awilix Registration Types**:
   - Added support for `type: 'function'`, enabling the registration of functions as dependencies.
   - Defaults `type` to `'class'`, but validates all supported types (`value`, `alias`, `class`, `function`).

3. **Default Key Determination**:
   - Automatically assigns a `key` for the dependency if not explicitly provided:
     - If `target` is a string, uses it directly as the key.
     - If `target` is a class, uses its constructor name.

4. **Optimized Readability**:
   - Refactored the logic for handling different registration types into a clean switch statement.
   - Improved error messages for edge case handling.

5. **Flexible Resolution**:
   - Supports resolving dependencies using either:
     - Generic types: `const logger = manager.resolve<Logger>('logger');`
     - String keys only: `const logger = manager.resolve('logger');`.

6. **Lifetime Defaults**:
   - Defaults `lifetime` to `'transient'` unless overridden in the configuration.

---

### **Usage Example**

#### Dependencies
```typescript
export class Logger {
  log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}

export class Greeter {
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  greet(name: string): string {
    this.logger.log(`Greeting: ${name}`);
    return `Hello, ${name}!`;
  }
}
```

---

#### **Main Application**
```typescript
import { IoC, RegistrationConfig } from './IoC';
import { Logger } from './Logger';

// Define registration configurations
const configs: RegistrationConfig[] = [
  { key: 'logger', target: Logger, lifetime: 'singleton' }, // Class with singleton lifetime
  { target: 'Greeter', lifetime: 'transient', path: './components' }, // Dynamically imported class
  { key: 'myVal', target: 125, type: 'value' }, // Register a value
  { key: 'otherVal', target: 'myVal', type: 'alias' } // Register an alias
];

const manager = new IoC();

// Register dependencies
await manager.register(configs);

// Resolve and use dependencies (generic resolution)
const logger = manager.resolve<Logger>('logger');
logger.log('Resolving dependencies dynamically!');

// Resolve and use dependencies (non-generic resolution)
const greeter = manager.resolve('Greeter');
console.log(greeter.greet('TypeScript User'));
```

---

### **Key Improvements**

1. **Performance Optimization**:
   - Avoid unnecessary computations by using strict type checks (`typeof`) and efficient dynamic imports.
   - Defaults to lightweight registration patterns (`transient`).

2. **Error Handling**:
   - Validates all edge cases (e.g., invalid `type`, missing `path` for dynamic imports).

3. **Flexible Configuration**:
   - Extensible and easy to manage configurations using the structured `RegistrationConfig` type.

---

### **Final Notes**

With this enhanced implementation:
- You can **dynamically register dependencies**, including classes, functions, values, aliases, and dynamically imported modules.
- The **IoC abstraction** simplifies Awilix usage while maintaining all its powerful features.
- Both **generic and non-generic resolutions** are fully supported for convenience in TypeScript.
- The implementation is modular, extensible, and adheres to modern TypeScript and ES module practices.

--- 

### **1. Specifying Custom Constructor Values**
To define custom constructor values for a class when registering a dependency, you can use `Awilix`'s factory mechanism (`asFunction`) or use `.inject()` with `asClass` for more declarative control.

#### **Example: Constructor Injection**
```typescript
import { createContainer, asClass, asFunction } from 'awilix';

class Logger {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  log(message: string): void {
    console.log(`${this.prefix}: ${message}`);
  }
}

const container = createContainer();

// Register Logger with a custom value for its constructor (e.g., the prefix)
container.register({
  logger: asFunction(() => new Logger('CustomPrefix')).singleton(), // Using factory to inject constructor values
});

// Resolve the dependency
const logger = container.resolve<Logger>('logger');
logger.log('Hello, Logger with Custom Prefix!');
```

##### **Notes on `asFunction`**:
- `asFunction` lets you define how the instance is created manually, allowing you to inject custom values.
- Here, we specified a custom prefix for the `Logger`.

---

#### **Example Alternative: Constructor Injection with `.inject()`**
If the class depends on other dependencies while receiving custom parameters, you can use `.inject()` declaratively when registering the dependency.

```typescript
import { createContainer, asClass } from 'awilix';

class Logger {
  constructor(private prefix: string) {}

  log(message: string): void {
    console.log(`${this.prefix}: ${message}`);
  }
}

class Greeter {
  constructor(private logger: Logger) {}

  greet(name: string): void {
    this.logger.log(`Greeting: Hello, ${name}!`);
  }
}

// Create the container
const container = createContainer();

// Register Logger with custom constructor parameters.
container.register({
  logger: asClass(Logger).inject(() => ({ prefix: 'CustomPrefix' })).singleton(), // Declarative injection for constructor parameters
  greeter: asClass(Greeter).singleton(),
});

// Resolve Greeter, which depends on Logger
const greeter = container.resolve<Greeter>('greeter');
greeter.greet('World');
```

#### **Notes on `.inject()`**:
- `.inject()` allows you to provide an object with parameters to the constructor declaratively.
- Awilix automatically resolves other dependencies (e.g., classes) when using `.inject()`.

---

### **2. Manage Hierarchical Dependencies with Depth (3 Levels)**

Hierarchical dependencies involve one class depending on another (Level 1), which depends on yet another (Level 2), and so on. Awilix automatically resolves these dependency hierarchies when registering them.

#### **Example: Hierarchical Dependencies with 3 Levels**
This example involves:
- **Level 1**: `Logger` (root dependency).
- **Level 2**: `Greeter` (depends on `Logger`).
- **Level 3**: `App` (depends on `Greeter`, which depends on `Logger`).

##### **Code: Hierarchical Dependencies**
```typescript
import { createContainer, asClass } from 'awilix';

class Logger {
  constructor(private prefix: string) {}

  log(message: string): void {
    console.log(`${this.prefix}: ${message}`);
  }
}

class Greeter {
  constructor(private logger: Logger) {}

  greet(name: string): string {
    this.logger.log(`Greeting: Hello, ${name}!`);
    return `Hello, ${name}!`;
  }
}

class App {
  constructor(private greeter: Greeter) {}

  run(): void {
    const greeting = this.greeter.greet('Awilix');
    console.log(greeting);
  }
}

// Create the container
const container = createContainer();

// Register hierarchical dependencies
container.register({
  logger: asClass(Logger).inject(() => ({ prefix: 'AppLogger' })).singleton(), // Level 1: Logger with custom values
  greeter: asClass(Greeter).singleton(), // Level 2: Greeter depends on Logger
  app: asClass(App).singleton(), // Level 3: App depends on Greeter
});

// Resolve the top dependency (App) and execute
const app = container.resolve<App>('app');
app.run();
```

##### **Automatic Resolution**
Awilix automatically resolves hierarchical dependencies:
1. `Logger` is created and registered with `prefix: 'AppLogger'`.
2. `Greeter` is created with the resolved instance of `Logger`.
3. `App` is created with the resolved instance of `Greeter`.

Output:
```
AppLogger: Greeting: Hello, Awilix!
Hello, Awilix!
```

---

### **3. Handling Complex Hierarchies with Dynamic Configuration**

If you have multiple hierarchical dependencies, you can handle everything dynamically at runtime using configuration objects.

#### **Dynamic Example**
```typescript
import { createContainer, asClass } from 'awilix';

// Level 1: Logger
class Logger {
  constructor(public prefix: string) {}

  log(message: string): void {
    console.log(`${this.prefix}: ${message}`);
  }
}

// Level 2: Greeter
class Greeter {
  constructor(private logger: Logger) {}
  greet(name: string): string {
    this.logger.log(`Greeting: ${name}`);
    return `Hello, ${name}!`;
  }
}

// Level 3: App
class App {
  constructor(private greeter: Greeter) {}
  run(): void {
    console.log(this.greeter.greet('World'));
  }
}

// Dynamic Configurations
const configs = [
  { key: 'logger', target: Logger, lifetime: 'singleton', args: { prefix: 'DynamicLogger' } },
  { key: 'greeter', target: Greeter, lifetime: 'transient' }, // Depends on Logger
  { key: 'app', target: App, lifetime: 'singleton' }, // Depends on Greeter
];

// Create the container
const container = createContainer();

// Register configurations dynamically
configs.forEach(({ key, target, lifetime, args }) => {
  container.register({
    [key]: asClass(target)
      .inject(() => args || {})
      [lifetime === 'singleton' ? 'singleton' : 'transient'](),
  });
});

// Resolve App and run
const app = container.resolve<App>('app');
app.run();
```

Output:
```
DynamicLogger: Greeting: World
Hello, World!
```

---

### **Summary**

#### Specifying Constructor Values:
1. **Factory (`asFunction`)**:
   - Use a custom factory method to inject values into the constructor.
   - Example: `asFunction(() => new Logger('CustomPrefix')).singleton()`.

2. **Declarative Injection (`.inject()`)**:
   - Use `.inject()` with `asClass()` to pass arguments directly into the constructor.
   - Example: `asClass(Logger).inject(() => ({ prefix: 'CustomPrefix' })).singleton()`.

#### Hierarchical Dependencies:
- Awilix automatically resolves multi-level dependencies when you register classes hierarchically.

#### Dynamic Configuration:
- Use runtime-based configurations to dynamically and efficiently manage complex dependency hierarchies. Provide:
  - `key`: The unique key for the dependency.
  - `target`: The class or factory to register.
  - `lifetime`: Specify whether it should be `singleton` or `transient`.
  - `args` (optional): Custom constructor arguments.

---

## References
- [NPM - Awilix](https://www.npmjs.com/package/awilix)
- [GitHub - Awilix](https://github.com/jeffijoe/awilix)