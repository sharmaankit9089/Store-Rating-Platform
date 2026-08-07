import prisma from "../config/prisma.js";

export const countRatings = async () => {
  return await prisma.rating.count();
};

export const getAverageRatingForStore = async (storeId) => {
  const result = await prisma.rating.aggregate({
    _avg: {
      rating: true,
    },
    where: { storeId },
  });
  return result._avg.rating || 0;
};

export const findRatingByUserAndStore = async (userId, storeId) => {
  return await prisma.rating.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });
};

export const createRating = async (data) => {
  return await prisma.rating.create({
    data,
  });
};

export const updateRating = async (userId, storeId, rating) => {
  return await prisma.rating.update({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
    data: { rating },
  });
};
