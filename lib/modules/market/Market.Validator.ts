import { MarketNotFoundError } from '../../errors/NotFound.Error';
import MarketService from '../market/Market.Service';

class PurchaseValidator {
  async validate_market_exist(market_id: string) {
    if (!(await MarketService.exist({ _id: market_id }))) {
      throw new MarketNotFoundError();
    }
  }
}

export default new PurchaseValidator();
