import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        userPassword: {
            type: String,
            required: true
        },
        userAge: {
            type: String,
        },
        Gender: {
            type: String,
        },
        Speciality: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },
        profileImage: {
            type: String,
        },
        userDescription: {
            type: String,
        },
        adminId:{
            type: String,
        },
        adminName:{
            type: String,
        },
        userRole: {
            type: String,
            default: "admin",
            required: true,
            enum: ["doctor", "admin","patient","nurse"]
        },
        token: {
            accessToken: { type: String }
        }
    }
);
const User = model("user", userSchema)
export default User;