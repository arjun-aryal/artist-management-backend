import { StatusCodes } from "http-status-codes";
import {
  errorResponse,
  hashPassword,
  successResponse,
} from "../utils/index.js";
import {
  createArtist,
  getAllArtists,
} from "../repository/artistsRepository.js";

export const addNewArtists = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    dob,
    gender,
    address,
    first_release_year,
    no_of_albums_released,
  } = req.body;

  const hashedPassword = await hashPassword(password);

  try {
    const artist = await createArtist({
      email,
      hashedPassword,
      phone,
      dob,
      gender,
      address,
      name,
      first_release_year,
      no_of_albums_released,
      created_by: req.userInfo.userId,
    });

    return successResponse({
      res,
      statusCode: StatusCodes.CREATED,
      message: "User Added",
      data: artist,
    });
  } catch (error) {
    console.error(error);
    return errorResponse({
      res,
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      // message: "Failed to create artists",
      message: error,
    });
  }
};

export const listAllArtists = async (req, res) => {
  const query = req.query;
  try {
    const users = await getAllArtists(query);
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
