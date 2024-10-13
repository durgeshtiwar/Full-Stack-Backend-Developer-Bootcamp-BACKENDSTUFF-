//require("dotenv").config({path : "./env"})
import { app } from "./app.js";
import connectDb from "./db/dbindex.js";
import dotenv from "dotenv"

dotenv.config({path:"./.env"})
//dotenv.config({path:"./.env"})

app.on("error",(error)=>{
        console.log("Error : "+ error);
        throw error;
      })
connectDb().then(()=>{
app.listen(process.env.PORT || 8000 , ()=>{
  console.log(" Server is running at port : "+process.env.PORT);
})
}).catch((err)=>{
  console.log("MongoDb Connection Failed !!! "+err);
})



//const app = express();
// (async()=>{
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("error",(error)=>{
//       console.log("Error : "+ error);
//       throw error;
//     })
//     app.listen(process.env.PORT,()=>{
//       console.log(`App is Listening on Port ${process.env.PORT}`);
//     })
//   } catch (error) {
//     console.error("Error : " + error);
//     throw error;
//   }
// })()