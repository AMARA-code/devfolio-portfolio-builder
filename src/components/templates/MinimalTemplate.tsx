"use client";

import { useState, useRef } from "react";
import React from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Skill {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  featured?: boolean;
  description: string;
  thumbnail_url: string | null;
  live_url: string | null;
  github_url: string | null;
  tech_stack: string[];
}

interface Experience {
  id: string;
  role: string;
  company: string;
  location?: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description?: string;
  skills?: string[];
}

interface Education {
  id: string;
  degree: string;
  field?: string;
  institution: string;
  start_year: string;
  end_year: string;
  gpa?: string;
  description?: string;
  achievements?: string[];
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  year?: string;
  url?: string;
}

export interface PortfolioData {
  full_name: string;
  username: string;
  bio: string;
  avatar_url: string | null;
  email: string;
  location: string;
  website: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  skills: Skill[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
  certifications?: Certification[];
}

type Page = "home" | "projects" | "experience" | "education";

// ─── SAMPLE DATA ────────────────────────────────────────────────────────────
const SAMPLE_DATA: PortfolioData = {
  full_name: "Alex Rivera",
  username: "alexrivera",
  bio: "Full-stack developer obsessed with clean architecture, great UX, and shipping things that matter. 5+ years building products people actually use.",
  avatar_url: null,
  email: "alex@example.com",
  location: "San Francisco, CA",
  website: "https://alexrivera.dev",
  github_url: "https://github.com/alexrivera",
  linkedin_url: "https://linkedin.com/in/alexrivera",
  twitter_url: "https://twitter.com/alexrivera",
  skills: [
    { id: "1", name: "React" }, { id: "2", name: "TypeScript" },
    { id: "3", name: "Node.js" }, { id: "4", name: "Next.js" },
    { id: "5", name: "PostgreSQL" }, { id: "6", name: "Tailwind CSS" },
    { id: "7", name: "GraphQL" }, { id: "8", name: "Docker" },
    { id: "9", name: "AWS" }, { id: "10", name: "Python" },
  ],
  projects: [
    {
      id: "1", title: "DevFlow", featured: true,
      description: "A real-time collaborative code review platform with inline comments, CI/CD integration, and AI-powered suggestions. Used by 2k+ teams.",
      thumbnail_url: null, live_url: "https://devflow.app",
      github_url: "https://github.com/alexrivera/devflow",
      tech_stack: ["React", "TypeScript", "Node.js", "WebSockets", "PostgreSQL"],
    },
    {
      id: "2", title: "Cartographer",
      description: "An open-source API documentation tool that auto-generates beautiful, interactive docs from OpenAPI specs. 1.2k GitHub stars.",
      thumbnail_url: null, live_url: "https://cartographer.dev",
      github_url: "https://github.com/alexrivera/cartographer",
      tech_stack: ["Next.js", "TypeScript", "Tailwind CSS"],
    },
    {
      id: "3", title: "Pulse Analytics",
      description: "Lightweight product analytics SDK — drop-in replacement for heavyweight tools. Privacy-first, no cookies, GDPR compliant.",
      thumbnail_url: null, live_url: null,
      github_url: "https://github.com/alexrivera/pulse",
      tech_stack: ["TypeScript", "Node.js", "ClickHouse", "Docker"],
    },
  ],
  experience: [
    {
      id: "1", role: "Senior Software Engineer", company: "Vercel",
      location: "Remote", start_date: "Jan 2022", end_date: null,
      is_current: true,
      description: "Building the edge runtime and improving cold-start performance. Reduced build times by 40% through parallelization strategies.",
      skills: ["Next.js", "Rust", "Edge Computing"],
    },
    {
      id: "2", role: "Software Engineer", company: "Stripe",
      location: "San Francisco, CA", start_date: "Mar 2020", end_date: "Dec 2021",
      is_current: false,
      description: "Worked on the Payments API team, handling millions of transactions daily. Led the migration to a new idempotency system.",
      skills: ["Ruby", "Go", "PostgreSQL", "Kafka"],
    },
    {
      id: "3", role: "Frontend Developer", company: "Figma",
      location: "San Francisco, CA", start_date: "Jun 2018", end_date: "Feb 2020",
      is_current: false,
      description: "Built core editor features and the plugin marketplace. Shipped the auto-layout feature used by millions of designers.",
      skills: ["TypeScript", "WebGL", "React"],
    },
  ],
  education: [
    {
      id: "1", degree: "B.S. Computer Science", field: "Computer Science",
      institution: "UC Berkeley", start_year: "2014", end_year: "2018",
      gpa: "3.8", description: "Specialized in distributed systems and HCI.",
      achievements: ["Dean's List 3 years", "ACM Programming Team captain"],
    },
  ],
  certifications: [
    { id: "1", name: "AWS Solutions Architect", issuer: "Amazon Web Services", year: "2023", url: "#" },
    { id: "2", name: "CKA: Certified Kubernetes Administrator", issuer: "CNCF", year: "2022", url: "#" },
  ],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#e2e8f0", fontWeight: 700,
        fontSize: size * 0.38, flexShrink: 0,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {name?.charAt(0)?.toUpperCase()}
    </div>
  );
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Projects", page: "projects" },
  { label: "Experience", page: "experience" },
  { label: "Education", page: "education" },
];

