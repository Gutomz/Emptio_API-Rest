import { MarketNotFoundError } from '../../errors/NotFound.Error';
import CommonValidator from '../common/Common.Validator';
import MarketService from '../market/Market.Service';

class PurchaseValidator {
  async validate_market_exist(market_id: string, fieldName: string = 'market_id') {
    CommonValidator.validate_object_id(market_id, fieldName);
    if (!(await MarketService.exist({ _id: market_id }))) {
      throw new MarketNotFoundError();
    }
  }
}

export default new PurchaseValidator();
