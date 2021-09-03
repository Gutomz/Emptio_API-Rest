import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions, UpdateQuery } from 'mongoose';
import { formatDate } from '../../utils/date';
import ProductMarketService from '../product_market/ProductMarket.Service';
import UploadService from '../upload/Upload.Service';
import { IProduct } from "./Product.Model";
import ProductSchema from "./Product.Schema";

class ProductService {
  private formatTags(tags: string[]): string[] {
    if(!tags) return [];
    return tags.map(tag => tag.trim().toLowerCase().replace(/ /g, '-'));
  }

  public productModel(product: any): IProduct {
    const _return: IProduct = {
      brand: product.brand,
      name: product.name,
      variation: product.variation,
      weight: product.weight,
      tags: product.tags,
      image: product.image,
    };

    return _return;
  }

  public async exist(query: FilterQuery<IProduct>): Promise<Boolean> {
    return !!(await ProductSchema.findOne(query));
  }

  async create(product: IProduct): Promise<Document<IProduct>> {
    product.createdAt = product.updatedAt = formatDate(moment());
    product.tags = this.formatTags(product.tags);
    if(product.image) {
      const { link } = await UploadService.uploadProductImage(product.image);
      product.image = link;
    }
    
    return ProductSchema.create(product);
  }

  async find(query: FilterQuery<IProduct>, projection?: any, options?: QueryOptions): Promise<Document<IProduct>[]> {
    return ProductSchema.find(query, projection, options);
  }

  async findCorrelated(market_id: string, query: FilterQuery<IProduct>, projection?: any, options?: QueryOptions): Promise<Document<IProduct>[]> {
    const _docs: Document<IProduct>[] = await ProductSchema.find(query, projection, options);

    const products = [];
    for(let id in _docs) {
      const product = _docs[id];

      const productMarket = await ProductMarketService.findLast({ 
        market: market_id, 
        product: product.id
      });

      products.push({
        ...product.toObject(),
        productMarket,
      });
    }

    return products;
  }

  async updateById(_id: string, data: UpdateQuery<IProduct>, options: QueryOptions): Promise<Document<IProduct>> {
    const _data = {
      ...data,
      updatedAt: formatDate(moment()),
      tags: this.formatTags(data.tags),
    };

    return ProductSchema.findByIdAndUpdate(_id, _data, options);
  }

  async findById(_id: string, projection?: any, options?: QueryOptions): Promise<Document<IProduct>> {
    return ProductSchema.findById(_id, projection, options);
  }
}

export default new ProductService();
