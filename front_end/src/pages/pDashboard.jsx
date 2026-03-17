import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/pDashboard/StatCard";
import AppointmentsList from "../components/pDashboard/AppointmentsList";
import MedicationList from "../components/pDashboard/MedicationList";
import { apiGet } from "../utils/api";
import { Activity, Droplets, Scale, Heart } from "lucide-react";

const PDashboard = () => {
  const [DbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await apiGet("/dashboard");
        setDbData(data);
      } catch (err) {
        setError(err.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []); // Empty array = runs once on mount

  // Derive stats from live server data
  const stats = [
    {
      title: "Blood Pressure",
      value: (DbData?.bp?.systolic != null && DbData?.bp?.diastolic != null)
        ? `${DbData.bp.systolic}/${DbData.bp.diastolic}`
        : null,
      unit: DbData?.bp?.systolic != null ? "mmHg" : "",
      icon: Heart,
    },
    {
      title: "Heart Rate",
      value: DbData?.["heart rate"] ?? null,
      unit: DbData?.["heart rate"] ? "bpm" : "",
      icon: Activity,
    },
    {
      title: "Blood Sugar",
      value: DbData?.["blood sugar"] ?? null,
      unit: DbData?.["blood sugar"] ? "mg/dL" : "",
      icon: Droplets,
    },
    {
      title: "BMI",
      value: DbData?.bmi != null
        ? parseFloat(DbData.bmi.toFixed(1))
        : null,
      unit: DbData?.bmi ? "kg/m²" : "",
      icon: Scale,
    },
  ];

  // Derive display name and patient ID from live data
  const displayName = DbData?.name ?? "—";
  const displayInitials = DbData?.name
    ? DbData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "—";
  const displayPatientId = DbData?.patientId ?? "—";

  return (
    <div className="text-white min-h-screen flex p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar idx={0} />
      <main className="flex-1 ml-6">

        {/* Header */}
        <header className="flex justify-between items-center mb-8 bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Overview
            </h2>
            <p className="text-gray-400 mt-1">
              Welcome, {loading ? "..." : displayName}.
            </p>
          </div>
          <div className="flex items-center bg-gray-700/30 px-4 py-2 rounded-xl border border-gray-600">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold text-lg mr-3 shadow-lg shadow-blue-900/20">
              {loading ? "..." : displayInitials}
            </div>
            <div>
              <p className="font-bold">{loading ? "..." : displayName}</p>
              <p className="text-xs text-gray-400 font-mono">
                Patient ID: #{loading ? "..." : displayPatientId}
              </p>
            </div>
          </div>
        </header>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-2xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Loading skeleton for stat cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 animate-pulse h-32"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </div>
        )}

        {/* Lists (static placeholders — server endpoints not yet implemented) */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
          <AppointmentsList />
          <MedicationList />
        </div>

      </main>
    </div>
  );
};

export default PDashboard;
