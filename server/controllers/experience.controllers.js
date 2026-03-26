import { getDoctorId } from "../query/doctor.js";
import { insertExperience, getExperience, deleteExperience } from "../query/experience.js";

export const getDoctorExperience = async (req, res) => {
    try {
        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const experience = await getExperience(doctorId);
        res.status(200).json(experience || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addDoctorExperience = async (req, res) => {
    try {
        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { institute, role, start_date, end_date } = req.body;
        if (!institute || !role || !start_date) {
            return res.status(400).json({ message: "Institute, Role, and Start Date are required" });
        }

        const experience = await insertExperience(doctorId, {
            institute,
            role,
            start_date,
            end_date: end_date || null
        });

        res.status(201).json(experience);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeDoctorExperience = async (req, res) => {
    try {
        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { e_id } = req.params;
        if (!e_id) {
            return res.status(400).json({ message: "Experience ID (e_id) is required" });
        }

        const deleted = await deleteExperience(doctorId, parseInt(e_id));
        if (!deleted) {
            return res.status(404).json({ message: "Experience not found" });
        }

        res.status(200).json({ message: "Experience deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};