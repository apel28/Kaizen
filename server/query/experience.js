import pool from '../db.js';

export async function insertExperience(doctorId, experiences) {
    const result = await pool.query(
        `
        INSERT INTO experience (doctor_id, institue, "role", start_date, end_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
            doctorId,
            experiences.institute, 
            experiences.role,
            experiences.start_date,
            experiences.end_date || null
        ]
    );

    return result.rows[0] ?? null; // Return the first row or null
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

export async function deleteExperience(doctorId, e_id) {
    const result = await pool.query(
        `
        DELETE FROM experience
        WHERE doctor_id = $1
          AND e_id = $2
        RETURNING *;
        `,
        [doctorId, e_id]
    );
}

// async function test() {
//     console.log(await insertExperience(2, {
//         institue: 'DMC',
//         role: 'HMO',
//         start_date: '2005-03-23',
//         end_date: null
//     }))
// }

// test()