import {
  countUsers,
  findUsers,
  findUserById,
  findUserByEmail,
  createUser as createUserRepository,
  updateUser as updateUserRepository,
  deleteUser as deleteUserRepository,
} from "../repositories/user.repository.js";
import {
  countStores,
  findStores,
  findStoreById,
  createStore as createStoreRepository,
  updateStore as updateStoreRepository,
  deleteStore as deleteStoreRepository,
} from "../repositories/store.repository.js";
import {
  countRatings,
  getAverageRatingForStore,
} from "../repositories/rating.repository.js";
import { hashPassword } from "../utils/password.js";
import ApiError from "../utils/ApiError.js";

export const getDashboardStats = async () => {
  const [totalUsers, totalStores, totalRatings] = await Promise.all([
    countUsers(),
    countStores(),
    countRatings(),
  ]);

  return { totalUsers, totalStores, totalRatings };
};

export const createUser = async (userData) => {
  const existingUser = await findUserByEmail(userData.email);
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const hashedPassword = await hashPassword(userData.password);
  
  const newUser = await createUserRepository({
    ...userData,
    password: hashedPassword,
  });

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const buildQueryOptions = (query, searchFields) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { sortBy, sortOrder = "asc", search } = query;
  
  const skip = (page - 1) * limit;
  const take = limit;
  
  let where = {};
  
  if (query.role) {
    where.role = query.role;
  }
  
  if (search) {
    where.OR = searchFields.map((field) => ({
      [field]: { contains: search },
    }));
  }

  let orderBy = {};
  if (sortBy) {
    orderBy = { [sortBy]: sortOrder };
  } else {
    orderBy = { createdAt: "desc" };
  }

  return { skip, take, where, orderBy };
};

export const getUsers = async (query) => {
  const options = buildQueryOptions(query, ["name", "email", "address"]);
  const users = await findUsers(options);
  const total = await countUsers();
  
  return {
    items: users,
    pagination: {
      totalItems: total,
      currentPage: Number(query.page) || 1,
      totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      limit: Number(query.limit) || 10,
    }
  };
};

export const getUser = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If user is an owner, fetch their store to match assignment requirement
  let store = null;
  if (user.role === "OWNER") {
    // We can fetch the store that has ownerId = id
    const stores = await findStores({ where: { ownerId: id }, skip: 0, take: 1, orderBy: {} });
    if (stores.length > 0) {
      store = stores[0];
      const avgRating = await getAverageRatingForStore(store.id);
      store.averageRating = avgRating;
    }
  }

  const { password, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, store };
};

export const updateUser = async (id, data) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  const updated = await updateUserRepository(id, data);
  const { password, ...userWithoutPassword } = updated;
  return userWithoutPassword;
};

export const deleteUser = async (id) => {
  const user = await findUserById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  
  await deleteUserRepository(id);
  return true;
};

export const createStore = async (storeData) => {
  const owner = await findUserById(storeData.ownerId);
  
  if (!owner) {
    throw new ApiError(404, "Owner not found");
  }
  
  if (owner.role !== "OWNER") {
    throw new ApiError(400, "Assigned user must have the OWNER role");
  }

  return await createStoreRepository(storeData);
};

export const getStores = async (query) => {
  const options = buildQueryOptions(query, ["name", "email", "address"]);
  const stores = await findStores(options);
  
  // Calculate average rating for each store
  const storesWithRatings = await Promise.all(
    stores.map(async (store) => {
      const averageRating = await getAverageRatingForStore(store.id);
      return { ...store, averageRating };
    })
  );

  const total = await countStores();
  
  return {
    items: storesWithRatings,
    pagination: {
      totalItems: total,
      currentPage: Number(query.page) || 1,
      totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      limit: Number(query.limit) || 10,
    }
  };
};

export const getStore = async (id) => {
  const store = await findStoreById(id);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }
  
  const averageRating = await getAverageRatingForStore(id);
  return { ...store, averageRating };
};

export const updateStore = async (id, data) => {
  const store = await findStoreById(id);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }
  
  return await updateStoreRepository(id, data);
};

export const deleteStore = async (id) => {
  const store = await findStoreById(id);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }
  
  await deleteStoreRepository(id);
  return true;
};
