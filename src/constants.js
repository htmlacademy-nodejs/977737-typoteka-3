'use strict';

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.DEFAULT_COMMAND = `--help`;
module.exports.API_PREFIX = `/api`;
module.exports.USER_ARGV_INDEX = 2;
module.exports.MAX_ID_LENGTH = 6;

module.exports.HttpCode = {
  OK: 200,
  CREATED: 201,
  INTERNAL_SERVER_ERROR: 500,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
};

module.exports.RESPONSE_TEXT = {
  NOT_FOUND: `Not found`,
  BAD_REQ: `Bad request`,
};
