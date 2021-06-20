import { Request, Response } from 'express';
import { QueryOptions } from 'mongoose';
import { IProduct } from '../modules/product/Product.Model';
import ProductService from '../modules/product/Product.Service';
import { IPurchase, IPurchaseItem } from '../modules/purchase/Purchase.Model';
import PurchaseService from '../modules/purchase/Purchase.Service';
import PurchaseValidator from '../modules/purchase/Purchase.Validator';
import {
  response_handleError, response_success
} from '../utils/http_response';


export class PurchaseController {

  public async create(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_create(req.body);

      const { user, basePurchase_id } = req.body;

      const model: IPurchase = {
        owner: user.id,
      };

      const purchase = await PurchaseService.create(model, basePurchase_id);

      response_success(res, purchase);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async find(req: Request, res: Response) {
    try {
      const { query, body } = req;

      const status: string = query.status ? query.status.toString() : "";
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;
      const orderBy: string = query.orderBy ? query.orderBy.toString() : "";
      const isDesc: boolean = query.isDesc ? query.isDesc.toString().includes('true') : false;

      const { user } = body;

      const order = isDesc ? -1 : 1;
      const searchQuery: QueryOptions = {
        limit,
        skip,
        sort: orderBy.includes("updatedAt") ? { updatedAt: order } : { createdAt: order },
      };

      const response = await PurchaseService.findPopulated({
        owner: user.id,
        status: { $regex: status, $options: 'ix' },
      }, null, searchQuery);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_find_by_id(req.body, req.params);

      const { id } = req.params;

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_delete(req.body, req.params);

      const { id } = req.params;

      const response = await PurchaseService.delete(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async updateLimit(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_update_limit(req.body, req.params);

      const { id } = req.params;
      const { limit } = req.body;

      await PurchaseService.updateLimit(id, limit);

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async connectMarket(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_connect_market(req.body, req.params);

      const { id } = req.params;
      const { market_id } = req.body;

      await PurchaseService.connectMarket(id, market_id || null);

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async addItem(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_add_item(req.body, req.params);

      const { id } = req.params;
      const { quantity, price, product_id, product } = req.body;

      let productToAdd_id = product_id;

      if (!productToAdd_id) {
        const _product: IProduct = ProductService.productModel(product);
        const _new = await ProductService.create(_product);
        productToAdd_id = _new.id;
      }

      const item: IPurchaseItem = {
        product: productToAdd_id,
        price,
        quantity,
      };

      await PurchaseService.addItem(id, item);

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async findItemById(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_find_item_by_id(req.body, req.params);

      const { id, item_id } = req.params;

      const response = await PurchaseService.findItemById(id, item_id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async updateItem(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_update_item(req.body, req.params);

      const { id, item_id } = req.params;
      const { quantity, price, checked } = req.body;

      const item: IPurchaseItem = {
        price,
        quantity,
        checked,
      };

      await PurchaseService.updateItem(id, item_id, item);

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async deleteItem(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_delete_item(req.body, req.params);

      const { id, item_id } = req.params;

      await PurchaseService.deleteItem(id, item_id);

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async complete(req: Request, res: Response) {
    try {
      await PurchaseValidator.validate_complete(req.body, req.params);

      const { id } = req.params;
      const { user } = req.body;

      await PurchaseService.complete(id, user.id);

      const response = await PurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
