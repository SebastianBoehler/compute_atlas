import pino from 'pino';

import { getEnv } from '@compute-atlas/config';

export const logger = pino({
  level: getEnv().LOG_LEVEL,
  transport:
    process.env.NODE_ENV === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});
