import { Types } from "mongoose";
import { IProduct } from "../product/Product.Model";
import { IUser } from "../user/User.Model";

export interface IBasePurchaseItem {
  _id?: string;
  product?: string | IProduct;
  quantity: number;
}

export interface IBasePurchase {
  _id?: string;
  owner: string | IUser;
  name?: string;
  items?: string[] | IBasePurchaseItem[] | Types.ObjectId[];
  visible?: boolean;
  createdAt?: string;
  updatedAt?: string;
}