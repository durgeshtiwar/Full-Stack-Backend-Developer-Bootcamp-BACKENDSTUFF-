const express = require("express");
const app = express();
const PORT = 3000;

app.get('/',(req,res)=>
{
  res.status(200).send("<h1>Hello this is the first program of Backend</h1>");
})
app.listen(PORT,()=>
{
  console.log("Server is runing");
})