import { ILocation } from "../common/Common.Models";

export interface IMarket {
  _id?: string;
  place_id: string;
  name: string;
  address: string;
  location: ILocation;
  openingHours?: string[];
  website?: string;
  phone?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}