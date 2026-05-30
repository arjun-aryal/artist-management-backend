import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const successResponse = ({
  res,
  statusCode = StatusCodes.OK,
  message = "Success",
  data = null,
  pagination = null,
}) => {
  const responseObject = {
    success: true,
    message,
    data,
  };
  if (pagination) {
    responseObject.pagination = pagination;
  }

  return res.status(statusCode ?? StatusCodes.OK).json(responseObject);
};

export const errorResponse = ({
  res,
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
  message = "Error",
  errors = null,
}) => {
  const responseObject = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(responseObject);
};

export const hashPassword = async (password) => {
  const hashedPassword = bcrypt.hash(password, 10);
  return hashedPassword;
};
export const comparePassword = async (enteredPassword, encryptedPassword) => {
  const isMatch = bcrypt.compare(enteredPassword, encryptedPassword);
  return isMatch;
};

export const generateToken = (userId, first_name, last_name) => {
  return jwt.sign({ userId, first_name, last_name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};
