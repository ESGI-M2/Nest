import { BadRequestException } from '@nestjs/common';

export class FormError extends BadRequestException {
  constructor(
    public readonly errors: Record<string, string[]>,
    message = 'Form validation failed',
  ) {
    super({ message, errors });
  }
}
