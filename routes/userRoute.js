import express from 'express';
import { Login, Register, countDoctors, countNurses, deleteDoctorById, getAllDoctors, getAllNurses, getDoctorById, getNurseById, updateDoctorById, updateUserProfile } from '../controllers/userController.js';
import upload from '../middlewares/multer.js';
import { admin } from '../middlewares/roleIdentification.js';
import { auth } from '../middlewares/tokenVerification.js'
import authMiddleware from '../middlewares/authMiddleware.js';
const userRouter = express();
userRouter.post("/login", Login);
userRouter.post("/register", upload.single('profileImage'), Register);
userRouter.get("/getAllDoctors",getAllDoctors);
userRouter.get('/getDoctorById/:id', getDoctorById);
userRouter.get("/getAllNurses", getAllNurses);
userRouter.get("/getNurseById/:id", getNurseById);
userRouter.get("/countDoctors",countDoctors);
userRouter.get("/countNurses",countNurses);
userRouter.put("/doctorUpdate/:id",upload.single('profileImage'), updateDoctorById);
userRouter.delete("/doctorDelete/:id", deleteDoctorById);
userRouter.put("/update-profile",authMiddleware, updateUserProfile);
export default userRouter;