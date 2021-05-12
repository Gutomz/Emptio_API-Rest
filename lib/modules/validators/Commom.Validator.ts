import * as email_validator from 'email-validator';

import { InvalidFieldError, MissingFieldError } from '../../errors/Field.Error';

class CommomValidator {
  public validate_field(value, field: string): boolean {
    if(!value) {
      throw new MissingFieldError([field]);
    }

    return true;
  }

  public validate_name(name: string): boolean {
    this.validate_field(name, 'name');

    if (!/[^A-Za-z ]*/.test(name)) {
      throw new InvalidFieldError('name');
    }

    return true;
  }

  public validate_email(email: string): boolean {
    this.validate_field(email, 'email');

    if(!email_validator.validate(email)) {
      throw new InvalidFieldError('email');
    }

    return true;
  }

  public validate_password(password: string): boolean {
    this.validate_field(password, 'password');

    return true;
  }
}

export default new CommomValidator();
