import { Repository } from '../../../shared/model/Repository';
import { Device } from '../../device/model/entities/Device';
import { DeviceId } from '../../device/model/entities/value_objects/DeviceId';

export class DeviceRepository implements Repository<Device, DeviceId> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findById(id: DeviceId): Device | null {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  delete(id: DeviceId): void {
    throw new Error('Method not implemented.');
  }
  private devices: Array<Device> = [];

  getAll() {
    return this.devices;
  }

  save(device: Device) {
    this.devices.push(device);

    return device;
  }
}
