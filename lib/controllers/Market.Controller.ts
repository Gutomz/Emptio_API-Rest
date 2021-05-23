import { Request, Response } from 'express';

import {
  response_handleError, response_success,
} from '../utils/http_response';
import MarketService from '../modules/market/Market.Service';

export class MarketController {
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
