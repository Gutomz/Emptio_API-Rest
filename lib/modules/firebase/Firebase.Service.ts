import * as firebase from 'firebase-admin';

export interface IMessagingPayload {
  notification: {
    title: string,
    body: string,
    badge: string,
  };
  data: {
    priority: string,
  };
}

export default class FirebaseService {
  private static sendToDevicePromise(registrationToken: string, payload: IMessagingPayload) {
    return new Promise((resolve, reject) => {
      firebase.messaging().sendToDevice(registrationToken, payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  static async sendToDevice(registrationToken: string, payload: IMessagingPayload) {
    await this.sendToDevicePromise(registrationToken, payload);
  }

  static createPayload({ title, body, badge = '1', priority = 'normal' }): IMessagingPayload {
    return {
      notification: {
        title,
        body,
        badge,
      },
      data: {
        priority,
      },
    };
  }
}
