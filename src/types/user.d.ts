interface IUser {
  userId: number;
  name: string;
  email: string;
  isActive: boolean;
  password: string;
  phone: string;
  roleId: number;
  createdAt: string;
  updatedAt: string;
  role: {
    roleId: number;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface ICreateUser {
  userId: number;
  name: string;
  email: string;
  phone?: number;
  isActive: boolean;
  password: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
  roleId: number;
}

interface IUserLogin {
  id: number;
  email: string;
  exp: number;
  iat: number;
  role: string ;
}

