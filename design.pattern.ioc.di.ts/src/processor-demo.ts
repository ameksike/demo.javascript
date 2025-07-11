import { 
  Logger, 
  LogLevel, 
  LoggerConfig, 
  LogProcessor,
  ConsoleLogProcessor,
  MongoDBLogProcessor,
  FileLogProcessor,
  HybridLogProcessor,
  LogEntry,
  LogOutputType
} from './tools/log';

/**
 * Custom email log processor - sends critical logs via email
 */
class EmailLogProcessor implements LogProcessor {
  private smtpConfig: { host: string; port: number; user: string };

  constructor(smtpConfig = { host: 'smtp.example.com', port: 587, user: 'app@example.com' }) {
    this.smtpConfig = smtpConfig;
  }

  process(entry: LogEntry, level: LogLevel, outputType: LogOutputType): void {
    // Only send emails for ERROR level logs
    if (level === LogLevel.ERROR) {
      const emailBody = `
        Alert: Critical Error Detected
        
        Level: ${entry.level}
        Message: ${entry.message}
        Category: ${entry.category || 'Unknown'}
        Date: ${entry.date}
        Flow: ${entry.flow}
        Data: ${entry.data ? JSON.stringify(entry.data, null, 2) : 'None'}
        
        Please investigate immediately.
      `;
      
      // Simulate email sending
      console.log(`[EMAIL] Sending alert to admin@example.com via ${this.smtpConfig.host}:`);
      console.log(`Subject: Critical Error Alert - ${entry.category || 'Application'}`);
      console.log(`Body: ${emailBody}`);
    }
  }
}

/**
 * Demo showing different log processors
 */
function demonstrateLogProcessors(): void {
  console.log('🔧 === LOG PROCESSORS DEMONSTRATION ===\n');

  // 1. Console processor (default)
  console.log('1. Console Processor (default):');
  const consoleLogger = new Logger({ 
    level: LogLevel.INFO, 
    category: 'CONSOLE', 
    type: 'object'
  });
  consoleLogger.info('This goes to console');
  consoleLogger.error({
    message: 'Console error message',
    data: { errorCode: 500 }
  });

  // 2. MongoDB processor
  console.log('\n2. MongoDB Processor:');
  const mongoProcessor = new MongoDBLogProcessor('mongodb://localhost:27017', 'app_logs', 'errors');
  const mongoLogger = new Logger({ 
    level: LogLevel.DEBUG, 
    category: 'MONGO', 
    type: 'json',
    processor: mongoProcessor
  });
  mongoLogger.debug('Debug message for MongoDB');
  mongoLogger.error({
    message: 'Error stored in MongoDB',
    data: { userId: 123, action: 'login' }
  });

  // 3. File processor
  console.log('\n3. File Processor:');
  const fileProcessor = new FileLogProcessor('./logs/application.log');
  const fileLogger = new Logger({ 
    level: LogLevel.WARN, 
    category: 'FILE', 
    type: 'json',
    processor: fileProcessor
  });
  fileLogger.warn('Warning logged to file');
  fileLogger.error({
    message: 'Error logged to file',
    data: { component: 'auth', details: 'Token expired' }
  });

  // 4. Email processor
  console.log('\n4. Email Processor (only for errors):');
  const emailProcessor = new EmailLogProcessor();
  const emailLogger = new Logger({ 
    level: LogLevel.ERROR, 
    category: 'EMAIL', 
    type: 'object',
    processor: emailProcessor
  });
  emailLogger.info('This info will not trigger email'); // Won't send email
  emailLogger.error({
    message: 'Critical system failure',
    data: { 
      service: 'payment-gateway',
      affectedUsers: 1500,
      downtime: '2 minutes'
    }
  });
}

/**
 * Demo showing hybrid processors
 */
function demonstrateHybridProcessor(): void {
  console.log('\n🔀 === HYBRID PROCESSOR DEMONSTRATION ===\n');

  // Create a hybrid processor that logs to console, file, and MongoDB
  const hybridProcessor = new HybridLogProcessor([
    new ConsoleLogProcessor(),
    new FileLogProcessor('./logs/hybrid.log'),
    new MongoDBLogProcessor()
  ]);

  const hybridLogger = new Logger({
    level: LogLevel.INFO,
    category: 'HYBRID',
    type: 'object',
    processor: hybridProcessor
  });

  console.log('Logging with hybrid processor (goes to console, file, and MongoDB):');
  
  // Using shared flow ID for related operations
  const sessionFlowId = '20241220152000001';
  
  hybridLogger.info({
    message: 'User authenticated successfully',
    data: { 
      userId: 'user789',
      loginTime: new Date().toISOString(),
      ip: '192.168.1.100'
    },
    flow: sessionFlowId
  });

  hybridLogger.error({
    message: 'Database connection failed',
    data: {
      database: 'user_db',
      error: 'Connection timeout after 30s',
      retryAttempt: 3
    },
    flow: sessionFlowId
  });
}

/**
 * Demo showing custom logger extension
 */
class DatabaseLogger extends Logger {
  private tableName: string;

  constructor(config: LoggerConfig & { tableName?: string }) {
    super(config);
    this.tableName = config.tableName || 'logs';
  }

