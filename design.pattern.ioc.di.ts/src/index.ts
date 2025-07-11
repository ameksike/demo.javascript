import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel, LoggerConfig } from './tools/log';

/**
 * Main IoC Demo - Enhanced Dependency Injection System
 * 
 * This demo demonstrates the core IoC container capabilities:
 * - Multiple logger configurations with different levels
 * - Dynamic imports and component registration
 * - Lifecycle management (singleton vs transient)
 * - Value resolution and function registration
 * - Alias support for flexible resolution
 * - Complex configuration objects
 * - BusinessService with JSON-serializable dependency injection
 * 
 * Complexity Level: ⭐⭐⭐ (Advanced - Main Application)
 */
(async function main(): Promise<void> {
  console.log('🚀 Enhanced IoC Demo - Main Application\n');

  try {
    // Create IoC container
    const manager = new IoC();

    /**
     * Enhanced configuration with multiple loggers, components, and business services
     */
    const configs: RegistrationConfig[] = [
      // Core loggers with different configurations
      { 
        key: 'logger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'MAIN' }]
      },
      
      { 
        key: 'businessLogger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'BUSINESS' }]
      },
      
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
      
      // Logger aliases for different contexts
      { key: 'mainLogger', target: 'logger', type: 'alias' },
      { key: 'systemLogger', target: 'debugLogger', type: 'alias' },
      { key: 'primaryLogger', target: 'businessLogger', type: 'alias' },
      
      // Core components with explicit keys for reference
      { 
        key: 'Greeter',
        target: 'Greeter', 
        type: 'class', 
        lifetime: 'transient', 
        path: '../../components',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      
      { 
        key: 'Calculator',
        target: 'Calculator', 
        type: 'class', 
        lifetime: 'singleton', 
        path: '../../components',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      
      // BusinessService with JSON-serializable dependency injection
      { 
        key: 'businessService', 
        target: 'BusinessService',
        type: 'class',
        lifetime: 'transient',
        path: '../../components',
        dependencies: [
          { target: 'Calculator', type: 'ref', key: 'calculator' },
          { target: 'Greeter', type: 'ref', key: 'greeter' },
          { target: 'businessLogger', type: 'ref', key: 'logger' }
        ]
      },
      
      // BusinessService aliases for different contexts
      { key: 'orderProcessor', target: 'businessService', type: 'alias' },
      { key: 'customerService', target: 'businessService', type: 'alias' },
      
      // Value registrations
      { key: 'myVal', target: 125, type: 'value' },
      { key: 'otherVal', target: 'myVal', type: 'alias' },
      { key: 'greetingFunction', target: function(name: string) { return `Hello, ${name}!`; }, type: 'value' },
      { key: 'mathConstants', target: { PI: 3.14159, E: 2.71828 }, type: 'value' },
      
      // Enhanced configuration objects
      { 
        key: 'appConfig', 
        target: { 
          version: '2.0.0',
          environment: 'development',
          features: {
            enhancedLogging: true,
            jsonConfiguration: true,
            nestedDependencies: true,
            aliasSupport: true
          },
          database: {
            host: 'localhost',
            port: 5432,
            name: 'enhanced_app'
          },
          performance: {
            maxConcurrentServices: 50,
            serviceTimeout: 15000
          }
        }, 
        type: 'value' 
      }
    ];

    /**
     * Register all dependencies
     */
    console.log('📦 Registering enhanced dependencies...');
    await manager.register(configs);
    console.log('✅ Enhanced dependencies registered successfully!\n');

    /**
     * Test enhanced logging capabilities
     */
    console.log('🔍 Testing Enhanced Logging:');
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

    /**
     * Test dynamic imports and component resolution
     */
    console.log('\n🎭 Testing Dynamic Imports:');
    const greeter = manager.resolve('Greeter') as any;
    console.log(`  ${greeter.greet('Enhanced TypeScript User')}`);
    console.log(`  ${greeter.welcome('Advanced Developer')}`);
    console.log(`  ${greeter.farewell('IoC Demo User')}`);

    /**
     * Test value resolution and aliases
     */
    console.log('\n📊 Testing Value Resolution:');
    const myValue = manager.resolve<number>('myVal');
    console.log(`  Resolved value: ${myValue}`);

    const aliasedValue = manager.resolve<number>('otherVal');
    console.log(`  Resolved aliased value: ${aliasedValue}`);

    // Test function resolution
    const greetingFunc = manager.resolve<(name: string) => string>('greetingFunction');
    console.log(`  🎉 ${greetingFunc('Enhanced Function')}`);

    /**
     * Test Calculator component
     */
    console.log('\n🧮 Testing Calculator:');
    const calculator = manager.resolve('Calculator') as any;
    console.log(`  Addition: ${calculator.add(15, 25)}`);
    console.log(`  Subtraction: ${calculator.subtract(50, 23)}`);
    console.log(`  Multiplication: ${calculator.multiply(6, 9)}`);
    console.log(`  Division: ${calculator.divide(144, 12)}`);

    /**
     * Test enhanced configuration resolution
     */
    console.log('\n⚙️ Testing Enhanced Configuration:');
    const appConfig = manager.resolve<any>('appConfig');
    console.log(`  App Version: ${appConfig.version}`);
    console.log(`  Environment: ${appConfig.environment}`);
    console.log(`  Enhanced Logging: ${appConfig.features.enhancedLogging}`);
    console.log(`  Alias Support: ${appConfig.features.aliasSupport}`);
    console.log(`  Database: ${appConfig.database.host}:${appConfig.database.port}/${appConfig.database.name}`);
    console.log(`  Max Services: ${appConfig.performance.maxConcurrentServices}`);

    /**
     * Test math constants resolution
     */
    const mathConstants = manager.resolve<{ PI: number; E: number }>('mathConstants');
    console.log(`\n📐 Math Constants: PI = ${mathConstants.PI}, E = ${mathConstants.E}`);

    /**
     * Test lifecycle behaviors
     */
    console.log('\n🔗 Testing Lifecycle Behaviors:');
    
    // Singleton behavior
    const logger2 = manager.resolve<Logger>('logger');
    console.log(`  Same logger instance (singleton): ${logger === logger2}`);

    // Transient behavior
    const greeter2 = manager.resolve('Greeter') as any;
    console.log(`  Different greeter instances (transient): ${greeter !== greeter2}`);

    // Singleton behavior with Calculator
    const calculator2 = manager.resolve('Calculator') as any;
    console.log(`  Same calculator instance (singleton): ${calculator === calculator2}`);

    /**
     * Test BusinessService with deep dependency injection
     */
    console.log('\n🏢 Testing Advanced BusinessService:');
    
    // Create multiple instances to demonstrate transient behavior
    const businessService1 = manager.resolve('businessService') as any;
    const businessService2 = manager.resolve('businessService') as any;
    
    console.log(`  Different BusinessService instances (transient): ${businessService1 !== businessService2}`);
    
    // Test aliases for BusinessService
    const orderProcessor = manager.resolve('orderProcessor') as any;
    const customerService = manager.resolve('customerService') as any;
    
    console.log(`\n📊 Alias Resolution Test:`);
    console.log(`  OrderProcessor resolved: ${orderProcessor !== undefined}`);
    console.log(`  CustomerService resolved: ${customerService !== undefined}`);
    console.log(`  Both are different instances: ${orderProcessor !== customerService}`);
    
    /**
     * Test comprehensive business operations
     */
    console.log('\n💼 Testing Business Operations:');
    
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

    /**
     * Test logger alias usage
     */
    console.log('\n🏷️ Testing Logger Aliases:');
    const mainLogger = manager.resolve<Logger>('mainLogger');
    const systemLogger = manager.resolve<Logger>('systemLogger');
    const primaryLogger = manager.resolve<Logger>('primaryLogger');
    
    mainLogger.info('✅ Message from main logger alias');
    systemLogger.debug('✅ Debug message from system logger alias');
    primaryLogger.info('✅ Business message from primary logger alias');
    
    /**
     * Performance analysis and service statistics
     */
    console.log('\n⚡ Performance Analysis:');
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

    /**
     * Container introspection
     */
    console.log('\n📋 Container Information:');
    const registeredKeys = manager.getRegisteredKeys();
    console.log(`  Total registered dependencies: ${registeredKeys.length}`);
    
    const serviceKeys = registeredKeys.filter(key => key.toLowerCase().includes('service'));
    const loggerKeys = registeredKeys.filter(key => key.toLowerCase().includes('logger'));
    const aliasKeys = registeredKeys.filter(key => ['orderProcessor', 'customerService', 'mainLogger', 'systemLogger', 'primaryLogger', 'otherVal'].includes(key));
    
    console.log(`  Business Services: ${serviceKeys.length}`);
    console.log(`  Logger Instances: ${loggerKeys.length}`);
    console.log(`  Aliases: ${aliasKeys.length}`);
    
    console.log('\n  All Registered Keys:');
    registeredKeys.forEach(key => {
      console.log(`    ✓ ${key}`);
    });

    /**
     * Summary of capabilities demonstrated
     */
    console.log('\n🌟 Enhanced IoC Capabilities Summary:');
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
    console.log('  ✅ JSON-serializable dependency injection');
    
    console.log('\n📊 Configuration Pattern Comparison:');
    console.log('  ❌ Old: { key: "logger", target: () => new Logger(...), type: "function" }');
    console.log('  ✅ New: { key: "logger", target: Logger, type: "class", args: [...] }');
    console.log('  ❌ Old: Factory functions (not JSON-serializable)');
    console.log('  ✅ New: Reference syntax { target: "Calculator", type: "ref" }');
    console.log('  ❌ Old: Manual import and instantiation');
    console.log('  ✅ New: Zero imports, IoC manages all dependencies');
    console.log('  ❌ Old: Tight coupling between components');
    console.log('  ✅ New: Loose coupling with transitive dependency injection');
    console.log('  🎯 ACHIEVEMENT: Complete JSON/MongoDB serializable configuration!');
    
    console.log('\n✅ Enhanced IoC Demo completed successfully!');
    console.log('🎉 All IoC features working correctly with production-ready patterns!');

  } catch (error) {
    console.error('❌ Error during enhanced demo:', error);
    process.exit(1);
  }
})();
