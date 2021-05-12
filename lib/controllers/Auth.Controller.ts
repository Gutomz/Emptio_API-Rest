import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { UnimplementedError } from '../errors/Unimplemented.Error';
import { response_success, response_handleError } from '../common/http_response';
import AuthValidator from '../modules/validators/Auth.Validator';
import UserService from '../modules/services/User.Service';


export class AuthController {

  // TODO - Implement login controller
  public async login(req: Request, res: Response) {
    try {
      AuthValidator.validate_login(req.body);

      await UserService.validatePassword(req.body, bcrypt.compare);

      response_success(res, { ok: true });
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement logout controller
  public async logout(req: Request, res: Response) {
    try {
      throw new UnimplementedError('Auth.Controller.ts', 'logout()');
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement refresh controller
  public async refresh(req: Request, res: Response) {
    try {
      throw new UnimplementedError('Auth.Controller.ts', 'refresh()');
    } catch (error) {
      response_handleError(res, error)
    }
  }
}
