const mongoose = require('mongoose')
MONGODB_URL = "Somthing";
exports.conection = () => {
  mongoose.connect(MONGODB_URL,{
    useNewUrlParser : true,
    useUnifiedTopology : true
  }).then(
    console.log(`Database Connected Succefully`)
  )
  .catch((error)=>{
    console.log(`DB Connection Faild`)
    console.log(error)
    process.exit(1)
  })
}