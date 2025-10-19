import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema=new mongoose.Schema({
 fullName:{type:String,required:true},
 email:{type:String,required:true,unique:true},
 password:{type:String,required:true,minlength:8,select:false},
 profilePic:{type:String,default:""},
 bio:{type:String},
},{timestamps:true});



// Pre-save hook ensures you never store plain text passwords.
// Use pre('save') for password hashing + instance methods for comparison & token generation.
// Runs before saving the document (pre("save")).
// 🔹 Checks if the password field was modified (isModified("password")).
// 🔹 If yes → generates a salt → hashes the password using bcrypt.
// 🔹 Prevents rehashing when other fields (like email) are updated.

// password setup 
userSchema.pre("save",async function(next){
  if(this.isModified("password"))return next();
  const salt=await bcrypt.genSalt(10);
  const hashedPassword=await bcrypt.hash(this.password,salt);
  next();
});

// generate token
userSchema.methods.generateAuthToken= function () {
  const token=jwt.sign({_id:this._id},process.env.JWT_SECRET,{expiresIn:'30d'});
  return token;
}

// compare password 
userSchema.methods.comparePassword=async function (enteredPassword) {
  return await bcrypt.compare(this.password,enteredPassword);
}

const userModel=mongoose.models.User || mongoose.model("User",userSchema);

export default userModel;