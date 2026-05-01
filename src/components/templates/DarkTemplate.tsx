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

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
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

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  bg:        "#080c10",
  surface:   "#0d1117",
  elevated:  "#161b22",
  border:    "#21262d",
  borderHi:  "#30363d",
  accent:    "#00d4aa",
  accentDim: "rgba(0,212,170,0.12)",
  accentGlow:"rgba(0,212,170,0.25)",
  gold:      "#f0a500",
  textPri:   "#e6edf3",
  textSec:   "#8b949e",
  textDim:   "#484f58",
  font:      "'Syne', sans-serif",
  mono:      "'JetBrains Mono', monospace",
};

// ─── GLOBAL STYLES STRING ─────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${T.bg};
    color: ${T.textPri};
    font-family: ${T.font};
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${T.borderHi}; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 0 0 ${T.accentGlow}; }
    50%       { box-shadow: 0 0 0 6px transparent; }
  }
  @keyframes scan {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(400%); }
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  .fade-up-1 { animation-delay: 0.05s; }
  .fade-up-2 { animation-delay: 0.12s; }
  .fade-up-3 { animation-delay: 0.2s; }
  .fade-up-4 { animation-delay: 0.28s; }

  .card-hover {
    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  }
  .card-hover:hover {
    border-color: ${T.borderHi} !important;
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.4);
  }

  .link-accent {
    color: ${T.accent};
    text-decoration: none;
    transition: opacity 0.15s;
  }
  .link-accent:hover { opacity: 0.75; }

  .btn-primary {
    background: ${T.accent};
    color: #080c10;
    border: none;
    font-family: ${T.font};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.04em;
    padding: 10px 22px;
    border-radius: 6px;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
  }
  .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

  .btn-ghost {
    background: transparent;
    color: ${T.textSec};
    border: 1px solid ${T.border};
    font-family: ${T.font};
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.04em;
    padding: 10px 22px;
    border-radius: 6px;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .btn-ghost:hover { border-color: ${T.borderHi}; color: ${T.textPri}; }

  .tag {
    font-family: ${T.mono};
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 4px;
    background: rgba(0,212,170,0.08);
    border: 1px solid rgba(0,212,170,0.2);
    color: ${T.accent};
  }

  .tag-neutral {
    font-family: ${T.mono};
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 4px;
    background: ${T.elevated};
    border: 1px solid ${T.border};
    color: ${T.textSec};
  }

  .nav-link {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-family: ${T.font};
    transition: background 0.15s, color 0.15s;
  }
  .nav-link.active {
    background: ${T.elevated};
    color: ${T.accent};
  }
  .nav-link.inactive {
    background: transparent;
    color: ${T.textDim};
  }
  .nav-link.inactive:hover {
    color: ${T.textSec};
    background: ${T.elevated};
  }

  .section-label {
    font-family: ${T.mono};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: ${T.accent};
    margin-bottom: 4px;
  }

  .divider {
    border: none;
    border-top: 1px solid ${T.border};
    margin: 0;
  }

  /* Responsive layout */
  @media (max-width: 900px) {
    .btn-primary, .btn-ghost { padding: 10px 18px; }
  }
  @media (max-width: 600px) {
    .btn-primary, .btn-ghost {
      width: 100%;
      justify-content: center;
      text-align: center;
    }
  }
`;

// ─── LAYOUT ───────────────────────────────────────────────────────────────────
const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Projects", page: "projects" },
  { label: "Experience", page: "experience" },
  { label: "Education", page: "education" },
];

function Nav({ data, currentPage, onNavigate }: {
  data: PortfolioData;
  currentPage: Page;
  onNavigate: (p: Page) => void;
}) {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(8,12,16,0.85)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{
        maxWidth: 1040, margin: "0 auto",
        padding: "0 clamp(14px,4vw,28px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 60,
      }}>
        {/* Brand */}
        <button onClick={() => onNavigate("home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: T.accentDim,
            border: `1px solid rgba(0,212,170,0.3)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.font, fontWeight: 800, fontSize: 15, color: T.accent,
          }}>
            {data.full_name.charAt(0)}
          </div>
          <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.textPri, letterSpacing: "0.01em" }}>
            {data.full_name}
          </span>
        </button>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 2 }}>
          {NAV_ITEMS.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`nav-link ${currentPage === page ? "active" : "inactive"}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        {data.email && (
          <a href={`mailto:${data.email}`} className="btn-primary" style={{ textDecoration: "none", fontSize: 12 }}>
            Hire Me ↗
          </a>
        )}
      </div>
    </header>
  );
}

function Footer({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: "36px 28px",
      marginTop: 80,
    }}>
      <div style={{
        maxWidth: 1040, margin: "0 auto",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
      }}>
        <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.1em" }}>
          © {new Date().getFullYear()} {data.full_name.toUpperCase()} — ALL RIGHTS RESERVED
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {NAV_ITEMS.map(({ label, page }) => (
            <button key={page} onClick={() => onNavigate(page)}
              style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1040, margin: "0 auto", padding: "clamp(28px,6vw,56px) clamp(14px,4vw,28px) 40px" }}>
      {children}
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <div className="fade-up" style={{
        position: "relative",
        borderRadius: 16,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        marginBottom: 20,
        padding: "clamp(26px,6vw,60px) clamp(16px,5vw,52px)",
        background: T.surface,
      }}>
        {/* Grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.35,
        }} />
        {/* Glow orb */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 360, height: 360, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,170,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <p className="section-label" style={{ marginBottom: 20 }}>// Available for work</p>
          <h1 style={{
            fontFamily: T.font, fontWeight: 800,
            fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
            color: T.textPri, lineHeight: 1.05,
            letterSpacing: "-0.03em", margin: "0 0 8px",
          }}>
            {data.full_name}
          </h1>
          <p style={{ fontFamily: T.mono, fontSize: 13, color: T.accent, margin: "0 0 22px", letterSpacing: "0.08em" }}>
            @{data.username}
          </p>
          <p style={{
            fontFamily: T.font, fontSize: 15, lineHeight: 1.75,
            color: T.textSec, maxWidth: 560, margin: "0 0 36px",
          }}>
            {data.bio}
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn-primary" onClick={() => onNavigate("projects")}>
              View Projects →
            </button>
            <button className="btn-ghost" onClick={() => onNavigate("experience")}>
              Experience
            </button>
            {data.email && (
              <a href={`mailto:${data.email}`} className="btn-ghost" style={{ textDecoration: "none" }}>
                Get in Touch
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="fade-up fade-up-1" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 20,
      }}>
        {[
          { v: data.projects.length, l: "Projects", suffix: "" },
          { v: data.skills.length, l: "Skills", suffix: "+" },
          { v: data.experience.length, l: "Roles", suffix: "" },
          { v: data.education.length, l: "Degrees", suffix: "" },
        ].map(({ v, l, suffix }) => (
          <div key={l} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: "20px 16px", textAlign: "center",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
              opacity: 0.5,
            }} />
            <p style={{ fontFamily: T.font, fontSize: 30, fontWeight: 800, color: T.accent, margin: "0 0 4px" }}>
              {v}{suffix}
            </p>
            <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              {l}
            </p>
          </div>
        ))}
      </div>

      {/* ── About + Skills ── */}
      <div className="fade-up fade-up-2" style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, marginBottom: 20,
      }}>
        {/* About */}
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 24,
        }}>
          <p className="section-label">About</p>
          <hr className="divider" style={{ margin: "12px 0 18px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { l: "Location", v: data.location },
              { l: "Email", v: data.email, link: `mailto:${data.email}` },
              { l: "Website", v: "Visit →", link: data.website },
              { l: "GitHub", v: "View Profile →", link: data.github_url },
            ].filter(({ v }) => v).map(({ l, v, link }) => (
              <div key={l} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.1em", textTransform: "uppercase", minWidth: 62, flexShrink: 0 }}>{l}</span>
                {link
                  ? <a href={link} target="_blank" rel="noreferrer" className="link-accent" style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500 }}>{v}</a>
                  : <span style={{ fontFamily: T.font, fontSize: 13, color: T.textSec }}>{v}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 24,
        }}>
          <p className="section-label">Tech Stack</p>
          <hr className="divider" style={{ margin: "12px 0 18px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map((s) => (
              <span key={s.id} className="tag">{s.name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Projects ── */}
      <div className="fade-up fade-up-3" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <p className="section-label">Featured Work</p>
            <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 20, color: T.textPri, letterSpacing: "-0.02em" }}>
              Recent Projects
            </h2>
          </div>
          <button className="btn-ghost" onClick={() => onNavigate("projects")} style={{ fontSize: 12, padding: "7px 16px" }}>
            All projects →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {data.projects.slice(0, 2).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      {/* ── Experience Preview + Contact ── */}
      <div className="fade-up fade-up-4" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12 }}>
        {/* Exp preview */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
            <div>
              <p className="section-label">Career</p>
              <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: T.textPri, letterSpacing: "-0.02em" }}>Experience</h2>
            </div>
            <button className="btn-ghost" onClick={() => onNavigate("experience")} style={{ fontSize: 11, padding: "5px 12px" }}>
              Full history →
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {data.experience.slice(0, 3).map((item, idx) => (
              <div key={item.id} style={{
                display: "flex", gap: 14, alignItems: "flex-start",
                paddingBottom: idx < 2 ? 16 : 0,
                marginBottom: idx < 2 ? 16 : 0,
                borderBottom: idx < 2 ? `1px solid ${T.border}` : "none",
              }}>
                <div style={{ paddingTop: 4, flexShrink: 0 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: item.is_current ? T.accent : T.textDim,
                    boxShadow: item.is_current ? `0 0 0 3px ${T.accentDim}` : "none",
                  }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13.5, color: T.textPri, margin: "0 0 2px" }}>{item.role}</p>
                  <p style={{ fontFamily: T.font, fontSize: 12, color: T.accent, fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
                  <p style={{ fontFamily: T.mono, fontSize: 10.5, color: T.textDim, letterSpacing: "0.04em" }}>
                    {item.start_date} — {item.is_current ? "Present" : item.end_date}
                  </p>
                </div>
                {item.is_current && (
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, fontWeight: 600,
                    padding: "3px 8px", borderRadius: 3,
                    background: T.accentDim, color: T.accent,
                    border: `1px solid rgba(0,212,170,0.2)`,
                    letterSpacing: "0.1em", flexShrink: 0, alignSelf: "flex-start",
                  }}>LIVE</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div style={{
          background: T.surface, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: 24,
          display: "flex", flexDirection: "column",
        }}>
          <p className="section-label">Let's Talk</p>
          <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: T.textPri, letterSpacing: "-0.02em", margin: "0 0 18px" }}>Contact</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
            {[
              { label: "Email", val: data.email, href: `mailto:${data.email}` },
              { label: "LinkedIn", val: "linkedin →", href: data.linkedin_url },
              { label: "Twitter", val: "twitter →", href: data.twitter_url },
              { label: "GitHub", val: "github →", href: data.github_url },
            ].filter(({ href }) => href).map(({ label, val, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer"
                style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 14px", borderRadius: 8,
                  background: T.elevated, border: `1px solid ${T.border}`,
                  textDecoration: "none", transition: "border-color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = T.borderHi)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
              >
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
                <span style={{ fontFamily: T.font, fontSize: 12, color: T.accent, fontWeight: 600 }}>{val}</span>
              </a>
            ))}
          </div>
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
      className="card-hover"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12, overflow: "hidden",
      }}
    >
      {/* Thumbnail / placeholder */}
      <a
        href={project.live_url ?? "#"}
        target={project.live_url ? "_blank" : "_self"}
        rel="noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: 168,
          background: project.thumbnail_url
            ? "none"
            : `linear-gradient(135deg, ${T.elevated} 0%, ${T.surface} 100%)`,
          position: "relative", overflow: "hidden", textDecoration: "none",
        }}
      >
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s", transform: hovered ? "scale(1.05)" : "scale(1)" }} />
        ) : (
          <>
            {/* Geometric placeholder */}
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(${T.border} 1px, transparent 1px), linear-gradient(90deg, ${T.border} 1px, transparent 1px)`,
              backgroundSize: "24px 24px", opacity: 0.6,
            }} />
            <span style={{
              fontFamily: T.font, fontWeight: 800, fontSize: 52,
              color: T.borderHi, position: "relative", letterSpacing: "-0.04em",
            }}>
              {project.title.charAt(0)}
            </span>
          </>
        )}
        {/* Hover overlay */}
        {project.live_url && hovered && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: T.mono, fontSize: 12, fontWeight: 600,
              color: T.accent, border: `1px solid ${T.accent}`,
              padding: "6px 16px", borderRadius: 4, letterSpacing: "0.1em",
            }}>
              VISIT SITE ↗
            </span>
          </div>
        )}
      </a>

      <div style={{ padding: "18px 20px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <h3 style={{ fontFamily: T.font, fontSize: 15, fontWeight: 800, color: T.textPri, letterSpacing: "-0.01em" }}>
            {project.title}
          </h3>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: T.accentDim, color: T.accent, textDecoration: "none", border: `1px solid rgba(0,212,170,0.2)`, letterSpacing: "0.08em" }}>
                LIVE ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 4, background: T.elevated, color: T.textSec, textDecoration: "none", border: `1px solid ${T.border}`, letterSpacing: "0.08em" }}>
                CODE
              </a>
            )}
          </div>
        </div>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.7, margin: "0 0 14px" }}>
          {project.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tech_stack.map((t) => (
            <span key={t} className="tag-neutral">{t}</span>
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
      if (e.target?.result && typeof e.target.result === "string") setPreview(e.target.result);
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
    border: `1px solid ${T.border}`, borderRadius: 8,
    padding: "10px 14px", fontSize: 13.5,
    color: T.textPri, background: T.elevated,
    outline: "none", fontFamily: T.font,
    transition: "border-color 0.15s",
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 16, backdropFilter: "blur(8px)",
    }}>
      <div style={{
        background: T.surface, borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 520, maxHeight: "90vh",
        overflowY: "auto", border: `1px solid ${T.border}`,
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <p className="section-label">New Entry</p>
            <h3 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: T.textPri }}>Add Project</h3>
          </div>
          <button onClick={onClose}
            style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 6, width: 32, height: 32, cursor: "pointer", color: T.textSec, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Image upload */}
          <div>
            <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Screenshot
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `1px dashed ${dragging ? T.accent : T.border}`,
                borderRadius: 10, cursor: "pointer",
                background: dragging ? T.accentDim : T.elevated,
                transition: "all 0.15s", overflow: "hidden",
                minHeight: preview ? "auto" : 110,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {preview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} />
                  <button onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                    style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", border: `1px solid ${T.border}`, borderRadius: 4, width: 28, height: 28, cursor: "pointer", fontSize: 12, color: T.textPri }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "20px 16px" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>📷</div>
                  <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.08em" }}>DROP IMAGE OR CLICK TO UPLOAD</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          <div>
            <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Title *
            </label>
            <input style={inputStyle} placeholder="My Awesome Project"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Description
            </label>
            <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} rows={3}
              placeholder="What does this project do?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Live URL</label>
              <input style={inputStyle} placeholder="https://..." type="url"
                value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </div>
            <div>
              <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>GitHub URL</label>
              <input style={inputStyle} placeholder="https://github.com/..." type="url"
                value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Tech Stack
            </label>
            <input style={inputStyle} placeholder="React, TypeScript, Tailwind (comma separated)"
              value={form.tech_stack_raw} onChange={(e) => setForm({ ...form, tech_stack_raw: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={submit} disabled={!form.title.trim()} className="btn-primary"
            style={{ opacity: form.title.trim() ? 1 : 0.4, cursor: form.title.trim() ? "pointer" : "not-allowed" }}>
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

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28 }}>
        <div>
          <button onClick={() => onNavigate("home")}
            style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 11, color: T.textDim, padding: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            ← Back
          </button>
          <p className="section-label">Portfolio</p>
          <h1 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 32, color: T.textPri, letterSpacing: "-0.03em", margin: 0 }}>
            Projects
          </h1>
          <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, marginTop: 4, letterSpacing: "0.1em" }}>
            {filtered.length} ITEMS
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Project
        </button>
      </div>

      {/* Filter pills */}
      {allTechs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {["all", ...allTechs].map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: "5px 14px", borderRadius: 4, border: `1px solid`,
                fontFamily: T.mono, fontSize: 11, fontWeight: 600, cursor: "pointer",
                letterSpacing: "0.08em", textTransform: "uppercase",
                background: filter === t ? T.accent : "transparent",
                color: filter === t ? "#080c10" : T.textDim,
                borderColor: filter === t ? T.accent : T.border,
                transition: "all 0.15s",
              }}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: T.mono, fontSize: 13, color: T.textDim, letterSpacing: "0.1em" }}>NO RESULTS</p>
        </div>
      )}
    </PageWrapper>
  );
}

