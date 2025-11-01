import { validationResult } from "express-validator";
import userModel from "../models/user.model.js";
import cloudinary from "../configs/cloudinary.config.js";


export const registerUser=async(req,res)=>{
  try {
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      return res.status(401).json({statuse:false,message:errors.array().map(errs=>errs.msg)});
    }
    const {fullName,email,password,bio}=req.body;
    const isAlreadyUserExist=await userModel.findOne({email});
    if(isAlreadyUserExist){
      return res.status(401).json({success:false,message:"Already User Exist"});
    }
    const userData=await userModel.create({
      fullName,
      email,
      password,
      bio
    });
    const token=userData.generateAuthToken();
    res.status(200).json({success:true,message:"User create successfully!",userData ,token});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
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

    const userData=user.toObject();
    delete userData.password;

    res.status(200).json({
    success:true,
    message:"User created successfully!",
    token,
    user:userData
  });

  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}


export const getUserProfile=async(req,res)=>{
  try {
    res.status(200).json({success:true,user:req.user});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

// controller to update user profile details
export const updateUserProfile=async(req,res)=>{
  try {
    const {profilePic, fullName,bio}=req.body;
    const userId=req.user._id; // from authUser middleware 
    let updatedUser;
    if(!profilePic){
     updatedUser= await userModel.findByIdAndUpdate(userId,{bio,fullName},{new:true}); // return new data 
    }
    else{
      const upload=await cloudinary.uploader.upload(profilePic);
      updatedUser=await userModel.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
    }
  res.status(200).json({success:true,message:"Profile updated successfully!" ,updatedUser});
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}

// Exactly — Cloudinary itself doesn’t require Multer, because it’s a cloud service that can handle direct uploads. But whether you need Multer depends on how you receive files from the client.
// No Multer needed if the frontend sends base64 or remote URL.
// Server can validate the file directly.


// if you’re using ImageKit instead of Cloudinary, the setup and workflow are slightly different, but the principle is similar.
// No Multer needed if the frontend sends base64 or remote URL.
// Server can validate the file directly.
// Rule of thumb: Use Multer only if the client sends form-data. Otherwise, direct upload via SDK is cleaner and faster.
// form-data is a way for browsers (or clients) to send files and text together in a single HTTP request. It’s usually used when uploading files through a web form.
// enctype="multipart/form-data" → Tells the browser to send the data as form-data.
// Includes both text fields (title) and file fields (image) in one request.
// 2️⃣ What the server receives
// The server gets the file as a stream or temporary file (not a base64 string).
// To read it in Node.js, you often use Multer:
// 3️⃣ Difference from base64 or JSON upload
// form-data: Files are sent as binary streams in a multi-part format.
// Base64/JSON: Files are converted into a long string and sent as normal JSON. No need for Multer here:
// ✅ Rule of Thumb:
// Use Multer → When the client sends an actual file via multipart/form-data.
// Don’t use Multer → If the client sends base64 string or remote URL, SDK can handle it directly.