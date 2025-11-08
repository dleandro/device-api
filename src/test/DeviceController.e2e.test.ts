import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Server } from '../shared/infrastructure/server/Server';
import request from 'supertest';
import http from 'http';
import { Device } from '../controller/DeviceController';

describe('DeviceControllerE2ETests', () => {
  let httpServer: http.Server;

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
      const devicesToBeCreated: Array<Device> = [
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

      beforeAll(async () => {
        await createDevices(devicesToBeCreated, httpServer);
      });

      test('Should respond with a 200 status code and an array of devices', async () => {
        const response = await request(httpServer).get('/device').expect(200);
        expect(response.body).toEqual({
          total: devicesToBeCreated.length,
          data: devicesToBeCreated,
        });
      });
    });
  });
});

function createDevices(devices: Array<Device>, httpServer: http.Server) {
  return Promise.allSettled(
    devices.map((d) =>
      request(httpServer)
        .post('/device')
        .set('Content-Type', 'application/json')
        .send(d)
    )
  );
}
