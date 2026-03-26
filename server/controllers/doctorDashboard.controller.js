import { getDoctorId } from "../query/doctor.js";
import { getAppointmentsByDoctorForDate } from "../query/appointment.js";

export async function doctorDashboardData(req, res) {
    try {
        const userId = req.user.user_id;
        const doctorId = await getDoctorId(userId);

        if (!doctorId) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const today = new Date().toISOString().split('T')[0];

        const appointments = await getAppointmentsByDoctorForDate(doctorId, today);

        res.json({
            appointments: appointments,
            date: today
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
