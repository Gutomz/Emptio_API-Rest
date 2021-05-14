import { MissingFieldError } from '../../errors/Field.Error';
import { UserNotFoundError } from '../../errors/NotFound.Error';
import UserService from './User.Service';
import CommomValidator from '../common/Common.Validator';

class UserValidator {
  validate_register(params: { name, email, password, photo? }): boolean {
    if (!params) {
      throw new MissingFieldError(['name', 'email', 'password']);
    }

    const { name, email, password } = params;

    CommomValidator.validate_name(name);
    CommomValidator.validate_email(email);
    CommomValidator.validate_password(password);

    return true;
  }

  async validate_update(params: { user, name, description, actualPassword, newPassword }, passwordCompare: Function): Promise<boolean> {
    const { user, name, description, actualPassword, newPassword } = params;

    if (name) {
      CommomValidator.validate_name(name);
    }

    if (description) {
      CommomValidator.validate_description(description);
    }

    if (newPassword) {
      CommomValidator.validate_password(actualPassword, 'actualPassword');

      await UserService.validatePassword({ id: user._id }, actualPassword, passwordCompare, 'actualPassword');
    }

    return true;
  }

  async validate_forgot_password(params: { email }): Promise<boolean> {
    const { email } = params;

    CommomValidator.validate_email(email);

    if(!await UserService.exist({ email })) {
      throw new UserNotFoundError()
    }

    return true;
  }

  async validate_redefine_password(params: { email, password, code }): Promise<boolean> {
    const { email, password, code } = params;

    CommomValidator.validate_email(email);
    CommomValidator.validate_password(password);
    CommomValidator.validate_field(code, 'code');

    if(!await UserService.exist({ $and: [
      { email },
      { recoveryCode: code },
    ] })) {
      throw new UserNotFoundError()
    }

    return true;
  }
}

export default new UserValidator();
