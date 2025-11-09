import {
  Body,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
} from 'routing-controllers';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';
import { GetDevicesService } from '../application/device/GetDevicesService';
import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { CreateDevicesService } from '../application/device/CreateDevicesService';
import { StatusCodes } from 'http-status-codes';
import { UpdateDevicesService } from '../application/device/UpdateDevicesService';

@JsonController('/device')
export class DeviceController {
  private readonly container = getContainer();
  private readonly getDevicesService: GetDevicesService =
    this.container.get('GetDevicesService');
  private readonly createDevicesService: CreateDevicesService =
    this.container.get('CreateDevicesService');
  private readonly updateDevicesService: UpdateDevicesService =
    this.container.get('UpdateDevicesService');

  @Get('')
  @HttpCode(StatusCodes.OK)
  getDevices() {
    return this.getDevicesService.run();
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
}
