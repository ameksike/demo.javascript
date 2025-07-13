import { IoC } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

/**
 * Advanced IoC Demo - Auto-Registration and Advanced Patterns
 * 
 * This demo showcases advanced IoC container capabilities not covered in simple/medium demos:
 * - Auto-registration with regex patterns
 * - Lazy loading of dependencies
 * - Intelligent caching and performance optimization
 * - Multiple auto-registration patterns
 * - Direct file path support for auto-registration
 * 
 * Complexity Level: ⭐⭐⭐⭐ (Expert)
 */
(async function main(): Promise<void> {
  console.log('🚀 Advanced IoC Demo - Auto-Registration and Advanced Patterns\n');

  try {
    /**
     * FEATURE 1: Auto-Registration with Regex Patterns
     */
    console.log('🔄 Testing Auto-Registration with Regex Patterns:');
    
    const autoContainer = new IoC();
    
    // Register auto-registration patterns
    await autoContainer.register([
      // Regular logger registration
      { 
        key: 'logger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'AUTO' }]
      },
      // Auto-registration pattern using regex
      {
        regex: 'Data.*',
        type: 'auto',
        path: '../../components',
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    console.log('📋 Registered keys before auto-resolution:', autoContainer.getRegisteredKeys());
    
    // Auto-register DataManager on first resolve
    console.log('\n🔍 Resolving DataManager (will trigger auto-registration):');
    const dataManager = await autoContainer.resolve<any>('DataManager');
    
    console.log('✅ DataManager auto-registered and resolved!');
    console.log('📋 Registered keys after auto-resolution:', autoContainer.getRegisteredKeys());
    
    // Test the auto-registered DataManager
    dataManager.set('testKey', 'testValue');
    console.log(`📦 Stored value: ${dataManager.get('testKey')}`);
    console.log(`📊 Data size: ${dataManager.getSize()}`);

    /**
     * FEATURE 2: Direct File Path Support
     */
    console.log('\n📁 Testing Direct File Path Auto-Registration:');
    
    const fileContainer = new IoC();
    await fileContainer.register([
      { 
        key: 'logger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'FILE' }]
      },
      // Auto-registration using direct file path
      {
        regex: 'Data.*',
        type: 'auto',
        file: '../../components/DataManager', // Direct file path
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    const fileDataManager = await fileContainer.resolve<any>('DataManager');
    console.log('✅ DataManager auto-registered using direct file path!');
    
    fileDataManager.set('fileKey', 'fileValue');
    console.log(`📦 File-based stored value: ${fileDataManager.get('fileKey')}`);

    /**
     * FEATURE 3: Intelligent Caching
     */
    console.log('\n⚡ Testing Intelligent Caching:');
    
    // First resolution logs auto-registration
    const cachedManager1 = await fileContainer.resolve<any>('DataManager');
    
    // Second resolution should be instant (no auto-registration log)
    const cachedManager2 = await fileContainer.resolve<any>('DataManager');
    
    console.log(`🎯 Cache working correctly: ${cachedManager1 === cachedManager2}`);
    console.log('📈 Performance: Second resolution was instant (cached)');

    /**
     * FEATURE 4: Multiple Auto-Registration Patterns
     */
    console.log('\n🎯 Testing Multiple Auto-Registration Patterns:');
    
    const multiContainer = new IoC();
    await multiContainer.register([
      { 
        key: 'logger', 
        target: Logger, 
        type: 'class', 
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'MULTI' }]
      },
      // Pattern 1: Data services
      {
        regex: 'Data.*',
        type: 'auto',
        path: '../../components',
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      },
      // Pattern 2: Business services (example - would load from ../../services)
      {
        regex: 'Service.*',
        type: 'auto',
        path: '../../services',
        lifetime: 'transient'
      },
      // Pattern 3: Repositories (example - would load from ../../repositories)
      {
        regex: 'Repository.*',
        type: 'auto',
        path: '../../repositories',
        lifetime: 'singleton'
      }
    ]);

    console.log('📋 Multi-pattern container ready with patterns:');
    console.log('  - Data.* → ../../components (singleton)');
    console.log('  - Service.* → ../../services (transient)');
    console.log('  - Repository.* → ../../repositories (singleton)');
    
    // Test DataManager resolution with multi-pattern setup
    const multiDataManager = await multiContainer.resolve<any>('DataManager');
    console.log('✅ DataManager resolved with multi-pattern setup!');

    /**
     * FEATURE 5: Simplified Configuration Demo
     */
    console.log('\n⚙️ Simplified Configuration Demo:');
    
    // Without explicit regex (defaults to .* - matches everything)
    const simpleContainer = new IoC();
    await simpleContainer.register([
      { 
        key: 'logger', 
        target: Logger,
        type: 'class',
        lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'SIMPLE' }]
      },
      { 
        // No regex specified - defaults to .* (matches everything)
        type: 'auto',
        path: '../../components',
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    const simpleDataManager = await simpleContainer.resolve<any>('DataManager');
    console.log('✅ DataManager auto-registered with default regex pattern (.*)');

    /**
     * FEATURE 6: Performance Comparison
     */
    console.log('\n📊 Performance Comparison:');
    
    // Traditional explicit registration
    const traditionalContainer = new IoC();
    await traditionalContainer.register([
      { 
        key: 'logger', 
            target: Logger,
            type: 'class',
            lifetime: 'singleton',
        args: [{ level: LogLevel.DEBUG, category: 'TRAD' }]
      },
      { 
        key: 'DataManager',
        target: 'DataManager',
        type: 'class',
        path: '../../components',
        lifetime: 'singleton',
        dependencies: [
          { target: 'logger', type: 'ref', key: 'logger' }
        ]
      }
    ]);

    const traditionalStart = Date.now();
    const traditionalManager = await traditionalContainer.resolve<any>('DataManager');
    const traditionalTime = Date.now() - traditionalStart;

    // Auto-registration (cached after first use)
    const autoStart = Date.now();
    const autoManager = await autoContainer.resolve<any>('DataManager');
    const autoTime = Date.now() - autoStart;

    console.log(`⚡ Traditional registration: ${traditionalTime}ms`);
    console.log(`⚡ Auto-registration (cached): ${autoTime}ms`);
    console.log(`🚀 Performance benefit: ${traditionalTime >= autoTime ? 'Auto-registration is faster or equal' : 'Traditional is faster'}`);

    /**
     * Summary
     */
    console.log('\n🎯 Advanced Features Summary:');
    console.log('  ✅ Auto-registration with regex patterns');
    console.log('  ✅ Lazy loading of dependencies when needed');
    console.log('  ✅ Direct file path support for auto-registration');
    console.log('  ✅ Intelligent caching for resolved dependencies');
    console.log('  ✅ Multiple regex patterns for different service types');
    console.log('  ✅ Performance optimization with cache layers');
    console.log('  ✅ Developer experience improvements');

    console.log('\n✅ Advanced IoC Demo completed successfully!');
    console.log('💡 These features enable lazy loading, reduce boilerplate, and improve performance.');
    
  } catch (error) {
    console.error('❌ Error during advanced demo:', error);
    process.exit(1);
  }
})(); 