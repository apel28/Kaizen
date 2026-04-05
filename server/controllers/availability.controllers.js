import pool from "../db.js";
import { insertAvailability, deleteAvailability, getAvailability } from "../query/availability.js";
import { getDoctorProfile } from "../query/doctor.js";

export async function addAvailability(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (req.user.role !== 'D') {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: "Only doctors can manage availability" });
        }

        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId, client);

        if (!doctorProfile) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;
        const slot = req.body; // { week_day, slot_time, slot_duration_minutes }

        const result = await insertAvailability(doctorId, slot, client);

        if (!result) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "Failed to add availability" });
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Availability added successfully", data: result });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

export async function removeAvailability(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (req.user.role !== 'D') {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: "Only doctors can manage availability" });
        }

        const aId = req.params.aId;

        const result = await deleteAvailability(aId, client);

        if (!result || result.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Availability slot not found" });
        }

        await client.query('COMMIT');
        res.status(200).json({ message: "Availability removed successfully", data: result });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

export async function viewAvailability(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        if (req.user.role !== 'D') {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: "Only doctors can view availability" });
        }

        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId, client);

        if (!doctorProfile) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;
        const weekDay = req.query.weekDay; 

        const result = await getAvailability(doctorId, weekDay, client);

        await client.query('COMMIT');
        res.status(200).json({ data: result });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}