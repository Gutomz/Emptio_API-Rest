import * as moment from 'moment';
import * as bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import {
  response_handleError,
  response_success,
} from '../utils/http_response';
import { IUser } from '../modules/user/User.Model';
import UserService from '../modules/user/User.Service';
import UserValidator from '../modules/user/User.Validator';
import { UniqueFieldError } from '../errors/Field.Error';
import AuthService from '../modules/auth/Auth.Service';
import MailService from '../modules/mail/Mail.Service';
import { formatDate } from '../utils/date';

export class UserController {
  public async register(req: Request, res: Response) {
    try {
      UserValidator.validate_register(req.body);

      const { name, email, password, photo } = req.body;

      const exist = await UserService.exist({ email });
      if (exist) {
        throw new UniqueFieldError('email');
      }

      const dateNow: string = formatDate(moment());

      // TODO - Validate and save profile photo

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user_model: IUser = {
        name,
        email,
        password: encryptedPassword,
        photo,
        createdAt: dateNow,
        updatedAt: dateNow,
      }

      const user = await UserService.create(user_model);

      const auth = await AuthService.generateKeyPairs(user);

      response_success(res, auth);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async forgotPassword(req: Request, res: Response) {
    try {
      await UserValidator.validate_forgot_password(req.body);

      const { email } = req.body;

      const code = await UserService.generateRecoveryCode(email);

      await MailService.forgotPassword({ email, code });

      response_success(res);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async redefinePassword(req: Request, res: Response) {
    try {
      await UserValidator.validate_redefine_password(req.body);

      const { email, code, password } = req.body;

      await UserService.validateRecoveryCode(email, code);

      const encryptedPassword = await bcrypt.hash(password, 10);

      const user = await UserService.redefinePassword(email, encryptedPassword);

      const auth = await AuthService.generateKeyPairs(user);

      response_success(res, auth);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async updateMe(req: Request, res: Response) {
    try {
      UserValidator.validate_update(req.body, bcrypt.compare);

      const { user, name, description, newPassword, photo } = req.body;

      // TODO - Validate and save photo

      const update_data = {
        name: name || user.name,
        description: description || user.description,
        password: newPassword ? await bcrypt.hash(newPassword, 10) : user.password,
        photo: photo || user.photo,
      }

      const newUser = await UserService.updateById(user._id, update_data, { new: true });

      response_success(res, newUser);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getMe(req: Request, res: Response) {
    try {
      const { user } = req.body;

      response_success(res, user);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const { id } = req.params;

      if (user.id === id) {
        return response_success(res, user);
      }

      // TODO - get posts if is friend
      // const isFriend = await FriendshipService.isFriend(user, id);

      const friend = await UserService.findById(id);

      response_success(res, friend);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { query } = req;
      const search: string = query.search ? query.search.toString() : "";
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      const users = await UserService.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }, null, { limit, skip });

      const data = {
        data: users,
        count: users.length,
      };

      response_success(res, data);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
