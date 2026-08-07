import * as adminService from "../services/admin.service.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  res.status(200).json(new ApiResponse(200, stats, "Dashboard stats fetched successfully"));
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await adminService.createUser(req.body);
  res.status(201).json(new ApiResponse(201, { user }, "User created successfully"));
});

export const getUsers = asyncHandler(async (req, res) => {
  const usersData = await adminService.getUsers(req.query);
  res.status(200).json(new ApiResponse(200, usersData, "Users fetched successfully"));
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await adminService.getUser(Number(req.params.id));
  res.status(200).json(new ApiResponse(200, { user }, "User details fetched successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUser(Number(req.params.id), req.body);
  res.status(200).json(new ApiResponse(200, { user }, "User updated successfully"));
});

export const deleteUser = asyncHandler(async (req, res) => {
  await adminService.deleteUser(Number(req.params.id));
  res.status(200).json(new ApiResponse(200, null, "User deleted successfully"));
});

export const createStore = asyncHandler(async (req, res) => {
  const store = await adminService.createStore(req.body);
  res.status(201).json(new ApiResponse(201, { store }, "Store created successfully"));
});

export const getStores = asyncHandler(async (req, res) => {
  const storesData = await adminService.getStores(req.query);
  res.status(200).json(new ApiResponse(200, storesData, "Stores fetched successfully"));
});

export const getStore = asyncHandler(async (req, res) => {
  const store = await adminService.getStore(Number(req.params.id));
  res.status(200).json(new ApiResponse(200, { store }, "Store details fetched successfully"));
});

export const updateStore = asyncHandler(async (req, res) => {
  const store = await adminService.updateStore(Number(req.params.id), req.body);
  res.status(200).json(new ApiResponse(200, { store }, "Store updated successfully"));
});

export const deleteStore = asyncHandler(async (req, res) => {
  await adminService.deleteStore(Number(req.params.id));
  res.status(200).json(new ApiResponse(200, null, "Store deleted successfully"));
});
