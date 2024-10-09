const http = require("http");
const homePage = require("./home");
const server = http.createServer(homePage);
const PORT = 8000;
server.listen(PORT,()=>{
  console.log("Server are running at port "+PORT);
})