import express from 'express';
import userRouter from './userRoute.js';
const mainRouter = express.Router();
mainRouter.use("/user", userRouter);
export default mainRouter;