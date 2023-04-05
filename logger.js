export const TYPE_LOG = "log",
  TYPE_WARN = "warn",
  TYPE_ERROR = "error";
function logger(log, type = "log") {
  console[type](log);
}

export default logger;
