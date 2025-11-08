import { Body, Get, HttpCode, JsonController, Post } from 'routing-controllers';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';
import { GetDevicesService } from '../application/device/GetDevicesService';
import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { CreateDevicesService } from '../application/device/CreateDevicesService';

@JsonController('/device')
export class DeviceController {
  private readonly container = getContainer();
  private readonly getDevicesService: GetDevicesService =
    this.container.get('GetDevicesService');
  private readonly createDevicesService: CreateDevicesService =
    this.container.get('CreateDevicesService');

  @Get('')
  getDevices() {
    return this.getDevicesService.run();
  }

  @Post('')
  @HttpCode(201)
  createDevice(@Body() deviceDto: DeviceRequest): DeviceResponse {
    return this.createDevicesService.run(deviceDto);
  }
}
