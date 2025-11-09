import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Repository } from '../../shared/model/Repository';
import { DeviceRequest } from '../dto/DeviceDtos';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class UpdateDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');

  run(deviceToBeUpdated: Partial<DeviceRequest>, deviceId: string) {
    // will be replaced by a findById or through a normal update in DB
    const device = this.repository
      .getAll()
      .filter((d) => d.id.value === deviceId)[0];

    device.updateFields(deviceToBeUpdated);

    if (device) {
      this.repository.update(device);
      return device.toPrimitives();
    }
  }
}
