import { ServiceOptions } from 'typedi';
import sharedDependencies from './shared/shared';
import entryPointDependencies from './entry_point/entry-point';

const dependencies: Array<ServiceOptions> = [
  ...sharedDependencies,
  ...entryPointDependencies,
];

export default dependencies;
