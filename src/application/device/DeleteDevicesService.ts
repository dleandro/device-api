import { ValidationDomainError } from '../../shared/domain/model/errors/ValidationDomainError';
import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Repository } from '../../shared/model/Repository';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class DeleteDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');

  run(deviceId: string) {
    const id = new DeviceId(deviceId);
    const deviceToDelete = this.repository.findById(id);

    if (deviceToDelete.canBeDeleted()) {
      return this.repository.delete(id);
    } else {
      throw new ValidationDomainError(
        'This device cannot be deleted as it is in use'
      );
    }
  }
}
