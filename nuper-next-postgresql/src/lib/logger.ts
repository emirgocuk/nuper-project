/**
 * Nuper Elite — Structured Logger
 *
 * Lightweight JSON-structured logger for server-side use.
 * Outputs consistent, machine-readable log entries on all levels.
 * Drop-in replacement for console.log / console.error.
 *
 * Usage:
 *   import { logger } from '@/lib/logger'
 *   logger.info('User logged in', { userId: session.user.id })
 *   logger.error('Payment failed', error, { userId, amount })
 *   logger.warn('Rate limit near', { ip, count })
 */

type LogMeta = Record<string, unknown>

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

function buildEntry(level: LogLevel, message: string, meta?: LogMeta, error?: unknown) {
    const entry: Record<string, unknown> = {
        level,
        timestamp: new Date().toISOString(),
        message,
    }

    if (meta && Object.keys(meta).length > 0) {
        entry.meta = meta
    }

    if (error) {
        if (error instanceof Error) {
            entry.error = {
                name: error.name,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            }
        } else {
            entry.error = String(error)
        }
    }

    return entry
}

export const logger = {
    /** General informational events */
    info: (message: string, meta?: LogMeta) => {
        console.log(JSON.stringify(buildEntry('info', message, meta)))
    },

    /** Non-critical warnings that should be monitored */
    warn: (message: string, meta?: LogMeta) => {
        console.warn(JSON.stringify(buildEntry('warn', message, meta)))
    },

    /**
     * Errors that should be investigated.
     * @example logger.error('Auth failed', error, { email })
     */
    error: (message: string, error?: unknown, meta?: LogMeta) => {
        console.error(JSON.stringify(buildEntry('error', message, meta, error)))
        // TODO (Faz 17): Integrate Sentry or OpenTelemetry for production alerting
    },

    /** Verbose debugging (only logged in development) */
    debug: (message: string, meta?: LogMeta) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(JSON.stringify(buildEntry('debug', message, meta)))
        }
    },
}
