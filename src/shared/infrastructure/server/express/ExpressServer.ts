import express from 'express';
import http from 'node:http';
import { useExpressServer } from 'routing-controllers';
import getModuleLogger from '../../../../application/port/log/get-module-logger';
import { getContainer } from '../../dependency_injection/setup-dependency-injection';
import { Server } from '../Server';
import { ServerError } from '../ServerError';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class ExpressServer implements Server {
  private readonly app = express();
  private readonly log = getModuleLogger('ExpressServer');

  setup(): http.Server {
    this.log.info('Starting Express server...');

    try {
      useExpressServer(this.app, {
        defaultErrorHandler: false,
        controllers: getContainer().get('Controllers'),
        validation: true,
      });

      this.app.get('/health', (_req, res) => {
        res.status(StatusCodes.OK).send(ReasonPhrases.OK);
      });

      return http.createServer(this.app);
    } catch (error) {
      this.log.error(error);
      throw new ServerError("Express server wasn't able to start");
    }
  }

  start(port: number) {
    this.app.listen(port, (error) => {
      if (error) {
        this.log.error(`Unable to start listenning on port ${port}`);
      } else {
        this.log.info(`Server listenning on port ${port}`);
      }
    });
  }
}
