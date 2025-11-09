import { EnumValueObject } from '../../../../../shared/domain/model/EnumValueObject';
import { ValidationDomainError } from '../../../../../shared/domain/model/errors/ValidationDomainError';

const validStates = ['available', 'in-use', 'inactive'];

export class DeviceState extends EnumValueObject {
  checkValueIsValid(value: string | number): void {
    if (typeof value === 'string' && validStates.includes(value)) {
      return;
    }
    throw new ValidationDomainError(`State: ${value} is not valid.`);
  }
}
