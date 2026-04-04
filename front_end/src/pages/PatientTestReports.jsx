import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import { apiGet } from "../utils/api";
import { FileText, Download, Hash, Loader, DollarSign } from "lucide-react";

// ─── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl h-36 animate-pulse" />
);

// ─── Single test report card ───────────────────────────────────────────────────
const ReportCard = ({ report }) => {
  const [downloading, setDownloading] = useState(false);
  const [err, setErr] = useState("");

  const handleDownload = async () => {
    setDownloading(true);
    setErr("");
    try {
      const res = await fetch("http://localhost:5001/api/test-reports/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ report_id: report.report_id }),
      });

      if (!res.ok) {
        let msg = "Failed to download report";
        try {
          const result = await res.json();
          msg = result.error || msg;
        } catch { } // ignore JSON error if not parseable
        throw new Error(msg);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Extract filename from Content-Disposition header if available
      let filename = `report-${report.report_id}.pdf`;
      const disposition = res.headers.get("Content-Disposition");
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = decodeURIComponent(match[1]);
        }
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col gap-3 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-400 shrink-0" />
          <p className="text-white font-semibold text-base">{report.test_name}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="flex items-center gap-1 bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">
          <Hash size={11} /> Report #{report.report_id}
        </span>
        {report.price != null && (
          <span className="flex items-center gap-1 bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
            <DollarSign size={11} className="text-green-400" />
            {Number(report.price).toFixed(2)} BDT
          </span>
        )}
      </div>

      {/* Error */}
      {err && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-700/40 rounded-lg px-3 py-1.5">
          {err}
        </p>
      )}

      {/* Action */}
      <div className="flex justify-end mt-auto pt-1">
        <Button
          onClick={handleDownload}
          disabled={downloading}
          text={
            <span className="flex items-center gap-2">
              {downloading ? <Loader size={14} className="animate-spin" /> : <Download size={14} />}
              {downloading ? "Downloading…" : "Download"}
            </span>
          }
          type="button"
        />
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const PatientTestReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("/test-reports");
      setReports(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-6">
        {/* Header */}
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <FileText className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Lab Reports
            </h2>
            <p className="text-gray-400 mt-1">View and download your latest test results</p>
          </div>
        </header>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
            No test reports found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
            {reports.map((r) => (
              <ReportCard key={r.report_id} report={r} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientTestReports;
