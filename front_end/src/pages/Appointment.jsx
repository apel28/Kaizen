import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import { apiGet, apiPost } from "../utils/api";
import { Calendar, Search, Clock, ChevronDown } from "lucide-react";


const SearchDropdown = ({ placeholder, items = [], onSelect, onQueryChange, disabled, displayKey = "name", value }) => {
  const [query, setQuery] = useState(value || "");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  
  useEffect(() => { setQuery(value || ""); }, [value]);

  
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = items.filter((i) =>
    i[displayKey]?.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setOpen(true);
    onSelect(null);  
    if (onQueryChange) onQueryChange(val); 
  };

  return (
    <div ref={ref} className="relative">
      <div className={`flex items-center gap-2 bg-gray-900/60 border rounded-xl px-4 py-3 transition-all ${disabled ? "opacity-40 cursor-not-allowed border-gray-700" : "border-gray-600 hover:border-blue-500"}`}>
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          className="bg-transparent flex-1 outline-none text-white placeholder-gray-500 text-sm disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          onChange={handleChange}
          onFocus={() => !disabled && setOpen(true)}
        />
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </div>
      {open && !disabled && filtered.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl max-h-52 overflow-y-auto">
          {filtered.map((item, i) => (
            <li
              key={i}
              className="px-4 py-2.5 text-sm text-gray-200 hover:bg-blue-600/40 cursor-pointer transition-colors"
              onMouseDown={() => { setQuery(item[displayKey]); setOpen(false); onSelect(item); }}
            >
              {item[displayKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Appointment = () => {
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [doctorQuery, setDoctorQuery] = useState("");
  const [form, setForm] = useState({ dept: null, doctor: null, date: "", slot: "" });
  const [status, setStatus] = useState({ loading: false, error: "", success: "" });

  const today = new Date().toISOString().split("T")[0];

  
  useEffect(() => {
    apiGet("/appointment/departments").then(setDepartments).catch(console.error);
  }, []);

  
  useEffect(() => {
    const params = new URLSearchParams();
    if (form.dept) params.set("departmentId", form.dept.department_id);
    else params.set("search", doctorQuery);
    apiGet(`/appointment/doctors?${params}`).then(setDoctors).catch(console.error);
  }, [form.dept, doctorQuery]);

  
  useEffect(() => {
    if (!form.doctor || !form.date) return setSlots([]);
    apiGet(`/appointment/slots?doctorId=${form.doctor.doctor_id}&date=${form.date}`)
      .then(setSlots).catch(console.error);
  }, [form.doctor, form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctor || !form.date || !form.slot)
      return setStatus({ loading: false, error: "Please fill all fields.", success: "" });
    setStatus({ loading: true, error: "", success: "" });
    try {
      await apiPost("/appointment", { doctorId: form.doctor.doctor_id, date: form.date, slotTime: form.slot });
      setStatus({ loading: false, error: "", success: "Appointment booked successfully!" });
      setForm({ dept: null, doctor: null, date: "", slot: "" });
      setDoctorQuery("");
      setSlots([]);
    } catch (err) {
      setStatus({ loading: false, error: err.message, success: "" });
    }
  };

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />
      <main className="flex-1 ml-6">
        <header className="flex items-center mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Calendar className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Book Appointment
            </h2>
            <p className="text-gray-400 mt-1">Find a doctor and schedule your visit</p>
          </div>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm space-y-5">

            
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Department <span className="text-gray-600">(optional)</span>
              </label>
              <SearchDropdown
                placeholder="Search department…"
                items={departments}
                displayKey="name"
                value={form.dept?.name || ""}
                onSelect={(dept) => setForm((f) => ({ ...f, dept, doctor: null, date: "", slot: "" }))}
              />
            </div>

            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Doctor</label>
              <SearchDropdown
                placeholder="Search doctor by name…"
                items={doctors}
                displayKey="name"
                value={form.doctor?.name || ""}
                onQueryChange={(q) => { if (!form.dept) setDoctorQuery(q); }}
                onSelect={(doc) => setForm((f) => ({ ...f, doctor: doc, date: "", slot: "" }))}
              />
            </div>

            
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date</label>
              <div className={`flex items-center gap-2 bg-gray-900/60 border rounded-xl px-4 py-3 transition-all ${!form.doctor ? "opacity-40 border-gray-700" : "border-gray-600 hover:border-blue-500"}`}>
                <Calendar size={16} className="text-gray-400" />
                <input
                  type="date"
                  min={today}
                  disabled={!form.doctor}
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value, slot: "" }))}
                  className="bg-transparent flex-1 outline-none text-white text-sm disabled:cursor-not-allowed [color-scheme:dark]"
                />
              </div>
            </div>

            
            {slots.length > 0 && (
              <div>
                <label className="block text-sm text-gray-400 mb-3">
                  <Clock size={14} className="inline mr-1" />Available Time Slots
                </label>
                <div className="flex flex-wrap gap-3">
                  {slots.map((s) => (
                    <label
                      key={s.slot_time}
                      className={`px-4 py-2 rounded-xl border cursor-pointer transition-all text-sm select-none ${form.slot === s.slot_time ? "bg-blue-600 border-blue-500 text-white" : "bg-gray-900/60 border-gray-600 text-gray-300 hover:border-blue-500"}`}
                    >
                      <input
                        type="radio" name="slot" value={s.slot_time}
                        checked={form.slot === s.slot_time}
                        onChange={() => setForm((f) => ({ ...f, slot: s.slot_time }))}
                        className="hidden"
                      />
                      {s.slot_time}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {form.doctor && form.date && slots.length === 0 && (
              <p className="text-sm text-gray-500 italic">No available slots for this date.</p>
            )}

            {status.error && <p className="text-sm text-red-400">{status.error}</p>}
            {status.success && <p className="text-sm text-green-400">{status.success}</p>}

            <div className="flex justify-end pt-2">
              <Button
                text={status.loading ? "Booking…" : "Book Appointment"}
                type="submit"
                disabled={status.loading}
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Appointment;

