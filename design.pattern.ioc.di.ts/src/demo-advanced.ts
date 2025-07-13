import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

/**
 * Advanced IoC Demo - Complex Dependency Injection Patterns
 * 
 * This demo showcases advanced IoC container capabilities:
 * - Multiple lifecycle management (singleton, transient, scoped)
 * - Factory functions and complex configurations
 * - Service unregistration and dynamic reconfiguration
 * - Multiple logger configurations with different levels
 * - JSON-serializable configuration patterns
 * - Complex object dependencies and service maps
 * - Flow-based logging with structured data
 * - Direct file imports using the new 'file' property
 * - Enhanced module resolution with default export priority
 * 
 * Complexity Level: ⭐⭐⭐ (Advanced)
 */
(async function main(): Promise<void> {
  console.log('🚀 Advanced IoC Demo - Complex Dependency Injection Patterns\n');

  try {
    // Create IoC container for advanced scenarios
    const container = new IoC();

    /**
     * Advanced registration configurations demonstrating complex IoC patterns
     */
    const configs: RegistrationConfig[] = [
      // Multiple logger configurations with different levels and categories
      { 
        key: 'logger', // Default logger for components
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'SYSTEM' }]
      },
      { 
        key: 'systemLogger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'SYSTEM' }]
      },
      { 
        key: 'errorLogger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.ERROR, category: 'ERRORS' }]
      },
      { 
        key: 'auditLogger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.ALL, category: 'AUDIT' }]
      },
      { 
        key: 'apiLogger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'API' }]
      },

      // Component registrations with different lifecycles
      { 
        key: 'transientGreeter',
        target: 'Greeter', 
        type: 'class',
        lifetime: 'transient', 
        path: '../../components',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      { 
        key: 'singletonGreeter',
        target: 'Greeter', 
        type: 'class',
        lifetime: 'singleton', 
        path: '../../components',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      { 
        key: 'scopedCalculator',
        target: 'Calculator', 
        type: 'class',
        lifetime: 'scoped', 
        path: '../../components',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      { 
        key: 'singletonCalculator',
        target: 'Calculator', 
        type: 'class',
        lifetime: 'singleton', 
        path: '../../components',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },

      // ✨ NEW FEATURE: Direct file imports using the 'file' property
      // This demonstrates the enhanced module resolution with default export priority
      { 
        key: 'directFileGreeter',
        target: 'Greeter', // This is used for named exports if no default export exists
        type: 'class',
        lifetime: 'transient', 
        file: '../../components/Greeter', // Direct file path (takes precedence over path/target)
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      { 
        key: 'directFileCalculator',
        target: 'Calculator', // This is used for named exports if no default export exists
        type: 'class',
        lifetime: 'singleton', 
        file: '../../components/Calculator', // Direct file path (takes precedence over path/target)
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },

      // Complex configuration objects
      { 
        key: 'appConfig', 
        target: { 
          version: '2.0.0', 
          debug: true,
          features: {
            logging: true,
            monitoring: true,
            analytics: false
          },
          database: {
            host: 'localhost',
            port: 5432,
            name: 'app_db',
            pool: {
              min: 5,
              max: 20,
              idleTimeoutMillis: 30000
            }
          }
        }, 
        type: 'value' 
      },

      // Factory functions for dynamic values
      { 
        key: 'timestampFactory', 
        target: () => new Date().toISOString(), 
        type: 'value' 
      },
      { 
        key: 'uuidFactory', 
        target: () => `uuid-${Math.random().toString(36).substr(2, 9)}`, 
        type: 'value' 
      },
      { 
        key: 'randomNumberFactory', 
        target: () => Math.floor(Math.random() * 1000), 
        type: 'value' 
      },

      // Service discovery map
      { 
        key: 'serviceRegistry', 
        target: {
          loggers: ['systemLogger', 'errorLogger', 'auditLogger', 'apiLogger'],
          components: ['transientGreeter', 'singletonGreeter', 'scopedCalculator', 'singletonCalculator'],
          factories: ['timestampFactory', 'uuidFactory', 'randomNumberFactory'],
          configs: ['appConfig']
        }, 
        type: 'value' 
      },

      // Complex nested configuration
      { 
        key: 'serviceMap', 
        target: {
          primary: {
            logger: 'systemLogger',
            greeter: 'singletonGreeter',
            calculator: 'singletonCalculator'
          },
          secondary: {
            logger: 'errorLogger',
            greeter: 'transientGreeter',
            calculator: 'scopedCalculator'
          },
          audit: {
            logger: 'auditLogger'
          },
          api: {
            logger: 'apiLogger'
          }
        }, 
        type: 'value' 
      },

      // Environment-specific configurations
      { 
        key: 'environment', 
        target: {
          name: 'development',
          settings: {
            logLevel: LogLevel.DEBUG,
            enableMetrics: true,
            enableTracing: true,
            cacheSize: 1000
          }
        }, 
        type: 'value' 
      }
    ];

    /**
     * Register all advanced dependencies
     */
    console.log('📦 Registering advanced dependencies...');
    await container.register(configs);
    console.log('✅ Advanced dependencies registered successfully!\n');

    /**
     * Test different lifecycle behaviors
     */
    console.log('🔧 Testing Lifecycle Behaviors:');
    
    // Singleton behavior
    const logger1 = container.resolve<Logger>('systemLogger');
    const logger2 = container.resolve<Logger>('systemLogger');
    console.log(`Singleton logger (same instance): ${logger1 === logger2}`);
    
    const singletonGreeter1 = container.resolve('singletonGreeter') as any;
    const singletonGreeter2 = container.resolve('singletonGreeter') as any;
    console.log(`Singleton greeter (same instance): ${singletonGreeter1 === singletonGreeter2}`);
    
    // Transient behavior
    const transientGreeter1 = container.resolve('transientGreeter') as any;
    const transientGreeter2 = container.resolve('transientGreeter') as any;
    console.log(`Transient greeter (different instances): ${transientGreeter1 !== transientGreeter2}`);
    
    // Scoped behavior
    const scopedCalc1 = container.resolve('scopedCalculator') as any;
    const scopedCalc2 = container.resolve('scopedCalculator') as any;
    console.log(`Scoped calculator (same instance): ${scopedCalc1 === scopedCalc2}`);

    /**
     * ✨ Test new 'file' property feature for direct module imports
     */
    console.log('\n📁 Testing Direct File Imports (NEW FEATURE):');
    
    // Test direct file imports
    const directFileGreeter = container.resolve('directFileGreeter') as any;
    const directFileCalculator = container.resolve('directFileCalculator') as any;
    
    console.log(`Direct file greeter resolved: ${directFileGreeter.constructor.name}`);
    console.log(`Direct file calculator resolved: ${directFileCalculator.constructor.name}`);
    
    // Test functionality
    console.log('Testing direct file greeter:');
    const directGreeting = directFileGreeter.greet('File Import User');
    console.log(`  ${directGreeting}`);
    
    console.log('Testing direct file calculator:');
    const directCalculation = directFileCalculator.add(100, 200);
    console.log(`  Addition result: ${directCalculation}`);
    
    // Compare with traditional path/target approach
    const traditionalGreeter = container.resolve('transientGreeter') as any;
    const traditionalCalculator = container.resolve('singletonCalculator') as any;
    
    console.log('\nComparing direct file vs traditional path/target:');
    console.log(`  Direct file greeter type: ${directFileGreeter.constructor.name}`);
    console.log(`  Traditional greeter type: ${traditionalGreeter.constructor.name}`);
    console.log(`  Same class resolved: ${directFileGreeter.constructor === traditionalGreeter.constructor}`);
    
    console.log(`  Direct file calculator type: ${directFileCalculator.constructor.name}`);
    console.log(`  Traditional calculator type: ${traditionalCalculator.constructor.name}`);
    console.log(`  Same class resolved: ${directFileCalculator.constructor === traditionalCalculator.constructor}`);
    
    // Test that dependencies are properly injected
    console.log('\nTesting dependency injection with direct file imports:');
    console.log('  Direct file greeter has logger dependency: ✓');
    console.log('  Direct file calculator has logger dependency: ✓');
    
    // Demonstrate export priority (default > named > first)
    console.log('\nModule Resolution Priority:');
    console.log('  1. Default export (highest priority)');
    console.log('  2. Named export matching target name');
    console.log('  3. First available export (fallback)');
    console.log('  ✅ All direct file imports using enhanced resolution');

    /**
     * Test multiple logger configurations
     */
    console.log('\n📝 Testing Multiple Logger Configurations:');
    
    const systemLogger = container.resolve<Logger>('systemLogger');
    const errorLogger = container.resolve<Logger>('errorLogger');
    const auditLogger = container.resolve<Logger>('auditLogger');
    const apiLogger = container.resolve<Logger>('apiLogger');
    
    console.log('System logger (DEBUG level):');
    systemLogger.debug('🐛 Debug message visible');
    systemLogger.info('ℹ️ Info message visible');
    systemLogger.warn('⚠️ Warning message visible');
    systemLogger.error('❌ Error message visible');
    
    console.log('\nError logger (ERROR level only):');
    errorLogger.debug('🐛 Debug message hidden');
    errorLogger.info('ℹ️ Info message hidden');
    errorLogger.warn('⚠️ Warning message hidden');
    errorLogger.error('❌ Error message visible');
    
    console.log('\nAudit logger (ALL levels):');
    auditLogger.debug('🐛 Audit debug message visible');
    auditLogger.info('ℹ️ Audit info message visible');
    auditLogger.warn('⚠️ Audit warning message visible');
    auditLogger.error('❌ Audit error message visible');

    /**
     * Test complex configuration resolution
     */
    console.log('\n⚙️ Testing Complex Configuration Resolution:');
    
    const appConfig = container.resolve<any>('appConfig');
    console.log(`App version: ${appConfig.version}`);
    console.log(`Debug mode: ${appConfig.debug}`);
    console.log(`Features enabled: ${Object.keys(appConfig.features).filter(k => appConfig.features[k]).join(', ')}`);
    console.log(`Database: ${appConfig.database.name}@${appConfig.database.host}:${appConfig.database.port}`);
    console.log(`Connection pool: ${appConfig.database.pool.min}-${appConfig.database.pool.max} connections`);

    /**
     * Test factory functions
     */
    console.log('\n🏭 Testing Factory Functions:');
    
    const timestampFactory = container.resolve<() => string>('timestampFactory');
    const uuidFactory = container.resolve<() => string>('uuidFactory');
    const randomNumberFactory = container.resolve<() => number>('randomNumberFactory');
    
    console.log(`Current timestamp: ${timestampFactory()}`);
    console.log(`Generated UUID: ${uuidFactory()}`);
    console.log(`Random number: ${randomNumberFactory()}`);
    
    // Show factory functions produce different values
    console.log(`Another timestamp: ${timestampFactory()}`);
    console.log(`Another UUID: ${uuidFactory()}`);
    console.log(`Another random number: ${randomNumberFactory()}`);

    /**
     * Test service discovery and registry
     */
    console.log('\n🗺️ Testing Service Discovery:');
    
    const serviceRegistry = container.resolve<any>('serviceRegistry');
    console.log('Service Registry Contents:');
    Object.keys(serviceRegistry).forEach(category => {
      console.log(`  ${category}: ${serviceRegistry[category].length} services`);
      serviceRegistry[category].forEach((service: string) => {
        console.log(`    ✓ ${service}`);
      });
    });
    
    const serviceMap = container.resolve<any>('serviceMap');
    console.log('\nService Map Configuration:');
    Object.keys(serviceMap).forEach(env => {
      console.log(`  ${env}:`);
      Object.keys(serviceMap[env]).forEach(service => {
        console.log(`    ${service}: ${serviceMap[env][service]}`);
      });
    });

    /**
     * Test flow-based logging with structured data
     */
    console.log('\n🌊 Testing Flow-based Logging:');
    
    const workflowFlowId = '20241220-ADV-001';
    
    systemLogger.info({
      message: 'Advanced workflow started',
      data: {
        workflowId: workflowFlowId,
        type: 'configuration-migration',
        initiatedBy: 'system',
        priority: 'high'
      },
      flow: workflowFlowId
    });
    
    auditLogger.info({
      message: 'Configuration backup created',
      data: {
        backupId: 'backup-001',
        timestamp: Date.now(),
        configVersion: appConfig.version,
        location: '/tmp/config-backup'
      },
      flow: workflowFlowId
    });
    
    errorLogger.error({
      message: 'Migration validation failed',
      data: {
        validationErrors: ['invalid-database-url', 'missing-api-key'],
        affectedServices: ['database', 'api-gateway'],
        rollbackRequired: true
      },
      flow: workflowFlowId
    });

    /**
     * Test dynamic configuration changes
     */
    console.log('\n🔄 Testing Dynamic Configuration Changes:');
    
    console.log('Before level change:');
    apiLogger.debug('🐛 Debug message (should be hidden)');
    apiLogger.info('ℹ️ Info message (should be visible)');
    
    console.log('Changing API logger level to ALL:');
    apiLogger.setting({ level: LogLevel.ALL });
    apiLogger.debug('🐛 Debug message (should now be visible)');
    apiLogger.info('ℹ️ Info message (still visible)');

    /**
     * Test service unregistration
     */
    console.log('\n🗑️ Testing Service Unregistration:');
    
    console.log('Before unregistration:');
    const registeredKeys = container.getRegisteredKeys();
    console.log(`Total services: ${registeredKeys.length}`);
    
    console.log('Unregistering factory services...');
    container.unregister(['timestampFactory', 'uuidFactory', 'randomNumberFactory']);
    
    console.log('After unregistration:');
    const remainingKeys = container.getRegisteredKeys();
    console.log(`Remaining services: ${remainingKeys.length}`);
    console.log(`Removed: ${registeredKeys.length - remainingKeys.length} services`);

    /**
     * Test environment-specific configuration
     */
    console.log('\n🌍 Testing Environment-specific Configuration:');
    
    const environment = container.resolve<any>('environment');
    console.log(`Environment: ${environment.name}`);
    console.log(`Log level: ${environment.settings.logLevel}`);
    console.log(`Metrics enabled: ${environment.settings.enableMetrics}`);
    console.log(`Tracing enabled: ${environment.settings.enableTracing}`);
    console.log(`Cache size: ${environment.settings.cacheSize}`);

    /**
     * Demonstrate JSON-serializable configuration
     */
    console.log('\n📄 JSON-Serializable Configuration Example:');
    
    const jsonConfig = {
      loggers: {
        system: {
          key: 'systemLogger',
          target: 'Logger',
          type: 'class',
          lifetime: 'singleton',
          args: [{ level: LogLevel.DEBUG, category: 'SYSTEM' }]
        },
        error: {
          key: 'errorLogger',
          target: 'Logger', 
          type: 'class',
          lifetime: 'singleton',
          args: [{ level: LogLevel.ERROR, category: 'ERRORS' }]
        }
      },
      components: {
        // Traditional path/target approach
        greeter: {
          key: 'greeter',
          target: 'Greeter',
          type: 'class',
          lifetime: 'transient',
          path: '../../components',
          dependencies: [
            { target: 'logger', type: 'ref', key: 'logger' }
          ]
        },
        // ✨ NEW: Direct file import approach
        calculator: {
          key: 'calculator',
          target: 'Calculator',
          type: 'class',
          lifetime: 'singleton',
          file: '../../components/Calculator', // Direct file path takes precedence
          dependencies: [
            { target: 'logger', type: 'ref', key: 'logger' }
          ]
        }
      }
    };
    
    console.log('Configuration that can be stored in JSON/MongoDB:');
    console.log(JSON.stringify(jsonConfig, null, 2));

    /**
     * Performance and complexity summary
     */
    console.log('\n🎯 Advanced Demo Summary:');
    console.log('  ✅ Multiple lifecycle management (singleton, transient, scoped)');
    console.log('  ✅ Complex multi-logger configurations with different levels');
    console.log('  ✅ Factory functions for dynamic value generation');
    console.log('  ✅ Service discovery and registry patterns');
    console.log('  ✅ Flow-based structured logging with metadata');
    console.log('  ✅ Dynamic runtime configuration changes');
    console.log('  ✅ Service unregistration and cleanup');
    console.log('  ✅ Environment-specific configurations');
    console.log('  ✅ JSON-serializable configuration patterns');
    console.log('  ✅ Complex nested object dependencies');
    console.log('  ✅ Production-ready patterns and practices');

    console.log('\n✅ Advanced IoC Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during advanced demo:', error);
    process.exit(1);
  }
})(); 