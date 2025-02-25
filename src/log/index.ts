import pino from 'pino';

const logger = pino({
    // @ts-ignore
    base: false,
    level: process.env.LOG_LEVEL || 'debug',
    timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;