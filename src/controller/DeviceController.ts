import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
} from 'routing-controllers';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';
import { GetDevicesService } from '../application/device/GetDevicesService';
import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { CreateDevicesService } from '../application/device/CreateDevicesService';
import { StatusCodes } from 'http-status-codes';
import { UpdateDevicesService } from '../application/device/UpdateDevicesService';
import { DeleteDevicesService } from '../application/device/DeleteDevicesService';
import { GetDeviceByIdService } from '../application/device/GetDeviceByIdService';

@JsonController('/device')
export class DeviceController {
  private readonly container = getContainer();
  private readonly getDevicesService: GetDevicesService =
    this.container.get('GetDevicesService');
  private readonly getDeviceByIdService: GetDeviceByIdService =
    this.container.get('GetDeviceByIdService');
  private readonly createDevicesService: CreateDevicesService =
    this.container.get('CreateDevicesService');
  private readonly updateDevicesService: UpdateDevicesService =
    this.container.get('UpdateDevicesService');
  private readonly deleteDevicesService: DeleteDevicesService =
    this.container.get('DeleteDevicesService');

  @Get('')
  @HttpCode(StatusCodes.OK)
  getDevices(
    @QueryParam('brand') brand?: string,
    @QueryParam('state') state?: string,
    @QueryParam('name') name?: string
  ) {
    return this.getDevicesService.run(brand, state, name);
  }

  @Get('/:deviceId')
  @HttpCode(StatusCodes.OK)
  getDeviceById(@Param('deviceId') deviceId: string) {
    return this.getDeviceByIdService.run(deviceId);
  }

  @Post('')
  @HttpCode(StatusCodes.CREATED)
  createDevice(@Body() deviceDto: DeviceRequest): DeviceResponse {
    return this.createDevicesService.run(deviceDto);
  }

  @Put('/:deviceId')
  @HttpCode(StatusCodes.OK)
  updateDevice(
    @Body() deviceDto: Partial<DeviceRequest>,
    @Param('deviceId') deviceId: string
  ): DeviceResponse | undefined {
    return this.updateDevicesService.run(deviceDto, deviceId);
  }

  @Delete('/:deviceId')
  @HttpCode(StatusCodes.NO_CONTENT)
  deleteDevice(@Param('deviceId') deviceId: string) {
    this.deleteDevicesService.run(deviceId);

    return {};
  }
}
