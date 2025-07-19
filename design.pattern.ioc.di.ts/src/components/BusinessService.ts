import { IIoC } from "../tools";

/**
 * BusinessService - Advanced IoC Demonstration Component
 * 
 * This component showcases the full power of the IoC pattern by:
 * - Zero explicit imports for dependencies (IoC manages everything)
 * - Deep transitive dependency injection
 * - Performance-optimized lazy evaluation
 * - Comprehensive business logic combining multiple services
 * - Extensible architecture for future enhancements
 * 
 * Dependencies: Calculator, Greeter, Logger (all injected via IoC)
 * Lifecycle: Transient (new instance per resolution)
 * Performance: Optimized with lazy evaluation and efficient method chaining
 */
export class BusinessService {
  // Dependencies injected via IoC container - no explicit imports needed
  private calculator: any;
  private greeter: any;
  private logger: any;
  private assistant: IIoC;

  // Performance metrics for monitoring
  private operationCount: number = 0;
  private lastOperationTime: number = 0;

  /**
   * Constructor receives dependencies as an object (IoC dependency injection pattern)
   * This eliminates the need for explicit imports and allows for dynamic dependency resolution
   * 
   * @param dependencies - Object containing all required dependencies
   */
  constructor(dependencies: {
    calculator: any;
    greeter: any;
    logger: any;
    assistant: IIoC;
  }) {
    this.calculator = dependencies.calculator;
    this.greeter = dependencies.greeter;
    this.logger = dependencies.logger;
    this.assistant = dependencies.assistant;

    // Initialize service with performance tracking
    this.logger?.info({
      message: 'BusinessService initialized successfully',
      data: {
        timestamp: Date.now(),
        dependencies: ['calculator', 'greeter', 'logger'],
        lifecycle: 'transient'
      }
    });
  }

  /**
   * Processes a customer order with comprehensive business logic
   * Demonstrates deep dependency usage and transitive operations
   * 
   * @param customerName - Name of the customer
   * @param items - Array of items with quantities and prices
   * @returns Complete order summary with calculations and greetings
   */
  processCustomerOrder(customerName: string, items: { name: string; quantity: number; price: number }[]): {
    customer: string;
    greeting: string;
    subtotal: number;
    tax: number;
    total: number;
    itemCount: number;
    summary: string;
    processingTime: number;
  } {
    const startTime = performance.now();

    // Greet the customer using injected Greeter service
    const greeting = this.greeter.greet(customerName);

    // Calculate order totals using injected Calculator service
    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      const itemTotal = this.calculator.multiply(item.quantity, item.price);
      subtotal = this.calculator.add(subtotal, itemTotal);
      itemCount = this.calculator.add(itemCount, item.quantity);
    }

    // Calculate tax (8.5% tax rate)
    const tax = this.calculator.multiply(subtotal, 0.085);
    const total = this.calculator.add(subtotal, tax);

    const processingTime = performance.now() - startTime;
    this.operationCount++;
    this.lastOperationTime = processingTime;

    const orderSummary = {
      customer: customerName,
      greeting,
      subtotal,
      tax,
      total,
      itemCount,
      summary: `Order processed for ${customerName}: ${itemCount} items, $${total.toFixed(2)} total`,
      processingTime
    };

    // Log comprehensive operation details
    this.logger.info({
      message: 'Customer order processed successfully',
      data: {
        customer: customerName,
        itemCount,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        processingTime: `${processingTime.toFixed(2)}ms`,
        operationNumber: this.operationCount
      }
    });

