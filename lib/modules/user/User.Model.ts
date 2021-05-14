export interface IUserConfigurations {
  canNotify: boolean,
}

export const UserConfigurations = {
  canNotify: {
    type: Boolean,
    default: true,
  },
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
  createdAt: string,
  updatedAt: string,
}
