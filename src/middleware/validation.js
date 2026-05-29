import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/index.js";

export const validatee = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const err = result.error.issues.map((e) => ({
      path: e.path?.[0],
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
