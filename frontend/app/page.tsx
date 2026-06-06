"use client";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(124, 92, 252, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(252, 92, 125, 0.08) 0%, transparent 60%), var(--bg-primary)",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(12px)",
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(10,10,15,0.8)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              background: "linear-gradient(135deg, #7c5cfc, #fc5c7d)",
              borderRadius: 10,
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Zap size={20} color="white" fill="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: "-0.5px" }}>
            ReelForge <span className="gradient-text">AI</span>
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <SignedOut>
            <Link href="/sign-in">
              <button className="btn-secondary" style={{ padding: "8px 20px" }}>
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="btn-primary" style={{ padding: "8px 20px" }}>
                Get Started
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ padding: "8px 20px" }}>
                Dashboard
              </button>
            </Link>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 24px 60px",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,92,252,0.1)",
            border: "1px solid rgba(124,92,252,0.25)",
            borderRadius: 20,
            padding: "6px 16px",
            fontSize: 13,
            color: "var(--accent)",
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          <Zap size={12} fill="currentColor" /> AI-Powered • Script to Video
        </div>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-2px",
            maxWidth: 820,
          }}
        >
          Turn Any Topic Into a{" "}
          <span className="gradient-text">Viral Reel</span> in Seconds
        </h1>
        <p
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          ReelForge AI automates your entire content pipeline — from script to
          voiceover to published reel. No editing skills required.
        </p>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
          <SignedOut>
            <Link href="/sign-up">
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                <Zap size={18} fill="white" /> Start Creating Free
              </button>
            </Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <button className="btn-primary" style={{ fontSize: 16, padding: "14px 32px" }}>
                <Zap size={18} fill="white" /> Go to Dashboard
              </button>
            </Link>
          </SignedIn>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 20,
            marginTop: 80,
            width: "100%",
            maxWidth: 900,
          }}
        >
          {[
            { num: "01", title: "Enter Topic", desc: "Topic, language, style, duration. That's it." },
            { num: "02", title: "AI Generates Script", desc: "4-scene script in your language via Gemini AI." },
            { num: "03", title: "Voiceover Created", desc: "ElevenLabs generates natural-sounding audio." },
            { num: "04", title: "Publish & Go Viral", desc: "Auto-post to Instagram Reels & YouTube Shorts." },
          ].map((step) => (
            <div key={step.num} className="card fade-in" style={{ padding: 28, textAlign: "left" }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--accent)",
                  marginBottom: 12,
                  letterSpacing: "1px",
                }}
              >
                {step.num}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
              <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
