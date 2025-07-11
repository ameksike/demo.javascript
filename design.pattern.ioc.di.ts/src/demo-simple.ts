import { IoC, RegistrationConfig } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

/**
 * Simple IoC Demo - Basic Dependency Injection
 * 
 * This demo demonstrates the fundamental concepts of Inversion of Control:
 * - Basic class registration
 * - Simple dependency resolution
 * - Value and alias registration
 * - Dynamic imports with lifecycle management
 * 
 * Complexity Level: ⭐ (Beginner)
 */
(async function main(): Promise<void> {
  console.log('🚀 Simple IoC Demo - Basic Dependency Injection\n');

  try {
    // Create IoC container
    const container = new IoC();

    /**
     * Basic registration configurations demonstrating core IoC patterns
     */
    const configs: RegistrationConfig[] = [
      // Basic logger registration with constructor arguments
      { 
        key: 'logger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'SIMPLE' }]
      },

      // Dynamic import with transient lifecycle
      { 
        target: 'Greeter', 
        type: 'class', 
        lifetime: 'transient', 
        path: '../../components'
      },

      // Dynamic import with singleton lifecycle
      { 
        target: 'Calculator', 
        type: 'class', 
        lifetime: 'singleton', 
        path: '../../components'
      },

      // Simple value registration
      { 
        key: 'appName', 
        target: 'Simple IoC Demo', 
        type: 'value' 
      },

      // Numeric value registration
      { 
        key: 'version', 
        target: 1.0, 
        type: 'value' 
      },

      // Object value registration
      { 
        key: 'config', 
        target: { 
          debug: false, 
          maxRetries: 3,
          timeout: 5000
        }, 
        type: 'value' 
      },

      // Simple function registration
      { 
        key: 'greetingFunction', 
        target: (name: string) => `Hello, ${name}!`, 
        type: 'value' 
      },

      // Alias registration
      { 
        key: 'primaryLogger', 
        target: 'logger', 
        type: 'alias' 
      }
    ];

    /**
     * Register all dependencies in the IoC container
     */
    console.log('📦 Registering basic dependencies...');
    await container.register(configs);
    console.log('✅ Dependencies registered successfully!\n');

    /**
     * Basic dependency resolution examples
     */
    console.log('🔍 Testing Basic Dependency Resolution:');

    // Resolve logger instance
    const logger = container.resolve<Logger>('logger');
    logger.info('IoC container initialized successfully');

    // Resolve and test Greeter (transient)
    const greeter1 = container.resolve('Greeter') as any;
    const greeter2 = container.resolve('Greeter') as any;
    console.log(`Greeter message: ${greeter1.greet('World')}`);
    console.log(`Transient behavior (different instances): ${greeter1 !== greeter2}`);

    // Resolve and test Calculator (singleton)
    const calculator1 = container.resolve('Calculator') as any;
    const calculator2 = container.resolve('Calculator') as any;
    console.log(`Calculator result: 10 + 5 = ${calculator1.add(10, 5)}`);
    console.log(`Singleton behavior (same instance): ${calculator1 === calculator2}`);

    /**
     * Value resolution examples
     */
    console.log('\n📊 Testing Value Resolution:');

    const appName = container.resolve<string>('appName');
    const version = container.resolve<number>('version');
    const config = container.resolve<any>('config');
    
    console.log(`App Name: ${appName}`);
    console.log(`Version: ${version}`);
    console.log(`Config: ${JSON.stringify(config, null, 2)}`);

    /**
     * Function resolution example
     */
    console.log('\n🎯 Testing Function Resolution:');
    
    const greetingFn = container.resolve<(name: string) => string>('greetingFunction');
    console.log(`Function result: ${greetingFn('Simple Demo')}`);

    /**
     * Alias resolution example
     */
    console.log('\n🏷️ Testing Alias Resolution:');
    
    const primaryLogger = container.resolve<Logger>('primaryLogger');
    primaryLogger.info('Message from primary logger alias');
    console.log(`Alias points to same instance: ${logger === primaryLogger}`);

    /**
     * Container introspection
     */
    console.log('\n📋 Container Information:');
    
    const registeredKeys = container.getRegisteredKeys();
    console.log(`Total registered dependencies: ${registeredKeys.length}`);
    console.log('Registered keys:');
    registeredKeys.forEach(key => console.log(`  ✓ ${key}`));

    /**
     * Summary
     */
    console.log('\n🎯 Simple Demo Summary:');
    console.log('  ✅ Basic class registration and resolution');
    console.log('  ✅ Dynamic imports with path resolution');
    console.log('  ✅ Lifecycle management (singleton vs transient)');
    console.log('  ✅ Value and function registration');
    console.log('  ✅ Alias support for flexible resolution');
    console.log('  ✅ Container introspection capabilities');

    console.log('\n✅ Simple IoC Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during simple demo:', error);
    process.exit(1);
  }
})(); 