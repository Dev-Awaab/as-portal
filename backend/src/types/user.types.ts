export interface UserCreate {
  name: string;
  email: string;
  password: string;
}

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  password?: string;
  access_token: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserQuery {
  _id?: string;
  email?: string;
}

export type UserLogin = Omit<UserCreate, "name">;

export type UserPayloadToken = {
  _id: string;
  email: string;
};
