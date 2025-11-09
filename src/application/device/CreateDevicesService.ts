import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import TsLogLoggerFactory from '../../shared/infrastructure/log/TsLogLoggerFactory';
import { Logger } from '../../shared/model/Logger';
import { Repository } from '../../shared/model/Repository';
import { DeviceRequest } from '../dto/DeviceDtos';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class CreateDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');
  private readonly logger: Logger;

  constructor() {
    const loggerFactory = new TsLogLoggerFactory();
    this.logger = loggerFactory.getModuleLogger('CreateDevicesService');
  }

  async run(deviceToBeCreated: DeviceRequest) {
    try {
      this.logger.info('Creating new device:', deviceToBeCreated);

      const device = Device.fromPrimitives(deviceToBeCreated);
      const savedDevice = await this.repository.save(device);

      this.logger.info(
        `Successfully created device with ID: ${savedDevice.id.toString()}`
      );

      return savedDevice.toPrimitives();
    } catch (error) {
      this.logger.error('Error creating device:', error);
      throw error;
    }
  }
}
