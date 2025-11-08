import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Server } from '../shared/infrastructure/server/Server';
import request from 'supertest';
import http from 'http';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';

describe('DeviceControllerE2ETests', () => {
  let httpServer: http.Server;
  const devicesToBeCreated: Array<DeviceRequest> = [
    {
      name: 'Iphone',
      brand: 'Apple',
      state: 'available',
    },
    {
      name: 'Pixel',
      brand: 'Google',
      state: 'available',
    },
  ];

  beforeAll(() => {
    const server: Server = getContainer().get('Server');
    httpServer = server.setup();
  });

  describe('GET /device', () => {
    describe('When there are no devices in the DB', () => {
      test('Should respond with a 200 status code with an empty array', async () => {
        const response = await request(httpServer).get('/device').expect(200);
        expect(response.body).toEqual({ total: 0, data: [] });
      });
    });

    describe('When there are devices in the DB', () => {
      const createdDevices: Array<DeviceResponse> = [];

      beforeAll(async () => {
        const createdDevicesResponse = await createDevices(
          devicesToBeCreated,
          httpServer
        );

        createdDevicesResponse.forEach((response) => {
          if (isPromiseSuccessful(response)) {
            createdDevices.push(response.value.body);
          }
        });
      });

      test('Should respond with a 200 status code and an array of devices', async () => {
        const response = await request(httpServer).get('/device').expect(200);
        expect(response.body).toEqual({
          total: createdDevices.length,
          data: createdDevices,
        });
      });
    });
  });
  describe('POST /device', () => {
    describe('When the device in the body is valid', () => {
      test('Should create a device successfully and send a 201 Status code', async () => {
        const response = await createDevices(
          [devicesToBeCreated[0]],
          httpServer
        );

        if (isPromiseSuccessful(response[0])) {
          expect(response[0].value.body.name).toEqual(
            devicesToBeCreated[0].name
          );
          expect(response[0].value.body.brand).toEqual(
            devicesToBeCreated[0].brand
          );
          expect(response[0].value.status).toEqual(201);
        } else {
          throw new Error('Unable to assert the Post response');
        }
      });
    });
    describe('When the device in the body is invalid', () => {
      test('Should throw an error response with a 400 Status code', async () => {
        const response = await createDevices(
          [{ fakeDevice: 'test' } as unknown as DeviceRequest],
          httpServer
        );

        if (isPromiseSuccessful(response[0])) {
          expect(response[0].value.status).toEqual(400);
        } else {
          throw new Error('Unable to assert the Post response');
        }
      });
    });
  });
  describe('PUT /device', () => {
    describe('When the fields in the body are valid and update is partial', () => {});
    describe('When the fields in the body are valid and createdAt is included', () => {});
    describe('When the device is in use', () => {});
  });
});

function createDevices(devices: Array<DeviceRequest>, httpServer: http.Server) {
  return Promise.allSettled(
    devices.map((d) =>
      request(httpServer)
        .post('/device')
        .set('Content-Type', 'application/json')
        .send(d)
    )
  );
}

function isPromiseSuccessful<T>(
  prom: PromiseSettledResult<T>
): prom is PromiseFulfilledResult<T> {
  return prom.status === 'fulfilled';
}
