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
    
    // Test all log methods with new structure
    logger.error('This is an error message');
    logger.warn('This is a warning message');
    logger.debug('This is a debug message');
    logger.info('This is an info message');
    
    console.log(''); // Empty line for separation
  });
}

/**
 * Demo showing logger with metadata and flow IDs
 */
function demonstrateMetadata(): void {
  console.log('\n🏷️ === METADATA DEMONSTRATION ===\n');
  
  const logger = new Logger({ level: LogLevel.INFO, category: 'METADATA' });
  
  // Using new object structure with flow ID
  const loginFlowId = '20241220150000001';
  
  logger.info({
    message: 'User login attempt',
    data: { 
      userId: 12345, 
      username: 'john_doe', 
      ip: '192.168.1.1',
      timestamp: new Date()
    },
    flow: loginFlowId
  });
  
  logger.error({
    message: 'Database connection failed',
    data: {
      database: 'users_db',
      host: 'localhost',
      port: 5432,
      error: 'Connection timeout'
    },
    flow: loginFlowId
  });
  
  logger.warn({
    message: 'High memory usage detected',
    data: {
      usage: '85%',
      threshold: '80%',
      pid: 1234
    }
    // Note: flow ID will be auto-generated when not provided
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
  objectLogger.error({
    message: 'This is an error as object',
    data: { code: 500, details: 'Internal Server Error' }
  });
  
  console.log('\nJSON string output:');
  const jsonLogger = new Logger({ level: LogLevel.INFO, category: 'JSON', type: 'json' });
  jsonLogger.info('This is a JSON string output');
  jsonLogger.error({
    message: 'This is an error as JSON',
    data: { code: 404, details: 'Not Found' }
  });
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
 * Demo showing different categories and flow-based logging
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
 * Demo showing new flow-based logging features
 */
function demonstrateFlowBasedLogging(): void {
  console.log('\n🌊 === FLOW-BASED LOGGING DEMONSTRATION ===\n');
  
  const logger = new Logger({ level: LogLevel.INFO, category: 'FLOW' });
  
  // Test 1: Auto-generated flow IDs
  console.log('1. Auto-generated flow IDs:');
  logger.info({
    message: 'Process started',
    data: { processId: 'proc-001', type: 'data-sync' }
  });
  
  logger.info({
    message: 'Process completed',
    data: { processId: 'proc-001', duration: '2.5s', status: 'success' }
  });
  
  // Test 2: Custom flow ID for workflow tracking
  console.log('\n2. Custom flow ID for workflow tracking:');
  const workflowFlowId = '20241220150500001';
  
  logger.info({
    message: 'Workflow started',
    data: { workflowName: 'user-registration', step: 'validation' },
    flow: workflowFlowId
  });
  
  logger.warn({
    message: 'Validation warning',
    data: { field: 'email', issue: 'domain not verified' },
    flow: workflowFlowId
  });
  
  logger.info({
    message: 'Workflow completed',
    data: { workflowName: 'user-registration', step: 'completion', userId: 'user-456' },
    flow: workflowFlowId
  });
  
  // Test 3: Mixed input types
  console.log('\n3. Mixed input types:');
  logger.info('Simple string message');
  logger.warn(404);
  logger.error({
    message: 'Complex error with data',
    data: { module: 'auth', errorCode: 'AUTH_001', timestamp: new Date() }
  });
}

/**
 * Main demo function
 */
export function runLoggerDemo(): void {
  console.log('🚀 Starting Enhanced Logger Demo...\n');
  
  demonstrateLogLevels();
  demonstrateMetadata();
  demonstrateOutputFormats();
  demonstrateSettings();
  demonstrateCategories();
  demonstrateLevelHierarchy();
  demonstrateFlowBasedLogging();
  
  console.log('\n🎯 Enhanced logger demo completed successfully!');
  console.log('\n✨ New features demonstrated:');
  console.log('  • Flow-based logging with auto-generated IDs');
  console.log('  • Custom flow IDs for workflow tracking');
  console.log('  • Mixed input types (string, number, object)');
  console.log('  • Enhanced metadata structure');
  console.log('  • Date field instead of timestamp for readability');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runLoggerDemo();
} 