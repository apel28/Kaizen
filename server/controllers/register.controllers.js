import pool from "../db.js";
import bcrypt from 'bcryptjs';


function generatorId(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 9 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};


async function checkUserId(userID) {
    const result = await pool.query(`
        SELECT * FROM "user" WHERE user_id = $1;
        `, [userID]);
    return result.rows.length == 0;
}

async function genUserId(role) {
    while(true) {
        const userID = role + generatorId();
        const isAvailable = await checkUserId(userID);
        if(!isAvailable) continue;
        return userID; 
    }
}

async function checkMailExists(email) {
    const result = await pool.query(`
        SELECT * FROM "user" WHERE email = $1;
        `, [email]);
    return result.rows.length != 0;
}

async function personExists(nid) {
    const result = await pool.query(`
        SELECT * FROM profile 
        WHERE nid = $1;
        `, [nid]);
    return result.rows.length != 0;
}

export async function register(req, res) {
    const {
        first_name,
        middle_name, // null
        last_name,
        date_of_birth,
        address, //null
        contact_info, 
        emergency_contact, //null
        gender, //null
        nid, 
        nationality, //null
        email, 
        password,
        role
    } = req.body;

    
    if(await checkMailExists(email)) {
        return res.status(409).json({
            error:"Mail exists",
        });
    }
    
    if(await personExists(nid)) {
        return res.status(409).json({
            error:"Person exisits",
        });
    }

    const user_id = await genUserId(role);
    const hashedPassword = await bcrypt.hash(password, 12);

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const queryResultUser = await client.query(`
            INSERT INTO "user"
            VALUES ($1, $2, $3)
            RETURNING *; 
            `, [user_id, hashedPassword, email]);

        const queryResultProfile = await client.query(`
            INSERT INTO profile
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
            `, [user_id, first_name, middle_name, last_name, date_of_birth, address, contact_info, emergency_contact, gender, nid, nationality]);

        const queryResultRole = await client.query(`
            INSERT INTO "role"(user_id, role_id)
            VALUES ($1, $2);
            `, [user_id, role]);

        if (role == 1) {
            await client.query(`
            INSERT INTO "doctor"(user_id)
            VALUES ($1);
            `, [user_id]);
        }

        if (role == 2) {
            await client.query(`
            INSERT INTO "patient"(user_id)
            VALUES ($1);
            `, [user_id]);
        }

        if (role == 3) {
            await client.query(`
            INSERT INTO "nurse"(user_id)
            VALUES ($1);
            `, [user_id]);
        }

        if (role == 4) {
            await client.query(`
            INSERT INTO "staff"(user_id)
            VALUES ($1);
            `, [user_id]);
        }
        

        await client.query('COMMIT');
        
        res.status(201).json({
            result: "ok",
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Register transaction error:", error);
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
}


