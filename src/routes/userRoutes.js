import express from "express";
import { validate } from "../middleware/validation.js";
import { paginationSchema } from "../validators/paginationParams.js";
import {
  createUserByAdmin,
  deleteUser,
  listAllUsers,
  updateUser,
} from "../controller/userController.js";
import checkPermissionMiddleware from "../middleware/checkPermissionMiddleware.js";
import authenticationMiddleware from "../middleware/authentication.js";
import {
  addNewUserSchema,
  updateUserSchema,
} from "../validators/userSchema.js";

const router = express.Router();

router
  .route("/")
  .get(
    authenticationMiddleware,
    validate(paginationSchema),
    checkPermissionMiddleware("super_admin"),
    listAllUsers,
  );
router
  .route("/")
  .post(
    authenticationMiddleware,
    validate(addNewUserSchema),
    checkPermissionMiddleware("super_admin"),
    createUserByAdmin,
  );

router
  .route("/:id")
  .put(
    authenticationMiddleware,
    validate(updateUserSchema),
    checkPermissionMiddleware("super_admin"),
    updateUser,
  );

router
  .route("/:id")
  .delete(
    authenticationMiddleware,
    validate(updateUserSchema),
    checkPermissionMiddleware("super_admin"),
    deleteUser,
  );
export default router;
