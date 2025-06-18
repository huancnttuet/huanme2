'use server';

import UserAdminController from '@/api/controllers/admin/user';
import { User, UserRegister } from '@/types/user';

const controller = new UserAdminController();

export const getUserList = async () => {
  return await controller.getAll();
};

export const getUserById = async (id: string) => {
  return await controller.getById(id);
};

export const createUser = async (userData: UserRegister) => {
  return await controller.createUser(userData);
};

export const updateUser = async (id: string, userData: Partial<User>) => {
  const result = await controller.updateUser(id, userData);
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await controller.deleteById(id);
  return result;
};
