import { ValidationDomainError } from '../../shared/domain/model/errors/ValidationDomainError';
import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import TsLogLoggerFactory from '../../shared/infrastructure/log/TsLogLoggerFactory';
import { Logger } from '../../shared/model/Logger';
import { Repository } from '../../shared/model/Repository';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class DeleteDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');
  private readonly logger: Logger;

  constructor() {
    const loggerFactory = new TsLogLoggerFactory();
    this.logger = loggerFactory.getModuleLogger('DeleteDevicesService');
  }

  async run(deviceId: string) {
    try {
      this.logger.info(`Attempting to delete device with ID: ${deviceId}`);

      const id = new DeviceId(deviceId);
      const deviceToDelete = await this.repository.findById(id);

      if (deviceToDelete.canBeDeleted()) {
        await this.repository.delete(id);
        this.logger.info(`Successfully deleted device with ID: ${deviceId}`);
      } else {
        this.logger.warn(
          `Cannot delete device with ID ${deviceId}: device is in use`
        );
        throw new ValidationDomainError(
          'This device cannot be deleted as it is in use'
        );
      }
    } catch (error) {
      this.logger.error(`Error deleting device with ID ${deviceId}:`, error);
      throw error;
    }
  }
}
