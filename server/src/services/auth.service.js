import {
  findUserByEmail,
  createUser,
  findUserById,
  updateUserPassword,
} from "../repositories/user.repository.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import { generateToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";

export const signupService = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await hashPassword(userData.password);

  const newUser = await createUser({
    ...userData,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginService = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(user.id, user.role);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const changePasswordService = async (userId, oldPassword, newPassword) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await comparePassword(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedNewPassword = await hashPassword(newPassword);
  await updateUserPassword(userId, hashedNewPassword);

  return true;
};
