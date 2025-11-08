import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Repository } from '../../shared/model/Repository';
import { DeviceRequest } from '../dto/DeviceDtos';
import { Device } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class CreateDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');

  run(deviceToBeCreated: DeviceRequest) {
    const device = Device.fromPrimitives(deviceToBeCreated);
    return this.repository.save(device).toPrimitives();
  }
}
