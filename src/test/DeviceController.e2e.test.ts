import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Server } from '../shared/infrastructure/server/Server';
import http from 'http';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';
import { StatusCodes } from 'http-status-codes';
import {
  createDevices,
  deleteDevice,
  getDeviceById,
  getDevices,
  updateDevice,
} from './util/HttpHelper';

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
      state: 'in-use',
    },
    {
      name: 'Pixel',
      brand: 'Google',
      state: 'available',
    },
    {
      name: 'Xyz',
      brand: 'Nokia',
      state: 'inactive',
    },
    {
      name: 'pda',
      brand: 'htc',
      state: 'inactive',
    },
  ];

  beforeAll(() => {
    const server: Server = getContainer().get('Server');
    httpServer = server.setup();
  });

  afterAll(() => {
    httpServer.close();
  });

  describe('GET /device', () => {
    describe('When there are no devices in the DB', () => {
      test('Should respond with a 200 status code with an empty array', async () => {
        const response = await getDevices(httpServer);

        expect(response.status).toEqual(StatusCodes.OK);
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

        createdDevicesResponse.forEach((dResponse) =>
          createdDevices.push(dResponse.body)
        );
      });

      test('Should respond with a 200 status code and an array with all the saved devices', async () => {
        const response = await getDevices(httpServer);

        expect(response.status).toEqual(StatusCodes.OK);
        expect(response.body).toEqual({
          total: createdDevices.length,
          data: createdDevices,
        });
      });

      describe('and we filter by brand', () => {
        test('Should only return the devices from this specific brand', async () => {
          const response = await getDevices(
            httpServer,
            `?brand=${createdDevices[2].brand}`
          );

          expect(response.body.data[0].brand).toEqual(createdDevices[2].brand);
          expect(response.body.data[1].brand).toEqual(createdDevices[2].brand);
          expect(response.body.total).toEqual(2);
        });
      });
      describe('and we filter by state', () => {
        test('Should only return the devices from this specific state', async () => {
          const response = await getDevices(
            httpServer,
            `?state=${createdDevices[2].state}`
          );

          expect(response.body.data[0].state).toEqual(createdDevices[2].state);
          expect(response.body.data[1].state).toEqual(createdDevices[2].state);
          expect(response.body.total).toEqual(2);
        });
      });
      describe('and we filter by name', () => {
        test('Should only return the devices with this specific name', async () => {
          const response = await getDevices(
            httpServer,
            `?name=${createdDevices[0].name}`
          );

          expect(response.body.data[0].name).toEqual(createdDevices[0].name);
          expect(response.body.total).toEqual(1);
        });
      });
      describe('and we filter by name and brand', () => {
        test('Should only return the devices with this specific name', async () => {
          const response = await getDevices(
            httpServer,
            `?name=${createdDevices[0].name}&brand=${createdDevices[0].brand}`
          );

          expect(response.body.data[0].name).toEqual(createdDevices[0].name);
          expect(response.body.data[0].brand).toEqual(createdDevices[0].brand);
          expect(response.body.total).toEqual(1);
        });
      });
    });
  });
  describe('GET /device/:deviceId', () => {
    describe('When the device id is non-existant', () => {
      test('Should respond with a 404 Status code', async () => {
        const response = await getDeviceById('non-existant-id', httpServer);
        expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      });
    });
    describe('When the device id is known', () => {
      let createdDevice: DeviceResponse;

      beforeAll(async () => {
        const createdDeviceResponse = await createDevices(
          [devicesToBeCreated[0]],
          httpServer
        );

        createdDevice = createdDeviceResponse[0].body;
      });
      test('Should respond with Device', async () => {
        const response = await getDeviceById(createdDevice.id, httpServer);
        expect(response.status).toEqual(StatusCodes.OK);
        expect(response.body.name).toEqual(createdDevice.name);
        expect(response.body.brand).toEqual(createdDevice.brand);
        expect(response.body.state).toEqual(createdDevice.state);
        expect(response.body.createdAt).toEqual(createdDevice.createdAt);
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

        expect(response[0].body.name).toEqual(devicesToBeCreated[0].name);
        expect(response[0].body.brand).toEqual(devicesToBeCreated[0].brand);
        expect(response[0].status).toEqual(StatusCodes.CREATED);
      });
    });
    describe('When the device in the body is invalid', () => {
      test('Should throw an error response with a 400 Status code', async () => {
        const response = await createDevices(
          [{ fakeDevice: 'test' } as unknown as DeviceRequest],
          httpServer
        );

        expect(response[0].status).toEqual(StatusCodes.BAD_REQUEST);
      });
    });
  });
  describe('PUT /device/:id', () => {
    let createdDevice: DeviceResponse;

    beforeAll(async () => {
      const createdDeviceResponse = await createDevices(
        [devicesToBeCreated[0]],
        httpServer
      );

      createdDevice = createdDeviceResponse[0].body;
    });
    describe('When the fields in the body are valid and update is partial', () => {
      test('Should update the device correctly', async () => {
        const deviceToBeUpdated = { ...devicesToBeCreated[0] };
        deviceToBeUpdated.brand = 'Nokia';

        const response = await updateDevice(
          deviceToBeUpdated,
          createdDevice.id,
          httpServer
        );
        expect(response.status).toEqual(StatusCodes.OK);

        // Using get for now but in the future it should be get by id
        const devicesStored = await getDevices(httpServer);
        expect(
          devicesStored.body.data.find(
            (d: DeviceResponse) => d.id === createdDevice.id
          ).brand
        ).toEqual(deviceToBeUpdated.brand);
      });
    });
    describe('When the fields in the body are valid (full update) and createdAt is included', () => {
      let createdDevice: DeviceResponse;

      beforeAll(async () => {
        const createdDeviceResponse = await createDevices(
          [devicesToBeCreated[0]],
          httpServer
        );

        createdDevice = createdDeviceResponse[0].body;
      });
      test('Should update the device successfully but the createdAt field should not change', async () => {
        const updatedDevice = {
          name: 'Updated_name',
          brand: 'Updated_brand',
          state: 'available',
          createdAt: '2025-11-09T10:58:41.776Z',
        };

        const response = await updateDevice(
          updatedDevice,
          createdDevice.id,
          httpServer
        );
        expect(response.status).toEqual(200);
        expect(response.body.createdAt).not.toEqual(updatedDevice.createdAt);
      });
    });
    describe('When the device is in use', () => {
      let createdDevice: DeviceResponse;

      beforeAll(async () => {
        const createdDeviceResponse = await createDevices(
          [devicesToBeCreated[1]],
          httpServer
        );

        createdDeviceResponse.forEach((response) => {
          createdDevice = response.body;
        });
      });
      test('Should not run the update and the correct error should be sent in the response', async () => {
        const updatedDevice = {
          name: 'Updated_name',
          brand: 'Updated_brand',
          state: 'available',
          createdAt: '2025-11-09T10:58:41.776Z',
        };

        const response = await updateDevice(
          updatedDevice,
          createdDevice.id,
          httpServer
        );
        expect(response.status).toEqual(400);
      });
    });
    describe("When the device to be updated doesn't exist", () => {
      test('Should receive a 404 error', async () => {
        const response = await updateDevice(
          devicesToBeCreated[0],
          'non-existant-id',
          httpServer
        );

        expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      });
    });
  });
  describe('DELETE /:id', () => {
    let createdDevice: DeviceResponse;

    beforeAll(async () => {
      const createdDeviceResponse = await createDevices(
        [devicesToBeCreated[0]],
        httpServer
      );

      createdDeviceResponse.forEach((response) => {
        createdDevice = response.body;
      });
    });
    describe('When the device id exists and is not in use', () => {
      test('Should delete the device', async () => {
        const response = await deleteDevice(createdDevice.id, httpServer);
        expect(response.status).toEqual(StatusCodes.NO_CONTENT);

        const emptyResponse = await getDeviceById(createdDevice.id, httpServer);
        expect(emptyResponse.status).toEqual(StatusCodes.NOT_FOUND);
      });
      describe('and the device is in use', () => {
        let createdInUseDevice: DeviceResponse;
        beforeAll(async () => {
          const createdDeviceResponse = await createDevices(
            [devicesToBeCreated[1]],
            httpServer
          );

          createdDeviceResponse.forEach((response) => {
            createdInUseDevice = response.body;
          });
        });
        test('Should not delete the device and should respond with a 400', async () => {
          const response = await deleteDevice(
            createdInUseDevice.id,
            httpServer
          );
          expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
        });
      });
    });
    describe("When the device id doesn't exist", () => {
      test('Should not delete anything and should return a 404', async () => {
        const response = await deleteDevice('non-existant-id', httpServer);
        expect(response.status).toEqual(StatusCodes.NOT_FOUND);
      });
    });
  });
});
