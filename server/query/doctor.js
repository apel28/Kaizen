import pool from "../db.js";

export async function getDoctorId(userId) {
    const result = await pool.query(
        `
        SELECT doctor_id
        FROM doctor d
        JOIN "user" u
            ON d.user_id = u.user_id
        WHERE u.user_id = $1
        `, [userId]
    );

    return result.rows[0]?.doctor_id ?? null;
}

export async function insertExperience(doctorId, experiences) {
    if (!Array.isArray(experiences)) experiences = [experiences];
    if (experiences.length === 0) return [];

    const values = [];
    const params = [];
    let idx = 1;

    for (const exp of experiences) {
        values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
        params.push(
            doctorId,
            exp.institue,
            exp.role,
            exp.start_date,
            exp.end_date
        );
    }

    const result = await pool.query(
        `
        INSERT INTO experience (doctor_id, institue, "role", start_date, end_date)
        VALUES ${values.join(", ")}
        RETURNING *;
        `,
        params
    );

    return result.rows;
}

export async function getExperience(doctorId) {
    const result = await pool.query(
        `
        SELECT e_id, institue, "role", start_date, end_date
        FROM experience
        WHERE doctor_id = $1
        ORDER BY start_date DESC;
        `,
        [doctorId]
    );

    return result.rows ?? null;
}

export async function updateExperience(doctorId, experienceId, updates) {
    const allowed = ["institue", "role", "start_date", "end_date"];
    const fields = [];
    const params = [];
    let idx = 1;

    for (const key of allowed) {
        if (updates[key] !== undefined) {
            fields.push(`\"${key}\" = $${idx++}`);
            params.push(updates[key]);
        }
    }

    if (fields.length === 0) return null;

    params.push(doctorId, experienceId);

    const result = await pool.query(
        `
        UPDATE experience
        SET ${fields.join(", ")}
        WHERE doctor_id = $${idx++}
          AND e_id = $${idx}
        RETURNING *;
        `,
        params
    );

    return result.rows[0] ?? null;
}

export async function updateDoctorProfile(userId, profile) {
    const allowed = [
        "first_name",
        "middle_name",
        "last_name",
        "date_of_birth",
        "address",
        "contact_info",
        "emergency_contact",
        "gender",
        "nid",
        "nationality"
    ];

    const fields = [];
    const params = [];
    let idx = 1;

    for (const key of allowed) {
        if (profile[key] !== undefined) {
            fields.push(`${key} = $${idx++}`);
            params.push(profile[key]);
        }
    }

    if (fields.length === 0) return null;

    params.push(userId);

    const result = await pool.query(
        `
        UPDATE profile
        SET ${fields.join(",\n            ")}
        WHERE user_id = $${idx}
        RETURNING *;
        `,
        params
    );

    return result.rows[0] ?? null;
}

export async function getDepartments() {
    const result = await pool.query(
        `
        SELECT department_id, name
        FROM departments;
        `
    );

    return result.rows ?? null;
}

export async function getDoctorsByDepartment(departmentId) {
    const result = await pool.query(
        `
        SELECT d.doctor_id, (p.first_name || ' ' ||COALESCE(p.middle_name || ' ', '') || p.last_name) as name
        FROM doctor d
        JOIN qualifications q
            ON d.doctor_id = q.doctor_id
        JOIN "user" u
            ON u.user_id = d.user_id
        JOIN profile p
            ON p.user_id = u.user_id
        JOIN departments dp
            ON UPPER(dp."name") = UPPER(q.department_name)
        WHERE dp.department_id = $1
        ORDER BY "name";
        `, [departmentId]
    );

    return result.rows ?? null;
}

export async function getAvailability(doctorId) {
    const result = await pool.query(
        `
        SELECT slot_time, slot_duration_minutes
        FROM availability
        WHERE doctor_id = $1
        ORDER BY week_day ASC;
        `, [doctorId]
    );

    return result.rows ?? null;
}