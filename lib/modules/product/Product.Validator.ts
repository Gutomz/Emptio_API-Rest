import { MissingFieldError } from "../../errors/Field.Error";
import CommonValidator from "../common/Common.Validator";

class ProductValidator {

  async validate_create({ name, variation, weight, tags }) {
    CommonValidator.validate_field(name, 'name');
    CommonValidator.validate_field(variation, 'variation');
    CommonValidator.validate_measurement(weight, 'weight');
    tags && CommonValidator.validate_string_array(tags, 'tags');

    return true;
  }

  async validate_update({ tags }) {
    CommonValidator.validate_string_array(tags, 'tags');

    return true;
  }
}

export default new ProductValidator();
