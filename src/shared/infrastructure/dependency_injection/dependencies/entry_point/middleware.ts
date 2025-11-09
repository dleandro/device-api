import { ServiceOptions } from 'typedi';
import { CustomErrorMiddleware } from '../../../server/express/CustomErrorMiddleware';

const dependencies: Array<ServiceOptions> = [
  { id: 'ErrorMiddleware', type: CustomErrorMiddleware },
];

export default dependencies;
