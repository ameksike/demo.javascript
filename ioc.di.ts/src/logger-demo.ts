import { Logger, LogLevel, LoggerConfig, LogOutputType } from './tools/log';

/**
 * Demo showing different log levels and their behavior
 */
function demonstrateLogLevels(): void {
  console.log('🔍 === LOG LEVELS DEMONSTRATION ===\n');

  const levels = [
    { level: LogLevel.NONE, name: 'NONE (0)' },
    { level: LogLevel.ERROR, name: 'ERROR (1)' },
    { level: LogLevel.WARN, name: 'WARN (2)' },
    { level: LogLevel.DEBUG, name: 'DEBUG (3)' },
    { level: LogLevel.INFO, name: 'INFO (4)' },
    { level: LogLevel.ALL, name: 'ALL (-1)' }
  ];

  levels.forEach(({ level, name }) => {
    console.log(`\n📊 Testing with level: ${name}`);
    console.log('=' + '='.repeat(40));
    
    const logger = new Logger({ level, category: 'DEMO' });
    
    // Test all log methods
    logger.error('This is an error message');
    logger.warn('This is a warning message');
    logger.debug('This is a debug message');
    logger.info('This is an info message');
    
    console.log(''); // Empty line for separation
  });
}

/**
 * Demo showing logger with metadata
 */
function demonstrateMetadata(): void {
  console.log('\n🏷️ === METADATA DEMONSTRATION ===\n');
  
  const logger = new Logger({ level: LogLevel.INFO, category: 'METADATA' });
  
  logger.info('User login attempt', { 
    userId: 12345, 
    username: 'john_doe', 
    ip: '192.168.1.1',
    timestamp: new Date()
  });
  
  logger.error('Database connection failed', {
    database: 'users_db',
    host: 'localhost',
    port: 5432,
    error: 'Connection timeout'
  });
  
  logger.warn('High memory usage detected', {
    usage: '85%',
    threshold: '80%',
    pid: 1234
  });
}

/**
 * Demo showing different output formats
 */
function demonstrateOutputFormats(): void {
  console.log('\n📄 === OUTPUT FORMATS DEMONSTRATION ===\n');
  
  console.log('Object output (default):');
  const objectLogger = new Logger({ level: LogLevel.INFO, category: 'OBJ', type: 'object' });
  objectLogger.info('This is an object output');
  objectLogger.error('This is an error as object', { code: 500, details: 'Internal Server Error' });
  
  console.log('\nJSON string output:');
  const jsonLogger = new Logger({ level: LogLevel.INFO, category: 'JSON', type: 'json' });
  jsonLogger.info('This is a JSON string output');
  jsonLogger.error('This is an error as JSON', { code: 404, details: 'Not Found' });
}

/**
 * Demo showing dynamic settings changes
 */
function demonstrateSettings(): void {
  console.log('\n🔧 === SETTINGS DEMONSTRATION ===\n');
  
  const logger = new Logger({ level: LogLevel.ERROR, category: 'SETTINGS' });
  
  console.log('Initial settings - Level: ERROR, Category: SETTINGS, JSON: false');
  logger.info('This info message will NOT show');
  logger.error('This error message will show');
  
  console.log('\nChanging settings to Level: INFO, Category: UPDATED, Type: JSON');
  logger.setting({ level: LogLevel.INFO, category: 'UPDATED', type: 'json' });
  
  logger.info('This info message will now show');
  logger.debug('This debug message will NOT show (level is INFO)');
  logger.warn('This warning will show');
  
  console.log('\nChanging to Level: ALL');
  logger.setting({ level: LogLevel.ALL });
  
  logger.debug('This debug message will now show');
  logger.info('This info message will show');
}

/**
 * Demo showing different categories
 */
function demonstrateCategories(): void {
  console.log('\n📂 === CATEGORIES DEMONSTRATION ===\n');
  
  const authLogger = new Logger({ level: LogLevel.INFO, category: 'AUTH' });
  const dbLogger = new Logger({ level: LogLevel.DEBUG, category: 'DATABASE' });
  const apiLogger = new Logger({ level: LogLevel.WARN, category: 'API' });
  
  console.log('Auth logger (INFO level):');
  authLogger.info('User authentication successful');
  authLogger.debug('This debug message will NOT show');
  
  console.log('\nDatabase logger (DEBUG level):');
  dbLogger.debug('SQL query executed');
  dbLogger.info('Connection established');
  
  console.log('\nAPI logger (WARN level):');
  apiLogger.info('This info message will NOT show');
  apiLogger.warn('Rate limit approaching');
  apiLogger.error('Endpoint timeout');
}

/**
 * Demo showing level hierarchy
 */
function demonstrateLevelHierarchy(): void {
  console.log('\n📊 === LEVEL HIERARCHY DEMONSTRATION ===\n');
  
  const logger = new Logger({ level: LogLevel.WARN, category: 'HIERARCHY' });
  
  console.log('Logger level set to WARN (2) - should show ERROR and WARN only:');
  logger.error('ERROR (1) - Will show');
  logger.warn('WARN (2) - Will show');
  logger.debug('DEBUG (3) - Will NOT show');
  logger.info('INFO (4) - Will NOT show');
  
  console.log('\nChanging level to ALL (-1) - should show all messages:');
  logger.setting({ level: LogLevel.ALL });
  logger.error('ERROR (1) - Will show');
  logger.warn('WARN (2) - Will show');
  logger.debug('DEBUG (3) - Will show');
  logger.info('INFO (4) - Will show');
}

/**
 * Main demo function
 */
export function runLoggerDemo(): void {
  console.log('🚀 Starting Simplified Logger Demo...\n');
  
  demonstrateLogLevels();
  demonstrateMetadata();
  demonstrateOutputFormats();
  demonstrateSettings();
  demonstrateCategories();
  demonstrateLevelHierarchy();
  
  console.log('\n🎯 Logger demo completed successfully!');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runLoggerDemo();
} 