import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { apiGet } from "../utils/api";
import { Receipt, DollarSign, CreditCard, Clock, FileText } from "lucide-react";


const BillCard = ({ bill }) => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-5 hover:bg-gray-800/80 transition-all group">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
          <Receipt size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">{bill.bill_name}</h3>
          <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
            <Clock size={12} /> Bill ID: #{bill.bill_id}
          </p>
        </div>
      </div>
      
      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
        <div className="flex items-center text-2xl font-bold text-green-400">
          <DollarSign size={20} />
          {bill.bill_amount}
        </div>
        <span className="px-3 py-1 rounded-full text-[10px] font-uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
          INVOICED
        </span>
      </div>
    </div>
  </div>
);


const PatientBills = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    apiGet("/patient-data/bills")
      .then((res) => {
        setBills(res.bills || []);
      })
      .catch((err) => {
        console.error("Error fetching bills:", err);
        setError(err.message || "Failed to load bills. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-5">
        <header className="flex items-center justify-between bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center">
            <Receipt className="text-blue-400 mr-3" size={28} />
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Billing & Invoices
              </h2>
              <p className="text-gray-400 mt-1">View and manage your medical expenses</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-blue-600/20 px-4 py-2 rounded-xl border border-blue-500/30">
            <CreditCard size={20} className="text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Secure Payments</span>
          </div>
        </header>

        {error && (
          <div className="flex items-center gap-3 text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">
            <FileText size={18} />
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-2xl h-24 animate-pulse" />
            ))}
          </div>
        ) : bills.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-16 text-center space-y-4 backdrop-blur-sm">
            <p className="text-gray-500 max-w-xs mx-auto">
              You don't have past bills at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pb-10">
            {bills.map((bill) => (
              <BillCard key={bill.bill_id} bill={bill} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientBills;
