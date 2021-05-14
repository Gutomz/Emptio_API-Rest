import { Response } from "express";
import { ERROR_CODE, ERROR_NAME, RESPONSE_STATUS_CODE } from "./enums";

export function response_handleError(res: Response, error: any) {
  switch (error.name) {
    case ERROR_NAME.FIELD:
      response_fieldValidationError(res, error);
      break;
    case ERROR_NAME.DUPLICATED_DOCUMENT:
      response_duplicatedDocumentError(res, error);
      break;
    case ERROR_NAME.UNIMPLEMENTED:
      response_unimplementedError(res, error);
      break;
    case ERROR_NAME.NOT_FOUND:
      response_notFoundError(res, error);
      break;
    case ERROR_NAME.UNAUTHORIZED:
      response_unauthorizedError(res, error);
      break;
    default:
      response_internalServerError(res, error);
      break;
  }
}

export function response_internalServerError(res: Response, error: any) {
  res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    code: ERROR_CODE.INTERNAL,
    message: error.message,
    error,
  });
}

export function response_unimplementedError(res: Response, error: any) {
  res.status(RESPONSE_STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    code: error.code,
    message: error.message,
    file: error.file,
    method: error.method,
  });
}

export function response_unauthorizedError(res: Response, error: any) {
  res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json({
    code: error.code,
    message: error.message,
  });
}

export function response_badRequestError(res: Response, data: any, error: any) {
  res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json({
    ...data,
    code: error.code,
  });
}

export function response_fieldValidationError(res: Response, error: any) {
  response_badRequestError(res, {
    message: error.message,
    fields: error.fields,
  }, error);
}

export function response_duplicatedDocumentError(res: Response, error: any) {
  response_badRequestError(res, {
    message: error.message,
    documentType: error.documentType,
  }, error);
}

export function response_notFoundError(res: Response, error: any) {
  response_badRequestError(res, {
    message: error.message,
  }, error);
}

export function response_success(res: Response, data?: any) {
  res.status(RESPONSE_STATUS_CODE.SUCCESS).json(data);
}