import { IBasePurchase } from "../base_purchase/BasePurchase.Model";
import { IProductMarket } from "../product_market/ProductMarket.Model";

export enum PostDataType {
  PRODUCT_MARKET = "product_market",
  PURCHASE = "purchase",
}

export const POST_DATA_TYPE_LIST = [
  PostDataType.PRODUCT_MARKET,
  PostDataType.PURCHASE,
];

export interface IPostData {
  _id?: string;
  type: PostDataType;
  productMarket?: IProductMarket;
  purchase?: IBasePurchase;
}

export interface IPost {
  _id?: string;
  owner: string;
  description: string;
  data: IPostData;
  likes?: string[];
  dislikes?: string[];
  createdAt?: string;
  updatedAt?: string;
}
