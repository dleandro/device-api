import { Logger as TsLog, ILogObj as TsLogObj } from 'tslog';
import { ModuleLoggerFactory } from '../../model/ModuleLoggerFactory';
import { Logger } from '../../model/Logger';

export default class TsLogLoggerFactory implements ModuleLoggerFactory {
  private logger: TsLog<TsLogObj>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(appName?: string) {
    this.logger = new TsLog();
  }

  public getModuleLogger = (moduleName: string): Logger =>
    this.logger.getSubLogger({ name: moduleName });
}
