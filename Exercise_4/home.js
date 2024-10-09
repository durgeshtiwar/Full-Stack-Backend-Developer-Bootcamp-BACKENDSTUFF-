const homePage = (req, res) =>{
  if (req.url === '/') {
    res.setHeader("Content-Type","text/html");
    res.write(`
    <head>
      <title>Calculater</title>
    </head>
    <body>
      <h1>Welcome To our Server Calculater</h1>
      <a href="/calculater">Calculater</a>
    </body>
    </html>`);
    return res.end();
  }else if (req.url === '/calculater') {
    res.setHeader("Content-Type","text/html");
    res.write(`<head>
      <title>Calculater</title>
      </head>
      <body>
        <form action="/calculate-result" method="POST">
          <label for="firstNumber">First Number : </label>
          <input type="number", placeholder="Enter first number", name="firstNumber"><br><br>
          <label for="secondNumber">Second Number : </label>
          <input type="number", placeholder="Enter second number", name="secondNumber"><br><br>
          <input type="submit" value="Submit"><br>
        </form>
    
      </body>
      </html>`);   
    return res.end(); 
  }else if (req.url.toLowerCase() === "/calculate-result" && req.method === "POST") {
    console.log(req.url, req.method);
    req.on("data",(chunk)=>{
      console.log(chunk);
    });
  }
}
module.exports = homePage;