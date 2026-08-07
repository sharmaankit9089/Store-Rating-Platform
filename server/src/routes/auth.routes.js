import express from "express";
import {
  signup,
  login,
  logout,
  changePassword,
  me,
} from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  signupSchema,
  loginSchema,
  changePasswordSchema,
} from "../validators/auth.validation.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

// Protected routes
router.post("/logout", authMiddleware, logout);
router.put(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword
);
router.get("/me", authMiddleware, me);

export default router;
