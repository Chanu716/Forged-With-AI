"use client";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Zap, Plus, Film, Loader2 } from "lucide-react";

interface Project {
  _id: string;
  topic: string;
  character: string;
  language: string;
  style: string;
  duration: string;
  status: string;
  createdAt: string;
}

const statusMap: Record<string, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "badge-draft" },
  script_generated: { label: "Script Ready", cls: "badge-script" },
  voice_generated: { label: "Voice Ready", cls: "badge-voice" },
  video_ready: { label: "Video Ready", cls: "badge-video" },
  published: { label: "Published", cls: "badge-published" },
};

export default function DashboardPage() {
  const { user } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects?userId=${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProjects(data.projects);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220,
          background: "var(--bg-secondary)",
          borderRight: "1px solid var(--border)",
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", marginBottom: 16 }}>
          <div style={{ background: "linear-gradient(135deg,#7c5cfc,#fc5c7d)", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 16 }}>ReelForge <span className="gradient-text">AI</span></span>
        </div>
        <NavItem href="/dashboard" icon={<Film size={16} />} label="Projects" active />
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
            <UserButton />
            <span style={{ fontSize: 13, color: "var(--text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.firstName ?? "User"}
            </span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ marginLeft: 220, flex: 1, padding: "40px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>My Projects</h1>
            <p style={{ color: "var(--text-secondary)", marginTop: 4, fontSize: 14 }}>
              {projects.length} project{projects.length !== 1 ? "s" : ""} created
            </p>
          </div>
          <Link href="/dashboard/new">
            <button className="btn-primary">
              <Plus size={18} /> New Project
            </button>
          </Link>
        </div>

        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-secondary)", padding: 40 }}>
            <Loader2 size={20} style={{ animation: "spin 0.7s linear infinite" }} /> Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, background: active ? "rgba(124,92,252,0.12)" : "transparent", color: active ? "var(--accent)" : "var(--text-secondary)", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s" }}>
        {icon} {label}
      </div>
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const s = statusMap[project.status] ?? statusMap.draft;
  return (
    <Link href={`/dashboard/projects/${project._id}`} style={{ textDecoration: "none" }}>
      <div className="card fade-in" style={{ padding: 24, cursor: "pointer" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3, flex: 1, marginRight: 10 }}>{project.topic}</div>
          <span className={`badge ${s.cls}`}>{s.label}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          <Tag>{project.language}</Tag>
          <Tag>{project.duration}s</Tag>
          <Tag>{project.style}</Tag>
        </div>
        {project.character && (
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Character: <span style={{ color: "var(--text-secondary)" }}>{project.character}</span>
          </div>
        )}
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12 }}>
          {new Date(project.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </Link>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ background: "rgba(124,92,252,0.08)", border: "1px solid rgba(124,92,252,0.15)", borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>
      {children}
    </span>
  );
}

function EmptyState() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16, textAlign: "center" }}>
      <div style={{ width: 72, height: 72, background: "rgba(124,92,252,0.1)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Film size={32} color="var(--accent)" />
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>No projects yet</h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 15, maxWidth: 340, lineHeight: 1.6 }}>
        Create your first project and let AI generate your reel script, voiceover, and captions.
      </p>
      <Link href="/dashboard/new">
        <button className="btn-primary" style={{ marginTop: 8 }}>
          <Plus size={18} /> Create First Project
        </button>
      </Link>
    </div>
  );
}
