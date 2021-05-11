export interface IUserConfigurations {
  canNotify: Boolean,
  createdAt: String,
  updatedAt: String,
}

export const UserConfigurations = {
  canNotify: Boolean,
  createdAt: String,
  updatedAt: String,
}

export interface IUser {
  _id?: String;
  name: String;
  email: String;
  password: String;
  configurations: IUserConfigurations;
  createdAt: String,
  updatedAt: String,
}
