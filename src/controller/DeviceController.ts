import { Body, Get, HttpCode, JsonController, Post } from 'routing-controllers';

type Result<T> = {
  data: Array<T>;
  total: number;
};

export type Device = {
  id?: number;
  name: string;
  brand: string;
  state: 'available' | 'in-use' | 'inactive';
  createdAt?: string;
};

@JsonController('/device')
export class DeviceController {
  private devices: Array<Device> = [];
  @Get('')
  getDevices() {
    const response: Result<Device> = {
      data: this.devices,
      total: this.devices.length,
    };

    return response;
  }

  @Post('')
  @HttpCode(201)
  createDevice(@Body() device: Device) {
    this.devices.push(device);
    return { result: 'success' };
  }
}
