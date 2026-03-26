import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiPut } from "../utils/api";
import Button from "../components/Button";

const INIT = {
  first_name: "", middle_name: "", last_name: "",
  date_of_birth: "", gender: "", nationality: "",
  address: "", contact_info: "",
};

function Field({ label, children, wide }) {
  return (
    <div className={wide ? "md:col-span-2" : ""}>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

export default function DoctorProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INIT);
  const [nid, setNid] = useState("—");
  const [specialization, setSpecialization] = useState("—");
  const [doctorId, setDoctorId] = useState("—");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", ok: true });

  useEffect(() => {
    apiGet("/profile")
      .then((d) => {
        setForm({
          first_name:    d.first_name    ?? "",
          middle_name:   d.middle_name   ?? "",
          last_name:     d.last_name     ?? "",
          date_of_birth: d.date_of_birth ? d.date_of_birth.split("T")[0] : "",
          gender:        d.gender ? d.gender.charAt(0).toUpperCase() + d.gender.slice(1).toLowerCase() : "",
          nationality:   d.nationality   ?? "",
          address:       d.address       ?? "",
          contact_info:  d.contact_info  ?? "",
        });
        setNid(d.nid ?? "—");
        setSpecialization(d.specialization ?? "—");
        setDoctorId(d.doctor_id ?? "—");
      })
      .catch((e) => setMsg({ text: e.message || "Failed to load.", ok: false }))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setMsg({ text: "", ok: true });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: "", ok: true });

    const formatTitleCase = (str) => {
      if (!str) return "";
      return str.trim().split(/\s+/).map((w) =>
        w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
      ).join(" ");
    };

    const payload = { ...form };
    ["first_name", "middle_name", "last_name", "nationality", "gender"].forEach((k) => {
      if (typeof payload[k] === "string") payload[k] = formatTitleCase(payload[k]);
    });

    try {
      await apiPut("/profile", { ...payload, nid });
      setMsg({ text: "Profile updated successfully!", ok: true });
    } catch (err) {
      setMsg({ text: err.message || "Failed to update.", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const input = "w-full bg-gray-900/60 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";
  const initials = [form.first_name, form.last_name].filter(Boolean).map((n) => n[0]).join("").toUpperCase() || "—";

  return (
    <div className="text-white min-h-screen flex flex-col items-center p-6 bg-gradient-to-br from-[#0a0a3a] to-black bg-fixed font-['Segoe_UI',sans-serif]">
      {/* Top nav row */}
      <div className="w-full max-w-4xl mb-6 flex items-center gap-3">
        <Button text="Back" onClick={() => navigate(-1)} />
        <Button text="Experience"   onClick={() => navigate("/DoctorDashboard/Experience")} />
        <Button text="Qualification" onClick={() => navigate("/DoctorDashboard//Qualification")} />
      </div>

      <div className="w-full max-w-4xl bg-gray-800/50 rounded-2xl border border-gray-700 backdrop-blur-sm p-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-700">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900/30 shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Doctor Profile
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">ID: #{doctorId} · {specialization}</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-14 bg-gray-700/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate>
            {/* Read-only NID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <Field label="National ID (NID)">
                <div className="w-full bg-gray-900/30 border border-gray-700 rounded-xl px-4 py-2.5 text-gray-400 text-sm cursor-not-allowed">
                  {nid}
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {[
                { name: "first_name",    label: "First Name" },
                { name: "middle_name",   label: "Middle Name" },
                { name: "last_name",     label: "Last Name" },
                { name: "date_of_birth", label: "Date of Birth", type: "date" },
                { name: "nationality",   label: "Nationality" },
              ].map(({ name, label, type = "text" }) => (
                <Field key={name} label={label}>
                  <input name={name} type={type} value={form[name]} onChange={onChange}
                    placeholder={`Enter ${label.toLowerCase()}`} className={input} />
                </Field>
              ))}

              <Field label="Gender">
                <select name="gender" value={form.gender} onChange={onChange} className={input + " appearance-none"} disabled>
                  <option value="">Gender</option>
                  {["Male", "Female", "Other"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </Field>

              <Field label="Address" wide>
                <input name="address" value={form.address} onChange={onChange}
                  placeholder="Enter address" className={input} />
              </Field>

              <Field label="Contact Info">
                <input name="contact_info" value={form.contact_info} onChange={onChange}
                  placeholder="Enter contact info" className={input} />
              </Field>
            </div>

            {msg.text && (
              <div className={`mb-5 p-4 rounded-xl text-sm border ${msg.ok ? "bg-green-900/30 border-green-700 text-green-400" : "bg-red-900/30 border-red-700 text-red-400"}`}>
                {msg.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button text={saving ? "Saving…" : "Save Changes"} type="submit" disabled={saving} />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
