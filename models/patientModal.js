import mongoose from "mongoose";

const { model, Schema } = mongoose;
const patientSchema = new Schema(
    {
        patientName: {
            type: String,
            required: true,
        },
        patientEmail: {
            type: String,
            required: true,
        },
        patientId:{
            type: String,
            required: true,
        },
        patientAge: {
            type: String,
            required: true,
        },
        patientGender: {
            type: String,
            required: true,
        },
        patientPhone: {
            type: String,
            required: true,
        },
        patientDisease: {
            type: String,
            // required: true,
        },
        patientHeight: {
            type: String,
            required: true,
        },
        patientKgs: {
            type: String,
            required: true,
        },
        patientDescription: {
            type: String,
            // required: true,
        },
        doctorId:{
            type: String,
        },
        doctorName: {
            type:String,
        },
        patientRole: {
            type: String,
            default: "patient",
            required: true,
            enum: ["patient"]
        }
    }
);
const Patient = model("patient", patientSchema)
export default Patient;