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
  UNAUTHORIZED = 'UnauthorizedError'
}

export enum ERROR_CODE {
  UNIMPLEMENTED = 'unimplemented_error',
  INTERNAL = 'internal_server_error',
  UNAUTHORIZED = 'unauthorized_error',  
  USER_NOT_FOUND = 'user_not_found_error',
  INVALID_FIELD = 'invalid_field_error',
  MISSING_FIELD = 'missing_field_error',
  UNIQUE_FIELD = 'unique_field_error'
}
