# Enhanced IoC (Inversion of Control) Library

A powerful, simplified, and feature-rich dependency injection system built on top of Awilix. This library provides significant improvements for class instantiation, nested dependencies, JSON-serializable configuration, and flow-based logging integration.

## 🚀 Key Features

- **✨ Simplified Class Registration** - Clean syntax with constructor arguments
- **📦 JSON-Serializable Configuration** - Store configs in files or databases
- **🔗 Nested Dependencies** - Complex dependency trees made easy  
- **🏭 Factory Functions** - Advanced dependency injection patterns
- **🔄 Lifecycle Management** - Singleton, transient, and scoped instances
- **📁 Dynamic Imports** - Load modules on demand
- **🧪 Testing-Friendly** - Easy mock injection for unit tests
- **⚡ High Performance** - Optimized for speed and memory efficiency

## 📋 Quick Start

### Installation

```bash
npm install awilix
# IoC library is included in this project
```

### Basic Usage

```typescript
import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

// Create container
const container = new IoC();

// Configure dependencies with simplified syntax
const configs: RegistrationConfig[] = [
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO, category: 'APP' }]
  }
];

// Register and resolve
await container.register(configs);
const logger = container.resolve<Logger>('logger');
logger.info('IoC container is ready!');
```

## 🔧 Configuration Options

### RegistrationConfig (TypeScript/Runtime)

```typescript
type RegistrationConfig = {
  key?: string;                              // Dependency key (auto-inferred if not provided)
  target: any;                               // Class constructor, function, value, or string
  type?: 'class' | 'value' | 'function' | 'alias'; // Registration type (default: 'class')
  lifetime?: 'singleton' | 'transient' | 'scoped';  // Lifecycle management (default: 'transient')
  path?: string;                             // Path for dynamic imports
  args?: JsonValue[];                        // Arguments for class constructor
  dependencies?: { [key: string]: RegistrationConfig }; // Nested dependencies
};
```

### JsonRegistrationConfig (JSON/Database Storage)

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

## 📖 Registration Types

### 1. Class Registration with Arguments

**Before (verbose):**
```typescript
{ 
  key: 'logger', 
  target: () => new Logger({ level: LogLevel.INFO, category: 'MAIN' }), 
  type: 'function', 
  lifetime: 'singleton' 
}
```

**After (clean):**
```typescript
{ 
  key: 'logger', 
  target: Logger, 
  type: 'class', 
  lifetime: 'singleton',
  args: [{ level: LogLevel.INFO, category: 'MAIN' }]
}
```

### 2. Multiple Constructor Arguments

```typescript
{
  key: 'dbService',
  target: DatabaseService,
  type: 'class',
  lifetime: 'singleton',
  args: ['postgresql://localhost:5432/mydb', 25, { ssl: true }]
}
```

### 3. Factory Functions for Complex Dependencies

```typescript
{
  key: 'emailService',
  target: (cradle: any) => new EmailService(
    'smtp.gmail.com', 
    587, 
    cradle.logger
  ),
  type: 'function',
  lifetime: 'singleton'
}
```

### 4. Value Registration

```typescript
{
  key: 'config',
  target: {
    apiUrl: 'https://api.example.com',
    timeout: 30000,
    retries: 3
  },
  type: 'value'
}
```

### 5. Alias Registration

```typescript
{
  key: 'primaryLogger',
  target: 'logger',
  type: 'alias'
}
```

### 6. Dynamic Imports

```typescript
{
  key: 'userService',
  target: 'UserService',
  type: 'class',
  path: './services',
  lifetime: 'transient'
}
```

## 🏗️ Advanced Configuration Patterns

### Complex Service with Dependencies

```typescript
class UserService {
  constructor(dependencies: { 
    dbService: DatabaseService; 
    emailService: EmailService; 
    logger: Logger 
  }) {
    // Implementation
  }
}

// Registration using factory function
{
  key: 'userService',
  target: (cradle: any) => new UserService({
    dbService: cradle.dbService,
    emailService: cradle.emailService,
    logger: cradle.logger
  }),
  type: 'function',
  lifetime: 'transient'
}
```

### Nested Dependencies (Planned Feature)

```typescript
{
  key: 'userService',
  target: UserService,
  type: 'class',
  lifetime: 'transient',
  dependencies: {
    dbService: {
      key: 'databaseService',
      target: DatabaseService,
      type: 'class',
      args: ['postgresql://localhost:5432/mydb', 25]
    },
    emailService: {
      key: 'emailService',
      target: EmailService,
      type: 'class'
    }
  }
}
```

## 📦 JSON Configuration

