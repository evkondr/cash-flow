import express from "express";
import { AuthController } from "../controllers/auth-controller";
import authMiddleware from "../middleware/authMiddleware";

const authRouter = express.Router();

authRouter.post("/login", AuthController.login);
authRouter.post("/register", AuthController.registration);
authRouter.post("/refresh", AuthController.refresh);
authRouter.post("/logout", AuthController.logout);
authRouter.get("/check", authMiddleware, AuthController.checkAuth);

export default authRouter;
