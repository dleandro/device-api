import { Serializable } from '../../types/Serializable';

export class CustomError extends Error {
  public context?: Serializable;

  constructor(
    message: string,
    options: {
      cause?: Error | unknown;
      context?: Serializable;
      name?: string;
    } = {}
  ) {
    const { cause, context, name } = options;

    super(undefined, { cause });
    this.name = name ?? this.constructor.name;
    this.message = message;

    this.context = context;
  }

  toPrimitives(): Serializable {
    return {
      name: this.name,
      message: this.message,
      ...(this.context ? { context: this.context } : {}),
    };
  }
}
