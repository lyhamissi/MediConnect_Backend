import express from 'express';
import { Login, Register, countDoctors, countNurses, deleteDoctorById, getAllDoctors, getAllNurses, getDoctorById, getNurseById, updateDoctorById } from '../controllers/userController.js';
import upload from '../middlewares/multer.js';
import { admin } from '../middlewares/roleIdentification.js';
import { auth } from '../middlewares/tokenVerification.js'
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
export default userRouter;