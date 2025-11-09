import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Repository } from '../../shared/model/Repository';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class DeleteDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');

  run(deviceId: string) {
    return this.repository.delete(new DeviceId(deviceId));
  }
}
