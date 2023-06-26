const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:String,
  email:String,
  password:String,
  bio:String,
  joinDate:{
    type:Date,
    default:Date.now
  },
  profilePicture:String,
  resetToken: String,
  resetTokenExpires: String
});

module.exports=mongoose.model("User", userSchema)