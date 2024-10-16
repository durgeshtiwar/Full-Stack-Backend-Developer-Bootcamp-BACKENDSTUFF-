const http = require('http');
const express = require('express');
const app = express();
app.use((req, res, next)=>{
  console.log("first middleware = " + req.url, req.method);
  res.send("<p>This is the first response using middleware</p>")
  next();
});
app.use((req, res, next)=>{
  console.log("Second middleware = " + req.url, req.method);
  //res.send("<p>This is the first response using middleware</p>")
})
const server = http.createServer(app);
PORT = 3000;
server.listen(PORT,()=>{
  console.log(`server are running at port ${PORT}`);
})