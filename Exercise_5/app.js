const http = require('http');
const express = require('express');
const app = express();
// app.use((req, res, next)=>{
//   console.log("first middleware = " + req.url, req.method);
//   //res.send("<p>This is the first response using middleware</p>")
//   next();
// });
// app.use((req, res, next)=>{
//   console.log("Second middleware = " + req.url, req.method);
//   //res.send("<p>This is the first response using middleware</p>")
//   next();
// });
// app.use((req, res, next)=>{
//   res.send("<p>kg complete coding.</p>");
// });

app.get("/",(req, res, next)=>{
  console.log("Home Page")
  res.send("<h1>kg complete coding.</h1>");
});
app.get("/contact-us",(req, res, next)=>{
  console.log("Contact us page");
  res.send(`
    <form action="/contact-us" method="POST">
      <label for="name">Name : </label>
      <input type="text", placeholder="Enter your name", name="name"><br><br>
      <label for="email">E-Mail : </label>
      <input type="email", placeholder="Enter your mail", name="email"><br><br>
      <input type="submit" value="Submit"><br>
    </form>`)
});
app.post("/contact-us",(req, res, next)=>{
  console.log("Responce of post");
  res.send("<h1>We Will contact you soon.</h1>");
})

//const server = http.createServer(app);
PORT = 3000;
app.listen(PORT,()=>{
  console.log(`server are running at port ${PORT}`);
})