import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { formatDate } from '../../utils/date';
import { IProduct } from "./Product.Model";
import ProductSchema from "./Product.Schema";

class ProductService {
  private formatTags(tags: string[]): string[] {
    if(!tags) return [];
    return tags.map(tag => tag.toLowerCase().replace(/ /g, '-'));
  }

  async create(product: IProduct): Promise<Document<IProduct>> {
    product.createdAt = product.updatedAt = formatDate(moment());
    product.tags = this.formatTags(product.tags);
    return ProductSchema.create(product);
  }

  async find(query: FilterQuery<IProduct>, projection?: any, options?: QueryOptions): Promise<Document<IProduct>[]> {
    return ProductSchema.find(query, projection, options);
  }

  async updateById(_id: string, data: UpdateQuery<IProduct>, options: QueryOptions): Promise<Document<IProduct>> {
    const _data = {
      ...data,
      updatedAt: formatDate(moment()),
      tags: this.formatTags(data.tags),
    };

    return ProductSchema.findByIdAndUpdate(_id, _data, options);
  }
}

export default new ProductService();
