import { IoC } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

/**
 * Simple IoC Demo - Basic Dependency Injection Patterns
 * 
 * This demo showcases fundamental IoC container capabilities:
 * - Basic class registration with constructor arguments
 * - Dependency injection patterns  
 * - Value and function registrations
 * - Auto-registration with default patterns
 * - Simplified configuration
 * 
 * Complexity Level: ⭐ (Beginner)
 */
(async function main(): Promise<void> {
  console.log('🚀 Simple IoC Demo - Basic Dependency Injection Patterns\n');

  try {
    // Create IoC container
    const container = new IoC();

    /**
     * FEATURE 1: Basic Class Registration
     */
    console.log('📦 Basic Class Registration:');
    
    await container.register([
      // Logger with configuration
      { 
        key: 'logger', 
        target: Logger, 
        type: 'class',
        lifetime: 'singleton',
        args: [{ level: LogLevel.INFO, category: 'SIMPLE' }]
      },
      // Simple classes that will be auto-registered (only for components)
      { 
        regex: '(Greeter|Calculator|App|DataManager)',
        type: 'auto',
        path: '../../components',
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    // Resolve dependencies
    const logger = await container.resolve<Logger>('logger');
    logger.info('Logger instance created successfully');

    /**
     * FEATURE 2: Auto-Registration Demo
     */
    console.log('\n🔄 Auto-Registration Demo:');
    
    // These will be auto-registered when resolved
    const greeter = await container.resolve('Greeter') as any;
    const calculator = await container.resolve('Calculator') as any;

    // Test the auto-registered components
    console.log('✅ Greeter result:', greeter.greet('World'));
    console.log('✅ Calculator result:', calculator.add(5, 3));

    /**
     * FEATURE 3: Value and Function Registration
     */
    console.log('\n📊 Value and Function Registration:');
    
    await container.register([
      { key: 'appName', target: 'Simple IoC Demo', type: 'value' },
      { key: 'version', target: 1.0, type: 'value' },
      { key: 'config', target: { debug: true, env: 'development' }, type: 'value' },
      { 
        key: 'greetingFunction', 
        target: (name: string) => `Hello, ${name}!`, 
        type: 'value'
      }
    ]);

    // Resolve values and functions
    const appName = await container.resolve<string>('appName');
    const version = await container.resolve<number>('version');
    const config = await container.resolve<any>('config');
    const greetingFn = await container.resolve<(name: string) => string>('greetingFunction');

    console.log('✅ App Name:', appName);
    console.log('✅ Version:', version);
    console.log('✅ Config:', config);
    console.log('✅ Greeting Function:', greetingFn('TypeScript'));

    /**
     * FEATURE 4: Alias Registration
     */
    console.log('\n🔗 Alias Registration:');
    
    await container.register([
      { key: 'primaryLogger', target: 'logger', type: 'alias' }
    ]);

    const primaryLogger = await container.resolve<Logger>('primaryLogger');
    primaryLogger.info('Primary logger (alias) works!');

    /**
     * Summary
     */
    console.log('\n🎯 Simple Demo Features:');
    console.log('  ✅ Basic class registration with arguments');
    console.log('  ✅ Auto-registration with default patterns');
    console.log('  ✅ Value and function registration');
    console.log('  ✅ Alias registration for existing dependencies');
    console.log('  ✅ Simplified configuration');

    console.log('\n✅ Simple IoC Demo completed successfully!');
    console.log('💡 This demo shows the fundamental concepts of dependency injection.');
    
  } catch (error) {
    console.error('❌ Error during simple demo:', error);
    process.exit(1);
  }
})(); 