### Basic JSON Configuration

```typescript
// Class registry for JSON configs
const classRegistry: { [key: string]: ClassConstructor } = {
  Logger,
  DatabaseService,
  EmailService,
  UserService
};

// JSON configuration
const jsonConfigs: JsonRegistrationConfig[] = [
  {
    key: 'logger',
    target: 'Logger',
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: 4, category: 'JSON' }]
  },
  {
    key: 'dbService',
    target: 'DatabaseService',
    type: 'class',
    lifetime: 'singleton',
    args: ['mongodb://localhost:27017/jsondb', 15]
  }
];

await container.registerFromJson(jsonConfigs, classRegistry);
```

### File-based Configuration

```typescript
// Save current configuration
await container.saveToJsonFile('./config/ioc-config.json');

// Load configuration from file
await container.loadFromJsonFile('./config/ioc-config.json', classRegistry);
```

### MongoDB Configuration Storage

```typescript
// Store in MongoDB
const mongoConfig = {
  environment: 'production',
  services: [
    {
      key: 'logger',
      target: 'Logger',
      type: 'class',
      lifetime: 'singleton',
      args: [{ level: 1, category: 'PROD' }]
    }
  ]
};

await db.collection('ioc-configs').insertOne(mongoConfig);

// Load from MongoDB
const config = await db.collection('ioc-configs').findOne({ environment: 'production' });
await container.registerFromJson(config.services, classRegistry);
```

## 🔄 Lifecycle Management

### Singleton Pattern
- **Single instance** throughout application lifecycle
- **Shared state** across all consumers
- **Best for**: Services, loggers, configurations, database connections

```typescript
{
  key: 'logger',
  target: Logger,
  type: 'class',
  lifetime: 'singleton',
  args: [{ level: LogLevel.INFO }]
}
```

### Transient Pattern
- **New instance** for each resolution
- **No shared state** between consumers
- **Best for**: Data transfer objects, request handlers, temporary objects

```typescript
{
  key: 'requestHandler',
  target: RequestHandler,
  type: 'class',
  lifetime: 'transient'
}
```

### Scoped Pattern
- **Single instance per scope** (e.g., HTTP request)
- **Shared within scope**, isolated between scopes
- **Best for**: Request-specific services, user sessions

```typescript
{
  key: 'sessionService',
  target: SessionService,
  type: 'class',
  lifetime: 'scoped'
}

// Usage with scopes
const scope = container.createScope();
const sessionService1 = scope.resolve('sessionService');
const sessionService2 = scope.resolve('sessionService');
// sessionService1 === sessionService2 (same scope)
```

## 🧪 Testing Strategies

### Mock Dependencies

```typescript
// Production config
const prodConfigs: RegistrationConfig[] = [
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO }]
  }
];

// Test config with mocks
const testConfigs: RegistrationConfig[] = [
  {
    key: 'logger',
    target: MockLogger, // Mock implementation
    type: 'class',
    lifetime: 'singleton'
  }
];

// Easy switching between configs
const container = new IoC();
await container.register(process.env.NODE_ENV === 'test' ? testConfigs : prodConfigs);
```

### Integration Testing

```typescript
describe('UserService Integration', () => {
  let container: IoC;
  let userService: UserService;

  beforeEach(async () => {
    container = new IoC();
    await container.register([
      { key: 'logger', target: MockLogger, type: 'class', lifetime: 'singleton' },
      { key: 'dbService', target: TestDatabaseService, type: 'class', lifetime: 'singleton' },
      { 
        key: 'userService', 
        target: (cradle: any) => new UserService({
          dbService: cradle.dbService,
          logger: cradle.logger
        }),
        type: 'function',
        lifetime: 'transient'
      }
    ]);
    
    userService = container.resolve<UserService>('userService');
  });

  it('should create user successfully', async () => {
    const result = await userService.createUser('test@example.com', 'Test User');
    expect(result).toBeTruthy();
  });
});
```

## 🛠️ API Reference

### IoC Container Methods

#### `register(configs: RegistrationConfig[]): Promise<void>`
Registers multiple dependencies based on configuration objects.

```typescript
await container.register([
  { key: 'logger', target: Logger, type: 'class', args: [config] }
]);
```

#### `registerFromJson(configs: JsonRegistrationConfig[], classRegistry: ClassRegistry): Promise<void>`
Registers dependencies from JSON configuration using a class registry.

```typescript
await container.registerFromJson(jsonConfigs, { Logger, DatabaseService });
```

#### `resolve<T>(key: string): T`
Resolves a dependency by key with type safety.

