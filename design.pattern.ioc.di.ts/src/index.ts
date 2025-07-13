import { IoC } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

/**
 * Main IoC Demo - Comprehensive Dependency Injection Showcase
 * 
 * This demonstration showcases the complete IoC container capabilities:
 * - Basic and advanced dependency injection patterns
 * - Auto-registration with simplified configuration  
 * - Multiple lifecycle management
 * - Complex business logic orchestration
 * - Performance optimizations
 * 
 * This serves as the entry point and comprehensive example of all IoC features.
 */
(async function main(): Promise<void> {
  console.log('🚀 Comprehensive IoC Demo - Full Feature Showcase\n');

  try {
    // Create master IoC container
    const manager = new IoC();

    /**
     * FEATURE 1: Basic Setup with Auto-Registration
     */
    console.log('📦 Setting up IoC Container with Auto-Registration:');

    await manager.register([
      // Logger configuration
      {
        key: 'logger',
        target: Logger,
        type: 'class',
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'MAIN' }]
      },
      // Auto-registration for all components (default regex: .*)
      {
        type: 'auto',
        path: '../../components',
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    console.log('✅ IoC Container configured with auto-registration\n');

    /**
     * FEATURE 2: Component Resolution and Testing
     */
    console.log('🔍 Resolving and Testing Components:');

    // Auto-resolve components
    const greeter = await manager.resolve('Greeter') as any;
    const calculator = await manager.resolve('Calculator') as any;

    console.log('✅ Components auto-registered and resolved:');
    console.log(`  - Greeter: ${greeter.greet('IoC World')}`);
    console.log(`  - Calculator: 15 + 25 = ${calculator.add(15, 25)}`);

    // Register aliases and App with proper dependencies
    await manager.register([
      // Create alias for Awilix implicit dependency injection
      { key: 'greeter', target: 'Greeter', type: 'alias' },
      { key: 'myalias', target: 'Greeter', type: 'alias' },
      {
        key: 'app',
        target: 'App',
        type: 'class',
        path: '../../components',
        lifetime: 'singleton'
        // App uses Awilix implicit dependency injection - 'greeter' will be auto-resolved
      }
    ]);

    const app = await manager.resolve('app') as any;
    console.log(`  - App: Ready to run`);
    app.run();

    /**
     * FEATURE 3: Business Service Integration
     */
    console.log('\n🏢 Business Service Integration:');

    // Register business services with complex dependencies
    await manager.register([
      {
        key: 'businessService',
        target: 'BusinessService',
        type: 'class',
        path: '../../components',
        lifetime: 'transient',
        dependencies: [
          { target: 'Calculator', type: 'ref', key: 'calculator' },
          { target: 'Greeter', type: 'ref', key: 'greeter' },
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    const businessService = await manager.resolve('businessService') as any;

    // Execute comprehensive business workflow
    const workflowResult = businessService.executeBusinessWorkflow(
      'Alice Johnson',
      [
        { name: 'Laptop', quantity: 1, price: 1200 },
        { name: 'Mouse', quantity: 2, price: 25 },
        { name: 'Keyboard', quantity: 1, price: 75 }
      ],
      'Great products and fast delivery!',
      5
    );

    console.log('✅ Business Workflow Results:');
    console.log(`  - Welcome: ${workflowResult.welcome}`);
    console.log(`  - Total: $${workflowResult.order.total.toFixed(2)}`);
    console.log(`  - Feedback: ${workflowResult.feedback.sentiment} (${workflowResult.feedback.priority} priority)`);

    /**
     * FEATURE 4: Factory Functions and Values
     */
    console.log('\n🏭 Factory Functions and Configuration:');

    await manager.register([
      { key: 'appName', target: 'Comprehensive IoC Demo', type: 'value' },
      { key: 'version', target: '2.0.0', type: 'value' },
      { key: 'environment', target: 'production', type: 'value' },
      {
        key: 'timestampFactory',
        target: () => new Date().toISOString(),
        type: 'value'
      }
    ]);

    const appName = await manager.resolve<string>('appName');
    const version = await manager.resolve<string>('version');
    const environment = await manager.resolve<string>('environment');
    const timestampFactory = await manager.resolve<(() => string)>('timestampFactory');

    console.log('✅ Configuration resolved:');
    console.log(`  - App: ${appName} v${version}`);
    console.log(`  - Environment: ${environment}`);
    console.log(`  - Timestamp: ${timestampFactory()}`);

    /**
     * FEATURE 5: Performance and Lifecycle Demo
     */
    console.log('\n⚡ Performance and Lifecycle Demo:');

    // Test singleton behavior
    const greeter2 = await manager.resolve('Greeter') as any;
    const myalias3 = await manager.resolve('myalias') as any;
    const calculator2 = await manager.resolve('Calculator') as any;

    console.log('✅ Singleton behavior verified:');
    console.log(`  - Same Greeter instance: ${greeter === greeter2 && greeter2 === myalias3}`);
    console.log(`  - Same Calculator instance: ${calculator === calculator2}`);
    console.log(`  - Same Greeter alias instance: ${myalias3.greet('!A!') === greeter.greet('!A!') && myalias3.greet('!A!') === 'Hello, !A!!'}`);

    

    // Test transient behavior
    const businessService1 = await manager.resolve('businessService') as any;
    const businessService2 = await manager.resolve('businessService') as any;

    console.log(`  - Different BusinessService instances: ${businessService1 !== businessService2}`);

    /**
     * FEATURE 6: Container Introspection
     */
    console.log('\n🔍 Container Introspection:');

    const registeredKeys = manager.getRegisteredKeys();
    console.log(`✅ Total registered services: ${registeredKeys.length}`);
    console.log('✅ Registered services:');
    registeredKeys.forEach(key => console.log(`  - ${key}`));

    /**
     * Summary and Conclusion
     */
    console.log('\n🎯 Comprehensive Demo Summary:');
    console.log('  ✅ Auto-registration with default patterns (.*)')
    console.log('  ✅ Async resolution by default for better performance');
    console.log('  ✅ Complex business workflow orchestration');
    console.log('  ✅ Multiple lifecycle management (singleton, transient)');
    console.log('  ✅ Factory functions and configuration values');
    console.log('  ✅ Container introspection and monitoring');
    console.log('  ✅ Simplified configuration with sensible defaults');

    console.log('\n🏆 Comprehensive IoC Demo completed successfully!');
    console.log('💡 The IoC container provides a powerful, flexible foundation for dependency injection.');
    console.log('🚀 Ready for production use with enterprise-grade features.');

  } catch (error) {
    console.error('❌ Error during comprehensive demo:', error);
    process.exit(1);
  }
})();
