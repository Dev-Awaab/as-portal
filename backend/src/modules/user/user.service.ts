import {
  HttpStatusCode,
  UserCreate,
  UserLogin,
  UserResponse,
} from "../../types";
import {
  APIError,
  comparePassword,
  generateAccessToken,
  hashPassword,
} from "../../utils";
import { create, find } from "./user.repository";

class UserService {
  static async createUserService(data: UserCreate): Promise<UserResponse> {
    const user = await find({ email: data.email });

    if (user) {
      throw new APIError(
        "INVALID",
        HttpStatusCode.BAD_GATEWAY,
        "User already exists"
      );
    }

    const hashedPassword = (await hashPassword(data.password)) as string;

    const createUser = await create({
      ...data,
      password: hashedPassword,
    });

    return {
      _id: createUser._id,
      name: createUser.name,
      email: createUser.email,
      createdAt: createUser.createdAt,
      updatedAt: createUser.updatedAt,
      access_token: generateAccessToken({
        _id: createUser._id,
        email: createUser.email,
      }),
    };
  }

  static async loginUserService(data: UserLogin): Promise<UserResponse> {
    const user = await find({ email: data.email });

    if (!user) {
      throw new APIError(
        "INVALID",
        HttpStatusCode.BAD_REQUEST,
        "User not found"
      );
    }

    const isPasswordMatch = await comparePassword(
      data.password,
      user.password!
    );

    if (!isPasswordMatch) {
      throw new APIError(
        "INVALID",
        HttpStatusCode.BAD_REQUEST,
        "Invalid credentials"
      );
    }


    const loggedInUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      access_token: generateAccessToken({
        _id: user._id,
        email: user.email,
      }),
    };

    return loggedInUser as unknown as UserResponse;
  }
}

export default UserService;
