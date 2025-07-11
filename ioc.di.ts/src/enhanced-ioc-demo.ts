import { IoC, RegistrationConfig, JsonRegistrationConfig, ClassConstructor } from './tools/ioc';
import { Logger, LogLevel } from './tools/log';

/**
 * Example service classes for demonstration
 */
class DatabaseService {
  private connectionString: string;
  private maxConnections: number;

  constructor(connectionString: string, maxConnections: number = 10) {
    this.connectionString = connectionString;
    this.maxConnections = maxConnections;
  }

  connect(): void {
    console.log(`🔗 Connecting to database: ${this.connectionString} (max: ${this.maxConnections})`);
  }

  getConnectionInfo(): { connectionString: string; maxConnections: number } {
    return {
      connectionString: this.connectionString,
      maxConnections: this.maxConnections
    };
  }
}

class EmailService {
  private smtpHost: string;
  private smtpPort: number;
  private logger: Logger;

  constructor(smtpHost: string, smtpPort: number, logger: Logger) {
    this.smtpHost = smtpHost;
    this.smtpPort = smtpPort;
    this.logger = logger;
  }

  sendEmail(to: string, subject: string, body: string): void {
    this.logger.info({
      message: 'Sending email',
      data: { to, subject, smtpHost: this.smtpHost, smtpPort: this.smtpPort }
    });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  }
}

class UserService {
  private dbService: DatabaseService;
  private emailService: EmailService;
  private logger: Logger;

  constructor(dependencies: { dbService: DatabaseService; emailService: EmailService; logger: Logger }) {
    this.dbService = dependencies.dbService;
    this.emailService = dependencies.emailService;
    this.logger = dependencies.logger;
  }

  createUser(email: string, name: string): void {
    this.logger.info({
      message: 'Creating user',
      data: { email, name }
    });

    // Simulate user creation
    this.dbService.connect();
    console.log(`👤 User created: ${name} (${email})`);

    // Send welcome email
    this.emailService.sendEmail(email, 'Welcome!', `Hello ${name}, welcome to our platform!`);
  }
}

class ConfigService {
  private config: { [key: string]: any };

  constructor(configData: { [key: string]: any }) {
    this.config = configData;
  }

  get(key: string): any {
    return this.config[key];
  }

  getAll(): { [key: string]: any } {
    return { ...this.config };
  }
}

/**
 * Demonstrates the enhanced IoC functionality with class arguments
 */
async function demonstrateEnhancedIoC(): Promise<void> {
  console.log('🚀 Enhanced IoC Demo with Class Arguments\n');

  const container = new IoC();

  // Enhanced configuration with class arguments - much simpler!
  const configs: RegistrationConfig[] = [
    // Logger with arguments
    {
      key: 'logger',
      target: Logger,
      type: 'class',
      lifetime: 'singleton',
      args: [{ level: LogLevel.INFO, category: 'MAIN' }]
    },

    // Database service with arguments
    {
      key: 'dbService',
      target: DatabaseService,
      type: 'class',
      lifetime: 'singleton',
      args: ['postgresql://localhost:5432/mydb', 20]
    },

    // Configuration service with complex arguments
    {
      key: 'configService',
      target: ConfigService,
      type: 'class',
      lifetime: 'singleton',
      args: [{
        apiUrl: 'https://api.example.com',
        timeout: 30000,
        retries: 3,
        features: {
          emailNotifications: true,
          analytics: false
        }
      }]
    },

    // Email logger for email service
    { 
      key: 'emailLogger', 
      target: Logger, 
      type: 'class', 
      lifetime: 'singleton',
      args: [{ level: LogLevel.INFO, category: 'EMAIL' }]
    },

    // Email service - using factory function to handle dependencies properly
    {
      key: 'emailService',
      target: (cradle: any) => new EmailService('smtp.gmail.com', 587, cradle.emailLogger),
      type: 'function',
      lifetime: 'singleton'
    },

    // User service - using factory function to handle dependencies properly
    {
      key: 'userService',
      target: (cradle: any) => new UserService({
        dbService: cradle.dbService,
        emailService: cradle.emailService,
        logger: cradle.logger
      }),
      type: 'function',
      lifetime: 'transient'
    }
  ];

  console.log('📝 Registering dependencies with enhanced configuration...');
  await container.register(configs);

  console.log('\n✅ Dependencies registered successfully!');
  console.log('📋 Registered keys:', container.getRegisteredKeys());

  // Test the services
  console.log('\n🧪 Testing Services:');
  
  const logger = container.resolve<Logger>('logger');
  logger.info('IoC container is ready!');

  const dbService = container.resolve<DatabaseService>('dbService');
  console.log('📊 Database info:', dbService.getConnectionInfo());

  const configService = container.resolve<ConfigService>('configService');
  console.log('⚙️ Configuration:', configService.getAll());

  const userService = container.resolve<UserService>('userService');
  userService.createUser('john@example.com', 'John Doe');

  console.log('\n🎯 Enhanced IoC demo completed successfully!');
}

