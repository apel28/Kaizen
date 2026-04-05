import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet } from "../utils/api";
import { Bell, Sparkles, AlertCircle, Clock } from "lucide-react";


const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', { 
    month: 'short', day: 'numeric', 
    hour: 'numeric', minute: '2-digit', hour12: true 
  });
};

const NotificationCard = ({ notification }) => {
  const message = notification.message || "";
  const isAI = message.startsWith("AI diagnosis:");
  

  const displayMessage = isAI ? message.replace("AI diagnosis:", "").trim() : message;

  return (
    <div className={`p-4 rounded-2xl border flex gap-4 items-start transition-all ${
      isAI 
        ? "bg-purple-900/10 border-purple-500/30" 
        : "bg-gray-800/50 border-gray-700"
    }`}>

      <div className={`p-2 rounded-xl shrink-0 ${
        isAI ? "bg-purple-600/20 text-purple-400" : "bg-blue-600/20 text-blue-400"
      }`}>
        {isAI ? <Sparkles size={20} /> : <Bell size={20} />}
      </div>


      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className={`text-sm font-semibold flex items-center gap-1 ${
             isAI ? "text-purple-300" : "text-white"
          }`}>
            {isAI ? (
              <>
                <AlertCircle size={14} className="text-purple-400" />
                Urgent AI Diagnosis
              </>
            ) : (
              "System Notification"
            )}
          </h4>
          <span className="flex items-center gap-1 text-[10px] sm:text-xs text-gray-500 shrink-0">
            <Clock size={11} />
            {formatTime(notification.created_at)}
          </span>
        </div>
        <p className={`text-sm leading-relaxed ${isAI ? 'text-purple-200/90 font-medium' : 'text-gray-300'}`}>
          {displayMessage}
        </p>
      </div>
    </div>
  );
};

const PatientNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await apiGet("/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-6">
        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <Bell className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Notifications
            </h2>
            <p className="text-gray-400 mt-1">Your recent alerts and AI-driven insights</p>
          </div>
        </header>

        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700/50 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800/40 border border-gray-700 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 flex flex-col items-center justify-center text-gray-500">
            <Bell size={32} className="opacity-20 mb-3" />
            <p>You have no notifications right now.</p>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl pb-6">
            {notifications.map((n) => (
              <NotificationCard key={n.noti_id} notification={n} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientNotifications;
