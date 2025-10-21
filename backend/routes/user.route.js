
import express from 'express'
import { getUserProfile, loginUser, registerUser, updateUserProfile } from '../controllers/user.controller.js';
const userRouter=express();
import {body} from 'express-validator'
import { authUser } from '../middlewares/authUser.middleware.js';

userRouter.post("/signup",[
body("fullName").isEmpty().withMessage("Please write fullName"),
body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:8}).withMessage("Password must be 8 characters long."),
body("bio").isEmpty().withMessage("Please write short bio."),
],
  registerUser);

userRouter.post("/login",loginUser);
userRouter.get("/profile",authUser, getUserProfile);
userRouter.put("/update-profile",authUser, updateUserProfile);

export default userRouter;