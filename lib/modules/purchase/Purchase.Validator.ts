import { DuplicatedItemError, InvalidFieldError, MissingFieldError } from '../../errors/Field.Error';
import { NotAllowedError } from '../../errors/NotAllowed';
import { PurchaseItemNotFoundError, PurchaseNotFoundError, UserNotFoundError } from '../../errors/NotFound.Error';
import { ERROR_NAME } from '../../utils/enums';
import CommonValidator from '../common/Common.Validator';
import MarketValidator from '../market/Market.Validator';
import ProductValidator from '../product/Product.Validator';
import PurchaseService from './Purchase.Service';

class PurchaseValidator {
  validate_limit(limit: number) {
    CommonValidator.validate_field(limit, 'limit');
    CommonValidator.validate_number(limit, 'limit');

    if (limit < 0) {
      throw new InvalidFieldError('limit');
    }
  }

  validate_quantity(quantity: number) {
    CommonValidator.validate_field(quantity, 'quantity');
    CommonValidator.validate_number(quantity, 'quantity');

    if (quantity < 1) {
      throw new InvalidFieldError('quantity (min. 1)');
    }
  }

  validate_price(price: number) {
    CommonValidator.validate_number(price, 'price');

    if (price < 0) {
      throw new InvalidFieldError('price');
    }
  }

  validate_checked(checked: boolean) {
    CommonValidator.validate_boolean(checked, 'checked');
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

  async validate_product_id(purchase_id: string, product_id: string) {
    CommonValidator.validate_object_id(product_id, 'product_id');
    await ProductValidator.validate_product_exist(product_id);
    if (await PurchaseService.existProduct(purchase_id, product_id)) {
      throw new DuplicatedItemError(`product_id:${product_id}`);
    }
  }

  async validate_market_id(market_id: string) {
    CommonValidator.validate_object_id(market_id, 'market_id');
    await MarketValidator.validate_market_exist(market_id);
  }

  async validate_purchase_exist(owner_id: string, purchase_id: string) {
    CommonValidator.validate_object_id(purchase_id, 'purchase_id');
    if (!(await PurchaseService.exist({ _id: purchase_id, owner: owner_id }))) {
      throw new PurchaseNotFoundError();
    }
  }

  async validate_item_exist(purchase_id: string, item_id: string) {
    CommonValidator.validate_object_id(item_id, 'item_id');
    if (!await PurchaseService.existItem(purchase_id, item_id)) {
      throw new PurchaseItemNotFoundError();
    }
  }

  async validate_can_edit(purchase_id: string) {
    if(!(await PurchaseService.canEdit(purchase_id))){
      throw new NotAllowedError('Purchase is closed');
    }
  }

  async validate_delete(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError('purchase_id');
    }

    const { id } = params;
    const { user } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);

    return true;
  }

  async validate_update_limit(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError('limit');
    }

    const { id } = params;
    const { user, limit } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);

    this.validate_limit(limit);

    return true;
  }

  async validate_connect_market(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['purchase_id', 'market_id']);
    }

    const { id } = params;
    const { user, market_id } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);
    await this.validate_market_id(market_id);

    return true;
  }

  async validate_add_item(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(
        ['price', 'quantity', 'product_id / product', "purchase_id"]);
    }

    const { id } = params;
    const { user, quantity, price, product_id, product } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);
    this.validate_quantity(quantity);
    this.validate_price(price);

    if (product_id) {
      await this.validate_product_id(id, product_id);
    } else {
      await this.validate_product(product);
    }

    return true;
  }

  async validate_find_item_by_id(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['purchase_id', 'item:id']);
    }

    const { id, item_id } = params;
    const { user } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_item_exist(id, item_id);

    return true;
  }

  async validate_update_item(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['price', 'quantity']);
    }

    const { id, item_id } = params;
    const { user, quantity, price, checked } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);
    await this.validate_item_exist(id, item_id);
    this.validate_quantity(quantity);
    this.validate_price(price);
    this.validate_checked(checked);

    return true;
  }

  async validate_delete_item(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError(['price', 'quantity']);
    }

    const { id, item_id } = params;
    const { user } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);
    await this.validate_item_exist(id, item_id);

    return true;
  }

  async validate_find_by_id(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError('purchase_id');
    }

    const { id } = params;
    const { user } = body;

    await this.validate_purchase_exist(user.id, id);

    return true;
  }

  async validate_complete(body: any, params: any): Promise<boolean> {
    if (!body || !params) {
      throw new MissingFieldError('purchase_id');
    }

    const { id } = params;
    const { user } = body;

    await this.validate_purchase_exist(user.id, id);
    await this.validate_can_edit(id);

    return true;
  }
}

export default new PurchaseValidator();
