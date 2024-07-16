import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    index:true
  },
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
  },
  password:{
    type:String,
    required:[true, "Password is required"]
  },
  fullName:{
    type:String,
    required:true,
    trim:true,
    index:true
  },
  avatar:{
    type:String,
    required:true
  },
  coverImage:{
    type:String
  },
  refreshToken:{
    type:String
  },
  watchHistery:
    [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ]
  


},{timestamps:true});


userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.isPasswordCurrect = async function(condidatePassword) {
    return await bcrypt.compare(condidatePassword, this.password);
}

userSchema.methods.generateAccessToken = async function() {
  
  
  return await jwt.sign({userId:this._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
}


userSchema.methods.generateRefreshToken = async function() {
    return await jwt.sign({userId:this._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
}





export const User = mongoose.model("User", userSchema);