import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet } from "../utils/api";
import { AlertTriangle } from "lucide-react";

const SEVERITY_COLOR = {
  Mild:     "text-yellow-400 bg-yellow-900/20 border-yellow-700/50",
  Moderate: "text-orange-400 bg-orange-900/20 border-orange-700/50",
  Severe:   "text-red-400   bg-red-900/20   border-red-700/50",
};

const PatientAllergies = () => {
  const [allergy, setAllergy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    apiGet("/profile")
      .then((profile) => apiGet(`/patient-data/${profile.patient_id}/allergies`))
      .then((res) => setAllergy(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const colorClass = SEVERITY_COLOR[allergy?.severity] ?? SEVERITY_COLOR.Mild;

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-5">
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <AlertTriangle className="text-yellow-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Allergies
            </h2>
            <p className="text-gray-400 mt-1">Your recorded allergy information</p>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">{error}</p>
        )}

        {loading ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl h-32 animate-pulse" />
        ) : !allergy ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
            No allergy information recorded yet.
          </div>
        ) : (
          <div className={`border rounded-2xl p-6 flex items-start gap-5 ${colorClass}`}>
            <AlertTriangle size={28} className="shrink-0 mt-0.5" />
            <div>
              <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Allergy Trigger</p>
              <p className="text-2xl font-bold text-white">{allergy.allergy_trigger}</p>
              <span className={`inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full border ${colorClass}`}>
                Severity: {allergy.severity}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientAllergies;
