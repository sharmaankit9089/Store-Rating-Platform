import prisma from "../config/prisma.js";

export const countStores = async () => {
  return await prisma.store.count();
};

export const createStore = async (storeData) => {
  return await prisma.store.create({
    data: storeData,
  });
};

export const findStores = async ({ skip, take, where, orderBy }) => {
  return await prisma.store.findMany({
    skip,
    take,
    where,
    orderBy,
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

export const findStoreById = async (id) => {
  return await prisma.store.findUnique({
    where: { id },
    include: {
      owner: {
        select: { id: true, name: true, email: true }
      }
    }
  });
};

export const updateStore = async (id, data) => {
  return await prisma.store.update({
    where: { id },
    data,
  });
};

export const deleteStore = async (id) => {
  return await prisma.store.delete({
    where: { id },
  });
};
