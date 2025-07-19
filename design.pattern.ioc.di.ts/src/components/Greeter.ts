import { IIoC } from '../tools';
import { Logger } from '../tools/log';

/**
 * Greeter class for demonstrating dynamic loading and dependency injection.
 */
export class Greeter {
  private logger: Logger;

  constructor(param1: { level: string; category: string; }, param2: string, dependencies: { logger: Logger, assistant: IIoC }) {
    this.logger = dependencies.logger;
  }

  /**
   * Greets a person and logs the greeting.
   * @param name - The name of the person to greet.
   * @returns A greeting message.
   */
  greet(name: string): string {
    this.logger.log(`Greeting: ${name}`);
    return `${name} - Hello!`;
  }

  /**
   * Says goodbye to a person and logs the farewell.
   * @param name - The name of the person to say goodbye to.
   * @returns A farewell message.
   */
  farewell(name: string): string {
    this.logger.log(`Saying goodbye to: ${name}`);
    return `Goodbye, ${name}!`;
  }

  /**
   * Welcomes a person and logs the welcome message.
   * @param name - The name of the person to welcome.
   * @returns A welcome message.
   */
  welcome(name: string): string {
    this.logger.info(`Welcoming: ${name}`);
    return `Welcome, ${name}!`;
  }
} 