import { findStores, countStores, findStoreById } from "../repositories/store.repository.js";
import { getAverageRatingForStore, findRatingByUserAndStore, createRating, updateRating } from "../repositories/rating.repository.js";
import ApiError from "../utils/ApiError.js";

const buildQueryOptions = (query, searchFields) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const { sortBy, sortOrder = "asc", search } = query;
  
  const skip = (page - 1) * limit;
  const take = limit;
  
  let where = {};
  if (search) {
    where = {
      OR: searchFields.map((field) => ({
        [field]: { contains: search },
      })),
    };
  }

  // Handle sorting
  let orderBy = {};
  // Note: Prisma does not support sorting by a computed aggregate (averageRating) out of the box in simple findMany queries.
  // To strictly satisfy the assignment, if they try to sort by averageRating, we will sort it in-memory post-fetch.
  if (sortBy && sortBy !== "averageRating") {
    orderBy = { [sortBy]: sortOrder };
  } else if (!sortBy) {
    orderBy = { createdAt: "desc" };
  }

  return { skip, take, where, orderBy, sortBy, sortOrder };
};

export const getStores = async (query, userId) => {
  const { skip, take, where, orderBy, sortBy, sortOrder } = buildQueryOptions(query, ["name", "address"]);
  
  // If sorting by averageRating, we must fetch all matching records, calculate, sort in memory, and then paginate manually.
  // This is a trade-off due to Prisma's ORM limitations with calculated aggregate sorting.
  // For standard fields (name, address), we push pagination to the DB.
  
  let stores;
  let total;

  if (sortBy === "averageRating") {
    const allMatchingStores = await findStores({ where, orderBy: {} });
    total = allMatchingStores.length;
    
    const storesWithRatings = await Promise.all(
      allMatchingStores.map(async (store) => {
        const [averageRating, myRating] = await Promise.all([
          getAverageRatingForStore(store.id),
          findRatingByUserAndStore(userId, store.id),
        ]);
        return { ...store, averageRating, myRating: myRating?.rating || null };
      })
    );

    // Sort in memory
    storesWithRatings.sort((a, b) => {
      if (sortOrder === "desc") return b.averageRating - a.averageRating;
      return a.averageRating - b.averageRating;
    });

    // Paginate manually
    stores = storesWithRatings.slice(skip, skip + take);
  } else {
    stores = await findStores({ skip, take, where, orderBy });
    total = await countStores({ where });

    stores = await Promise.all(
      stores.map(async (store) => {
        const [averageRating, myRating] = await Promise.all([
          getAverageRatingForStore(store.id),
          findRatingByUserAndStore(userId, store.id),
        ]);
        return { ...store, averageRating, myRating: myRating?.rating || null };
      })
    );
  }
  
  return {
    items: stores,
    pagination: {
      totalItems: total,
      currentPage: Number(query.page) || 1,
      totalPages: Math.ceil(total / (Number(query.limit) || 10)),
      limit: Number(query.limit) || 10,
    }
  };
};

export const getStoreByIdWithUserRating = async (storeId, userId) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const [averageRating, myRating] = await Promise.all([
    getAverageRatingForStore(storeId),
    findRatingByUserAndStore(userId, storeId),
  ]);

  return {
    ...store,
    averageRating,
    myRating: myRating?.rating || null,
  };
};

export const submitUserRating = async (userId, storeId, rating) => {
  const store = await findStoreById(storeId);
  if (!store) {
    throw new ApiError(404, "Store not found");
  }

  const existingRating = await findRatingByUserAndStore(userId, storeId);
  if (existingRating) {
    throw new ApiError(409, "You have already rated this store. Please update your existing rating.");
  }

  return await createRating({
    userId,
    storeId,
    rating,
  });
};

export const updateUserRating = async (userId, storeId, rating) => {
  const existingRating = await findRatingByUserAndStore(userId, storeId);
  if (!existingRating) {
    throw new ApiError(404, "Rating not found. Submit a new rating first.");
  }

  return await updateRating(userId, storeId, rating);
};
