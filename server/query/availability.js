import pool from "../db.js"

export async function insertAvailability(doctorId, slot) {
    let result = await pool.query(
        `
        SELECT *
        FROM availability
        WHERE doctor_id = $1 
            AND slot_time = $2;
        `,
        [
            doctorId,
            slot.slot_time
        ]
    );

    if(result.rowCount > 0) {
        await deleteAvailability(result.rows[0].a_id);
    }

    result = await pool.query(
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

export async function deleteAvailability(aId) {
    const result = await pool.query(
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

export async function updateAvailability(doctorId, aId, slot) {
    await deletetAvailability(aId)
    await insertAvailability(doctorId, slot)
}

export async function getAvailability(doctorId, day) {
    const result = await pool.query(
        `
        SELECT * 
        FROM availability
        WHERE doctor_id = $1 and week_day = $2
        ORDER BY slot_time ASC;
        `,
        [
            doctorId, day
        ]
    );

    return result.rows ?? null
}


async function test() {
    await insertAvailability(2, 
        {
            week_day: 'MON',
            slot_time: '17:00',
            slot_duration_minutes: 1
        }
    );
}

test();