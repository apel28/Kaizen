import * as getDoctor from "../query/doctor.js";

export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await getDoctor.getDoctorProfile(req.user.user_id);
        if (!doctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDoctorProfile = async (req, res) => {
    try {
        // The profile table is shared — same update function works for any role
        const updated = await getDoctor.updateDoctorProfile(req.user.user_id, req.body);
        if (!updated) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
