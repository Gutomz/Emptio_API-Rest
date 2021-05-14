import { ERROR_CODE, ERROR_NAME } from "../utils/enums";

export class DuplicatedDocumentError extends Error {
  documentType: string;
  code: string;

  constructor(documentType: string){
    const message = `Document already exist: ${documentType}`;
    super(message);

    this.name = ERROR_NAME.DUPLICATED_DOCUMENT;
    this.code = ERROR_CODE.DUPLICATED_DOCUMENT;
    this.documentType = documentType;
  }
}
