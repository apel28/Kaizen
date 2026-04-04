import pool from "../db.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { getRole } from "../query/role.js";

export async function authorize(req, res) {

    const {email, password} = req.body;
    const ipaddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress; //*write how this works*
    try {

        const queryResult = await pool.query(`
            SELECT *
            FROM "user"
            WHERE email = $1;
            `, [email]);
        if(queryResult.rows.length == 0) {
            res.status(401).json({
                error:"Unauthorized",
            });
            return;
        }
        const hashedPassword = queryResult.rows[0].password;
        const authorize = await bcrypt.compare(password, hashedPassword);
        if(authorize == false) {
            res.status(401).json({
                error:"Unauthorized",
            });
            return;
        }

        const user = queryResult.rows[0];

        const accessToken = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
        );

        const refreshToken = jwt.sign(
            { user_id: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d" }
        );

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const hashedToken = await bcrypt.hash(refreshToken, 12);
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

            await client.query(
                `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ipaddress) 
                VALUES ($1, $2, $3, $4)`,
                [user.user_id, hashedToken, expiresAt, ipaddress]
            );

            res.cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 15 * 60 * 1000, 
            });

            res.cookie("refresh_token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "Strict",
                maxAge: 7 * 24 * 60 * 60 * 1000, 
            });
            
            const role = await getRole(user.user_id, client);
            
            await client.query('COMMIT');

            res.locals.user_id = user.user_id
            res.locals.role = role
            
            res.status(200).json({ message: "Login successful", user_id: user.user_id, role });
        } catch (dbErr) {
            await client.query('ROLLBACK');
            throw dbErr;
        } finally {
            client.release();
        }

    } catch(error) {
        console.error(error);
        res.status(500).json({
            error:"Server error",
        });
    } 

}
