import { ServiceOptions } from 'typedi';
import controllerDependencies from './controller';
import serverDependencies from './server';
import middlewareDependencies from './middleware';

const dependencies: Array<ServiceOptions> = [
  ...controllerDependencies,
  ...serverDependencies,
  ...middlewareDependencies,
];

export default dependencies;
