import * as patientCode from "../query/patient.js"

export const getPatientProfile = async (req, res) => {
    try {
        const patient = await patientCode.getPatientProfile(req.user.user_id);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updatePatientProfile = async (req, res) => {
    try {
        const patient = await patientCode.updatePatientProfile(req.user.user_id, req.body);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}