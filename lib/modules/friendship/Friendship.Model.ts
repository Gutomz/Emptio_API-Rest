import { IUser } from "../user/User.Model";

export interface IFriendship {
  _id?: string;
  owner: string | IUser;
  friend: string | IUser;
  status?: string;
  createdAt: string;
  updatedAt: string;
}
