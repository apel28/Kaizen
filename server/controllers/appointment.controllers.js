import pool from "../db.js";
import { getDepartments, getDoctorsByDepartment, searchDoctors } from "../query/doctor.js";
import { insertAppointment, deleteAppointment, getAppointmentCountByDoctorDateTime, getAppointmentsByPatient } from "../query/appointment.js";
import { getPatientId } from "../query/patient.js";
import { slotsAvailableByDate } from "../services/bookAppointment.services.js";

export async function getDepartmentsHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const departments = await getDepartments(client);
        await client.query('COMMIT');
        res.json(departments);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

export async function getDoctorsHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { departmentId, search = "" } = req.query;
        const doctors = departmentId
            ? await getDoctorsByDepartment(departmentId, client)
            : await searchDoctors(search, client);
        await client.query('COMMIT');
        res.json(doctors);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

export async function getSlotsHandler(req, res) {
    // Currently, slotsAvailableByDate is imported from a service, not a direct DB query. It handles its own DB queries.
    // If slotsAvailableByDate doesn't accept client, we leave it as is or pass it if updated.
    try {
        const { doctorId, date } = req.query;
        if (!doctorId || !date) return res.status(400).json({ error: "doctorId and date required" });
        const slots = await slotsAvailableByDate(doctorId, date);
        res.json(slots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getAppointmentsHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const patientId = await getPatientId(req.user.user_id, client);
        if (!patientId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Patient not found" });
        }
        const appointments = await getAppointmentsByPatient(patientId, client);
        await client.query('COMMIT');
        res.json(appointments);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

export async function bookAppointmentHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { doctorId, date, slotTime } = req.body;
        if (!doctorId || !date || !slotTime) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "doctorId, date and slotTime required" });
        }
        const patientId = await getPatientId(req.user.user_id, client);
        if (!patientId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Patient not found" });
        }
        const queue = await getAppointmentCountByDoctorDateTime(doctorId, date, slotTime, client);
        const appointment = await insertAppointment(doctorId, patientId, date, slotTime, queue + 1, client);
        await client.query('COMMIT');
        res.status(201).json(appointment);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

export async function cancelAppointmentHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const deleted = await deleteAppointment(req.params.appId, client);
        if (!deleted) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Appointment not found" });
        }
        await client.query('COMMIT');
        res.json(deleted);
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}
