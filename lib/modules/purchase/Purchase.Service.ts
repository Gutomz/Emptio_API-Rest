import * as moment from 'moment';
import { FilterQuery, QueryOptions, Document, UpdateWithAggregationPipeline, UpdateQuery, Types, Query } from 'mongoose';
import { formatDate } from '../../utils/date';
import { PURCHASE_STATUS } from '../../utils/enums';
import { IProductMarket } from '../product_market/ProductMarket.Model';
import ProductMarketService from '../product_market/ProductMarket.Service';
import { IPurchase, IPurchaseItem } from './Purchase.Model';
import PurchaseSchema, { PurchaseItemSchema } from './Purchase.Schema';

class PurchaseService {

  public async exist(query: FilterQuery<IPurchase>): Promise<Boolean> {
    return !!(await PurchaseSchema.findOne(query));
  }

  public async canEdit(purchase_id: string): Promise<Boolean> {
    return this.exist({ _id: purchase_id, status: PURCHASE_STATUS.OPEN });
  }

  public async existProduct(purchase_id: string, product_id: string): Promise<Boolean> {
    const purchase = await PurchaseSchema.findOne({ _id: purchase_id }).populate('items');
    return !!(purchase.get('items').find(x => x.product == product_id));
  }

  public async existItem(purchase_id: string, item_id: string): Promise<Boolean> {
    const query = { _id: purchase_id, items: Types.ObjectId(item_id) };
    return !!(await PurchaseSchema.findOne(query));
  }

  public async create(model: IPurchase): Promise<Document<IPurchase>> {
    model.createdAt = model.updatedAt = formatDate(moment());
    return PurchaseSchema.create(model);
  }

  public async delete(model_id: string) {
    return PurchaseSchema.deleteOne({ _id: model_id });
  }

  public async updateById(id: string, data: UpdateWithAggregationPipeline | UpdateQuery<IPurchase>, options?: QueryOptions): Promise<Document<IPurchase>> {
    const _data = {
      ...data,
      updatedAt: formatDate(moment())
    };

    return PurchaseSchema.findByIdAndUpdate(id, _data, options);
  }

  public async findOneAndUpdate(filter: FilterQuery<IPurchase>, data: UpdateWithAggregationPipeline | UpdateQuery<IPurchase>, options?: QueryOptions) {
    const _data = {
      ...data,
      updatedAt: formatDate(moment())
    };

    return PurchaseSchema.findOneAndUpdate(filter, _data, options);
  }

  public async findByIdAndUpdate(_id: string, data: UpdateWithAggregationPipeline | UpdateQuery<IPurchase>, options?: QueryOptions) {
    const _data = {
      ...data,
      updatedAt: formatDate(moment())
    };

    return PurchaseSchema.findByIdAndUpdate(_id, _data, options);
  }

  public async updateLimit(purchase_id, limit) {
    return this.updateById(purchase_id, { limit }, { new: true });
  }

  public async findOne(query?: FilterQuery<IPurchase>, projection?: any, options?: QueryOptions): Promise<Document<IPurchase>> {
    return PurchaseSchema.findOne(query, projection, options);
  }

  public async addItem(purchase_id: string, itemModel: IPurchaseItem) {
    const item = await PurchaseItemSchema.create(itemModel);

    return this.updateById(purchase_id, { $push: { items: item._id } }, {
      new: true,
      populate: { path: 'items', populate: { path: 'product' } }
    });
  }

  public async updateItem(purchase_id: string, item_id: string, itemModel: IPurchaseItem) {
    await PurchaseItemSchema.updateOne({ _id: item_id }, itemModel);
    return this.findOneAndUpdate({ _id: purchase_id }, {}, {
      new: true,
      populate: { path: 'items', populate: { path: 'product' } }
    });
  }

  public async deleteItem(purchase_id: string, item_id: string) {
    const query: FilterQuery<IPurchase> = {
      _id: purchase_id,
    };

    const update: UpdateWithAggregationPipeline | UpdateQuery<IPurchase> = {
      $pull: { items: Types.ObjectId(item_id) }
    };

    await PurchaseItemSchema.deleteOne({ _id: item_id });

    return this.findOneAndUpdate(query, update, {
      new: true,
      upsert: true,
      populate: { path: 'items', populate: { path: 'product' } }
    });
  }

  public calculatePurchaseCosts(document: Document<IPurchase>) {
    const items: Document<IPurchaseItem>[] = document.get('items');

    let cost: number = 0;
    let estimatedCost: number = 0;

    items.map((item) => {
      const total: number = item.get('price') * item.get('quantity');
      if (item.get('checked')) cost += total;
      estimatedCost += total;
    });

    return { cost, estimatedCost };
  }

  public async findByIdPopulated(purchase_id: string) {
    const _doc: Document<IPurchase> = await PurchaseSchema
      .findById(purchase_id)
      .populate([
        {
          path: 'items',
          populate: { path: 'product' }
        },
        {
          path: 'market',
        }
      ]);

    return {
      ...this.calculatePurchaseCosts(_doc),
      ..._doc.toObject(),
    };
  }

  public async findPopulated(query: FilterQuery<IPurchase>, projection: any, options: QueryOptions) {
    const _docs: Document<IPurchase>[] = await PurchaseSchema
      .find(query, projection, options)
      .populate([
        {
          path: 'items',
          populate: { path: 'product' }
        },
        {
          path: 'market',
        }
      ]);

    const purchases = _docs.map((purchase) => ({
      ...this.calculatePurchaseCosts(purchase),
      ...purchase.toObject(),
    }));

    return purchases;
  }

  public async findItemById(purchase_id: string, item_id: string) {
    const purchase = await PurchaseSchema.findById(purchase_id);

    const item = await PurchaseItemSchema.findById(item_id).populate('product');
    const market_id = purchase.get('market');
    const product_id = item.get('product')._id;

    const productMarket = await ProductMarketService.findOne({
      product: product_id,
      market: market_id,
    });

    return {
      ...item.toObject(),
      productMarket: productMarket ? productMarket.toObject() : null,
    };
  }

  async connectMarket(purchase_id: string, market_id: string) {
    // TODO - Change market will change items price?
    return this.findByIdAndUpdate(purchase_id, { market: market_id });
  }

  async complete(purchase_id: string, user_id: string) {
    const purchase = await PurchaseSchema.findByIdAndUpdate(purchase_id, {
      status: PURCHASE_STATUS.CLOSED,
      updatedAt: formatDate(moment()),
    }, { new: true }).populate('items');

    const market_id = purchase.get('market');

    if (market_id) {
      const items: Document<IPurchaseItem>[] = purchase.get('items');

      items.forEach((item) => {
        const product = item.get('product');
        const price = item.get('price');

        const productMarket: IProductMarket = {
          updatedBy: user_id,
          market: market_id,
          product,
          price,
        };

        ProductMarketService.update(productMarket);
      });
    }

    purchase.depopulate('items');

    return purchase.toObject();
  }
}

export default new PurchaseService();