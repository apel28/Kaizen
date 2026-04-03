import pool from "../db.js";
import { getDoctorProfile } from "../query/doctor.js";

export async function getPatientsForDoctor(req, res) {
    try {
        if (req.user.role !== 'D') {
            return res.status(403).json({ error: "Only doctors can view their patients" });
        }

        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId);

        if (!doctorProfile) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;

        // Get distinct patient_ids who have visited this doctor
        const result = await pool.query(
            `SELECT DISTINCT v.patient_id,
                    pf.first_name || ' ' || COALESCE(pf.middle_name || ' ', '') || pf.last_name AS name
            FROM visits v
            JOIN patient p ON v.patient_id = p.patient_id
			JOIN profile pf ON pf.user_id = p.user_id
            WHERE v.doctor_id = $1`,
            [doctorId]
        );

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPatientConditions(req, res) {
    try {
        const { patient_id } = req.params;

        // Get conditions with latest first (by visit_id desc)
        const result = await pool.query(
            `SELECT mh.condition, mh.department_id, d.name as department_name, diag.visit_id, v.date
             FROM medical_history mh
             JOIN diagnosis diag ON mh.history_id = diag.history_id
             JOIN visits v ON diag.visit_id = v.visit_id
             JOIN departments d ON mh.department_id = d.department_id
             WHERE mh.patient_id = $1
             ORDER BY diag.visit_id DESC`,
            [patient_id]
        );

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPatientVitals(req, res) {
    try {
        const { patient_id } = req.params;

        const result = await pool.query(
            `SELECT v.*, vis.date
             FROM vitals v
             JOIN visits vis ON v.visit_id = vis.visit_id
             WHERE v.patient_id = $1
             ORDER BY vis.date DESC`,
            [patient_id]
        );

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPatientAllergies(req, res) {
    try {
        const { patient_id } = req.params;

        const result = await pool.query(
            `SELECT * FROM allergy WHERE patient_id = $1`,
            [patient_id]
        );

        res.status(200).json({ data: result.rows[0] || null });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPatientMedications(req, res) {
    try {
        const { patient_id } = req.params;

        const result = await pool.query(
            `SELECT m.*, am.name, am.brand, am.generic_name, mh.condition, v.date, 'Current' AS status
             FROM medicines m
             JOIN all_medicines am ON m.medicine_id = am.medicine_id
             JOIN medical_history mh ON m.history_id = mh.history_id
             JOIN diagnosis d ON mh.history_id = d.history_id
             JOIN visits v ON d.visit_id = v.visit_id
             WHERE m.patient_id = $1

             UNION ALL

             SELECT pm.*, am.name, am.brand, am.generic_name, mh.condition, v.date, 'Past' AS status
             FROM past_medicines pm
             JOIN all_medicines am ON pm.medicine_id = am.medicine_id
             JOIN medical_history mh ON pm.history_id = mh.history_id
             JOIN diagnosis d ON mh.history_id = d.history_id
             JOIN visits v ON d.visit_id = v.visit_id
             WHERE pm.patient_id = $1

             ORDER BY status DESC, date DESC`,
            [patient_id]
        );

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function deletePatientMedications(req, res) {
    try {
        const { patient_id, medicine_id } = req.params;

        const deleteResult = await pool.query(
            `DELETE FROM medicines
             WHERE patient_id = $1
               AND medicine_id = $2`,
            [patient_id, medicine_id]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'No medicine found for this patient with the given medicine_id' });
        }

        res.status(200).json({ message: 'Medicine deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get patient reports from the last X days (default 30)
export async function getPatientReports(patient_id, { sinceDays = 30 } = {}) {
  // Get all test_reports for this patient from the last X days
  const result = await pool.query(
    `SELECT report_id, report_path, patient_id
     FROM test_reports
     WHERE patient_id = $1
       AND report_id IN (
         SELECT report_id FROM test_reports tr
         JOIN visits v ON tr.patient_id = v.patient_id
         WHERE v.patient_id = $1 AND v.date >= NOW() - INTERVAL '${sinceDays} days'
       )
     ORDER BY report_id DESC`,
    [patient_id]
  );
  return result.rows;
}