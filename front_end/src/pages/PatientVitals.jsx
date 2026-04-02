import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet } from "../utils/api";
import { Activity, Heart, Droplets, Scale, Clock } from "lucide-react";

// ── Single vital row card ─────────────────────────────────────────────────────
const VitalCard = ({ icon: Icon, label, value, unit, color = "text-blue-400" }) => (
  <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-5 flex items-center gap-4">
    <div className={`${color} shrink-0`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-lg font-bold text-white">
        {value ?? <span className="text-gray-600 text-sm">—</span>}
        {value && <span className="text-sm text-gray-400 ml-1 font-normal">{unit}</span>}
      </p>
    </div>
  </div>
);

// ── Vitals row (one visit) ────────────────────────────────────────────────────
const VisitRow = ({ row }) => {
  const bmi = row.height && row.weight
    ? (row.weight / ((row.height / 100) ** 2)).toFixed(1)
    : null;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
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
const PatientVitals = () => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // The patient's own ID comes from their session — profile gives us patient_id
    apiGet("/profile")
      .then((profile) => apiGet(`/patient-data/${profile.patient_id}/vitals`))
      .then((res) => setVitals(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar idx={2} />

      <main className="flex-1 ml-6 space-y-5">
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Activity className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Vitals
            </h2>
            <p className="text-gray-400 mt-1">Your recorded vitals across all visits</p>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">{error}</p>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-36 animate-pulse" />
            ))}
          </div>
        ) : vitals.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
            No vitals recorded yet.
          </div>
        ) : (
          <div className="space-y-4 pb-6">
            {vitals.map((v, i) => <VisitRow key={i} row={v} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientVitals;
