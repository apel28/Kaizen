import pool from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


//Checks if the token is valid using jwt.verify
//assigns a new accessToken using refreshToken
//first checks if the refreshToken is valid using jwt.verify
//then checks if the token is in the database and has validity
//a trigger will launch at insertion in refresh tokens to delete expired refresh tokens
//if all ok, will issue a new token
export async function verifyAuth(req, res, next) {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken && !refreshToken) return res.sendStatus(401);

    if (accessToken) {
        try {

            const payload = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.user = { user_id: payload.user_id }; 
            return next(); 

        } catch (err) {

            if (err.name !== "TokenExpiredError") {
                return res.sendStatus(401);
            }

        }
    }

    if (!refreshToken) return res.sendStatus(401);

    try {

        const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const result = await pool.query(
            `SELECT token_hash 
             FROM refresh_tokens 
             WHERE user_id=$1 AND expires_at > NOW()`,
            [payload.user_id]
        );

        if (result.rows.length === 0) return res.sendStatus(401);

        const storedHash = result.rows[0].token_hash;
        const valid = await bcrypt.compare(refreshToken, storedHash);
        if (!valid) return res.sendStatus(401);

        const newAccessToken = jwt.sign(
            { user_id: payload.user_id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
        );

        res.cookie("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 15 * 60 * 1000,
        });

        req.user = { user_id: payload.user_id }; 
        next(); 

    } catch (err) {
        return res.sendStatus(401); 
    }
}

