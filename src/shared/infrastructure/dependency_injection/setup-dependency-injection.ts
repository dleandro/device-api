import 'reflect-metadata';
import Container, { ServiceOptions } from 'typedi';
import IocContainer from './IocContainer';
import ContainerError from './ContainerError';
import defaultDependencies from './dependencies/application-default';

export class DIContainer implements IocContainer {
  private static instance: DIContainer;
  private readonly container = Container;

  constructor(defaultDependencies: Array<ServiceOptions>) {
    this.init(defaultDependencies);
  }

  public static getInstance(
    defaultDependencies?: Array<ServiceOptions>
  ): DIContainer {
    if (!DIContainer.instance) {
      if (!defaultDependencies) {
        throw new ContainerError('Default dependencies are required!');
      }
      DIContainer.instance = new DIContainer(defaultDependencies);
    }
    return DIContainer.instance;
  }

  init(defaultDependencies: Array<ServiceOptions>): IocContainer {
    try {
      this.applyDependencies(defaultDependencies);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new ContainerError('Could not set the dependencies!');
    }

    return this;
  }

  get<T>(serviceId: string): T {
    return this.container.get(serviceId);
  }

  set(serviceId: string, service: unknown): void {
    this.container.set(serviceId, service);
  }

  remove(serviceId: string): void {
    this.container.remove(serviceId);
  }

  private applyDependencies(dependencies: Array<ServiceOptions>) {
    dependencies.forEach((dependency) => {
      Container.set(dependency);
    });
  }
}

export function getContainer() {
  return DIContainer.getInstance(defaultDependencies);
}
