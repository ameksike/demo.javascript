# Inversion of Control (IoC) Demo with TypeScript

This project demonstrates an Inversion of Control (IoC) container implementation using TypeScript and Awilix, which allows dynamic loading of components and static classes.

## 🚀 Features

- **Dynamic Loading**: Imports and registers classes dynamically from files
- **Dependency Injection**: Automatically resolves dependencies between classes
- **Multiple Registration Types**: Supports classes, values, functions, and aliases
- **Lifecycle Management**: Controls whether instances are singleton or transient
- **Full TypeScript**: Strong typing and generics for enhanced safety

## 📦 Project Structure

```
kozen/
├── src/
│   ├── components/
│   │   ├── Greeter.ts      # Class for dynamic loading
│   │   └── Calculator.ts   # Additional example class
│   ├── tools/
│   │   ├── ioc/            # IoC container implementation
│   │   └── log/            # Logging system implementation
│   ├── index.ts            # Main application
│   └── advanced-demo.ts    # Advanced demo with more features
├── doc/
│   └── ioc.md             # Detailed documentation
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

## 🔧 Configuration

### RegistrationConfig

```typescript
type RegistrationConfig = {
  key?: string;                    // Registration key (optional)
  target: any;                     // Target to register
  type?: 'class' | 'value' | 'function' | 'alias';  // Registration type
  lifetime?: 'singleton' | 'transient' | 'scoped';  // Lifecycle
  path?: string;                   // Path for dynamic imports
};
```

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

## 📚 Dependencies

- **awilix**: Dependency injection container
- **typescript**: TypeScript compiler
- **ts-node**: TypeScript executor for development

## 🤝 Contribution

This is a demonstration project. Improvements and suggestions are welcome.

## 📄 License

MIT License 