import express from "express";
import { countPatients, deletePatientById, getAllPatients, getPatientById, getPatientByNationalId, patientRegister, updatePatientById } from "../controllers/patientContoller.js";

const patientRouter = express();
patientRouter.post("/patientRegister", patientRegister);
patientRouter.get("/getAllPatients", getAllPatients);
patientRouter.get("/getPatientById/:id", getPatientById);
patientRouter.get("/getPatientByNationalId/:id", getPatientByNationalId);
patientRouter.get("/countPatients", countPatients);
patientRouter.put("/updatePatientById/:id", updatePatientById);
patientRouter.delete("/deletePatientById/:id", deletePatientById);

export default patientRouter;