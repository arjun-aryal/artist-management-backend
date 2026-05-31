import express from "express";
import { validate } from "../middleware/validation.js";
import {
  createUserByAdmin,
  deleteUser,
  listAllUsers,
  updateUser,
} from "../controller/userController.js";
import checkPermissionMiddleware from "../middleware/checkPermissionMiddleware.js";
import authenticationMiddleware from "../middleware/authentication.js";
import { UserSchema, updateUserSchema } from "../validators/userSchema.js";

const router = express.Router();

router
  .route("/")
  .get(
    authenticationMiddleware,
    validate(updateUserSchema),
    checkPermissionMiddleware(["super_admin", "artist_manager"]),
    listAllUsers,
  );
router
  .route("/")
  .post(
    authenticationMiddleware,
    validate(UserSchema),
    checkPermissionMiddleware(["super_admin", "artist_manager"]),
    createUserByAdmin,
  );

router
  .route("/:id")
  .put(
    authenticationMiddleware,
    validate(updateUserSchema),
    checkPermissionMiddleware(["super_admin", "artist_manager"]),
    updateUser,
  );

router
  .route("/:id")
  .delete(
    authenticationMiddleware,
    checkPermissionMiddleware(["super_admin", "artist_manager"]),
    deleteUser,
  );
export default router;
