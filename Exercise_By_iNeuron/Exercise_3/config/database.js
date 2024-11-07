const mongoose = require("mongoose");
const MONGODB_URL = "Some String";
exports.connect = () =>{
  mongoose.connect(MONGODB_URL,
    {
    useNewUrlParser : true,
    useUnifiedTopology : true
    })
    .then(console.log("Database Connected Succesfully"))
    .catch(
      (error)=>{
        console.log("Database connection faild");
        console.log(error);
        process.exit(1);
      }
    )
}