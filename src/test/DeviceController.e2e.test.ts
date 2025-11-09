import { getContainer } from '../shared/infrastructure/dependency_injection/setup-dependency-injection';
import { Server } from '../shared/infrastructure/server/Server';
import http from 'http';
import { DeviceRequest, DeviceResponse } from '../application/dto/DeviceDtos';
import { StatusCodes } from 'http-status-codes';
import {
  createDevices,
  deleteDevice,
  getDevices,
  isPromiseSuccessful,
  updateDevice,
} from './util/HttpHelper';

describe('DeviceControllerE2ETests', () => {
  let httpServer: http.Server;
  const devicesToBeCreated: Array<DeviceRequest> = [
    {
      name: 'Iphone',
      brand: 'Apple',
      state: 'inactive',
    },
    {
      name: 'Pixel',
      brand: 'Google',
      state: 'in-use',
    },
  ];

  beforeAll(() => {
    const server: Server = getContainer().get('Server');
    httpServer = server.setup();
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

        createdDevicesResponse.forEach((response) => {
          if (isPromiseSuccessful(response)) {
            createdDevices.push(response.value.body);
          }
        });
      });

      test('Should respond with a 200 status code and an array of devices', async () => {
        const response = await getDevices(httpServer);

        expect(response.status).toEqual(StatusCodes.OK);
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
          expect(response[0].value.status).toEqual(StatusCodes.CREATED);
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
          expect(response[0].value.status).toEqual(StatusCodes.BAD_REQUEST);
        } else {
          throw new Error('Unable to assert the Post response');
        }
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

      createdDeviceResponse.forEach((response) => {
        if (isPromiseSuccessful(response)) {
          createdDevice = response.value.body;
        }
      });
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

        createdDeviceResponse.forEach((response) => {
          if (isPromiseSuccessful(response)) {
            createdDevice = response.value.body;
          }
        });
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
          if (isPromiseSuccessful(response)) {
            createdDevice = response.value.body;
          }
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
        [devicesToBeCreated[1]],
        httpServer
      );

      createdDeviceResponse.forEach((response) => {
        if (isPromiseSuccessful(response)) {
          createdDevice = response.value.body;
        }
      });
    });
    describe('When the device id exists', () => {
      test('Should delete the device', async () => {
        const response = await deleteDevice(createdDevice.id, httpServer);
        expect(response.status).toEqual(StatusCodes.NO_CONTENT);

        const devices = await getDevices(httpServer);
        expect(
          devices.body.data.find(
            (d: DeviceResponse) => d.id === createdDevice.id
          )
        ).toBeFalsy();
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
