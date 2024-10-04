const http = require("http");
const server = http.createServer((req, res)=>{
  console.log(req.url, req.method);
  if (req.url === '/home') {
    res.write("<h1>Welcome to Home</h1>")
    return res.end();
  }else if (req.url === '/men') {
    res.write("<h1>Welcome to Men</h1>")
    return res.end();
  }else if (req.url === '/women') {
    res.write("<h1>Welcome to Women</h1>")
    return res.end();
  }else if (req.url === '/kid') {
    res.write("<h1>Welcome to Kid</h1>")
    return res.end();
  }else if(req.url === '/cart'){
    res.write("<h1>Welcome to Cart</h1>")
    return res.end();
  }


  res.write(`
    <html lang="en">
      <head>
        <title>Document</title>
      </head>
      <body>
        <head>
          <nav>
            <ul>
              <li><a href="/home">Home</a></li>
              <li><a href="/men">Men</a></li>
              <li><a href="/women">Women</a></li>
              <li><a href="/kid">Kid</a></li>
              <li><a href="/cart">Cart</a></li>
            </ul>
          </nav>
        </head>
      </body>
      </html>
    `);
})
const PORT = 3000;
server.listen(PORT,()=>{
  console.log("server are running at port "+PORT);
});