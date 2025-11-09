import { getContainer } from '../../shared/infrastructure/dependency_injection/setup-dependency-injection';
import TsLogLoggerFactory from '../../shared/infrastructure/log/TsLogLoggerFactory';
import { Logger } from '../../shared/model/Logger';
import { Repository } from '../../shared/model/Repository';
import { DeviceResponse, Response } from '../dto/DeviceDtos';
import { Device, DevicePrimitives } from './model/entities/Device';
import { DeviceId } from './model/entities/value_objects/DeviceId';

export class GetDevicesService {
  private readonly repository: Repository<Device, DeviceId> =
    getContainer().get('DeviceRepository');
  private readonly logger: Logger;

  constructor() {
    const loggerFactory = new TsLogLoggerFactory();
    this.logger = loggerFactory.getModuleLogger('GetDevicesService');
  }

  async run(
    brand?: string,
    state?: string,
    name?: string
  ): Promise<Response<DeviceResponse>> {
    try {
      this.logger.info('Fetching devices with filters:', {
        brand,
        state,
        name,
      });

      const allDevices = await this.repository.getAll();

      const devicesRetrieved: Array<DevicePrimitives> = allDevices
        .filter((d) => {
          const brandMatch = !brand || d.brand.value === brand;
          const stateMatch = !state || d.state.value === state;
          const nameMatch = !name || d.name.value === name;

          return brandMatch && stateMatch && nameMatch;
        })
        .map((d) => d.toPrimitives());

      this.logger.info(
        `Successfully retrieved ${devicesRetrieved.length} devices`
      );

      return {
        total: devicesRetrieved.length,
        data: devicesRetrieved,
      };
    } catch (error) {
      this.logger.error('Error fetching devices:', error);
      throw error;
    }
  }
}
