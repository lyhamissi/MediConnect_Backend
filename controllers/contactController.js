// controllers/contactController.js
import Contact from '../models/contactModal.js';  // Mongoose model
import { sendEmail } from '../middlewares/service.js';  // Email service

// Controller function to handle support request
export const handleSupportRequest = async (req, res) => {
    const { fullName, email, message } = req.body;

    // Validate input
    if (!fullName || !email || !message) {
        return res.status(400).json({ error: 'Full Names, Email and message are required.' });
    }

    // Create a new contact request
    const contactRequest = new Contact({
        fullName,
        email,
        message
    });

    try {
        // Save the contact request to the database
        await contactRequest.save();

        // Send email to admin
        await sendEmail(
            'uwitonzeafuwa@gmail.com',  // Admin's email
            'New Support Request',
            `New support request from ${fullName}: ${email}: ${message}`
        );

        // Send confirmation email to the user
        await sendEmail(
            email,  // User's email
            'Support Request Received',
            'Thank you for contacting us. We will get back to you shortly.'
        );

        // Respond with success
        res.status(201).json({ message: 'Support request submitted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'There was an error processing your request.' });
    }
};
export const getAllSupportRequests = async (req, res) => {
    try {
        // Fetch support requests and sort by newest first
        const requests = await Contact.find().sort({ createdAt: -1 });

        // Respond with the list of requests
        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch support requests.' });
    }
};
export const replyToSupportRequest = async (req, res) => {
    try {
        const { requestId, replyMessage } = req.body;

        // Validate input
        if (!requestId || !replyMessage) {
            return res.status(400).json({ error: "Request ID and reply message are required." });
        }

        // Find the support request in the database
        const supportRequest = await Contact.findById(requestId);

        if (!supportRequest) {
            return res.status(404).json({ error: "Support request not found." });
        }

        // Update status and save reply
        supportRequest.status = "Replied";
        supportRequest.replyMessage = replyMessage;
        await supportRequest.save();

        // Send reply email to the user
        await sendEmail(
            supportRequest.email,
            "Support Request Response",
            `Dear ${supportRequest.fullName},\n\n${replyMessage}`
        );

        res.status(200).json({ message: "Reply sent successfully!" });
    } catch (error) {
        console.error("Error replying to support request:", error);
        res.status(500).json({ error: "Failed to send reply." });
    }
};
export const getPatientSupportRequests = async (req, res) => {
    try {
        const { email } = req.query; // Get logged-in patient's email from query params

        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        // Fetch requests for this patient
        const requests = await Contact.find({ email }).sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch support requests." });
    }
};
