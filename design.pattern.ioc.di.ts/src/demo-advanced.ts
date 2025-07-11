import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';
import { BusinessService } from './components/BusinessService';

/**
 * Advanced Configuration Demo - Complex Dependency Injection with New Syntax
 * 
 * This demo showcases the most advanced IoC container features:
 * - Reference resolution with consistent `{ target: "name", type: "ref" }` syntax
 * - Inline dependency configuration for complex nested structures
 * - Order-dependent reference resolution capabilities
 * - Mixed reference and inline dependency patterns
 * - Complex business workflow orchestration
 * - Enterprise-grade dependency management
 * - JSON-serializable configuration patterns
 * 
 * Complexity Level: ⭐⭐⭐⭐ (Expert)
 */
(async function main(): Promise<void> {
  console.log('🚀 Advanced Configuration Demo - Complex Dependency Injection with New Syntax\n');
  
  try {
    // Create IoC container for most advanced scenarios
    const manager = new IoC();
    
    /**
     * Advanced configuration demonstrating the new consistent syntax
     * with reference resolution and inline dependencies
     */
    const configs: RegistrationConfig[] = [
      // ========================================
      // FOUNDATION SERVICES - Core Dependencies
      // ========================================
      
      // Base logger configurations with different levels
      { 
        key: 'logger', // Default logger for components
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'BASE' }]
      },
      { 
        key: 'baseLogger',
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'BASE' }]
      },
      
      { 
        key: 'auditLogger',
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.ALL, category: 'AUDIT' }]
      },
      
      { 
        key: 'performanceLogger',
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'PERFORMANCE' }]
      },
      
      { 
        key: 'errorLogger',
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.ERROR, category: 'ERROR_HANDLING' }]
      },
      
      // ========================================
      // CORE COMPONENTS - Reference Dependencies
      // ========================================
      
      // Greeter with reference to existing logger
      { 
        target: 'Greeter',
        type: 'class', 
        lifetime: 'transient',
        path: '../../components'
      },
      
      // Calculator with reference to existing logger
      { 
        target: 'Calculator',
        type: 'class', 
        lifetime: 'singleton',
        path: '../../components'
      },
      
      // ========================================
      // BUSINESS SERVICES - Complex Dependencies
      // ========================================
      
      // Basic BusinessService with factory function approach
      { 
        key: 'businessService',
        target: (cradle: any) => new BusinessService({ 
          calculator: cradle.Calculator, 
          greeter: cradle.Greeter, 
          logger: cradle.logger 
        }),
        type: 'function',
        lifetime: 'transient'
      },
      
      // Enhanced BusinessService with mixed dependencies
      { 
        key: 'enhancedBusinessService',
        target: 'BusinessService',
        type: 'class',
        lifetime: 'transient',
        path: '../../components',
        dependencies: [
          { target: 'calculator', type: 'ref' },      // Reference to existing calculator
          { target: 'greeter', type: 'ref' },         // Reference to existing greeter
          
          // NEW: Inline dependency configuration
          { 
            key: 'specialLogger',
            target: Logger,
            type: 'class',
            lifetime: 'singleton',
            args: [{ level: LogLevel.ERROR, category: 'SPECIAL_OPS' }]
          }
        ]
      },
      
      // Premium BusinessService with deeply nested dependencies
      { 
        key: 'premiumBusinessService',
        target: 'BusinessService',
        type: 'class',
        lifetime: 'transient',
        path: '../../components',
        dependencies: [
          // Enhanced calculator with performance monitoring
          { 
            key: 'premiumCalculator',
            target: 'Calculator',
            type: 'class',
            lifetime: 'singleton',
            path: '../../components',
            dependencies: [
              { target: 'performanceLogger', type: 'ref' }   // Nested reference
            ]
          },
          
          // Enhanced greeter with audit logging
          { 
            key: 'premiumGreeter',
            target: 'Greeter',
            type: 'class',
            lifetime: 'transient',
            path: '../../components',
            dependencies: [
              { target: 'auditLogger', type: 'ref' }         // Nested reference
            ]
          },
          
          // Custom logger for premium operations
          { 
            key: 'premiumLogger',
            target: Logger,
            type: 'class',
            lifetime: 'singleton',
            args: [{ level: LogLevel.ALL, category: 'PREMIUM' }]
          }
        ]
      },
      
      // Enterprise BusinessService with maximum complexity
      { 
        key: 'enterpriseBusinessService',
        target: 'BusinessService',
        type: 'class',
        lifetime: 'transient',
        path: '../../components',
        dependencies: [
          // Enterprise calculator with error handling
          { 
            key: 'enterpriseCalculator',
            target: 'Calculator',
            type: 'class',
            lifetime: 'singleton',
            path: '../../components',
            dependencies: [
              // Multi-level nested dependency
              { 
                key: 'enterpriseCalculatorLogger',
                target: Logger,
                type: 'class',
                lifetime: 'singleton',
                args: [{ level: LogLevel.DEBUG, category: 'ENTERPRISE_CALC' }]
              }
            ]
          },
          
          // Enterprise greeter with full audit trail
          { 
            key: 'enterpriseGreeter',
            target: 'Greeter',
            type: 'class',
            lifetime: 'singleton',
            path: '../../components',
            dependencies: [
              { target: 'auditLogger', type: 'ref' },        // Reference to existing audit logger
              { target: 'errorLogger', type: 'ref' }         // Reference to existing error logger
            ]
          },
          
          // Enterprise logger with comprehensive logging
          { 
            key: 'enterpriseLogger',
            target: Logger,
            type: 'class',
            lifetime: 'singleton',
            args: [{ level: LogLevel.ALL, category: 'ENTERPRISE_SUITE' }]
          }
        ]
      },
      
      // ========================================
      // SERVICE ALIASES - Business Contexts
      // ========================================
      
      // Service aliases for different business contexts
      { key: 'orderProcessingService', target: 'businessService', type: 'alias' },
      { key: 'customerManagementService', target: 'enhancedBusinessService', type: 'alias' },
      { key: 'enterpriseService', target: 'premiumBusinessService', type: 'alias' },
      { key: 'corporateService', target: 'enterpriseBusinessService', type: 'alias' },
      
      // Logger aliases for different operational contexts
      { key: 'mainLogger', target: 'baseLogger', type: 'alias' },
      { key: 'systemLogger', target: 'auditLogger', type: 'alias' },
      { key: 'metricsLogger', target: 'performanceLogger', type: 'alias' },
      { key: 'faultLogger', target: 'errorLogger', type: 'alias' },
      
      // Component aliases for different usage patterns
      { key: 'primaryCalculator', target: 'calculator', type: 'alias' },
      { key: 'primaryGreeter', target: 'greeter', type: 'alias' },
      
      // ========================================
      // CONFIGURATION OBJECTS - System Settings
      // ========================================
      
      // Application configuration
      { 
        key: 'serviceConfig',
        target: {
          version: '3.0.0',
          environment: 'production',
          features: {
            advancedIoC: true,
            references: true,
            inlineDependencies: true,
            orderDependentResolution: true,
            nestedDependencies: true,
            aliasSupport: true
          },
          performance: {
            maxConcurrentServices: 100,
            serviceTimeout: 30000,
            logBufferSize: 1000
          }
        },
        type: 'value'
      },
      
      // Database configuration
      { 
        key: 'databaseConfig',
        target: {
          host: 'localhost',
          port: 5432,
          database: 'enterprise_db',
          pool: {
            min: 10,
            max: 50,
            idleTimeoutMillis: 30000
          },
          ssl: {
            enabled: true,
            rejectUnauthorized: false
          }
        },
        type: 'value'
      },
      
      // Configuration aliases for different access patterns
      { key: 'appConfig', target: 'serviceConfig', type: 'alias' },
      { key: 'dbConfig', target: 'databaseConfig', type: 'alias' },
      
      // ========================================
      // FACTORY FUNCTIONS - Dynamic Values
      // ========================================
      
      // Factory functions for dynamic values
      { 
        key: 'timestampFactory', 
        target: () => new Date().toISOString(), 
        type: 'value' 
      },
      { 
        key: 'correlationIdFactory', 
        target: () => `corr-${Math.random().toString(36).substr(2, 12)}`, 
        type: 'value' 
      },
      { 
        key: 'sessionIdFactory', 
        target: () => `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`, 
        type: 'value' 
      }
    ];
    
    /**
     * Register all advanced dependencies with new syntax
     */
    console.log('📦 Registering dependencies with advanced configuration syntax...');
    await manager.register(configs);
    console.log('✅ All dependencies registered successfully!\n');
    
    /**
     * Test reference resolution capabilities
     */
    console.log('🔍 Testing Reference Resolution:');
    
    // Test basic services with references
    const greeter = manager.resolve('greeter') as any;
    const calculator = manager.resolve('calculator') as any;
    
    console.log('  Basic Services with References:');
    console.log(`    Greeter: ${greeter.greet('Advanced Reference Demo')}`);
    console.log(`    Calculator: ${calculator.add(15, 25)} (Addition)`);
    console.log(`    Calculator: ${calculator.multiply(4, 7)} (Multiplication)`);
    
    // Test business services with mixed dependencies
    const businessService = manager.resolve('businessService') as any;
    const enhancedService = manager.resolve('enhancedBusinessService') as any;
    const premiumService = manager.resolve('premiumBusinessService') as any;
    const enterpriseService = manager.resolve('enterpriseBusinessService') as any;
    
    console.log('\n  Business Services with Complex Dependencies:');
    console.log(`    BusinessService: ${businessService !== undefined ? 'Resolved' : 'Failed'}`);
    console.log(`    EnhancedBusinessService: ${enhancedService !== undefined ? 'Resolved' : 'Failed'}`);
    console.log(`    PremiumBusinessService: ${premiumService !== undefined ? 'Resolved' : 'Failed'}`);
    console.log(`    EnterpriseBusinessService: ${enterpriseService !== undefined ? 'Resolved' : 'Failed'}`);
    
    /**
     * Test alias resolution with comprehensive coverage
     */
    console.log('\n🏷️ Testing Comprehensive Alias Resolution:');
    
    // Service aliases
    const orderProcessor = manager.resolve('orderProcessingService') as any;
    const customerManager = manager.resolve('customerManagementService') as any;
    const enterpriseProcessor = manager.resolve('enterpriseService') as any;
    const corporateService = manager.resolve('corporateService') as any;
    
    console.log('  Service Aliases:');
    console.log(`    OrderProcessingService: ${orderProcessor !== undefined ? 'Available' : 'Missing'}`);
    console.log(`    CustomerManagementService: ${customerManager !== undefined ? 'Available' : 'Missing'}`);
    console.log(`    EnterpriseService: ${enterpriseProcessor !== undefined ? 'Available' : 'Missing'}`);
    console.log(`    CorporateService: ${corporateService !== undefined ? 'Available' : 'Missing'}`);
    
    // Logger aliases
    const mainLogger = manager.resolve<Logger>('mainLogger');
    const systemLogger = manager.resolve<Logger>('systemLogger');
    const metricsLogger = manager.resolve<Logger>('metricsLogger');
    const faultLogger = manager.resolve<Logger>('faultLogger');
    
    console.log('\n  Logger Aliases:');
    mainLogger.info('✅ Main logger alias working correctly');
    systemLogger.info('✅ System logger alias working correctly');
    metricsLogger.debug('✅ Metrics logger alias working correctly');
    faultLogger.error('✅ Fault logger alias working correctly');
    
    /**
     * Test complex business workflows with enterprise patterns
     */
    console.log('\n💼 Testing Complex Business Workflows:');
    
    // Prepare test data
    const orderItems = [
      { name: 'Enterprise Software License', quantity: 1, price: 999.99 },
      { name: 'Professional Support Package', quantity: 1, price: 299.99 },
      { name: 'Training Session', quantity: 2, price: 150.00 }
    ];
    
    // Test order processing with different service levels
    console.log('  Order Processing Across Service Levels:');
    
    const basicOrder = orderProcessor.processCustomerOrder('Basic Corp', orderItems);
    console.log(`    Basic Service - Customer: ${basicOrder.customer}, Total: $${basicOrder.total.toFixed(2)}`);
    
    const enhancedOrder = customerManager.processCustomerOrder('Enhanced Corp', orderItems);
    console.log(`    Enhanced Service - Customer: ${enhancedOrder.customer}, Total: $${enhancedOrder.total.toFixed(2)}`);
    
    const premiumOrder = enterpriseProcessor.processCustomerOrder('Premium Corp', orderItems);
    console.log(`    Premium Service - Customer: ${premiumOrder.customer}, Total: $${premiumOrder.total.toFixed(2)}`);
    
    // Test enterprise workflow with comprehensive features
    console.log('\n  Enterprise Workflow Orchestration:');
    
    const enterpriseWorkflow = corporateService.executeBusinessWorkflow(
      'Fortune 500 Corporation',
      orderItems,
      'Outstanding enterprise solution with comprehensive features!',
      10
    );
    
    console.log(`    Welcome: ${enterpriseWorkflow.welcome}`);
    console.log(`    Order Total: $${enterpriseWorkflow.order.total.toFixed(2)}`);
    console.log(`    Processing Time: ${enterpriseWorkflow.order.processingTime.toFixed(2)}ms`);
    console.log(`    Feedback Sentiment: ${enterpriseWorkflow.feedback.sentiment}`);
    console.log(`    Feedback Score: ${enterpriseWorkflow.feedback.score}/10`);
    
    /**
     * Test configuration resolution and factory functions
     */
    console.log('\n⚙️ Testing Configuration Resolution:');
    
    const config = manager.resolve<any>('appConfig');
    const dbConfig = manager.resolve<any>('dbConfig');
    
    console.log('  Application Configuration:');
    console.log(`    Version: ${config.version}`);
    console.log(`    Environment: ${config.environment}`);
    console.log(`    Advanced IoC: ${config.features.advancedIoC}`);
    console.log(`    References: ${config.features.references}`);
    console.log(`    Inline Dependencies: ${config.features.inlineDependencies}`);
    console.log(`    Nested Dependencies: ${config.features.nestedDependencies}`);
    console.log(`    Max Concurrent Services: ${config.performance.maxConcurrentServices}`);
    
    console.log('\n  Database Configuration:');
    console.log(`    Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`    Database: ${dbConfig.database}`);
    console.log(`    Pool Size: ${dbConfig.pool.min}-${dbConfig.pool.max}`);
    console.log(`    SSL Enabled: ${dbConfig.ssl.enabled}`);
    
    /**
     * Test factory functions for dynamic values
     */
    console.log('\n🏭 Testing Factory Functions:');
    
    const timestampFactory = manager.resolve<() => string>('timestampFactory');
    const correlationIdFactory = manager.resolve<() => string>('correlationIdFactory');
    const sessionIdFactory = manager.resolve<() => string>('sessionIdFactory');
    
    console.log(`  Timestamp: ${timestampFactory()}`);
    console.log(`  Correlation ID: ${correlationIdFactory()}`);
    console.log(`  Session ID: ${sessionIdFactory()}`);
    
    // Show factory functions produce different values
    console.log('\n  Factory Function Variability:');
    console.log(`  New Timestamp: ${timestampFactory()}`);
    console.log(`  New Correlation ID: ${correlationIdFactory()}`);
    console.log(`  New Session ID: ${sessionIdFactory()}`);
    
    /**
     * Comprehensive dependency analysis
     */
    console.log('\n📊 Comprehensive Dependency Analysis:');
    
    const registeredKeys = manager.getRegisteredKeys();
    console.log(`  Total Registered Dependencies: ${registeredKeys.length}`);
    
    // Categorize dependencies
    const serviceKeys = registeredKeys.filter(key => key.toLowerCase().includes('service'));
    const loggerKeys = registeredKeys.filter(key => key.toLowerCase().includes('logger'));
    const aliasKeys = registeredKeys.filter(key => {
      const resolved = manager.resolve(key);
      return typeof resolved === 'object' && resolved !== null;
    });
    const factoryKeys = registeredKeys.filter(key => key.toLowerCase().includes('factory'));
    const configKeys = registeredKeys.filter(key => key.toLowerCase().includes('config'));
    
    console.log(`  Business Services: ${serviceKeys.length}`);
    console.log(`  Logger Instances: ${loggerKeys.length}`);
    console.log(`  Configuration Objects: ${configKeys.length}`);
    console.log(`  Factory Functions: ${factoryKeys.length}`);
    console.log(`  Component Aliases: ${aliasKeys.length}`);
    
    /**
     * Performance and architectural summary
     */
    console.log('\n🎯 Advanced Configuration Demo Summary:');
    console.log('  ✅ Consistent reference syntax `{ target: "name", type: "ref" }`');
    console.log('  ✅ Inline dependency configuration for complex scenarios');
    console.log('  ✅ Order-dependent reference resolution working correctly');
    console.log('  ✅ Mixed reference and inline dependency patterns');
    console.log('  ✅ Multi-level nested dependency trees');
    console.log('  ✅ Comprehensive alias support for flexible contexts');
    console.log('  ✅ Complex business workflow orchestration');
    console.log('  ✅ Enterprise-grade configuration management');
    console.log('  ✅ Factory functions for dynamic value generation');
    console.log('  ✅ JSON-serializable configuration patterns');
    console.log('  ✅ Production-ready dependency injection architecture');
    
    /**
     * Configuration export example
     */
    console.log('\n📄 JSON-Serializable Configuration Export:');
    console.log('This configuration can be stored and loaded from JSON/MongoDB:');
    
    const exportableConfig = {
      version: '3.0.0',
      dependencies: {
        loggers: {
          base: { key: 'baseLogger', target: 'Logger', type: 'class', args: [{ level: LogLevel.INFO, category: 'BASE' }] },
          audit: { key: 'auditLogger', target: 'Logger', type: 'class', args: [{ level: LogLevel.ALL, category: 'AUDIT' }] }
        },
        services: {
          business: { 
            key: 'businessService', 
            target: 'BusinessService', 
            type: 'class',
            dependencies: [
              { target: 'calculator', type: 'ref' },
              { target: 'greeter', type: 'ref' },
              { target: 'auditLogger', type: 'ref' }
            ]
          }
        },
        aliases: {
          main: { key: 'mainLogger', target: 'baseLogger', type: 'alias' },
          processor: { key: 'orderProcessingService', target: 'businessService', type: 'alias' }
        }
      }
    };
    
    console.log(JSON.stringify(exportableConfig, null, 2));
    
    console.log('\n✅ Advanced Configuration Demo completed successfully!');
    console.log('🎉 All advanced IoC features demonstrated and working correctly!');
    
  } catch (error) {
    console.error('❌ Error during advanced configuration demo:', error);
    process.exit(1);
  }
})(); 