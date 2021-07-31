import { MissingFieldError } from '../../errors/Field.Error';
import { UserNotFoundError } from '../../errors/NotFound.Error';
import CommonValidator from '../common/Common.Validator';
import UserService from './User.Service';

class UserValidator {
  validate_register(params: { name, email, password, location, photo?}): boolean {
    if (!params) {
      throw new MissingFieldError(['name', 'email', 'password', 'location']);
    }

    const { name, email, password, location, photo } = params;

    CommonValidator.validate_name(name);
    CommonValidator.validate_email(email);
    CommonValidator.validate_password(password);
    CommonValidator.validate_location(location);

    if (photo) {
      CommonValidator.validate_base64_url(photo, 'photo');
    }

    return true;
  }

  async validate_update({ user, name, description, photo }): Promise<boolean> {
    CommonValidator.validate_name(name);
    CommonValidator.validate_description(description);

    if (photo && user.photo !== photo) {
      CommonValidator.validate_base64_url(photo, 'photo');
    }

    return true;
  }

  async validate_change_password({ user, actualPassword, newPassword }, passwordCompare: Function): Promise<boolean> {
    CommonValidator.validate_password(actualPassword, 'actualPassword');
    CommonValidator.validate_password(newPassword, 'newPassword');

    await UserService.validatePassword(
      { _id: user._id }, actualPassword, passwordCompare, 'actualPassword');

    return true;
  }

  async validate_forgot_password(params: { email }): Promise<boolean> {
    const { email } = params;

    CommonValidator.validate_email(email);

    if (!await UserService.exist({ email })) {
      throw new UserNotFoundError()
    }

    return true;
  }

  async validate_redefine_password(params: { email, password, code }): Promise<boolean> {
    const { email, password, code } = params;

    CommonValidator.validate_email(email);
    CommonValidator.validate_password(password);
    CommonValidator.validate_field(code, 'code');

    if (!await UserService.exist({
      $and: [
        { email },
        { recoveryCode: code },
      ]
    })) {
      throw new UserNotFoundError()
    }

    return true;
  }

  async validate_update_location({ location }): Promise<boolean> {
    CommonValidator.validate_location(location);

    return true;
  }

  async validate_update_pushToken({ pushToken }): Promise<boolean> {
    CommonValidator.validate_field(pushToken, 'pushToken');

    return true;
  }

  async validate_update_canNotify({ canNotify }): Promise<boolean> {
    CommonValidator.validate_field(canNotify, 'canNotify');

    return true;
  }
}

export default new UserValidator();
