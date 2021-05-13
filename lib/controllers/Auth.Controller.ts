import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { response_success, response_handleError } from '../common/http_response';
import AuthValidator from '../modules/validators/Auth.Validator';
import UserService from '../modules/services/User.Service';
import AuthService from '../modules/services/Auth.Service';

export class AuthController {

  public async login(req: Request, res: Response) {
    try {
      AuthValidator.validate_login(req.body);

      const { email } = req.body;

      const user = await UserService.findByEmail(email);

      await UserService.validatePassword(req.body, bcrypt.compare);

      const data = await AuthService.generateKeyPairs(user);
      response_success(res, data);
    } catch (error) {
      response_handleError(res, error)
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      await UserService.findById(userId);

      response_success(res);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async refresh(req: Request, res: Response) {
    try {
      const { userId } = req.body;

      const user = await UserService.findById(userId);

      const data = await AuthService.generateKeyPairs(user);
      response_success(res, data);
    } catch (error) {
      response_handleError(res, error)
    }
  }
}
