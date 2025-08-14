/**
 * Structured Logging Utility for The Agile Assessment
 * 
 * Replaces legacy console.log statements with structured, environment-aware logging
 * Features:
 * - Environment-based log filtering (disabled in production)
 * - Structured log levels (DEBUG, INFO, WARN, ERROR)
 * - Performance monitoring capabilities
 * - Consistent formatting and metadata
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

interface LogContext {
  component?: string;
  action?: string;
  userId?: string;
  sessionId?: string;
  duration?: number;
  metadata?: Record<string, any>;
}

interface LogEntry extends LogContext {
  level: LogLevel;
  message: string;
  timestamp: string;
  environment: string;
}

class Logger {
  private minLevel: LogLevel;
  private isProduction: boolean;

  constructor() {
    this.isProduction = process.env.NODE_ENV === 'production';
    this.minLevel = this.isProduction ? LogLevel.WARN : LogLevel.DEBUG;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.minLevel;
  }

  private formatLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      ...context
    };
  }

  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const levelName = LogLevel[entry.level];
    const prefix = `[${entry.timestamp}] ${levelName}`;
    
    if (entry.component) {
      console.log(`${prefix} [${entry.component}]`, entry.message, entry.metadata || '');
    } else {
      console.log(`${prefix}`, entry.message, entry.metadata || '');
    }
  }

  debug(message: string, context?: LogContext): void {
    this.output(this.formatLogEntry(LogLevel.DEBUG, message, context));
  }

  info(message: string, context?: LogContext): void {
    this.output(this.formatLogEntry(LogLevel.INFO, message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.output(this.formatLogEntry(LogLevel.WARN, message, context));
  }

  error(message: string, context?: LogContext): void {
    this.output(this.formatLogEntry(LogLevel.ERROR, message, context));
  }

  // Performance monitoring helpers
  startTimer(label: string): () => void {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.info(`Performance: ${label}`, { duration, action: 'performance' });
    };
  }

  // GraphQL operation logging
  graphqlQuery(operationName: string, variables?: any, context?: Omit<LogContext, 'action'>): void {
    this.debug(`GraphQL Query: ${operationName}`, {
      ...context,
      action: 'graphql_query',
      metadata: { variables }
    });
  }

  graphqlMutation(operationName: string, variables?: any, context?: Omit<LogContext, 'action'>): void {
    this.info(`GraphQL Mutation: ${operationName}`, {
      ...context,
      action: 'graphql_mutation',
      metadata: { variables }
    });
  }

  // Component lifecycle logging
  componentMount(componentName: string, context?: Omit<LogContext, 'component' | 'action'>): void {
    this.debug(`Component mounted`, {
      ...context,
      component: componentName,
      action: 'mount'
    });
  }

  componentUnmount(componentName: string, context?: Omit<LogContext, 'component' | 'action'>): void {
    this.debug(`Component unmounted`, {
      ...context,
      component: componentName,
      action: 'unmount'
    });
  }

  // User interaction logging
  userAction(action: string, context?: Omit<LogContext, 'action'>): void {
    this.info(`User action: ${action}`, {
      ...context,
      action
    });
  }
}

// Export singleton instance
export const logger = new Logger();

// Convenience functions for common use cases
export const logGraphQLQuery = (operationName: string, variables?: any, context?: LogContext) => {
  logger.graphqlQuery(operationName, variables, context);
};

export const logGraphQLMutation = (operationName: string, variables?: any, context?: LogContext) => {
  logger.graphqlMutation(operationName, variables, context);
};

export const logPerformance = (label: string) => logger.startTimer(label);

export const logUserAction = (action: string, context?: LogContext) => {
  logger.userAction(action, context);
};

export const logError = (message: string, context?: LogContext) => {
  logger.error(message, context);
};

export const logInfo = (message: string, context?: LogContext) => {
  logger.info(message, context);
};

// Replace legacy console.log usage
export const log = {
  debug: logger.debug.bind(logger),
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger)
};

export default logger;