import { ensureNotNullish } from '@src/util/common';
import pino, { Logger } from 'pino';

export class LogManager {

    private static initialized = false;

    private logger: Logger | null = null;

    constructor() {
        this.init();
    }

    getInstance(): Logger {
        return ensureNotNullish(this.logger);
    }

    private init() {
        if (LogManager.initialized) {
            throw new Error(`LogManager can only be initialized once`);
        }

        LogManager.initialized = true;
        this.logger = pino({
            // @ts-ignore
            base: false,
            level: process.env.LOG_LEVEL || 'debug',
            timestamp: pino.stdTimeFunctions.isoTime,
        });
    }

}