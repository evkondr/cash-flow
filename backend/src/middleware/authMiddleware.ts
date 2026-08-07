import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);
  const token = header.split(" ")[1];
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return res.sendStatus(401);
  }
};
export default authMiddleware;
