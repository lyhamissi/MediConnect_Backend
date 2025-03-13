import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import User from "../models/userModal.js";

dotenv.config();

export const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const token = authHeader.split(" ")[1];// Extract token from header

        if (!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: "User not found or token invalid" });
        }
        req.token = token;
        req.user = user;
        req.user.userRole = decoded.userRole;
        next();
    }
    catch (error) {
        console.error("JWT Verification Error: ", error);// log error for debugging
        res.status(401).json({ message: "Authentication failed.", error: error.message });
    }
};