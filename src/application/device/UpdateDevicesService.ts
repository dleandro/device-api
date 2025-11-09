import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import TsLogLoggerFactory from '../../shared/infrastructure/log/TsLogLoggerFactory';
import { Logger } from '../../shared/model/Logger';
import { Repository } from '../../shared/model/Repository';
import { DeviceRequest } from '../dto/DeviceDtos';
import { DeviceNotFoundError } from '../infrastructure/errors/DeviceNotFoundError';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class UpdateDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');
  private readonly logger: Logger;

  constructor() {
    const loggerFactory = new TsLogLoggerFactory();
    this.logger = loggerFactory.getModuleLogger('UpdateDevicesService');
  }

  async run(deviceToBeUpdated: Partial<DeviceRequest>, deviceId: string) {
    try {
      this.logger.info(
        `Updating device with ID: ${deviceId}`,
        deviceToBeUpdated
      );

      // Use findById instead of getAll for better performance
      const deviceIdObj = new DeviceId(deviceId);
      const device = await this.repository.findById(deviceIdObj);

      if (!device) {
        throw new DeviceNotFoundError('Device not on the database.');
      }

      device.updateFields(deviceToBeUpdated);
      const updatedDevice = await this.repository.update(device);

      this.logger.info(
        `Successfully updated device: ${updatedDevice.name.toString()}`
      );

      return updatedDevice.toPrimitives();
    } catch (error) {
      this.logger.error(`Error updating device with ID ${deviceId}:`, error);
      throw error;
    }
  }
}
