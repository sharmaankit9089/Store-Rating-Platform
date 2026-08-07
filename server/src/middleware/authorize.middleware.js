import ApiError from "../utils/ApiError.js";

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return next(new ApiError(401, "Unauthorized: User information missing"));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Forbidden: Requires one of these roles: ${allowedRoles.join(", ")}`)
      );
    }

    next();
  };
};
