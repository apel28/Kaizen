import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Button from "../components/Button";
import { apiGet, apiPost } from "../utils/api";
import { FlaskConical, DollarSign, Hash, CheckCircle, Loader } from "lucide-react";


const SkeletonCard = () => (
  <div className="bg-gray-800/50 border border-gray-700 rounded-2xl h-36 animate-pulse" />
);


const TestCard = ({ order, onOrder }) => {
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered]   = useState(false);
  const [err, setErr]           = useState("");

  const handleOrder = async () => {
    setOrdering(true);
    setErr("");
    try {
      await onOrder(order.test_id, order.visit_id, order.order_id);
      setOrdered(true);
    } catch (e) {
      setErr(e.message);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className={`border rounded-2xl p-5 flex flex-col gap-3 transition-all ${
      ordered
        ? "bg-green-900/10 border-green-700/40"
        : "bg-gray-900/50 border-gray-700 hover:border-blue-500/50"
    }`}>

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical size={18} className="text-blue-400 shrink-0" />
          <p className="text-white font-semibold text-base">{order.test_name}</p>
        </div>
        {ordered && (
          <span className="flex items-center gap-1 shrink-0 text-xs rounded-full px-2 py-0.5 border bg-green-600/20 border-green-500/30 text-green-400">
            <CheckCircle size={11} /> Ordered
          </span>
        )}
      </div>


      <div className="flex flex-wrap gap-2 text-xs">
        {order.price != null && (
          <span className="flex items-center gap-1 bg-gray-800 text-gray-300 px-2 py-1 rounded-lg">
            <DollarSign size={11} className="text-green-400" />
            {Number(order.price).toFixed(2)} BDT
          </span>
        )}
        <span className="flex items-center gap-1 bg-gray-800 text-gray-400 px-2 py-1 rounded-lg">
          <Hash size={11} /> Visit #{order.visit_id}
        </span>
      </div>


      {err && (
        <p className="text-xs text-red-400 bg-red-900/20 border border-red-700/40 rounded-lg px-3 py-1.5">
          {err}
        </p>
      )}


      {!ordered && (
        <div className="flex justify-end mt-auto pt-1">
          <Button
            onClick={handleOrder}
            disabled={ordering}
            text={ordering ? "Ordering…" : "Order Now"}
            type="button"
          />
        </div>
      )}
    </div>
  );
};


const VisitGroup = ({ visitId, orders, onOrder }) => (
  <div className="space-y-3">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-1">
      Visit #{visitId}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {orders.map((o) => (
        <TestCard key={o.order_id} order={o} onOrder={onOrder} />
      ))}
    </div>
  </div>
);


const PatientTestOrders = () => {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");


  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet("/test-orders");
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);


  const handleOrder = async (test_id, visit_id, order_id) => {
    await apiPost("/test-orders/order", { test_id, visit_id, order_id });

    fetchOrders();
  };


  const grouped = orders.reduce((acc, o) => {
    const key = o.visit_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(o);
    return acc;
  }, {});


  const visitIds = [...new Set(orders.map((o) => o.visit_id))];

  return (
    <div className="text-white min-h-screen flex items-start p-4 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Gondens','Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Sidebar />

      <main className="flex-1 ml-6 space-y-6">

        <header className="flex items-center bg-gray-800/50 p-6 rounded-2xl border border-gray-700 backdrop-blur-sm">
          <FlaskConical className="text-blue-400 mr-3" size={28} />
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Lab Tests
            </h2>
            <p className="text-gray-400 mt-1">Tests prescribed by your doctor — order them below</p>
          </div>
        </header>


        {error && (
          <p className="text-sm text-red-400 bg-red-900/20 border border-red-700 rounded-xl px-4 py-3">
            {error}
          </p>
        )}


        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-10 text-center text-gray-500">
            No test orders found.
          </div>
        ) : (
          <div className="space-y-8 pb-6">
            {visitIds.map((vid) => (
              <VisitGroup
                key={vid}
                visitId={vid}
                orders={grouped[vid]}
                onOrder={handleOrder}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientTestOrders;
