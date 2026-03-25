import React, { useState, useEffect } from "react";
import { useCombobox } from "downshift"; // Custom hook for searchable dropdown
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import { apiGet, apiPost } from "../utils/api";
import { Calendar, Search, Clock, ChevronDown } from "lucide-react";

// Reusable searchable combobox powered by Downshift
// displayKey – which object field to show (default "name").
const SearchDropdown = ({ placeholder, items = [], onSelect, onQueryChange, disabled, displayKey = "name", value }) => { 
  const filtered = (inputVal = "") =>
    items.filter((i) => i[displayKey]?.toLowerCase().includes(inputVal.toLowerCase()));

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getItemProps,
    highlightedIndex,
    setInputValue,
  } = useCombobox({
    items: filtered(value),
    itemToString: (item) => (item ? item[displayKey] : ""),
    inputValue: value,
    onInputValueChange: ({ inputValue }) => {
      onSelect(null);
      if (onQueryChange) onQueryChange(inputValue);
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) onSelect(selectedItem);
    },
  });

  // Sync external value reset (e.g. after form clear)
  useEffect(() => { setInputValue(value || ""); }, [value]);

  const visibleItems = filtered(value);

  return (
    <div className="relative">
      <div className={`flex items-center gap-2 bg-gray-900/60 border rounded-xl px-4 py-3 transition-all ${disabled ? "opacity-40 border-gray-700" : "border-gray-600 hover:border-blue-500"}`}>
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          {...getInputProps({ disabled })}
          placeholder={placeholder}
          className="bg-transparent flex-1 outline-none text-white placeholder-gray-500 text-sm disabled:cursor-not-allowed"
        />
        <ChevronDown size={16} className="text-gray-400 shrink-0" />
      </div>
      <ul
        {...getMenuProps()}
        className={`absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-xl max-h-52 overflow-y-auto transition-all ${isOpen && !disabled && visibleItems.length > 0 ? "block" : "hidden"}`}
      >
        {isOpen && !disabled && visibleItems.map((item, index) => (
          <li
            key={index}
            {...getItemProps({ item, index })}
            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${highlightedIndex === index ? "bg-blue-600/60 text-white" : "text-gray-200 hover:bg-blue-600/40"}`}
          >
            {item[displayKey]}
          </li>
        ))}
      </ul>
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
    <div className="text-white min-h-screen flex p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar idx={1} />
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

            {/* Department */}
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

            {/* Doctor */}
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

            {/* Date */}
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

            {/* Time Slots */}
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
