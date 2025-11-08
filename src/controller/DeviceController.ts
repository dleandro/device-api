import { Get, JsonController } from 'routing-controllers';

type Result<T> = {
  data: Array<T>;
  total: number;
};

@JsonController('/device')
export class DeviceController {
  @Get('/')
  getDevices() {
    const response: Result<unknown> = {
      data: [],
      total: 0,
    };

    return response;
  }
}
