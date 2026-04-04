import pool from "../db.js";
import { getDoctorId, getDoctorProfile } from "../query/doctor.js";
import { getAppointmentsByDoctorForDate } from "../query/appointment.js";

export async function doctorDashboardData(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId, client);

        if (!doctorProfile) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;
        const doctorName = doctorProfile.doctor_name;

        const today = new Date().toLocaleDateString();

        const appointments = await getAppointmentsByDoctorForDate(doctorId, today, client);

        const totalToday = appointments.length;
        const nowTime = new Date().toTimeString().split(' ')[0]; // HH:MM:SS

        const upcomingAppointments = appointments.filter((a) => a.slot_time > nowTime);
        const appointmentsLeft = upcomingAppointments.length;
        const nextSlot = upcomingAppointments.length > 0 ? upcomingAppointments[0] : null;

        await client.query('COMMIT');
        res.json({
            date: today,
            doctorId,
            doctorName,
            appointmentCountToday: totalToday,
            appointmentsLeft: appointmentsLeft,
            nextSlot: nextSlot,
            appointments: appointments,
        });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}
