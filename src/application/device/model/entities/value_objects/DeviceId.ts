import { randomUUID } from 'node:crypto';
import { StringValueObject } from '../../../../../shared/domain/model/StringValueObject';

export class DeviceId extends StringValueObject {
  constructor(value?: string) {
    if (value) {
      super(value);
    } else {
      super(randomUUID());
    }
  }
}
