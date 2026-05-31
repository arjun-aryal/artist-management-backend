import jwt from "jsonwebtoken";
import { getUserRole } from "../repository/auth.js";
import { StatusCodes } from "http-status-codes";
import { errorResponse } from "../utils/index.js";

const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.split(" ")[1];
};

const decodeToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return {
    userId: Number(decoded.userId),
    first_name: decoded.first_name,
    last_name: decoded.last_name,
  };
};

const attachUserRole = async (req) => {
  const userRole = await getUserRole(req.userInfo.userId);
  req.userInfo.role_type = userRole;
};

const authenticationMiddleware = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return errorResponse({
      res,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Authentication Invalid",
    });
  }

  let userInfo;
  try {
    userInfo = decodeToken(token);
    req.userInfo = userInfo;
    await attachUserRole(req);
    next();
  } catch (error) {
    return errorResponse({
      res,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Authentication Invalid",
    });
  }
};

export default authenticationMiddleware;
