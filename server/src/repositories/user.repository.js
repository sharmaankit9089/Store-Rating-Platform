import prisma from "../config/prisma.js";

export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
  });
};

export const updateUserPassword = async (id, newPassword) => {
  return await prisma.user.update({
    where: { id },
    data: { password: newPassword },
  });
};

export const countUsers = async () => {
  return await prisma.user.count();
};

export const findUsers = async ({ skip, take, where, orderBy }) => {
  return await prisma.user.findMany({
    skip,
    take,
    where,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      address: true,
      role: true,
      createdAt: true,
    }
  });
};

export const updateUser = async (id, data) => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};
