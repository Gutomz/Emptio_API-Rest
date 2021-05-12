import { ERROR_CODE, ERROR_NAME } from "../common/enums";

export interface NotFoundError {
  code: string;
}

export class UserNotFoundError extends Error  implements NotFoundError {
  public code: string;

  constructor() {
    super("User not found!");

    this.code = ERROR_CODE.USER_NOT_FOUND;
    this.name = ERROR_NAME.NOT_FOUND;
  }

}