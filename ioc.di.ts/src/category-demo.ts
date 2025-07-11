import { Logger, LogLevel, LoggerConfig } from './tools/log';

/**
 * Demo showing the purpose and usage of logger categories
 * 
 * Categories are used to identify the SOURCE or MODULE of a log message.
 * This helps in:
 * - Filtering logs by component/module
 * - Understanding the application flow
 * - Debugging specific parts of the system
 * - Log analysis and monitoring
 */
function demonstrateCategories(): void {
  console.log('📂 === LOGGER CATEGORIES DEMONSTRATION ===\n');
  
  // Simulate different modules/components of an application
  const authLogger = new Logger({ level: LogLevel.INFO, category: 'AUTH', type: 'object' });
  const dbLogger = new Logger({ level: LogLevel.DEBUG, category: 'DATABASE', type: 'object' });
  const apiLogger = new Logger({ level: LogLevel.INFO, category: 'API-GATEWAY', type: 'object' });
  const paymentLogger = new Logger({ level: LogLevel.WARN, category: 'PAYMENT', type: 'json' });
  
  console.log('=== Authentication Module ===');
  authLogger.info('User login attempt', { 
    userId: 'user123', 
    ip: '192.168.1.100',
    userAgent: 'Chrome/91.0'
  });
  authLogger.error('Invalid credentials', { 
    userId: 'user123', 
    attempts: 3,
    blocked: true
  });
  
  console.log('\n=== Database Module ===');
  dbLogger.debug('Executing SQL query', { 
    query: 'SELECT * FROM users WHERE id = ?',
    params: [123],
    executionTime: '45ms'
  });
  dbLogger.warn('Connection pool running low', { 
    activeConnections: 8,
    maxConnections: 10,
    threshold: 80
  });
  
  console.log('\n=== API Gateway Module ===');
  apiLogger.info('Request received', { 
    method: 'POST',
    endpoint: '/api/v1/users',
    clientId: 'mobile-app',
    requestId: 'req-789'
  });
  apiLogger.error('Rate limit exceeded', { 
    clientId: 'mobile-app',
    currentRate: 1000,
    limitPerMinute: 500
  });
  
  console.log('\n=== Payment Module (JSON format) ===');
  paymentLogger.warn('Payment processing slow', { 
    transactionId: 'tx-456',
    processingTime: '5.2s',
    threshold: '3s',
    provider: 'stripe'
  });
  paymentLogger.error('Payment failed', { 
    transactionId: 'tx-789',
    amount: 99.99,
    currency: 'USD',
    errorCode: 'INSUFFICIENT_FUNDS',
    userId: 'user456'
  });
}

/**
 * Demo showing how categories help in log analysis
 */
function demonstrateLogAnalysis(): void {
  console.log('\n🔍 === LOG ANALYSIS WITH CATEGORIES ===\n');
  
  const systemLogger = new Logger({ level: LogLevel.INFO, category: 'SYSTEM', type: 'json' });
  const securityLogger = new Logger({ level: LogLevel.ERROR, category: 'SECURITY', type: 'json' });
  const performanceLogger = new Logger({ level: LogLevel.WARN, category: 'PERFORMANCE', type: 'json' });
  
  console.log('Simulating a system incident with logs from different components:');
  console.log('(Notice how category helps identify the source of each log)\n');
  
  // Simulate an incident timeline
  systemLogger.info('Application started', { version: '1.2.3', port: 3000 });
  
  performanceLogger.warn('High CPU usage detected', { 
    cpuUsage: '85%',
    threshold: '80%',
    duration: '2 minutes'
  });
  
  securityLogger.error('Suspicious activity detected', { 
    event: 'Multiple failed login attempts',
    sourceIP: '192.168.1.999',
    attempts: 50,
    timeWindow: '1 minute'
  });
  
  systemLogger.error('Service unavailable', { 
    service: 'user-service',
    reason: 'Too many connections',
    lastHealthCheck: '2024-01-10T10:30:00Z'
  });
  
  performanceLogger.error('Memory leak detected', { 
    memoryUsage: '95%',
    availableMemory: '512MB',
    usedMemory: '487MB'
  });
  
  console.log('\nWith categories, you can easily:');
  console.log('- Filter logs by component (grep "SECURITY" logs.txt)');
  console.log('- Identify problematic modules');
  console.log('- Set different log levels per category');
  console.log('- Route logs to different destinations');
}

/**
 * Demo showing category best practices
 */
function demonstrateCategoryBestPractices(): void {
  console.log('\n📋 === CATEGORY BEST PRACTICES ===\n');
  
  console.log('✅ Good category examples:');
  const examples = [
    { category: 'AUTH', description: 'Authentication and authorization' },
    { category: 'DB', description: 'Database operations' },
    { category: 'API', description: 'API endpoints' },
    { category: 'PAYMENT', description: 'Payment processing' },
    { category: 'EMAIL', description: 'Email service' },
    { category: 'CACHE', description: 'Caching layer' },
    { category: 'QUEUE', description: 'Message queue operations' },
    { category: 'SCHEDULER', description: 'Background jobs' }
  ];
  
  examples.forEach(({ category, description }) => {
    const logger = new Logger({ level: LogLevel.INFO, category, type: 'object' });
    logger.info(`${description} example`, { 
      timestamp: new Date().toISOString(),
      example: true
    });
  });
  
  console.log('\n📏 Category naming conventions:');
  console.log('- Use UPPERCASE for consistency');
  console.log('- Keep them short but descriptive');
  console.log('- Use hyphens for multi-word categories (API-GATEWAY)');
  console.log('- Be consistent across your application');
  console.log('- Consider hierarchical naming (USER-AUTH, USER-PROFILE)');
}

/**
 * Main demo function
 */
export function runCategoryDemo(): void {
  console.log('🚀 Starting Logger Categories Demo...\n');
  
  demonstrateCategories();
  demonstrateLogAnalysis();
  demonstrateCategoryBestPractices();
  
  console.log('\n🎯 Categories demo completed successfully!');
  console.log('\nKey takeaways:');
  console.log('- Categories identify the SOURCE/MODULE of each log');
  console.log('- They help in filtering, debugging, and monitoring');
  console.log('- Different categories can have different log levels');
  console.log('- Use consistent naming conventions');
  console.log('- Categories are essential for production log analysis');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runCategoryDemo();
} 