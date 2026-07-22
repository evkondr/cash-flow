import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { prisma } from "../utils/prisma-client";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res
          .status(401)
          .json({ message: "Email or Password is required" });
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        return res.status(401).json({ message: "invalid credentials" });
      }
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "invalid credentials" });
      }
      const accessToken = createAccessToken(user.id);
      const refreshToken = createRefreshToken(user.id);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken,
        },
      });
      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
  static async registration(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      if (!email || !password) {
        return res
          .status(401)
          .json({ message: "Email or Password is required" });
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (user) {
        return res.status(401).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: "",
        },
      });
      const accessToken = createAccessToken(newUser.id);
      const refreshToken = createRefreshToken(newUser.id);
      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          refreshToken,
        },
      });
      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) return res.sendStatus(401);
      const payload = verifyRefreshToken(refreshToken);
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
      });
      if (!user) return res.sendStatus(401);
      if (user.refreshToken !== refreshToken) return res.sendStatus(401);
      const accessToken = createAccessToken(user.id);
      const newRefreshToken = createRefreshToken(user.id);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          refreshToken: newRefreshToken,
        },
      });
      res.json({
        accessToken,
        refreshToken: newRefreshToken,
      });
    } catch {
      return res.status(500).json({
        message: "Server error",
      });
    }
  }
}
