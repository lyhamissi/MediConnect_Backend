import User from "../models/userModal.js";
import bcrypt from 'bcryptjs';
import { generateAccessToken } from "../utils/tokenGenerating.js";
export const Register = async (req, res) => {
    try {
        const { userName, userEmail, userPassword, userRole } = req.body;
        //check if email already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }
        //hash Password
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        const user = new User({ userName, userEmail, userPassword: hashedPassword, userRole });

        user.token.accessToken = generateAccessToken(user);
        await user.save();
        res.status(201).json({
            message: "Account created successfull !",
            user: {
                _id: user._id,
                userName: user.userName,
                userEmail: user.userEmail,
                userRole: user.userRole,
                token: {
                    accessToken: user.token.accessToken,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error! Failed to register User", error: error.message });
    }
};
export const Login = async (req, res) => {
    try {
        const { userEmail, userPassword } = req.body;
        const user = await User.findOne({ userEmail });

        if (!user) {
            // User not found
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const accessToken = generateAccessToken(user);


        user.token.accessToken = accessToken;

        await user.save();

        const userResponse = {
            _id: user._id,
            userName: user.userName,
            userEmail: user.userEmail,
            userRole: user.userRole,
            token: { accessToken: user.token.accessToken, },
        };

        res.json({ user: userResponse });
    } catch (error) {
        // General error handling
        res.status(500).json({ message: "Server error", error: error.message });
    }
};