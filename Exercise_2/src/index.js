//require("dotenv").config({path : "./env"})
import connectDb from "./db/dbindex.js";
import dotenv from "dotenv"

dotenv.config({path:"./env"})
connectDb();





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