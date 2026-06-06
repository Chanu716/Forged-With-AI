"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Zap, Mic, PlayCircle, Loader2, CheckCircle2, Clock } from "lucide-react";

interface Scene {
  visualPrompt: string;
  dialogue: string;
  timing: string;
  audioUrl?: string;
}
interface Script {
  scene1: Scene;
  scene2: Scene;
  scene3: Scene;
  scene4: Scene;
}
interface Project {
  _id: string;
  topic: string;
  character: string;
  language: string;
  style: string;
  duration: string;
  status: string;
}

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProjectDetailPage() {
  const { id } = useParams() as { id: string };
  const [project, setProject] = useState<Project | null>(null);
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingScript, setGeneratingScript] = useState(false);
  const [generatingVoice, setGeneratingVoice] = useState(false);
  const [error, setError] = useState("");

  const fetchProject = async () => {
    try {
      const res = await fetch(`${API}/api/projects/${id}`);
      const data = await res.json();
      if (data.success) {
        setProject(data.project);
        setScript(data.script);
      }
    } catch {
      setError("Could not load project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const generateScript = async () => {
    setGeneratingScript(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/projects/${id}/generate-script`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setScript(data.script);
        setProject((p) => p ? { ...p, status: "script_generated" } : p);
      } else {
        setError(data.error ?? data.message ?? "Script generation failed.");
      }
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setGeneratingScript(false);
    }
  };

  const generateVoice = async () => {
    setGeneratingVoice(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/projects/${id}/generate-voice`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setScript(data.script);
        setProject((p) => p ? { ...p, status: "voice_generated" } : p);
      } else {
        setError(data.error ?? data.message ?? "Voice generation failed.");
      }
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setGeneratingVoice(false);
    }
  };

  if (loading) return <LoadingState />;
  if (!project) return <div style={{ padding: 40, color: "var(--text-secondary)" }}>Project not found.</div>;

  const scenes: Array<{ key: keyof Script; label: string }> = [
    { key: "scene1", label: "Scene 1" },
    { key: "scene2", label: "Scene 2" },
    { key: "scene3", label: "Scene 3" },
    { key: "scene4", label: "Scene 4" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", padding: "40px 48px", maxWidth: 900, margin: "0 auto" }}>
      <Link href="/dashboard" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14, marginBottom: 28 }}>
        <ArrowLeft size={15} /> Back to Dashboard
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1.2 }}>{project.topic}</h1>
        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          <Tag>{project.language}</Tag>
          <Tag>{project.duration}s</Tag>
          <Tag>{project.style}</Tag>
          {project.character && <Tag>👤 {project.character}</Tag>}
        </div>
      </div>

      {error && (
        <div style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", borderRadius: 8, padding: "12px 16px", color: "var(--error)", fontSize: 14, marginBottom: 24 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Action Bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={generateScript} disabled={generatingScript || generatingVoice}>
          {generatingScript
            ? <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Generating Script...</>
            : <><Zap size={16} fill="white" /> {script ? "Regenerate Script" : "Generate Script"}</>}
        </button>
        {script && (
          <button className="btn-secondary" onClick={generateVoice} disabled={generatingVoice || generatingScript}>
            {generatingVoice
              ? <><Loader2 size={16} style={{ animation: "spin 0.7s linear infinite" }} /> Generating Voice...</>
              : <><Mic size={16} /> Generate Voiceover</>}
          </button>
        )}
      </div>

      {/* Script Scenes */}
      {script ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {scenes.map(({ key, label }, i) => {
            const scene = script[key] as Scene;
            return (
              <div key={key} className="card fade-in" style={{ padding: 28, animationDelay: `${i * 0.07}s` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)", borderRadius: 8, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white" }}>
                      {i + 1}
                    </div>
                    <span style={{ fontWeight: 700, fontSize: 16 }}>{label}</span>
                  </div>
                  {scene?.timing && (
                    <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-muted)", background: "var(--bg-secondary)", padding: "4px 10px", borderRadius: 6 }}>
                      <Clock size={12} /> {scene.timing}
                    </span>
                  )}
                </div>

                {scene?.visualPrompt && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>Visual Prompt</div>
                    <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, background: "var(--bg-secondary)", padding: "12px 14px", borderRadius: 8 }}>
                      {scene.visualPrompt}
                    </div>
                  </div>
                )}

                {scene?.dialogue && (
                  <div style={{ marginBottom: scene?.audioUrl ? 16 : 0 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-secondary)", letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 6 }}>Dialogue</div>
                    <div style={{ fontSize: 15, lineHeight: 1.7, fontWeight: 500 }}>{scene.dialogue}</div>
                  </div>
                )}

                {scene?.audioUrl && (
                  <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
                    <CheckCircle2 size={16} color="var(--success)" />
                    <span style={{ fontSize: 13, color: "var(--success)", fontWeight: 600 }}>Voiceover ready</span>
                    <audio controls src={`${API}${scene.audioUrl}`} style={{ flex: 1, height: 36, accentColor: "var(--accent)" }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 24px", gap: 14, textAlign: "center" }}>
          <PlayCircle size={48} color="var(--text-muted)" />
          <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
            No script yet. Click <strong>Generate Script</strong> above to get started.
          </p>
        </div>
      )}
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.15)", borderRadius: 6, padding: "4px 12px", fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>
      {children}
    </span>
  );
}

function LoadingState() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--text-secondary)" }}>
      <Loader2 size={22} style={{ animation: "spin 0.7s linear infinite" }} /> Loading project...
    </div>
  );
}
