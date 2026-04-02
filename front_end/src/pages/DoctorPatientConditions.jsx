import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import { apiGet } from "../utils/api";
import { Stethoscope, ChevronDown, Clock, Tag } from "lucide-react";

// ── Condition card ─────────────────────────────────────────────────────────────
const ConditionCard = ({ row }) => (
  <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-4 flex flex-col gap-1">
    <div className="flex items-start justify-between gap-2">
      <p className="text-white font-semibold text-sm">{row.condition}</p>
      <span className="shrink-0 text-xs bg-blue-600/20 border border-blue-500/30 text-blue-300 rounded-full px-2 py-0.5">
        {row.department_name}
      </span>
    </div>
    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
      <Clock size={11} />
      {row.date ? new Date(row.date).toLocaleDateString() : "Unknown date"}
    </div>
  </div>
);

// ── Page ─────────────────────────────────────────────────────────────────────
const DoctorPatientConditions = () => {
  const [patients, setPatients]     = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [conditions, setConditions] = useState([]);
  const [loadingP, setLoadingP]     = useState(true);
  const [loadingC, setLoadingC]     = useState(false);
  const [error, setError]           = useState("");

  // Load patient list
  useEffect(() => {
    apiGet("/patient-data/doctor/patients")
      .then((res) => setPatients(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingP(false));
  }, []);

  // Load conditions when patient changes
  useEffect(() => {
    if (!selectedId) return setConditions([]);
    setLoadingC(true);
    setError("");
    apiGet(`/patient-data/${selectedId}/conditions`)
      .then((res) => setConditions(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingC(false));
  }, [selectedId]);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar />

      <main className="flex-1 ml-6 space-y-5">
        {/* Header */}
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Stethoscope className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Patient Conditions
            </h2>
            <p className="text-gray-400 mt-1">Select a patient to view their medical history</p>
          </div>
        </header>

        {/* Patient selector */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6">
          <label className="block text-xs text-gray-400 mb-2">Select Patient</label>
          <div className="relative">
            <select
              className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none transition-all cursor-pointer"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              disabled={loadingP}
            >
              <option value="">— Select a patient —</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.name} (ID: {p.patient_id})
                </option>
              ))}
            </select>
            <ChevronDown size={15} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">{error}</p>
        )}

        {/* Conditions list */}
        {selectedId && (
          loadingC ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-20 animate-pulse" />
              ))}
            </div>
          ) : conditions.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
              No conditions recorded for this patient.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
              {conditions.map((c, i) => <ConditionCard key={i} row={c} />)}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default DoctorPatientConditions;

