import User from "../models/userModal.js";
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from "cloudinary";
import { generateAccessToken } from "../utils/tokenGenerating.js";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API,
    api_secret: process.env.CLOUD_API_SECRET,
});
export default cloudinary;
export const Register = async (req, res) => {
    try {
      const { userName, userEmail, userPassword, userRole, userAge, Gender, Speciality, phoneNumber, userDescription } = req.body;
  
      // Check if email already exists
      const existingUser = await User.findOne({ userEmail });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
  
      const hashedPassword = await bcrypt.hash(userPassword, 10);
  
      // Create user object with required fields
      const userData = {
        userName,
        userEmail,
        userPassword: hashedPassword,
      };
  
      // If admin is registering (i.e., additional fields are present)
      if (userRole || userAge || Gender || Speciality || phoneNumber || userDescription) {
        userData.userRole = userRole;
        userData.userAge = userAge;
        userData.Gender = Gender;
        userData.Speciality = Speciality;
        userData.phoneNumber = phoneNumber;
        userData.userDescription = userDescription;
  
        // If admin also uploads a profile image
        if (req.file) {
          const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "Doctor_profileImages",
          });
          userData.profileImage = cloudinaryResult.secure_url;
        }
      }
  
      const user = new User(userData);
      user.token.accessToken = generateAccessToken(user);
      await user.save();
  
      res.status(201).json({
        message: "Account created successfully!",
        user: {
          _id: user._id,
          userName: user.userName,
          userEmail: user.userEmail,
          userRole: user.userRole,
          userAge: user.userAge,
          Gender: user.Gender,
          Speciality: user.Speciality,
          phoneNumber: user.phoneNumber,
          userDescription: user.userDescription,
          profileImage: user.profileImage,
          token: {
            accessToken: user.token.accessToken,
          },
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error", error: error.message });
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
            profileImage: user.profileImage,
            token: { accessToken: user.token.accessToken, },
        };

        res.json({ user: userResponse });
    } catch (error) {
        // General error handling
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ userRole: "doctor" });

        if (doctors.length === 0) {
            return res.status(404).json({ error: "No doctors found" });
        }

        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching Doctors", details: error.message });
    }
}
export const getDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const doctor = await User.findOne({ _id: id, userRole: "doctor" });

        if (!doctor) {
            return res.status(404).json({ error: "No doctor found" });
        }

        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Doctor", details: error.message });
    }
}
export const getAllNurses = async (req, res) => {
    try {
        const nurses = await User.find({ userRole: "nurse" });

        if (nurses.length === 0) {
            return res.status(404).json({ error: "No nurses found" });
        }

        res.status(200).json(nurses);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching Nurses", details: error.message });
    }
}
export const getNurseById = async (req, res) => {
    try {
        const { id } = req.params;
        const nurse = await User.findOne({ _id: id, userRole: "nurse" });

        if (!nurse) {
            return res.status(404).json({ error: "No nurse found" });
        }

        res.status(200).json(nurse);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Nurse", details: error.message });
    }
}
export const countDoctors = async (req, res) => {
    try {
        const doctorCount = await User.countDocuments({ userRole: "doctor" });
        res.status(200).json({ count: doctorCount });
    } catch (error) {
        res.status(500).json({ error: "Error counting doctors", details: error.message });
    }
};
export const countNurses = async (req, res) => {
    try {
        const nurseCount = await User.countDocuments({ userRole: "nurse" });
        res.status(200).json({ count: nurseCount });
    } catch (error) {
        res.status(500).json({ error: "Error counting nurses", details: error.message });
    }
};
export const updateDoctorById = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Check if the user exists and has the role "doctor"
        const doctor = await User.findOne({ _id: id, userRole: "doctor" });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Update doctor details
        const updatedDoctor = await User.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: "Error updating doctor", error: error.message });
    }
};

export const deleteDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the user exists and has the role "doctor"
        const doctor = await User.findOne({ _id: id, userRole: "doctor" });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        // Delete doctor
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "Doctor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting doctor", error: error.message });
    }
};