import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import { apiGet, API_BASE_URL } from "../utils/api";
import { FileText, Download, Hash, Loader, DollarSign } from "lucide-react";


const SkeletonCard = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl h-36 animate-pulse" />
);


const ReportCard = ({ report }) => {
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [err, setErr] = useState("");

  const handleView = async () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
      setMediaUrl(null);
      setMediaType(null);
      return;
    }

    setLoadingMedia(true);
    setErr("");
    try {
      const res = await fetch(`${API_BASE_URL}/test-reports/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ report_id: report.report_id }),
      });

      if (!res.ok) {
        let msg = "Failed to load report";
        try {
          const result = await res.json();
          msg = result.error || msg;
        } catch { }
        throw new Error(msg);
      }

      const blob = await res.blob();
      setMediaType(blob.type);
      setMediaUrl(window.URL.createObjectURL(blob));
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoadingMedia(false);
    }
  };

  const isImage = mediaType?.startsWith("image/");

  return (
    <div className={`bg-gray-900/50 border border-gray-700 hover:border-blue-500/50 rounded-2xl p-5 flex flex-col gap-3 transition-all ${mediaUrl ? 'col-span-1 sm:col-span-2 lg:col-span-3' : ''}`}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-blue-400 shrink-0" />
          <p className="text-white font-semibold text-lg">{report.test_name}</p>
        </div>
      </div>


      <div className="flex flex-wrap gap-3 text-sm mt-1">
        <div className="bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700 font-medium text-gray-300 flex items-center gap-2">
          <Hash size={14} className="text-gray-500" />
          <span>Report ID: <span className="text-white">{report.report_id}</span></span>
        </div>
        {report.price != null && (
          <div className="bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-700 font-medium text-gray-300 flex items-center gap-2">
            <DollarSign size={14} className="text-green-500" />
            <span>Cost: <span className="text-white">{Number(report.price).toFixed(2)} BDT</span></span>
          </div>
        )}
      </div>


      {err && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-700/40 rounded-lg px-3 py-1.5 mt-2">
          {err}
        </p>
      )}


      {mediaUrl && (
        <div className="mt-4 rounded-xl overflow-hidden border border-gray-700 bg-black/50 p-2 flex justify-center items-center flex-col gap-2">
           {isImage ? (
              <img src={mediaUrl} alt={report.test_name} className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg" />
           ) : (
              <iframe src={mediaUrl} title={report.test_name} className="w-full h-[70vh] rounded-lg shadow-lg bg-white" />
           )}
        </div>
      )}


      <div className="flex justify-end mt-4 pt-4 border-t border-gray-800">
        <Button
          onClick={handleView}
          disabled={loadingMedia}
          text={
            <span className="flex items-center gap-2">
              {loadingMedia ? <Loader size={14} className="animate-spin" /> : (mediaUrl ? <FileText size={14} /> : <Download size={14} />)}
              {loadingMedia ? "Loading…" : (mediaUrl ? "Close Report" : "View Report")}
            </span>
          }
          type="button"
        />
      </div>
    </div>
  );
};


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

        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <FileText className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Lab Reports
            </h2>
            <p className="text-gray-400 mt-1">View and download your latest test results</p>
          </div>
        </header>


        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">
            {error}
          </p>
        )}


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
