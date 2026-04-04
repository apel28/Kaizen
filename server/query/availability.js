import pool from "../db.js"

export async function insertAvailability(doctorId, slot, client = pool) {
    const result = await client.query(
        `
        INSERT INTO availability(doctor_id, week_day, slot_time, slot_duration_minutes)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,[
            doctorId,
            slot.week_day,
            slot.slot_time,
            slot.slot_duration_minutes
        ]
    );

    return result.rows ?? null;
}

export async function deleteAvailability(aId, client = pool) {
    const result = await client.query(
        `
        DELETE from availability
        where a_id = $1
        RETURNING *;
        `,[
            aId
        ]
    );

    return result.rows ?? null;
}

export async function getAvailability(doctorId, weekDay = null, client = pool) {
    let queryStr = `
        SELECT * 
        FROM availability
        WHERE doctor_id = $1
    `;
    const params = [doctorId];

    if (weekDay) {
        queryStr += ` AND week_day = $2`;
        params.push(weekDay);
    }

    const result = await client.query(queryStr, params);

    return result.rows ?? null;
}

// async function test() {
//     await insertAvailability(2, 
//         {
//             week_day: 'MON',
//             slot_time: '16:00',
//             slot_duration_minutes: 3
//         }
//     );
// }

// test();