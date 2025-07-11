import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel, LoggerConfig } from './tools/log';

/**
 * Main application demonstrating the enhanced IoC container capabilities.
 */
async function main(): Promise<void> {
  console.log('🚀 Starting Enhanced IoC Demo...\n');

  // Create IoC container
  const manager = new IoC();

  // Enhanced registration configurations with new simplified syntax
  const configs: RegistrationConfig[] = [
    // ✨ NEW: Simplified logger registration with args instead of functions
    { 
      key: 'logger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.INFO, category: 'MAIN' }]
    },
    
    // ✨ NEW: Additional loggers with different configurations
    { 
      key: 'debugLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.DEBUG, category: 'DEBUG' }]
    },
    
    { 
      key: 'errorLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.ERROR, category: 'ERRORS' }]
    },
    
    // Dynamically imported classes (unchanged)
    { target: 'Greeter', lifetime: 'transient', path: '../../components' },
    { target: 'Calculator', lifetime: 'singleton', path: '../../components' },
    
    // Values and aliases (unchanged)
    { key: 'myVal', target: 125, type: 'value' },
    { key: 'otherVal', target: 'myVal', type: 'alias' },
    { key: 'greetingFunction', target: function(name: string) { return `Hello, ${name}!`; }, type: 'value' },
    { key: 'mathConstants', target: { PI: 3.14159, E: 2.71828 }, type: 'value' },
    
    // ✨ NEW: Enhanced configuration objects
    { 
      key: 'appConfig', 
      target: { 
        version: '2.0.0',
        environment: 'development',
        features: {
          enhancedLogging: true,
          jsonConfiguration: true,
          nestedDependencies: true
        },
        database: {
          host: 'localhost',
          port: 5432,
          name: 'enhanced_app'
        }
      }, 
      type: 'value' 
    }
  ];

  try {
    // Register dependencies
    console.log('📦 Registering enhanced dependencies...');
    await manager.register(configs);
    console.log('✅ Enhanced dependencies registered successfully!\n');

    // Demonstrate enhanced logging capabilities
    console.log('🔍 Testing Enhanced Logging...');
    const logger = manager.resolve<Logger>('logger');
    const debugLogger = manager.resolve<Logger>('debugLogger');
    const errorLogger = manager.resolve<Logger>('errorLogger');
    
    logger.info({
      message: 'Enhanced IoC system initialized',
      data: { timestamp: new Date().toISOString(), version: '2.0.0' }
    });
    
    debugLogger.debug({
      message: 'Debug logging active',
      data: { level: 'DEBUG', category: 'SYSTEM' }
    });
    
    errorLogger.error({
      message: 'Error logging configured',
      data: { severity: 'HIGH', module: 'IoC' }
    });

    // Resolve and use the dynamically imported classes
    console.log('\n🎭 Testing Dynamic Imports...');
    const greeter = manager.resolve('Greeter') as any;
    console.log(greeter.greet('Enhanced TypeScript User'));
    console.log(greeter.welcome('Advanced Developer'));
    console.log(greeter.farewell('IoC Demo User'));

    // Resolve and use values
    console.log('\n📊 Testing Value Resolution...');
    const myValue = manager.resolve<number>('myVal');
    console.log(`Resolved value: ${myValue}`);

    const aliasedValue = manager.resolve<number>('otherVal');
    console.log(`Resolved aliased value: ${aliasedValue}`);

    // Resolve and use function
    const greetingFunc = manager.resolve<(name: string) => string>('greetingFunction');
    console.log(`🎉 ${greetingFunc('Enhanced Function')}`);

    // Resolve and use the Calculator class
    console.log('\n🧮 Testing Calculator...');
    const calculator = manager.resolve('Calculator') as any;
    console.log(`  ${calculator.add(15, 25)}`);
    console.log(`  ${calculator.subtract(50, 23)}`);
    console.log(`  ${calculator.multiply(6, 9)}`);
    console.log(`  ${calculator.divide(144, 12)}`);

    // Resolve and use enhanced configuration
    console.log('\n⚙️ Testing Enhanced Configuration...');
    const appConfig = manager.resolve<any>('appConfig');
    console.log(`App Version: ${appConfig.version}`);
    console.log(`Environment: ${appConfig.environment}`);
    console.log(`Enhanced Logging: ${appConfig.features.enhancedLogging}`);
    console.log(`Database: ${appConfig.database.host}:${appConfig.database.port}/${appConfig.database.name}`);

    // Resolve and use object value
    const mathConstants = manager.resolve<{ PI: number; E: number }>('mathConstants');
    console.log(`\n📐 Math Constants: PI = ${mathConstants.PI}, E = ${mathConstants.E}`);

    // Demonstrate singleton behavior
    console.log('\n🔗 Testing Singleton Behavior...');
    const logger2 = manager.resolve<Logger>('logger');
    console.log(`Same logger instance? ${logger === logger2}`);

    // Demonstrate transient behavior
    const greeter2 = manager.resolve('Greeter') as any;
    console.log(`Same greeter instance? ${greeter === greeter2}`);

    // Demonstrate singleton behavior with Calculator
    const calculator2 = manager.resolve('Calculator') as any;
    console.log(`Same calculator instance? ${calculator === calculator2}`);

    // Show registered dependencies
    console.log('\n📋 Registered Dependencies:');
    const registeredKeys = manager.getRegisteredKeys();
    registeredKeys.forEach(key => {
      console.log(`  ✓ ${key}`);
    });

    // Demonstrate new capabilities summary
    console.log('\n🌟 Enhanced IoC Capabilities Demonstrated:');
    console.log('  ✅ Simplified class registration with args[]');
    console.log('  ✅ Multiple logger instances with different configurations');
    console.log('  ✅ Enhanced flow-based logging structure');
    console.log('  ✅ Complex configuration objects');
    console.log('  ✅ Backward compatibility with existing code');
    console.log('  ✅ Dynamic imports and lifecycle management');
    console.log('  ✅ Type-safe dependency resolution');
    
    console.log('\n🎯 Enhanced IoC demo completed successfully!');
    console.log('\n📊 Comparison - Old vs New Logger Registration:');
    console.log('❌ Old: { key: "logger", target: () => new Logger(...), type: "function" }');
    console.log('✅ New: { key: "logger", target: Logger, type: "class", args: [...] }');

  } catch (error) {
    console.error('❌ Error during enhanced demo:', error);
  }
}

// Run the enhanced demo
main().catch(console.error);
