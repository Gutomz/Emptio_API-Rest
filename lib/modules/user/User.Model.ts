export interface IUserConfigurations {
  canNotify: boolean,
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  photo?: string;
  description?: string;
  configurations?: IUserConfigurations;
  recoveryCode?: string,
  location?: string,
  createdAt: string,
  updatedAt: string,
}
