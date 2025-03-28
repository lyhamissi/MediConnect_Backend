// routes/contactRoute.js
import express from 'express';
import { getAllSupportRequests, handleSupportRequest, replyToSupportRequest, getPatientSupportRequests } from '../controllers/contactController.js';  // Import controller

const contactRouter = express();

// Route to handle support requests
contactRouter.post('/support', handleSupportRequest);  // Use the controller function
contactRouter.get('/getrequest', getAllSupportRequests);
contactRouter.post('/reply',replyToSupportRequest);
contactRouter.get("/patient-requests", getPatientSupportRequests);
export default contactRouter;  // Export the router
