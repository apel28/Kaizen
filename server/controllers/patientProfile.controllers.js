import pool from "../db.js";
import * as patientCode from "../query/patient.js"

export const getPatientProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const patient = await patientCode.getPatientProfile(req.user.user_id, client);
        if (!patient) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Patient not found" });
        }
        await client.query('COMMIT');
        res.status(200).json(patient);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
}

export const updatePatientProfile = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const patient = await patientCode.updatePatientProfile(req.user.user_id, req.body, client);
        if (!patient) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Patient not found" });
        }
        await client.query('COMMIT');
        res.status(200).json(patient);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
}