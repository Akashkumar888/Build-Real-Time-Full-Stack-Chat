
import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';
import blackListModel from '../models/blackListToken.model.js';

export const authUser=async(req,res,next)=>{
  try {
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
      return res.status(401).json({success:false,message:"Not Authorized"});
    }
    const token=authHeader.split(" ")[1];
    if(!token)return res.status(401).json({success:false,message:"Token blacklisted/expired"});
    const isBlackListToken=await blackListModel.findOne({token});
    if(isBlackListToken){
      return res.status(401).json({success:false,message:"Token blacklisted/expired"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const userId=decoded._id || decoded.id;
    const user=await userModel.findById(userId);
    if(!user){
      return res.status(401).json({success:false,message:"User not found"});
    }
    req.user=user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({success:false,message:error.message});
  }
}
