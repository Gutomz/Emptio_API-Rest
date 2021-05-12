import { InvalidFieldError } from '../../errors/Field.Error';
import { UserNotFoundError } from '../../errors/NotFound.Error';
import { IUser } from '../models/User.Model';
import UserSchema from '../schemas/User.Schema';

class UserService {

  public async exist(query: any): Promise<Boolean> {
    const user = await UserSchema.findOne(query);
    console.log(user);
    console.log(!!user);
    return !!(user);
  }

  public async create(user_params: IUser) {
    return UserSchema.create(user_params);
  }

  public async validatePassword({ email, password }, decryption: Function) {
    const user: any = await UserSchema.findOne({ email }).select('password');

    if(!user) {
      throw new UserNotFoundError();
    }

    if(await decryption(password, user.password)){
      return true;
    }

    throw new InvalidFieldError('password');
  }
}

export default new UserService();
