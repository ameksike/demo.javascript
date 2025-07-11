# Enhanced IoC (Inversion of Control) Library

This enhanced IoC library provides a simplified and more powerful dependency injection system built on top of Awilix, with significant improvements for class instantiation, nested dependencies, and JSON-serializable configuration.

## 🚀 Key Improvements

### 1. **Simplified Class Registration**
**Before (verbose):**
```typescript
const configs: RegistrationConfig[] = [
  { 
    key: 'logger', 
    target: () => new Logger({ level: LogLevel.INFO, category: 'MAIN' }), 
    type: 'function', 
    lifetime: 'singleton' 
  }
];
```

**After (clean):**
```typescript
const configs: RegistrationConfig[] = [
  { 
    key: 'logger', 
    target: Logger, 
    type: 'class', 
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO, category: 'MAIN' }]
  }
];
```

### 2. **JSON-Serializable Configuration**
Perfect for storing configurations in JSON files or MongoDB:
```typescript
const jsonConfig: JsonRegistrationConfig[] = [
  {
    key: 'logger',
    target: 'Logger',
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: 4, category: 'APP' }]
  }
];
```

### 3. **Nested Dependencies**
Easily define complex dependency trees:
```typescript
const config: RegistrationConfig = {
  key: 'userService',
  target: UserService,
  type: 'class',
  lifetime: 'transient',
  dependencies: {
    dbService: {
      key: 'databaseService',
      target: DatabaseService,
      type: 'class'
    },
    emailService: {
      key: 'emailService',
      target: EmailService,
      type: 'class'
    },
    logger: {
      key: 'logger',
      target: Logger,
      type: 'class'
    }
  }
};
```

## 📋 Configuration Options

### RegistrationConfig
```typescript
type RegistrationConfig = {
  key?: string;                              // Dependency key (auto-inferred if not provided)
  target: any;                               // Class constructor, function, value, or string
  type?: 'class' | 'value' | 'function' | 'alias'; // Registration type
  lifetime?: 'singleton' | 'transient' | 'scoped';  // Lifecycle management
  path?: string;                             // Path for dynamic imports
  args?: JsonValue[];                        // Arguments for class constructor
  dependencies?: { [key: string]: RegistrationConfig }; // Nested dependencies
};
```

### JsonRegistrationConfig
```typescript
type JsonRegistrationConfig = {
  key?: string;                              // Dependency key
  target: string;                            // String reference to class/function
  type?: 'class' | 'value' | 'function' | 'alias'; // Registration type
  lifetime?: 'singleton' | 'transient' | 'scoped';  // Lifecycle management
  path?: string;                             // Path for dynamic imports
  args?: JsonValue[];                        // Arguments for class constructor
  dependencies?: { [key: string]: JsonRegistrationConfig }; // Nested dependencies
};
```

## 🔧 Usage Examples

### Basic Usage
```typescript
import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

const container = new IoC();

const configs: RegistrationConfig[] = [
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO, category: 'APP' }]
  }
];

await container.register(configs);
const logger = container.resolve<Logger>('logger');
```

### JSON Configuration
```typescript
import { IoC, JsonRegistrationConfig, ClassConstructor } from './tools/ioc';

const container = new IoC();

// Class registry for JSON configuration
const classRegistry: { [key: string]: ClassConstructor } = {
  Logger,
  DatabaseService,
  EmailService
};

// JSON configuration
const jsonConfigs: JsonRegistrationConfig[] = [
  {
    key: 'logger',
    target: 'Logger',
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: 4, category: 'JSON' }]
  }
];

await container.registerFromJson(jsonConfigs, classRegistry);
```

### File-based Configuration
```typescript
// Save configuration to file
await container.saveToJsonFile('./config/ioc-config.json');

// Load configuration from file
await container.loadFromJsonFile('./config/ioc-config.json', classRegistry);
```

## 🏗️ Architecture Benefits

### 1. **Separation of Concerns**
- Configuration is separate from implementation
- Easy to switch between different configurations
- Testable with mock configurations

### 2. **Scalability**
- Supports complex dependency trees
- Efficient memory management with lifecycle control
- Scoped dependencies for request-level isolation

### 3. **Maintainability**
- Clear, declarative configuration
- Type-safe dependency resolution
- Easy to understand and modify

### 4. **Storage Flexibility**
- JSON-serializable for file storage
- Compatible with databases (MongoDB, etc.)
- Environment-specific configurations

## 🔄 Lifecycle Management

### Singleton
- Single instance throughout application lifecycle
- Shared state across all consumers
- Best for services, loggers, configuration

### Transient
- New instance for each resolution
- No shared state
- Best for data transfer objects, handlers

### Scoped
- Single instance per scope (e.g., HTTP request)
- Shared within scope, isolated between scopes
- Best for request-specific services

## 🧪 Testing

The enhanced IoC library makes testing easier:

```typescript
// Test with mock dependencies
const testConfigs: RegistrationConfig[] = [
  {
    key: 'logger',
    target: MockLogger,
    type: 'class',
    lifetime: 'singleton'
  }
];

await testContainer.register(testConfigs);
```

## 📦 MongoDB Integration Example

```typescript
// Store configuration in MongoDB
const mongoConfig = {
  services: [
    {
      key: 'logger',
      target: 'Logger',
      type: 'class',
      lifetime: 'singleton',
      args: [{ level: 4, category: 'PROD' }]
    }
  ]
};

// Save to MongoDB
await db.collection('ioc-configs').insertOne(mongoConfig);

// Load from MongoDB
const config = await db.collection('ioc-configs').findOne();
await container.registerFromJson(config.services, classRegistry);
```

## 🎯 Best Practices

1. **Use descriptive keys** for better debugging
2. **Prefer singleton** for stateless services
3. **Use scoped** for request-specific data
4. **Group related dependencies** using nested configuration
5. **Store configurations** in version control
6. **Use class registries** for JSON configurations
7. **Test with mock dependencies** for unit testing

## 🔗 Migration Guide

### From Function-based to Class-based Registration

**Old:**
```typescript
{ key: 'service', target: () => new Service(arg1, arg2), type: 'function' }
```

**New:**
```typescript
{ key: 'service', target: Service, type: 'class', args: [arg1, arg2] }
```

### From Manual to JSON Configuration

**Old:**
```typescript
const configs = [
  { key: 'logger', target: Logger, type: 'class', args: [config] }
];
```

**New:**
```typescript
const jsonConfigs = [
  { key: 'logger', target: 'Logger', type: 'class', args: [config] }
];
await container.registerFromJson(jsonConfigs, { Logger });
```

## 🚀 Performance Improvements

- **Lazy loading** of dependencies
- **Efficient caching** for singleton instances
- **Minimal memory footprint** with proper lifecycle management
- **Fast resolution** using optimized container structure

This enhanced IoC library provides a powerful, flexible, and maintainable dependency injection system that scales from simple applications to complex enterprise systems. 