import UserModel from '@/models/User';
import BaseController from '@/api/controllers';
import { connectDB } from '@/api/decorators/database';

@connectDB
class AuthController extends BaseController {
  constructor() {
    super(UserModel);
  }

  async login(email: string, password: string) {
    const user = await this.findOne({ email, password });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user;
  }
}

export default AuthController;
