import pool from "../db.js";
import { getRole } from "./role.js";

export async function getPatientId(userId) {
    const result = await pool.query(
        `SELECT patient_id FROM patient WHERE user_id = $1`,
        [userId]
    );
    return result.rows[0]?.patient_id ?? null;
}

export async function getPatientProfile(userId) {

    if(await getRole(userId) != 'P') return null;

    const result = await pool.query(
        `
        SELECT *
        FROM patient p
        JOIN "user" u
            ON p.user_id = u.user_id
        JOIN profile pf
            ON pf.user_id = u.user_id
        WHERE u.user_id = $1
        `, [userId]
    );

    return result.rows[0] ?? null;
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

export async function updatePatientProfile(userId, profile) {
    const {
        first_name,
        middle_name,
        last_name,
        date_of_birth,
        address,
        contact_info,
        emergency_contact,
        gender,
        nid,
        nationality
    } = profile;

    const result = await pool.query(
        `
        UPDATE profile
        SET first_name = $1,
            middle_name = $2,
            last_name = $3,
            date_of_birth = $4,
            address = $5,
            contact_info = $6,
            emergency_contact = $7,
            gender = $8,
            nid = $9,
            nationality = $10
        WHERE user_id = $11
        RETURNING *;
        `,
        [
            first_name,
            middle_name,
            last_name,
            date_of_birth,
            address,
            contact_info,
            emergency_contact,
            gender,
            nid,
            nationality,
            userId
        ]
    );

    return result.rows[0] ?? null;
}