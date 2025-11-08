export interface Logger {
  /**
   * Logs a silly message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  silly(...args: Array<unknown>): void;
  /**
   * Logs a trace message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  trace(...args: Array<unknown>): void;
  /**
   * Logs a debug message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  debug(...args: Array<unknown>): void;
  /**
   * Logs an info message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  info(...args: Array<unknown>): void;
  /**
   * Logs a warn message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  warn(...args: Array<unknown>): void;
  /**
   * Logs an error message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  error(...args: Array<unknown>): void;
  /**
   * Logs a fatal message.
   * @param args  - Multiple log attributes that should be logged out.
   */
  fatal(...args: Array<unknown>): void;
}
