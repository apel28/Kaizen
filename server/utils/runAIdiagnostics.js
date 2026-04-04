import { getDiagnosisNotification } from '../utils/gemini.js';
import { addNotification } from '../controllers/notification.controllers.js';
import { getDoctorsByDepartment, getDepartments } from '../query/doctor.js';
import { getPatientId } from '../query/patient.js';
import pool from '../db.js';

export async function getPatientVitals(patient_id) {
    try {
        const result = await pool.query(
            `SELECT v.*
             FROM vitals v
             JOIN visits vis ON v.visit_id = vis.visit_id
             WHERE v.patient_id = $1
             AND (
                bp IS NOT NULL
                OR heart_rate IS NOT NULL
                OR blood_sugar IS NOT NULL
              )
             ORDER BY vis.date DESC
             LIMIT 10`,
            [patient_id]
        );

        return result.rows ?? null;
    } catch (err) {
        console.log(err)
    }
}

export async function getPatientConditions(patient_id) {
    try {
        const result = await pool.query(
            `SELECT mh.condition
             FROM medical_history mh
             JOIN diagnosis diag ON mh.history_id = diag.history_id
             JOIN visits v ON diag.visit_id = v.visit_id
             JOIN departments d ON mh.department_id = d.department_id
             WHERE mh.patient_id = $1
             ORDER BY diag.visit_id DESC
             LIMIT 10`,
            [patient_id]
        );

        return result.rows ?? null;
    } catch (err) {
       
    }
}

export async function aiDiagnosisNotification(user_id) {
  try {

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { rows } = await pool.query(
      `SELECT noti_id FROM notification WHERE user_id = $1 AND message LIKE 'AI diagnosis:%' AND created_at >= $2`,
      [user_id, today]
    );
    if (rows.length > 0) return;

    const patient_id = await getPatientId(user_id)

    const vitals = await getPatientVitals(patient_id);
    const conditions = await getPatientConditions(patient_id);
    const reports = null;
 
    const departments = await getDepartments();
    const doctors = {};
    for (const dept of departments) {
      const deptDoctors = await getDoctorsByDepartment(dept.department_id);
      doctors[dept.name] = deptDoctors;
    }

    console.log(vitals);
    console.log(conditions);
    console.log(doctors);

    const aiMessage = await getDiagnosisNotification({ vitals, conditions, reports, doctors });
    const message = `AI diagnosis: ${aiMessage}`;

    await addNotification({ from: null, user_id, message });
  } catch (err) {
    console.error('AI diagnosis middleware error:', err);
  }
}
