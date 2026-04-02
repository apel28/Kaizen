import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet } from "../utils/api";
import { Pill, Clock } from "lucide-react";

const MedicationCard = ({ row }) => {
  const isCurrent = row.status === "Current";
  
  return (
    <div className={`border rounded-2xl p-4 flex flex-col gap-1 ${isCurrent ? 'bg-blue-900/10 border-blue-700/50' : 'bg-gray-900/60 border-gray-700'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-white font-semibold text-lg">{row.name}</p>
        <span className={`shrink-0 text-xs rounded-full px-2 py-0.5 border ${
          isCurrent ? 'bg-green-600/20 border-green-500/30 text-green-400' : 'bg-gray-600/20 border-gray-500/30 text-gray-400'
        }`}>
          {row.status}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 font-medium">{row.generic_name} • {row.brand}</p>
      
      <div className="flex items-center gap-2 text-xs mt-2">
        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded">
          For: {row.condition}
        </span>
        <span className="flex items-center gap-1 text-gray-500">
          <Clock size={12} />
          {row.date ? new Date(row.date).toLocaleDateString() : "Unknown date"}
        </span>
      </div>
    </div>
  );
};

const PatientMedications = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/profile")
      .then((profile) => apiGet(`/patient-data/${profile.patient_id}/medications`))
      .then((res) => setMedications(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-5">
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Pill className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Medications
            </h2>
            <p className="text-gray-400 mt-1">Your current and past medications log</p>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">{error}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : medications.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
            No medications recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
            {medications.map((m, i) => <MedicationCard key={`${m.medicine_id}-${i}`} row={m} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientMedications;
