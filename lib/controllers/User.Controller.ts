import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import {
  response_handleError,
  response_success,
} from '../common/http_response';
import { IUser } from '../modules/models/User.Model';
import UserService from '../modules/services/User.Service';
import UserValidator from '../modules/validators/User.Validator';
import { UniqueFieldError } from '../errors/Field.Error';
import { UnimplementedError } from '../errors/Unimplemented.Error';

export class UserController {
  public async register(req: Request, res: Response) {
    try {
      UserValidator.validate_register(req.body);

      const { name, email, password, photo } = req.body;

      const exist = await UserService.exist({ email });
      if (exist) {
        throw new UniqueFieldError('email');
      }

      const now: moment.Moment = moment();
      const nowFormmated: string = now.toISOString(true);

      // TODO - Validate profile photo
      // TODO - Save profile photo

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user_model: IUser = {
        name,
        email,
        password: encryptedPassword,
        photo,
        createdAt: nowFormmated,
        updatedAt: nowFormmated,
      }

      await UserService.create(user_model);

      // TODO - Generate authentication tokens
      const data = {
        token: '1234',
        refrshToken: '123456',
      };

      response_success(res, data);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  // TODO - Implement forgotPassword controller
  public async forgotPassword(req: Request, res: Response) {
    try {
      throw new UnimplementedError('User.Controller.ts', 'forgotPassword()');
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement redefinePassword controller
  public async redefinePassword(req: Request, res: Response) {
    try {
      throw new UnimplementedError('User.Controller.ts', 'redefinePassword()');
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement updateById controller
  public async updateById(req: Request, res: Response) {
    try {
      throw new UnimplementedError('User.Controller.ts', 'updateById()');
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement getMe controller
  public async getMe(req: Request, res: Response) {
    try {
      throw new UnimplementedError('User.Controller.ts', 'getMe()');
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement getById controller
  public async getById(req: Request, res: Response) {
    try {
      throw new UnimplementedError('User.Controller.ts', 'getById()');
    } catch (error) {
      response_handleError(res, error)
    }
  }

  // TODO - Implement getAll controller
  public async getAll(req: Request, res: Response) {
    try {
      throw new UnimplementedError('User.Controller.ts', 'getAll()');
    } catch (error) {
      response_handleError(res, error)
    }
  }
}
