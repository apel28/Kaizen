import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../utils/api";
import Button from "../components/Button";
import { Trash2, Award } from "lucide-react";

const INIT = { degree_name: "", institute: "", year: "", department_name: "" };

function Field({ label, children, wide }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

export default function Qualification() {
  const navigate = useNavigate();
  const [qualifications, setQualifications] = useState([]);
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  // Placeholder for fetching data — API to be added later
  useEffect(() => {
    // Example fetch structure:
    apiGet("/qualification")
      .then(setQualifications)
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMsg({ text: "", ok: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.degree_name || !form.institute || !form.year) {
      setMsg({ text: "Please fill in all required fields.", ok: false });
      return;
    }

    setSaving(true);
    setMsg({ text: "", ok: true });

    try {
      const newQual = await apiPost("/qualification", form);
      setQualifications([newQual, ...qualifications]);
      setForm(INIT);
      setMsg({ text: "Qualification added successfully!", ok: true });
    } catch (err) {
      setMsg({ text: err.message || "Failed to add qualification.", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await apiDelete(`/qualification/${id}`);
      apiGet("/qualification").then(setQualifications).catch(err => console.log(err));
    } catch (err) {
      setMsg({ text: "Failed to remove qualification.", ok: false });
    }
  };

  const input = "w-full bg-gray-900/60 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Segoe_UI',sans-serif]">
      <div className="w-full max-w-4xl mb-6 flex items-center gap-3">
        <Button text="Back" onClick={() => navigate(-1)} />
      </div>

      <div className="w-full max-w-4xl bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm p-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-700">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900/30 shrink-0">
            <Award size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Qualifications
            </h1>
          </div>
        </div>

        {/* Existing Data View */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Added Qualifications</h2>
          {loading ? (
            <div className="animate-pulse flex flex-col gap-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-gray-700/50 rounded-xl" />)}
            </div>
          ) : qualifications.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-gray-900/30 p-4 rounded-xl border border-gray-700">No qualifications found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {qualifications.map((q) => (
                <div key={q.q_id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-200 text-sm">{q.degree_name}</h3>
                    <p className="text-xs text-blue-400 mt-0.5">{q.institute}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {q.department_name && <span className="text-gray-400">{q.department_name} · </span>}
                      Year: {q.year}
                    </p>
                  </div>
                  <button onClick={() => handleRemove(q.q_id)} className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-lg font-semibold mb-5 text-gray-300">Add New Qualification</h2>
          <form onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <Field label="Degree Name" wide>
                <input name="degree_name" value={form.degree_name} onChange={onChange} placeholder="e.g. MBBS, MD, FCPS" className={input} />
              </Field>

              <Field label="Institute" wide>
                <input name="institute" value={form.institute} onChange={onChange} placeholder="e.g. Dhaka Medical College" className={input} />
              </Field>

              <Field label="Passing Year">
                <input type="number" name="year" value={form.year} onChange={onChange} placeholder="e.g. 2012" min="1950" max="2099" className={input} />
              </Field>

              <Field label="Department (Optional)">
                <input name="department_name" value={form.department_name} onChange={onChange} placeholder="e.g. Cardiology" className={input} />
              </Field>
            </div>

            {msg.text && (
              <div className={`mb-5 p-4 rounded-xl text-sm border ${msg.ok ? "bg-green-900/30 border-green-700 text-green-400" : "bg-red-900/30 border-red-700 text-red-400"}`}>
                {msg.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button text={saving ? "Adding…" : "Add Qualification"} type="submit" disabled={saving} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

