const { DATA_ERROR_CODE } = require('../utils/constants');

class DataError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = DATA_ERROR_CODE;
  }
}

module.exports = DataError;
