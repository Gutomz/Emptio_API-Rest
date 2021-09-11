import { Request, Response } from 'express';
import { QueryOptions } from 'mongoose';
import { IBasePurchase, IBasePurchaseItem } from '../modules/base_purchase/BasePurchase.Model';
import BasePurchaseService from '../modules/base_purchase/BasePurchase.Service';
import BasePurchaseValidator from '../modules/base_purchase/BasePurchase.Validator';
import { IProduct } from '../modules/product/Product.Model';
import ProductService from '../modules/product/Product.Service';
import { response_handleError, response_success } from '../utils/http_response';

export class BasePurchaseController {

  public async create(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const model: IBasePurchase = {
        owner: user.id,
      };

      const response = await BasePurchaseService.create(model);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async copy(req: Request, res: Response) {
    try {
      const { user, purchaseId, basePurchaseId, name } = req.body;

      let purchase;
      if (purchaseId) {
        purchase = await BasePurchaseService.copyFromPurchase(user.id, name, purchaseId, true);
      } else {
        purchase = await BasePurchaseService.copy(user.id, name, basePurchaseId, true);
      }

      const response = await BasePurchaseService.findByIdPopulated(purchase.id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async update(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_update(req.body, req.params);

      const { id } = req.params;
      const { name } = req.body;

      await BasePurchaseService.findOneAndUpdate({ _id: id }, { name });

      const response = await BasePurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async find(req: Request, res: Response) {
    try {
      const { query, body } = req;

      const search: string = query.search ? query.search.toString() : "";
      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;
      const orderBy: string = query.orderBy ? query.orderBy.toString() : "";
      const isDesc: boolean = query.isDesc ? query.isDesc.toString().includes('true') : false;

      const { user } = body;

      const order = isDesc ? -1 : 1;
      const options: QueryOptions = {
        limit,
        skip,
        sort: orderBy.includes("updatedAt") ? { updatedAt: order } : { createdAt: order },
      };

      const response = await BasePurchaseService.findPopulated({
        owner: user.id,
        name: { $regex: search, $options: 'ix' },
        visible: true,
      }, null, options);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async findById(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_find_by_id(req.body, req.params);

      const { id } = req.params;

      const response = await BasePurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_delete(req.body, req.params);

      const { id } = req.params;

      const response = await BasePurchaseService.delete(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async addItem(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_add_item(req.body, req.params);

      const { id } = req.params;
      const { quantity, product_id, product } = req.body;

      let productToAdd_id = product_id;

      if (!productToAdd_id) {
        const _product: IProduct = ProductService.productModel(product);
        const _new = await ProductService.create(_product);
        productToAdd_id = _new.id;
      }

      const item: IBasePurchaseItem = {
        product: productToAdd_id,
        quantity,
      };

      await BasePurchaseService.addItem(id, item);

      const response = await BasePurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async findItemById(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_find_item_by_id(req.body, req.params);

      const { item_id } = req.params;

      const response = await BasePurchaseService.findItemById(item_id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async updateItem(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_update_item(req.body, req.params);

      const { id, item_id } = req.params;
      const { quantity } = req.body;

      const item: IBasePurchaseItem = {
        quantity,
      };

      await BasePurchaseService.updateItem(id, item_id, item);

      const response = await BasePurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async deleteItem(req: Request, res: Response) {
    try {
      await BasePurchaseValidator.validate_delete_item(req.body, req.params);

      const { id, item_id } = req.params;

      await BasePurchaseService.deleteItem(id, item_id);

      const response = await BasePurchaseService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
