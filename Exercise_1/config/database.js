const mongoose = require("mongoose");
const MONGOOSE_URL = "Something";
exports.connect = () =>
{
  mongoose.connect(MONGOOSE_URL,{
    useNewUrlParser : true,
    useUnifiedTopology:true
  })
  .then(console.log("DB Connected Succesfully"))
  .catch((error) => {
    console.log("DB Connection Faild");
    console.log(error);
    process.exit(1);
  })
}