/**
 * Demonstrates JSON-based configuration
 */
async function demonstrateJsonConfiguration(): Promise<void> {
  console.log('\n🔧 JSON Configuration Demo\n');

  const container = new IoC();

  // Class registry for JSON configuration
  const classRegistry: { [key: string]: ClassConstructor } = {
    Logger,
    DatabaseService,
    EmailService,
    UserService,
    ConfigService
  };

  // JSON-serializable configuration (simplified for demonstration)
  const jsonConfigs: JsonRegistrationConfig[] = [
    {
      key: 'logger',
      target: 'Logger',
      type: 'class',
      lifetime: 'singleton',
      args: [{ level: LogLevel.DEBUG, category: 'JSON' }]
    },
    {
      key: 'dbService',
      target: 'DatabaseService',
      type: 'class',
      lifetime: 'singleton',
      args: ['mongodb://localhost:27017/jsondb', 15]
    },
    {
      key: 'configService',
      target: 'ConfigService',
      type: 'class',
      lifetime: 'singleton',
      args: [{
        environment: 'production',
        database: 'mongodb://localhost:27017/jsondb',
        jsonConfigured: true
      }]
    }
  ];

  console.log('📄 JSON Configuration:');
  console.log(JSON.stringify(jsonConfigs, null, 2));

  console.log('\n📝 Registering from JSON configuration...');
  await container.registerFromJson(jsonConfigs, classRegistry);

  console.log('\n✅ JSON configuration registered successfully!');
  console.log('📋 Registered keys:', container.getRegisteredKeys());

  // Test the services
  const logger = container.resolve<Logger>('logger');
  logger.info({
    message: 'JSON configuration loaded successfully!',
    data: { configType: 'JSON', timestamp: new Date().toISOString() }
  });

  const dbService = container.resolve<DatabaseService>('dbService');
  console.log('📊 Database info from JSON:', dbService.getConnectionInfo());

  const configService = container.resolve<ConfigService>('configService');
  console.log('⚙️ JSON Config data:', configService.getAll());
}

/**
 * Demonstrates saving and loading configuration from files
 */
async function demonstrateFileConfiguration(): Promise<void> {
  console.log('\n💾 File Configuration Demo\n');

  const container = new IoC();

  // Create initial configuration
  const configs: RegistrationConfig[] = [
    {
      key: 'logger',
      target: Logger,
      type: 'class',
      lifetime: 'singleton',
      args: [{ level: LogLevel.INFO, category: 'FILE' }]
    },
    {
      key: 'configService',
      target: ConfigService,
      type: 'class',
      lifetime: 'singleton',
      args: [{
        environment: 'development',
        debugMode: true,
        version: '1.0.0'
      }]
    }
  ];

  await container.register(configs);

  console.log('💾 Saving configuration to file...');
  try {
    await container.saveToJsonFile('./config/ioc-config.json');
    console.log('✅ Configuration saved to ./config/ioc-config.json');
  } catch (error) {
    console.log('⚠️ Could not save to file (directory may not exist):', (error as Error).message);
  }

  // Demonstrate loading from JSON configuration
  const classRegistry: { [key: string]: ClassConstructor } = {
    Logger,
    ConfigService
  };

  console.log('\n📂 Loading would work like this:');
  console.log('await container.loadFromJsonFile("./config/ioc-config.json", classRegistry);');
}

