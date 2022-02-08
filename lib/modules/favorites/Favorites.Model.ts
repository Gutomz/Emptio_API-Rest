export interface IFavorites {
  _id?: string;
  owner: string;
  product: string;
  markets?: string[];
  createdAt?: string;
  updatedAt?: string;
}