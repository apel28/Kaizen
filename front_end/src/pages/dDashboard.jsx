import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorSidebar from "../components/DoctorSidebar";
import Schedule from "../components/dDashboard/Schedule";
import StatCard from "../components/pDashboard/StatCard";
import { apiGet, apiDelete } from "../utils/api";
import { Users, CalendarCheck, Clock } from "lucide-react";

const DDashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiGet("/dashboard")
      .then(setData)
      .catch((err) => setError(err.message || "Failed to load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (appId) => {
    try {
      await apiDelete(`/appointment/${appId}`);
      const fresh = await apiGet("/dashboard");
      setData(fresh);
    } catch (err) {
      setError(err.message || "Failed to cancel appointment.");
    }
  };

  const appointments = data?.appointments ?? [];
  const displayName = data?.doctorName ?? "—";
  const displayInitials = data?.doctorName
    ? data.doctorName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "—";
  const doctorId = data?.doctorId ?? "—";

  const stats = [
    {
      title: "Patients Today",
      value: loading ? null : data?.appointmentCountToday ?? 0,
      unit: "",
      icon: Users,
    },
    {
      title: "Upcoming",
      value: loading ? null : data?.appointmentsLeft ?? 0,
      unit: "",
      icon: CalendarCheck,
    },
    {
      title: "Next Slot",
      value: loading ? null : (data?.nextSlot?.slot_time ?? "—"),
      unit: "",
      icon: Clock,
    },
  ];

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <DoctorSidebar />
      <main className="flex-1 ml-6">

        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Overview
            </h2>
            <p className="text-gray-400 mt-1">
              Welcome, {loading ? "..." : `${displayName}`}
            </p>
          </div>

          {/* Profile button */}
          <div
            className="flex items-center bg-gray-700/30 px-4 py-2 rounded-xl border border-gray-600 cursor-pointer hover:border-blue-500 hover:bg-gray-600/30 transition-all"
            onClick={() => navigate("/DoctorDashboard/Profile")}
            title="View / Edit Profile"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-3 shadow-lg shadow-blue-900/20">
              {loading ? "..." : displayInitials}
            </div>
            <div>
              <p className="font-bold">{loading ? "..." : `${displayName}`}</p>
              <p className="text-xs text-gray-400 font-mono">
                Doctor ID: #{loading ? "..." : doctorId}
              </p>
            </div>
          </div>
        </header>

        {/* Error state */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        )}

        {/* Today's schedule */}
        <Schedule appointments={appointments} date={data?.date} loading={loading} onCancel={handleCancel} />

      </main>
    </div>
  );
};

export default DDashboard;

