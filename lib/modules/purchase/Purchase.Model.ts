import { IMarket } from "../market/Market.Model";
import { IProduct } from "../product/Product.Model";
import { IUser } from "../user/User.Model";

export interface IPurchaseItem {
  product?: string | IProduct;
  price: number;
  quantity: number;
  checked?: boolean;
}

export interface IPurchase {
  _id?: string;
  owner: string | IUser;
  market?: string | IMarket;
  items?: IPurchaseItem[] | string[];
  cost?: number;
  ematimatedCost?: number;
  limit?: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}