import { StatusCodes } from "http-status-codes";

export const SuccessResponse = ({
  res,
  statusCode = StatusCodes.OK,
  message = "Success",
  data = null,
}) => {
  const responseObject = {
    success: true,
    message,
    data,
  };

  res.status(statusCode ?? StatusCodes.OK).json(responseObject);
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
  res.status(statusCode ?? StatusCodes.OK).json({
    responseObject,
  });
};
