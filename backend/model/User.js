import mongoose, { model } from "mongoose";

const userSchema= mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },steamId: {
    type: String,
    default: null
  }

})

const User= mongoose.model('User',userSchema)
export default User;