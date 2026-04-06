import bcrypt from 'bcryptjs';
import pool from "../db.js";

function generatorId() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 9 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
    ).join("");
}

async function checkUserIdAvailable(userID) {
    const result = await pool.query(`SELECT 1 FROM "user" WHERE user_id = $1`, [
        userID,
    ]);
    return result.rows.length === 0;
}

async function genUserIdAdmin() {
    while (true) {
        const userID = "0" + generatorId();
        if (await checkUserIdAvailable(userID)) return userID;
    }
}

async function checkMailExists(email) {
    const result = await pool.query(`SELECT 1 FROM "user" WHERE email = $1`, [
        email,
    ]);
    return result.rows.length !== 0;
}

function getProvidedAdminRegisterSecret(req) {
    const h = req.headers["x-admin-register-secret"];
    if (typeof h === "string" && h.length > 0) return h;
    if (typeof req.body?.secret === "string" && req.body.secret.length > 0) {
        return req.body.secret;
    }
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.slice(7).trim();
    return null;
}

export async function registerAdmin(req, res) {
    try {
        const configured = process.env.ADMIN_REGISTER_SECRET;
        if (!configured || String(configured).trim() === "") {
            return res.status(503).json({
                error: "ADMIN_REGISTER_SECRET is not set in environment",
            });
        }

        if (getProvidedAdminRegisterSecret(req) !== configured) {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { email, password } = req.body || {};
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "email and password are required" });
        }
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ error: "email and password must be strings" });
        }

        if (await checkMailExists(email)) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const user_id = await genUserIdAdmin();
        const hashedPassword = await bcrypt.hash(password, 12);

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            await client.query(
                `INSERT INTO "user" (user_id, "password", email) VALUES ($1, $2, $3)`,
                [user_id, hashedPassword, email]
            );

            await client.query(
                `INSERT INTO role (user_id, role_id) VALUES ($1, $2)`,
                [user_id, 0]
            );

            await client.query('COMMIT');
        } catch (dbErr) {
            await client.query('ROLLBACK');
            throw dbErr;
        } finally {
            client.release();
        }

        res.status(201).json({
            user_id,
            email,
            role_id: 0,
            role: "A",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

export async function executeAdminQuery(req, res) {
    try {
        const raw = req.body?.query ?? req.body?.sql;
        if (raw === undefined || raw === null || typeof raw !== "string") {
            return res.status(400).json({ error: "Body must include a string field `query` or `sql`" });
        }

        const text = raw.trim();
        if (!text) {
            return res.status(400).json({ error: "Query string is empty" });
        }

        const result = await pool.query(text);

        res.status(200).json({
            command: result.command,
            rowCount: result.rowCount,
            rows: result.rows,
            fields: result.fields
                ? result.fields.map((f) => ({
                      name: f.name,
                      dataTypeID: f.dataTypeID,
                  }))
                : [],
        });
    } catch (err) {
        res.status(400).json({
            error: err.message,
            code: err.code,
            detail: err.detail,
            position: err.position,
        });
    }
}
