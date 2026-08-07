import { getDashboard, getStoreDetails, getStoreRatings } from "../services/owner.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const dashboard = asyncHandler(async (req, res) => {
  const data = await getDashboard(req.user.id);
  res.status(200).json(new ApiResponse(200, data, "Dashboard statistics fetched successfully"));
});

export const getStore = asyncHandler(async (req, res) => {
  const store = await getStoreDetails(req.user.id);
  res.status(200).json(new ApiResponse(200, { store }, "Store details fetched successfully"));
});

export const getRatings = asyncHandler(async (req, res) => {
  const data = await getStoreRatings(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, data, "Store ratings fetched successfully"));
});
