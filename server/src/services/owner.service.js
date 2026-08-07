import { findStoreByOwnerId } from "../repositories/store.repository.js";
import { getAverageRatingForStore, findRatingsByStore, countRatingsByStore } from "../repositories/rating.repository.js";
import ApiError from "../utils/ApiError.js";

const getOwnerStore = async (ownerId) => {
  const store = await findStoreByOwnerId(ownerId);
  if (!store) {
    throw new ApiError(404, "Owner does not have a store assigned yet.");
  }
  return store;
};

export const getDashboard = async (ownerId) => {
  const store = await getOwnerStore(ownerId);
  
  const [averageRating, totalRatings] = await Promise.all([
    getAverageRatingForStore(store.id),
    countRatingsByStore(store.id),
  ]);

  return {
    store,
    averageRating,
    totalRatings,
  };
};

export const getStoreDetails = async (ownerId) => {
  return await getOwnerStore(ownerId);
};

export const getStoreRatings = async (ownerId, query) => {
  const store = await getOwnerStore(ownerId);
  
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { sortBy = "createdAt", sortOrder = "desc" } = query;
  
  const skip = (page - 1) * limit;
  const take = limit;
  
  let orderBy = {};
  if (sortBy) {
    orderBy = { [sortBy]: sortOrder };
  }

  const [ratings, total] = await Promise.all([
    findRatingsByStore({ storeId: store.id, skip, take, orderBy }),
    countRatingsByStore(store.id),
  ]);
  
  return {
    items: ratings,
    pagination: {
      totalItems: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      limit,
    }
  };
};
