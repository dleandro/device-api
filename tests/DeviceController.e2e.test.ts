import request from 'supertest';
import { app } from "../src/server"

describe('DeviceControllerE2ETests', () => {
  describe('GET /devices', () => {
    describe('When there are no devices in the DB', () => {
      test('Should respond with a 200 status code with an empty array', async () => {
        const response = await request(app).get("/devices").expect(200)
        console.log(response)
        expect(response.text).toEqual("[]")
      });
    });

    describe('When there are devices in the DB', () => {
      beforeAll(() => {
        // create devices
      })

      test.skip('Should respond with a 200 status code and an array of devices', async () => {
        const response = await request(app).get("/devices").expect(200)
        expect(response.body()).toEqual([])
      });
    });
  });
});
