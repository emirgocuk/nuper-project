type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
    context?: string;
    userId?: string;
    [key: string]: any;
}

class Logger {
    private log(level: LogLevel, message: string, data?: any) {
        const timestamp = new Date().toISOString();
        
        // ANSI color codes
        const colors = {
            reset: '\x1b[0m',
            debug: '\x1b[36m', // cyan
            info: '\x1b[32m',  // green
            warn: '\x1b[33m',  // yellow
            error: '\x1b[31m', // red
        };
        
        const color = colors[level] || colors.reset;
        const levelText = level.toUpperCase().padEnd(5);
        
        let logMessage = `${color}[${levelText}] ${timestamp} - ${message}${colors.reset}`;
        
        if (data) {
            logMessage += ` ${JSON.stringify(data, null, 2)}`;
        }
        
        console.log(logMessage);
        
        // TODO: Integrate with Sentry/DataDog for production logging
    }
    
    debug(message: string, data?: any) {
        this.log("debug", message, data);
    }
    
    info(message: string, data?: any) {
        this.log("info", message, data);
    }
    
    warn(message: string, data?: any) {
        this.log("warn", message, data);
    }
    
    error(message: string, error?: Error, data?: any) {
        let errorData = {};
        
        if (error) {
            errorData = {
                message: error.message,
                stack: error.stack,
                ...errorData
            };
        }
        
        if (data) {
            errorData = { ...errorData, ...data };
        }
        
        this.log("error", message, errorData);
    }
}

export const logger = new Logger();