```typescript
const logger = container.resolve<Logger>('logger');
const service = container.resolve('userService'); // without type
```

#### `unregister(keys: string[]): void`
Unregisters dependencies by their keys.

```typescript
container.unregister(['temporaryService', 'oldLogger']);
```

#### `isRegistered(key: string): boolean`
Checks if a dependency is registered.

```typescript
if (container.isRegistered('logger')) {
  const logger = container.resolve('logger');
}
```

#### `getRegisteredKeys(): string[]`
Returns all registered dependency keys.

```typescript
const keys = container.getRegisteredKeys();
console.log('Registered services:', keys);
```

#### `createScope(): AwilixContainer`
Creates a new scope for scoped dependencies.

```typescript
const scope = container.createScope();
const scopedService = scope.resolve('sessionService');
```

#### `saveToJsonFile(path: string): Promise<void>`
Saves current configuration to a JSON file.

```typescript
await container.saveToJsonFile('./config/production.json');
```

#### `loadFromJsonFile(path: string, classRegistry: ClassRegistry): Promise<void>`
Loads configuration from a JSON file.

```typescript
await container.loadFromJsonFile('./config/production.json', classRegistry);
```

## 📊 Real-World Examples

### E-Commerce Application

```typescript
// Define services
class PaymentService {
  constructor(private logger: Logger, private config: PaymentConfig) {}
  
  async processPayment(amount: number): Promise<PaymentResult> {
    this.logger.info({
      message: 'Processing payment',
      data: { amount, timestamp: new Date() }
    });
    // Implementation
  }
}

class OrderService {
  constructor(dependencies: {
    paymentService: PaymentService;
    inventoryService: InventoryService;
    emailService: EmailService;
    logger: Logger;
  }) {
    // Implementation
  }
}

// Configuration
const ecommerceConfig: RegistrationConfig[] = [
  // Core services
  {
    key: 'logger',
    target: Logger,
    type: 'class',
    lifetime: 'singleton',
    args: [{ level: LogLevel.INFO, category: 'ECOMMERCE' }]
  },
  
  // Configuration
  {
    key: 'paymentConfig',
    target: {
      apiKey: process.env.PAYMENT_API_KEY,
      timeout: 30000,
      retries: 3
    },
    type: 'value'
  },
  
  // Payment service
  {
    key: 'paymentService',
    target: (cradle: any) => new PaymentService(cradle.logger, cradle.paymentConfig),
    type: 'function',
    lifetime: 'singleton'
  },
  
  // Order service with complex dependencies
  {
    key: 'orderService',
    target: (cradle: any) => new OrderService({
      paymentService: cradle.paymentService,
      inventoryService: cradle.inventoryService,
      emailService: cradle.emailService,
      logger: cradle.logger
    }),
    type: 'function',
    lifetime: 'transient'
  }
];

await container.register(ecommerceConfig);
```

### Microservices Architecture

```typescript
// Service configuration for different environments
const getServiceConfig = (environment: string): RegistrationConfig[] => {
  const baseConfig = [
    {
      key: 'logger',
      target: Logger,
      type: 'class',
      lifetime: 'singleton',
      args: [{ 
        level: environment === 'production' ? LogLevel.ERROR : LogLevel.DEBUG,
        category: 'MICROSERVICE'
      }]
    }
  ];

  if (environment === 'production') {
    return [
      ...baseConfig,
      {
        key: 'dbService',
        target: DatabaseService,
        type: 'class',
        lifetime: 'singleton',
        args: [process.env.PROD_DB_URL, 50]
      }
    ];
  } else {
    return [
      ...baseConfig,
      {
        key: 'dbService',
        target: MockDatabaseService,
        type: 'class',
        lifetime: 'singleton'
      }
    ];
  }
};

await container.register(getServiceConfig(process.env.NODE_ENV));
```

## 🎯 Best Practices

### 1. Naming Conventions
```typescript
// ✅ Good: Descriptive, consistent naming
{ key: 'userAuthenticationService', target: UserAuthService, type: 'class' }
{ key: 'databaseConnectionPool', target: DatabasePool, type: 'class' }

// ❌ Avoid: Vague or inconsistent naming
{ key: 'service1', target: SomeService, type: 'class' }
{ key: 'DB', target: DatabaseService, type: 'class' }
```

### 2. Lifecycle Selection
```typescript
// ✅ Singleton for stateless services
{ key: 'logger', target: Logger, type: 'class', lifetime: 'singleton' }
{ key: 'configService', target: ConfigService, type: 'class', lifetime: 'singleton' }

// ✅ Transient for stateful or request-specific objects
{ key: 'userSession', target: UserSession, type: 'class', lifetime: 'transient' }
{ key: 'requestHandler', target: RequestHandler, type: 'class', lifetime: 'transient' }

// ✅ Scoped for request-scoped services
{ key: 'requestContext', target: RequestContext, type: 'class', lifetime: 'scoped' }
```

