import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiDelete } from "../utils/api";
import Button from "../components/Button";
import { Trash2, Briefcase } from "lucide-react";

const INIT = { institute: "", role: "", start_date: "", end_date: "" };

function Field({ label, children, wide }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

export default function Experience() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  useEffect(() => {
    apiGet("/experience").then(setExperiences).catch(err => console.log(err));
    setLoading(false);
  }, []);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMsg({ text: "", ok: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.institute || !form.role || !form.start_date) {
      setMsg({ text: "Please fill in all required fields.", ok: false });
      return;
    }

    setSaving(true);
    setMsg({ text: "", ok: true });

    try {
      const newExp = await apiPost("/experience", form);
      setExperiences([newExp, ...experiences]);
      setForm(INIT);
      setMsg({ text: "Experience added successfully!", ok: true });
    } catch (err) {
      setMsg({ text: err.message || "Failed to add experience.", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (e_id) => {
    try {
      await apiDelete(`/experience/${e_id}`);
      apiGet("/experience").then(setExperiences).catch(err => console.log(err));
    } catch (err) {
      setMsg({ text: "Failed to remove experience.", ok: false });
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
            <Briefcase size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Experience
            </h1>
          </div>
        </div>

        {/* Existing Data View */}
        <div className="mb-10">
          <h2 className="text-lg font-semibold mb-4 text-gray-300">Added Experience</h2>
          {loading ? (
            <div className="animate-pulse flex flex-col gap-3">
              {[1, 2].map(i => <div key={i} className="h-16 bg-gray-700/50 rounded-xl" />)}
            </div>
          ) : experiences.length === 0 ? (
            <p className="text-sm text-gray-500 italic bg-gray-900/30 p-4 rounded-xl border border-gray-700">No experience records found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {experiences.map((exp) => (
                <div key={exp.e_id} className="flex items-center justify-between p-4 bg-gray-900/60 border border-gray-700 rounded-xl hover:border-blue-500/50 transition-colors">
                  <div>
                    <h3 className="font-bold text-gray-200 text-sm">{exp.institute}</h3>
                    <p className="text-xs text-blue-400 mt-0.5">{exp.role}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(exp.start_date).toLocaleDateString()} — {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : "Present"}
                    </p>
                  </div>
                  <button onClick={() => handleRemove(exp.e_id)} className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Remove">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Form */}
        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-lg font-semibold mb-5 text-gray-300">Add New Experience</h2>
          <form onSubmit={onSubmit} noValidate>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <Field label="Institute Name" wide>
                <input name="institute" value={form.institute} onChange={onChange} placeholder="e.g. City General Hospital" className={input} />
              </Field>

              <Field label="Role" wide>
                <input name="role" value={form.role} onChange={onChange} placeholder="e.g. Resident Doctor" className={input} />
              </Field>

              <Field label="Start Date">
                <input type="date" name="start_date" value={form.start_date} onChange={onChange} className={input + " [color-scheme:dark]"} />
              </Field>

              <Field label="End Date (Leave empty if currently working)">
                <input type="date" name="end_date" value={form.end_date} onChange={onChange} className={input + " [color-scheme:dark]"} />
              </Field>
            </div>

            {msg.text && (
              <div className={`mb-5 p-4 rounded-xl text-sm border ${msg.ok ? "bg-green-900/30 border-green-700 text-green-400" : "bg-red-900/30 border-red-700 text-red-400"}`}>
                {msg.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button text={saving ? "Adding…" : "Add Experience"} type="submit" disabled={saving} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
