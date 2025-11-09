import { ServiceOptions } from 'typedi';
import { GetDevicesService } from '../../../../../application/device/GetDevicesService';
import { CreateDevicesService } from '../../../../../application/device/CreateDevicesService';
import { DeviceRepository } from '../../../../../application/infrastructure/adapters/DeviceRepository';
import { UpdateDevicesService } from '../../../../../application/device/UpdateDevicesService';
import { DeleteDevicesService } from '../../../../../application/device/DeleteDevicesService';

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
    id: 'UpdateDevicesService',
    type: UpdateDevicesService,
  },
  {
    id: 'DeleteDevicesService',
    type: DeleteDevicesService,
  },
  {
    id: 'DeviceRepository',
    type: DeviceRepository,
  },
];

export default dependencies;
