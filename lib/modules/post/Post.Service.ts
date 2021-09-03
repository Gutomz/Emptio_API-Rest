import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions } from 'mongoose';
import { PostNotFoundError, PurchaseNotFoundError } from '../../errors/NotFound.Error';
import { formatDate } from "../../utils/date";
import BasePurchaseService from '../base_purchase/BasePurchase.Service';
import { IPost, PostDataType } from './Post.Model';
import PostSchema from './Post.Schema';

class PostService {
  public async create(model: IPost) {
    model.createdAt = model.updatedAt = formatDate(moment());
    return PostSchema.create(model);
  }

  public async findByIdPopulated(post_id: string) {
    const post = await PostSchema.findById(post_id).populate([
      {
        path: "owner",
      },
      {
        path: "data.productMarket",
        populate: [
          {
            path: "product",
          },
          {
            path: "market",
          },
          {
            path: "updatedBy",
            select: "name",
          }
        ],
      },
      {
        path: "data.purchase",
        populate: {
          path: "items",
          populate: "product",
        }
      }
    ]);

    if (!post) throw new PostNotFoundError();

    return post.toObject();
  }

  public async findPopulated(filter: FilterQuery<IPost>, projection?: any, options?: QueryOptions) {
    return PostSchema.find(filter, projection, options).populate([
      {
        path: "owner",
      },
      {
        path: "data.productMarket",
        populate: [
          {
            path: "product",
          },
          {
            path: "market",
          },
          {
            path: "updatedBy",
            select: "name",
          }
        ],
      },
      {
        path: "data.purchase",
        populate: {
          path: "items",
          populate: "product",
        }
      }
    ]);
  }

  public async update(post_id, update) {
    return PostSchema.findByIdAndUpdate(post_id, update, { new: true });
  }

  public async delete(post_id) {
    const post: Document<IPost> = await PostSchema.findById(post_id);

    if (!post) return;

    const data = post.get("data");

    switch (data.type) {
      case PostDataType.PURCHASE:
        await BasePurchaseService.delete(data.purchase);
        break;
      case PostDataType.PRODUCT_MARKET:
      default:
        break;
    }

    return PostSchema.deleteOne({ _id: post_id });
  }

  public async toggleLike(post_id, user_id) {
    const post: Document<IPost> = await PostSchema.findById(post_id);

    const likes: string[] = post.get("likes");
    const dislikes: string[] = post.get("dislikes");

    if (likes.includes(user_id)) {
      return this.update(post_id, { $pull: { likes: user_id } });
    }

    if (dislikes.includes(user_id)) {
      await this.update(post_id, { $pull: { dislikes: user_id } });
    }

    return this.update(post_id, { $push: { likes: user_id } });
  }

  public async toggleDislike(post_id, user_id) {
    const post: Document<IPost> = await PostSchema.findById(post_id);

    const likes: string[] = post.get("likes");
    const dislikes: string[] = post.get("dislikes");

    if (dislikes.includes(user_id)) {
      return this.update(post_id, { $pull: { dislikes: user_id } });
    }

    if (likes.includes(user_id)) {
      await this.update(post_id, { $pull: { likes: user_id } });
    }

    return this.update(post_id, { $push: { dislikes: user_id } });
  }

  public async getDocumentCount(filter?: FilterQuery<IPost>) {
    return PostSchema.countDocuments(filter);
  }

  public async getCount(userId: string) {
    return this.getDocumentCount({ owner: userId });
  }
}

export default new PostService();
