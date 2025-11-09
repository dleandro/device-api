import mongoose, { Document, Schema } from 'mongoose';
import { DevicePrimitives } from '../../../device/model/entities/Device';

// MongoDB Document interface
export interface IDeviceDocument extends Document {
  _id: mongoose.Types.ObjectId;
  id: string; // Our domain ID (different from Mongoose's id)
  name: string;
  brand: string;
  state: string;
  createdAt: string;
  toPrimitives(): DevicePrimitives;
}

// Mongoose Schema for Device
const DeviceSchema: Schema = new Schema<IDeviceDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    state: {
      type: String,
      required: true,
      enum: ['available', 'in-use', 'inactive'],
      default: 'available',
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  {
    // Add timestamps for audit trail (MongoDB timestamps, separate from our domain createdAt)
    timestamps: true,
    // Ensure virtual fields are serialized
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add indexes for better query performance
DeviceSchema.index({ name: 1 });
DeviceSchema.index({ brand: 1 });
DeviceSchema.index({ state: 1 });
DeviceSchema.index({ createdAt: 1 });

// Add compound indexes for common queries
DeviceSchema.index({ brand: 1, state: 1 });
DeviceSchema.index({ state: 1, createdAt: 1 });

// Pre-save middleware for validation
DeviceSchema.pre<IDeviceDocument>('save', function (next) {
  // Ensure the id field is present
  if (!this.id) {
    return next(new Error('Device ID is required'));
  }

  // Ensure createdAt is present
  if (!this.createdAt) {
    return next(new Error('Device createdAt is required'));
  }

  next();
});

// Instance method to convert to DevicePrimitives
DeviceSchema.methods.toPrimitives = function (): DevicePrimitives {
  return {
    id: this.id,
    name: this.name,
    brand: this.brand,
    state: this.state,
    createdAt: this.createdAt,
  };
};

// Static method to create from DevicePrimitives
DeviceSchema.statics.fromPrimitives = function (
  primitives: DevicePrimitives
): IDeviceDocument {
  return new this({
    id: primitives.id,
    name: primitives.name,
    brand: primitives.brand,
    state: primitives.state,
    createdAt: primitives.createdAt,
  });
};

// Export the model
export const DeviceModel = mongoose.model<IDeviceDocument>(
  'Device',
  DeviceSchema
);

// Type for static methods
export interface IDeviceModel extends mongoose.Model<IDeviceDocument> {
  fromPrimitives(primitives: DevicePrimitives): IDeviceDocument;
}
