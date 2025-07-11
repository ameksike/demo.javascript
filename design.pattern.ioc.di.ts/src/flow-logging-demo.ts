import { Logger, LogLevel } from './tools/log';

/**
 * Demonstrates the new flow-based logging capabilities
 */
async function flowLoggingDemo(): Promise<void> {
  console.log('🌊 Flow-based Logging Demo\n');

  // Create loggers with different configurations
  const authLogger = new Logger({ 
    level: LogLevel.ALL, 
    category: 'AUTH',
    type: 'object'
  });

  const dbLogger = new Logger({ 
    level: LogLevel.INFO, 
    category: 'DATABASE',
    type: 'json'
  });

  const apiLogger = new Logger({ 
    level: LogLevel.DEBUG, 
    category: 'API',
    type: 'object'
  });

  console.log('📝 Testing New Log Structure:\n');

  // Test 1: Simple string logging (backward compatible)
  console.log('1. Simple string logging:');
  authLogger.info('User authentication started');
  authLogger.error('Authentication failed');
  
  // Test 2: Object-based logging with auto-generated flow ID
  console.log('\n2. Object-based logging with auto-generated flow ID:');
  authLogger.info({
    message: 'User login attempt',
    data: { 
      userId: 'user123', 
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...'
    }
  });

  // Test 3: Object-based logging with custom flow ID
  console.log('\n3. Object-based logging with custom flow ID:');
  const customFlowId = '20241220143000001';
  
  authLogger.info({
    message: 'Starting authentication workflow',
    data: { userId: 'user123', step: 'credentials_check' },
    flow: customFlowId
  });

  authLogger.warn({
    message: 'Password strength warning',
    data: { userId: 'user123', strength: 'weak', requirements: ['uppercase', 'numbers'] },
    flow: customFlowId
  });

  authLogger.error({
    message: 'Authentication failed',
    data: { 
      userId: 'user123', 
      reason: 'invalid_password',
      attempts: 3,
      locked: true
    },
    flow: customFlowId
  });

  // Test 4: Database operations with shared flow ID
  console.log('\n4. Database operations with shared flow ID:');
  const dbFlowId = '20241220143500002';
  
  dbLogger.info({
    message: 'Database query started',
    data: { 
      query: 'SELECT * FROM users WHERE active = true',
      parameters: { active: true }
    },
    flow: dbFlowId
  });

  dbLogger.debug({
    message: 'Query execution details',
    data: { 
      executionTime: '245ms',
      rowsAffected: 150,
      indexUsed: 'idx_users_active'
    },
    flow: dbFlowId
  });

  dbLogger.info({
    message: 'Database query completed',
    data: { 
      resultCount: 150,
      totalTime: '245ms',
      cached: false
    },
    flow: dbFlowId
  });

  // Test 5: API request workflow
  console.log('\n5. API request workflow:');
  const apiFlowId = '20241220144000003';
  
  apiLogger.info({
    message: 'API request received',
    data: { 
      method: 'POST',
      endpoint: '/api/v1/users',
      contentType: 'application/json',
      contentLength: 1024
    },
    flow: apiFlowId
  });

  apiLogger.debug({
    message: 'Request validation',
    data: { 
      validationRules: ['required_fields', 'email_format', 'password_strength'],
      validationTime: '12ms'
    },
    flow: apiFlowId
  });

  apiLogger.info({
    message: 'Processing user creation',
    data: { 
      userId: 'user456',
      email: 'newuser@example.com',
      roles: ['user']
    },
    flow: apiFlowId
  });

  apiLogger.info({
    message: 'API response sent',
    data: { 
      statusCode: 201,
      responseTime: '567ms',
      userId: 'user456'
    },
    flow: apiFlowId
  });

  // Test 6: Mixed logging types
  console.log('\n6. Mixed logging types:');
  apiLogger.error('Critical system error'); // Simple string
  apiLogger.error(500); // Number
  apiLogger.error({
    message: 'Database connection failed',
    data: {
      host: 'db.example.com',
      port: 5432,
      database: 'app_prod',
      connectionTimeout: '30s',
      lastError: 'Connection refused'
    }
  }); // Complex object

  // Test 7: Demonstrate flow ID format uniqueness
  console.log('\n7. Flow ID generation (showing multiple unique IDs):');
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 10)); // Small delay
    apiLogger.info({
      message: `Log entry ${i + 1}`,
      data: { iteration: i + 1 }
    });
  }

  // Test 8: Long-running process simulation
  console.log('\n8. Long-running process simulation:');
  const processFlowId = '20241220144500004';
  
  const steps = [
    { step: 'initialization', duration: '50ms' },
    { step: 'data_loading', duration: '200ms' },
    { step: 'processing', duration: '1500ms' },
    { step: 'validation', duration: '100ms' },
    { step: 'completion', duration: '25ms' }
  ];

  for (const stepInfo of steps) {
    apiLogger.info({
      message: `Process step: ${stepInfo.step}`,
      data: { 
        step: stepInfo.step,
        duration: stepInfo.duration,
        timestamp: new Date().toISOString()
      },
      flow: processFlowId
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  apiLogger.info({
    message: 'Process completed successfully',
    data: { 
      totalSteps: steps.length,
      totalDuration: '1875ms',
      success: true
    },
    flow: processFlowId
  });

  console.log('\n✅ Flow-based logging demo completed successfully!');
  console.log('\n📊 Key features demonstrated:');
  console.log('  • Simple string logging (backward compatible)');
  console.log('  • Object-based logging with auto-generated flow IDs');
  console.log('  • Custom flow IDs for workflow tracking');
  console.log('  • Mixed data types support (string, number, object)');
  console.log('  • Process tracking across multiple log entries');
  console.log('  • Unique flow ID generation with readable format');
  console.log('  • Changed timestamp to date for better readability');
}

// Run the demo
if (require.main === module) {
  flowLoggingDemo().catch(console.error);
}

export { flowLoggingDemo }; 