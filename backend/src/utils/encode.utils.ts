import bcrypt from "bcryptjs";
import { UserPayloadToken } from "../types";
import jwt from "jsonwebtoken";

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  enteredPassword: string,
  savedPassword: string
) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};

export const generateAccessToken = (payload: UserPayloadToken): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};
