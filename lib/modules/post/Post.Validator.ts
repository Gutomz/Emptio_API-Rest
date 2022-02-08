import { InvalidFieldError, MissingFieldError } from "../../errors/Field.Error";
import BasePurchaseValidator from "../base_purchase/BasePurchase.Validator";
import CommonValidator from "../common/Common.Validator";
import MarketValidator from "../market/Market.Validator";
import ProductValidator from "../product/Product.Validator";
import ProductMarketValidator from "../product_market/ProductMarket.Validator";
import PurchaseValidator from "../purchase/Purchase.Validator";
import { PostDataType } from "./Post.Model";

class PostValidator {

  async validate_create(body: any) {
    const { description, data } = body;

    CommonValidator.validate_field(description, "description");
    CommonValidator.validate_field(data, "data");

    const { type, productMarket, purchase, basePurchase, name } = data;

    CommonValidator.validate_field(type, "data.type");

    switch (type) {
      case PostDataType.PRODUCT_MARKET:
        await ProductMarketValidator.validate_exist(productMarket, "data.productMarket");
        break;

      case PostDataType.PURCHASE:
        if (!purchase && !basePurchase) {
          throw new MissingFieldError("purchase or basePurchase");
        }

        if (!name) {
          throw new InvalidFieldError("data.name");
        }

        if (purchase) {
          await PurchaseValidator.validate_exist(purchase, "data.purchase");
        } else {
          await BasePurchaseValidator.validate_exist(basePurchase, "data.basePurchase");
        }
        break;

      default:
        throw new InvalidFieldError("data.type");
    }

    return true;
  }
}

export default new PostValidator();
