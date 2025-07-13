# Inversion of Control (IoC) Demo with TypeScript

This project demonstrates an Inversion of Control (IoC) container implementation using TypeScript and Awilix, which allows dynamic loading of components and static classes.

## 🚀 Features

- **Dynamic Loading**: Imports and registers classes dynamically from files
- **Dependency Injection**: Automatically resolves dependencies between classes
- **Multiple Registration Types**: Supports classes, values, functions, and aliases
- **Lifecycle Management**: Controls whether instances are singleton or transient
- **Full TypeScript**: Strong typing and generics for enhanced safety
- **Advanced IoC Patterns**: Zero explicit imports, deep transitive dependency injection
- **Alias Support**: Flexible component resolution with context-specific aliases
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Complex Business Workflows**: Comprehensive business logic orchestration
- **✨ Direct File Imports**: New `file` property for direct module imports
- **🎯 Enhanced Module Resolution**: Default export priority with intelligent fallbacks
- **📦 Unified Configuration**: Simplified `ServiceConfig` type for all service definitions

## 📦 Project Structure

```
kozen/
├── src/
│   ├── components/
│   │   ├── Greeter.ts          # Class for dynamic loading
│   │   ├── Calculator.ts       # Mathematical operations component
│   │   └── BusinessService.ts  # Advanced IoC demonstration component
│   ├── tools/
│   │   ├── ioc/                # IoC container implementation
│   │   └── log/                # Logging system implementation
│   ├── index.ts                # Enhanced main application with BusinessService
│   ├── advanced-demo.ts        # Advanced demo with more features
│   └── business-service-demo.ts # Comprehensive BusinessService demo
├── doc/
│   ├── ioc.md                  # IoC container documentation
│   └── advanced-ioc-patterns.md # Advanced IoC patterns documentation
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run the demo:
```bash
npm start
```

Or run directly in development mode:
```bash
npm run dev
```

To run the advanced demo:
```bash
npm run advanced
```

To run the logging system demo:
```bash
npm run logger
```

To run the categories demo:
```bash
npm run categories
```

To run the log processors demo:
```bash
npm run processors
```

To run the enhanced BusinessService demo:
```bash
npm run business
```

To run the comprehensive advanced BusinessService demo:
```bash
npm run advanced-business
```

## 💡 How It Works

### 1. Dependency Registration

The IoC container allows registering different types of dependencies:

```typescript
const configs: RegistrationConfig[] = [
  // Class with singleton lifecycle
  { key: 'logger', target: Logger, lifetime: 'singleton' },
  
  // Dynamically loaded class with transient lifecycle
  { target: 'Greeter', lifetime: 'transient', path: './components' },
  
  // Another dynamically loaded class with singleton lifecycle
  { target: 'Calculator', lifetime: 'singleton', path: './components' },
  
  // Primitive value
  { key: 'myVal', target: 125, type: 'value' },
  
  // Alias to another registration
  { key: 'otherVal', target: 'myVal', type: 'alias' },
  
  // Function registered as value
  { key: 'greetingFunction', target: function(name: string) { return `Hello, ${name}!`; }, type: 'value' },
  
  // Object with constants
  { key: 'mathConstants', target: { PI: 3.14159, E: 2.71828 }, type: 'value' }
];
```

### 2. Dependency Resolution

Resolves dependencies with strong typing:

```typescript
// Resolution with generics
const logger = manager.resolve<Logger>('logger');

