import ApiError from "../utils/ApiError.js";

// eslint-disable-next-line no-unused-vars
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let errors = err.errors || [];

  // Prisma unique constraint error
  if (err.code === "P2002") {
    statusCode = 409;
    message = "Duplicate value, record already exists";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
  });
};
