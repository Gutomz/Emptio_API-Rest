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

export class PurchaseNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("Purchase not found!");

    this.code = ERROR_CODE.PURCHASE_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}

export class PurchaseItemNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("Purchase Item not found!");

    this.code = ERROR_CODE.PURCHASE_ITEM_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}

export class ProductNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("Product not found!");

    this.code = ERROR_CODE.PRODUCT_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}

export class FavoriteNotFoundError extends Error  implements INotFoundError {
  public code: string;

  constructor() {
    super("Favorite not found!");

    this.code = ERROR_CODE.FAVORITE_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }
}
