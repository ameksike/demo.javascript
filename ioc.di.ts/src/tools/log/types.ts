/**
 * Log levels enum for controlling log output
 */
export enum LogLevel {
  NONE = 0,      // No logs
  ERROR = 1,     // Only errors
  WARN = 2,      // Errors and warnings
  DEBUG = 3,     // Errors, warnings, and debug
  INFO = 4,      // All logs (default)
  ALL = -1       // All logs including verbose
}

/**
 * Log output types
 */
export type LogOutputType = 'json' | 'object';

/**
 * Log entry structure - represents a single log message with all its information
 */
export interface LogEntry {
  level: string;           // Log level as string (ERROR, WARN, DEBUG, INFO, VERBOSE)
  message: string;         // The main log message
  timestamp: string;       // ISO timestamp when the log was created
  category?: string;       // Optional category/module name to identify the source of the log
  data?: any;             // Additional data/context provided by the caller (objects, arrays, etc.)
}

/**
 * Log processor interface - defines how logs should be processed/stored
 */
export interface LogProcessor {
  /**
   * Processes a log entry according to the specific implementation
   * @param entry - The log entry to process
   * @param level - The numeric log level for additional processing logic
   * @param outputType - The desired output format (json or object)
   */
  process(entry: LogEntry, level: LogLevel, outputType: LogOutputType): void;
}

/**
 * Logger configuration interface - defines how the logger should behave
 */
export interface LoggerConfig {
  level?: LogLevel;         // Minimum log level to display (NONE=0, ERROR=1, WARN=2, DEBUG=3, INFO=4, ALL=-1)
  category?: string;        // Category/module name that will be added to all logs from this logger instance
  type?: LogOutputType;     // Output format: 'json' = JSON string, 'object' = JavaScript object (default)
  processor?: LogProcessor; // Custom log processor (defaults to ConsoleLogProcessor)
} 