import { UserCreate, UserQuery, UserResponse } from "../../types";
import User from "./user.model";

/**
 * Create a new user
 * @param data User data including name, email, and password
 * @returns Promise<UserResponse>
 */
export const create = async (data: UserCreate): Promise<UserResponse> => {
  return await User.create(data) as unknown as UserResponse;
};

export const find = async (data: UserQuery): Promise<UserResponse> => {
  const query = {
    $or: [{ _id: data._id }, { email: data.email }],
  };

  return (await User.findOne(query)) as unknown as UserResponse;
};


