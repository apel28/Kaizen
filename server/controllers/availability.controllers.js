import { insertAvailability, deleteAvailability, getAvailability } from "../query/availability.js";
import { getDoctorProfile } from "../query/doctor.js";

export async function addAvailability(req, res) {
    try {
        if (req.user.role !== 'D') {
            return res.status(403).json({ error: "Only doctors can manage availability" });
        }

        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId);

        if (!doctorProfile) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;
        const slot = req.body; // { week_day, slot_time, slot_duration_minutes }

        const result = await insertAvailability(doctorId, slot);

        if (!result) {
            return res.status(400).json({ error: "Failed to add availability" });
        }

        res.status(201).json({ message: "Availability added successfully", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function removeAvailability(req, res) {
    try {
        if (req.user.role !== 'D') {
            return res.status(403).json({ error: "Only doctors can manage availability" });
        }

        const aId = req.params.aId; // or req.body.aId

        const result = await deleteAvailability(aId);

        if (!result || result.length === 0) {
            return res.status(404).json({ error: "Availability slot not found" });
        }

        res.status(200).json({ message: "Availability removed successfully", data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function viewAvailability(req, res) {
    try {
        if (req.user.role !== 'D') {
            return res.status(403).json({ error: "Only doctors can view availability" });
        }

        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId);

        if (!doctorProfile) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;
        const weekDay = req.query.weekDay; // optional

        const result = await getAvailability(doctorId, weekDay);

        res.status(200).json({ data: result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}