import { ERROR_CODE, ERROR_NAME } from "../utils/enums";

export class NotAllowedError extends Error {
  code: string;

  constructor(message_extension){
    const message = `Not Allowed: ${message_extension}`
    super(message);

    this.name = ERROR_NAME.NOT_ALLOWED;
    this.code = ERROR_CODE.NOT_ALLOWED;
  }
}
