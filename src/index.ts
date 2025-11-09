import 'reflect-metadata';
import getModuleLogger from './application/port/log/get-module-logger';
import { getContainer } from './shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Server } from './shared/infrastructure/server/Server';

const logger = getModuleLogger('server-entrypoint');

function main() {
  const server: Server = getContainer().get('Server');
  server.setup();
  server.start(process.env.PORT ? Number.parseInt(process.env.PORT) : 8000);
  logger.info('Server started');
}

main();
