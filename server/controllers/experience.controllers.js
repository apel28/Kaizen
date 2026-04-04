import pool from "../db.js";
import { getDoctorId } from "../query/doctor.js";
import { insertExperience, getExperience, deleteExperience } from "../query/experience.js";

export const getDoctorExperience = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }

        const experience = await getExperience(doctorId, client);
        await client.query('COMMIT');
        res.status(200).json(experience || []);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};

export const addDoctorExperience = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { institute, role, start_date, end_date } = req.body;
        if (!institute || !role || !start_date) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Institute, Role, and Start Date are required" });
        }

        const experience = await insertExperience(doctorId, {
            institute,
            role,
            start_date,
            end_date: end_date || null
        }, client);

        await client.query('COMMIT');
        res.status(201).json(experience);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};

export const removeDoctorExperience = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { e_id } = req.params;
        if (!e_id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Experience ID (e_id) is required" });
        }

        const deleted = await deleteExperience(doctorId, parseInt(e_id), client);
        if (!deleted) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Experience not found" });
        }

        await client.query('COMMIT');
        res.status(200).json({ message: "Experience deleted successfully" });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};
