import { ERROR_CODE, ERROR_NAME } from "../utils/enums";

export class UnimplementedError extends Error {
  code: string;
  file: string;
  method: string;

  constructor(file: string, method: string){
    const message = `Unimplemented method: ${method}`
    super(message);

    this.file = file;
    this.method = method;
    this.name = ERROR_NAME.UNIMPLEMENTED;
    this.code = ERROR_CODE.UNIMPLEMENTED;
  }
}
