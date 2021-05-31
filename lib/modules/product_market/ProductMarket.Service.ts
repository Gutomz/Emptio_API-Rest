import * as moment from 'moment';
import { FilterQuery, QueryOptions, Document } from "mongoose";
import { formatDate } from "../../utils/date";
import { IProductMarket } from "./ProductMarket.Model";
import ProductMarketSchema from "./ProductMarket.Schema";

class ProductMarketService {
  public async exist(filter: FilterQuery<IProductMarket>) {
    return !!(await ProductMarketSchema.findOne(filter));
  }

  public async update(model: IProductMarket) {
    model.updatedAt = formatDate(moment());

    let productMarket;
    if (await this.exist({ market: model.market, product: model.product })) {
      productMarket = await ProductMarketSchema.findOneAndUpdate({
        market: model.market,
        product: model.product,
        price: { $ne: model.price }
      }, model, { new: true });
    } else {
      productMarket = await ProductMarketSchema.create(model);
    }

    if (productMarket) {
      // TODO - alert users
      console.log('alert users');
    }

    return this.findOne({ product: model.product, market: model.market });
  }

  public async findOne(query?: FilterQuery<IProductMarket>, projection?: any, options?: QueryOptions): Promise<Document<IProductMarket>> {
    return ProductMarketSchema.findOne(query, projection, options).populate('updatedBy', 'name');
  }
}

export default new ProductMarketService();
