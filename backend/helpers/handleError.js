function handleError(statusCode, message) {
  const error = new Error(message);
  error.status = statusCode;
  return error;
}

module.exports = { handleError };
