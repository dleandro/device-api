import { ServiceOptions } from 'typedi';
import { ExpressServer } from '../../../server/express/ExpressServer';

const dependencies: Array<ServiceOptions> = [
  { id: 'Server', type: ExpressServer },
];

export default dependencies;
