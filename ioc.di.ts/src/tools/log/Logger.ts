import { LogLevel, LogEntry, LogOutputType, LogProcessor, LoggerConfig } from './types';
import { ConsoleLogProcessor } from './processors/ConsoleLogProcessor';

/**
 * Simplified Logger class with configurable output format and pluggable processors
 */
export class Logger {
  private currentLevel: LogLevel;     // Current minimum log level to display
  private category?: string;          // Category/module name for this logger instance
  private outputType: LogOutputType;  // Output format (json or object)
  protected processor: LogProcessor;  // Log processor that handles the actual output/storage

  constructor(config: LoggerConfig = {}) {
    this.currentLevel = config.level ?? LogLevel.INFO;
    this.category = config.category;
    this.outputType = config.type ?? 'object';
    this.processor = config.processor ?? new ConsoleLogProcessor();
  }

  /**
   * Configures the logger settings - allows changing behavior at runtime
   * @param config - Logger configuration object
   */
  setting(config: LoggerConfig): void {
    if (config.level !== undefined) {
      this.currentLevel = config.level;
    }
    if (config.category !== undefined) {
      this.category = config.category;
    }
    if (config.type !== undefined) {
      this.outputType = config.type;
    }
    if (config.processor !== undefined) {
      this.processor = config.processor;
    }
  }

  /**
   * Gets the current logging level
   * @returns The current log level
   */
  getLevel(): LogLevel {
    return this.currentLevel;
  }

  /**
   * Gets the current category
   * @returns The current category or undefined
   */
  getCategory(): string | undefined {
    return this.category;
  }

  /**
   * Gets the current output type
   * @returns The current output type
   */
  getOutputType(): LogOutputType {
    return this.outputType;
  }

  /**
   * Checks if a log level should be output
   * @param level - The level to check
   * @returns True if the level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    if (this.currentLevel === LogLevel.NONE) return false;
    if (this.currentLevel === LogLevel.ALL) return true;
    return level <= this.currentLevel;
  }

  /**
   * Gets the level name as string
   * @param level - The log level
   * @returns The level name
   */
  private getLevelName(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR: return 'ERROR';
      case LogLevel.WARN: return 'WARN';
      case LogLevel.DEBUG: return 'DEBUG';
      case LogLevel.INFO: return 'INFO';
      case LogLevel.ALL: return 'VERBOSE';
      default: return 'LOG';
    }
  }

  /**
   * Creates a log entry with all the necessary information
   * @param level - The log level (ERROR, WARN, DEBUG, INFO)
   * @param message - The main log message
   * @param data - Optional additional data/context from the caller
   * @returns Complete log entry object
   */
  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    const entry: LogEntry = {
      level: this.getLevelName(level),
      message,
      timestamp: new Date().toISOString(),
      category: this.category,
      data
    };

    // Remove undefined fields to keep the log clean
    if (!entry.category) delete entry.category;
    if (!entry.data) delete entry.data;

    return entry;
  }

  /**
   * Processes the log entry using the configured processor
   * This method is protected to allow extending classes to override the processing behavior
   * @param entry - The log entry to process
   * @param level - The numeric log level for processor logic
   */
  protected process(entry: LogEntry, level: LogLevel): void {
    this.processor.process(entry, level, this.outputType);
  }

  /**
   * Internal method to log a message with the specified level
   * @param level - The log level to use
   * @param message - The main log message
   * @param data - Optional additional data/context
   */
  private logWithLevel(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, data);
    this.process(entry, level);
  }

  /**
   * Logs an error message - highest priority, usually for critical issues
   * @param message - The error message describing what went wrong
   * @param data - Optional additional context (error objects, stack traces, etc.)
   */
  error(message: string, data?: any): void {
    this.logWithLevel(LogLevel.ERROR, message, data);
  }

  /**
   * Logs a warning message - for potentially harmful situations
   * @param message - The warning message describing the issue
   * @param data - Optional additional context (config values, thresholds, etc.)
   */
  warn(message: string, data?: any): void {
    this.logWithLevel(LogLevel.WARN, message, data);
  }

  /**
   * Logs a debug message - detailed information for diagnosing problems
   * @param message - The debug message with technical details
   * @param data - Optional additional context (variables, state, parameters, etc.)
   */
  debug(message: string, data?: any): void {
    this.logWithLevel(LogLevel.DEBUG, message, data);
  }

  /**
   * Logs an info message - general information about application flow
   * @param message - The informational message
   * @param data - Optional additional context (user data, results, etc.)
   */
  info(message: string, data?: any): void {
    this.logWithLevel(LogLevel.INFO, message, data);
  }

  /**
   * Logs a general message - alias for info() method for compatibility
   * @param message - The log message
   * @param data - Optional additional context (user data, results, etc.)
   */
  log(message: string, data?: any): void {
    this.logWithLevel(LogLevel.INFO, message, data);
  }
} 