function Nav({ data, currentPage, onNavigate }: { data: PortfolioData; currentPage: Page; onNavigate: (p: Page) => void }) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(0,0,0,0.07)",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{
        maxWidth: 980, margin: "0 auto",
        padding: "0 clamp(14px,4vw,24px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 56,
      }}>
        <button onClick={() => onNavigate("home")}
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <Avatar name={data.full_name} size={32} />
          <span style={{ fontWeight: 600, fontSize: 14, color: "#0f172a" }}>{data.full_name}</span>
        </button>

        <nav style={{ display: "flex", gap: 2 }}>
          {NAV_ITEMS.map(({ label, page }) => (
            <button key={page} onClick={() => onNavigate(page)}
              style={{
                padding: "6px 14px", borderRadius: 8, border: "none",
                cursor: "pointer", fontSize: 13.5, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                background: currentPage === page ? "#0f172a" : "transparent",
                color: currentPage === page ? "#fff" : "#64748b",
                transition: "all 0.15s",
              }}>
              {label}
            </button>
          ))}
        </nav>

        {data.email && (
          <a href={`mailto:${data.email}`}
            style={{
              fontSize: 13, fontWeight: 600, padding: "7px 16px",
              borderRadius: 8, background: "#6366f1", color: "#fff",
              textDecoration: "none", transition: "background 0.15s",
            }}>
            Hire Me
          </a>
        )}
      </div>
    </header>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <footer style={{
      borderTop: "1px solid #e2e8f0",
      background: "#fff",
      padding: "32px 24px",
      fontFamily: "'DM Sans', sans-serif",
      marginTop: 64,
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center" }}>
          {NAV_ITEMS.map(({ label, page }) => (
            <button key={page} onClick={() => onNavigate(page)}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif" }}>
              {label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#cbd5e1" }}>
          {data.full_name} · {new Date().getFullYear()} · Built with Portfolio Builder
        </p>
      </div>
    </footer>
  );
}

// ─── PAGE WRAPPER ─────────────────────────────────────────────────────────────
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: 980, margin: "0 auto",
      padding: "clamp(28px,6vw,48px) clamp(14px,4vw,24px) 32px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {children}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <PageWrapper>
      {/* Hero */}
      <div style={{
        borderRadius: 20,
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #1a1a2e 100%)",
        padding: "clamp(28px,6vw,52px) clamp(18px,5vw,48px)",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
        marginBottom: 24,
      }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(99,102,241,0.15)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: "40%", width: 140, height: 140, borderRadius: "50%", background: "rgba(139,92,246,0.12)", pointerEvents: "none" }} />

        <div style={{ position: "relative" }}>
          <span style={{
            display: "inline-block", fontSize: 11, fontWeight: 600,
            letterSpacing: "0.15em", textTransform: "uppercase",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
            padding: "4px 12px", borderRadius: 20, color: "rgba(255,255,255,0.75)", marginBottom: 20,
          }}>
            Developer Portfolio
          </span>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 800, margin: "0 0 6px", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {data.full_name}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", margin: "0 0 20px", fontSize: 15 }}>@{data.username}</p>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "rgba(255,255,255,0.78)", maxWidth: 540, margin: "0 0 32px" }}>
            {data.bio}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("projects")}
              style={{
                background: "#fff", color: "#0f172a", border: "none",
                padding: "10px 22px", borderRadius: 10, fontWeight: 700,
                fontSize: 13.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
              View Projects
            </button>
            <button onClick={() => onNavigate("experience")}
              style={{
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "10px 22px", borderRadius: 10, fontWeight: 500,
                fontSize: 13.5, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
              }}>
              Experience
            </button>
            {data.email && (
              <a href={`mailto:${data.email}`}
                style={{
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  padding: "10px 22px", borderRadius: 10, fontWeight: 500,
                  fontSize: 13.5, textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                }}>
                Get in Touch
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { v: data.projects.length, l: "Projects" },
          { v: data.skills.length, l: "Skills" },
          { v: data.experience.length, l: "Roles" },
          { v: data.education.length, l: "Degrees" },
        ].map(({ v, l }) => (
          <div key={l} style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: 14, padding: "18px 12px", textAlign: "center",
          }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>{v}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "4px 0 0" }}>{l}</p>
          </div>
        ))}
      </div>

      {/* About + Skills row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>About</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { l: "Location", v: data.location },
              { l: "Email", v: data.email, link: `mailto:${data.email}` },
              { l: "Website", v: data.website, link: data.website },
              { l: "GitHub", v: data.github_url ? "View Profile →" : null, link: data.github_url },
            ].map(({ l, v, link }) => v && (
              <div key={l} style={{ display: "flex", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151", minWidth: 70 }}>{l}:</span>
                {link
                  ? <a href={link} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#6366f1", textDecoration: "none" }}>{v}</a>
                  : <span style={{ fontSize: 13, color: "#64748b" }}>{v}</span>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Skills</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map((s) => (
              <span key={s.id} style={{
                background: "#eef2ff", border: "1px solid #c7d2fe",
                color: "#4338ca", fontSize: 12.5, fontWeight: 600,
                padding: "4px 12px", borderRadius: 20,
              }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 }}>Featured Projects</h2>
          <button onClick={() => onNavigate("projects")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#6366f1", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            All projects →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {data.projects.slice(0, 2).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      {/* Experience preview */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Experience</h2>
          <button onClick={() => onNavigate("experience")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#6366f1", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Full history →
          </button>
        </div>
        <ol style={{ listStyle: "none", margin: 0, padding: 0, paddingLeft: 20, borderLeft: "2px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 20 }}>
          {data.experience.slice(0, 2).map((item) => (
            <li key={item.id} style={{ position: "relative" }}>
              <div style={{
                position: "absolute", left: -25, top: 4,
                width: 10, height: 10, borderRadius: "50%",
                background: item.is_current ? "#6366f1" : "#cbd5e1",
                border: "2px solid #fff",
                boxShadow: item.is_current ? "0 0 0 2px #c7d2fe" : "0 0 0 2px #e2e8f0",
              }} />
              <p style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", margin: "0 0 2px" }}>{item.role}</p>
              <p style={{ fontSize: 13, color: "#6366f1", fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                {item.start_date} – {item.is_current ? "Present" : item.end_date}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Contact */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 14px" }}>Contact</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
          {data.email && <a href={`mailto:${data.email}`} style={{ fontSize: 13.5, color: "#6366f1", fontWeight: 600, textDecoration: "none" }}>{data.email}</a>}
          {data.linkedin_url && <a href={data.linkedin_url} target="_blank" rel="noreferrer" style={{ fontSize: 13.5, color: "#475569", fontWeight: 600, textDecoration: "none" }}>LinkedIn →</a>}
          {data.twitter_url && <a href={data.twitter_url} target="_blank" rel="noreferrer" style={{ fontSize: 13.5, color: "#475569", fontWeight: 600, textDecoration: "none" }}>Twitter →</a>}
          {data.github_url && <a href={data.github_url} target="_blank" rel="noreferrer" style={{ fontSize: 13.5, color: "#475569", fontWeight: 600, textDecoration: "none" }}>GitHub →</a>}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", border: "1px solid #e2e8f0",
        borderRadius: 16, overflow: "hidden",
        transition: "transform 0.18s, box-shadow 0.18s",
        transform: hovered ? "translateY(-3px)" : "none",
        boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)",
      }}
    >
      {project.thumbnail_url ? (
        <a
          href={project.live_url ?? "#"}
          target={project.live_url ? "_blank" : "_self"}
          rel="noreferrer"
          style={{ display: "block", position: "relative", overflow: "hidden" }}
        >
          <img
            src={project.thumbnail_url}
            alt={project.title}
            style={{
              width: "100%", height: 180, objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.3s",
            }}
          />
          {project.live_url && hovered && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(15,23,42,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                background: "#fff", color: "#0f172a",
                fontSize: 12, fontWeight: 700,
                padding: "6px 14px", borderRadius: 20,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Visit site ↗
              </span>
            </div>
          )}
        </a>
      ) : (
        <a
          href={project.live_url ?? "#"}
          target={project.live_url ? "_blank" : "_self"}
          rel="noreferrer"
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            height: 180, background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            position: "relative", overflow: "hidden",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 48, color: "#cbd5e1", fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>
            {project.title.charAt(0)}
          </span>
          {project.live_url && hovered && (
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(15,23,42,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                background: "#fff", color: "#0f172a",
                fontSize: 12, fontWeight: 700,
                padding: "6px 14px", borderRadius: 20,
                fontFamily: "'DM Sans', sans-serif",
              }}>
                Visit site ↗
              </span>
            </div>
          )}
        </a>
      )}

      <div style={{ padding: "18px 18px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.3 }}>{project.title}</h3>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "#eef2ff", color: "#4338ca", textDecoration: "none", border: "1px solid #c7d2fe" }}>
                Live ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: "#f8fafc", color: "#475569", textDecoration: "none", border: "1px solid #e2e8f0" }}>
                Code
              </a>
            )}
          </div>
        </div>
        <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: "0 0 12px" }}>{project.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tech_stack.map((t) => (
            <span key={t} style={{ fontSize: 11, color: "#64748b", background: "#f1f5f9", padding: "3px 9px", borderRadius: 20, fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

// ─── ADD PROJECT MODAL ────────────────────────────────────────────────────────
interface AddProjectModalProps {
  onClose: () => void;
  onAdd: (project: Project) => void;
}

function AddProjectModal({ onClose, onAdd }: AddProjectModalProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: "", description: "", live_url: "", github_url: "", tech_stack_raw: "" });
  const [preview, setPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File | null | undefined) => {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === "string") {
        setPreview(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd({
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      thumbnail_url: preview || null,
      tech_stack: form.tech_stack_raw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    border: "1px solid #e2e8f0", borderRadius: 10,
    padding: "10px 14px", fontSize: 13.5, color: "#0f172a",
    background: "#f8fafc", outline: "none",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,23,42,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, backdropFilter: "blur(4px)",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: 28,
        width: "100%", maxWidth: 520, maxHeight: "90vh",
        overflowY: "auto", boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Add Project</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#94a3b8", lineHeight: 1 }}>✕</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Screenshot</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${dragging ? "#6366f1" : "#e2e8f0"}`,
                borderRadius: 12, cursor: "pointer",
                background: dragging ? "#eef2ff" : "#fafafa",
                transition: "all 0.15s", overflow: "hidden",
                minHeight: preview ? "auto" : 120,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {preview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", display: "block" }} />
                  <button
                    onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(255,255,255,0.9)", border: "none",
                      borderRadius: "50%", width: 28, height: 28,
                      cursor: "pointer", fontSize: 13, color: "#475569",
                    }}>✕</button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 16px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#64748b" }}>Drop image or click to upload</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#94a3b8" }}>PNG, JPG, WebP</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input style={inputStyle} placeholder="My Awesome Project"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Description</label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} rows={3}
              placeholder="What does this project do?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Live URL</label>
              <input style={inputStyle} placeholder="https://..." type="url"
                value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>GitHub URL</label>
              <input style={inputStyle} placeholder="https://github.com/..." type="url"
                value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Tech Stack</label>
            <input style={inputStyle} placeholder="React, TypeScript, Tailwind (comma separated)"
              value={form.tech_stack_raw} onChange={(e) => setForm({ ...form, tech_stack_raw: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onClose}
            style={{ padding: "9px 18px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontSize: 13.5, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Cancel
          </button>
          <button onClick={submit} disabled={!form.title.trim()}
            style={{
              padding: "9px 22px", borderRadius: 10, border: "none",
              background: form.title.trim() ? "#0f172a" : "#e2e8f0",
              color: form.title.trim() ? "#fff" : "#94a3b8",
              fontSize: 13.5, fontWeight: 700, cursor: form.title.trim() ? "pointer" : "not-allowed",
              fontFamily: "'DM Sans', sans-serif",
            }}>
            Add Project
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
function ProjectsPage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const [projects, setProjects] = useState<Project[]>(data.projects);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const allTechs = [...new Set(projects.flatMap((p) => p.tech_stack))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.tech_stack.includes(filter));

  return (
    <PageWrapper>
      {showModal && <AddProjectModal onClose={() => setShowModal(false)} onAdd={(p) => setProjects([p, ...projects])} />}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div>
          <button onClick={() => onNavigate("home")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", padding: 0, marginBottom: 8 }}>
            ← {data.full_name}
          </button>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Projects</h1>
          <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{
            marginTop: 24, background: "#0f172a", color: "#fff", border: "none",
            padding: "10px 20px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>
          + Add Project
        </button>
      </div>

      {allTechs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 24px" }}>
          {["all", ...allTechs].map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid",
                fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                background: filter === t ? (t === "all" ? "#0f172a" : "#6366f1") : "#fff",
                color: filter === t ? "#fff" : "#64748b",
                borderColor: filter === t ? "transparent" : "#e2e8f0",
              }}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: 15, color: "#94a3b8" }}>No projects found for this filter.</p>
        </div>
      )}
    </PageWrapper>
  );
}

// ─── EXPERIENCE PAGE ──────────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  items: Experience[];
  accent: string;
}

function ExperienceSection({ title, items, accent }: SectionProps) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, margin: "0 0 20px" }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, flexShrink: 0 }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%",
                background: item.is_current ? "#6366f1" : "#cbd5e1",
                border: "2px solid #fff",
                boxShadow: `0 0 0 2px ${item.is_current ? "#c7d2fe" : "#e2e8f0"}`,
              }} />
              <div style={{ width: 2, flex: 1, background: "#e2e8f0", marginTop: 4, minHeight: 20 }} />
            </div>
            <div style={{
              flex: 1, background: "#fff", border: "1px solid #e2e8f0",
              borderRadius: 14, padding: 20, marginBottom: 12,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", margin: "0 0 2px" }}>{item.role}</h3>
                  <p style={{ fontSize: 13.5, color: "#6366f1", fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
                  {item.location && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>📍 {item.location}</p>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  {item.is_current && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#eef2ff", color: "#4338ca", border: "1px solid #c7d2fe", padding: "3px 10px", borderRadius: 20 }}>
                      Current
                    </span>
                  )}
                  <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                    {item.start_date} – {item.is_current ? "Present" : item.end_date}
                  </span>
                </div>
              </div>
              {item.description && (
                <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65, margin: "12px 0 0" }}>{item.description}</p>
              )}
              {item.skills && item.skills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                  {item.skills.map((s) => (
                    <span key={s} style={{ fontSize: 11, background: "#f1f5f9", color: "#64748b", padding: "3px 9px", borderRadius: 20, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperiencePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const current = data.experience.filter((e) => e.is_current);
  const past = data.experience.filter((e) => !e.is_current);

  return (
    <PageWrapper>
      <button onClick={() => onNavigate("home")}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", padding: "0 0 8px" }}>
        ← {data.full_name}
      </button>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Experience</h1>
      <p style={{ fontSize: 13.5, color: "#94a3b8", margin: "0 0 32px" }}>{data.experience.length} position{data.experience.length !== 1 ? "s" : ""}</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 36 }}>
        {[
          { v: data.experience.length, l: "Total Roles" },
          { v: current.length, l: "Current" },
          { v: new Set(data.experience.map((e) => e.company)).size, l: "Companies" },
        ].map(({ v, l }) => (
          <div key={l} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 12px", textAlign: "center" }}>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: 0 }}>{v}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "4px 0 0" }}>{l}</p>
          </div>
        ))}
      </div>

      {current.length > 0 && <ExperienceSection title="Current" items={current} accent="#6366f1" />}
      {past.length > 0 && <ExperienceSection title="Past" items={past} accent="#94a3b8" />}

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button onClick={() => onNavigate("education")}
          style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
          Education →
        </button>
        <button onClick={() => onNavigate("projects")}
          style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Projects →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── EDUCATION PAGE ───────────────────────────────────────────────────────────
const DEGREE_ICONS: Record<string, string> = {
  bachelor: "🎓", master: "📚", phd: "🔬",
  bootcamp: "💻", certificate: "📋", diploma: "📜",
};

const getDegreeIcon = (d: string): string => {
  const k = Object.keys(DEGREE_ICONS).find((k) => d?.toLowerCase().includes(k));
  return k ? DEGREE_ICONS[k] : "🎓";
};

function EducationPage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const certs = data.certifications ?? [];

  return (
    <PageWrapper>
      <button onClick={() => onNavigate("home")}
        style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#94a3b8", fontFamily: "'DM Sans', sans-serif", padding: "0 0 8px" }}>
        ← {data.full_name}
      </button>
      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 4px", letterSpacing: "-0.02em" }}>Education</h1>
      <p style={{ fontSize: 13.5, color: "#94a3b8", margin: "0 0 32px" }}>
        {data.education.length} institution{data.education.length !== 1 ? "s" : ""}
        {certs.length > 0 ? ` · ${certs.length} certification${certs.length !== 1 ? "s" : ""}` : ""}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {data.education.map((item) => {
          const dur = item.start_year && item.end_year
            ? parseInt(item.end_year) - parseInt(item.start_year)
            : null;
          return (
            <div key={item.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 24 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: "#eef2ff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
                }}>
                  {getDegreeIcon(item.degree)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", margin: "0 0 2px" }}>{item.degree}</h3>
                      {item.field && <p style={{ fontSize: 13.5, color: "#6366f1", fontWeight: 600, margin: "0 0 2px" }}>{item.field}</p>}
                      <p style={{ fontSize: 13.5, color: "#64748b", fontWeight: 500, margin: 0 }}>{item.institution}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12.5, color: "#94a3b8" }}>
                        {item.start_year}{item.end_year && item.end_year !== item.start_year ? ` – ${item.end_year}` : ""}
                      </span>
                      {dur !== null && dur > 0 && (
                        <span style={{ fontSize: 11, background: "#f1f5f9", color: "#64748b", padding: "3px 8px", borderRadius: 20 }}>
                          {dur}yr{dur !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.gpa && <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "8px 0 0" }}>GPA: {item.gpa}</p>}
                  {item.description && <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.65, margin: "10px 0 0" }}>{item.description}</p>}
                  {item.achievements && item.achievements.length > 0 && (
                    <ul style={{ margin: "12px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.achievements.map((a, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "#475569" }}>
                          <span style={{ color: "#818cf8", flexShrink: 0 }}>•</span>{a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {certs.length > 0 && (
        <>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", margin: "0 0 16px" }}>Certifications</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
            {certs.map((c) => (
              <div key={c.id} style={{
                background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12,
                padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <span style={{ fontSize: 20 }}>📋</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13.5, color: "#0f172a", margin: 0 }}>{c.name}</p>
                    <p style={{ fontSize: 12.5, color: "#64748b", margin: "2px 0 0" }}>{c.issuer}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {c.year && <span style={{ fontSize: 12, color: "#94a3b8" }}>{c.year}</span>}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer"
                      style={{ fontSize: 11.5, fontWeight: 700, padding: "4px 12px", borderRadius: 8, background: "#eef2ff", color: "#4338ca", textDecoration: "none", border: "1px solid #c7d2fe" }}>
                      View ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => onNavigate("experience")}
          style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
          ← Experience
        </button>
        <button onClick={() => onNavigate("projects")}
          style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "#0f172a", color: "#fff", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
          Projects →
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function MinimalPortfolioTemplate({ data = SAMPLE_DATA }: { data?: PortfolioData }) {
  const [page, setPage] = useState<Page>("home");

  const pages: Record<Page, React.ReactNode> = {
    home: <HomePage data={data} onNavigate={setPage} />,
    projects: <ProjectsPage data={data} onNavigate={setPage} />,
    experience: <ExperiencePage data={data} onNavigate={setPage} />,
    education: <EducationPage data={data} onNavigate={setPage} />,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f1f5f9; }
        textarea { font-family: 'DM Sans', sans-serif; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
        <Nav data={data} currentPage={page} onNavigate={setPage} />
        <main key={page}>{pages[page]}</main>
        <Footer data={data} onNavigate={setPage} />
      </div>
    </>
  );
}