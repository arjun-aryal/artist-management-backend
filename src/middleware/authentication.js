import jwt from "jsonwebtoken";
import { getUserRole } from "../repository/users.js";

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
  req.userInfo.role = userRole;
};

const authenticationMiddleware = async (req, resizeBy, next) => {
  const token = extractToken(req);
  if (!token) {
    console.log("Authentication Invalid");
  }
  let userInfo;
  try {
    userInfo = decodeToken(token);
    req.userInfo = userInfo;
    await attachUserRole(req);
  } catch (error) {
    console.log("Authentication Invalid");
  }
  next();
};

export default authenticationMiddleware;
