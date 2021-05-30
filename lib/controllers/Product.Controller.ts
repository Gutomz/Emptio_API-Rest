import { Request, Response } from 'express';

import { IProduct } from '../modules/product/Product.Model';
import ProductService from '../modules/product/Product.Service';
import ProductValidator from '../modules/product/Product.Validator';
import { response_handleError, response_success } from "../utils/http_response";

export class ProductController {

  public async create(req: Request, res: Response) {
    try {
      await ProductValidator.validate_create(req.body);

      const { name, variation, weight, tags } = req.body;

      const product: IProduct = {
        name,
        variation,
        weight,
        tags,
      };

      const response = await ProductService.create(product);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      await ProductValidator.validate_update(req.body);

      const { id } = req.params;
      const { tags } = req.body;

      const product: any = {
        tags
      };

      const response = await ProductService.updateById(id, product, { new: true });

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async find(req: Request, res: Response) {
    try {
      const { query } = req;
      const search: string = query.search ? query.search.toString() : "";
      const market_id: string = query.market_id ? query.market_id.toString() : "";
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      const filter = {
        $or: [
          { name: { $regex: search, $options: 'ix' }, },
          { variation: { $regex: search, $options: 'ix' }, },
          { tags: search, },
        ],
      };

      const options = { limit, skip };

      let response = []
      if(market_id) {
        response = await ProductService.findCorrelated(market_id, filter, null, options);
      } else {
        response = await ProductService.find(filter, null, options);
      }

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
