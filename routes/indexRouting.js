import express from 'express';
import userRouter from './userRoute.js';
import patientRouter from './patientRoute.js';
import contactRouter from './contactRoute.js';
const mainRouter = express.Router();
mainRouter.use("/user", userRouter);
mainRouter.use("/patient", patientRouter);
mainRouter.use("/contact",contactRouter);
export default mainRouter;