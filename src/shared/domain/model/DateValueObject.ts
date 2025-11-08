import { InvalidDateValueError } from './errors/InvalidDateValueError';
import { ValueObject } from './ValueObject';

function getDateFromUnknown(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  return value?.toString ? new Date(Date.parse(value.toString())) : new Date();
}

function isInvalidDate(value: Date) {
  return isNaN(value.getTime());
}

export class DateValueObject extends ValueObject<Date> {
  constructor(value?: unknown) {
    const date = getDateFromUnknown(value);
    if (isInvalidDate(date)) {
      throw new InvalidDateValueError();
    }
    super(date);
  }
  override toString(): string {
    return this.value.toISOString();
  }

  protected isValueTypeCorrect(value: unknown): boolean {
    return value instanceof Date;
  }
}
