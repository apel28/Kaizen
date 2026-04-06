import pool from './server/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import { getRole } from "./server/query/role.js";

const email = "s@a.c";
const password = "Password123!";
const ipaddress = "127.0.0.1";

async function testAuthorize() {
  try {
    const queryResult = await pool.query(`SELECT * FROM "user" WHERE email = $1;`, [email]);
    if(queryResult.rows.length == 0) {
      console.log("Unauthorized: user not found");
      process.exit();
    }
    const user = queryResult.rows[0];
    const authorize = await bcrypt.compare(password, user.password);
    if(authorize == false) {
      console.log("Unauthorized: invalid password");
      process.exit();
    }
    
    console.log("User authorized, testing JWT and refresh insertion...");
    
    // simulate JWT (will fail if process.env.JWT_SECRET is missing locally, but works if it's in .env)
    const accessToken = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET || 'fallback-secret', // simulate valid so we can pass
      { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
    );
    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
    );

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const hashedToken = await bcrypt.hash(refreshToken, 12);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      console.log("Inserting refresh token...");
      await client.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ipaddress) VALUES ($1, $2, $3, $4)`,
        [user.user_id, hashedToken, expiresAt, ipaddress]
      );
      
      const role = await getRole(user.user_id, client);
      console.log("Role retrieved:", role);
      
      await client.query('ROLLBACK'); // rollback so we don't pollute
      console.log("All DB tasks succeeded!");
    } catch (e) {
      console.error("Crash during DB transaction:", e.message);
    } finally {
      client.release();
    }
  } catch(error) {
    console.error("Crashed generally:", error.message);
  }
}

testAuthorize();
