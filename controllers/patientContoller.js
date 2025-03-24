import Patient from "../models/patientModal.js";
import User from "../models/userModal.js";
export const patientRegister = async (req, res) => {
    try {
        const { patientName, patientEmail, patientId, patientAge, patientGender, patientPhone, patientDisease, patientHeight, patientKgs, patientDescription } = req.body;

        const existingPatient = await Patient.findOne({ patientEmail });
        if (existingPatient) {
            return res.status(400).json({ message: "Patient already exists" });
        }
        const patient = new Patient({ patientName, patientEmail, patientId, patientAge, patientGender, patientPhone, patientDisease, patientHeight, patientKgs, patientDescription });
        await patient.save();
        res.status(201).json({
            message: "Patient created successfully!",
            patient: {
                _id: patient._id,
                patientName: patient.patientName,
                patientEmail: patient.patientEmail,
                patientId: patient.patientId,
                patientAge: patient.patientAge,
                patientGender: patient.patientGender,
                patientPhone: patient.patientPhone,
                patientDisease: patient.patientDisease,
                patientHeight: patient.patientHeight,
                patientKgs: patient.patientKgs,
                patientDescription: patient.patientDescription,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal server Error! Failed to register Patient", error: error.message });
    }
}
export const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find();
        res.status(200).json(patients);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching Patients", details: error.message });
    }
}
export const getPatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findById(id);

        if (!patient) {
            return res.status(404).json({ error: "No patient found" });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Patient", details: error.message });
    }
};
export const countPatients = async (req, res) => {
    try {
        const patientCount = await Patient.countDocuments();
        res.status(200).json({ count: patientCount });
    }
    catch (error) {
        res.status(500).json({ error: "Error counting patients", details: error.message });
    }
}
export const getPatientByNationalId = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findOne({ patientId: id });

        if (!patient) {
            return res.status(404).json({ error: "No patient found" });
        }

        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ error: "Error fetching Patient", details: error.message });
    }
};

export const updatePatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient, doctorId } = req.body;

    // Find the doctor (user with doctor role)
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.userRole !== 'doctor') {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Add doctorName to patient data
    const patientData = {
      ...patient,
      doctorName: doctor.userName, // make sure fullName or name field exists in your user model
    };

    const updatedPatient = await Patient.findByIdAndUpdate(id, patientData, { new: true });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ message: "Patient Updated Successfully", updatedPatient });
  } catch (error) {
    res.status(500).json({ message: "Error updating patient", error: error.message });
  }
};



export const deletePatientById = async (req, res) => {
    try {
        const { id } = req.params;
        const patient = await Patient.findByIdAndDelete(id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json({ message: "Patient Deleted Successfully" })
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting patient", error: error.message });
    }
}