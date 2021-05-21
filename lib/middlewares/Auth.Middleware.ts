import { Response, Request, NextFunction } from 'express';
import { VerifyOptions } from 'jsonwebtoken';
import { response_handleError } from '../utils/http_response';
import { UnauthorizedError } from '../errors/Unauthorized.Error';
import AuthService from '../modules/auth/Auth.Service';
import UserService from '../modules/user/User.Service';

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

    const user = await UserService.findById(data.payload.id, '+configurations');

    req.body.user = user;

    next();

  } catch (error) {
    response_handleError(res, error);
    next(false);
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

    const user = await UserService.findById(data.payload.id);

    req.body.user = user;

    next();

  } catch (error) {
    response_handleError(res, error);
    next(false);
  }
}