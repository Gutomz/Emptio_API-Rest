import * as moment from 'moment';
import { FilterQuery, QueryOptions, Document } from "mongoose";
import { formatDate } from "../../utils/date";
import { IProductMarket } from "./ProductMarket.Model";
import ProductMarketSchema from "./ProductMarket.Schema";

class ProductMarketService {
  public async update(model: IProductMarket) {
    model.updatedAt = formatDate(moment());
    const productMarket = await ProductMarketSchema.findOneAndUpdate(
      {
        market: model.market,
        product: model.product,
        price: { $ne: model.price }
      }, 
      model, { new: true, upsert: true });

    return productMarket.toObject();
  }

  public async findOne(query?: FilterQuery<IProductMarket>, projection?: any, options?: QueryOptions): Promise<Document<IProductMarket>> {
    return ProductMarketSchema.findOne(query, projection, options).populate('updatedBy', 'name');
  }
}

export default new ProductMarketService();
