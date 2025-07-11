import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';
import { BusinessService } from './components/BusinessService';

/**
 * Advanced IoC Demonstration with BusinessService
 * 
 * This demo showcases:
 * - Deep transitive dependency injection
 * - Zero explicit imports in business components
 * - Transient instance management
 * - Alias support for flexible component resolution
 * - Performance monitoring and optimization
 * - Dynamic component loading
 * - Complex business workflows
 */
async function businessServiceDemo(): Promise<void> {
  console.log('🚀 Advanced IoC + BusinessService Demo Starting...\n');
  
  // Create IoC container
  const manager = new IoC();
  
  // Advanced dependency configuration with deep injection and aliases
  const configs: RegistrationConfig[] = [
    // Core loggers with different configurations
    { 
      key: 'mainLogger', 
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
      args: [{ level: LogLevel.DEBUG, category: 'BUSINESS' }]
    },
    { 
      key: 'performanceLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.ALL, category: 'PERFORMANCE' }]
    },
    
    // Logger aliases for different contexts
    { key: 'systemLogger', target: 'mainLogger', type: 'alias' },
    { key: 'auditLogger', target: 'businessLogger', type: 'alias' },
    { key: 'metricsLogger', target: 'performanceLogger', type: 'alias' },
    
    // Core business components with dynamic imports
    { target: 'Calculator', lifetime: 'singleton', path: '../../components' },
    { target: 'Greeter', lifetime: 'transient', path: '../../components' },
    
    // BusinessService instances with different logger configurations
    { 
      key: 'orderProcessingService', 
      target: (cradle: any) => new BusinessService({
        calculator: cradle.Calculator,
        greeter: cradle.Greeter,
        logger: cradle.businessLogger
      }),
      type: 'function',
      lifetime: 'transient'
    },
    { 
      key: 'customerManagementService', 
      target: (cradle: any) => new BusinessService({
        calculator: cradle.Calculator,
        greeter: cradle.Greeter,
        logger: cradle.auditLogger
      }),
      type: 'function',
      lifetime: 'transient'
    },
    { 
      key: 'analyticsService', 
      target: (cradle: any) => new BusinessService({
        calculator: cradle.Calculator,
        greeter: cradle.Greeter,
        logger: cradle.metricsLogger
      }),
      type: 'function',
      lifetime: 'transient'
    },
    
    // Service aliases for different business contexts
    { key: 'orderProcessor', target: 'orderProcessingService', type: 'alias' },
    { key: 'customerService', target: 'customerManagementService', type: 'alias' },
    { key: 'dataAnalytics', target: 'analyticsService', type: 'alias' },
    
    // Configuration objects for different environments
    { 
      key: 'productionConfig', 
      target: { 
        environment: 'production',
        version: '3.0.0',
        features: {
          advancedIoC: true,
          deepDependencyInjection: true,
          aliasSupport: true,
          performanceMonitoring: true,
          zeroImports: true
        },
        performance: {
          maxOperationsPerSecond: 10000,
          timeoutMs: 5000,
          enableMetrics: true
        }
      }, 
      type: 'value' 
    },
    { key: 'config', target: 'productionConfig', type: 'alias' }
  ];
  
  try {
    // Register all dependencies
    console.log('📦 Registering advanced IoC dependencies...');
    await manager.register(configs);
    console.log('✅ All dependencies registered successfully!\n');
    
    // Demonstrate deep dependency injection
    console.log('🏗️ Deep Dependency Injection Demonstration:');
    console.log('  ✓ BusinessService depends on Calculator, Greeter, Logger');
    console.log('  ✓ Zero explicit imports in BusinessService');
    console.log('  ✓ IoC manages all transitive dependencies');
    console.log('  ✓ Lifecycle management (singleton/transient)');
    console.log('  ✓ Dynamic module loading\n');
    
    // Test transient behavior with multiple instances
    console.log('🔄 Testing Transient Instance Management:');
    const service1 = manager.resolve('orderProcessingService') as any;
    const service2 = manager.resolve('orderProcessingService') as any;
    const service3 = manager.resolve('customerManagementService') as any;
    
    console.log(`  Service1 !== Service2: ${service1 !== service2}`);
    console.log(`  Service1 !== Service3: ${service1 !== service3}`);
    console.log(`  All services are unique instances: ${service1 !== service2 && service1 !== service3}\n`);
    
    // Test alias resolution
    console.log('🏷️ Testing Alias Resolution:');
    const orderProcessor = manager.resolve('orderProcessor') as any;
    const customerService = manager.resolve('customerService') as any;
    const dataAnalytics = manager.resolve('dataAnalytics') as any;
    
    console.log(`  OrderProcessor resolved: ${orderProcessor !== undefined}`);
    console.log(`  CustomerService resolved: ${customerService !== undefined}`);
    console.log(`  DataAnalytics resolved: ${dataAnalytics !== undefined}`);
    console.log(`  All aliases work correctly: ${orderProcessor && customerService && dataAnalytics}\n`);
    
    // Process complex business scenarios
    console.log('💼 Complex Business Scenario Testing:');
    
    // Scenario 1: High-volume order processing
    const orderItems = [
      { name: 'Enterprise Software License', quantity: 10, price: 499.99 },
      { name: 'Professional Services', quantity: 40, price: 125.00 },
      { name: 'Training Package', quantity: 5, price: 299.99 }
    ];
    
    const orderResult = orderProcessor.processCustomerOrder('Acme Corporation', orderItems);
    console.log(`\n📦 Enterprise Order Processing:`);
    console.log(`  Customer: ${orderResult.customer}`);
    console.log(`  Items: ${orderResult.itemCount} items`);
    console.log(`  Subtotal: $${orderResult.subtotal.toFixed(2)}`);
    console.log(`  Tax: $${orderResult.tax.toFixed(2)}`);
    console.log(`  Total: $${orderResult.total.toFixed(2)}`);
    console.log(`  Processing Time: ${orderResult.processingTime.toFixed(2)}ms`);
    
    // Scenario 2: Customer feedback analysis
    const feedbackResult = customerService.handleCustomerFeedback(
      'Acme Corporation',
      'Excellent service! The software deployment was smooth and the training was very comprehensive. Our team is already seeing productivity improvements.',
      5
    );
    console.log(`\n💬 Customer Feedback Analysis:`);
    console.log(`  Sentiment: ${feedbackResult.sentiment}`);
    console.log(`  Priority: ${feedbackResult.priority}`);
    console.log(`  Response Time: ${feedbackResult.responseTime.toFixed(2)}ms`);
    
    // Scenario 3: Complete business workflow
    const workflowResult = dataAnalytics.executeBusinessWorkflow(
      'Tech Startup Inc.',
      [{ name: 'Startup Package', quantity: 1, price: 1999.99 }],
      'Great value for money, but could use more documentation.',
      4
    );
    console.log(`\n🔄 Complete Business Workflow:`);
    console.log(`  ${workflowResult.welcome}`);
    console.log(`  Order Total: $${workflowResult.order.total.toFixed(2)}`);
    console.log(`  Feedback Sentiment: ${workflowResult.feedback.sentiment}`);
    console.log(`  ${workflowResult.conclusion}`);
    
    // Performance analytics
    console.log(`\n⚡ Performance Analytics:`);
    const performanceReport = service1.generatePerformanceReport();
    console.log(`  Total Operations: ${performanceReport.totalOperations}`);
    console.log(`  Efficiency: ${performanceReport.efficiency}`);
    console.log(`  Recommendations:`);
    performanceReport.recommendations.forEach((rec: string) => {
      console.log(`    - ${rec}`);
    });
    
    // Service statistics comparison
    console.log(`\n📈 Service Statistics Comparison:`);
    [service1, service2, service3].forEach((service, index) => {
      const stats = service.getServiceStats();
      console.log(`  Service${index + 1}: ${stats.operationCount} operations, last: ${stats.lastOperationTime.toFixed(2)}ms`);
    });
    
    // Logger alias demonstration
    console.log(`\n🔍 Logger Alias Demonstration:`);
    const systemLogger = manager.resolve<Logger>('systemLogger');
    const auditLogger = manager.resolve<Logger>('auditLogger');
    const metricsLogger = manager.resolve<Logger>('metricsLogger');
    
    systemLogger.info('System event logged via alias');
    auditLogger.info('Audit event logged via alias');
    metricsLogger.info('Metrics event logged via alias');
    
    // Configuration resolution
    const config = manager.resolve<any>('config');
    console.log(`\n⚙️ Configuration Resolution:`);
    console.log(`  Environment: ${config.environment}`);
    console.log(`  Version: ${config.version}`);
    console.log(`  Advanced IoC: ${config.features.advancedIoC}`);
    console.log(`  Max Ops/Sec: ${config.performance.maxOperationsPerSecond}`);
    
    // Display all registered dependencies
    console.log(`\n📋 All Registered Dependencies:`);
    const registeredKeys = manager.getRegisteredKeys();
    registeredKeys.forEach(key => {
      console.log(`  ✓ ${key}`);
    });
    
    // Final summary
    console.log(`\n🎯 Advanced IoC Demo Summary:`);
    console.log(`  ✅ Zero explicit imports in BusinessService`);
    console.log(`  ✅ Deep transitive dependency injection`);
    console.log(`  ✅ Transient instance management`);
    console.log(`  ✅ Alias support for flexible resolution`);
    console.log(`  ✅ Performance monitoring and optimization`);
    console.log(`  ✅ Dynamic component loading`);
    console.log(`  ✅ Complex business workflow orchestration`);
    console.log(`  ✅ Maintainable and extensible architecture`);
    
    console.log(`\n🚀 Advanced IoC + BusinessService Demo Completed Successfully!`);
    
  } catch (error) {
    console.error('❌ Error during advanced demo:', error);
  }
}

// Run the advanced demo
businessServiceDemo().catch(console.error); 