# IoC Container with Auto-Registration - TypeScript Demo

A comprehensive TypeScript implementation of an Inversion of Control (IoC) container with advanced auto-registration capabilities, built on top of [Awilix](https://github.com/jeffijoe/awilix).

## 🚀 Key Features

### ✨ **Async Resolution by Default**
- **Primary resolve method is now async**: `await container.resolve<Service>('serviceName')`
- **Synchronous fallback**: `container.resolveSync<Service>('serviceName')` for performance-critical scenarios
- **Auto-registration support**: Automatically loads and registers services when requested

### 🔄 **Smart Auto-Registration**
- **Regex pattern matching**: Define patterns to auto-load services dynamically
- **Default pattern**: Uses `.*` (matches everything) when no regex specified
- **Path-based loading**: Automatically imports from specified directories
- **Dependency injection**: Auto-registered services can have dependencies injected

### ⚡ **Simplified Configuration**
- **Sensible defaults**: Less boilerplate with intelligent defaults
- **Lifecycle management**: Singleton, transient, and scoped lifetimes
- **Type-safe**: Full TypeScript support with generic type resolution

## 📦 Installation

```bash
npm install
npm run build
```

## 🎯 Quick Start

### Basic Usage

```typescript
import { IoC } from './src/tools/ioc';
import { Logger, LogLevel } from './src/tools/log';

const container = new IoC();

// Register services
await container.register([
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO, category: 'APP' }]
  },
     {
     // Auto-registration: no regex specified, defaults to .* (matches everything)
     type: 'auto',
     path: '../../services',
     lifetime: 'singleton',
     dependencies: [
       { target: 'logger', type: 'ref', key: 'logger' }
     ]
   }
]);

// Resolve services (async by default)
const logger = await container.resolve<Logger>('logger');
const userService = await container.resolve<UserService>('UserService'); // Auto-registered!

logger.info('Services resolved successfully');
```

### Auto-Registration Example

```typescript
// Services will be auto-registered when requested
await container.register([
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.DEBUG, category: 'SYSTEM' }]
  },
     {
     regex: 'Data.*',           // Matches DataManager, DataService, etc.
     type: 'auto',
     path: '../../components',
     lifetime: 'singleton',
     dependencies: [
       { target: 'logger', type: 'ref', key: 'logger' }
     ]
   },
   {
     regex: '.*Service',        // Matches UserService, OrderService, etc.
     type: 'auto',
     path: '../../services',
     lifetime: 'transient'
   }
]);

// These will be auto-registered on first resolve
const dataManager = await container.resolve('DataManager');
const userService = await container.resolve('UserService');
const orderService = await container.resolve('OrderService');
```

## 🛠️ Advanced Configuration

### Multiple Auto-Registration Patterns

```typescript
await container.register([
  // Core services
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO, category: 'APP' }]
  },
  
     // Data layer - singletons with logger dependency
   {
     regex: 'Data.*',
     type: 'auto',
     path: '../../data',
     lifetime: 'singleton',
     dependencies: [
       { target: 'logger', type: 'ref', key: 'logger' }
     ]
   },
   
   // Business services - transient instances
   {
     regex: '.*Service',
     type: 'auto',
     path: '../../services',
     lifetime: 'transient',
     dependencies: [
       { target: 'logger', type: 'ref', key: 'logger' }
     ]
   },
   
   // Controllers - scoped instances
   {
     regex: '.*Controller',
     type: 'auto',
     path: '../../controllers',
     lifetime: 'scoped'
   }
]);
```

### Direct File Path Registration

```typescript
await container.register([
     {
     regex: 'Config.*',
     type: 'auto',
     file: '../../config/ConfigManager',  // Direct file path
     lifetime: 'singleton'
   }
]);
```

## 📚 Configuration Options

### ServiceConfig Interface

```typescript
type ServiceConfig = {
  key?: string;                    // Service key (optional, inferred from class name)
  target?: any;                    // Class constructor, value, or function
  regex?: string;                  // Regex pattern for auto-registration (defaults to .*)
  type?: 'class' | 'value' | 'function' | 'alias' | 'ref' | 'auto';
  lifetime?: 'singleton' | 'transient' | 'scoped';
  path?: string;                   // Directory path for auto-registration
  file?: string;                   // Direct file path (takes precedence over path)
  args?: JsonValue[];              // Constructor arguments
  dependencies?: ServiceConfig[];   // Dependency injection configuration
};
```

### Registration Types

| Type | Description | Example |
|------|-------------|---------|
| `class` | Register a class constructor | `{ target: UserService, type: 'class' }` |
| `value` | Register a static value | `{ target: 'production', type: 'value' }` |
| `function` | Register a function | `{ target: () => new Date(), type: 'function' }` |
| `alias` | Create an alias to existing service | `{ target: 'logger', type: 'alias' }` |
| `ref` | Reference to another service | `{ target: 'logger', type: 'ref' }` |
| `auto` | Auto-registration pattern | `{ regex: 'Data.*', type: 'auto', path: './data' }` |

### Lifetime Management

| Lifetime | Description | Behavior |
|----------|-------------|----------|
| `singleton` | Single instance | Same instance returned on every resolve |
| `transient` | New instance each time | New instance created on every resolve |
| `scoped` | Instance per scope | Same instance within a scope |

## 🔄 Auto-Registration Deep Dive

### How Auto-Registration Works

1. **Pattern Matching**: When `resolve()` is called, the container checks if the requested key matches any auto-registration patterns
2. **Dynamic Import**: If a match is found, the service is dynamically imported from the specified path
3. **Dependency Injection**: Dependencies are resolved and injected automatically  
4. **Caching**: Successfully auto-registered services are cached for performance
5. **Fallback**: If auto-registration fails, the original error is thrown

### Auto-Registration Flow

```mermaid
graph TD
    A[resolve('ServiceName')] --> B{Service registered?}
    B -->|Yes| C[Return cached instance]
    B -->|No| D{Auto-registration pattern matches?}
    D -->|Yes| E[Dynamic import from path]
    E --> F[Resolve dependencies]
    F --> G[Register service]
    G --> H[Return new instance]
    D -->|No| I[Throw resolution error]
```

### Default Behavior

- **Default regex**: `.*` (matches everything) when no regex specified
- **Path resolution**: Relative to the IoC container file location
- **Dependency injection**: Supports nested dependency resolution
- **Error handling**: Graceful fallback with detailed error messages

## 🎮 Demo Scripts

Run the included demos to see all features in action:

```bash
# Basic concepts and auto-registration
npm run simple

# Advanced patterns and lifecycle management  
npm run medium

# Expert-level auto-registration and performance
npm run advanced

# Comprehensive showcase of all features
npm run dev

# Logger-specific demonstrations
npm run logger
```

## 📝 Demo Overview

### Simple Demo (`npm run simple`)
- **Level**: ⭐ Beginner
- **Features**: Basic registration, auto-registration, values, functions, aliases
- **Focus**: Core concepts and simplified configuration

### Medium Demo (`npm run medium`)  
- **Level**: ⭐⭐⭐ Intermediate
- **Features**: Multiple lifecycles, factory functions, service maps, JSON export/import
- **Focus**: Advanced patterns and container management

### Advanced Demo (`npm run advanced`)
- **Level**: ⭐⭐⭐⭐ Expert
- **Features**: Regex patterns, auto-registration, performance optimization, caching
- **Focus**: Auto-registration patterns and enterprise features

### Comprehensive Demo (`npm run dev`)
- **Level**: ⭐⭐⭐⭐⭐ Production Ready
- **Features**: All features combined in a real-world scenario
- **Focus**: Complete system integration and best practices

## 🏗️ Architecture

### Core Components

```
src/
├── tools/ioc/
│   ├── IoC.ts              # Main container implementation
│   ├── types.ts            # Type definitions
│   └── index.ts            # Public API
├── tools/log/
│   ├── Logger.ts           # Logging implementation
│   ├── processors/         # Log processors
│   └── types.ts            # Log types
├── components/
│   ├── App.ts              # Sample application
│   ├── BusinessService.ts  # Complex business logic
│   ├── Calculator.ts       # Simple service
│   ├── DataManager.ts      # Data management
│   └── Greeter.ts          # Basic service
└── demo-*.ts               # Demo scripts
```

### Key Classes

- **IoC**: Main container class with auto-registration
- **Logger**: Configurable logging system
- **BusinessService**: Complex service demonstrating deep injection
- **Auto-registered services**: DataManager, Calculator, Greeter, App

## 🔧 Performance Optimizations

### Caching Strategy
- **Auto-registration cache**: Prevents re-processing of failed resolutions
- **Singleton management**: Efficient instance reuse
- **Lazy loading**: Services loaded only when needed

### Best Practices
- **Async by default**: Better performance with async resolution
- **Pattern-based loading**: Efficient service discovery
- **Minimal configuration**: Sensible defaults reduce boilerplate

## 🧪 Testing

The demos serve as comprehensive tests:

```bash
# Run all demos
npm run simple && npm run medium && npm run advanced && npm run dev
```

Expected output includes:
- ✅ Service registration and resolution
- ✅ Auto-registration with pattern matching
- ✅ Dependency injection verification
- ✅ Lifecycle management confirmation
- ✅ Performance metrics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add/update demos to showcase new features
4. Update documentation
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related Projects & Alternatives

### KSDP - Comprehensive Design Patterns Library

For developers seeking a more comprehensive design patterns ecosystem, consider [**KSDP (Ksike Design Patterns)**](https://www.npmjs.com/package/ksdp) - a TypeScript library that provides a complete suite of design patterns including:

- **Integration Patterns**: IoC (Inversion of Control), DI (Dependency Injection), Service Locator, Event-driven Hooks
- **Creational Patterns**: Abstract Factory, Builder, Factory Method, Prototype, Singleton
- **Structural Patterns**: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy
- **Behavioral Patterns**: Chain of Responsibility, Command, Iterator, Mediator, Observer, Strategy, and more

KSDP is part of the larger **Ksike ecosystem** that includes microframeworks, cryptographic libraries, and template engines, making it ideal for building enterprise-scale applications with robust architectural foundations.

```bash
npm install ksdp
```

**When to choose KSDP over this project:**
- Need implementation of GoF, GRASP, and SOLID principles in one package
- Building large-scale enterprise applications requiring multiple design patterns
- Want a battle-tested library with established ecosystem support
- Require additional patterns beyond IoC/DI (Observer, Strategy, Factory, etc.)

**When to choose this IoC Container:**
- Focus specifically on dependency injection and auto-registration
- Want async-first resolution with modern TypeScript features
- Need simplified configuration with intelligent defaults
- Prefer lightweight, focused solutions over comprehensive frameworks

Both approaches are valid - choose based on your project's complexity and architectural requirements.

## 🙏 Acknowledgments

- Built on [Awilix](https://github.com/jeffijoe/awilix) - A powerful IoC container
- Inspired by modern dependency injection patterns and [KSDP](https://www.npmjs.com/package/ksdp) design patterns library
- Designed for TypeScript-first development

---

**Ready to revolutionize your dependency injection? Start with `npm run simple` and explore the power of auto-registration! 🚀** 