import React from "react";
import { Calendar, User, Clock, X } from "lucide-react";
import Button from "../Button";

const Schedule = ({ appointments = [], date, loading, onCancel }) => {
  const displayDate = date
    ? new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })
    : "Today";

  const handleCancel = (appt) => {
    const confirmed = window.confirm(
      `Cancel appointment for ${appt.patient_name} at ${appt.slot_time}?\n\nThis cannot be undone.`
    );
    if (confirmed && onCancel) onCancel(appt.app_id);
  };

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Calendar size={20} className="text-blue-400" />
          Today's Schedule
        </h3>
        <span className="text-xs text-gray-400 bg-gray-700/50 px-3 py-1 rounded-full border border-gray-600">
          {displayDate}
        </span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-700/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No appointments scheduled for today.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((appt, index) => (
            <li
              key={appt.app_id}
              className="flex items-center gap-4 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 hover:border-blue-500/50 transition-colors"
            >
              
              <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-bold text-sm">
                #{index + 1}
              </div>

              
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate flex items-center gap-1.5">
                  <User size={13} className="text-gray-400 shrink-0" />
                  {appt.patient_name}
                </p>
              </div>

             
              <span className="shrink-0 text-xs bg-gray-700/60 border border-gray-600 text-gray-300 px-3 py-1 rounded-full">
                {appt.slot_time}
              </span>

              
              <Button
                text="Cancel"
                onClick={() => handleCancel(appt)}
                color="bg-red-700 hover:bg-red-600"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Schedule;
