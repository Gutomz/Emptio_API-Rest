import { Request, Response } from 'express';
import BasePurchaseService from '../modules/base_purchase/BasePurchase.Service';
import { IProduct } from '../modules/product/Product.Model';
import ProductService from '../modules/product/Product.Service';
import ProductValidator from '../modules/product/Product.Validator';
import PurchaseService from '../modules/purchase/Purchase.Service';
import { response_handleError, response_success } from "../utils/http_response";

export class ProductController {

  public async create(req: Request, res: Response) {
    try {
      await ProductValidator.validate_create(req.body);

      const { brand, name, variation, weight, tags } = req.body;

      const product: IProduct = {
        brand,
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
      const search: string = query.search ? query.search.toString().toLowerCase() : "";
      const purchase_id: string = query.purchase_id ? query.purchase_id.toString() : "";
      const basePurchase_id: string = query.purchase_id ? query.purchase_id.toString() : "";
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      let market_id = "";
      let excludeList = [];

      if (purchase_id) {
        const purchase = await PurchaseService.findOne({ _id: purchase_id }, null, { populate: "items" });
        market_id = purchase.get('market');
        var items = purchase.get('items');
        for (let index in items) {
          excludeList.push(items[index].product);
        }
      } else if (basePurchase_id) {
        const basePurchase = await BasePurchaseService.findOne({ _id: basePurchase_id }, null, { populate: "items" });
        var items = basePurchase.get('items');
        for (let index in items) {
          excludeList.push(items[index].product);
        }
      }

      const filter = {
        _id: { $nin: excludeList },
        $or: [
          { brand: { $regex: search, $options: 'ix' }, },
          { name: { $regex: search, $options: 'ix' }, },
          { variation: { $regex: search, $options: 'ix' }, },
          { tags: { $regex: search, $options: 'ix' }, },
        ]
      };

      const options = { limit, skip };

      let response;
      if (market_id) {
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
