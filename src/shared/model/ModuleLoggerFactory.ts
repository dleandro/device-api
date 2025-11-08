import { Logger } from './Logger';

export interface ModuleLoggerFactory {
  getModuleLogger(moduleName: string): Logger;
}
