import { Logger } from '../tools/log';
import { IIoC } from '../tools/ioc';

/**
 * Calculator class demonstrating enhanced dependency injection with object parameters.
 */
export class Calculator {
  private name?: string;
  private logger?: Logger;
  private assistant?: IIoC;
  private options?: { level: string; category: string; };

  /**
   * Constructor receiving args first, then dependencies object as final parameter.
   * @param param1 - Configuration options with level and category
   * @param param2 - Name identifier for the calculator instance
   * @param param3 - Dependencies object containing logger and assistant
   */
  constructor(param1: { level: string; category: string; }, param2: string, param3: {logger: Logger, assistant: IIoC}) {
    this.logger = param3.logger;
    this.assistant = param3.assistant;
    this.options = param1;
    this.name = param2;
  }

  /**
   * Adds two numbers and logs the operation.
   */
  add(a: number, b: number): number {
    const result = a + b;
    this.logger?.info({ message: `Addition: ${a} + ${b} = ${result}`, data: { src: 'Calculator' } });
    return result;
  }

  /**
   * Subtracts two numbers and logs the operation.
   */
  subtract(a: number, b: number): number {
    const result = a - b;
    this.logger?.info({ message: `Subtraction: ${a} - ${b} = ${result}`, data: { src: 'Calculator' } });
    return result;
  }

  /**
   * Multiplies two numbers and logs the operation.
   */
  multiply(a: number, b: number): number {
    const result = a * b;
    this.logger?.info({ message: `Multiplication: ${a} * ${b} = ${result}`, data: { src: 'Calculator' } });
    return result;
  }

  /**
   * Divides two numbers and logs the operation.
   */
  divide(a: number, b: number): number {
    if (b === 0) {
      this.logger?.error({ message: 'Division by zero attempted!', data: { src: 'Calculator' } });
      throw new Error('Cannot divide by zero');
    }
    const result = a / b;
    this.logger?.info({ message: `Division: ${a} / ${b} = ${result}`, data: { src: 'Calculator' } });
    return result;
  }
} 