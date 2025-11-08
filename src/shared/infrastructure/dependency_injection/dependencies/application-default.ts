import { ServiceOptions } from 'typedi';
import sharedDependencies from './shared/shared';
import entryPointDependencies from './entry_point/entry-point';
import deviceDependencies from './device/device';

const dependencies: Array<ServiceOptions> = [
  ...sharedDependencies,
  ...deviceDependencies,
  ...entryPointDependencies,
];

export default dependencies;
