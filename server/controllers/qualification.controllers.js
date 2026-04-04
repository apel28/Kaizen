import pool from "../db.js";
import { getDoctorId } from "../query/doctor.js";
import { insertQualifications, getQualifications, deleteQualification } from "../query/qualification.js";

export const getDoctorQualifications = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }

        const qualifications = await getQualifications(doctorId, client);
        await client.query('COMMIT');
        res.status(200).json(qualifications || []);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};

export const addDoctorQualification = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { degree_name, institute, year, department_name } = req.body;
        if (!degree_name || !institute || !year || !department_name) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "All fields are required: degree_name, institute, year, department_name" });
        }

        const qualification = await insertQualifications(doctorId, {
            degree_name,
            institute,
            year,
            department_name
        }, client);

        await client.query('COMMIT');
        res.status(201).json(qualification);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};

export const removeDoctorQualification = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Doctor not found" });
        }

        const { q_id } = req.params;
        if (!q_id) {
            await client.query('ROLLBACK');
            return res.status(400).json({ message: "Qualification ID (q_id) is required" });
        }

        const deleted = await deleteQualification(doctorId, parseInt(q_id), client);
        if (!deleted) {
            await client.query('ROLLBACK');
            return res.status(404).json({ message: "Qualification not found" });
        }

        await client.query('COMMIT');
        res.status(200).json({ message: "Qualification deleted successfully" });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ message: error.message });
    } finally {
        client.release();
    }
};
