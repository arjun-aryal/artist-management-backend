import express from "express";
import { validatee } from "../middleware/validation.js";
import { loginSchema, registrationSchema } from "../validators/authSchema.js";
import { loginUser, registerUser } from "../controller/auth.js";

const router = express.Router();

router.route("/register").post(validatee(registrationSchema), registerUser);
router.route("/login").post(validatee(loginSchema), loginUser);

export default router;
