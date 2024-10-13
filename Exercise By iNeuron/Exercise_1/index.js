require("dotenv").config(); 
const port = process.env.PORT;
const express = require("express");
const app = express();
app.get("/",(req,res)=>
{
  res.send("Hello world");
})
app.listen(port, ()=>
{
  console.log(`Surver are running ${port}`);
})