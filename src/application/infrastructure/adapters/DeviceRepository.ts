import { Repository } from '../../../shared/model/Repository';
import { Device } from '../../device/model/entities/Device';
import { DeviceId } from '../../device/model/entities/value_objects/DeviceId';
import { DeviceNotFoundError } from '../errors/DeviceNotFoundError';

export class DeviceRepository implements Repository<Device, DeviceId> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findById(id: DeviceId): Device | null {
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

  update(device: Device): Device {
    const deviceToUpdate = this.devices.find((d) => d.id === device.id);

    if (deviceToUpdate) {
      const indexToUpdate = this.devices.indexOf(deviceToUpdate);
      this.devices[indexToUpdate] = device;

      return device;
    } else {
      throw new DeviceNotFoundError(
        `Device with id ${device.id.value} doesn't exist`
      );
    }
  }

  delete(id: DeviceId): void {
    const deviceToDelete = this.devices.find(
      (d) => d.id.toString() === id.toString()
    );

    if (deviceToDelete) {
      const indexToDelete = this.devices.indexOf(deviceToDelete);

      this.devices.splice(indexToDelete, 1);
      return;
    } else {
      throw new DeviceNotFoundError(`Device with id ${id} doesn't exist`);
    }
  }
}
