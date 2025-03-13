import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, userEmail: user.userEmail,userRole: user.userRole},
    process.env.JWT_SECRET,
    { expiresIn: "4h" }
  );
};