import { Logger, LogLevel, LoggerConfig, LogOutputType } from './tools/log';

/**
 * Logger System Demo - Advanced Logging Capabilities
 * 
 * This demo demonstrates the enhanced logging system features:
 * - Multiple log levels and their hierarchy
 * - Flow-based logging with automatic flow IDs
 * - Metadata support for structured logging
 * - Dynamic configuration changes
 * - Different output formats (object vs JSON)
 * - Category-based logging for different modules
 * 
 * Complexity Level: ⭐⭐ (Intermediate)
 */
(async function main(): Promise<void> {
  console.log('🚀 Logger System Demo - Advanced Logging Capabilities\n');

  try {
    /**
     * Basic log levels demonstration
     * Shows the hierarchical nature of log levels
     */
    function demonstrateLogLevels(): void {
      console.log('🔍 === LOG LEVELS DEMONSTRATION ===\n');

      const levels = [
        { level: LogLevel.NONE, name: 'NONE (0) - No logging' },
        { level: LogLevel.ERROR, name: 'ERROR (1) - Critical errors only' },
        { level: LogLevel.WARN, name: 'WARN (2) - Warnings and errors' },
        { level: LogLevel.DEBUG, name: 'DEBUG (3) - Debug, warnings, and errors' },
        { level: LogLevel.INFO, name: 'INFO (4) - All except verbose' },
        { level: LogLevel.ALL, name: 'ALL (-1) - Everything' }
      ];

      levels.forEach(({ level, name }) => {
        console.log(`\n📊 Testing with level: ${name}`);
        console.log('=' + '='.repeat(50));
        
        const logger = new Logger({ level, category: 'DEMO' });
        
        // Test all log methods to show hierarchy
        logger.error('❌ This is an error message');
        logger.warn('⚠️ This is a warning message');
        logger.debug('🐛 This is a debug message');
        logger.info('ℹ️ This is an info message');
        
        console.log(''); // Empty line for separation
      });
    }

    /**
     * Flow-based logging demonstration
     * Shows how to track related operations with flow IDs
     */
    function demonstrateFlowBasedLogging(): void {
      console.log('\n🌊 === FLOW-BASED LOGGING DEMONSTRATION ===\n');
      
      const logger = new Logger({ level: LogLevel.INFO, category: 'FLOW' });
      
      // Auto-generated flow IDs for simple operations
      console.log('1. Auto-generated flow IDs:');
      logger.info({
        message: 'Process started',
        data: { processId: 'proc-001', type: 'data-sync' }
      });
      
      logger.info({
        message: 'Process in progress',
        data: { processId: 'proc-001', progress: '50%' }
      });
      
      logger.info({
        message: 'Process completed',
        data: { processId: 'proc-001', duration: '2.5s', status: 'success' }
      });
      
      // Custom flow ID for workflow tracking
      console.log('\n2. Custom flow ID for workflow tracking:');
      const workflowFlowId = '20241220150500001';
      
      logger.info({
        message: 'User registration workflow started',
        data: { workflowName: 'user-registration', step: 'validation' },
        flow: workflowFlowId
      });
      
      logger.warn({
        message: 'Email validation warning',
        data: { email: 'user@example.com', issue: 'domain not verified' },
        flow: workflowFlowId
      });
      
      logger.info({
        message: 'User registration completed',
        data: { userId: 12345, status: 'active' },
        flow: workflowFlowId
      });
    }

    /**
     * Structured logging with metadata demonstration
     * Shows how to include rich data structures in logs
     */
    function demonstrateStructuredLogging(): void {
      console.log('\n🏷️ === STRUCTURED LOGGING DEMONSTRATION ===\n');
      
      const logger = new Logger({ level: LogLevel.INFO, category: 'STRUCTURED' });
      
      // Simple string logging
      console.log('1. Simple string logging:');
      logger.info('Simple info message');
      logger.warn('Simple warning message');
      
      // Complex object logging with metadata
      console.log('\n2. Complex object logging with metadata:');
      logger.info({
        message: 'User login attempt',
        data: { 
          userId: 12345, 
          username: 'john_doe', 
          ip: '192.168.1.1',
          timestamp: new Date().toISOString(),
          userAgent: 'Mozilla/5.0...'
        }
      });
      
      logger.error({
        message: 'Database connection failed',
        data: {
          database: 'users_db',
          host: 'localhost',
          port: 5432,
          error: 'Connection timeout',
          retryAttempt: 3,
          maxRetries: 5
        }
      });
      
      // Numeric logging
      console.log('\n3. Numeric and mixed data logging:');
      logger.info({
        message: 'Performance metrics',
        data: {
          responseTime: 125.6,
          throughput: 1250,
          errorRate: 0.002,
          memoryUsage: '64MB',
          cpuUsage: '12%'
        }
      });
    }

    /**
     * Output format demonstration
     * Shows different logging output formats
     */
    function demonstrateOutputFormats(): void {
      console.log('\n📄 === OUTPUT FORMATS DEMONSTRATION ===\n');
      
      console.log('1. Object output (default - human readable):');
      const objectLogger = new Logger({ 
        level: LogLevel.INFO, 
        category: 'OBJECT', 
        type: 'object' 
      });
      
      objectLogger.info('This is an object output');
      objectLogger.error({
        message: 'Error with structured data',
        data: { code: 500, details: 'Internal Server Error', timestamp: Date.now() }
      });
      
      console.log('\n2. JSON string output (machine readable):');
      const jsonLogger = new Logger({ 
        level: LogLevel.INFO, 
        category: 'JSON', 
        type: 'json' 
      });
      
      jsonLogger.info('This is a JSON string output');
      jsonLogger.error({
        message: 'Error in JSON format',
        data: { code: 404, details: 'Resource not found', requestId: 'req-123' }
      });
    }

    /**
     * Dynamic configuration demonstration
     * Shows how to change logger settings at runtime
     */
    function demonstrateDynamicConfiguration(): void {
      console.log('\n🔧 === DYNAMIC CONFIGURATION DEMONSTRATION ===\n');
      
      const logger = new Logger({ 
        level: LogLevel.ERROR, 
        category: 'DYNAMIC', 
        type: 'object' 
      });
      
      console.log('1. Initial settings - Level: ERROR, Category: DYNAMIC, Type: OBJECT');
      logger.info('ℹ️ This info message will NOT show (level too low)');
      logger.warn('⚠️ This warning message will NOT show (level too low)');
      logger.error('❌ This error message WILL show');
      
      console.log('\n2. Changing to Level: INFO, Category: UPDATED, Type: JSON');
      logger.setting({ 
        level: LogLevel.INFO, 
        category: 'UPDATED', 
        type: 'json' 
      });
      
      logger.info('ℹ️ This info message will now show');
      logger.debug('🐛 This debug message will NOT show (level is INFO, not DEBUG)');
      logger.warn('⚠️ This warning will show');
      
      console.log('\n3. Changing to Level: ALL (shows everything)');
      logger.setting({ level: LogLevel.ALL });
      
      logger.debug('🐛 This debug message will now show');
      logger.info('ℹ️ This info message will show');
      
      console.log('\n4. Configuration introspection:');
      console.log(`   Current level: ${logger.getLevel()}`);
      console.log(`   Current category: ${logger.getCategory()}`);
      console.log(`   Current output type: ${logger.getOutputType()}`);
    }

    /**
     * Category-based logging demonstration
     * Shows how different modules can use separate logger configurations
     */
    function demonstrateCategoryBasedLogging(): void {
      console.log('\n📂 === CATEGORY-BASED LOGGING DEMONSTRATION ===\n');
      
      const authLogger = new Logger({ level: LogLevel.INFO, category: 'AUTH' });
      const dbLogger = new Logger({ level: LogLevel.DEBUG, category: 'DATABASE' });
      const apiLogger = new Logger({ level: LogLevel.WARN, category: 'API' });
      
      console.log('1. Authentication logger (INFO level):');
      authLogger.info('User authentication successful');
      authLogger.debug('🐛 This debug message will NOT show (level is INFO)');
      authLogger.warn('Session expires in 5 minutes');
      
      console.log('\n2. Database logger (DEBUG level - shows everything):');
      dbLogger.debug('SQL query executed: SELECT * FROM users WHERE id = ?');
      dbLogger.info('Database connection established');
      dbLogger.warn('Query execution time exceeded threshold: 250ms');
      
      console.log('\n3. API logger (WARN level - only warnings and errors):');
      apiLogger.info('ℹ️ This info message will NOT show (level too low)');
      apiLogger.warn('Rate limit approaching: 95% of quota used');
      apiLogger.error('API endpoint timeout: /api/users/profile');
    }

    /**
     * Execute all demonstrations in logical progression
     */
    console.log('Starting Logger System Demo...\n');

    // 1. Basic concepts
    demonstrateLogLevels();
    
    // 2. Advanced features
    demonstrateFlowBasedLogging();
    demonstrateStructuredLogging();
    
    // 3. Configuration and formatting
    demonstrateOutputFormats();
    demonstrateDynamicConfiguration();
    
    // 4. Practical usage patterns
    demonstrateCategoryBasedLogging();

    /**
     * Summary of logger capabilities
     */
    console.log('\n🎯 Logger Demo Summary:');
    console.log('  ✅ Hierarchical log levels (NONE, ERROR, WARN, DEBUG, INFO, ALL)');
    console.log('  ✅ Flow-based logging with automatic/custom flow IDs');
    console.log('  ✅ Structured logging with rich metadata support');
    console.log('  ✅ Multiple output formats (object/JSON)');
    console.log('  ✅ Dynamic runtime configuration changes');
    console.log('  ✅ Category-based logging for different modules');
    console.log('  ✅ Performance optimized with lazy evaluation');
    console.log('  ✅ Type-safe with full TypeScript support');

    console.log('\n✅ Logger System Demo completed successfully!');

  } catch (error) {
    console.error('❌ Error during logger demo:', error);
    process.exit(1);
  }
})(); 