import * as moment from 'moment';
import { FilterQuery, QueryOptions, Document } from "mongoose";
import { formatDate } from "../../utils/date";
import FavoritesService from '../favorites/Favorites.Service';
import MarketService from '../market/Market.Service';
import { INotification } from '../notification/Notification.Model';
import NotificationService from '../notification/Notification.Service';
import ProductService from '../product/Product.Service';
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
      this.alertUsers(model);
    }

    return this.findOne({ product: model.product, market: model.market });
  }

  public async findOne(query?: FilterQuery<IProductMarket>, projection?: any, options?: QueryOptions): Promise<Document<IProductMarket>> {
    return ProductMarketSchema.findOne(query, projection, options).populate('updatedBy', 'name');
  }

  public async alertUsers(model: IProductMarket) {
    const product = await ProductService.findById(model.product, 'name variation');
    const market = await MarketService.findById(model.market, 'name');

    const users = await FavoritesService.find({
      product: model.product,
      markets: model.market,
    }, '+owner');

    for (let index in users) {
      const user = users[index];

      const notification: INotification = {
        title: `Alerta de Preço`,
        body: `O preço do produto ${product.get('name')} - ${product.get('variation')} 
        está custando R$ ${model.price.toPrecision(2).replace('.', ',')} 
        no mercado ${market.get('name')}`,
        owner: user.id,
      }

      NotificationService.create(notification);
    }
  }
}

export default new ProductMarketService();
