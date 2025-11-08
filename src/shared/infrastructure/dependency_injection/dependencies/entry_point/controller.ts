import path from 'path';
import { ServiceOptions } from 'typedi';

const dependencies: Array<ServiceOptions> = [
  {
    id: 'Controllers',
    value: [path.join(process.cwd(), 'src/controller/*Controller.{ts,js}')],
  },
];

export default dependencies;
