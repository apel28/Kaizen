import React from "react";

const AppointmentsList = () => {
  const appointments = [
    {
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiologist",
      date: "15-Jul-2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      doctor: "Dr. Sarah Smith",
      specialty: "Cardiologist",
      date: "15-Jul-2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
  ];

  return (
    <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Upcoming Appointments</h3>
      </div>
      <ul>
        {appointments.map((appt, index) => (
          <li
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0"
          >
            <div>
              <p className="font-bold">{appt.doctor}</p>
              <p className="text-sm text-gray-400">
                {appt.specialty} • {appt.date} • {appt.time}
              </p>
            </div>
            <span className="text-green-400 bg-green-900/50 px-3 py-1 rounded-full text-sm">
              {appt.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentsList;
