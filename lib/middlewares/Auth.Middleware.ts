import { Response, Request, NextFunction } from 'express';
import { VerifyOptions } from 'jsonwebtoken';
import { response_handleError } from '../common/http_response';
import { UnauthorizedError } from '../errors/Unauthorized.Error';
import AuthService from '../modules/services/Auth.Service';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;

    if (!authorization) throw new UnauthorizedError();

    const parts = authorization.split(' ');

    if (parts.length !== 2) throw new UnauthorizedError();

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) throw new UnauthorizedError();

    const options: VerifyOptions = {
      complete: true,
    };

    const data: any = await AuthService.verifyToken(token, options);

    req.body.userId = data.payload.id;

    next();

  } catch (error) {
    response_handleError(res, error)
  }
}

export async function refreshAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;

    if(!refreshToken) throw new UnauthorizedError

    const options: VerifyOptions = {
      complete: true,
    };

    const data: any = await AuthService.verifyToken(refreshToken, options);

    req.body.userId = data.payload.id;

    next();

  } catch (error) {
    response_handleError(res, error)
  }
}