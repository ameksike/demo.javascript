# Inversion of Control (IoC) System

This directory contains a modular Inversion of Control system built on top of Awilix for TypeScript.

## 📁 Directory Structure

```
src/tools/ioc/
├── types.ts          # IoC system interfaces and types
├── IoC.ts            # Main IoC class
├── index.ts          # Main module exports
└── README.md         # This documentation
```

## 🔧 Main Components

### 1. **IoC.ts**
The main inversion of control container class that:
- Manages dependency registration (classes, values, functions, aliases)
- Supports dynamic module loading
- Allows different lifecycles (singleton, transient, scoped)
- Provides strongly-typed dependency resolution

### 2. **types.ts**
Defines all interfaces and types:
- `RegistrationConfig`: Configuration for registering dependencies
- `IIoC`: IoC container interface

## 🚀 Basic Usage

```typescript
import { IoC, RegistrationConfig } from '../tools/ioc';

// Create container
const container = new IoC();

// Configure dependencies
const configs: RegistrationConfig[] = [
  { key: 'logger', target: Logger, lifetime: 'singleton' },
  { key: 'database', target: DatabaseService, lifetime: 'transient' }
];

// Register dependencies
await container.register(configs);

// Resolve dependencies
const logger = container.resolve<Logger>('logger');
const db = container.resolve('database');
```

## 🎯 Registration Types

### **Classes**
```typescript
// Direct class registration
{ key: 'service', target: MyService, type: 'class', lifetime: 'singleton' }

// Dynamic class loading
{ target: 'UserService', type: 'class', path: './services', lifetime: 'transient' }
```

### **Values**
```typescript
// Primitive values
{ key: 'apiUrl', target: 'https://api.example.com', type: 'value' }

// Configuration objects
{ key: 'config', target: { port: 3000, debug: true }, type: 'value' }
```

### **Functions**
```typescript
// Factory functions
{ key: 'dateFactory', target: () => new Date(), type: 'function', lifetime: 'transient' }
```

### **Aliases**
```typescript
// Aliases to other dependencies
{ key: 'primaryLogger', target: 'logger', type: 'alias' }
```

## 🔄 Lifecycles

| Lifetime | Description |
|----------|-------------|
| `singleton` | Single instance throughout application lifetime |
| `transient` | New instance on each resolution |
| `scoped` | One instance per scope/context |

## 🏗️ Advanced Features

### **Dynamic Loading**
```typescript
// Load modules dynamically
const configs: RegistrationConfig[] = [
  { target: 'EmailService', path: './services', lifetime: 'singleton' },
  { target: 'PaymentProcessor', path: './processors', lifetime: 'scoped' }
];
```

### **Generic Resolution**
```typescript
// With type safety
const userService = container.resolve<UserService>('userService');

// Without specific types
const emailService = container.resolve('emailService');
```

### **Dependency Management**
```typescript
// Check if registered
if (container.isRegistered('logger')) {
  const logger = container.resolve('logger');
}

// Get all registered keys
const keys = container.getRegisteredKeys();

// Create scope for request-specific dependencies
const scopedContainer = container.createScope();
```

## 📝 Complete Configuration

```typescript
import { IoC, RegistrationConfig } from '../tools/ioc';
import { Logger } from '../tools/log';

const container = new IoC();

const configs: RegistrationConfig[] = [
  // Logger singleton
  { 
    key: 'logger', 
    target: () => new Logger({ level: LogLevel.INFO, category: 'APP' }), 
    type: 'function', 
    lifetime: 'singleton' 
  },
  
  // Dynamically loaded service
  { 
    target: 'UserService', 
    path: './services', 
    lifetime: 'transient' 
  },
  
  // Application configuration
  { 
    key: 'appConfig', 
    target: { 
      port: 3000, 
      database: 'mongodb://localhost:27017/myapp',
      debug: process.env.NODE_ENV === 'development'
    }, 
    type: 'value' 
  },
  
  // Factory function
  { 
    key: 'requestId', 
    target: () => Math.random().toString(36).substring(7), 
    type: 'function', 
    lifetime: 'transient' 
  },
  
  // Alias
  { 
    key: 'primaryLogger', 
    target: 'logger', 
    type: 'alias' 
  }
];

await container.register(configs);
```

## 🛠️ Available Methods

### **Registration**
- `register(configs)` - Register multiple dependencies
- `unregister(keys)` - Unregister dependencies by key

### **Resolution**
- `resolve<T>(key)` - Resolve dependency with type
- `resolve(key)` - Resolve dependency without specific type

### **Utilities**
- `isRegistered(key)` - Check if a key is registered
- `getRegisteredKeys()` - Get all registered keys
- `getContainer()` - Access underlying Awilix container
- `createScope()` - Create a scoped container

## 🎪 Available Demos

- `npm run dev` - Basic IoC demo with logger
- `npm run advanced` - Advanced demo with multiple features

## 🏆 Benefits

1. **Decoupling**: Reduces direct dependencies between classes
2. **Testability**: Easy mock injection for testing
3. **Flexibility**: Dynamic implementation switching
4. **Modularity**: Dynamic module loading
5. **Configuration**: Centralized dependency management
6. **Typing**: Type safety with TypeScript 