import express from "express";
import * as userController from "../controller/userController.js";

const userRouter = express.Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.post("/refresh", userController.refresh);

export default userRouter;
