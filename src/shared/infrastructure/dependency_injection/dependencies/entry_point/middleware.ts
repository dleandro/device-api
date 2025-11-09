import { ServiceOptions } from 'typedi';
import { CustomErrorMiddleware } from '../../../server/express/CustomErrorMiddleware';
import { RequestLoggingMiddleware } from '../../../server/express/RequestLoggingMiddleware';

const dependencies: Array<ServiceOptions> = [
  { id: 'ErrorMiddleware', type: CustomErrorMiddleware },
  { id: 'RequestLoggingMiddleware', type: RequestLoggingMiddleware }
];

export default dependencies;
