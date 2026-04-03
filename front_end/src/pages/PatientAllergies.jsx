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
          <div className="border rounded-2xl p-6 flex flex-col gap-5 bg-gray-900/60 border-gray-700">
            <div className="flex items-start gap-5">
              <AlertTriangle size={28} className="shrink-0 mt-0.5 text-red-500" />
              <div>
                <p className="text-xs uppercase tracking-widest mb-1 opacity-70">Allergy Name</p>
                <p className="text-2xl font-bold text-white">{allergy.allergy_trigger}</p>
              </div>
            </div>
            
            {allergy.trigger_meds && (() => {
              let meds = [];
              const str = allergy.trigger_meds;
              if (str.startsWith('{')) {
                meds = str.replace(/[{}]/g, '').split(',').map(m => m.trim().replace(/^"|"$/g, ''));
              } else if (str.startsWith('[')) {
                try { meds = JSON.parse(str); } catch { meds = str.split(','); }
              } else {
                meds = str.split(',').map(m => m.trim());
              }
              
              const finalMeds = (Array.isArray(meds) ? meds : [meds]).filter(Boolean);
              if (finalMeds.length === 0) return null;

              return (
                <div className="bg-gray-800/80 rounded-xl p-4 border border-gray-700 mt-2">
                  <p className="text-xs uppercase tracking-widest mb-2 opacity-70">Triggering Medicines</p>
                  <div className="flex flex-wrap gap-2">
                    {finalMeds.map((med, idx) => (
                      <span key={idx} className="bg-red-900/40 text-red-300 border border-red-800/50 px-3 py-1 rounded-full text-sm font-medium">
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientAllergies;
