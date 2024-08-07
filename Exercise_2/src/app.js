import express from "express"
import cookieParser from "cookie-parser"

const app = express();
import cors from "cors"
app.use(cors({
  origin : process.env.CORS_ORIGIN,
  Credential : true
}))
app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true , limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser)



//import routes
//import userRouter from "./routes/user.routes.js"
//use routes
//app.use("/api/v1/users",userRouter);

export {app}