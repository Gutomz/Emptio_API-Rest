export interface INotification {
  _id?: string;
  owner: string;
  title: string;
  body: string;
  viewed?: boolean;
  createdAt?: string;
}