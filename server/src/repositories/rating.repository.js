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
