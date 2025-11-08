import { getContainer } from '../../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Logger } from '../../../shared/model/Logger';
import { ModuleLoggerFactory } from '../../../shared/model/ModuleLoggerFactory';

export default function getModuleLogger(moduleName: string): Logger {
  const logger: ModuleLoggerFactory = getContainer().get('Logger');

  return logger.getModuleLogger(moduleName);
}
