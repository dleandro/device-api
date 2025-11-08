import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Repository } from '../../shared/model/Repository';
import { DeviceResponse, Response } from '../dto/DeviceDtos';
import { Device, DevicePrimitives } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class GetDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');

  run(): Response<DeviceResponse> {
    const devicesRetrieved: Array<DevicePrimitives> = this.repository
      .getAll()
      .map((d) => d.toPrimitives());

    return {
      total: devicesRetrieved.length,
      data: devicesRetrieved,
    };
  }
}
