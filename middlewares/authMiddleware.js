import jwt from "jsonwebtoken";
import User from "../models/userModal.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1]; // Extract token

        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
        req.user = decoded; // Attach user info to request

        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
