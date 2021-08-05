import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import FavoritesService from '../modules/favorites/Favorites.Service';
import { IMarket } from '../modules/market/Market.Model';
import MarketService from '../modules/market/Market.Service';
import MarketValidator from '../modules/market/Market.Validator';
import {
  response_handleError, response_success
} from '../utils/http_response';


export class MarketController {

  public async find(req: Request, res: Response) {
    try {
      const { query } = req;
      const search: string = query.search ? query.search.toString().toLowerCase() : "";
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;
      const favorite_id: string = query.favorite_id ? query.favorite_id.toString() : "";

      let excludeList = [];
      if (favorite_id) {
        const favorite = await FavoritesService.findOne({ _id: favorite_id });
        excludeList.push(favorite.get('markets'));
      }

      const filter: FilterQuery<IMarket> = {
        _id: { $nin: excludeList },
        $or: [
          { name: { $regex: search, $options: 'ix' } },
          { address: { $regex: search, $options: 'ix' } },
        ],
      };

      const options = { limit, skip };

      const response = await MarketService.find(filter, null, options);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      MarketValidator.validate_market_exist(id);

      const place = await MarketService.findById(id);

      response_success(res, place);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getByPlaceId(req: Request, res: Response) {
    try {
      const { place_id } = req.params;

      const place = await MarketService.getByPlaceId(place_id);

      response_success(res, place);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
