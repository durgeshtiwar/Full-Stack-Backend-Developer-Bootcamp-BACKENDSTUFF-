const http = require("http");
const fs = require("fs");
const server = http.createServer((req,res)=>{
//console.log(req.url, req.method);
if (req.url === '/') {
  res.setHeader("Content-Type","text/html");
  res.write(`
<html>
<head>
  <title>Complete Coding</title>
</head>
<body>
  <h1>Enter Your Details---</h1>
  <form action="/submit-details" method="POST">
    <input type="text" name="username" placeholder="enter your name"><br>
    <label for="male">Male</label>
    <input type="radio" id="male" name="gender" value="male">
    <label for="male">Female</label>
    <input type="radio" id="female" name="gender" value="male"><br>
    <input type="submit" value="Submit">
  </form>
</body>
</html>`);
return res.end();
} else if (req.url.toLowerCase() === "/submit-details" && req.method === "POST") {
  const body = [];
  req.on("data",(chunk)=>{
    console.log(chunk);
    body.push(chunk);
  });
  req.on("end",()=>{
    const fullBody = Buffer.concat(body).toString();
    console.log(fullBody);
  })
  fs.writeFileSync("user.text","Durgesh Tiwari");
  res.statusCode = 302;
  res.setHeader("Loction","/");
}
res.setHeader("Content-Type","text/html");
res.write("<h1>Age submit kr diya to dikhao na</h1>");
});
const PORT = 3000;
server.listen(PORT,()=>{
  console.log("Server are Running at port" + PORT);
});
