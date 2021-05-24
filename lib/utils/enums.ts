export enum RESPONSE_STATUS_CODE {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
}

export enum ERROR_NAME {
  FIELD = 'FieldError',
  UNIMPLEMENTED = 'UnimplementedError',
  NOT_FOUND = 'NotFoundError',
  UNAUTHORIZED = 'UnauthorizedError',
  DUPLICATED_DOCUMENT = 'DuplicatedDocumentError'
}

export enum ERROR_CODE {
  UNIMPLEMENTED = 'unimplemented_error',
  INTERNAL = 'internal_server_error',
  UNAUTHORIZED = 'unauthorized_error',  
  USER_NOT_FOUND = 'user_not_found_error',
  FRIENDSHIP_NOT_FOUND = 'friendship_not_found_error',
  MARKET_NOT_FOUND = 'market_not_found_error',
  INVALID_FIELD = 'invalid_field_error',
  MISSING_FIELD = 'missing_field_error',
  UNIQUE_FIELD = 'unique_field_error',
  DUPLICATED_DOCUMENT = 'duplicated_document_error'
}

export enum FRIENDSHIP_STATUS {
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  PENDING = 'pending',
}

export const FRIENDSHIP_STATUS_LIST = [
  FRIENDSHIP_STATUS.ACCEPTED,
  FRIENDSHIP_STATUS.DECLINED,
  FRIENDSHIP_STATUS.PENDING,
];

export enum MEASUREMENT_TYPE {
  Kg = 'Kg',
  g = 'g',
  L = 'L',
  ml = 'ml',
}

export const MEASUREMENT_TYPE_LIST = [
  MEASUREMENT_TYPE.Kg,
  MEASUREMENT_TYPE.g,
  MEASUREMENT_TYPE.L,
  MEASUREMENT_TYPE.ml,
];
