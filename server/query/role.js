import pool from "../db.js";

export async function getRole(userId) {
    const result = await pool.query(
        `
        SELECT role_id
        FROM role r
        JOIN "user" u
            ON r.user_id = u.user_id
        WHERE u.user_id = $1
        `, [userId]
    );

    if (result.rows.length === 0) return null;

    const role = result.rows[0].role_id;

    if(role == 1) return 'D';
    else if(role == 2) return 'P';
 
}
