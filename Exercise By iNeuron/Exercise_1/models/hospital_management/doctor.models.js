import mongoose from "mongoose";
const workInHospitalSchema = new mongoose.Schema({
  hospitalId : {
    type : mongoose.Schema.Types.ObjectId,
    required : true
  },
  workingTimeInHour : {
    type : Number,
    required : true
  } 
})
const doctorSchema = new mongoose.Schema(
  {
    name : {
      type : String,
      required : true
    },
    sallary : {
      type : String,
      required : true
    },
    qualifications : {
      type : String,
      required : true
    },
    experienceInYears : {
      type : Number,
      default : 0
    },
    workInHospital : {
      type : [workInHospitalSchema]
    }
  },
  {timestamps : true})
export const Doctor = mongoose.model("Doctor", doctorSchema);