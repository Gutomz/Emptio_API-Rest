import { IMeasurement } from "../common/Common.Models";

export interface IProduct {
  _id?: string;
  brand: string;
  name: string;
  variation: string;
  weight: IMeasurement;
  tags?: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}