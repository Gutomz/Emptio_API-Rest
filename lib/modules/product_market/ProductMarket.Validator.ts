import { ProductMarketNotFoundError } from '../../errors/NotFound.Error';
import CommonValidator from '../common/Common.Validator';
import ProductMarketService from './ProductMarket.Service';

class ProductMarketValidator {
  async validate_exist(id: string, fieldName: string = "productMarket_id") {
    CommonValidator.validate_object_id(id, fieldName);

    if (!(await ProductMarketService.exist({ _id: id }))) {
      throw new ProductMarketNotFoundError();
    }
  }

  async validate_exist_combination(product: string, market: string) {
    if (!(await ProductMarketService.exist({ product, market }))) {
      throw new ProductMarketNotFoundError();
    }
  }
}

export default new ProductMarketValidator();
