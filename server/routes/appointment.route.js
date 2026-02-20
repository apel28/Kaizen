import pool from "../db";

export async function getDepartments(req, res) {
    const result = await pool.query(`
        SELECT *
        FROM departments;
        `);
    res.json(result.rows);
}

export async function getDoctors(req, res) {
    const {department_id} = req.body;

    const result = await pool.query(`
        SELECT distinct d.*
        FROM doctor d
        JOIN doctor_departments dd
            ON d.doctor_id = dd.doctor_id
        WHERE dd.department_id = $1;
        `, [department_id]);

    res.json(result.rows);
}

export async function getAvailability(req, res) {
    const {doctor_id} = req.body;

    const result = await pool.query(`

        WITH next_7_days AS (
        SELECT
            (CURRENT_DATE + i) AS date,
            to_char(CURRENT_DATE + i, 'DY') AS week_day
        FROM generate_series(0, 6) AS i
        ),

        doctor_slots AS (
        SELECT
            d.date,
            d.week_day,
            a.slot_time,
            a.slot_duration_minutes
        FROM next_7_days d
        JOIN availability a
            ON a.week_day = d.week_day
        WHERE a.doctor_id = $1
        )

        SELECT
        ds.date,
        ds.week_day,
        ds.slot_time,
        ds.slot_duration_minutes,
        CASE 
            WHEN ap.app_id IS NULL THEN false
            ELSE true
        END AS booked
        FROM doctor_slots ds
        LEFT JOIN appointments ap
        ON ap.doctor_id = $1
        AND ap.date = ds.date
        AND ap.slot_time = ds.slot_time
        ORDER BY ds.date, ds.slot_time;
        
        `)
}