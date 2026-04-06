import { createReadStream } from "fs";
import path from "path";
import { stat } from "fs/promises";
import pool from "../db.js";
import { getDoctorId } from "../query/doctor.js";
import { getPatientId } from "../query/patient.js";

async function doctorHasVisitedPatient(doctorId, patientId, client = pool) {
    const r = await client.query(
        `SELECT 1 FROM visits WHERE doctor_id = $1 AND patient_id = $2 LIMIT 1`,
        [doctorId, patientId]
    );
    return r.rows.length > 0;
}

export async function getTestReportsListHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const role = req.user.role;
        if (role !== "P" && role !== "D") {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: "Only patients and doctors can view test reports" });
        }

        if (role === "P") {
            const patientId = await getPatientId(req.user.user_id, client);
            if (!patientId) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: "Patient not found" });
            }

            const result = await client.query(
                `SELECT tr.report_id,
                        tr.patient_id,
                        tr.test_id,
                        tr.report_path,
                        at.test_name,
                        at.price
                 FROM test_reports tr
                 LEFT JOIN all_test at ON at.test_id = tr.test_id
                 WHERE tr.patient_id = $1
                 ORDER BY tr.report_id DESC`,
                [patientId]
            );

            await client.query('COMMIT');
            return res.status(200).json({ data: result.rows });
        }

        const doctorId = await getDoctorId(req.user.user_id, client);
        if (!doctorId) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Doctor not found" });
        }

        const filterPatientRaw = req.body?.patient_id || req.query?.patient_id;
        if (filterPatientRaw !== undefined && filterPatientRaw !== null && String(filterPatientRaw).trim() !== "") {
            const filterPatientId = Number(filterPatientRaw);
            if (!Number.isInteger(filterPatientId) || filterPatientId < 1) {
                await client.query('ROLLBACK');
                return res.status(400).json({ error: "Invalid patient_id" });
            }
            const ok = await doctorHasVisitedPatient(doctorId, filterPatientId, client);
            if (!ok) {
                await client.query('ROLLBACK');
                return res.status(403).json({ error: "You do not have visits with this patient" });
            }

            const result = await client.query(
                `SELECT tr.report_id,
                        tr.patient_id,
                        tr.test_id,
                        tr.report_path,
                        at.test_name,
                        at.price
                 FROM test_reports tr
                 LEFT JOIN all_test at ON at.test_id = tr.test_id
                 WHERE tr.patient_id = $1
                 ORDER BY tr.report_id DESC`,
                [filterPatientId]
            );
            await client.query('COMMIT');
            return res.status(200).json({ data: result.rows });
        }

        const result = await client.query(
            `SELECT tr.report_id,
                    tr.patient_id,
                    tr.test_id,
                    tr.report_path,
                    at.test_name,
                    at.price
             FROM test_reports tr
             LEFT JOIN all_test at ON at.test_id = tr.test_id
             WHERE tr.patient_id IN (
                 SELECT DISTINCT patient_id FROM visits WHERE doctor_id = $1
             )
             ORDER BY tr.report_id DESC`,
            [doctorId]
        );

        await client.query('COMMIT');
        res.status(200).json({ data: result.rows });
    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

function resolveReportPath(storedPath) {
    if (!storedPath || typeof storedPath !== "string") return null;
    const trimmed = storedPath.trim();
    if (!trimmed) return null;
    if (path.isAbsolute(trimmed)) return path.normalize(trimmed);
    const base = process.env.REPORTS_DIR || path.join(process.cwd(), "reports");
    return path.normalize(path.join(base, trimmed));
}


export async function getTestReportFileHandler(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const role = req.user.role;
        if (role !== "P" && role !== "D") {
            await client.query('ROLLBACK');
            return res.status(403).json({ error: "Only patients and doctors can download test reports" });
        }

        const reportIdRaw = req.body?.report_id;
        const report_id = Number(reportIdRaw);
        if (!Number.isInteger(report_id) || report_id < 1) {
            await client.query('ROLLBACK');
            return res.status(400).json({ error: "Valid report_id is required" });
        }

        const rowResult = await client.query(
            `SELECT report_path, patient_id
             FROM test_reports
             WHERE report_id = $1`,
            [report_id]
        );

        if (rowResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Report not found" });
        }

        const { report_path: reportPath, patient_id: reportPatientId } = rowResult.rows[0];

        if (role === "P") {
            const patientId = await getPatientId(req.user.user_id, client);
            if (!patientId) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: "Patient not found" });
            }
            if (reportPatientId !== patientId) {
                await client.query('ROLLBACK');
                return res.status(403).json({ error: "Unauthorized" });
            }
        } else {
            const doctorId = await getDoctorId(req.user.user_id, client);
            if (!doctorId) {
                await client.query('ROLLBACK');
                return res.status(404).json({ error: "Doctor not found" });
            }
            const ok = await doctorHasVisitedPatient(doctorId, reportPatientId, client);
            if (!ok) {
                await client.query('ROLLBACK');
                return res.status(403).json({ error: "You do not have visits with this patient" });
            }
        }

        const absPath = resolveReportPath(reportPath);

        if (!absPath) {
            await client.query('ROLLBACK');
            return res.status(500).json({ error: "Invalid stored report path" });
        }

        let st;
        try {
            st = await stat(absPath);
        } catch {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Report file not found on server" });
        }

        if (!st.isFile()) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: "Report path is not a file" });
        }

        await client.query('COMMIT');

        const filename = path.basename(absPath) || `report-${report_id}.pdf`;
        const ext = path.extname(filename).toLowerCase();
        let mimeType = "application/pdf";
        if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
        else if (ext === ".png") mimeType = "image/png";
        else if (ext === ".gif") mimeType = "image/gif";
        else if (ext === ".webp") mimeType = "image/webp";

        res.setHeader("Content-Type", mimeType);
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(filename)}"`);

        const stream = createReadStream(absPath);
        stream.on("error", () => {
            if (!res.headersSent) res.status(500).json({ error: "Failed to read report" });
        });
        stream.pipe(res);
    } catch (err) {
        await client.query('ROLLBACK');
        if (!res.headersSent) res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}
