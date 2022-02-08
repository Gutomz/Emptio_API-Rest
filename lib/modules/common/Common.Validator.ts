import * as email_validator from 'email-validator';
import { Types } from 'mongoose';
import { InvalidFieldError, MissingFieldError } from '../../errors/Field.Error';
import { MEASUREMENT_TYPE_LIST } from '../../utils/enums';
import { parseLocation } from '../../utils/string';
import { IMeasurement } from './Common.Models';


class CommomValidator {
  public validate_field(value, field: string): boolean {
    if (value === null || value === undefined) {
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

    if (!email_validator.validate(email)) {
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

    if (description.length > 250) {
      throw new InvalidFieldError('description (máx 250)');
    }

    return true;
  }

  public validate_base64_url(field: string, fieldName: string): boolean {
    this.validate_field(field, fieldName);
    const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    return regex.test(field);
  }

  public validate_location(location: string): boolean {
    this.validate_field(location, 'location');

    if (!parseLocation(location)) {
      throw new InvalidFieldError('location');
    }

    return true;
  }

  public validate_measurement(measurement: any, fieldName: string): boolean {
    this.validate_field(measurement, fieldName);

    const parse: IMeasurement = measurement;

    if ((!parse.value && parse.value !== 0) || !parse.unit) {
      throw new InvalidFieldError(fieldName);
    }

    if (parse.value < 0) {
      throw new InvalidFieldError(`${fieldName}.value`);
    }

    if (!MEASUREMENT_TYPE_LIST.find(x => x === parse.unit)) {
      throw new InvalidFieldError(`${fieldName}.unit`);
    }

    return true;
  }

  public validate_string_array(data: any, fieldName: string): boolean {
    this.validate_field(data, fieldName);

    if (!Array.isArray(data)) {
      throw new InvalidFieldError(fieldName);
    }

    if (data.length > 0 && typeof data[0] !== 'string') {
      throw new InvalidFieldError(fieldName);
    }

    return true;
  }

  public validate_number(field: any, fieldName: string): boolean {
    this.validate_field(field, fieldName);
    if (typeof field !== 'number')
      throw new InvalidFieldError(fieldName);

    return true;
  }

  public validate_object_id(field: any, fieldName: string): boolean {
    this.validate_field(field, fieldName);

    try {
      Types.ObjectId(field);
      return true;
    } catch (error) {
      throw new InvalidFieldError(fieldName);
    }
  }

  public validate_boolean(field: any, fieldName: string): boolean {
    this.validate_field(field, fieldName);
    if (typeof field !== 'boolean')
      throw new InvalidFieldError(fieldName);

    return true;
  }
}

export default new CommomValidator();
