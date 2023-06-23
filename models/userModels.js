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
  profilePicture:String
});

module.exports=mongoose.model("user", userSchema)