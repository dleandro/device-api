import { ValidationDomainError } from '../../../../shared/domain/model/errors/ValidationDomainError';
import { DeviceBrand } from './value_objects/DeviceBrand';
import { DeviceCreatedAt } from './value_objects/DeviceCreatedAt';
import { DeviceId } from './value_objects/DeviceId';
import { DeviceName } from './value_objects/DeviceName';
import { DeviceState } from './value_objects/DeviceState';

export type DevicePrimitives = {
  id: string;
  name: string;
  brand: string;
  state: string;
  createdAt: string;
};

export class Device {
  public readonly createdAt: DeviceCreatedAt;
  public readonly id: DeviceId;

  constructor(
    public name: DeviceName,
    public brand: DeviceBrand,
    public state: DeviceState
  ) {
    this.id = new DeviceId();
    this.createdAt = new DeviceCreatedAt();
  }

  toPrimitives(): DevicePrimitives {
    return {
      id: this.id.toString(),
      name: this.name.toString(),
      brand: this.brand.toString(),
      state: this.state.toString(),
      createdAt: this.createdAt.toString(),
    };
  }

  updateFields(devicePrimitives: Partial<DevicePrimitives>) {
    if (this.state.value === 'in-use') {
      throw new ValidationDomainError('The device is in use. Updates disabled');
    }
    if (devicePrimitives.brand) {
      this.brand = new DeviceBrand(devicePrimitives.brand);
    }
    if (devicePrimitives.state) {
      this.state = new DeviceState(devicePrimitives.state);
    }
    if (devicePrimitives.name) {
      this.name = new DeviceName(devicePrimitives.name);
    }
  }

  static fromPrimitives(devicePrimitives: Partial<DevicePrimitives>) {
    if (
      devicePrimitives.name &&
      devicePrimitives.brand &&
      devicePrimitives.state
    ) {
      return new Device(
        new DeviceName(devicePrimitives.name),
        new DeviceBrand(devicePrimitives.brand),
        new DeviceState(devicePrimitives.state)
      );
    } else {
      throw new ValidationDomainError(
        'Error creating a Device due to missing some of the mandatory device parameters.'
      );
    }
  }
}
