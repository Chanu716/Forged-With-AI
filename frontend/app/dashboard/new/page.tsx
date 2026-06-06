"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";

const LANGUAGES = ["Telugu", "Tamil", "Hindi", "Kannada", "Malayalam", "English"];
const STYLES = ["Funny + Emotional", "Educational", "Motivational", "Storytelling", "Comedy", "Dramatic"];

export default function NewProjectPage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    topic: "",
    character: "",
    language: "Telugu",
    duration: "32",
    style: "Funny + Emotional",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return setError("Topic is required.");
    if (!user?.id) return setError("Please sign in first.");

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/projects/${data.project._id}`);
      } else {
        setError(data.message ?? "Failed to create project.");
      }
    } catch {
      setError("Could not connect to backend. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        {/* Back */}
        <Link href="/dashboard" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14, marginBottom: 28, transition: "color 0.15s" }}>
          <ArrowLeft size={15} /> Back to Dashboard
        </Link>

        <div className="card" style={{ padding: 40 }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <div style={{ background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Zap size={20} color="white" fill="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.3px" }}>New Project</h1>
              <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Fill in the details to generate your reel</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Topic *" hint="What is your reel about?">
              <input name="topic" value={form.topic} onChange={handleChange} className="input-field" placeholder="e.g. Banana Leaf Benefits" />
            </Field>

            <Field label="Character" hint="Who is presenting? (optional)">
              <input name="character" value={form.character} onChange={handleChange} className="input-field" placeholder="e.g. Arati Aaku (Talking Banana Leaf)" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field label="Language">
                <select name="language" value={form.language} onChange={handleChange} className="input-field">
                  {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
                </select>
              </Field>

              <Field label="Duration (seconds)">
                <input name="duration" value={form.duration} onChange={handleChange} type="number" min={15} max={60} className="input-field" placeholder="32" />
              </Field>
            </div>

            <Field label="Style / Tone">
              <select name="style" value={form.style} onChange={handleChange} className="input-field">
                {STYLES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>

            {error && (
              <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "12px 16px", color: "var(--error)", fontSize: 14 }}>
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8, justifyContent: "center" }}>
              {loading ? <><Loader2 size={18} style={{ animation: "spin 0.7s linear infinite" }} /> Creating Project...</> : <><Zap size={18} fill="white" /> Create Project</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
        {label}
        {hint && <span style={{ fontWeight: 400, marginLeft: 6, color: "var(--text-muted)" }}>{hint}</span>}
      </label>
      {children}
    </div>
  );
}
