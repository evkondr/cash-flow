import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_TOKEN as string;
const REFRESH_SECRET = process.env.REFRESH_TOKEN as string;

export const createAccessToken = (userId: number) => {
  return jwt.sign({ userId }, ACCESS_SECRET, { expiresIn: "15m" });
};
export const createRefreshToken = (userId: number) => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "5d" });
};
export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};
export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
