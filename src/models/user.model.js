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


export const User = mongoose.model("User", userSchema);