import { MissingFieldError } from '../../errors/Field.Error';
import CommomValidator from './Commom.Validator';

class UserValidator {
  validate_register(params): boolean {
    if(!params) {
      throw new MissingFieldError(['name', 'email', 'password']);
    }

    const { name, email, password } = params;

    CommomValidator.validate_name(name);
    CommomValidator.validate_email(email);
    CommomValidator.validate_password(password);

    return true;
  }
}

export default new UserValidator();
