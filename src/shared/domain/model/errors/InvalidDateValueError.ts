import { ValidationDomainError } from './ValidationDomainError';

export class InvalidDateValueError extends ValidationDomainError {
  constructor() {
    super('Invalid date value');
  }
}
