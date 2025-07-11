import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel, LoggerConfig } from './tools/log';

/**
 * Advanced demo showing more IoC capabilities
 */
async function advancedDemo(): Promise<void> {
  console.log('🎯 Advanced IoC Demo\n');

  const container = new IoC();

  // Enhanced configuration examples with new simplified syntax
  const configs: RegistrationConfig[] = [
    // Singleton logger with DEBUG level - new simplified syntax with args!
    { 
      key: 'logger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.DEBUG, category: 'SYSTEM' }]
    },
    
    // Different loggers with different levels - much cleaner!
    { 
      key: 'errorLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.ERROR, category: 'ERRORS' }]
    },
    { 
      key: 'debugLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.ALL, category: 'DEBUG' }]
    },
    
    // Transient services - new instance each time (unchanged)
    { target: 'Greeter', lifetime: 'transient', path: '../../components' },
    
    // Scoped services - same instance within scope (unchanged)
    { target: 'Calculator', lifetime: 'scoped', path: '../../components' },
    
    // Configuration objects (unchanged)
    { key: 'appConfig', target: { version: '1.0.0', debug: true }, type: 'value' },
    
    // Factory functions (unchanged)
    { key: 'timestampFactory', target: () => new Date().toISOString(), type: 'value' },
    
    // Complex dependencies (unchanged)
    { 
      key: 'serviceMap', 
      target: {
        logger: 'logger',
        greeter: 'Greeter',
        calculator: 'Calculator'
      }, 
      type: 'value' 
    }
  ];

  try {
    // Register all dependencies
    await container.register(configs);
    
    // Test singleton behavior
    console.log('🔧 Testing Singleton Behavior:');
    const logger1 = container.resolve<Logger>('logger');
    const logger2 = container.resolve<Logger>('logger');
    console.log(`Same logger instance: ${logger1 === logger2}`);
    
    // Test transient behavior
    console.log('\n🔄 Testing Transient Behavior:');
    const greeter1 = container.resolve('Greeter') as any;
    const greeter2 = container.resolve('Greeter') as any;
    console.log(`Same greeter instance: ${greeter1 === greeter2}`);
    
    // Test scoped behavior
    console.log('\n🎯 Testing Scoped Behavior:');
    const calc1 = container.resolve('Calculator') as any;
    const calc2 = container.resolve('Calculator') as any;
    console.log(`Same calculator instance: ${calc1 === calc2}`);
    
    // Test configuration resolution
    console.log('\n⚙️ Configuration Resolution:');
    const config = container.resolve<{ version: string; debug: boolean }>('appConfig');
    console.log(`App version: ${config.version}, Debug mode: ${config.debug}`);
    
    // Test factory function
    console.log('\n🏭 Factory Function:');
    const timestamp = container.resolve<() => string>('timestampFactory');
    console.log(`Current timestamp: ${timestamp()}`);
    
    // Test complex dependencies
    console.log('\n🗺️ Service Map:');
    const serviceMap = container.resolve<any>('serviceMap');
    console.log('Available services:', Object.keys(serviceMap));
    
    // Test different logger configurations
    console.log('\n📝 Testing Different Logger Configurations:');
    
    const mainLogger = container.resolve<Logger>('logger');
    const errorLogger = container.resolve<Logger>('errorLogger');
    const debugLogger = container.resolve<Logger>('debugLogger');
    
    console.log('Main logger (DEBUG level):');
    mainLogger.debug('This debug message will show');
    mainLogger.info('This info message will show');
    mainLogger.warn('This warning will show');
    mainLogger.error('This error will show');
    
    console.log('\nError logger (ERROR level only):');
    errorLogger.debug('This debug message will NOT show');
    errorLogger.info('This info message will NOT show');
    errorLogger.warn('This warning will NOT show');
    errorLogger.error('This error will show');
    
    console.log('\nDebug logger (ALL levels):');
    debugLogger.debug('This debug message will show');
    debugLogger.info('This info message will show');
    debugLogger.info('This verbose-like message will show');
    debugLogger.error('This error will show');
    
    // Test logger level changes
    console.log('\n🔄 Testing Logger Level Changes:');
    console.log('Changing main logger level to ERROR only:');
    mainLogger.setting({ level: LogLevel.ERROR });
    mainLogger.info('This info will NOT show after level change');
    mainLogger.error('This error will show after level change');
    
    // Test new flow-based logging structure
    console.log('\n🌊 Testing New Flow-based Logging Structure:');
    const workflowFlowId = '20241220145000001';
    
    mainLogger.error({
      message: 'Configuration load failed',
      data: {
        configFile: 'app.config.json',
        error: 'File not found',
        retries: 3
      },
      flow: workflowFlowId
    });
    
    mainLogger.info({
      message: 'Attempting configuration reload',
      data: {
        configFile: 'app.config.json',
        fallbackUsed: true
      },
      flow: workflowFlowId
    });
    
    // Test simple string logging (backward compatible)
    console.log('\n⚡ Testing Backward Compatible String Logging:');
    mainLogger.info('Simple string message still works');
    mainLogger.error('Simple error message');
    
    // Test mixed input types
    console.log('\n🔢 Testing Mixed Input Types:');
    mainLogger.info(12345); // Number
    mainLogger.warn('String message'); // String
    mainLogger.error({
      message: 'Complex object message',
      data: { errorCode: 500, module: 'database' }
    }); // Object
    
    // Test unregistration
    console.log('\n🗑️ Testing Unregistration:');
    console.log('Before unregister - services:', Object.keys(container['container'].registrations));
    container.unregister(['timestampFactory']);
    console.log('After unregister - services:', Object.keys(container['container'].registrations));
    
    // Demonstrate JSON-friendly configuration
    console.log('\n🔧 JSON-Friendly Configuration Example:');
    console.log('This configuration can be saved to JSON or MongoDB:');
    
    const jsonFriendlyConfig = {
      logger: {
        key: 'logger',
        target: 'Logger',
        type: 'class',
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'JSON' }]
      },
      errorLogger: {
        key: 'errorLogger', 
        target: 'Logger',
        type: 'class',
        lifetime: 'singleton',
        args: [{ level: LogLevel.ERROR, category: 'JSON-ERRORS' }]
      }
    };
    
    console.log(JSON.stringify(jsonFriendlyConfig, null, 2));
    
    console.log('\n📊 Comparison - Old vs New Approach:');
    console.log('❌ Old way (verbose):');
    console.log('{ key: "logger", target: () => new Logger({ level: LogLevel.INFO }), type: "function", lifetime: "singleton" }');
    console.log('✅ New way (clean):');
    console.log('{ key: "logger", target: Logger, type: "class", lifetime: "singleton", args: [{ level: LogLevel.INFO }] }');
    
    console.log('\n✅ Advanced demo completed successfully!');
    
  } catch (error) {
    console.error('❌ Advanced demo failed:', error);
  }
}

// Run the advanced demo
if (require.main === module) {
  advancedDemo().catch(console.error);
}

export { advancedDemo }; 