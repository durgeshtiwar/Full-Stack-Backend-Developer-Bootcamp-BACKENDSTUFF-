require("dotenv").config();
const express = require("express");
const User = require("./model/user")
const app = express();
app.get("/",(req, res)=>
  {
    res.send("<h1>Welcome to iNeuron</h1>");
  }
)

app.post("/signup",(req,res)=>
{
  //for all mandatory feild 
  const {firstName, lastName, email, password} = req.body
  if (!(firstName && lastName && email && password)) {
    res.status(400).send("This feild sre required")
  }

  //for check unique mail
  const userExist = User.findOne(email);
  if (userExist) {
    res.status(400).send("User Already Exist");
  }

})


module.exports = app;
