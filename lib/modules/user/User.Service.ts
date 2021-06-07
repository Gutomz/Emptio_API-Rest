import * as moment from 'moment';
import { FilterQuery, QueryOptions, Document, Query } from 'mongoose';
import { InvalidFieldError } from '../../errors/Field.Error';
import { UserNotFoundError } from '../../errors/NotFound.Error';
import { formatDate } from '../../utils/date';
import { generateRandomCode } from '../../utils/string';
import { IUser } from './User.Model';
import UserSchema from './User.Schema';

class UserService {
  public async exist(query: any): Promise<Boolean> {
    const user = await UserSchema.findOne(query);

    return !!(user);
  }

  public async create(user_params: IUser): Promise<Document<IUser>> {
    return UserSchema.create(user_params);
  }

  public async findByEmail(email: string): Promise<Document<IUser>> {
    const user = await UserSchema.findOne({ email });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  public async findById(_id: string, projection?: any, options?: QueryOptions): Promise<Document<IUser>> {
    const user = await UserSchema.findById(_id, projection, options);

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  public async find(query?: FilterQuery<IUser>, projection?: any, options?: QueryOptions): Promise<Document<IUser>[]> {
    return UserSchema.find(query, projection, options);
  }

  public async findOne(query?: FilterQuery<IUser>, projection?: any, options?: QueryOptions): Promise<Document<IUser>> {
    return UserSchema.findOne(query, projection, options);
  }

  public async validatePassword(query: { email?: string, _id?: string }, password: string, decryption: Function, fieldName: string = 'password'): Promise<boolean> {
    const user: any = await UserSchema.findOne(query).select('password');

    if (!user) {
      throw new UserNotFoundError();
    }

    if (await decryption(password, user.password)) {
      return true;
    }

    throw new InvalidFieldError(fieldName);
  }

  public async updateById(id: string, data: any, options?: QueryOptions): Promise<Document<IUser>> {
    const updatedAt = formatDate(moment());
    data.updatedAt = updatedAt;

    return UserSchema.findByIdAndUpdate(id, data, options);
  }

  public async generateRecoveryCode(email: string, length: Number = 6): Promise<string> {
    const recoveryCode = generateRandomCode(length);

    await UserSchema.updateOne({ email }, { recoveryCode });

    return recoveryCode;
  };

  public async validateRecoveryCode(email: string, recoveryCode: string): Promise<boolean> {
    const user = await UserSchema.findOne({ email, recoveryCode });

    if (!user) {
      throw new UserNotFoundError();
    }

    return true;
  };

  public async redefinePassword(email, password): Promise<Document<IUser>> {
    const query = { email };

    const data = {
      password, 
      recoveryCode: null, 
      updatedAt: formatDate(moment()),
    }

    return UserSchema.findOneAndUpdate(query, data);
  }
}

export default new UserService();
