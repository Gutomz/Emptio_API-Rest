import * as moment from 'moment';
import { FilterQuery, QueryOptions, Document } from 'mongoose';
import { formatDate } from "../../utils/date";
import FirebaseService from '../firebase/Firebase.Service';
import { IUserConfigurations } from '../user/User.Model';
import UserService from "../user/User.Service";
import { INotification } from "./Notification.Model";
import NotificationSchema from './Notification.Schema';

class NotificationService {
  async create(model: INotification) {
    model.createdAt = formatDate(moment());
    const notification = await NotificationSchema.create(model);

    const user = await UserService.findById(model.owner, 'configurations');
    const configurations: Document<IUserConfigurations> = user.get('configurations');
    const pushToken = configurations.get('pushToken');

    if (pushToken) {
      const badge = await this.count({ owner: user.id, viewed: false });

      const payload = FirebaseService.createPayload({
        title: model.title,
        body: model.body,
        badge: badge.toString(),
      });

      try {
        await FirebaseService.sendToDevice(pushToken, payload);
      } catch (_) { /* do nothing */ }
    }

    return notification;
  }

  async find(filter: FilterQuery<INotification>, projection: any, options: QueryOptions) {
    return NotificationSchema.find(filter, projection, options);
  }

  async count(filter: FilterQuery<INotification>) {
    return NotificationSchema.count(filter);
  }
}

export default new NotificationService();