import { Logger } from '../tools/log';

/**
 * Calculator class for demonstrating more complex dependency injection scenarios.
 */
export class Calculator {
  private logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  /**
   * Adds two numbers and logs the operation.
   * @param a - First number
   * @param b - Second number
   * @returns The sum of a and b
   */
  add(a: number, b: number): number {
    const result = a + b;
    this.logger.log(`Addition: ${a} + ${b} = ${result}`);
    return result;
  }

  /**
   * Subtracts two numbers and logs the operation.
   * @param a - First number
   * @param b - Second number
   * @returns The difference of a and b
   */
  subtract(a: number, b: number): number {
    const result = a - b;
    this.logger.log(`Subtraction: ${a} - ${b} = ${result}`);
    return result;
  }

  /**
   * Multiplies two numbers and logs the operation.
   * @param a - First number
   * @param b - Second number
   * @returns The product of a and b
   */
  multiply(a: number, b: number): number {
    const result = a * b;
    this.logger.log(`Multiplication: ${a} * ${b} = ${result}`);
    return result;
  }

  /**
   * Divides two numbers and logs the operation.
   * @param a - First number
   * @param b - Second number
   * @returns The quotient of a and b
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      this.logger.error('Division by zero attempted!');
      throw new Error('Cannot divide by zero');
    }
    const result = a / b;
    this.logger.log(`Division: ${a} / ${b} = ${result}`);
    return result;
  }
} 