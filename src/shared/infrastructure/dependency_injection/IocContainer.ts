import { ServiceOptions } from 'typedi';

type Service<T> = T;
type ServiceId = string;

export default interface IocContainer {
  init(
    defaultDependencies: Array<ServiceOptions>,
    envDependencies: Array<ServiceOptions>
  ): void;
  get<T>(serviceId: ServiceId): Service<T>;
  set(serviceId: ServiceId, service: Service<unknown>): void;
  remove(serviceId: ServiceId): void;
}
