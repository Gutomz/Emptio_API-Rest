import { IMarket } from "../market/Market.Model";
import { IProduct } from "../product/Product.Model";
import { IUser } from "../user/User.Model";

export interface IProductMarket {
  _id?: string;
  product: string | IProduct;
  market: string | IMarket;
  price: number;
  updatedBy: string | IUser;
  updatedAt?: string;
}