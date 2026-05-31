import express from "express";
import { validate } from "../middleware/validation.js";
import checkPermissionMiddleware from "../middleware/checkPermissionMiddleware.js";
import authenticationMiddleware from "../middleware/authentication.js";

import {
  addNewArtists,
  listAllArtists,
} from "../controller/artistsController.js";
import { ArtistSchema, updateArtistSchema } from "../validators/userSchema.js";

const router = express.Router();

router
  .route("/")
  .get(
    authenticationMiddleware,
    validate(updateArtistSchema),
    checkPermissionMiddleware("artist_manager"),
    listAllArtists,
  );

// super_admin

router
  .route("/")
  .post(
    authenticationMiddleware,
    validate(ArtistSchema),
    checkPermissionMiddleware("artist_manager"),
    addNewArtists,
  );

// router
//   .route("/:id")
//   .put(
//     authenticationMiddleware,
//     validate(updateUserSchema),
//     checkPermissionMiddleware("artist_manager"),
//     updateUser,
//   );

// router
//   .route("/:id")
//   .delete(
//     authenticationMiddleware,
//     checkPermissionMiddleware("artist_manager"),
//     deleteUser,
//   );
export default router;