### 3. Configuration Organization
```typescript
// ✅ Group related services
const databaseConfigs: RegistrationConfig[] = [
  { key: 'dbConnection', target: DatabaseConnection, type: 'class' },
  { key: 'userRepository', target: UserRepository, type: 'class' },
  { key: 'orderRepository', target: OrderRepository, type: 'class' }
];

const loggerConfigs: RegistrationConfig[] = [
  { key: 'appLogger', target: Logger, type: 'class', args: [{ category: 'APP' }] },
  { key: 'dbLogger', target: Logger, type: 'class', args: [{ category: 'DB' }] }
];

await container.register([...databaseConfigs, ...loggerConfigs]);
```

### 4. Error Handling
```typescript
try {
  await container.register(configs);
  const service = container.resolve<UserService>('userService');
} catch (error) {
  if (error.name === 'AwilixResolutionError') {
    console.error('Dependency resolution failed:', error.message);
    // Handle dependency resolution errors
  } else {
    console.error('Registration failed:', error.message);
    // Handle registration errors
  }
}
```

## 🔗 Migration Guide

### From Function-based Registration

**Old approach:**
```typescript
{
  key: 'logger',
  target: () => new Logger({ level: LogLevel.INFO, category: 'APP' }),
  type: 'function',
  lifetime: 'singleton'
}
```

**New approach:**
```typescript
{
  key: 'logger',
  target: Logger,
  type: 'class',
  lifetime: 'singleton',
  args: [{ level: LogLevel.INFO, category: 'APP' }]
}
```

### From Manual Configuration to JSON

**Step 1: Extract configuration**
```typescript
// Before: Hardcoded
const configs = [
  { key: 'logger', target: Logger, type: 'class', args: [{ level: LogLevel.INFO }] }
];

// After: JSON-ready
const jsonConfigs = [
  { key: 'logger', target: 'Logger', type: 'class', args: [{ level: 4 }] }
];
```

**Step 2: Create class registry**
```typescript
const classRegistry = { Logger, DatabaseService, EmailService };
```

**Step 3: Use JSON configuration**
```typescript
await container.registerFromJson(jsonConfigs, classRegistry);
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Resolution Errors
```
AwilixResolutionError: Could not resolve 'serviceName'
```
**Solutions:**
- Check if the service is registered
- Verify the key name matches exactly
- Ensure all dependencies are registered before the dependent service

#### 2. Circular Dependencies
```
Error: Circular dependency detected
```
**Solutions:**
- Use factory functions to break circular dependencies
- Redesign service architecture to avoid circles
- Use lazy initialization patterns

#### 3. Constructor Argument Issues
```
TypeError: Cannot read properties of undefined
```
**Solutions:**
- Verify `args` array matches constructor signature
- Check if all required dependencies are registered
- Use factory functions for complex constructor patterns

### Debugging Tips

```typescript
// Check registration status
console.log('Registered keys:', container.getRegisteredKeys());
console.log('Is logger registered?', container.isRegistered('logger'));

// Inspect container state
console.log('Container registrations:', container.getContainer().registrations);

// Use try-catch for resolution
try {
  const service = container.resolve('problematicService');
} catch (error) {
  console.error('Resolution failed:', error.message);
  console.error('Available keys:', container.getRegisteredKeys());
}
```

## ⚡ Performance Considerations

- **Lazy Loading**: Dependencies are only instantiated when first resolved
- **Singleton Caching**: Singleton instances are cached for fast subsequent access
- **Memory Optimization**: Transient objects are garbage collected when not in use
- **Resolution Speed**: Direct key-based resolution is O(1) complexity

## 🔮 Future Enhancements

- **Decorator Support**: TypeScript decorators for automatic registration
- **Configuration Validation**: JSON schema validation for configurations
- **Dependency Graphs**: Visual representation of dependency relationships
- **Hot Reloading**: Dynamic reconfiguration without restart
- **Plugin System**: Extensible architecture for custom resolvers

---

## 📚 Additional Resources

- [Awilix Documentation](https://github.com/jeffijoe/awilix)
- [Dependency Injection Patterns](https://martinfowler.com/articles/injection.html)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

**This enhanced IoC library provides a powerful, flexible, and maintainable dependency injection system that scales from simple applications to complex enterprise systems.** 