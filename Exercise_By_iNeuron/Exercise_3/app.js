require("./config/database").connect();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.get("/",(req,res)=>{
  res.send("Welcom to auth page")
});

app.post("register/",async(req,res)=>{
  try {
    const {firstName, lastName, email, token} = req.body;
    if (!(firstName && lastName && email && token)) {
      res.status(401).send("All Field are required");
    }
  } catch (error) {
    console.log(error);
    console.log("error is response route");
  }
})