import React, { useState, useEffect, useRef } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import Button from "../components/Button";
import { apiGet, apiPost } from "../utils/api";
import {
  FileText, Search, ChevronDown, X, User, Pill,
  FlaskConical, Activity, StickyNote, AlertTriangle, DollarSign,
} from "lucide-react";

// ─── Reusable: Searchable Dropdown ────────────────────────────────────────────
const SearchDropdown = ({
  placeholder,
  items = [],
  onSelect,
  displayKey = "name",
  disabled = false,
  resetKey,
}) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Reset when parent signals via resetKey change
  useEffect(() => { setQuery(""); }, [resetKey]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = items.filter((i) =>
    i[displayKey]?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <div
        className={`flex items-center gap-2 bg-gray-900/60 border rounded-xl px-4 py-3 transition-all ${
          disabled
            ? "opacity-40 cursor-not-allowed border-gray-700"
            : "border-gray-600 hover:border-blue-500"
        }`}
      >
        <Search size={15} className="text-gray-400 shrink-0" />
        <input
          className="bg-transparent flex-1 outline-none text-white placeholder-gray-500 text-sm disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => !disabled && setOpen(true)}
        />
        <ChevronDown size={15} className="text-gray-400 shrink-0" />
      </div>
      {open && !disabled && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl max-h-52 overflow-y-auto">
          {filtered.map((item, i) => (
            <li
              key={i}
              className="px-4 py-2.5 text-sm text-gray-200 hover:bg-blue-600/40 cursor-pointer transition-colors"
              onMouseDown={() => { setQuery(""); setOpen(false); onSelect(item); }}
            >
              {item[displayKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ─── Reusable: Selected Item Tags ─────────────────────────────────────────────
const TagBlock = ({ label, onRemove, sublabel }) => (
  <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/40 rounded-xl px-3 py-2 text-sm">
    <div className="flex-1">
      <span className="text-white font-medium">{label}</span>
      {sublabel && <span className="text-blue-300 ml-2 text-xs">({sublabel})</span>}
    </div>
    <button
      type="button"
      onClick={onRemove}
      className="text-gray-400 hover:text-red-400 transition-colors ml-1"
    >
      <X size={14} />
    </button>
  </div>
);

// ─── Reusable: Section Card wrapper ───────────────────────────────────────────
const Section = ({ icon: Icon, title, children }) => (
  <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 space-y-4">
    <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
      <Icon size={18} className="text-blue-400" />
      {title}
    </h3>
    {children}
  </div>
);

// ─── Reusable: Styled input ────────────────────────────────────────────────────
const StyledInput = ({ label, type = "text", value, onChange, placeholder = "" }) => (
  <div>
    {label && <label className="block text-xs text-gray-400 mb-1">{label}</label>}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
    />
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────
const Prescription = () => {
  // Data from API
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [tests, setTests] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Selected patient
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Conditions: array of { condition, department }
  const [conditionText, setConditionText] = useState("");
  const [selectedDept, setSelectedDept] = useState(null);
  const [conditions, setConditions] = useState([]);

  // Medicines: array of medicine objects
  const [selectedMedicines, setSelectedMedicines] = useState([]);

  // Tests: array of test objects
  const [selectedTests, setSelectedTests] = useState([]);

  // Vitals
  const [vitals, setVitals] = useState({ bp: "", blood_sugar: "", heart_rate: "", height: "", weight: "" });

  // Notes, allergy, bill
  const [note, setNote] = useState("");
  const [allergy, setAllergy] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [admission, setAdmission] = useState(false);

  // Status
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  // Reset keys for search dropdowns
  const [medResetKey, setMedResetKey] = useState(0);
  const [testResetKey, setTestResetKey] = useState(0);

  // ── Fetch reference data once ──
  useEffect(() => {
    apiGet("/prescription/patients/today")
      .then((r) => setPatients(r.data || []))
      .catch(console.error);
    apiGet("/prescription/medicines")
      .then((r) => setMedicines(r.data || []))
      .catch(console.error);
    apiGet("/prescription/tests")
      .then((r) => setTests(r.data || []))
      .catch(console.error);
    apiGet("/prescription/departments")
      .then((r) => setDepartments(r.data || []))
      .catch(console.error);
  }, []);

  // ── Add condition block ──
  const addCondition = () => {
    if (!conditionText.trim() || !selectedDept) return;
    setConditions((prev) => [
      ...prev,
      { condition: conditionText.trim(), department_id: selectedDept.department_id, deptName: selectedDept.name },
    ]);
    setConditionText("");
    setSelectedDept(null);
  };

  // ── Add medicine (avoid duplicates) ──
  const addMedicine = (med) => {
    if (!med) return;
    if (selectedMedicines.find((m) => m.medicine_id === med.medicine_id)) return;
    setSelectedMedicines((prev) => [...prev, med]);
    setMedResetKey((k) => k + 1);
  };

  // ── Add test (avoid duplicates) ──
  const addTest = (test) => {
    if (!test) return;
    if (selectedTests.find((t) => t.test_id === test.test_id)) return;
    setSelectedTests((prev) => [...prev, test]);
    setTestResetKey((k) => k + 1);
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return setStatus({ loading: false, error: "Please select a patient.", success: "" });
    if (conditions.length === 0) return setStatus({ loading: false, error: "Add at least one condition.", success: "" });

    setStatus({ loading: true, error: "", success: "" });

    const payload = {
      patient_id: selectedPatient.patient_id,
      conditions: conditions.map(({ condition, department_id }) => ({ condition, department_id, status: "Active" })),
      vitals: {
        bp: vitals.bp || null,
        blood_sugar: vitals.blood_sugar || null,
        heart_rate: vitals.heart_rate || null,
        height: vitals.height || null,
        weight: vitals.weight || null,
      },
      medicines: selectedMedicines.map((m) => ({ medicine_id: m.medicine_id })),
      tests: selectedTests.map((t) => ({ test_id: t.test_id })),
      bill_amount: billAmount || 0,
      note: note || null,
      allergy: allergy ? { allergy_trigger: allergy, severity: "Mild" } : null,
      admission: admission,
    };

    try {
      await apiPost("/prescription", payload);
      setStatus({ loading: false, error: "", success: "Prescription submitted successfully!" });
      // Reset form
      setSelectedPatient(null);
      setConditions([]);
      setConditionText("");
      setSelectedDept(null);
      setSelectedMedicines([]);
      setSelectedTests([]);
      setVitals({ bp: "", blood_sugar: "", heart_rate: "", height: "", weight: "" });
      setNote("");
      setAllergy("");
      setBillAmount("");
      setAdmission(false);
      setMedResetKey((k) => k + 1);
      setTestResetKey((k) => k + 1);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar />

      <main className="flex-1 ml-6 space-y-6">
        {/* Page Header */}
        <header className="flex items-center mb-2 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <FileText className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Write Prescription
            </h2>
            <p className="text-gray-400 mt-1">Select a patient and fill in today's prescription details</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── Patient Selector ── */}
          <Section icon={User} title="Patient">
            <div>
              <label className="block text-xs text-gray-400 mb-2">Today's Patients</label>
              <div className="relative">
                <select
                  className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none transition-all cursor-pointer"
                  value={selectedPatient?.patient_id || ""}
                  onChange={(e) => {
                    const p = patients.find((x) => String(x.patient_id) === e.target.value);
                    setSelectedPatient(p || null);
                  }}
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
              {selectedPatient && (
                <p className="text-xs text-blue-300 mt-2">
                  Selected: <span className="font-semibold">{selectedPatient.name}</span>
                </p>
              )}
            </div>
          </Section>

          {/* ── Conditions + Department ── */}
          <Section icon={Activity} title="Conditions & Diagnosis">
            {/* Existing condition tags */}
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {conditions.map((c, i) => (
                  <TagBlock
                    key={i}
                    label={c.condition}
                    sublabel={c.deptName}
                    onRemove={() => setConditions((prev) => prev.filter((_, idx) => idx !== i))}
                  />
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StyledInput
                placeholder="Enter condition / diagnosis…"
                value={conditionText}
                onChange={(e) => setConditionText(e.target.value)}
              />
              {/* Department dropdown */}
              <div className="relative">
                <select
                  className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none transition-all cursor-pointer"
                  value={selectedDept?.department_id || ""}
                  onChange={(e) => {
                    const d = departments.find((x) => String(x.department_id) === e.target.value);
                    setSelectedDept(d || null);
                  }}
                >
                  <option value="">— Select department —</option>
                  {departments.map((d) => (
                    <option key={d.department_id} value={d.department_id}>{d.name}</option>
                  ))}
                </select>
                <ChevronDown size={15} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                text="+ Add Condition"
                type="button"
                onClick={addCondition}
                disabled={!conditionText.trim() || !selectedDept}
                color="bg-indigo-700"
              />
            </div>
          </Section>

          {/* ── Medicines ── */}
          <Section icon={Pill} title="Medicines">
            {selectedMedicines.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedMedicines.map((m) => (
                  <TagBlock
                    key={m.medicine_id}
                    label={m.name}
                    sublabel={m.generic_name}
                    onRemove={() =>
                      setSelectedMedicines((prev) => prev.filter((x) => x.medicine_id !== m.medicine_id))
                    }
                  />
                ))}
              </div>
            )}
            <SearchDropdown
              placeholder="Search medicine by name…"
              items={medicines}
              displayKey="name"
              onSelect={addMedicine}
              resetKey={medResetKey}
            />
          </Section>

          {/* ── Vitals ── */}
          <Section icon={Activity} title="Vitals">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StyledInput
                label="Blood Pressure"
                value={vitals.bp}
                onChange={(e) => setVitals((v) => ({ ...v, bp: e.target.value }))}
              />
              <StyledInput
                label="Blood Sugar (mg/dL)"
                type="number"
                value={vitals.blood_sugar}
                onChange={(e) => setVitals((v) => ({ ...v, blood_sugar: e.target.value }))}
              />
              <StyledInput
                label="Heart Rate (bpm)"
                type="number"
                value={vitals.heart_rate}
                onChange={(e) => setVitals((v) => ({ ...v, heart_rate: e.target.value }))}
              />
              <StyledInput
                label="Height (cm)"
                type="number"
                value={vitals.height}
                onChange={(e) => setVitals((v) => ({ ...v, height: e.target.value }))}
              />
            </div>
            <StyledInput
              label="Weight (kg)"
              type="number"
              value={vitals.weight}
              onChange={(e) => setVitals((v) => ({ ...v, weight: e.target.value }))}
            />
          </Section>

          {/* ── Tests ── */}
          <Section icon={FlaskConical} title="Lab Tests">
            {selectedTests.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {selectedTests.map((t) => (
                  <TagBlock
                    key={t.test_id}
                    label={t.name}
                    onRemove={() =>
                      setSelectedTests((prev) => prev.filter((x) => x.test_id !== t.test_id))
                    }
                  />
                ))}
              </div>
            )}
            <SearchDropdown
              placeholder="Search test by name…"
              items={tests}
              displayKey="name"
              onSelect={addTest}
              resetKey={testResetKey}
            />
          </Section>

          {/* ── Notes + Allergy + Bill ── */}
          <Section icon={StickyNote} title="Additional Details">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Doctor's Notes</label>
              <textarea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter notes or instructions for the patient…"
                className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none resize-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <AlertTriangle size={12} className="text-yellow-400" /> Known Allergies
              </label>
              <input
                type="text"
                value={allergy}
                onChange={(e) => setAllergy(e.target.value)}
                className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs text-gray-400 mb-1">
                <DollarSign size={12} className="text-green-400" /> Bill Amount (BDT)
              </label>
              <input
                type="number"
                min={0}
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                className="w-full bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus:border-blue-500 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all"
              />
            </div>

            {/* Admit Patient */}
            <div className="flex items-center gap-3">
              <Button
                text={admission ? "✓ Patient Admitted" : "Admit Patient"}
                type="button"
                onClick={() => setAdmission((v) => !v)}
                color="bg-gray-700"
              />
            </div>
          </Section>

          {/* ── Status messages + Submit ── */}
          {status.error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">
              {status.error}
            </p>
          )}
          {status.success && (
            <p className="text-sm text-green-400 bg-green-900/20 border border-green-700 rounded-xl px-4 py-3">
              {status.success}
            </p>
          )}

          <div className="flex justify-end pb-6">
            <Button
              text={status.loading ? "Submitting…" : "Submit"}
              type="submit"
              disabled={status.loading}
            />
          </div>
        </form>
      </main>
    </div>
  );
};

export default Prescription;

