const log = console.log;

exports.handleDbConnectionError = function (val) {
  log(` DB_CONNECTION_ERROR: ${val.message}`)
};
