import React, { useState, useEffect } from "react";
import { apiGet } from "../../utils/api";

const MedicationList = () => {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet("/profile")
      .then((profile) => apiGet(`/patient-data/${profile.patient_id}/medications`))
      .then((res) => {
        // Filter only 'Current' medications
        const currentMeds = (res.data || []).filter((m) => m.status === "Current");
        setMedications(currentMeds);
      })
      .catch((err) => console.error("Failed to fetch dashboard medications:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Active Medications</h3>
      </div>
      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">Loading...</div>
      ) : medications.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500">No active medications</div>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {medications.map((med, index) => (
            <li
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
            >
              <div>
                <p className="font-bold">{med.name}</p>
                <p className="text-sm text-gray-400">
                  {med.generic_name} • {med.brand}
                </p>
              </div>
              <span className="text-purple-400 font-medium text-sm">
                For: {med.condition}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicationList;
