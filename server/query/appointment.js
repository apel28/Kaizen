import pool from "../db.js";

export async function insertAppointment(doctorId, patientId, date, slot, queue) {
    const result = await pool.query(
        `
        INSERT INTO appointments (doctor_id, patient_id, "date", slot_time, queue)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [doctorId, patientId, date, slot, queue]
    );

    return result.rows[0] ?? null;
}

export async function getAppointment({ appId = null, doctorId = null, patientId = null } = {}) {
    const clauses = [];
    const params = [];

    if (appId !== null && appId !== undefined) {
        params.push(appId);
        clauses.push(`app_id = $${params.length}`);
    }
    if (doctorId !== null && doctorId !== undefined) {
        params.push(doctorId);
        clauses.push(`doctor_id = $${params.length}`);
    }
    if (patientId !== null && patientId !== undefined) {
        params.push(patientId);
        clauses.push(`patient_id = $${params.length}`);
    }

    if (clauses.length === 0) {
        throw new Error("getAppointment requires at least one of appId, doctorId, or patientId");
    }

    const result = await pool.query(
        `
        SELECT app_id, doctor_id, patient_id, date, slot_time, queue
        FROM appointments
        WHERE ${clauses.join(" AND ")};
        `,
        params
    );

    return result.rows;
}

export async function deleteAppointment(appId) {
    const result = await pool.query(
        `
        DELETE FROM appointments
        WHERE app_id = $1
        RETURNING app_id, doctor_id, patient_id, date, slot_time, queue;
        `,
        [appId]
    );

    return result.rows[0] ?? null;
}
