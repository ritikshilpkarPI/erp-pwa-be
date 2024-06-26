const { GeneralError } = require('../util/errors');

const handleErrors = (err, req, res, next) => {
  console.log({ err });
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
      error: err,
    });
  }

  return res.status(500).json({
    status: 'error',
    message: err.message,
    error: err,
  });
};

module.exports = handleErrors;
