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

export async function getAppointmentCountByDoctorDateTime(doctorId, date, slotTime) {
    const result = await pool.query(
        `
        SELECT COUNT(*) AS count
        FROM appointments
        WHERE doctor_id = $1 AND date = $2 AND slot_time = $3;
        `,
        [doctorId, date, slotTime]
    );

    return parseInt(result.rows[0].count, 10);
}

export async function getAppointmentsByPatient(patientId) {
    const result = await pool.query(
        `
        SELECT a.app_id, a.date, a.slot_time, a.queue,
               (p.first_name || ' ' || COALESCE(p.middle_name || ' ', '') || p.last_name) AS doctor_name
        FROM appointments a
        JOIN doctor d ON a.doctor_id = d.doctor_id
        JOIN "user" u ON d.user_id = u.user_id
        JOIN profile p ON u.user_id = p.user_id
        WHERE a.patient_id = $1
        ORDER BY a.date ASC, a.slot_time ASC;
        `,
        [patientId]
    );
    return result.rows;
}

export async function getAppointmentsByDoctorForDate(doctorId, date) {
    const result = await pool.query(
        `
        SELECT a.app_id, a.date, a.slot_time, a.queue,
               (p.first_name || ' ' || COALESCE(p.middle_name || ' ', '') || p.last_name) AS patient_name
        FROM appointments a
        JOIN patient pt ON a.patient_id = pt.patient_id
        JOIN "user" u ON pt.user_id = u.user_id
        JOIN profile p ON u.user_id = p.user_id
        WHERE a.doctor_id = $1 AND a.date = $2
        ORDER BY a.slot_time ASC;
        `,
        [doctorId, date]
    );
    return result.rows;
}
