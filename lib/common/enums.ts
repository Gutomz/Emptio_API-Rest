export enum RESPONSE_STATUS_CODE {
  SUCCESS = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500
}

export enum ERROR_NAME {
  FIELD = 'FieldError',
  UNIMPLEMENTED = 'UnimplementedError',
  NOT_FOUND = 'NotFound'
}

export enum ERROR_CODE {
  UNIMPLEMENTED = 'unimplemented_error',
  INTERNAL = 'internal_server_error',
  USER_NOT_FOUND = 'user_not_found',
  INVALID_FIELD = 'invalid_field',
  MISSING_FIELD = 'missing_field',
  UNIQUE_FIELD = 'unique_field'
}
