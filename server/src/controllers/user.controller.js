import { getStores, getStoreByIdWithUserRating, submitUserRating, updateUserRating } from "../services/user.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listStores = asyncHandler(async (req, res) => {
  const data = await getStores(req.query, req.user.id);
  res.status(200).json(new ApiResponse(200, data, "Stores fetched successfully"));
});

export const getStore = asyncHandler(async (req, res) => {
  const storeId = parseInt(req.params.id);
  const data = await getStoreByIdWithUserRating(storeId, req.user.id);
  res.status(200).json(new ApiResponse(200, { store: data }, "Store details fetched successfully"));
});

export const submitRating = asyncHandler(async (req, res) => {
  const { storeId, rating } = req.body;
  const newRating = await submitUserRating(req.user.id, storeId, rating);
  res.status(201).json(new ApiResponse(201, { rating: newRating }, "Rating submitted successfully"));
});

export const updateRating = asyncHandler(async (req, res) => {
  const storeId = parseInt(req.params.storeId);
  const { rating } = req.body;
  const updatedRating = await updateUserRating(req.user.id, storeId, rating);
  res.status(200).json(new ApiResponse(200, { rating: updatedRating }, "Rating updated successfully"));
});
