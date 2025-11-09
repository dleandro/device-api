import { StatusCodes } from 'http-status-codes';
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
import { CreateDevicesService } from '../application/device/CreateDevicesService';
import { DeleteDevicesService } from '../application/device/DeleteDevicesService';
import { GetDeviceByIdService } from '../application/device/GetDeviceByIdService';
import { GetDevicesService } from '../application/device/GetDevicesService';
import { UpdateDevicesService } from '../application/device/UpdateDevicesService';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';
import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import TsLogLoggerFactory from '../shared/infrastructure/log/TsLogLoggerFactory';
import { Logger } from '../shared/model/Logger';

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
  private readonly logger: Logger;

  constructor() {
    const loggerFactory = new TsLogLoggerFactory();
    this.logger = loggerFactory.getModuleLogger('DeviceController');
  }

  @Get('')
  @HttpCode(StatusCodes.OK)
  async getDevices(
    @QueryParam('brand') brand?: string,
    @QueryParam('state') state?: string,
    @QueryParam('name') name?: string
  ) {
    return await this.getDevicesService.run(brand, state, name);
  }

  @Get('/:deviceId')
  @HttpCode(StatusCodes.OK)
  async getDeviceById(@Param('deviceId') deviceId: string) {
    return await this.getDeviceByIdService.run(deviceId);
  }

  @Post('')
  @HttpCode(StatusCodes.CREATED)
  async createDevice(
    @Body() deviceDto: DeviceRequest
  ): Promise<DeviceResponse> {
    return await this.createDevicesService.run(deviceDto);
  }

  @Put('/:deviceId')
  @HttpCode(StatusCodes.OK)
  async updateDevice(
    @Body() deviceDto: Partial<DeviceRequest>,
    @Param('deviceId') deviceId: string
  ): Promise<DeviceResponse> {
    return await this.updateDevicesService.run(deviceDto, deviceId);
  }

  @Delete('/:deviceId')
  @HttpCode(StatusCodes.NO_CONTENT)
  async deleteDevice(@Param('deviceId') deviceId: string) {
    await this.deleteDevicesService.run(deviceId);
    return {};
  }
}