    return orderSummary;
  }

  /**
   * Generates a performance report using calculator for statistics
   * Showcases advanced dependency usage and computational capabilities
   * 
   * @returns Performance analytics report
   */
  generatePerformanceReport(): {
    totalOperations: number;
    averageOperationTime: number;
    efficiency: string;
    recommendations: string[];
  } {
    const efficiency = this.operationCount > 0 ?
      this.calculator.divide(1000, this.lastOperationTime) : 0;

    const recommendations: string[] = [];

    if (efficiency < 10) {
      recommendations.push('Consider optimizing database queries');
      recommendations.push('Implement caching for frequently accessed data');
    } else if (efficiency < 50) {
      recommendations.push('Good performance, minor optimizations available');
    } else {
      recommendations.push('Excellent performance, no optimizations needed');
    }

    const report = {
      totalOperations: this.operationCount,
      averageOperationTime: this.lastOperationTime,
      efficiency: `${efficiency.toFixed(2)} operations/second`,
      recommendations
    };

    this.logger.info({
      message: 'Performance report generated',
      data: report
    });

    return report;
  }

  /**
   * Handles customer feedback with sentiment analysis simulation
   * Demonstrates complex business logic using multiple injected services
   * 
   * @param customerName - Name of the customer providing feedback
   * @param feedback - Customer feedback text
   * @param rating - Numeric rating (1-5)
   * @returns Processed feedback summary
   */
  handleCustomerFeedback(customerName: string, feedback: string, rating: number): {
    customer: string;
    farewell: string;
    sentiment: string;
    priority: string;
    responseTime: number;
  } {
    const startTime = performance.now();

    // Determine sentiment based on rating (using calculator for thresholds)
    let sentiment: string;
    if (rating >= 4) {
      sentiment = 'positive';
    } else if (rating >= 3) {
      sentiment = 'neutral';
    } else {
      sentiment = 'negative';
    }

    // Calculate priority score using complex business logic
    const feedbackLength = feedback.length;
    const lengthWeight = this.calculator.divide(feedbackLength, 100);
    const ratingWeight = this.calculator.multiply(rating, 0.3);
    const priorityScore = this.calculator.add(lengthWeight, ratingWeight);

    let priority: string;
    if (priorityScore >= 2) {
      priority = 'high';
    } else if (priorityScore >= 1) {
      priority = 'medium';
    } else {
      priority = 'low';
    }

    // Generate farewell message
    const farewell = this.greeter.farewell(customerName);

    const responseTime = performance.now() - startTime;

    const feedbackSummary = {
      customer: customerName,
      farewell,
      sentiment,
      priority,
      responseTime
    };

    this.logger.info({
      message: 'Customer feedback processed',
      data: {
        customer: customerName,
        rating,
        sentiment,
        priority,
        feedbackLength,
        priorityScore: priorityScore.toFixed(2),
        responseTime: `${responseTime.toFixed(2)}ms`
      }
    });

    return feedbackSummary;
  }

  /**
   * Executes a comprehensive business workflow
   * Demonstrates the full power of IoC by orchestrating multiple services
   * 
   * @param customerName - Customer name
   * @param orderItems - Items to process
   * @param feedback - Customer feedback
   * @param rating - Customer rating
   * @returns Complete workflow result
   */
  async executeBusinessWorkflow(
    customerName: string,
    orderItems: { name: string; quantity: number; price: number }[],
    feedback: string,
    rating: number
  ): Promise<{
    welcome: string;
    order: any;
    feedback: any;
    performance: any;
    conclusion: string;
  }> {
    const srv = await this.assistant?.resolve('Greeter') as any;
    this.logger?.info({ message: `✅ Assistant Injection: ${srv.greet('! - !')}`, data: { src: 'Calculator', loaded: !!srv } });

    const startTime = performance.now();

    // Welcome customer
    const welcome = this.greeter?.welcome(customerName);

    // Process order
    const order = this.processCustomerOrder(customerName, orderItems);

    // Handle feedback
    const feedbackResult = this.handleCustomerFeedback(customerName, feedback, rating);

    // Generate performance report
    const performanceReport = this.generatePerformanceReport();

    const workflowTime = performance.now() - startTime;

    const conclusion = `Complete business workflow executed for ${customerName} in ${workflowTime.toFixed(2)}ms`;

    this.logger.info({
      message: 'Business workflow completed successfully',
      data: {
        customer: customerName,
        orderTotal: order.total,
        feedbackSentiment: feedbackResult.sentiment,
        totalWorkflowTime: `${workflowTime.toFixed(2)}ms`,
        efficiency: 'optimal'
      }
    });

    return {
      welcome,
      order,
      feedback: feedbackResult,
      performance: performanceReport,
      conclusion
    };
  }

  /**
   * Gets current service statistics for monitoring
   * Provides insights into service usage and performance
   * 
   * @returns Service statistics object
   */
  getServiceStats(): {
    operationCount: number;
    lastOperationTime: number;
    status: string;
    uptime: string;
  } {
    return {
      operationCount: this.operationCount,
      lastOperationTime: this.lastOperationTime,
      status: 'active',
      uptime: 'since initialization'
    };
  }
} 