import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import { apiGet } from "../utils/api";
import {
  FileText, ChevronDown, ChevronUp, Calendar, Pill,
  FlaskConical, Activity, Stethoscope, StickyNote, AlertTriangle,
} from "lucide-react";

// ── Helpers ────────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const Badge = ({ children, color = "blue" }) => {
  const colors = {
    blue:   "bg-blue-600/20 border-blue-500/30 text-blue-300",
    purple: "bg-purple-600/20 border-purple-500/30 text-purple-300",
    green:  "bg-green-600/20 border-green-500/30 text-green-300",
    red:    "bg-red-600/20 border-red-500/30 text-red-300",
  };
  return (
    <span className={`text-xs border rounded-full px-2 py-0.5 ${colors[color]}`}>
      {children}
    </span>
  );
};

// ── Prescription Detail Panel ──────────────────────────────────────────────────
const PrescriptionDetail = ({ visitId }) => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    apiGet(`/prescription/${visitId}`)
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [visitId]);

  if (loading) return (
    <div className="space-y-3 mt-4">
      {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-gray-700/40 rounded-xl animate-pulse" />)}
    </div>
  );
  if (error) return <p className="mt-4 text-sm text-red-400">{error}</p>;
  if (!data)  return <p className="mt-4 text-sm text-gray-500">No data found.</p>;

  const Section = ({ icon: Icon, title, color = "text-blue-400", children }) => (
    <div className="bg-gray-900/50 border border-gray-700/60 rounded-xl p-4 space-y-3">
      <div className={`flex items-center gap-2 text-sm font-semibold ${color}`}>
        <Icon size={15} /> {title}
      </div>
      {children}
    </div>
  );

  return (
    <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">

      {/* Conditions */}
      {data.conditions?.length > 0 && (
        <Section icon={Stethoscope} title="Conditions">
          <div className="flex flex-wrap gap-2">
            {data.conditions.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <Badge color="blue">{c.condition}</Badge>
                <Badge color="purple">{c.department_name}</Badge>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Medicines */}
      {data.medicines?.length > 0 && (
        <Section icon={Pill} title="Medicines" color="text-purple-400">
          <div className="flex flex-wrap gap-2">
            {data.medicines.map((m, i) => (
              <div key={i} className="bg-purple-900/20 border border-purple-700/30 rounded-lg px-3 py-1.5 text-sm">
                <p className="text-white font-medium">{m.name}</p>
                <p className="text-xs text-purple-300">{m.generic_name} · {m.brand}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Vitals */}
      {data.vitals && (data.vitals.bp || data.vitals.blood_sugar || data.vitals.heart_rate || data.vitals.height || data.vitals.weight) && (
        <Section icon={Activity} title="Vitals" color="text-green-400">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ["BP", data.vitals.bp],
              ["Blood Sugar", data.vitals.blood_sugar ? `${data.vitals.blood_sugar} mg/dL` : null],
              ["Heart Rate", data.vitals.heart_rate ? `${data.vitals.heart_rate} bpm` : null],
              ["Height", data.vitals.height ? `${data.vitals.height} cm` : null],
              ["Weight", data.vitals.weight ? `${data.vitals.weight} kg` : null],
            ].filter(([, v]) => v).map(([label, value]) => (
              <div key={label} className="bg-gray-800/60 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm text-white font-medium">{value}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Tests */}
      {data.test_orders?.length > 0 && (
        <Section icon={FlaskConical} title="Lab Tests" color="text-yellow-400">
          <div className="flex flex-wrap gap-2">
            {data.test_orders.map((t, i) => (
              <Badge key={i} color="green">{t.name}</Badge>
            ))}
          </div>
        </Section>
      )}

      {/* Doctor's Note */}
      {data.prescription_note && (
        <Section icon={StickyNote} title="Doctor's Note" color="text-gray-400">
          <p className="text-sm text-gray-300 leading-relaxed">{data.prescription_note}</p>
        </Section>
      )}

      {/* Allergy */}
      {data.allergy && (
        <Section icon={AlertTriangle} title="Allergy on Record" color="text-red-400">
          <p className="text-sm font-semibold text-white">{data.allergy.allergy_trigger}</p>
          {data.allergy.trigger_meds && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(() => {
                const str = data.allergy.trigger_meds;
                let meds = [];
                if (str.startsWith('{')) meds = str.replace(/[{}]/g, '').split(',').map(m => m.trim().replace(/^"|"$/g, ''));
                else if (str.startsWith('[')) { try { meds = JSON.parse(str); } catch { meds = str.split(','); } }
                else meds = str.split(',').map(m => m.trim());
                return meds.filter(Boolean).map((m, i) => <Badge key={i} color="red">{m}</Badge>);
              })()}
            </div>
          )}
        </Section>
      )}
    </div>
  );
};

// ── Visit Row (accordion) ──────────────────────────────────────────────────────
const VisitRow = ({ visit, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden transition-all">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-300 font-bold text-sm shrink-0">
            {index + 1}
          </div>
          <div className="text-left">
            <p className="text-white font-semibold text-sm">Visit #{visit.visit_id}</p>
            <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
              <Calendar size={11} />
              {fmtDate(visit.date)}
              {visit.admission_id && (
                <span className="ml-2 text-orange-400 font-medium">· Admitted</span>
              )}
            </p>
          </div>
        </div>
        {open
          ? <ChevronUp size={16} className="text-gray-400 shrink-0" />
          : <ChevronDown size={16} className="text-gray-400 shrink-0" />
        }
      </button>

      {open && (
        <div className="px-6 pb-5">
          <PrescriptionDetail visitId={visit.visit_id} />
        </div>
      )}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const DoctorPatientPrescriptions = () => {
  const [patients, setPatients]   = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [visits, setVisits]       = useState([]);
  const [loadingP, setLoadingP]   = useState(true);
  const [loadingV, setLoadingV]   = useState(false);
  const [error, setError]         = useState("");

  // Load patients under this doctor
  useEffect(() => {
    apiGet("/patient-data/doctor/patients")
      .then((res) => setPatients(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingP(false));
  }, []);

  // Load visits when patient is selected
  useEffect(() => {
    if (!selectedId) return setVisits([]);
    setLoadingV(true);
    setError("");
    apiGet(`/prescription/visits?patient_id=${selectedId}`)
      .then((res) => setVisits(res.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoadingV(false));
  }, [selectedId]);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar />

      <main className="flex-1 ml-6 space-y-5">
        {/* Header */}
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <FileText className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              History
            </h2>
            <p className="text-gray-400 mt-1">Select a patient to review their visit and prescription history</p>
          </div>
        </header>

        {/* Patient Selector */}
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

        {/* Visits */}
        {selectedId && (
          loadingV ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-20 animate-pulse" />
              ))}
            </div>
          ) : visits.length === 0 ? (
            <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-12 text-center text-gray-500">
              No visits recorded for this patient with you.
            </div>
          ) : (
            <div className="space-y-3 pb-6">
              {visits.map((v, i) => <VisitRow key={v.visit_id} visit={v} index={i} />)}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default DoctorPatientPrescriptions;
