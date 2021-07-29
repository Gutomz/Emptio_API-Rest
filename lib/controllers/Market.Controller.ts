import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import { IMarket } from '../modules/market/Market.Model';
import MarketService from '../modules/market/Market.Service';
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

      const filter: FilterQuery<IMarket> = {
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

  public async getByGoogleId(req: Request, res: Response) {
    try {
      const { google_id } = req.params;

      const place = await MarketService.getByGoogleId(google_id);

      response_success(res, place);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
