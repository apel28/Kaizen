import { getDepartments, getDoctorsByDepartment, searchDoctors } from "../query/doctor.js";
import { insertAppointment, deleteAppointment, getAppointmentCountByDoctorDateTime, getAppointmentsByPatient } from "../query/appointment.js";
import { getPatientId } from "../query/patient.js";
import { slotsAvailableByDate } from "../services/bookAppointment.services.js";

export async function getDepartmentsHandler(req, res) {
    try {
        const departments = await getDepartments();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getDoctorsHandler(req, res) {
    try {
        const { departmentId, search = "" } = req.query;
        const doctors = departmentId
            ? await getDoctorsByDepartment(departmentId)
            : await searchDoctors(search);
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getSlotsHandler(req, res) {
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
    try {
        const patientId = await getPatientId(req.user.user_id);
        if (!patientId) return res.status(404).json({ error: "Patient not found" });
        const appointments = await getAppointmentsByPatient(patientId);
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function bookAppointmentHandler(req, res) {
    try {
        const { doctorId, date, slotTime } = req.body;
        if (!doctorId || !date || !slotTime) return res.status(400).json({ error: "doctorId, date and slotTime required" });
        const patientId = await getPatientId(req.user.user_id);
        if (!patientId) return res.status(404).json({ error: "Patient not found" });
        const queue = await getAppointmentCountByDoctorDateTime(doctorId, date, slotTime);
        const appointment = await insertAppointment(doctorId, patientId, date, slotTime, queue + 1);
        res.status(201).json(appointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function cancelAppointmentHandler(req, res) {
    try {
        const deleted = await deleteAppointment(req.params.appId);
        if (!deleted) return res.status(404).json({ error: "Appointment not found" });
        res.json(deleted);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
