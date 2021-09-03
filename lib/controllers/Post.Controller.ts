import { Request, Response } from 'express';
import { FilterQuery, QueryOptions } from 'mongoose';
import BasePurchaseService from '../modules/base_purchase/BasePurchase.Service';
import FriendshipService from '../modules/friendship/Friendship.Service';
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

  public async getFeed(req: Request, res: Response) {
    try {

      const { body, query } = req;

      const { user } = body;

      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      const followingList = await FriendshipService.getFollowingList(user);

      const ownersList = [user.id, ...followingList];
      const filter: FilterQuery<IPost> = {
        owner: { $in: ownersList },
      };

      const options: QueryOptions = { limit, skip, sort: { createdAt: -1 } };

      const response = await PostService.findPopulated(filter, null, options);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getById(req: Request, res: Response) {
    try {
      const { params } = req;

      // const { user } = body;
      const { id } = params;

      // TODO - check if requesting user is friend of owner of post id

      const response = await PostService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getProfile(req: Request, res: Response) {
    try {
      const { body, params, query } = req;

      const { user } = body;
      const { profile_id } = params;

      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      let isFriend = true;
      if (user.id !== profile_id) {
        isFriend = await FriendshipService.isFriend(user.id, profile_id);
      }

      const filter = {
        owner: profile_id,
      };

      const options: QueryOptions = { limit, skip, sort: { createdAt: -1 } };

      const response = isFriend ? await PostService.findPopulated(filter, null, options) : [];

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { params } = req;

      const { id } = params;

      const response = await PostService.delete(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async like(req: Request, res: Response) {
    try {
      const { body, params } = req;

      const { user } = body;
      const { id } = params;

      await PostService.toggleLike(id, user.id);

      const response = await PostService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async dislike(req: Request, res: Response) {
    try {
      const { body, params } = req;

      const { user } = body;
      const { id } = params;

      await PostService.toggleDislike(id, user.id);

      const response = await PostService.findByIdPopulated(id);

      response_success(res, response);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