/**
 * Demonstrates advanced dependency scenarios
 */
async function demonstrateAdvancedScenarios(): Promise<void> {
  console.log('\n🎯 Advanced Dependency Scenarios\n');

  const container = new IoC();

  // Complex nested dependency configuration
  const complexConfigs: RegistrationConfig[] = [
    // Shared logger
    {
      key: 'sharedLogger',
      target: Logger,
      type: 'class',
      lifetime: 'singleton',
      args: [{ level: LogLevel.ALL, category: 'SHARED' }]
    },

    // Database with logger dependency
    {
      key: 'advancedDbService',
      target: DatabaseService,
      type: 'class',
      lifetime: 'singleton',
      args: ['postgresql://prod:5432/advanced', 50]
    },

    // Email service with multiple dependencies
    {
      key: 'advancedEmailService',
      target: EmailService,
      type: 'class',
      lifetime: 'scoped',
      args: ['smtp.enterprise.com', 465],
      dependencies: {
        logger: {
          key: 'sharedLogger',
          target: Logger,
          type: 'class'
        }
      }
    },

    // User service with all dependencies
    {
      key: 'advancedUserService',
      target: UserService,
      type: 'class',
      lifetime: 'transient',
      dependencies: {
        dbService: {
          key: 'advancedDbService',
          target: DatabaseService,
          type: 'class'
        },
        emailService: {
          key: 'advancedEmailService',
          target: EmailService,
          type: 'class'
        },
        logger: {
          key: 'sharedLogger',
          target: Logger,
          type: 'class'
        }
      }
    }
  ];

  console.log('🔧 Registering advanced configuration...');
  await container.register(complexConfigs);

  console.log('\n✅ Advanced configuration registered!');
  console.log('📋 Registered keys:', container.getRegisteredKeys());

  // Test advanced scenarios
  const userService1 = container.resolve<UserService>('advancedUserService');
  const userService2 = container.resolve<UserService>('advancedUserService');

  console.log('\n🧪 Testing transient behavior:');
  console.log('UserService instances are different:', userService1 !== userService2);

  userService1.createUser('advanced@example.com', 'Advanced User');

  // Test scoped behavior
  console.log('\n🔄 Testing scoped behavior:');
  const scope1 = container.createScope();
  const scope2 = container.createScope();
  
  console.log('Different scopes created for request-scoped dependencies');
}

/**
 * Main demo function
 */
export async function runEnhancedIoCDemo(): Promise<void> {
  console.log('🚀 Starting Enhanced IoC Demo...\n');

  await demonstrateEnhancedIoC();
  await demonstrateJsonConfiguration();
  await demonstrateFileConfiguration();
  await demonstrateAdvancedScenarios();

  console.log('\n🎉 Enhanced IoC Demo completed successfully!');
  console.log('\n✨ Key improvements demonstrated:');
  console.log('  • Simple class argument specification with args[]');
  console.log('  • Nested dependency injection with dependencies{}');
  console.log('  • JSON-serializable configuration for storage');
  console.log('  • File-based configuration loading/saving');
  console.log('  • Complex dependency scenarios');
  console.log('  • Backward compatibility with existing code');
  console.log('  • MongoDB/JSON database ready configuration');
}

// Run the demo if this file is executed directly
if (require.main === module) {
  runEnhancedIoCDemo().catch(console.error);
} 