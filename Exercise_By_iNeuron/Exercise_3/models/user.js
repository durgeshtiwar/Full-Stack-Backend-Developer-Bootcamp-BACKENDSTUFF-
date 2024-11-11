const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstName : {
    type : String,
    default : null
  },
  lastName : {
    type : String,
    default : null
  },
  password : {
    type : String,
    unique : true
  },
  email : {
    type : String,
    unique : true
  },
  token : {
    type : String,
  }
})

mudule.exports = mongoose.model("user",userSchema);