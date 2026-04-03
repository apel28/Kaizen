import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut, Play, Database } from "lucide-react";
import { apiPost } from "../utils/api";

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRunQuery = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults(null);
    try {
      // Sending to /admin/query. Ensure the server has this route implemented.
      const res = await apiPost("/admin/query", { query });
      setResults(res.data);
    } catch (err) {
      setError(err.message || "Query failed to execute.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col font-mono p-8 overflow-hidden">
      
      {/* Background massive letters */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
        <h1 className="text-[25vw] font-black tracking-tighter text-white">ADMIN</h1>
      </div>

      {/* Header */}
      <header className="flex justify-between items-center mb-10 z-10">
        <div className="flex items-center gap-3">
          <Database size={32} className="text-gray-500" />
          <h2 className="text-2xl font-bold tracking-widest text-gray-400">DATABASE_CONSOLE</h2>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-900/40 hover:bg-red-800 text-red-300 transition-colors border border-red-900/50"
        >
          <LogOut size={18} />
          LOGOUT
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10 flex flex-col gap-6 max-w-7xl mx-auto w-full">
        
        {/* Editor Section */}
        <section className="flex flex-col gap-3">
          <label className="text-gray-500 text-sm font-bold tracking-wider">SQL EDITOR</label>
          <div className="relative">
            <textarea
              className="w-full h-48 bg-[#0a0a0a] border border-gray-800 rounded-xl p-5 text-green-400 font-mono text-sm leading-relaxed focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 resize-y transition-all"
              placeholder="SELECT * FROM users LIMIT 10;"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              spellCheck="false"
            />
            <button
              onClick={handleRunQuery}
              disabled={loading || !query.trim()}
              className="absolute bottom-4 right-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Play size={16} fill="currentColor" />
              )}
              RUN
            </button>
          </div>
          {error && (
            <div className="bg-red-950/30 border border-red-900 text-red-400 p-4 rounded-lg text-sm mt-2 font-sans break-all">
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {results && (
          <section className="flex flex-col gap-3 flex-1 overflow-hidden">
            <div className="flex justify-between items-center text-gray-500 text-sm font-bold tracking-wider">
              <label>QUERY RESULTS</label>
              <span className="text-xs font-normal">
                {Array.isArray(results) ? `${results.length} rows returned` : "Query executed successfully"}
              </span>
            </div>
            
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-xl overflow-hidden flex-1 min-h-[300px]">
              <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                {Array.isArray(results) && results.length > 0 ? (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-[#111] sticky top-0 border-b border-gray-800">
                      <tr>
                        {Object.keys(results[0]).map((key) => (
                          <th key={key} className="px-6 py-3 text-gray-400 font-medium tracking-wide">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                      {results.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-900/30 transition-colors">
                          {Object.values(row).map((val, cellIdx) => (
                            <td key={cellIdx} className="px-6 py-3 text-gray-300 font-sans">
                              {val === null ? (
                                <span className="text-gray-600 italic">null</span>
                              ) : typeof val === "object" ? (
                                JSON.stringify(val)
                              ) : (
                                String(val)
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : Array.isArray(results) && results.length === 0 ? (
                  <div className="p-8 text-center text-gray-600 italic">No rows returned.</div>
                ) : (
                  <div className="p-8 font-sans text-gray-300 break-words">
                    <pre className="text-xs text-gray-500">{JSON.stringify(results, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
