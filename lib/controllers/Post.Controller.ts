import { Request, Response } from 'express';
import { UnimplementedError } from '../errors/Unimplemented.Error';
import BasePurchaseService from '../modules/base_purchase/BasePurchase.Service';
import { IPost, IPostData, PostDataType } from '../modules/post/Post.Model';
import PostService from '../modules/post/Post.Service';
import PostValidator from '../modules/post/Post.Validator';
import {
  response_handleError, response_success
} from '../utils/http_response';

export class PostController {

  public async create(req: Request, res: Response) {
    try {
      await PostValidator.validate_create(req.body);

      const { user, description, data } = req.body;

      const { type, productMarket, purchase, basePurchase, name } = data;

      const dataModel: IPostData = {
        type: type,
      }

      switch (type) {
        case PostDataType.PRODUCT_MARKET:
          dataModel.productMarket = productMarket;
          break;

        case PostDataType.PURCHASE:
          if (purchase) {
            dataModel.purchase = (await BasePurchaseService.copyFromPurchase(user.id, name, purchase)).id;
          } else {
            dataModel.purchase = (await BasePurchaseService.copy(user.id, name, basePurchase)).id;
          }
          break;
      }

      const model: IPost = {
        owner: user.id,
        description,
        data: dataModel,
      }

      const post = await PostService.create(model);
      const response = await PostService.findByIdPopulated(post.id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  // TODO - Implement get controller
  public async get(req: Request, res: Response) {
    try {
      throw new UnimplementedError('Post.Controller.ts', 'get()');
    } catch (error) {
      response_handleError(res, error);
    }
  }

  // TODO - Implement delete controller
  public async delete(req: Request, res: Response) {
    try {
      throw new UnimplementedError('Post.Controller.ts', 'delete()');
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
