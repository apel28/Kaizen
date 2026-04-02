import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet } from "../utils/api";
import { Stethoscope, Clock } from "lucide-react";

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

const PatientConditions = () => {
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/profile")
      .then((profile) => apiGet(`/patient-data/${profile.patient_id}/conditions`))
      .then((res) => setConditions(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-5">
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Stethoscope className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Conditions
            </h2>
            <p className="text-gray-400 mt-1">Your recorded medical conditions across all visits</p>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">{error}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-20 animate-pulse" />
            ))}
          </div>
        ) : conditions.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
            No conditions recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
            {conditions.map((c, i) => <ConditionCard key={i} row={c} />)}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientConditions;

