import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Repository } from '../../shared/model/Repository';
import { DeviceResponse, Response } from '../dto/DeviceDtos';
import { Device, DevicePrimitives } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class GetDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');

  run(brand?: string, state?: string, name?: string): Response<DeviceResponse> {
    const devicesRetrieved: Array<DevicePrimitives> = this.repository
      .getAll()
      .filter((d) => {
        const brandMatch = !brand || d.brand.value === brand;
        const stateMatch = !state || d.state.value === state;
        const nameMatch = !name || d.name.value === name;

        return brandMatch && stateMatch && nameMatch;
      })
      .map((d) => d.toPrimitives());

    return {
      total: devicesRetrieved.length,
      data: devicesRetrieved,
    };
  }
}
