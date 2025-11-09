import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import TsLogLoggerFactory from '../../shared/infrastructure/log/TsLogLoggerFactory';
import { Logger } from '../../shared/model/Logger';
import { Repository } from '../../shared/model/Repository';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class GetDeviceByIdService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');
  private readonly logger: Logger;

  constructor() {
    const loggerFactory = new TsLogLoggerFactory();
    this.logger = loggerFactory.getModuleLogger('GetDeviceByIdService');
  }

  async run(deviceId: string) {
    try {
      this.logger.info(`Fetching device by ID: ${deviceId}`);

      const deviceIdObj = new DeviceId(deviceId);
      const device = await this.repository.findById(deviceIdObj);

      this.logger.info(
        `Successfully retrieved device: ${device.name.toString()}`
      );

      return device.toPrimitives();
    } catch (error) {
      this.logger.error(`Error fetching device by ID ${deviceId}:`, error);
      throw error;
    }
  }
}
