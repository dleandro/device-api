// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

print('Creating devices_api database and collections...');

// Switch to devices_api database
db = db.getSiblingDB('devices_api');

// Create the devices collection with schema validation
db.createCollection('devices', {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['id', 'name', 'brand', 'state', 'createdAt'],
      properties: {
        id: {
          bsonType: 'string',
          description: 'Device ID must be a string and is required',
        },
        name: {
          bsonType: 'string',
          maxLength: 100,
          description:
            'Device name must be a string with max 100 characters and is required',
        },
        brand: {
          bsonType: 'string',
          maxLength: 50,
          description:
            'Device brand must be a string with max 50 characters and is required',
        },
        state: {
          bsonType: 'string',
          enum: ['available', 'in-use', 'inactive'],
          description:
            'Device state must be one of: available, in-use, inactive',
        },
        createdAt: {
          bsonType: 'string',
          description: 'CreatedAt must be a string and is required',
        },
      },
    },
  },
});

// Create indexes for better performance
db.devices.createIndex({ id: 1 }, { unique: true });
db.devices.createIndex({ name: 1 });
db.devices.createIndex({ brand: 1 });
db.devices.createIndex({ state: 1 });
db.devices.createIndex({ createdAt: 1 });
db.devices.createIndex({ brand: 1, state: 1 });
db.devices.createIndex({ state: 1, createdAt: 1 });


print('Database initialization complete!');
print('Created devices collection with indexes');
