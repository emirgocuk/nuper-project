type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
    context?: string;
    userId?: string;
    [key: string]: any;
}

class Logger {
    private getColor(level: LogLevel): string {
        switch (level) {
            case 'debug': return '\x1b[36m'; // Cyan
            case 'info': return '\x1b[32m';  // Green
            case 'warn': return '\x1b[33m';  // Yellow
            case 'error': return '\x1b[31m'; // Red
        }
    }

    private getResetColor(): string {
        return '\x1b[0m';
    }

    private log(level: LogLevel, message: string, data?: Record<string, any>): void {
        const timestamp = new Date().toISOString();
        const color = this.getColor(level);
        const reset = this.getResetColor();
        
        const levelStr = level.toUpperCase().padEnd(5);
        const formattedMessage = `[${levelStr}] ${timestamp} - ${message}`;
        
        if (data) {
            console.log(`${color}${formattedMessage}${reset}`, JSON.stringify(data, null, 2));
        } else {
            console.log(`${color}${formattedMessage}${reset}`);
        }
        
        // TODO: Integrate with error tracking services like Sentry or DataDog
        // if (level === 'error') {
        //     Sentry.captureException(data?.error);
        // }
    }

    debug(message: string, data?: Record<string, any>): void {
        this.log('debug', message, data);
    }

    info(message: string, data?: Record<string, any>): void {
        this.log('info', message, data);
    }

    warn(message: string, data?: Record<string, any>): void {
        this.log('warn', message, data);
    }

    error(message: string, error?: Error, data?: Record<string, any>): void {
        const errorData: Record<string, any> = data || {};
        
        if (error) {
            errorData.errorMessage = error.message;
            errorData.errorStack = error.stack;
        }
        
        this.log('error', message, errorData);
    }
}

export const logger = new Logger();
