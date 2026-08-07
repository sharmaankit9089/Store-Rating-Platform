import { verifyToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new ApiError(401, "Unauthorized: Invalid or expired token"));
  }

  req.user = decoded;
  next();
};
