import * as firebase from 'firebase-admin';

export class FirebaseConfig {
  static _serviceAccount = require('../../emptio-app-pr-firebase-adminsdk-lwqbt-f6cedabe90.json');

  static init() {
    firebase.initializeApp({
      credential: firebase.credential.cert(this._serviceAccount),
    });

    console.log("Connected to FirebaseServices.");
  }
}
