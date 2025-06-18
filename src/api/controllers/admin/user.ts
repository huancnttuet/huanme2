'use server';

import UserModel from '@/models/User';
import BaseController from '..';
import { connectDB } from '@/api/decorators/database';
import { authorization } from '@/api/decorators/auth';
import { User, UserRegister } from '@/types/user';
import bcrypt from 'bcryptjs';

@authorization
@connectDB
class UserAdminController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async getAll() {
    return this.model.find().select('-password'); // Exclude password field
  }

  async getById(id: string) {
    return this.model.findById(id).select('-password');
  }

  async createUser(userData: UserRegister) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const userWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };

    const user = await this.create(userWithHashedPassword);

    const userWithoutPassword = await this.model
      .findById(user._id)
      .select('-password');
    return userWithoutPassword;
  }

  async updateUser(id: string, userData: Partial<User>) {
    // If password is being updated, hash it
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const user = await this.model
      .findByIdAndUpdate(id, userData, { new: true })
      .select('-password');
    return user;
  }

  async deleteById(id: string) {
    const user = await this.model.findByIdAndDelete(id).select('-password');
    return user;
  }
}

export default UserAdminController;
