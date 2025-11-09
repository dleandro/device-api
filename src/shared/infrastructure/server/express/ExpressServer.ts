import express from 'express';
import { Server } from '../Server';
import http from 'http';
import { useExpressServer } from 'routing-controllers';
import { getContainer } from '../../dependency_injection/setup-dependency-injection';
import getModuleLogger from '../../../../application/port/log/get-module-logger';
import { ServerError } from '../ServerError';

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
