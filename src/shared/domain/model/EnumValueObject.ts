import { ValueObject } from './ValueObject';

type EnumType = string | number;

export abstract class EnumValueObject extends ValueObject<EnumType> {
  abstract override checkValueIsValid(value: EnumType): void;

  protected isValueTypeCorrect(value: unknown): boolean {
    return typeof value === 'string' || typeof value === 'number';
  }
}
