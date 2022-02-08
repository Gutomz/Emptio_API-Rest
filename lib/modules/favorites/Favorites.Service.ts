import * as moment from 'moment';
import { FilterQuery, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";
import { formatDate } from "../../utils/date";
import ProductMarketService from '../product_market/ProductMarket.Service';
import { IFavorites } from "./Favorites.Model";
import FavoritesSchema from "./Favorites.Schema";

class FavoritesService {
  public async exist(query: FilterQuery<IFavorites>): Promise<Boolean> {
    return !!(await FavoritesSchema.findOne(query));
  }

  public async create(model: IFavorites) {
    model.createdAt = model.updatedAt = formatDate(moment());
    const favorite = await FavoritesSchema.create(model);
    return this.findByIdPopulated(favorite.id);
  }

  public async delete(favorite_id: string) {
    return FavoritesSchema.deleteOne({ _id: favorite_id });
  }

  public async addMarket(favorite_id: string, market_id: string) {
    await this.updateById(favorite_id, { $push: { markets: market_id } });

    return this.findByIdPopulated(favorite_id);
  }

  public async removeMarket(favorite_id: string, market_id: string) {
    await this.updateById(favorite_id, { $pull: { markets: market_id } });

    return this.findByIdPopulated(favorite_id);
  }

  public async updateById(favorite_id: string, update: UpdateWithAggregationPipeline | UpdateQuery<IFavorites>, options?: QueryOptions) {
    const _update: UpdateWithAggregationPipeline | UpdateQuery<IFavorites> = {
      ...update,
      updatedAt: formatDate(moment()),
    };

    return FavoritesSchema.updateOne({ _id: favorite_id }, _update, options)
  }

  public async findByIdPopulated(favorite_id: string) {
    const favorite = await FavoritesSchema.findById(favorite_id).populate([
      { path: 'product' },
      { path: 'markets' },
    ]);

    const markets = favorite.get("markets");
    const productId = favorite.get("product")._id;
    const newMarkets = [];
    for (let index in markets) {
      const market = { ...markets[index].toObject() };

      const productMarket = await ProductMarketService
        .findLast({ product: productId, market: market._id });

      market.price = 0;
      if (productMarket != null) {
        market.price = productMarket.get("price");
      }

      newMarkets.push(market);
    }

    return {
      ...favorite.toObject(),
      markets: newMarkets,
    };
  }

  public async findPopulated(filter: FilterQuery<IFavorites>, projection?: any, options?: QueryOptions) {
    return FavoritesSchema.find(filter, projection, options).populate([
      { path: 'product' },
      { path: 'markets' },
    ]);
  }

  public async find(filter: FilterQuery<IFavorites>, projection?: any, options?: QueryOptions) {
    return FavoritesSchema.find(filter, projection, options);
  }

  public async findOne(filter: FilterQuery<IFavorites>, projection?: any, options?: QueryOptions) {
    return FavoritesSchema.findOne(filter, projection, options);
  }
}

export default new FavoritesService();
