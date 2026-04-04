import pool from '../db.js';

export async function addNotification({ from, user_id, message }, client = pool) {
  return client.query(
    `INSERT INTO notification ("from", user_id, message) VALUES ($1, $2, $3) RETURNING *`,
    [from, user_id, message]
  );
}

export async function getNotifications(user_id, client = pool) {
  const result = await client.query(
    `SELECT * FROM notification WHERE user_id = $1 ORDER BY noti_id DESC`,
    [user_id]
  );
  return result.rows;
}

export async function getNotificationsHandler(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const user_id = req.user.user_id;
    const notifications = await getNotifications(user_id, client);
    await client.query('COMMIT');
    res.status(200).json({ data: notifications });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
}
