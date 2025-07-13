import { Logger } from '../tools/log';

/**
 * DataManager - A sample service for demonstrating auto-registration
 * 
 * This class simulates a data management service that could be auto-loaded
 * by the IoC container when requested but not explicitly registered.
 */
export default class DataManager {
  private data: Map<string, any> = new Map();
  private logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
    this.logger.info('DataManager initialized');
  }

  /**
   * Stores data with a key
   */
  set(key: string, value: any): void {
    this.data.set(key, value);
    this.logger.debug(`Data stored with key: ${key}`);
  }

  /**
   * Retrieves data by key
   */
  get(key: string): any {
    const value = this.data.get(key);
    this.logger.debug(`Data retrieved for key: ${key}, found: ${value !== undefined}`);
    return value;
  }

  /**
   * Checks if key exists
   */
  has(key: string): boolean {
    return this.data.has(key);
  }

  /**
   * Removes data by key
   */
  delete(key: string): boolean {
    const deleted = this.data.delete(key);
    this.logger.debug(`Data deleted for key: ${key}, success: ${deleted}`);
    return deleted;
  }

  /**
   * Gets all stored keys
   */
  getKeys(): string[] {
    return Array.from(this.data.keys());
  }

  /**
   * Clears all data
   */
  clear(): void {
    this.data.clear();
    this.logger.info('All data cleared');
  }

  /**
   * Gets the size of stored data
   */
  getSize(): number {
    return this.data.size;
  }
} 