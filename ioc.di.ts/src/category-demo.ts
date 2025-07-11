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
  authLogger.info({
    message: 'User login attempt',
    data: { 
      userId: 'user123', 
      ip: '192.168.1.100',
      userAgent: 'Chrome/91.0'
    }
  });
  authLogger.error({
    message: 'Invalid credentials',
    data: { 
      userId: 'user123', 
      attempts: 3,
      blocked: true
    }
  });
  
  console.log('\n=== Database Module ===');
  dbLogger.debug({
    message: 'Executing SQL query',
    data: { 
      query: 'SELECT * FROM users WHERE id = ?',
      params: [123],
      executionTime: '45ms'
    }
  });
  dbLogger.warn({
    message: 'Connection pool running low',
    data: { 
      activeConnections: 8,
      maxConnections: 10,
      threshold: 80
    }
  });
  
  console.log('\n=== API Gateway Module ===');
  apiLogger.info({
    message: 'Request received',
    data: { 
      method: 'POST',
      endpoint: '/api/v1/users',
      clientId: 'mobile-app',
      requestId: 'req-789'
    }
  });
  apiLogger.error({
    message: 'Rate limit exceeded',
    data: { 
      clientId: 'mobile-app',
      currentRate: 1000,
      limitPerMinute: 500
    }
  });
  
  console.log('\n=== Payment Module (JSON format) ===');
  paymentLogger.warn({
    message: 'Payment processing slow',
    data: { 
      transactionId: 'tx-456',
      processingTime: '5.2s',
      threshold: '3s',
      provider: 'stripe'
    }
  });
  paymentLogger.error({
    message: 'Payment failed',
    data: { 
      transactionId: 'tx-789',
      amount: 99.99,
      currency: 'USD',
      errorCode: 'INSUFFICIENT_FUNDS',
      userId: 'user456'
    }
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
  
  // Simulate an incident timeline with flow tracking
  const incidentFlowId = '20241220151000001';
  
  systemLogger.info({
    message: 'Application started',
    data: { version: '1.2.3', port: 3000 },
    flow: incidentFlowId
  });
  
  performanceLogger.warn({
    message: 'High CPU usage detected',
    data: { 
      cpuUsage: '85%',
      threshold: '80%',
      duration: '2 minutes'
    },
    flow: incidentFlowId
  });
  
  securityLogger.error({
    message: 'Suspicious activity detected',
    data: { 
      event: 'Multiple failed login attempts',
      sourceIP: '192.168.1.999',
      attempts: 50,
      timeWindow: '1 minute'
    },
    flow: incidentFlowId
  });
  
  systemLogger.error({
    message: 'Service unavailable',
    data: { 
      service: 'user-service',
      reason: 'Too many connections',
      lastHealthCheck: '2024-01-10T10:30:00Z'
    },
    flow: incidentFlowId
  });
  
  performanceLogger.error({
    message: 'Memory leak detected',
    data: { 
      memoryUsage: '95%',
      availableMemory: '512MB',
      usedMemory: '487MB'
    },
    flow: incidentFlowId
  });
  
  console.log('\nWith categories, you can easily:');
  console.log('- Filter logs by component (grep "SECURITY" logs.txt)');
  console.log('- Identify problematic modules');
  console.log('- Set different log levels per category');
  console.log('- Route logs to different destinations');
  console.log('- Track incidents across components using flow IDs');
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
    logger.info({
      message: `${description} example`,
      data: { 
        timestamp: new Date().toISOString(),
        example: true
      }
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
 * Demo showing flow-based logging with categories
 */
function demonstrateFlowBasedCategorization(): void {
  console.log('\n🌊 === FLOW-BASED CATEGORIZATION ===\n');
  
  const userLogger = new Logger({ level: LogLevel.INFO, category: 'USER', type: 'object' });
  const orderLogger = new Logger({ level: LogLevel.INFO, category: 'ORDER', type: 'object' });
  const paymentLogger = new Logger({ level: LogLevel.INFO, category: 'PAYMENT', type: 'object' });
  
  // Simulate an e-commerce order flow
  const orderFlowId = '20241220151500001';
  
  console.log('Simulating e-commerce order flow across different modules:');
  
  userLogger.info({
    message: 'User authentication successful',
    data: { userId: 'user789', email: 'customer@example.com' },
    flow: orderFlowId
  });
  
  orderLogger.info({
    message: 'Order creation started',
    data: { 
      orderId: 'order123',
      items: [
        { id: 'item1', name: 'Widget A', price: 19.99 },
        { id: 'item2', name: 'Widget B', price: 29.99 }
      ],
      total: 49.98
    },
    flow: orderFlowId
  });
  
  orderLogger.info({
    message: 'Inventory check completed',
    data: { 
      orderId: 'order123',
      inventoryStatus: 'available',
      reservedItems: ['item1', 'item2']
    },
    flow: orderFlowId
  });
  
  paymentLogger.info({
    message: 'Payment processing initiated',
    data: { 
      orderId: 'order123',
      amount: 49.98,
      currency: 'USD',
      paymentMethod: 'credit_card'
    },
    flow: orderFlowId
  });
  
  paymentLogger.info({
    message: 'Payment successful',
    data: { 
      orderId: 'order123',
      transactionId: 'tx-abc123',
      processingTime: '2.1s'
    },
    flow: orderFlowId
  });
  
  orderLogger.info({
    message: 'Order completed',
    data: { 
      orderId: 'order123',
      status: 'confirmed',
      estimatedDelivery: '2024-01-15'
    },
    flow: orderFlowId
  });
  
  console.log('\n✨ Benefits of combining categories with flow IDs:');
  console.log('- Track complete workflows across multiple modules');
  console.log('- Identify bottlenecks in specific categories');
  console.log('- Correlate errors across different services');
  console.log('- Analyze performance by category and flow');
}

/**
 * Main demo function
 */
export function runCategoryDemo(): void {
  console.log('🚀 Starting Enhanced Logger Categories Demo...\n');
  
  demonstrateCategories();
  demonstrateLogAnalysis();
  demonstrateCategoryBestPractices();
  demonstrateFlowBasedCategorization();
  
  console.log('\n🎯 Enhanced categories demo completed successfully!');
  console.log('\nKey takeaways:');
  console.log('- Categories identify the SOURCE/MODULE of each log');
  console.log('- They help in filtering, debugging, and monitoring');
  console.log('- Different categories can have different log levels');
  console.log('- Use consistent naming conventions');
  console.log('- Categories are essential for production log analysis');
  console.log('- Flow IDs complement categories for workflow tracking');
  console.log('- New structure supports mixed input types (string, object)');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runCategoryDemo();
} 