import * as email_validator from 'email-validator';

import { InvalidFieldError, MissingFieldError } from '../../errors/Field.Error';
import { parseLocation } from '../../utils/string';

class CommomValidator {
  public validate_field(value, field: string): boolean {
    if(value === null || value === undefined) {
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

  public validate_password(password: string, fieldName: string = 'password'): boolean {
    this.validate_field(password, fieldName);

    return true;
  }

  public validate_description(description: string): boolean {
    this.validate_field(description, 'description');

    if(description.length > 250) {
      throw new InvalidFieldError('description (máx 250)');
    }

    return true;
  }

  public validate_base64_url(base64url: string, fieldName: string): boolean {
    // TODO - validate base64url
    return true;
  }

  public validate_location(location: string): boolean {
    this.validate_field(location, 'location');

    if(!parseLocation(location)) {
      throw new InvalidFieldError('location');
    }
    
    return true;
  }
}

export default new CommomValidator();
