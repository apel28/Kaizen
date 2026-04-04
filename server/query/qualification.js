import pool from "../db.js";

//NO UPDATE, lagle delete kore abar insert korbe

export async function insertQualifications(doctorId, qualifications, client = pool) {

    const result = await client.query(
        `
        INSERT INTO qualifications (doctor_id, degree_name, institute, "year", department_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
            doctorId,
            qualifications.degree_name,
            qualifications.institute,
            qualifications.year,
            qualifications.department_name
        ]
    );

    return result.rows[0] ?? null;
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

// async function test() {
//     console.log(await insertQualifications(1, {
//         degree_name: 'FCPS',
//         institute: 'DMC',
//         year: '2005',
//         department_name: 'Medicine',
//     }))
// }

// async function test2(params) {
//     console.log(await getQualifications(1));
// }
// await test2()