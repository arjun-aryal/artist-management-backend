import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/index.js";

export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!result.success) {
    const err = result.error.issues.map((e) => ({
      path: e.path.length > 1 ? e.path.slice(1).join(".") : e.path?.[0],
      message: e.message,
    }));

    return errorResponse({
      res,
      statusCode: StatusCodes.BAD_REQUEST,
      message: "Validation error",
      errors: err,
    });
  }

  next();
};
