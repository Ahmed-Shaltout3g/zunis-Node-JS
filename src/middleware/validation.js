import Joi from "joi";
export const validation = (schema) => {
  return (req, res, next) => {
    const requestkeys = ["body", "query", "params", "headers", "file", "files"];
    let vaildationError = [];
    for (const key of requestkeys) {
      if (schema[key]) {
        const vaildationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (vaildationResult?.error?.details) {
          vaildationError.push(vaildationResult.error.details);
        }
      }
    }
    if (vaildationError.length) {
      return res
        .status(400)
        .json({ message: "vaildation error", Errors: vaildationError });
    }
    next();
  };
};
