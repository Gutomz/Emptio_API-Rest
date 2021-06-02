import { ILocation } from "../common/Common.Models";

export interface IUserConfigurations {
  canNotify: boolean;
  pushToken: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  description?: string;
  configurations?: IUserConfigurations;
  recoveryCode?: string;
  location: ILocation;
  createdAt: string;
  updatedAt: string;
}
