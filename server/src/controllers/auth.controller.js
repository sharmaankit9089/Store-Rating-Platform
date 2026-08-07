import {
  signupService,
  loginService,
  changePasswordService,
} from "../services/auth.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../utils/cookieOptions.js";

export const signup = asyncHandler(async (req, res) => {
  const user = await signupService(req.body);
  res.status(201).json(new ApiResponse(201, { user }, "Signup successful"));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await loginService(email, password);

  res
    .status(200)
    .cookie("accessToken", token, cookieOptions)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

export const logout = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .json(new ApiResponse(200, null, "Logout successful"));
});

export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  await changePasswordService(userId, oldPassword, newPassword);
  res.status(200).json(new ApiResponse(200, null, "Password changed successfully"));
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "User details fetched"));
});
