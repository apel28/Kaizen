import React, { useState, useEffect } from "react";
import { apiGet } from "../../utils/api";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      const data = await apiGet("/appointment");
      
      const now = new Date();
      const upcoming = data.filter((appt) => {
        const apptDate = new Date(appt.date);
        
        const isFutureDay = 
             apptDate.getFullYear() > now.getFullYear() ||
             (apptDate.getFullYear() === now.getFullYear() && apptDate.getMonth() > now.getMonth()) ||
             (apptDate.getFullYear() === now.getFullYear() && apptDate.getMonth() === now.getMonth() && apptDate.getDate() > now.getDate());
             
        if (isFutureDay) return true;

        const isToday = apptDate.getFullYear() === now.getFullYear() && 
                        apptDate.getMonth() === now.getMonth() && 
                        apptDate.getDate() === now.getDate();

        if (isToday && appt.slot_time) {
          const [hours, minutes] = appt.slot_time.split(':');
          const apptTime = new Date(now);
          apptTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          return apptTime > now; 
        }

        return false;
      });

      setAppointments([]);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <h3 className="text-xl font-bold mb-4">Upcoming Appointments</h3>
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-14 bg-gray-700/40 rounded-xl animate-pulse" />)}
        </div>
      ) : appointments.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No upcoming appointments.</p>
      ) : (
        <ul>
          {appointments.map((appt) => (
            <li key={appt.app_id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
              <div>
                <p className="font-bold">Dr. {appt.doctor_name}</p>
                <p className="text-sm text-gray-400">
                  {new Date(appt.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  {" • "}{appt.slot_time}
                  {" • Queue: #"}{appt.queue}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AppointmentsList;
