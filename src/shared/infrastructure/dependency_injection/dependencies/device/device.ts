import { ServiceOptions } from 'typedi';
import { GetDevicesService } from '../../../../../application/device/GetDevicesService';
import { CreateDevicesService } from '../../../../../application/device/CreateDevicesService';
import { DeviceRepository } from '../../../../../application/infrastructure/adapters/DeviceRepository';

const dependencies: Array<ServiceOptions> = [
  {
    id: 'GetDevicesService',
    type: GetDevicesService,
  },
  {
    id: 'CreateDevicesService',
    type: CreateDevicesService,
  },
  {
    id: 'DeviceRepository',
    type: DeviceRepository,
  },
];

export default dependencies;