  // Override the process method to add custom behavior
  protected process(entry: LogEntry, level: LogLevel): void {
    // Add custom fields before processing
    const enhancedEntry = {
      ...entry,
      tableName: this.tableName,
      processedBy: 'DatabaseLogger',
      serverInfo: {
        hostname: 'app-server-01',
        pid: process.pid,
        memory: process.memoryUsage()
      }
    };

    // Call parent process method with enhanced entry
    super.process(enhancedEntry, level);
  }
}

function demonstrateLoggerExtension(): void {
  console.log('\n🎯 === LOGGER EXTENSION DEMONSTRATION ===\n');

  const dbLogger = new DatabaseLogger({
    level: LogLevel.INFO,
    category: 'DB-EXTENDED',
    type: 'object',
    tableName: 'application_events',
    processor: new ConsoleLogProcessor()
  });

  console.log('Using extended DatabaseLogger with custom process method:');
  dbLogger.info('Custom logger with enhanced data');
  dbLogger.error({
    message: 'Error with server information',
    data: { 
      operation: 'user-creation',
      duration: '1.5s'
    }
  });
}

/**
 * Demo showing dynamic processor switching
 */
function demonstrateDynamicProcessorSwitching(): void {
  console.log('\n🔄 === DYNAMIC PROCESSOR SWITCHING ===\n');

  const logger = new Logger({
    level: LogLevel.INFO,
    category: 'DYNAMIC',
    type: 'object',
    processor: new ConsoleLogProcessor()
  });

  console.log('1. Initially using Console processor:');
  logger.info('Message with console processor');

  console.log('\n2. Switching to MongoDB processor:');
  logger.setting({ processor: new MongoDBLogProcessor() });
  logger.info('Message with MongoDB processor');

  console.log('\n3. Switching to hybrid processor:');
  const hybridProcessor = new HybridLogProcessor([
    new ConsoleLogProcessor(),
    new EmailLogProcessor()
  ]);
  logger.setting({ processor: hybridProcessor });
  logger.error('Critical error with hybrid processor');
}

/**
 * Demo showing flow-based logging across different processors
 */
function demonstrateFlowBasedProcessing(): void {
  console.log('\n🌊 === FLOW-BASED PROCESSING DEMONSTRATION ===\n');

  // Create different loggers with different processors
  const consoleLogger = new Logger({ 
    level: LogLevel.INFO, 
    category: 'CONSOLE-FLOW', 
    type: 'object',
    processor: new ConsoleLogProcessor()
  });

  const fileLogger = new Logger({ 
    level: LogLevel.INFO, 
    category: 'FILE-FLOW', 
    type: 'json',
    processor: new FileLogProcessor('./logs/flow-demo.log')
  });

  const emailLogger = new Logger({ 
    level: LogLevel.ERROR, 
    category: 'EMAIL-FLOW', 
    type: 'object',
    processor: new EmailLogProcessor()
  });

  // Simulate a workflow that spans multiple processors
  const workflowFlowId = '20241220152500001';

  console.log('Simulating workflow across different processors:');
  
  consoleLogger.info({
    message: 'Workflow started',
    data: { 
      workflowType: 'data-migration',
      estimatedDuration: '30 minutes'
    },
    flow: workflowFlowId
  });

  fileLogger.info({
    message: 'Data extraction phase',
    data: { 
      source: 'legacy-db',
      recordCount: 10000,
      phase: 'extraction'
    },
    flow: workflowFlowId
  });

  fileLogger.warn({
    message: 'Performance degradation detected',
    data: { 
      currentSpeed: '50 records/sec',
      expectedSpeed: '100 records/sec',
      phase: 'transformation'
    },
    flow: workflowFlowId
  });

  emailLogger.error({
    message: 'Critical error in data migration',
    data: { 
      errorType: 'data_corruption',
      affectedRecords: 150,
      phase: 'transformation',
      requiresManualIntervention: true
    },
    flow: workflowFlowId
  });

  console.log('\n✨ Benefits of flow-based processing:');
  console.log('- Track workflows across different output destinations');
  console.log('- Correlate logs from different processors');
  console.log('- Maintain context across logging layers');
  console.log('- Enable advanced log analytics and monitoring');
}

/**
 * Main demo function
 */
export function runProcessorDemo(): void {
  console.log('🚀 Starting Enhanced Log Processors Demo...\n');

  demonstrateLogProcessors();
  demonstrateHybridProcessor();
  demonstrateLoggerExtension();
  demonstrateDynamicProcessorSwitching();
  demonstrateFlowBasedProcessing();

  console.log('\n🎯 Enhanced processors demo completed successfully!');
  console.log('\nKey benefits of log processors:');
  console.log('- ✅ Separation of concerns (logging logic vs output logic)');
  console.log('- ✅ Easy to switch between different storage mechanisms');
  console.log('- ✅ Support for multiple simultaneous outputs');
  console.log('- ✅ Extensible architecture for custom processors');
  console.log('- ✅ Runtime configuration changes');
  console.log('- ✅ Easy testing with mock processors');
  console.log('- ✅ Flow-based tracking across different processors');
  console.log('- ✅ Enhanced log structure with date and flow IDs');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runProcessorDemo();
} 