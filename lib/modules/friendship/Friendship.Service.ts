import { FilterQuery, QueryOptions } from 'mongoose';
import { IFriendship } from './Friendship.Model';
import FriendshipSchema from './Friendship.Schema';

class FriendshipService {

  public async exist(query: FilterQuery<IFriendship>): Promise<Boolean> {
    const friendship = await FriendshipSchema.findOne(query);

    return !!(friendship);
  }

  public async isFriend(user: any, friendId: string) {
    const friendship = await FriendshipSchema.findOne({ owner: user.id, friend: friendId });

    return !!(friendship);
  }

  public async create(params: IFriendship) {
    return FriendshipSchema.create(params);
  }

  public async find(query?: FilterQuery<IFriendship>, projection?: any, options?: QueryOptions) {
    return FriendshipSchema.find(query, projection, options);
  }

  public async findOne(query?: FilterQuery<IFriendship>, projection?: any, options?: QueryOptions) {
    return FriendshipSchema.findOne(query, projection, options);
  }

  public async updateById(id: string, data: object | IFriendship, options?: QueryOptions) {
    return FriendshipSchema.findByIdAndUpdate(id, data, options);
  }

  public async delete(query: FilterQuery<IFriendship>, options?: QueryOptions) {
    return FriendshipSchema.deleteOne(query, options);
  }
}

export default new FriendshipService();
