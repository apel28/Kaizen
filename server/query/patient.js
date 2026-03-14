import pool from "../db.js";
import { getRole } from "./role.js";

export async function getPatientId(userId) {

    if(await getRole(userId) != 'P') return null;

    const result = await pool.query(
        `
        SELECT patient_id
        FROM patient p
        JOIN "user" u
            ON p.user_id = u.user_id
        WHERE u.user_id = $1
        `, [userId]
    );

    return result.rows[0]?.patient_id ?? null;
}

export async function getLatestVitals(patientId) {
    const result = await pool.query(
        `
        SELECT *
        FROM visits
        WHERE patient_id = $1
        ORDER BY "date" desc;
        `, [patientId]
    );

    if (result.rows.length === 0) return null;

    const visitId = result.rows[0].visit_id;

    const vitalsResult = await pool.query(
        `
            SELECT bp, blood_sugar, heart_rate, "height", weight
            FROM vitals
            WHERE visit_id = $1;
        `, [visitId]
    )
    return vitalsResult.rows[0] ?? null;
}