import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel, LoggerConfig } from './tools/log';
import { BusinessService } from './components/BusinessService';

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
    
    // ✨ NEW: Business logger with specific configuration
    { 
      key: 'businessLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.INFO, category: 'BUSINESS' }]
    },
    
    // ✨ ALIAS DEMO: Create aliases for different contexts
    { key: 'mainLogger', target: 'logger', type: 'alias' },
    { key: 'systemLogger', target: 'debugLogger', type: 'alias' },
    { key: 'primaryLogger', target: 'businessLogger', type: 'alias' },
    
    // Dynamically imported classes with enhanced configuration
    { target: 'Greeter', lifetime: 'transient', path: '../../components' },
    { target: 'Calculator', lifetime: 'singleton', path: '../../components' },
    
    // ✨ NEW: BusinessService with transient lifecycle and complex dependencies
    { 
      key: 'businessService', 
      target: (cradle: any) => new BusinessService({
        calculator: cradle.Calculator,
        greeter: cradle.Greeter,
        logger: cradle.businessLogger
      }),
      type: 'function',
      lifetime: 'transient'
    },
    
    // ✨ NEW: BusinessService alias for different contexts
    { key: 'orderProcessor', target: 'businessService', type: 'alias' },
    { key: 'customerService', target: 'businessService', type: 'alias' },
    
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

    // ✨ NEW: Demonstrate BusinessService with deep dependency injection
    console.log('\n🏢 Testing Advanced BusinessService (Transient + Deep Dependencies)...');
    
    // Create multiple instances to demonstrate transient behavior
    const businessService1 = manager.resolve('businessService') as any;
    const businessService2 = manager.resolve('businessService') as any;
    
    console.log(`BusinessService instances different? ${businessService1 !== businessService2}`);
    
    // Test aliases for BusinessService
    const orderProcessor = manager.resolve('orderProcessor') as any;
    const customerService = manager.resolve('customerService') as any;
    
    console.log(`\n📊 Alias Resolution Test:`);
    console.log(`  OrderProcessor resolved: ${orderProcessor !== undefined}`);
    console.log(`  CustomerService resolved: ${customerService !== undefined}`);
    console.log(`  Both are different instances: ${orderProcessor !== customerService}`);
    
    // Process a sample customer order
    const orderItems = [
      { name: 'Premium Widget', quantity: 2, price: 29.99 },
      { name: 'Standard Tool', quantity: 1, price: 15.50 },
      { name: 'Deluxe Package', quantity: 3, price: 45.00 }
    ];
    
    const orderResult = businessService1.processCustomerOrder('Alice Johnson', orderItems);
    console.log(`\n📦 Order Processing Result:`);
    console.log(`  Customer: ${orderResult.customer}`);
    console.log(`  Items: ${orderResult.itemCount} items`);
    console.log(`  Subtotal: $${orderResult.subtotal.toFixed(2)}`);
    console.log(`  Tax: $${orderResult.tax.toFixed(2)}`);
    console.log(`  Total: $${orderResult.total.toFixed(2)}`);
    console.log(`  Processing Time: ${orderResult.processingTime.toFixed(2)}ms`);
    
    // Test feedback processing
    const feedbackResult = businessService1.handleCustomerFeedback(
      'Alice Johnson', 
      'Great service and fast delivery! Very satisfied with my purchase.',
      5
    );
    console.log(`\n💬 Feedback Processing Result:`);
    console.log(`  Sentiment: ${feedbackResult.sentiment}`);
    console.log(`  Priority: ${feedbackResult.priority}`);
    console.log(`  Response Time: ${feedbackResult.responseTime.toFixed(2)}ms`);
    
    // Execute complete business workflow
    const workflowResult = businessService2.executeBusinessWorkflow(
      'Bob Smith',
      [{ name: 'Ultimate Product', quantity: 1, price: 99.99 }],
      'Could be better, but acceptable quality.',
      3
    );
    console.log(`\n🔄 Complete Workflow Result:`);
    console.log(`  ${workflowResult.welcome}`);
    console.log(`  Order Total: $${workflowResult.order.total.toFixed(2)}`);
    console.log(`  Feedback Sentiment: ${workflowResult.feedback.sentiment}`);
    console.log(`  ${workflowResult.conclusion}`);
    
    // Demonstrate logger alias usage
    console.log('\n🏷️ Testing Logger Aliases...');
    const mainLogger = manager.resolve<Logger>('mainLogger');
    const systemLogger = manager.resolve<Logger>('systemLogger');
    const primaryLogger = manager.resolve<Logger>('primaryLogger');
    
    mainLogger.info('Message from main logger alias');
    systemLogger.debug('Debug message from system logger alias');
    primaryLogger.info('Business message from primary logger alias');
    
    // Performance comparison
    console.log('\n⚡ Performance Comparison:');
    const performanceReport = businessService1.generatePerformanceReport();
    console.log(`  Total Operations: ${performanceReport.totalOperations}`);
    console.log(`  Efficiency: ${performanceReport.efficiency}`);
    console.log(`  Recommendations: ${performanceReport.recommendations.join(', ')}`);
    
    // Service statistics
    const stats = businessService1.getServiceStats();
    console.log(`\n📈 Service Statistics:`);
    console.log(`  Operations Count: ${stats.operationCount}`);
    console.log(`  Last Operation Time: ${stats.lastOperationTime.toFixed(2)}ms`);
    console.log(`  Status: ${stats.status}`);

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
    console.log('  ✅ Deep transitive dependency injection');
    console.log('  ✅ Alias support for flexible component resolution');
    console.log('  ✅ Transient instances with zero explicit imports');
    console.log('  ✅ Performance monitoring and optimization');
    
    console.log('\n🎯 Enhanced IoC demo completed successfully!');
    console.log('\n📊 Comparison - Old vs New Patterns:');
    console.log('❌ Old: { key: "logger", target: () => new Logger(...), type: "function" }');
    console.log('✅ New: { key: "logger", target: Logger, type: "class", args: [...] }');
    console.log('❌ Old: Manual import and instantiation');
    console.log('✅ New: Zero imports, IoC manages all dependencies');
    console.log('❌ Old: Tight coupling between components');
    console.log('✅ New: Loose coupling with transitive dependency injection');

  } catch (error) {
    console.error('❌ Error during enhanced demo:', error);
  }
}

// Run the enhanced demo
main().catch(console.error);
