import { Request, Response } from 'express';
import { FilterQuery } from 'mongoose';
import BasePurchaseService from '../modules/base_purchase/BasePurchase.Service';
import FavoritesService from '../modules/favorites/Favorites.Service';
import { IProduct } from '../modules/product/Product.Model';
import ProductService from '../modules/product/Product.Service';
import ProductValidator from '../modules/product/Product.Validator';
import ProductRecognizerService from '../modules/product_recognizer/ProductRecognizer.Service';
import PurchaseService from '../modules/purchase/Purchase.Service';
import { response_handleError, response_success } from "../utils/http_response";
import { parseSearch } from '../utils/query_parser';

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
      const { query, body } = req;
      const { user } = body;
      const search: string = query.search ? query.search.toString().toLowerCase() : "";
      const purchase_id: string = query.purchase_id ? query.purchase_id.toString() : "";
      const basePurchase_id: string = query.basePurchase_id ? query.basePurchase_id.toString() : "";
      const isFavorite: Boolean = query.isFavorite ? query.isFavorite.toString().includes('true') : false;
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      let market_id = "";
      let excludeList = [];

      if (isFavorite) {
        const favorites = await FavoritesService.find({ owner: user.id });
        for (let index in favorites) {
          const favorite = favorites[index];
          excludeList.push(favorite.get('product'));
        }
      } else if (purchase_id) {
        const purchase = await PurchaseService.findOne({ _id: purchase_id }, null, { populate: "items" });
        if (purchase != null) {
          market_id = purchase.get('market');
          var items = purchase.get('items');
          for (let index in items) {
            excludeList.push(items[index].product);
          }
        }
      } else if (basePurchase_id) {
        const basePurchase = await BasePurchaseService.findOne({ _id: basePurchase_id }, null, { populate: "items" });
        if (basePurchase != null) {
          var items = basePurchase.get('items');
          for (let index in items) {
            excludeList.push(items[index].product);
          }
        }
      }

      const filter: FilterQuery<IProduct> = {
        _id: { $nin: excludeList },
        ...parseSearch(search, ["brand", "name", "variation", "tags"]),
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

  public async recognize(req: Request, res: Response) {
    try {
      const { body } = req;
      ProductValidator.validate_recognize(body);

      const { image, purchase_id } = body;

      const recognizedClass = await ProductRecognizerService.predict(image);

      let market_id = "";
      let excludeList = [];
      if (purchase_id) {
        const purchase = await PurchaseService.findOne({ _id: purchase_id }, null, { populate: "items" });
        if (purchase != null) {
          market_id = purchase.get('market');
          var items = purchase.get('items');
          for (let index in items) {
            excludeList.push(items[index].product);
          }
        }
      }

      const filter: FilterQuery<IProduct> = {
        _id: { $nin: excludeList },
        ...parseSearch(recognizedClass, ["brand", "name", "variation"]),
      };

      let response;
      if (market_id) {
        response = await ProductService.findCorrelated(market_id, filter);
      } else {
        response = await ProductService.find(filter);
      }

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
