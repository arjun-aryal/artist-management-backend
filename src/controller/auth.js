import {
  createuser,
  emailExist,
  getUserDataByEmail,
} from "../repository/auth.js";
import {
  comparePassword,
  errorResponse,
  generateToken,
  hashPassword,
  successResponse,
} from "../utils/index.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    confirm_password,
    phone,
    dob,
    gender,
    address,
    role,
  } = req.body;

  try {
    const existingUser = await emailExist(email);
    if (existingUser?.length) {
      errorResponse({
        res,
        statusCode: StatusCodes.CONFLICT,
        message: "User Already Exist",
      });
    }

    const passwordMatch = password === confirm_password;

    if (!passwordMatch) {
      return errorResponse({
        res,
        statusCode: StatusCodes.CONFLICT,
        message: "Passwords does not match",
      });
    }
    const hashedPassword = await hashPassword(password);
    const row = await createuser({
      first_name,
      last_name,
      email,
      hashedPassword,
      phone,
      dob,
      gender,
      address,
      role,
    });

    return successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "Registraion complete, Please Login",
    });
  } catch (error) {
    return errorResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to Register",
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const row = await getUserDataByEmail(email);
    if (!row) {
      return errorResponse({
        res,
        statusCode: StatusCodes.NOT_FOUND,
        message: "User not found",
      });
    }
    const { password: hashedPassword, ...user } = row;
    const isMatch = await comparePassword(password, hashedPassword);
    if (!isMatch) {
      return errorResponse({
        res,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Failed to Authenticate. email or password dont match",
      });
    }

    const token = await generateToken(row.id, row.first_name, row.last_name);

    return successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Login Successful",
      data: { token, user },
    });
  } catch (error) {
    console.error(error);
  }
};
