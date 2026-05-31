import { StatusCodes } from "http-status-codes";
import {
  deleteFromTable,
  getAllUsers,
  getUserById,
  updateUserTable,
} from "../repository/userRepository.js";
import {
  errorResponse,
  hashPassword,
  successResponse,
} from "../utils/index.js";
import { createuser } from "../repository/auth.js";

export const listAllUsers = async (req, res) => {
  const query = req.query;
  try {
    const users = await getAllUsers(query);
    const pagination = {
      totalPages: users.total,
      page: Number(query.page),
      limit: Number(query.limit),
      totalPages: users.totalPages,
      totalRecords: users.totalRecords,
    };

    return successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "Data retrived",
      data: users.data,
      pagination,
    });
  } catch (error) {
    console.error(error);

    return errorResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to Retrive",
    });
  }
};

export const createUserByAdmin = async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
    role_type,
  } = req.body;

  const hashedPassword = await hashPassword(password);
  try {
    const rows = await createuser({
      first_name,
      last_name,
      email,
      hashedPassword,
      phone,
      dob,
      gender,
      address,
      role_type,
    });
    return successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "User Added",
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return errorResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to Add User",
    });
  }
};

export const updateUser = async (req, res) => {
  const body = req.body;
  const id = req.params.id;

  try {
    const result = await updateUserTable({ ...body, id });
    return successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "User Added",
      data: result,
    });
  } catch (error) {
    console.error(error);
    return errorResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to update User",
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await getUserById(id);

    if (!user) {
      return errorResponse({
        res,
        statusCode: StatusCodes.NOT_FOUND,
        message: "User does not exist",
      });
    }

    const result = await deleteFromTable("users", id);

    return successResponse({
      res,
      statusCode: StatusCodes.OK,
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);

    return errorResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to delete user",
    });
  }
};
