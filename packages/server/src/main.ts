import express, { Express } from 'express';
import expressWinston from 'express-winston';
import * as winston from 'winston';

import { context, createContext } from './context';
import { rootRouter } from './routes';

const res = await createContext();

if (res.isErr()) {
  console.error(`Something went wrong during initialisation: ${res.error}.`);
  process.exit(-1);
}

const app = getApp();
const port = context().env.PORT;

app.listen(port, () => {
  const { logger, env } = context();
  logger.info(`Server connected to MongoDB on '${env.DB_CONN_STRING}'`);
  logger.info(`Server listening on port ${port}...`);
});

export function getApp(): Express {
  const app = express();

  app.use(
    expressWinston.logger({
      transports: [new winston.transports.Console()],
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json(),
      ),
      meta: true,
      msg: '{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}',
      expressFormat: true,
      colorize: true,
    }),
  );
  app.use(express.json());
  app.use(rootRouter);

  // Add catch-all route for undefined routes
  app.use('*', (req, res) => {
    context().logger.warn(`404 for ${req.path}`);
    res.sendStatus(404);
  });

  return app;
}
