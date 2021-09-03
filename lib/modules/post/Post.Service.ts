import * as moment from 'moment';
import { formatDate } from "../../utils/date";
import { IPost } from './Post.Model';
import PostSchema from './Post.Schema';

class PostService {
  public async create(model: IPost) {
    model.createdAt = model.updatedAt = formatDate(moment());
    return PostSchema.create(model);
  }

  public async findByIdPopulated(post_id: string) {
    const post = await PostSchema.findById(post_id).populate([
      {
        path: "data.productMarket",
        populate: ["product", "market"],
      },
      {
        path: "data.purchase",
        populate: {
          path: "items",
          populate: "product",
        }
      }
    ]);

    return post.toObject();
  }
}

export default new PostService();
