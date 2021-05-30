import * as moment from 'moment';
import { FilterQuery, QueryOptions, UpdateQuery, UpdateWithAggregationPipeline, Document, Types } from 'mongoose';
import { formatDate } from "../../utils/date";
import { IBasePurchase, IBasePurchaseItem } from "./BasePurchase.Model";
import BasePurchaseSchema, { BasePurchaseItemSchema } from "./BasePurchase.Schema";

class BasePurchaseService {

  public async exist(query: FilterQuery<IBasePurchase>): Promise<Boolean> {
    return !!(await BasePurchaseSchema.findOne(query));
  }

  async create(model: IBasePurchase) {
    model.createdAt = model.updatedAt = formatDate(moment());
    return BasePurchaseSchema.create(model);
  }

  public async delete(model_id: string) {
    const _doc = await BasePurchaseSchema.findById(model_id);

    const items = _doc.get('items');

    for (var index in items) {
      const id = items[index];
      await this.deleteItem(model_id, id);
    }

    return BasePurchaseSchema.deleteOne({ _id: model_id });
  }

  public async updateById(id: string, data: UpdateWithAggregationPipeline | UpdateQuery<IBasePurchase>, options?: QueryOptions): Promise<Document<IBasePurchase>> {
    const _data = {
      ...data,
      updatedAt: formatDate(moment())
    };

    return BasePurchaseSchema.findByIdAndUpdate(id, _data, options);
  }

  public async findOneAndUpdate(filter: FilterQuery<IBasePurchase>, data: UpdateWithAggregationPipeline | UpdateQuery<IBasePurchase>, options?: QueryOptions) {
    const _data = {
      ...data,
      updatedAt: formatDate(moment())
    };

    return BasePurchaseSchema.findOneAndUpdate(filter, _data, options);
  }

  public async existProduct(purchase_id: string, product_id: string): Promise<Boolean> {
    const purchase = await BasePurchaseSchema.findOne({ _id: purchase_id }).populate('items');
    return !!(purchase.get('items').find(x => x.product == product_id));
  }

  public async existItem(purchase_id: string, item_id: string): Promise<Boolean> {
    const query = { _id: purchase_id, items: Types.ObjectId(item_id) };
    return !!(await BasePurchaseSchema.findOne(query));
  }

  public async addItem(purchase_id: string, itemModel: IBasePurchaseItem) {
    const item = await BasePurchaseItemSchema.create(itemModel);
    return this.updateById(purchase_id, { $push: { items: item._id } });
  }

  public async findByIdPopulated(purchase_id: string) {
    return BasePurchaseSchema.findById(purchase_id).populate([
      { path: 'items', populate: { path: 'product' } },
    ]);
  }

  public async findItemById(item_id: string) {
    return BasePurchaseItemSchema.findById(item_id).populate('product');
  }

  public async updateItem(purchase_id: string, item_id: string, itemModel: IBasePurchaseItem) {
    await BasePurchaseItemSchema.updateOne({ _id: item_id }, itemModel);
    return this.findOneAndUpdate({ _id: purchase_id }, {});
  }

  public async deleteItem(purchase_id: string, item_id: string) {
    const query: FilterQuery<IBasePurchase> = { _id: purchase_id };
    const update: UpdateWithAggregationPipeline | UpdateQuery<IBasePurchase> = {
      $pull: { items: Types.ObjectId(item_id) }
    };

    await BasePurchaseItemSchema.deleteOne({ _id: item_id });

    return this.findOneAndUpdate(query, update, { upsert: true });
  }

  public async findPopulated(query: FilterQuery<IBasePurchase>, projection: any, options: QueryOptions) {
    return BasePurchaseSchema.find(query, projection, options)
      .populate([{ path: 'items', populate: { path: 'product' } }]);
  }
}

export default new BasePurchaseService();