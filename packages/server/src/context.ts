import { connect, Mongoose } from 'mongoose';
import { okAsync, ResultAsync } from 'neverthrow';
import { createLogger, format, Logger, transports } from 'winston';
import { z } from 'zod';

import { parseEnv } from './utils';
import { dataResultFromPromise } from './utils';

let _context: Context | null = null;

export function createContext(): ResultAsync<void, string> {
  const env = parseEnv(envSchema);
  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json(),
    ),
    defaultMeta: { service: 'server' },
    transports: [new transports.Console()],
  });
  const mongooseRes = connectToDatabase(env);

  return mongooseRes.andThen(mongoose => {
    _context = { env, logger, mongoose };

    return okAsync(undefined);
  });
}

export function context(): Context {
  if (_context == null) {
    throw new Error('Context is being used, without being initialised.');
  }
  return _context;
}

export function connectToDatabase(env: Env): ResultAsync<Mongoose, string> {
  const clientRes = dataResultFromPromise(
    async () => await connect(env.DB_CONN_STRING),
  );

  return clientRes.mapErr(_ => 'MongoDb is not running.');
}

const envSchema = z.object({
  DB_NAME: z.string().nonempty(),
  DB_CONN_STRING: z.string().nonempty(),
  ITEMS_COLLECTION_NAME: z.string().nonempty(),
  LOCATION_COLLECTION_NAME: z.string().nonempty(),
  CATEGORY_COLLECTION_NAME: z.string().nonempty(),
  PORT: z.number().nonnegative().default(3000),
});
export type Env = z.infer<typeof envSchema>;

export type Context = {
  env: Env;
  mongoose: Mongoose;
  logger: Logger;
};
