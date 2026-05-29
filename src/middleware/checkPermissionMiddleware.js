import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils.js";

export const checkPermissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    const userRole = req.userInfo.role;

    const allowed = Array.isArray(requiredPermission)
      ? requiredPermission.includes(userRole)
      : userRole === requiredPermission;

    if (!allowed) {
      return errorResponse({
        res,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Forbidden: insufficient permissions",
      });
    }

    next();
  };
};
