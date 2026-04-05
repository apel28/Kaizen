import pool from "../db.js";
import * as getDoctor from "../query/doctor.js";

export const getDoctorProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctor = await getDoctor.getDoctorProfile(req.user.user_id, client);
        if (!doctor) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }
        await client.query('COMMIT');
        res.status(200).json(doctor);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};

export const updateDoctorProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const updated = await getDoctor.updateDoctorProfile(req.user.user_id, req.body, client);
        if (!updated) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }
        await client.query('COMMIT');
        res.status(200).json(updated);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};
