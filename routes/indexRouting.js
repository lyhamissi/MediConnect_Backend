import express from 'express';
import userRouter from './userRoute.js';
import patientRouter from './patientRoute.js';
const mainRouter = express.Router();
mainRouter.use("/user", userRouter);
mainRouter.use("/patient", patientRouter);
export default mainRouter;