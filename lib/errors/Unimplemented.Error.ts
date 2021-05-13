import { ERROR_CODE, ERROR_NAME } from "../common/enums";

export class UnimplementedError extends Error {
  code: string;
  file: string;
  method: string;

  constructor(file: string, method: string){
    const message = `Uninplemented method: ${method}`
    super(message);

    this.file = file;
    this.method = method;
    this.name = ERROR_NAME.UNIMPLEMENTED;
    this.code = ERROR_CODE.UNIMPLEMENTED;
  }
}
