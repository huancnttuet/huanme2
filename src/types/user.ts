export interface User {
  _id?: string;
  fullName: string;
  email: string;
  password?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  fullName: string;
  email: string;
  password: string;
}
