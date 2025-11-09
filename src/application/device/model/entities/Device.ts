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
  public readonly id: DeviceId
  public readonly createdAt: DeviceCreatedAt
  
  constructor(
    public name: DeviceName,
    public brand: DeviceBrand,
    public state: DeviceState,
    id?: DeviceId,
    createdAt?: DeviceCreatedAt
  ) {
    if (id) {
      this.id = id
    } else {
      this.id = new DeviceId();
    }
    if (createdAt) {
      this.createdAt = createdAt
    } else {
      this.createdAt = new DeviceCreatedAt();
    }
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
    if (this.state.value === 'in-use' && (devicePrimitives.brand || devicePrimitives.name)) {
      throw new ValidationDomainError('The device is in use. Updates disabled for brand and name properties');
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
  
  canBeDeleted() {
    return this.state.value !== 'in-use';
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
        new DeviceState(devicePrimitives.state),
        devicePrimitives.id ? new DeviceId(devicePrimitives.id) : undefined,
        devicePrimitives.createdAt ? new DeviceCreatedAt(devicePrimitives.createdAt) : undefined
      );
    } else {
      throw new ValidationDomainError(
        'Error creating a Device due to missing some of the mandatory device parameters.'
      );
    }
  }
}
