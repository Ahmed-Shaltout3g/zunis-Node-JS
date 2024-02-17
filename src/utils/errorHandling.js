let stackVar;
const asyncHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      stackVar = err.stack;
      // if (err.code == 11000) {
      //   next(new Error("Email already exist", { cause: 400 }));
      // } else {
      return next(new Error(err.message));
      // }
    });
  };
};

//global response
const globalResponse = (err, req, res, next) => {
  if (err) {
    if (process.env.ENV_MODE == "DEV") {
      res.status(err["cause"] || 500).json({
        message: "Fail Response",
        Error: err.message,
        stack: stackVar,
      });
    }
    res.status(err["cause"] || 500).json({
      message: "Fail Response",
      Error: err.message,
    });
  }
};

export { globalResponse, asyncHandler };
