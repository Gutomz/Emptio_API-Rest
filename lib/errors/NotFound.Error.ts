import { ERROR_CODE, ERROR_NAME } from "../utils/enums";

export interface INotFoundError {
  code: string;
}

export class UserNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("User not found!");

    this.code = ERROR_CODE.USER_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}

export class FriendshipNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("Friendship not found!");

    this.code = ERROR_CODE.FRIENDSHIP_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}

export class MarketNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("Market not found!");

    this.code = ERROR_CODE.MARKET_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}
