import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { response_success, response_handleError } from '../utils/http_response';
import AuthValidator from '../modules/auth/Auth.Validator';
import UserService from '../modules/user/User.Service';
import AuthService from '../modules/auth/Auth.Service';

export class AuthController {

  public async login(req: Request, res: Response) {
    try {
      AuthValidator.validate_login(req.body);

      const { email, password } = req.body;

      const user = await UserService.findByEmail(email);

      await UserService.validatePassword({ email }, password, bcrypt.compare);

      const data = await AuthService.generateKeyPairs(user);
      response_success(res, data);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async logout(req: Request, res: Response) {
    try {
      const { user } = req.body;

      await UserService.updateById(user.id, { 'configurations.pushToken': "" });

      response_success(res, { ok: true });
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
      response_handleError(res, error);
    }
  }
}
