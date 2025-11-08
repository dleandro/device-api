import { ServiceOptions } from 'typedi';
import TsLogLoggerFactory from '../../../log/TsLogLoggerFactory';

const dependencies: Array<ServiceOptions> = [
  { id: 'Logger', type: TsLogLoggerFactory },
];

export default dependencies;
