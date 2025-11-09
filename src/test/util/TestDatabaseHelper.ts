import getModuleLogger from '../../application/port/log/get-module-logger';
import { MongoDbClient } from '../../shared/infrastructure/db/mongo/MongoDbClient';

const logger = getModuleLogger('TestDatabaseHelper');

export class TestDatabaseHelper {
  private static dbClient: MongoDbClient | null = null;

  static async setupDatabase(): Promise<void> {
    try {
      this.dbClient = MongoDbClient.getInstance();

      await this.dbClient.ensureConnection();
      logger.info('Test database connection established');
    } catch (error) {
      logger.error('Failed to setup test database:', error);
      throw error;
    }
  }

  static async teardownDatabase(): Promise<void> {
    try {
      if (this.dbClient && this.dbClient.isConnectionActive()) {
        await this.dbClient.disconnect();
        logger.info('Test database connection closed');
      }
    } catch (error) {
      logger.error('Failed to teardown test database:', error);
      throw error;
    }
  }

  static async clearDatabase(): Promise<void> {
    try {
      if (this.dbClient && this.dbClient.isConnectionActive()) {
        const connection = this.dbClient.getConnection();
        if (connection && connection.db) {
          await connection.db.dropDatabase();
        }
        logger.info('Test database cleared');
      }
    } catch (error) {
      logger.error('Failed to clear test database:', error);
      throw error;
    }
  }

  static getDbClient(): MongoDbClient | null {
    return this.dbClient;
  }
}
