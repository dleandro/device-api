import * as dotenv from 'dotenv';
import path from 'path';

// Load .env file for tests
dotenv.config({
  path: path.resolve(process.cwd(), `.env`),
});

// Fallback to main .env if .env.test doesn't exist
dotenv.config();
