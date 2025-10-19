
import express from 'express'
import { loginUser, registerUser } from '../controllers/user.controller.js';
const userRouter=express();
import {body} from 'express-validator'

userRouter.use("/register",[
body("name").isEmpty().withMessage("Please write name"),
body("email").isEmail().withMessage("Invalid Email"),
body("password").isLength({min:8}).withMessage("Password must be 8 characters long."),
],
  registerUser);

userRouter.use("/login",loginUser);

export default userRouter;