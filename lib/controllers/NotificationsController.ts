import { Request, Response } from 'express';
import { FilterQuery, QueryOptions } from 'mongoose';
import { INotification } from '../modules/notification/Notification.Model';
import NotificationService from '../modules/notification/Notification.Service';
import { response_handleError, response_success } from '../utils/http_response';


export class NotificationsController {
  public async get(req: Request, res: Response) {
    try {
      const { query, body } = req;
      const { user } = body;

      const limit: number = query.limit ? Number.parseInt(query.limit.toString()) : 10;
      const skip: number = query.skip ? Number.parseInt(query.skip.toString()) : 0;

      const filter: FilterQuery<INotification> = {
        owner: user.id,
      };

      const options: QueryOptions = { limit, skip, sort: { createdAt: -1 }, };

      const data = await NotificationService.findAndMarkAsViewed(filter, null, options);

      response_success(res, data);
    } catch (error) {
      response_handleError(res, error);
    }
  }
}
