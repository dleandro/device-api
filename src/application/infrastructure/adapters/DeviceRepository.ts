import { MongoDbClient } from '../../../shared/infrastructure/db/mongo/MongoDbClient';
import { Repository } from '../../../shared/model/Repository';
import { Device } from '../../device/model/entities/Device';
import { DeviceId } from '../../device/model/entities/value_objects/DeviceId';
import getModuleLogger from '../../port/log/get-module-logger';
import { DeviceNotFoundError } from '../errors/DeviceNotFoundError';
import { DeviceModel, IDeviceDocument } from './model/Device';

export class DeviceRepository implements Repository<Device, DeviceId> {
  private readonly log = getModuleLogger('DeviceRepository');
  private readonly dbConnection = MongoDbClient.getInstance();

  private async ensureConnection(): Promise<void> {
    await this.dbConnection.ensureConnection();
  }

  async getAll() {
    await this.ensureConnection();
    this.log.debug('Fetching all devices from MongoDB');
    const deviceDocs = await DeviceModel.find().exec();

    const devices = deviceDocs.map((doc) => this.documentToDevice(doc));
    this.log.debug(`Retrieved ${devices.length} devices from MongoDB`);

    return devices;
  }

  async findById(id: DeviceId) {
    await this.ensureConnection();
    this.log.debug(`Finding device by id: ${id.toString()}`);
    const deviceDoc = await DeviceModel.findOne({ id: id.toString() }).exec();

    if (!deviceDoc) {
      throw new DeviceNotFoundError(
        `Device with id ${id.toString()} doesn't exist`
      );
    }

    const device = this.documentToDevice(deviceDoc);
    this.log.debug(`Found device: ${device.name.toString()}`);

    return device;
  }

  async save(device: Device) {
    await this.ensureConnection();
    this.log.debug(`Saving device: ${device.name.toString()}`);
    const primitives = device.toPrimitives();

    const deviceDoc = new DeviceModel(primitives);
    await deviceDoc.save();

    this.log.debug(`Device saved with id: ${device.id.toString()}`);
    return device;
  }

  async update(device: Device) {
    await this.ensureConnection();
    this.log.debug(`Updating device with id: ${device.id.toString()}`);
    const primitives = device.toPrimitives();

    const updatedDoc = await DeviceModel.findOneAndUpdate(
      { id: device.id.toString() },
      primitives,
      { new: true, runValidators: true }
    ).exec();

    if (!updatedDoc) {
      throw new DeviceNotFoundError(
        `Device with id ${device.id.toString()} doesn't exist`
      );
    }

    this.log.debug(`Device updated: ${device.name.toString()}`);
    return device;
  }

  async delete(id: DeviceId) {
    await this.ensureConnection();
    this.log.debug(`Deleting device with id: ${id.toString()}`);

    const result = await DeviceModel.deleteOne({ id: id.toString() }).exec();

    if (result.deletedCount === 0) {
      throw new DeviceNotFoundError(
        `Device with id ${id.toString()} doesn't exist`
      );
    }

    this.log.debug(`Device deleted with id: ${id.toString()}`);
  }

  private documentToDevice(doc: IDeviceDocument): Device {
    const primitives = doc.toPrimitives();
    return Device.fromPrimitives(primitives);
  }
}
