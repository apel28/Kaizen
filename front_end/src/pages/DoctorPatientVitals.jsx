import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import { apiGet } from "../utils/api";
import { Activity, Heart, Droplets, Scale, Clock, ChevronDown } from "lucide-react";

// ── Vital card ────────────────────────────────────────────────────────────────
const VitalCard = ({ icon: Icon, label, value, unit, color = "text-blue-400" }) => (
  <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-5 flex items-center gap-4">
    <div className={`${color} shrink-0`}><Icon size={24} /></div>
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-lg font-bold text-white">
        {value ?? <span className="text-gray-600 text-sm">—</span>}
        {value && <span className="text-sm text-gray-400 ml-1 font-normal">{unit}</span>}
      </p>
    </div>
  </div>
);

// ── Visit vitals row ──────────────────────────────────────────────────────────
const VisitRow = ({ row }) => {
  const bmi = row.height && row.weight
    ? (row.weight / ((row.height / 100) ** 2)).toFixed(1)
    : null;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 space-y-3">
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <Clock size={13} /> {row.date ? new Date(row.date).toLocaleDateString() : "Unknown date"}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <VitalCard icon={Heart}    label="Blood Pressure" value={row.bp}          unit="mmHg"  color="text-red-400" />
        <VitalCard icon={Activity} label="Heart Rate"     value={row.heart_rate}  unit="bpm"   color="text-pink-400" />
        <VitalCard icon={Droplets} label="Blood Sugar"    value={row.blood_sugar} unit="mg/dL" color="text-blue-400" />
        <VitalCard icon={Scale}    label="BMI"            value={bmi}             unit="kg/m²" color="text-green-400" />
      </div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────
const DoctorPatientVitals = () => {
  const [patients, setPatients]       = useState([]);
  const [selectedId, setSelectedId]   = useState("");
  const [vitals, setVitals]           = useState([]);
  const [loadingP, setLoadingP]       = useState(true);
  const [loadingV, setLoadingV]       = useState(false);
  const [error, setError]             = useState("");

  // Load patient list once
  useEffect(() => {
    apiGet("/patient-data/doctor/patients")
      .then((res) => setPatients(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingP(false));
  }, []);

  // Load vitals when patient changes
  useEffect(() => {
    if (!selectedId) return setVitals([]);
    setLoadingV(true);
    setError("");
    apiGet(`/patient-data/${selectedId}/vitals`)
      .then((res) => setVitals(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingV(false));
  }, [selectedId]);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar idx={3} />

      <main className="flex-1 ml-6 space-y-5">
        {/* Header */}
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Activity className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Patient Vitals
            </h2>
            <p className="text-gray-400 mt-1">Select a patient to view their recorded vitals</p>
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

        {/* Vitals */}
        {selectedId && (
          loadingV ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-36 animate-pulse" />
              ))}
            </div>
          ) : vitals.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
              No vitals recorded for this patient.
            </div>
          ) : (
            <div className="space-y-4 pb-6">
              {vitals.map((v, i) => <VisitRow key={i} row={v} />)}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default DoctorPatientVitals;
