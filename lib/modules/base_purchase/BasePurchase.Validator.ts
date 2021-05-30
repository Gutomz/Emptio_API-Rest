import { DuplicatedItemError, InvalidFieldError, MissingFieldError } from "../../errors/Field.Error";
import { PurchaseItemNotFoundError, PurchaseNotFoundError } from "../../errors/NotFound.Error";
import { ERROR_NAME } from "../../utils/enums";
import CommonValidator from "../common/Common.Validator";
import ProductValidator from "../product/Product.Validator";
import BasePurchaseService from "./BasePurchase.Service";

class BasePurchaseValidator {

  validate_quantity(quantity: number) {
    CommonValidator.validate_number(quantity, 'quantity');

    if (quantity < 1) {
      throw new InvalidFieldError('quantity (min. 1)');
    }
  }

  async validate_product_id(purchase_id: string, product_id: string) {
    CommonValidator.validate_object_id(product_id, 'product_id');
    await ProductValidator.validate_product_exist(product_id);
    if (await BasePurchaseService.existProduct(purchase_id, product_id)) {
      throw new DuplicatedItemError(`product_id:${product_id}`);
    }
  }

  async validate_product(product: any) {
    try {
      await ProductValidator.validate_create(product);
    } catch (error) {
      if (error.name === ERROR_NAME.FIELD)
        throw new InvalidFieldError(`product: ${error.fields.toString()}`);
      else throw error;
    }
  }

  async validate_base_purchase_exist(owner_id: any, purchase_id: any) {
    CommonValidator.validate_object_id(purchase_id, 'purchase_id');
    if (!(await BasePurchaseService.exist({ _id: purchase_id, owner: owner_id }))) {
      throw new PurchaseNotFoundError();
    }
  }

  async validate_item_exist(purchase_id: string, item_id: string) {
    CommonValidator.validate_object_id(item_id, 'item_id');
    if (!await BasePurchaseService.existItem(purchase_id, item_id)) {
      throw new PurchaseItemNotFoundError();
    }
  }

  async validate_update(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['purchase_id', 'name']);
    }

    const { id } = params;
    const { user, name } = body;

    await this.validate_base_purchase_exist(user.id, id);
    CommonValidator.validate_name(name);

    return true;
  }

  async validate_find_by_id(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError('purchase_id');
    }

    const { id } = params;
    const { user } = body;

    await this.validate_base_purchase_exist(user.id, id);

    return true;
  }

  async validate_delete(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError('purchase_id');
    }

    const { id } = params;
    const { user } = body;

    await this.validate_base_purchase_exist(user.id, id);

    return true;
  }

  async validate_add_item(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(
        ['quantity', 'product_id / product', "purchase_id"]);
    }

    const { id } = params;
    const { user, quantity, price, product_id, product } = body;

    await this.validate_base_purchase_exist(user.id, id);
    this.validate_quantity(quantity);

    if (product_id) {
      await this.validate_product_id(id, product_id);
    } else {
      await this.validate_product(product);
    }

    return true;
  }

  async validate_find_item_by_id(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['purchase_id', 'item_id']);
    }

    const { id, item_id } = params;
    const { user } = body;

    await this.validate_base_purchase_exist(user.id, id);
    await this.validate_item_exist(id, item_id);

    return true;
  }

  async validate_update_item(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['quantity']);
    }

    const { id, item_id } = params;
    const { user, quantity, price, checked } = body;

    await this.validate_base_purchase_exist(user.id, id);
    await this.validate_item_exist(id, item_id);
    this.validate_quantity(quantity);

    return true;
  }

  async validate_delete_item(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['purchase_id', 'item_id']);
    }

    const { id, item_id } = params;
    const { user } = body;

    await this.validate_base_purchase_exist(user.id, id);
    await this.validate_item_exist(id, item_id);

    return true;
  }
}

export default new BasePurchaseValidator();
