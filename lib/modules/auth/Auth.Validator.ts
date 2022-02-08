
import CommomValidator from "../common/Common.Validator";
import { InvalidFieldError, MissingFieldError } from "../../errors/Field.Error";

class UserValidator {

  validate_login(params): boolean {
    if(!params) {
      throw new MissingFieldError(['email, password'])
    }

    const { email, password } = params;

    CommomValidator.validate_email(email);
    CommomValidator.validate_password(password);

    return true;
  }
}

export default new UserValidator();
