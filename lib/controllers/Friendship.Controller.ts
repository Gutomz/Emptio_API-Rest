import { Request, Response } from 'express';
import * as moment from 'moment';
import { FilterQuery } from 'mongoose';
import { FriendshipNotFoundError } from '../errors/NotFound.Error';
import { IFriendship } from '../modules/friendship/Friendship.Model';
import FriendshipService from '../modules/friendship/Friendship.Service';
import FriendshipValidator from '../modules/friendship/Friendship.Validator';
import { formatDate } from '../utils/date';
import { FRIENDSHIP_STATUS } from '../utils/enums';
import { response_handleError, response_success } from '../utils/http_response';


export class FriendshipController {

  public async request(req: Request, res: Response) {
    try {
      await FriendshipValidator.validate_request(req.body);

      const { friendId, user } = req.body;

      const dateNow: string = formatDate(moment());

      const friendship = await FriendshipService.create({
        owner: user.id,
        friend: friendId,
        createdAt: dateNow,
        updatedAt: dateNow,
      });

      response_success(res, friendship);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async updateRequest(req: Request, res: Response) {
    try {
      await FriendshipValidator.validate_update_request(req.body, req.params);

      const { accept } = req.body;
      const { id } = req.params;

      if (accept) {
        await FriendshipService.updateById(id, { status: FRIENDSHIP_STATUS.ACCEPTED });
      } else {
        await FriendshipService.delete({ _id: id });
      }

      response_success(res, { ok: true });
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async getRequests(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const requests = await FriendshipService.getRequests(user.id);

      response_success(res, requests);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async get(req: Request, res: Response) {
    try {
      const { query, body } = req;
      const { user } = body;

      const userId: string = query.userId ? query.userId.toString() : user.id;
      const followers: boolean = query.followers ? query.followers.toString().includes('true') : false;

      let data;
      if (followers) data = await FriendshipService.getFollowers(userId);
      else data = await FriendshipService.getFollowing(userId);

      response_success(res, data);
    } catch (error) {
      response_handleError(res, error);
    }
  }

  public async delete(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const { id } = req.params;

      const data = await FriendshipService.delete({
        $and: [
          { _id: id, },
          {
            $or: [
              { owner: user.id },
              { friend: user.id },
            ],
          }
        ],
      });

      if (data.ok !== 1 || !data.deletedCount) {
        throw new FriendshipNotFoundError();
      }

      response_success(res, data);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
