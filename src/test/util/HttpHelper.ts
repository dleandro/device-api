import http from 'http';
import request from 'supertest';
import { DeviceRequest } from '../../application/dto/DeviceDtos';

export function getDevices(httpServer: http.Server) {
  return request(httpServer).get('/device');
}

export function createDevices(
  devices: Array<DeviceRequest>,
  httpServer: http.Server
) {
  return Promise.allSettled(
    devices.map((d) =>
      request(httpServer)
        .post('/device')
        .set('Content-Type', 'application/json')
        .send(d)
    )
  );
}

export function updateDevice(
  deviceToBeUpdated: DeviceRequest,
  deviceId: string,
  httpServer: http.Server
) {
  return request(httpServer)
    .put(`/device/${deviceId}`)
    .set('Content-Type', 'application/json')
    .send(deviceToBeUpdated);
}

export function deleteDevice(deviceId: string, httpServer: http.Server) {
  return request(httpServer).delete(`/device/${deviceId}`);
}

export function isPromiseSuccessful<T>(
  prom: PromiseSettledResult<T>
): prom is PromiseFulfilledResult<T> {
  return prom.status === 'fulfilled';
}
