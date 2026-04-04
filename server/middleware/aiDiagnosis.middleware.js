import { getDiagnosisNotification } from '../utils/gemini.js';
import { addNotification } from '../controllers/notification.controllers.js';
import { getPatientVitals, getPatientConditions, getPatientReports } from '../controllers/patientData.controllers.js';
import { getDoctorsByDepartment, getDepartments } from '../query/doctor.js';
import pool from '../db.js';

// Middleware: after patient login, generate AI diagnosis notification (max once per day)
export async function aiDiagnosisNotification(req, res, next) {
  try {
    const { user_id, role } = req.body || req.user || {};
    if (role !== 'P' || !user_id) return next();

    console.log("here")

    // Check if a notification was already sent today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { rows } = await pool.query(
      `SELECT noti_id FROM notification WHERE user_id = $1 AND message LIKE 'AI diagnosis:%' AND created_at >= $2`,
      [user_id, today]
    );
    if (rows.length > 0) return next();

    // 1. Gather patient data

    let resu;

    req.params.user_id = user_id;

    const vitals = await getPatientVitals(req, resu);
    const conditions = await getPatientConditions(req, resu);
    const reports = await getPatientReports(user_id, { sinceDays: 30 });

    // Build doctors grouped by department        
    const departments = await getDepartments();
    const doctors = {};
    for (const dept of departments) {
      const deptDoctors = await getDoctorsByDepartment(dept.department_id);
      doctors[dept.name] = deptDoctors;
    }

    // 2. Call Gemini API
    const aiMessage = await getDiagnosisNotification({ vitals, conditions, reports, doctors });
    const message = `AI diagnosis: ${aiMessage}`;

    // 3. Store notification (from: null for system)
    await addNotification({ from: null, user_id, message });
  } catch (err) {
    console.error('AI diagnosis middleware error:', err);
    // Do not block login on AI failure
  }
  next();
}
