import { ERROR_CODE, ERROR_NAME } from "../utils/enums";

export interface IFieldError {
  code: string;
  fields: Array<string>;
}

export class InvalidFieldError extends Error  implements IFieldError {
  public fields: Array<string>;
  public code: string;

  constructor(fields: Array<string> | string) {
    let message = "Invalid fields: ";
    message = message.concat(Array.isArray(fields) 
      ? fields.join(', ') 
      : fields);

    super(message);

    this.fields = Array.isArray(fields) ? fields : [fields];
    this.code = ERROR_CODE.INVALID_FIELD;
    this.name = ERROR_NAME.FIELD;
  }

}

export class MissingFieldError extends Error {
  public fields: Array<string>;
  public code: string;

  constructor(fields: Array<string> | string) {
    let message = "Missing fields: ";
    message = message.concat(Array.isArray(fields) 
      ? fields.join(', ') 
      : fields);

    super(message);

    this.fields = Array.isArray(fields) ? fields : [fields];
    this.code = ERROR_CODE.MISSING_FIELD;
    this.name = ERROR_NAME.FIELD;
  }
}

export class UniqueFieldError extends Error  implements IFieldError  {
  public fields: Array<string>;
  public code: string;

  constructor(fields: Array<string> | string) {
    let message = "Unique fields: ";
    message = message.concat(Array.isArray(fields) 
      ? fields.join(', ') 
      : fields);

    super(message);

    this.fields = Array.isArray(fields) ? fields : [fields];
    this.code = ERROR_CODE.UNIQUE_FIELD;
    this.name = ERROR_NAME.FIELD;
  }
}

export class DuplicatedItemError extends Error implements IFieldError {
  public fields: Array<string>;
  public code: string;

  constructor(fields: Array<string> | string){
    let message = "Duplicated product item: ";
    message = message.concat(Array.isArray(fields) 
      ? fields.join(', ') 
      : fields);

    super(message);

    this.fields = Array.isArray(fields) ? fields : [fields];
    this.code = ERROR_CODE.DUPLICATED_ITEM;
    this.name = ERROR_NAME.FIELD;
  }
}
