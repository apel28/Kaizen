import { createReadStream } from "fs";
import path from "path";
import { stat } from "fs/promises";
import pool from "../db.js";
import { getDoctorId } from "../query/doctor.js";
import { getPatientId } from "../query/patient.js";

async function doctorHasVisitedPatient(doctorId, patientId) {
    const r = await pool.query(
        `SELECT 1 FROM visits WHERE doctor_id = $1 AND patient_id = $2 LIMIT 1`,
        [doctorId, patientId]
    );
    return r.rows.length > 0;
}

/**
 * Lists every report row with its test name (join `all_test` on `test_id`).
 * Patients: their own reports only (body unused).
 * Doctors: optional `req.body.patient_id` — if set, filter to that patient (must have a visit with this doctor); if omitted, all reports for patients seen in `visits`.
 */
export async function getTestReportsListHandler(req, res) {
    try {
        const role = req.user.role;
        if (role !== "P" && role !== "D") {
            return res.status(403).json({ error: "Only patients and doctors can view test reports" });
        }

        if (role === "P") {
            const patientId = await getPatientId(req.user.user_id);
            if (!patientId) return res.status(404).json({ error: "Patient not found" });

            const result = await pool.query(
                `SELECT tr.report_id,
                        tr.patient_id,
                        tr.test_id,
                        at.test_name,
                        at.price
                 FROM test_reports tr
                 LEFT JOIN all_test at ON at.test_id = tr.test_id
                 WHERE tr.patient_id = $1
                 ORDER BY tr.report_id DESC`,
                [patientId]
            );

            return res.status(200).json({ data: result.rows });
        }

        const doctorId = await getDoctorId(req.user.user_id);
        if (!doctorId) return res.status(404).json({ error: "Doctor not found" });

        const filterPatientRaw = req.body?.patient_id;
        if (filterPatientRaw !== undefined && filterPatientRaw !== null && String(filterPatientRaw).trim() !== "") {
            const filterPatientId = Number(filterPatientRaw);
            if (!Number.isInteger(filterPatientId) || filterPatientId < 1) {
                return res.status(400).json({ error: "Invalid patient_id" });
            }
            const ok = await doctorHasVisitedPatient(doctorId, filterPatientId);
            if (!ok) {
                return res.status(403).json({ error: "You do not have visits with this patient" });
            }

            const result = await pool.query(
                `SELECT tr.report_id,
                        tr.patient_id,
                        tr.test_id,
                        at.test_name,
                        at.price
                 FROM test_reports tr
                 LEFT JOIN all_test at ON at.test_id = tr.test_id
                 WHERE tr.patient_id = $1
                 ORDER BY tr.report_id DESC`,
                [filterPatientId]
            );
            return res.status(200).json({ data: result.rows });
        }

        const result = await pool.query(
            `SELECT tr.report_id,
                    tr.patient_id,
                    tr.test_id,
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

        res.status(200).json({ data: result.rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

/**
 * Expects `req.body.report_id`. Streams the PDF at `report_path`.
 * Patients: only their own reports.
 * Doctors: report’s patient must appear in `visits` with this doctor at least once.
 */
export async function getTestReportPdfHandler(req, res) {
    try {
        const role = req.user.role;
        if (role !== "P" && role !== "D") {
            return res.status(403).json({ error: "Only patients and doctors can download test reports" });
        }

        const reportIdRaw = req.body?.report_id;
        const report_id = Number(reportIdRaw);
        if (!Number.isInteger(report_id) || report_id < 1) {
            return res.status(400).json({ error: "Valid report_id is required" });
        }

        const rowResult = await pool.query(
            `SELECT report_path, patient_id
             FROM test_reports
             WHERE report_id = $1`,
            [report_id]
        );

        if (rowResult.rows.length === 0) {
            return res.status(404).json({ error: "Report not found" });
        }

        const { report_path: reportPath, patient_id: reportPatientId } = rowResult.rows[0];

        if (role === "P") {
            const patientId = await getPatientId(req.user.user_id);
            if (!patientId) return res.status(404).json({ error: "Patient not found" });
            if (reportPatientId !== patientId) {
                return res.status(403).json({ error: "Unauthorized" });
            }
        } else {
            const doctorId = await getDoctorId(req.user.user_id);
            if (!doctorId) return res.status(404).json({ error: "Doctor not found" });
            const ok = await doctorHasVisitedPatient(doctorId, reportPatientId);
            if (!ok) {
                return res.status(403).json({ error: "You do not have visits with this patient" });
            }
        }

        const absPath = resolveReportPath(reportPath);

        if (!absPath) {
            return res.status(500).json({ error: "Invalid stored report path" });
        }

        let st;
        try {
            st = await stat(absPath);
        } catch {
            return res.status(404).json({ error: "Report file not found on server" });
        }

        if (!st.isFile()) {
            return res.status(404).json({ error: "Report path is not a file" });
        }

        const filename = path.basename(absPath) || `report-${report_id}.pdf`;

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(filename)}"`);

        const stream = createReadStream(absPath);
        stream.on("error", () => {
            if (!res.headersSent) res.status(500).json({ error: "Failed to read report" });
        });
        stream.pipe(res);
    } catch (err) {
        if (!res.headersSent) res.status(500).json({ error: err.message });
    }
}
