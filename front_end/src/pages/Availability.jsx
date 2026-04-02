import React, { useState, useEffect } from "react";
import DoctorSidebar from "../components/DoctorSidebar";
import Button from "../components/Button";
import { apiGet, apiPost, apiDelete } from "../utils/api";
import { Clock, ChevronDown, Plus, Trash2, CalendarDays } from "lucide-react";

const WEEK_DAYS = [
  "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN",
];

const DURATIONS = [0,1,2,3,4,5];

// ── Reusable styled select ────────────────────────────────────────────────────
const StyledSelect = ({ value, onChange, children, disabled = false }) => (
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full bg-gray-900/60 border rounded-xl px-4 py-3 text-sm text-white outline-none appearance-none transition-all cursor-pointer
        ${disabled ? "opacity-40 cursor-not-allowed border-gray-700" : "border-gray-600 hover:border-blue-500 focus:border-blue-500"}`}
    >
      {children}
    </select>
    <ChevronDown size={15} className="text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
  </div>
);

// ── Day column showing its slots ───────────────────────────────────────────────
const DayColumn = ({ day, slots, onDelete }) => (
  <div className="bg-gray-900/40 border border-gray-700 rounded-2xl p-4 flex flex-col gap-3 min-h-[8rem]">
    <h4 className="text-sm font-semibold text-blue-400 mb-1">{day}</h4>
    {slots.length === 0 ? (
      <p className="text-xs text-gray-600 italic">No slots</p>
    ) : (
      slots.map((s) => (
        <div
          key={s.a_id}
          className="flex items-center justify-between bg-blue-600/10 border border-blue-500/30 rounded-xl px-3 py-2"
        >
          <div>
            <p className="text-sm text-white font-medium">{s.slot_time}</p>
            <p className="text-xs text-gray-400">{s.slot_duration_minutes} patient(s)</p>
          </div>
          <button
            onClick={() => onDelete(s.a_id)}
            className="text-gray-500 hover:text-red-400 transition-colors ml-2"
            title="Remove slot"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))
    )}
  </div>
);

// ── Main page ─────────────────────────────────────────────────────────────────
const Availability = () => {
  const [slots, setSlots] = useState([]);           // all fetched slots
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // New slot form state
  const [form, setForm] = useState({
    week_day: "MON",
    slot_time: "09:00",
    slot_duration_minutes: 3,
  });
  const [adding, setAdding] = useState(false);

  // ── Fetch availability ──
  const fetchSlots = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("/availability");
      setSlots(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, []);

  // ── Add slot ──
  const handleAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccess("");
    try {
      await apiPost("/availability", {
        week_day: form.week_day,
        slot_time: form.slot_time,
        slot_duration_minutes: Number(form.slot_duration_minutes),
      });
      setSuccess("Slot added!");
      await fetchSlots();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  // ── Delete slot ──
  const handleDelete = async (aId) => {
    setError("");
    try {
      await apiDelete(`/availability/${aId}`);
      setSlots((prev) => prev.filter((s) => s.a_id !== aId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Group slots by day for the weekly grid
  const byDay = WEEK_DAYS.reduce((acc, day) => {
    acc[day] = slots.filter((s) => s.week_day === day);
    return acc;
  }, {});

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar idx={2} />

      <main className="flex-1 ml-6 space-y-6">

        {/* Header */}
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <CalendarDays className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Availability
            </h2>
            <p className="text-gray-400 mt-1">Manage your weekly appointment slots</p>
          </div>
        </header>

        {/* ── Add Slot Form ── */}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
            <Plus size={18} className="text-blue-400" /> Add New Slot
          </h3>

          <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

            {/* Day */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Day of Week</label>
              <StyledSelect
                value={form.week_day}
                onChange={(e) => setForm((f) => ({ ...f, week_day: e.target.value }))}
              >
                {WEEK_DAYS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </StyledSelect>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Start Time</label>
              <div className="flex items-center gap-2 bg-gray-900/60 border border-gray-600 hover:border-blue-500 focus-within:border-blue-500 rounded-xl px-4 py-3 transition-all">
                <Clock size={15} className="text-gray-400 shrink-0" />
                <input
                  type="time"
                  value={form.slot_time}
                  onChange={(e) => setForm((f) => ({ ...f, slot_time: e.target.value }))}
                  className="bg-transparent flex-1 outline-none text-white text-sm [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">Patients per slot </label>
              <StyledSelect
                value={form.slot_duration_minutes}
                onChange={(e) => setForm((f) => ({ ...f, slot_duration_minutes: e.target.value }))}
              >
                {DURATIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </StyledSelect>
            </div>

            {/* Submit */}
            <div className="sm:col-span-3 flex justify-end pt-1">
              <Button
                text={adding ? "Adding…" : "Add Slot"}
                type="submit"
                disabled={adding}
              />
            </div>
          </form>

          {/* Feedback */}
          {error && (
            <p className="mt-4 text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">
              {error}
            </p>
          )}
          {success && (
            <p className="mt-4 text-sm text-green-400 bg-green-900/20 border border-green-700 rounded-xl px-4 py-3">
              {success}
            </p>
          )}
        </div>

        {/* ── Weekly Grid ── */}
        <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white mb-5">
            <CalendarDays size={18} className="text-blue-400" /> Weekly Schedule
          </h3>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {WEEK_DAYS.map((d) => (
                <div key={d} className="bg-gray-700/30 rounded-2xl h-32 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {WEEK_DAYS.map((day) => (
                <DayColumn
                  key={day}
                  day={day}
                  slots={byDay[day]}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default Availability;
