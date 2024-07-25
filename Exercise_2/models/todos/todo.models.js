import mongoose from "mongoose";
new todoSchema = new mongoose.Schema(
  {
    content : {
      type : String,
      required : true
    },
    complete : {
      type : Boolean,
      default : false
    },
    createdBy : {
      type : mongoose.Schema.type.ObjectId,
      ref : "User"
    },
    subTodo : [
      {
        type : mongoose.Schema.type.ObjectId,
        ref : "SubTodo"
      }
    ]
  },
  {timestamps:true});
export const Todo = mongoose.model("Todo",todoSchema);