// ─── EXPERIENCE PAGE ──────────────────────────────────────────────────────────
function ExperiencePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const current = data.experience.filter((e) => e.is_current);
  const past = data.experience.filter((e) => !e.is_current);

  const ExpSection = ({ title, items }: { title: string; items: Experience[] }) => (
    <div style={{ marginBottom: 36 }}>
      <p className="section-label" style={{ marginBottom: 16 }}>{title}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item) => (
          <div key={item.id} className="card-hover" style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 12, padding: 24,
            borderLeft: item.is_current ? `3px solid ${T.accent}` : `3px solid ${T.border}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 16, color: T.textPri, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                  {item.role}
                </h3>
                <p style={{ fontFamily: T.font, fontSize: 14, color: T.accent, fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
                {item.location && (
                  <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.06em" }}>{item.location}</p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {item.is_current && (
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, fontWeight: 600, letterSpacing: "0.15em",
                    padding: "3px 10px", borderRadius: 3,
                    background: T.accentDim, color: T.accent, border: `1px solid rgba(0,212,170,0.25)`,
                  }}>CURRENT</span>
                )}
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.04em" }}>
                  {item.start_date} — {item.is_current ? "Present" : item.end_date}
                </span>
              </div>
            </div>
            {item.description && (
              <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.textSec, lineHeight: 1.7, margin: "0 0 14px" }}>
                {item.description}
              </p>
            )}
            {item.skills && item.skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.skills.map((s) => (
                  <span key={s} className="tag-neutral">{s}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <button onClick={() => onNavigate("home")}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 11, color: T.textDim, padding: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        ← Back
      </button>
      <p className="section-label">Career History</p>
      <h1 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 32, color: T.textPri, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
        Experience
      </h1>
      <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, margin: "0 0 36px", letterSpacing: "0.1em" }}>
        {data.experience.length} POSITIONS
      </p>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 40 }}>
        {[
          { v: data.experience.length, l: "Total Roles" },
          { v: current.length, l: "Currently Active" },
          { v: new Set(data.experience.map((e) => e.company)).size, l: "Companies" },
        ].map(({ v, l }) => (
          <div key={l} style={{
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "16px", textAlign: "center",
          }}>
            <p style={{ fontFamily: T.font, fontSize: 28, fontWeight: 800, color: T.accent, margin: "0 0 4px" }}>{v}</p>
            <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.12em", textTransform: "uppercase" }}>{l}</p>
          </div>
        ))}
      </div>

      {current.length > 0 && <ExpSection title="// Current Position" items={current} />}
      {past.length > 0 && <ExpSection title="// Past Positions" items={past} />}

      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={() => onNavigate("education")} className="btn-ghost">Education →</button>
        <button onClick={() => onNavigate("projects")} className="btn-primary">Projects →</button>
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
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 11, color: T.textDim, padding: "0 0 12px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        ← Back
      </button>
      <p className="section-label">Academic Background</p>
      <h1 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 32, color: T.textPri, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
        Education
      </h1>
      <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, margin: "0 0 36px", letterSpacing: "0.1em" }}>
        {data.education.length} INSTITUTION{data.education.length !== 1 ? "S" : ""}
        {certs.length > 0 ? ` · ${certs.length} CERTIFICATIONS` : ""}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
        {data.education.map((item) => {
          const dur = item.start_year && item.end_year
            ? parseInt(item.end_year) - parseInt(item.start_year)
            : null;
          return (
            <div key={item.id} className="card-hover" style={{
              background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: 24,
            }}>
              <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: T.elevated, border: `1px solid ${T.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>
                  {getDegreeIcon(item.degree)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 15, color: T.textPri, margin: "0 0 3px", letterSpacing: "-0.01em" }}>
                        {item.degree}
                      </h3>
                      {item.field && (
                        <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.accent, fontWeight: 600, margin: "0 0 2px" }}>{item.field}</p>
                      )}
                      <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, margin: 0 }}>{item.institution}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.04em" }}>
                        {item.start_year} — {item.end_year}
                      </span>
                      {dur !== null && dur > 0 && (
                        <span className="tag-neutral">{dur}yr{dur !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  {item.gpa && (
                    <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, margin: "10px 0 0", letterSpacing: "0.08em" }}>
                      GPA: <span style={{ color: T.accent }}>{item.gpa}</span>
                    </p>
                  )}
                  {item.description && (
                    <p style={{ fontFamily: T.font, fontSize: 13.5, color: T.textSec, lineHeight: 1.7, margin: "10px 0 0" }}>
                      {item.description}
                    </p>
                  )}
                  {item.achievements && item.achievements.length > 0 && (
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                      {item.achievements.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                          <span style={{ color: T.accent, fontFamily: T.mono, fontSize: 12, flexShrink: 0 }}>→</span>
                          <span style={{ fontFamily: T.font, fontSize: 13.5, color: T.textSec }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {certs.length > 0 && (
        <>
          <p className="section-label" style={{ marginBottom: 8 }}>Certifications</p>
          <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 22, color: T.textPri, letterSpacing: "-0.02em", margin: "0 0 18px" }}>
            Credentials
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
            {certs.map((c) => (
              <div key={c.id} className="card-hover" style={{
                background: T.surface, border: `1px solid ${T.border}`,
                borderRadius: 10, padding: "14px 18px",
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: T.elevated,
                    border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                  }}>
                    📋
                  </div>
                  <div>
                    <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13.5, color: T.textPri, margin: 0 }}>{c.name}</p>
                    <p style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, margin: "3px 0 0", letterSpacing: "0.06em" }}>{c.issuer}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {c.year && <span style={{ fontFamily: T.mono, fontSize: 11, color: T.textDim, letterSpacing: "0.08em" }}>{c.year}</span>}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer"
                      style={{ fontFamily: T.mono, fontSize: 10, fontWeight: 600, padding: "4px 12px", borderRadius: 4, background: T.accentDim, color: T.accent, textDecoration: "none", border: `1px solid rgba(0,212,170,0.2)`, letterSpacing: "0.08em" }}>
                      VIEW ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => onNavigate("experience")} className="btn-ghost">← Experience</button>
        <button onClick={() => onNavigate("projects")} className="btn-primary">Projects →</button>
      </div>
    </PageWrapper>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function DarkTemplate({ data = SAMPLE_DATA }: { data?: PortfolioData }) {
  const [page, setPage] = useState<Page>("home");

  const pages: Record<Page, React.ReactNode> = {
    home:       <HomePage       data={data} onNavigate={setPage} />,
    projects:   <ProjectsPage   data={data} onNavigate={setPage} />,
    experience: <ExperiencePage data={data} onNavigate={setPage} />,
    education:  <EducationPage  data={data} onNavigate={setPage} />,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ minHeight: "100vh", background: T.bg }}>
        <Nav data={data} currentPage={page} onNavigate={setPage} />
        <main key={page}>{pages[page]}</main>
        <Footer data={data} onNavigate={setPage} />
      </div>
    </>
  );
}