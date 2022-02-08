import * as moment from 'moment';
import { Document, FilterQuery, QueryOptions } from 'mongoose';
import { formatDate } from "../../utils/date";
import FirebaseService, { IMessagingPayload } from '../firebase/Firebase.Service';
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

      await this.sendToDevice(pushToken, payload);
    }

    return notification;
  }

  async sendToDevice(token, message: IMessagingPayload) {
    try {
      await FirebaseService.sendToDevice(token, message);
    } catch (_) { /* do nothing */ }
  }

  async find(filter: FilterQuery<INotification>, projection: any, options: QueryOptions) {
    return NotificationSchema.find(filter, projection, options);
  }

  async count(filter: FilterQuery<INotification>) {
    return NotificationSchema.countDocuments(filter);
  }

  async findAndMarkAsViewed(filter: FilterQuery<INotification>, projection: any, options: QueryOptions) {
    const notifications = await this.find(filter, projection, options);

    await NotificationSchema.updateMany({ ...filter, viewed: false }, { viewed: true });

    return notifications;
  }
}

export default new NotificationService();
