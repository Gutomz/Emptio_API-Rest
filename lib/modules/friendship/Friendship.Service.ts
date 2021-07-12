import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions } from 'mongoose';
import { formatDate } from '../../utils/date';
import { IFriendship } from './Friendship.Model';
import FriendshipSchema from './Friendship.Schema';

class FriendshipService {

  public async exist(query: FilterQuery<IFriendship>): Promise<boolean> {
    const friendship = await FriendshipSchema.findOne(query);

    return !!(friendship);
  }

  public async isFriend(user: any, friendId: string): Promise<boolean> {
    const friendship = await FriendshipSchema.findOne({ owner: user.id, friend: friendId });

    return !!(friendship);
  }

  public async create(params: IFriendship): Promise<Document<IFriendship>> {
    return FriendshipSchema.create(params);
  }

  public async find(query?: FilterQuery<IFriendship>, projection?: any, options?: QueryOptions): Promise<Document<IFriendship>[]> {
    return FriendshipSchema.find(query, projection, options);
  }

  public async findOne(query?: FilterQuery<IFriendship>, projection?: any, options?: QueryOptions): Promise<Document<IFriendship>> {
    return FriendshipSchema.findOne(query, projection, options);
  }

  public async updateById(id: string, data: any | IFriendship, options?: QueryOptions): Promise<Document<IFriendship>> {
    const updatedAt = formatDate(moment());
    data.updatedAt = updatedAt;

    return FriendshipSchema.findByIdAndUpdate(id, data, options);
  }

  public async delete(query: FilterQuery<IFriendship>, options?: QueryOptions) {
    return FriendshipSchema.deleteOne(query, options);
  }

  public async getDocumentCount(filter?: FilterQuery<IFriendship>) {
    return FriendshipSchema.countDocuments(filter);
  }

  public async getFollowersCount(id: string) {
    return this.getDocumentCount({ friend: id });
  }

  public async getFollowingCount(id: string) {
    return this.getDocumentCount({ owner: id });
  }
}

export default new FriendshipService();
