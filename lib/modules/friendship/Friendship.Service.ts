import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions } from 'mongoose';
import { formatDate } from '../../utils/date';
import { FRIENDSHIP_STATUS } from '../../utils/enums';
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

  public async getFollowers(userId: string) {
    const followingList = await this.getFollowing(userId);

    const friendships = await FriendshipSchema.find({ friend: userId, status: FRIENDSHIP_STATUS.ACCEPTED }).populate([
      {
        path: 'owner',
        select: ['name', 'email', 'photo'],
      }
    ]);

    const followers = [];
    for (var index in friendships) {
      const friendship = friendships[index];
      const owner = friendship.get('owner');
      const followBackFriendship = await this.findOne({ owner: userId, friend: owner.id });
      followers.push({
        _id: friendship.id,
        user: owner,
        isFollowing: !!(followingList.find((followingObj) => followingObj.user.id == owner.id)),
        followingStatus: followBackFriendship ? followBackFriendship.get('status') : FRIENDSHIP_STATUS.NONE,
        followingRequestId: followBackFriendship ? followBackFriendship.id : null,
      });
    }

    return followers;
  }

  public async getFollowing(userId: string) {
    const friendships = await FriendshipSchema.find({ owner: userId, status: FRIENDSHIP_STATUS.ACCEPTED }).populate([
      {
        path: 'friend',
        select: ['name', 'email', 'photo'],
      }
    ]);

    const followingList = friendships.map((friendship) => ({
      _id: friendship.id,
      user: friendship.get('friend'),
      isFollowing: true,
      followingStatus: friendship.get('status'),
    }));

    return followingList;
  }

  public async getRequests(userId: string) {
    const friendships = await FriendshipSchema.find({ friend: userId, status: FRIENDSHIP_STATUS.PENDING })
      .populate([
        {
          path: 'owner',
          select: ['name', 'email', 'photo'],
        }
      ]);

    const requests = friendships.map((friendship) => ({
      _id: friendship.id,
      user: friendship.get('owner'),
      status: friendship.get('status'),
      createdAt: friendship.get('createdAt'),
      updatedAt: friendship.get('updatedAt'),
    }));

    return requests;
  }

  public async getRequestsCount(id: string) {
    return this.getDocumentCount({ friend: id, status: FRIENDSHIP_STATUS.PENDING });
  }

  public async getFollowersCount(id: string) {
    return this.getDocumentCount({ friend: id, status: FRIENDSHIP_STATUS.ACCEPTED });
  }

  public async getFollowingCount(id: string) {
    return this.getDocumentCount({ owner: id, status: FRIENDSHIP_STATUS.ACCEPTED });
  }
}

export default new FriendshipService();
