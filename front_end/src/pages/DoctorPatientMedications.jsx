import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import { apiGet, apiDelete } from "../utils/api";
import { Pill, ChevronDown, Clock, Trash2 } from "lucide-react";

const MedicationCard = ({ row, onDelete }) => {
  const isCurrent = row.status === "Current";
  
  return (
    <div className={`border rounded-2xl p-4 flex flex-col gap-1 relative ${isCurrent ? 'bg-blue-900/10 border-blue-700/50' : 'bg-gray-900/60 border-gray-700'}`}>
      <div className="flex items-start justify-between gap-2 mr-8">
        <p className="text-white font-semibold text-lg">{row.name}</p>
        <span className={`shrink-0 text-xs rounded-full px-2 py-0.5 border ${
          isCurrent ? 'bg-green-600/20 border-green-500/30 text-green-400' : 'bg-gray-600/20 border-gray-500/30 text-gray-400'
        }`}>
          {row.status}
        </span>
      </div>
      
      {isCurrent && onDelete && (
        <button 
          onClick={() => onDelete(row.medicine_id)}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-400 transition-colors"
          title="Remove medication"
        >
          <Trash2 size={16} />
        </button>
      )}

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

const DoctorPatientMedications = () => {
  const [patients, setPatients]     = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [medications, setMedications] = useState([]);
  const [loadingP, setLoadingP]     = useState(true);
  const [loadingM, setLoadingM]     = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    apiGet("/patient-data/doctor/patients")
      .then((res) => setPatients(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingP(false));
  }, []);

  const loadMedications = (patientId) => {
    setLoadingM(true);
    setError("");
    apiGet(`/patient-data/${patientId}/medications`)
      .then((res) => setMedications(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingM(false));
  };

  useEffect(() => {
    if (!selectedId) return setMedications([]);
    loadMedications(selectedId);
  }, [selectedId]);

  const handleDelete = async (medicineId) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return;
    
    try {
      await apiDelete(`/patient-data/${selectedId}/medications/${medicineId}`);
      loadMedications(selectedId); // Refresh after deletion
    } catch (err) {
      setError(err.message || "Failed to delete medication");
    }
  };

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar />

      <main className="flex-1 ml-6 space-y-5">
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Pill className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Patient Medications
            </h2>
            <p className="text-gray-400 mt-1">Select a patient to view and manage their medications</p>
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

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">{error}</p>
        )}

        {selectedId && (
          loadingM ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-24 animate-pulse" />
              ))}
            </div>
          ) : medications.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
              No medications recorded for this patient.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pb-6">
              {medications.map((m, i) => <MedicationCard key={`${m.medicine_id}-${i}`} row={m} onDelete={handleDelete} />)}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default DoctorPatientMedications;
