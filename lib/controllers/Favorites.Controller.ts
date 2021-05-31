import { Request, Response } from 'express';

import { 
  response_success, 
  response_handleError 
} from '../utils/http_response';

import { UnimplementedError } from '../errors/Unimplemented.Error';
import FavoritesValidator from '../modules/favorites/Favorites.Validator';
import { IFavorites } from '../modules/favorites/Favorites.Model';
import FavoritesService from '../modules/favorites/Favorites.Service';

export class FavoritesController {

  public async create(req: Request, res: Response) {
    try {
      await FavoritesValidator.validate_create(req.body);

      const { user, product_id } = req.body;

      const model: IFavorites = {
        owner: user.id,
        product: product_id,
      };

      const response = await FavoritesService.create(model);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async addMarket(req: Request, res: Response) {
    try {
      await FavoritesValidator.validate_addMarket(req.body, req.params);

      const { id } = req.params;
      const { market_id } = req.body;

      const response = await FavoritesService.addMarket(id, market_id);
      
      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async removeMarket(req: Request, res: Response) {
    try {
      await FavoritesValidator.validate_removeMarket(req.body, req.params);

      const { id, market_id } = req.params;

      const response = await FavoritesService.removeMarket(id, market_id);
      
      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      await FavoritesValidator.validate_delete(req.body, req.params);

      const { id } = req.params;

      const response = await FavoritesService.delete(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async find(req: Request, res: Response) {
    try {
      const { query, body } = req;

      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      const { user } = body;

      const response = await FavoritesService.findPopulated({
        owner: user.id,
      }, null, { limit, skip });

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
