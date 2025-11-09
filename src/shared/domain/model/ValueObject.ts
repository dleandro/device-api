import { DomainValueTypeError } from './errors/DomainValueTypeError';
import { UndefinedDomainValueError } from './errors/UndefinedDomainValueError';

export abstract class ValueObject<T extends string | number | boolean | Date> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
    this.checkValueIsDefined(value);
    this.checkValueType(value);
    this.checkValueIsValid(value);
  }

  private checkValueIsDefined(value: T): void {
    if (value === null || value === undefined) {
      throw new UndefinedDomainValueError('Value must be defined');
    }
  }

  private checkValueType(value: T): void {
    if (!this.isValueTypeCorrect(value)) {
      throw new DomainValueTypeError(
        'Provided value does not match the expected type',
        { context: { value: value as unknown } }
      );
    }
  }

  protected abstract isValueTypeCorrect(_value: T): boolean;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected checkValueIsValid(_value: T): void {
    // to be overriden in subclasses, when needed
  }

  equals(other: ValueObject<T>): boolean {
    return (
      other.constructor.name === this.constructor.name &&
      other.value.toString() === this.value.toString()
    );
  }

  toString(): string {
    return this.value.toString();
  }
}
