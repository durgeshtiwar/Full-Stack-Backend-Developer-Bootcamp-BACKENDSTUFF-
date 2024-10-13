const calculaterFeild = (req, res) => { 
  // res.write("<h1>Kya ye bhi nhi dkha rha</h1>")
  const body = [];
  req.on("data",(chunk)=>{
    //console.log(chunk);
    body.push(chunk);
  })
  req.on("end",()=>{
    const fullBody = Buffer.concat(body).toString();
    //console.log(fullBody); 
    const params = new URLSearchParams(fullBody);
    const objectBody = Object.fromEntries(params);
    //console.log(objectBody);
    const result = Number(objectBody.firstNumber) + Number(objectBody.secondNumber);
    //console.log(result);
    res.write(`
      <head>
        <title>Calculater</title>
      </head>
      <body>
        <h1>Sum of Given No. is = ${result}</h1>
      </body>
      </html>`);
  })

}
module.exports = calculaterFeild;