const http = require("http");
const userRequestHandler = require("./user");
const server = http.createServer(userRequestHandler);
const PORT = 3000;
server.listen(PORT,()=>{
  console.log("server are running at port "+PORT);
});