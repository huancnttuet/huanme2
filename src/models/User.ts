import { User } from '@/types/user';
import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema<User>(
  {
    fullName: String,
    password: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = models?.user || model<User>('user', UserSchema);

export default UserModel;
