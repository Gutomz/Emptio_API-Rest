import * as firebase from 'firebase-admin';

export class FirebaseConfig {
  static _serviceAccount = require('../../emptio-309403-firebase-adminsdk-6broq-6bef71f098.json');

  static init() {
    firebase.initializeApp({
      credential: firebase.credential.cert(this._serviceAccount),
    });
  }
}
