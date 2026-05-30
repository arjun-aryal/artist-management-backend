import express from "express";
import { validate } from "../middleware/validation.js";
import { loginSchema, registrationSchema } from "../validators/authSchema.js";
import { loginUser, registerUser } from "../controller/auth.js";

const router = express.Router();

router.route("/register").post(validate(registrationSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);

export default router;
