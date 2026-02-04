import pool from "../db.js";
import bcrypt from 'bcrypt';


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
        middle_name,
        last_name,
        date_of_birth,
        address,
        contact_info, 
        emergency_contact,
        gender,
        nid, 
        nationality,
        email, 
        password,
        role
    } = req.body;

    
    if(await checkMailExists(email)) {
        return res.json({
            "error":1, 
        })
    }
    
    if(await personExists(nid)) {
        return res.json({
            "error":2,
        })
    }
    
    console.log("Here");

    const user_id = await genUserId(role);
    const hashedPassword = await bcrypt.hash(password, 12);

    console.log(user_id);

    const queryResultUser = await pool.query(`
        INSERT INTO "user"
        VALUES ($1, $2, $3)
        RETURNING *; 
        `,[user_id, hashedPassword, email]);

    const queryResultProfile = await pool.query(`
        INSERT INTO profile
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
        `, [user_id, first_name, middle_name, last_name, date_of_birth, address, contact_info, emergency_contact, gender, nid, nationality]);

    res.json({
        "result":"ok",
    })
}


