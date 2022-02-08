import { ERROR_CODE, ERROR_NAME } from "../utils/enums";

export class UnauthorizedError extends Error {
  code: string;

  constructor(){
    const message = `Unauthorized`
    super(message);

    this.name = ERROR_NAME.UNAUTHORIZED;
    this.code = ERROR_CODE.UNAUTHORIZED;
  }
}
