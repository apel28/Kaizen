import pool from "../db.js";

export async function getDoctorId(userId, client = pool) {
    const result = await client.query(
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

export async function getDoctorProfile(userId, client = pool) {
    const result = await client.query(
        `
        SELECT d.doctor_id,
               pf.*,
               (pf.first_name || ' ' || COALESCE(pf.middle_name || ' ', '') || pf.last_name) AS doctor_name
        FROM doctor d
        JOIN "user" u ON d.user_id = u.user_id
        JOIN profile pf ON u.user_id = pf.user_id
        WHERE u.user_id = $1
        `,
        [userId]
    );

    return result.rows[0] ?? null;
}

export async function insertQualifications(doctorId, qualifications, client = pool) {
    if (!Array.isArray(qualifications)) qualifications = [qualifications];
    if (qualifications.length === 0) return [];

    const values = [];
    const params = [];
    let idx = 1;

    for (const q of qualifications) {
        values.push(`($${idx++}, $${idx++}, $${idx++}, $${idx++}, $${idx++})`);
        params.push(
            doctorId,
            q.degree_name,
            q.institute,
            q.year,
            q.department_name
        );
    }

    const result = await client.query(
        `
        INSERT INTO qualifications (doctor_id, degree_name, institute, "year", department_name)
        VALUES ${values.join(", ")}
        RETURNING *;
        `,
        params
    );

    return result.rows;
}

export async function getQualifications(doctorId, client = pool) {
    const result = await client.query(
        `
        SELECT q_id, degree_name, institute, "year", department_name
        FROM qualifications
        WHERE doctor_id = $1
        ORDER BY "year" DESC;
        `,
        [doctorId]
    );

    return result.rows ?? null;
}

export async function deleteQualification(doctorId, qualificationId, client = pool) {
    const result = await client.query(
        `
        DELETE FROM qualifications
        WHERE doctor_id = $1
          AND q_id = $2
        RETURNING *;
        `,
        [doctorId, qualificationId]
    );

    return result.rows[0] ?? null;
}

export async function deleteQualifications(doctorId, qualificationId, client = pool) {
    return deleteQualification(doctorId, qualificationId, client);
}

export async function insertExperience(doctorId, experiences, client = pool) {
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

    const result = await client.query(
        `
        INSERT INTO experience (doctor_id, institue, "role", start_date, end_date)
        VALUES ${values.join(", ")}
        RETURNING *;
        `,
        params
    );

    return result.rows;
}

export async function getExperience(doctorId, client = pool) {
    const result = await client.query(
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

export async function updateExperience(doctorId, experienceId, updates, client = pool) {
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

    const result = await client.query(
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

export async function updateDoctorProfile(userId, profile, client = pool) {
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

    const result = await client.query(
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

export async function getDepartments(client = pool) {
    const result = await client.query(
        `
        SELECT department_id, name
        FROM departments;
        `
    );

    return result.rows ?? null;
}

export async function getDoctorsByDepartment(departmentId, client = pool) {
    const result = await client.query(
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

export async function getAvailability(doctorId, client = pool) {
    const result = await client.query(
        `
        SELECT slot_time, slot_duration_minutes
        FROM availability
        WHERE doctor_id = $1
        ORDER BY week_day ASC;
        `, [doctorId]
    );

    return result.rows ?? null;
}

export async function searchDoctors(searchString, client = pool) {
    const result = await client.query(
        `
        SELECT DISTINCT d.doctor_id,
               (p.first_name || ' ' || COALESCE(p.middle_name || ' ', '') || p.last_name) AS name
        FROM doctor d
        JOIN "user" u ON d.user_id = u.user_id
        JOIN profile p ON u.user_id = p.user_id
        WHERE (p.first_name || ' ' || COALESCE(p.middle_name || ' ', '') || p.last_name) ILIKE $1
        ORDER BY name ASC;
        `,
        [`%${searchString}%`]
    );
    return result.rows ?? null;
}
