import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Server } from '../shared/infrastructure/server/Server';
import request from 'supertest';
import http from 'http';

let httpServer: http.Server;

beforeAll(() => {
  const server: Server = getContainer().get('Server');
  httpServer = server.setup();
});

describe('DeviceControllerE2ETests', () => {
  describe('GET /device', () => {
    describe('When there are no devices in the DB', () => {
      test('Should respond with a 200 status code with an empty array', async () => {
        const response = await request(httpServer).get('/device').expect(200);
        expect(response.body).toEqual({ total: 0, data: [] });
      });
    });

    describe('When there are devices in the DB', () => {
      beforeAll(() => {
        // create devices
      });

      test.skip('Should respond with a 200 status code and an array of devices', async () => {
        const response = await request(httpServer).get('/devices').expect(200);
        expect(response.body()).toEqual([]);
      });
    });
  });
});
