import { getDoctorId } from "../query/doctor.js";
import { insertQualifications, getQualifications, deleteQualification } from "../query/qualification.js";

export const getDoctorQualifications = async (req, res) => {
    try {
        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const qualifications = await getQualifications(doctorId);
        res.status(200).json(qualifications || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addDoctorQualification = async (req, res) => {
    try {
        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { degree_name, institute, year, department_name } = req.body;
        if (!degree_name || !institute || !year || !department_name) {
            return res.status(400).json({ message: "All fields are required: degree_name, institute, year, department_name" });
        }

        const qualification = await insertQualifications(doctorId, {
            degree_name,
            institute,
            year,
            department_name
        });

        res.status(201).json(qualification);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeDoctorQualification = async (req, res) => {
    try {
        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { q_id } = req.params;
        if (!q_id) {
            return res.status(400).json({ message: "Qualification ID (q_id) is required" });
        }

        const deleted = await deleteQualification(doctorId, parseInt(q_id));
        if (!deleted) {
            return res.status(404).json({ message: "Qualification not found" });
        }

        res.status(200).json({ message: "Qualification deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
