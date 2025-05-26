import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { EmailAlreadyTakenError, InvalidCredentialsError } from 'src/auth/auth.error';
import { ConversationNotFoundError } from 'src/conversation/conversation.error';
import { UserNotFoundError } from 'src/users/user.error';

@Catch(Error)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let payload: any = {
      errors: { _global: ['Une erreur est survenue.'] },
    };

    if (exception instanceof EmailAlreadyTakenError) {
      status = HttpStatus.UNAUTHORIZED;
      payload = {
        errors: { email: ["Cette adresse e-mail n'est pas disponible."] },
      };
    } else if (exception instanceof InvalidCredentialsError) {
      status = HttpStatus.UNAUTHORIZED;
      payload = {
        message:
          'Identifiants invalides. Veuillez vérifier votre e-mail et votre mot de passe.',
      };
    } else if (exception instanceof ConversationNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      payload = {
        message: `La conversation n'a pas été trouvée.`,
      };
    } else if (exception instanceof UserNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      payload = {
        message: `L'utilisateur n'a pas été trouvé.`,
      };
    } else if (exception instanceof HttpException) {
      const httpEx = exception;
      status = httpEx.getStatus();
      payload = httpEx.getResponse();
    }

    res.status(status).json(payload);
  }
}
