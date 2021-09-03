import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions } from "mongoose";
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
    model.createdAt = model.updatedAt = formatDate(moment());

    let productMarket;
    let alertUsers = true;
    if (await this.exist({ market: model.market, product: model.product })) {
      productMarket = await this.findLast({
        market: model.market,
        product: model.product,
      });

      if (productMarket.price !== model.price) {
        productMarket = await ProductMarketSchema.create(model);
      } else {
        alertUsers = false;
      }
    } else {
      productMarket = await ProductMarketSchema.create(model);
    }

    if (alertUsers) {
      this.alertUsers(model);
    }

    return productMarket;
  }

  public async findLast(query?: FilterQuery<IProductMarket>) {
    return this.findOnePopulated(query, null, { sort: { createdAt: -1 } })
  }

  public async findOne(query?: FilterQuery<IProductMarket>, projection?: any, options?: QueryOptions): Promise<Document<IProductMarket>> {
    return ProductMarketSchema.findOne(query, projection, options).populate('updatedBy', 'name');
  }

  public async findOnePopulated(query?: FilterQuery<IProductMarket>, projection?: any, options?: QueryOptions): Promise<Document<IProductMarket>> {
    return ProductMarketSchema.findOne(query, projection, options).populate([
      {
        path: "updatedBy",
        select: "name",
      },
      {
        path: "product",
      },
      {
        path: "market",
      },
    ]);
  }

  public async alertUsers(model: IProductMarket) {
    const product = await ProductService.findById(model.product, 'name variation');
    const market = await MarketService.findById(model.market, 'name');

    const favorites = await FavoritesService.find({
      product: model.product,
      markets: model.market,
    }, '+owner');

    for (let index in favorites) {
      const favorite = favorites[index];

      // TODO - don't notify model.updatedBy user

      const notification: INotification = {
        title: `Alerta de Preço`,
        body: `O preço do produto ${product.get('name')} - ${product.get('variation')} `
          + `está custando R$ ${model.price.toPrecision(2).replace('.', ',')} `
          + `no mercado ${market.get('name')}`,
        owner: favorite.get("owner"),
      }

      NotificationService.create(notification);
    }
  }
}

export default new ProductMarketService();
