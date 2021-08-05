import { DuplicatedFavoriteError, InvalidFieldError } from "../../errors/Field.Error";
import { FavoriteNotFoundError } from "../../errors/NotFound.Error";
import CommonValidator from "../common/Common.Validator";
import MarketValidator from "../market/Market.Validator";
import ProductValidator from "../product/Product.Validator";
import FavoritesService from "./Favorites.Service";

class FavoritesValidator {

  async validate_product_id(owner_id: string, product_id: string) {
    await ProductValidator.validate_product_exist(product_id);
    if (await FavoritesService.exist({ owner: owner_id, product: product_id })) {
      throw new DuplicatedFavoriteError(`product_id:${product_id}`);
    }
  }

  async validate_market_id(market_id: string, favorite_id: string, add: boolean = false) {
    await MarketValidator.validate_market_exist(market_id);

    const exist = await FavoritesService.exist({ _id: favorite_id, markets: market_id });
    if (add && exist)
      throw new DuplicatedFavoriteError(`market_id:${market_id}`);
    if (!add && !exist)
      throw new InvalidFieldError('market_id');
  }

  async validate_favorite_exist(owner_id: string, favorite_id: string) {
    CommonValidator.validate_object_id(favorite_id, 'favorite_id');

    if (!(await FavoritesService.exist({ owner: owner_id, _id: favorite_id }))) {
      throw new FavoriteNotFoundError();
    }
  }

  async validate_create(body: any) {
    const { user, product_id } = body;

    await this.validate_product_id(user.id, product_id);
  }

  async validate_addMarket(body: any, params: any) {
    const { id } = params;
    const { user, market_id, place_id } = body;

    await this.validate_favorite_exist(user.id, id);
    if(place_id) CommonValidator.validate_field(place_id, 'place_id');
    else await this.validate_market_id(market_id, id, true);
  }

  async validate_removeMarket(body: any, params: any) {
    const { id, market_id } = params;
    const { user } = body;

    await this.validate_favorite_exist(user.id, id);
    await this.validate_market_id(market_id, id);
  }

  async validate_delete(body: any, params: any) {
    const { id } = params;
    const { user } = body;

    await this.validate_favorite_exist(user.id, id);
  }
}

export default new FavoritesValidator();
