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
    public readonly name: DeviceName,
    public readonly brand: DeviceBrand,
    public readonly state: DeviceState
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
