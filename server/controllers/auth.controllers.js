import pool from "../db.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"; 

export async function authorize(req, res) {
    const {email, password} = req.body;
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

        const hashedToken = await bcrypt.hash(refreshToken, 12);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await pool.query(
            `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) 
            VALUES ($1, $2, $3)`,
            [user.user_id, hashedToken, expiresAt]
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

        res.status(200).json({ message: "Login successful", user_id: user.user_id, role: user.role });


    } catch(error) {
        console.error(error);
        res.status(500).json({
            error:"Server error",
        });
    } 

}
