import { MissingFieldError } from "../../errors/Field.Error";
import { ProductNotFoundError } from "../../errors/NotFound.Error";
import CommonValidator from "../common/Common.Validator";
import ProductService from "./Product.Service";

class ProductValidator {

  async validate_product_exist(id: string) {
    CommonValidator.validate_object_id(id, 'product_id');

    if (!(await ProductService.exist({ _id: id }))) {
      throw new ProductNotFoundError();
    }
  }

  async validate_create({ name, variation, weight, tags }) {
    CommonValidator.validate_field(name, 'name');
    variation && CommonValidator.validate_field(variation, 'variation');
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
