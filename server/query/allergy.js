import pool from "../db.js";

export async function getAllergyInfo(patientId, client = pool) {
    const result = await client.query(
        `
        SELECT patient_id, allergy_trigger, trigger_meds, severity
        FROM allergy
        WHERE patient_id = $1
        ORDER BY allergy_trigger;
        `,
        [patientId]
    );

    return result.rows ?? null;
}

export async function insertAllergyInfo(patientId, allergy, client = pool) {
    const result = await client.query(
        `
        INSERT INTO allergy (patient_id, allergy_trigger, trigger_meds, severity)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [
            patientId,
            allergy.allergy_trigger,
            allergy.trigger_meds || null,
            allergy.severity
        ]
    );

    return result.rows[0] ?? null;
}

export async function deleteAllergyInfo(patientId, allergyTrigger, client = pool) {
    const result = await client.query(
        `
        DELETE FROM allergy
        WHERE patient_id = $1 AND allergy_trigger = $2
        RETURNING *;
        `,
        [patientId, allergyTrigger]
    );

    return result.rows[0] ?? null;
}