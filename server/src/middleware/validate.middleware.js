import ApiError from "../utils/ApiError.js";

export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error.name === "ZodError") {
      const errorMessages = error.errors.map((err) => err.message);
      next(new ApiError(400, "Validation Error", errorMessages));
    } else {
      next(error);
    }
  }
};
