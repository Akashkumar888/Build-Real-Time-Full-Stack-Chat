import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";


export const registerUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(401).json({statuse:false,message:errors.array().map(errs=>errs.msg)});
    }
    const {name,email,password}=req.body;
    const isAlreadyUserExist=await userModel.findOne({email});
    if(isAlreadyUserExist){
      return res.status(401).json({success:false,message:"Already User Exist"});
    }
    const userData=await userModel.create({
      name,
      email,
      password
    });
    const token=userData.generateAuthToken();
    res.status(200).json({success:true,message:"User create successfully!"});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message,token});
  }
}

export const loginUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(401).json({statuse:false,message:errors.array().map(errs=>errs.msg)});
    }
    const {email,password}=req.body;
    const user=await userModel.findOne({email}).select("+password");
    if(!user){
      return res.status(401).json({success:false,message:"Invalid Credentials"}); 
    }
    const isMatch=await user.comparePassword(password);
    if(!isMatch){
     return res.status(401).json({success:false,message:"Invalid Credentials"}); 
    }
    const token=user.generateAuthToken();

    const safeUser=user.toObject();
    delete safeUser.password;

    res.status(200).json({success:true,message:"Login successfully!",token});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}
