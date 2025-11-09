import mongoose from 'mongoose';
import getModuleLogger from '../../../../application/port/log/get-module-logger';
import { Logger } from '../../../model/Logger';
import { DbClient } from '../DbClient';

export interface DatabaseConfig {
  uri: string;
  database: string;
  options?: mongoose.ConnectOptions;
}

export class MongoDbClient implements DbClient {
  private static instance: MongoDbClient;
  private readonly logger: Logger = getModuleLogger('MongoDbClient');
  private isConnected = false;
  private config: DatabaseConfig | null = null;
  private connectionPromise: Promise<void> | null = null;

  public static getInstance(): MongoDbClient {
    if (!MongoDbClient.instance) {
      MongoDbClient.instance = new MongoDbClient();
    }
    return MongoDbClient.instance;
  }

  public setConfig(config: DatabaseConfig): void {
    this.config = config;
  }

  public async ensureConnection(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (!this.config) {
      this.config = getDefaultDatabaseConfig();
      this.logger.info('Using default database configuration');
    }

    this.connectionPromise = this.connect(this.config);
    await this.connectionPromise;
    this.connectionPromise = null;
  }

  public async connect(config: DatabaseConfig): Promise<void> {
    try {
      if (this.isConnected) {
        this.logger.info('Already connected to MongoDB');
        return;
      }

      this.logger.info(`Connecting to MongoDB at ${config.uri}`);

      await mongoose.connect(config.uri, {
        dbName: config.database,
        ...config.options,
      });

      this.isConnected = true;
      this.logger.info(
        `Successfully connected to MongoDB database: ${config.database}`
      );

      // Handle connection events
      mongoose.connection.on('error', (error) => {
        this.logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        this.logger.warn('MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        this.logger.info('MongoDB reconnected');
        this.isConnected = true;
      });
    } catch (error) {
      this.logger.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (!this.isConnected) {
        this.logger.info('Already disconnected from MongoDB');
        return;
      }

      await mongoose.disconnect();
      this.isConnected = false;
      this.logger.info('Disconnected from MongoDB');
    } catch (error) {
      this.logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  public isConnectionActive(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  public getConnection(): mongoose.Connection {
    return mongoose.connection;
  }
}

export const getDefaultDatabaseConfig = (): DatabaseConfig => {
  const mongoHost = process.env.MONGODB_HOST || 'localhost';
  const mongoPort = process.env.MONGODB_PORT || '27017';
  const mongoUsername =
    process.env.MONGODB_USERNAME || process.env.MONGODB_ROOT_USERNAME;
  const mongoPassword =
    process.env.MONGODB_PASSWORD || process.env.MONGODB_ROOT_PASSWORD;
  const dbName = process.env.MONGODB_DATABASE || 'devices_api';

  // Build URI with or without credentials
  let mongoUri: string;

  if (mongoUsername && mongoPassword) {
    mongoUri = `mongodb://${encodeURIComponent(mongoUsername)}:${encodeURIComponent(mongoPassword)}@${mongoHost}:${mongoPort}/${dbName}?authSource=admin`;
  } else if (process.env.MONGODB_URI) {
    mongoUri = process.env.MONGODB_URI;
  } else {
    mongoUri = `mongodb://${mongoHost}:${mongoPort}/${dbName}`;
  }

  return {
    uri: mongoUri,
    database: dbName,
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  };
};
