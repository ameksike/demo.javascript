import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel, LoggerConfig } from './tools/log';

/**
 * Main application demonstrating the IoC container capabilities.
 */
async function main(): Promise<void> {
  console.log('🚀 Starting IoC Demo...\n');

  // Create IoC container
  const manager = new IoC();

  // Define registration configurations
  const configs: RegistrationConfig[] = [
    { key: 'logger', target: () => new Logger({ level: LogLevel.INFO, category: 'MAIN' }), type: 'function', lifetime: 'singleton' }, // Logger factory with INFO level
    { target: 'Greeter', lifetime: 'transient', path: '../../components' }, // Dynamically imported class
    { target: 'Calculator', lifetime: 'singleton', path: '../../components' }, // Another dynamically imported class
    { key: 'myVal', target: 125, type: 'value' }, // Register a value
    { key: 'otherVal', target: 'myVal', type: 'alias' }, // Register an alias
    { key: 'greetingFunction', target: function(name: string) { return `Hello, ${name}!`; }, type: 'value' }, // Register a function as value
    { key: 'mathConstants', target: { PI: 3.14159, E: 2.71828 }, type: 'value' } // Register an object
  ];

  try {
    // Register dependencies
    console.log('📦 Registering dependencies...');
    await manager.register(configs);
    console.log('✅ Dependencies registered successfully!\n');

    // Resolve and use dependencies (generic resolution)
    console.log('🔍 Resolving dependencies...');
    const logger = manager.resolve<Logger>('logger');
    logger.info('Dependencies resolved successfully!');

    // Resolve and use the dynamically imported class
    const greeter = manager.resolve('Greeter') as any;
    console.log(greeter.greet('TypeScript User'));
    console.log(greeter.welcome('Developer'));
    console.log(greeter.farewell('Demo User'));

    // Resolve and use values
    const myValue = manager.resolve<number>('myVal');
    console.log(`\n📊 Resolved value: ${myValue}`);

    const aliasedValue = manager.resolve<number>('otherVal');
    console.log(`📊 Resolved aliased value: ${aliasedValue}`);

    // Resolve and use function
    const greetingFunc = manager.resolve<(name: string) => string>('greetingFunction');
    console.log(`🎉 ${greetingFunc('Function')}`);

    // Resolve and use the Calculator class
    const calculator = manager.resolve('Calculator') as any;
    console.log(`\n🧮 Calculator Demo:`);
    console.log(`  ${calculator.add(10, 5)}`);
    console.log(`  ${calculator.subtract(10, 3)}`);
    console.log(`  ${calculator.multiply(4, 7)}`);
    console.log(`  ${calculator.divide(15, 3)}`);

    // Resolve and use object value
    const mathConstants = manager.resolve<{ PI: number; E: number }>('mathConstants');
    console.log(`\n📐 Math Constants: PI = ${mathConstants.PI}, E = ${mathConstants.E}`);

    // Demonstrate singleton behavior
    const logger2 = manager.resolve<Logger>('logger');
    console.log(`\n🔗 Same logger instance? ${logger === logger2}`);

    // Demonstrate transient behavior
    const greeter2 = manager.resolve('Greeter') as any;
    console.log(`🔗 Same greeter instance? ${greeter === greeter2}`);

    // Demonstrate singleton behavior with Calculator
    const calculator2 = manager.resolve('Calculator') as any;
    console.log(`🔗 Same calculator instance? ${calculator === calculator2}`);

    console.log('\n🎯 Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during demo:', error);
  }
}

// Run the demo
main().catch(console.error);
