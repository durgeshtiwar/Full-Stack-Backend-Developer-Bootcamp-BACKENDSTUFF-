const http = require("http");
const server = http.createServer((res, req)=>{
  // console.log(res);
  // console.log(req);
})
const PORT = 3000;
server.listen(PORT,()=>{
  console.log("server are running at port "+PORT);
});