import pool from "../db.js";
import { getPatientId } from "../query/patient.js";

// Patient presses "Order Now":
// - Frontend already shows which tests to do from `test_orders`
// - We insert into `test_order` using (test_id, patient_id)
// - Schema note: `test_order` requires `priority`, so we default it to 1 (or use request priority if provided).
export async function getTestsToDoHandler(req, res) {
    try {
        if (req.user.role !== 'P') {
            return res.status(403).json({ error: "Only patients can view test orders" });
        }

        const patientId = await getPatientId(req.user.user_id);
        if (!patientId) return res.status(404).json({ error: "Patient not found" });

        const result = await pool.query(
            `SELECT
                tor.order_id,
                tor.test_id,
                at.test_name,
                at.price,
                tor.visit_id,
                v.doctor_id
            FROM test_orders tor
            JOIN all_test at ON at.test_id = tor.test_id
            JOIN visits v ON v.visit_id = tor.visit_id
            WHERE tor.patient_id = $1
            ORDER BY tor.visit_id DESC, tor.order_id ASC;`,
            [patientId]
        );

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export async function orderNowHandler(req, res) {
    try {
        if (req.user.role !== 'P') {
            return res.status(403).json({ error: "Only patients can order tests" });
        }

        const { test_id, visit_id, order_id } = req.body;
        const priority = req.body.priority ?? 1;

        if (!test_id || !visit_id) {
            return res.status(400).json({ error: "test_id and visit_id are required" });
        }

        const patientId = await getPatientId(req.user.user_id);
        if (!patientId) return res.status(404).json({ error: "Patient not found" });

        // Ensure this test is actually assigned to this patient via test_orders.
        const assigned = await pool.query(
            `SELECT 1
             FROM test_orders
             WHERE patient_id = $1 AND test_id = $2 AND visit_id = $3`,
            [patientId, test_id, visit_id]
        );

        if (assigned.rows.length === 0) {
            return res.status(404).json({ error: "Test not found in your assigned orders" });
        }

        const inserted = await pool.query(
            `INSERT INTO test_order (test_id, patient_id, priority)
             VALUES ($1, $2, $3)
             RETURNING t_id, test_id, patient_id, priority;`,
            [test_id, patientId, priority]
        );

        const deleted = await pool.query(
            `
            DELETE FROM test_orders
            WHERE order_id = $1;`
            ,[order_id]
        );

        res.status(201).json({ data: inserted.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