// Resolution without generics
const greeter = manager.resolve('Greeter');
```

### 3. Automatic Injection

Classes automatically receive their dependencies:

```typescript
export class Greeter {
  private logger: Logger;
  
  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }
  
  greet(name: string): string {
    this.logger.log(`Greeting: ${name}`);
    return `Hello, ${name}!`;
  }
}
```

## ✨ New Features

### Direct File Imports

The new `file` property allows direct module imports, giving you more control over how modules are resolved:

```typescript
const configs: ServiceConfig[] = [
  // Traditional path/target approach
  { 
    key: 'greeter1',
    target: 'Greeter',
    type: 'class',
    path: './components'
  },
  
  // ✨ NEW: Direct file import (takes precedence over path/target)
  { 
    key: 'greeter2',
    target: 'Greeter',
    type: 'class',
    file: './components/Greeter' // Direct file path
  }
];
```

### Enhanced Module Resolution

The module resolution now follows a priority system:

1. **Default Export** (highest priority)
2. **Named Export** matching target name
3. **First Available Export** (fallback)

This ensures more reliable module imports and better compatibility with different export patterns.

### Unified ServiceConfig Type

The `ServiceConfig` type now unifies what were previously separate `RegistrationConfig` and `DependencyConfig` types:

```typescript
type ServiceConfig = {
  key?: string;                    // Registration key (optional)
  target: any;                     // Target to register
  type?: 'class' | 'value' | 'function' | 'alias' | 'ref';  // Registration type
  lifetime?: 'singleton' | 'transient' | 'scoped';  // Lifecycle
  path?: string;                   // Path for dynamic imports
  file?: string;                   // ✨ NEW: Direct file path (takes precedence)
  args?: JsonValue[];              // Arguments for class constructors
  dependencies?: ServiceConfig[];  // Nested dependencies
};
```

## 🔧 Configuration

### ServiceConfig (Unified Type)

```typescript
type ServiceConfig = {
  key?: string;                    // Registration key (optional)
  target: any;                     // Target to register
  type?: 'class' | 'value' | 'function' | 'alias' | 'ref';  // Registration type
  lifetime?: 'singleton' | 'transient' | 'scoped';  // Lifecycle
  path?: string;                   // Path for dynamic imports
  file?: string;                   // ✨ Direct file path (takes precedence over path/target)
  args?: JsonValue[];              // Arguments for class constructors
  dependencies?: ServiceConfig[];  // Nested dependencies
};
```

**Note**: `RegistrationConfig` and `DependencyConfig` are still available for backward compatibility but are deprecated. Use `ServiceConfig` for new code.

### Registration Types

- **class**: Register a class (direct or by dynamic import)
- **value**: Register a primitive value or object
- **function**: Register a function
- **alias**: Create an alias to another existing registration

### Lifecycles

- **singleton**: Single instance throughout application lifetime
- **transient**: New instance each time it's resolved
- **scoped**: One instance per scope/context (useful for web requests)

## 🎯 Usage Example

The `src/index.ts` file contains a complete demo that shows:

1. Registration of multiple dependency types (classes, values, functions, aliases)
2. Resolution with and without generics
3. Demonstration of singleton vs transient lifecycles
4. Usage of dynamically loaded classes (Greeter, Calculator)
5. Registration of functions and objects as values
6. Demonstration of aliases between registrations
7. Error handling and validations

## 🏢 Advanced BusinessService Component

The `BusinessService` component demonstrates advanced IoC patterns with:

### Key Features
- **Zero Explicit Imports**: No need for manual imports, IoC manages all dependencies
- **Deep Transitive Dependency Injection**: Automatic resolution of complex dependency trees
- **Transient Instance Management**: New instances for optimal performance and isolation
- **Alias Support**: Multiple aliases for different business contexts
- **Performance Monitoring**: Built-in performance tracking and optimization
- **Complex Business Logic**: Comprehensive workflows combining multiple services

### Example Usage

```typescript
// Configuration with zero imports needed in BusinessService
const configs: RegistrationConfig[] = [
  // Multiple logger configurations
  { key: 'businessLogger', target: Logger, type: 'class', lifetime: 'singleton',
    args: [{ level: LogLevel.DEBUG, category: 'BUSINESS' }] },
  
  // Core components
  { target: 'Calculator', lifetime: 'singleton', path: '../../components' },
  { target: 'Greeter', lifetime: 'transient', path: '../../components' },
  { target: 'BusinessService', lifetime: 'transient', path: '../../components' },
  
  // Advanced factory function for dependency injection
  { 
    key: 'orderProcessor', 
    target: (cradle: any) => new (cradle.BusinessService)({
      calculator: cradle.Calculator,
      greeter: cradle.Greeter,
      logger: cradle.businessLogger
    }),
    type: 'function',
    lifetime: 'transient'
  },
  
  // Aliases for different business contexts
  { key: 'customerService', target: 'orderProcessor', type: 'alias' }
];

// Usage - completely decoupled from implementation
const businessService = container.resolve('orderProcessor');
const result = businessService.processCustomerOrder('John Doe', orderItems);
```

### Business Logic Examples

- **Order Processing**: Complex multi-step order workflows with calculations and logging
- **Customer Feedback**: Sentiment analysis with priority scoring
- **Performance Analytics**: Real-time performance monitoring and optimization recommendations
- **Complete Workflows**: End-to-end business processes combining multiple services

See `doc/advanced-ioc-patterns.md` for detailed documentation and examples.

## 📚 Dependencies

- **awilix**: Dependency injection container
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript executor for development

## 🤝 Contribution

This is a demonstration project. Improvements and suggestions are welcome.

## 📄 License

MIT License 