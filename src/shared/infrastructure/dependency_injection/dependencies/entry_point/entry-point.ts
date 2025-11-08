import { ServiceOptions } from 'typedi';
import controllerDependencies from './controller';
import serverDependencies from './server';

const dependencies: Array<ServiceOptions> = [
  ...controllerDependencies,
  ...serverDependencies,
];

export default dependencies;
