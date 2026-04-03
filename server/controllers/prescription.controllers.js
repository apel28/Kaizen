import pool from "../db.js";
import { getDoctorProfile } from "../query/doctor.js";
import { getPatientProfile } from "../query/patient.js";

export async function addPrescription(req, res) {
    if (req.user.role !== 'D') {
        return res.status(403).json({ error: "Only doctors can add prescriptions" });
    }

    const userId = req.user.user_id;
    const doctorProfile = await getDoctorProfile(userId);

    if (!doctorProfile) {
        return res.status(404).json({ error: "Doctor not found" });
    }

    const doctorId = doctorProfile.doctor_id;

    const {
        patient_id,
        conditions, // array of {condition, department_id, status}
        vitals,
        medicines, // global array of {medicine_id}
        tests,
        bill_amount,
        admission,
        note,
        allergy // {allergy_trigger, trigger_meds, severity}
    } = req.body;

    // Check for allergies before proceeding
    const allergyCheck = await pool.query(
        `SELECT * FROM allergy WHERE patient_id = $1`,
        [patient_id]
    );
    const patientAllergy = allergyCheck.rows[0];

    if (patientAllergy && patientAllergy.trigger_meds && medicines && medicines.length > 0) {
        let triggers = [];
        const rawTriggers = patientAllergy.trigger_meds;

        if (Array.isArray(rawTriggers)) {
            triggers = rawTriggers;
        } else if (typeof rawTriggers === 'string') {
            triggers = rawTriggers
                .replace(/^\{|\}$/g, '') // remove Postgres array braces
                .split(',')
                .map(str => str.trim().replace(/^['"]|['"]$/g, ''))
                .filter(Boolean);
        }

        const triggerSet = new Set(triggers.map(t => t.toLowerCase()));

        for (const med of medicines) {
            const medDetails = await pool.query(
                `SELECT name, generic_name FROM all_medicines WHERE medicine_id = $1`,
                [med.medicine_id]
            );
            if (medDetails.rows.length > 0) {
                const medicine = medDetails.rows[0];
                const medNameLower = (medicine.name || '').toLowerCase();
                const medGenericLower = (medicine.generic_name || '').toLowerCase();

                if (triggerSet.has(medNameLower) || triggerSet.has(medGenericLower)) {
                    return res.status(400).json({ error: "Patient has allergy to ${patientAllergy.trigger_meds}. Cannot prescribe this medicine." });
                }
            }
        }
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Add visit
        const visitResult = await client.query(
            `INSERT INTO visits (patient_id, doctor_id, date) VALUES ($1, $2, CURRENT_DATE) RETURNING *`,
            [patient_id, doctorId]
        );
        const visit_id = visitResult.rows[0].visit_id;

        // 2. Add prescription
        await client.query(
            `INSERT INTO prescription (patient_id, visit_id, note) VALUES ($1, $2, $3)`,
            [patient_id, visit_id, note || null]
        );

        // 3. Add vitals (if provided)
        if (vitals) {
            await client.query(
                `INSERT INTO vitals (visit_id, patient_id, bp, blood_sugar, heart_rate, height, weight) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [visit_id, patient_id, vitals.bp || null, vitals.blood_sugar || null, vitals.heart_rate || null, vitals.height || null, vitals.weight || null]
            );
        }

        // 4-7. Add medical_history, diagnosis, treatment_plan, and medicines for each condition
        if (conditions && conditions.length > 0) {
            for (const cond of conditions) {
                // Add medical_history
                const histResult = await client.query(
                    `INSERT INTO medical_history (patient_id, condition, department_id, status) VALUES ($1, $2, $3, $4) RETURNING history_id`,
                    [patient_id, cond.condition, cond.department_id, 'a']
                );
                const history_id = histResult.rows[0].history_id;

                // Add diagnosis
                await client.query(
                    `INSERT INTO diagnosis (history_id, visit_id) VALUES ($1, $2)`,
                    [history_id, visit_id]
                );

                // Add treatment_plan
                await client.query(
                    `INSERT INTO treatment_plan (patient_id, history_id) VALUES ($1, $2)`,
                    [patient_id, history_id]
                );

                // Add medicines (global, added to each history)
                if (medicines && medicines.length > 0) {
                    for (const med of medicines) {
                        await client.query(
                            `INSERT INTO medicines (patient_id, medicine_id, history_id) VALUES ($1, $2, $3)`,
                            [patient_id, med.medicine_id, history_id]
                        );
                    }
                }
            }
        }

        // 8. Add bills
        await client.query(
            `INSERT INTO bills (patient_id, bill_name, bill_amount) VALUES ($1, $2, $3)`,
            [patient_id, 'Visit Fees', bill_amount]
        );

        // 9. Add test_orders (if provided)
        if (tests && tests.length > 0) {
            for (const test of tests) {
                await client.query(
                    `INSERT INTO test_orders (test_id, patient_id, visit_id) VALUES ($1, $2, $3)`,
                    [test.test_id, patient_id, visit_id]
                );
            }
        }

        // 10. If admission
        if (admission) {
            const admission_id = Number(patient_id) + Number(doctorId) + Number(visit_id);

            await client.query(
                `UPDATE visits SET admission_id = $1 WHERE visit_id = $2`,
                [admission_id, visit_id]
            );

            // Add to admit_queue
            if (conditions && conditions.length > 0) {
                await client.query(
                    `INSERT INTO admit_queue (admission_id, date, department_id, priority) VALUES ($1, CURRENT_DATE, $2, $3)`,
                    [admission_id, conditions[0].department_id, 1]  // Using first condition's department, priority 1
                );
            }
        }

        // 11. Insert or update allergy
        if (allergy) {
            await client.query(
                `INSERT INTO allergy (patient_id, allergy_trigger, trigger_meds, severity) 
                 VALUES ($1, $2, $3, $4) 
                 ON CONFLICT (patient_id,trigger_meds) DO UPDATE SET 
                 allergy_trigger = EXCLUDED.allergy_trigger, 
                 trigger_meds = EXCLUDED.trigger_meds, 
                 severity = EXCLUDED.severity`,
                [patient_id, allergy.allergy_trigger, allergy.trigger_meds || null, allergy.severity]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Prescription added successfully', visit_id });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

// Functions for front-end to fetch data for generating prescription

export async function getAllMedicines(req, res) {
    try {
        const result = await pool.query(`SELECT * FROM all_medicines`);
        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getAllTests(req, res) {
    try {
        const result = await pool.query(`SELECT * FROM all_test`);
        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getTodaysPatients(req, res) {
    try {
        if (req.user.role !== 'D') {
            return res.status(403).json({ error: "Only doctors can view patients" });
        }

        const userId = req.user.user_id;
        const doctorProfile = await getDoctorProfile(userId);

        if (!doctorProfile) {
            return res.status(404).json({ error: "Doctor not found" });
        }

        const doctorId = doctorProfile.doctor_id;

        const result = await pool.query(
            `SELECT DISTINCT a.patient_id,
                    p.first_name || ' ' || COALESCE(p.middle_name || ' ', '') || p.last_name AS name
            FROM appointments a
			JOIN patient pf ON a.patient_id = pf.patient_id
            JOIN profile p ON pf.user_id = p.user_id
            WHERE a.doctor_id = $1 AND a.date = CURRENT_DATE`,
            [doctorId]
        );

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function getPrescriptionByVisitId(req, res) {
    try {
        const { visit_id } = req.params;

        // Get visit details
        const visitResult = await pool.query(
            `SELECT * FROM visits WHERE visit_id = $1`,
            [visit_id]
        );

        if (visitResult.rows.length === 0) {
            return res.status(404).json({ error: 'Visit not found' });
        }

        const visit = visitResult.rows[0];
        const { patient_id, doctor_id } = visit;

        // Authorization check
        const userId = req.user.user_id;
        const role = req.user.role;

        if (role === 'D') {
            const doctorProfile = await getDoctorProfile(userId);
            if (!doctorProfile || doctorProfile.doctor_id !== doctor_id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
        } else if (role === 'P') {
            const patientProfile = await getPatientProfile(userId);
            if (!patientProfile || patientProfile.patient_id !== patient_id) {
                return res.status(403).json({ error: 'Unauthorized' });
            }
        } else {
            return res.status(403).json({ error: 'Invalid role' });
        }

        // Get conditions
        const conditionsResult = await pool.query(
            `SELECT mh.condition, mh.department_id, mh.status, d.name as department_name 
             FROM diagnosis diag 
             JOIN medical_history mh ON diag.history_id = mh.history_id 
             JOIN departments d ON mh.department_id = d.department_id 
             WHERE diag.visit_id = $1`,
            [visit_id]
        );

        // Get medicines
        const medicinesResult = await pool.query(
            `SELECT am.* 
             FROM medicines m 
             JOIN all_medicines am ON m.medicine_id = am.medicine_id 
             WHERE m.history_id IN (SELECT history_id FROM diagnosis WHERE visit_id = $1)`,
            [visit_id]
        );

        // Get vitals
        const vitalsResult = await pool.query(
            `SELECT * FROM vitals WHERE visit_id = $1`,
            [visit_id]
        );

        // Get test orders
        const testsResult = await pool.query(
            `SELECT at.* 
             FROM test_orders to 
             JOIN all_test at ON to.test_id = at.test_id 
             WHERE to.visit_id = $1`,
            [visit_id]
        );

        // Get prescription note
        const prescriptionResult = await pool.query(
            `SELECT * FROM prescription WHERE visit_id = $1`,
            [visit_id]
        );

        // Get allergy
        const allergyResult = await pool.query(
            `SELECT * FROM allergy WHERE patient_id = $1`,
            [patient_id]
        );

        const response = {
            visit_id,
            patient_id,
            doctor_id,
            date: visit.date,
            admission_id: visit.admission_id,
            conditions: conditionsResult.rows,
            medicines: medicinesResult.rows,
            vitals: vitalsResult.rows[0] || null,
            test_orders: testsResult.rows,
            prescription_note: prescriptionResult.rows[0]?.note || null,
            allergy: allergyResult.rows[0] || null
        };

        res.status(200).json({ data: response });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export async function getVisits(req, res) {
    try {
        const role = req.user.role;
        const requestedPatientId = req.query.patient_id;
        const requestedDoctorId = req.query.doctor_id;

        let patientId;
        let doctorId;

        if (role === 'P') {
            const patientProfile = await getPatientProfile(req.user.user_id);
            if (!patientProfile) {
                return res.status(404).json({ error: 'Patient profile not found' });
            }
            patientId = patientProfile.patient_id;

            if (requestedPatientId && Number(requestedPatientId) !== Number(patientId)) {
                return res.status(403).json({ error: 'Patient can only access their own visits' });
            }

            doctorId = requestedDoctorId ? Number(requestedDoctorId) : null;

        } else if (role === 'D') {
            const doctorProfile = await getDoctorProfile(req.user.user_id);
            if (!doctorProfile) {
                return res.status(404).json({ error: 'Doctor not found' });
            }
            const myDoctorId = doctorProfile.doctor_id;

            if (!requestedPatientId) {
                return res.status(400).json({ error: 'patient_id required for doctor requests' });
            }

            patientId = Number(requestedPatientId);
            doctorId = requestedDoctorId ? Number(requestedDoctorId) : myDoctorId;

            if (doctorId !== myDoctorId) {
                return res.status(403).json({ error: 'Doctor can only query with their own doctor_id' });
            }

        } else {
            return res.status(403).json({ error: 'Invalid role' });
        }

        let query = `SELECT visit_id, patient_id, doctor_id, date, admission_id FROM visits WHERE patient_id = $1`;
        const params = [patientId];

        if (doctorId) {
            query += ` AND doctor_id = $2`;
            params.push(doctorId);
        }

        query += ` ORDER BY date DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({ data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export async function getDepartments(req, res) {
    try {
        const result = await pool.query(`SELECT department_id, name FROM departments`);
        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
