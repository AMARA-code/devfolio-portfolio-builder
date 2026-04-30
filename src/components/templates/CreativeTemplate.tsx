"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Skill { id: string; name: string; }
interface Project {
  id: string; title: string; featured?: boolean;
  description: string; thumbnail_url: string | null;
  live_url: string | null; github_url: string | null;
  tech_stack: string[];
}
interface Experience {
  id: string; role: string; company: string; location?: string;
  start_date: string; end_date: string | null;
  is_current: boolean; description?: string; skills?: string[];
}
interface Education {
  id: string; degree: string; field?: string; institution: string;
  start_year: string; end_year: string; gpa?: string;
  description?: string; achievements?: string[];
}
interface Certification {
  id: string; name: string; issuer: string; year?: string; url?: string;
}
export interface PortfolioData {
  full_name: string; username: string; bio: string;
  avatar_url: string | null; email: string; location: string;
  website: string; github_url: string; linkedin_url: string;
  twitter_url: string; skills: Skill[]; projects: Project[];
  experience: Experience[]; education: Education[];
  certifications?: Certification[];
}

type Page = "home" | "projects" | "experience" | "education";

// ─── SAMPLE DATA ──────────────────────────────────────────────────────────────
const SAMPLE_DATA: PortfolioData = {
  full_name: "Alex Rivera", username: "alexrivera",
  bio: "Full-stack developer obsessed with clean architecture, great UX, and shipping things that matter.",
  avatar_url: null, email: "alex@example.com",
  location: "San Francisco, CA", website: "https://alexrivera.dev",
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
      location: "Remote", start_date: "Jan 2022", end_date: null, is_current: true,
      description: "Building the edge runtime and improving cold-start performance. Reduced build times by 40%.",
      skills: ["Next.js", "Rust", "Edge Computing"],
    },
    {
      id: "2", role: "Software Engineer", company: "Stripe",
      location: "San Francisco, CA", start_date: "Mar 2020", end_date: "Dec 2021", is_current: false,
      description: "Worked on the Payments API team, handling millions of transactions daily.",
      skills: ["Ruby", "Go", "PostgreSQL", "Kafka"],
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

// ─── REAL DATA HELPERS (no hardcoded values!) ─────────────────────────────────

/** Parse "Jan 2022" → Date object */
function parseDate(s: string): Date {
  const d = new Date(s);
  return isNaN(d.getTime()) ? new Date() : d;
}

/** Total years of experience computed from actual experience array */
function calcYearsExperience(experience: Experience[]): string {
  if (!experience.length) return "0";
  let totalMs = 0;
  const now = new Date();
  for (const e of experience) {
    const start = parseDate(e.start_date);
    const end   = e.is_current || !e.end_date ? now : parseDate(e.end_date);
    totalMs += Math.max(0, end.getTime() - start.getTime());
  }
  const years = totalMs / (1000 * 60 * 60 * 24 * 365.25);
  if (years < 1) return "<1";
  return `${Math.floor(years)}+`;
}

/** Earliest start year across all experience */
function earliestYear(experience: Experience[]): string {
  if (!experience.length) return String(new Date().getFullYear());
  const years = experience.map((e) => parseDate(e.start_date).getFullYear());
  return String(Math.min(...years));
}

// ─── COLOUR PALETTE ───────────────────────────────────────────────────────────
// Joyful, lively, premium — coral × electric violet × fresh mint × sunny amber
const C = {
  bg:        "#fefcf8",
  bgAlt:     "#fff8f0",
  coral:     "#ff6b6b",
  violet:    "#7c3aed",
  violetSoft:"#a78bfa",
  mint:      "#06d6a0",
  amber:     "#ffb703",
  sky:       "#4cc9f0",
  ink:       "#0d0d0d",
  inkMid:    "#444",
  inkFaint:  "#999",
  border:    "#e8e0d8",
  card:      "#ffffff",
  // gradients
  heroGrad:  "linear-gradient(135deg,#fff8f0 0%,#f0f0ff 50%,#f0fff8 100%)",
  cardGrad:  "linear-gradient(135deg,#ffffff,#fdf8ff)",
  // fonts
  display:   "'Clash Display', 'Cabinet Grotesk', 'Syne', sans-serif",
  body:      "'Plus Jakarta Sans', 'DM Sans', sans-serif",
  mono:      "'JetBrains Mono', monospace",
};

// skill pill colours cycling
const PILL_COLOURS = [
  { bg: "#fff0f0", text: "#ff6b6b", border: "#ffd5d5" },
  { bg: "#f3f0ff", text: "#7c3aed", border: "#d8d0ff" },
  { bg: "#f0fff8", text: "#059669", border: "#bbf7d0" },
  { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  { bg: "#f0faff", text: "#0284c7", border: "#bae6fd" },
  { bg: "#fdf4ff", text: "#9333ea", border: "#e9d5ff" },
];

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: ${C.bg};
    color: ${C.ink};
    font-family: ${C.body};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${C.bg}; }
  ::-webkit-scrollbar-thumb { background: ${C.violetSoft}; border-radius: 99px; }

  /* ── Keyframes ── */
  @keyframes floatUp {
    from { opacity:0; transform: translateY(28px); }
    to   { opacity:1; transform: translateY(0);    }
  }
  @keyframes pop {
    0%   { transform: scale(0.92); opacity:0; }
    70%  { transform: scale(1.03); }
    100% { transform: scale(1);    opacity:1; }
  }
  @keyframes slideRight {
    from { transform: scaleX(0); opacity:0; }
    to   { transform: scaleX(1); opacity:1; }
  }
  @keyframes blobMorph {
    0%,100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
    50%      { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  }
  @keyframes spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes countUp {
    from { opacity:0; transform: translateY(12px) scale(0.9); }
    to   { opacity:1; transform: translateY(0) scale(1); }
  }
  @keyframes wiggle {
    0%,100% { transform: rotate(-3deg); }
    50%      { transform: rotate( 3deg); }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1);   opacity:0.8; }
    100% { transform: scale(1.8); opacity:0;   }
  }

  .float-up   { animation: floatUp 0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .float-up-1 { animation-delay: 0.07s; }
  .float-up-2 { animation-delay: 0.15s; }
  .float-up-3 { animation-delay: 0.24s; }
  .float-up-4 { animation-delay: 0.33s; }
  .float-up-5 { animation-delay: 0.42s; }

  /* Cards */
  .card {
    background: ${C.card};
    border: 1.5px solid ${C.border};
    border-radius: 20px;
    transition: transform 0.22s cubic-bezier(0.22,1,0.36,1),
                box-shadow 0.22s ease,
                border-color 0.22s ease;
  }
  .card:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 24px 64px rgba(124,58,237,0.10), 0 4px 16px rgba(0,0,0,0.06);
    border-color: ${C.violetSoft};
  }

  /* Buttons */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: ${C.body}; font-weight: 700; font-size: 14px;
    padding: 14px 28px; border-radius: 100px; border: none; cursor: pointer;
    background: linear-gradient(135deg, ${C.violet}, ${C.coral});
    color: #fff;
    box-shadow: 0 4px 20px rgba(124,58,237,0.35);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
    text-decoration: none;
  }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.03);
    box-shadow: 0 8px 32px rgba(124,58,237,0.45);
  }
  .btn-primary:active { transform: scale(0.97); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: ${C.body}; font-weight: 600; font-size: 14px;
    padding: 13px 26px; border-radius: 100px; cursor: pointer;
    background: transparent;
    border: 2px solid ${C.border};
    color: ${C.inkMid};
    transition: border-color 0.18s, color 0.18s, transform 0.18s, background 0.18s;
    text-decoration: none;
  }
  .btn-outline:hover {
    border-color: ${C.violet};
    color: ${C.violet};
    background: rgba(124,58,237,0.05);
    transform: translateY(-2px);
  }

  /* Nav links */
  .nav-link {
    font-family: ${C.body}; font-size: 13.5px; font-weight: 600;
    padding: 7px 16px; border-radius: 100px; border: none; cursor: pointer;
    transition: background 0.18s, color 0.18s, transform 0.18s;
    letter-spacing: 0.01em;
  }
  .nav-link.active {
    background: ${C.violet}; color: #fff;
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
  }
  .nav-link.inactive { background: transparent; color: ${C.inkFaint}; }
  .nav-link.inactive:hover { background: rgba(0,0,0,0.04); color: ${C.ink}; }

  /* Tags / pills */
  .tag {
    display: inline-block;
    font-family: ${C.mono}; font-size: 11px; font-weight: 500;
    padding: 4px 12px; border-radius: 100px; border: 1.5px solid;
    letter-spacing: 0.02em;
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .tag:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

  /* Section eye brow label */
  .eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: ${C.mono}; font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: ${C.violet}; margin-bottom: 10px;
  }
  .eyebrow::before {
    content: ''; display: block;
    width: 20px; height: 2px;
    background: linear-gradient(90deg, ${C.coral}, ${C.violet});
    border-radius: 2px;
  }

  /* Gradient text */
  .grad-text {
    background: linear-gradient(135deg, ${C.violet} 0%, ${C.coral} 60%, ${C.amber} 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Shimmer */
  .shimmer {
    background: linear-gradient(90deg, ${C.violet}, ${C.coral}, ${C.mint}, ${C.violet});
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* Blob decoration */
  .blob {
    animation: blobMorph 8s ease-in-out infinite;
    filter: blur(0px);
  }

  /* Live dot */
  .live-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${C.mint}; flex-shrink: 0;
    position: relative;
  }
  .live-dot::after {
    content: '';
    position: absolute; inset: -3px;
    border-radius: 50%; border: 2px solid ${C.mint};
    animation: pulse-ring 1.4s ease-out infinite;
  }

  a { text-decoration: none; color: inherit; }
`;

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home",       page: "home"       },
  { label: "Projects",   page: "projects"   },
  { label: "Experience", page: "experience" },
  { label: "Education",  page: "education"  },
];

function Nav({ data, currentPage, onNavigate }: {
  data: PortfolioData; currentPage: Page; onNavigate: (p: Page) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "rgba(254,252,248,0.88)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{
        maxWidth: 1080, margin: "0 auto", padding: "0 32px",
        height: 68, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        {/* Logo */}
        <button onClick={() => onNavigate("home")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: `linear-gradient(135deg, ${C.violet}, ${C.coral})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: C.display, fontWeight: 700, fontSize: 17,
            boxShadow: `0 4px 16px rgba(124,58,237,0.35)`,
          }}>
            {data.full_name.charAt(0)}
          </div>
          <span style={{ fontFamily: C.display, fontWeight: 700, fontSize: 16, color: C.ink, letterSpacing: "-0.01em" }}>
            {data.full_name.split(" ")[0]}
          </span>
        </button>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map(({ label, page }) => (
            <button key={page} onClick={() => onNavigate(page)}
              className={`nav-link ${currentPage === page ? "active" : "inactive"}`}>
              {label}
            </button>
          ))}
        </nav>

        {/* CTA */}
        {data.email && (
          <a href={`mailto:${data.email}`} className="btn-primary" style={{ fontSize: 13, padding: "10px 22px" }}>
            Hire Me ✦
          </a>
        )}
      </div>
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <footer style={{
      background: C.ink, marginTop: 100,
      padding: "64px 32px 40px",
      position: "relative", overflow: "hidden",
    }}>
      {/* background blobs */}
      <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(124,58,237,0.15)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:220, height:220, borderRadius:"50%", background:"rgba(255,107,107,0.1)", pointerEvents:"none" }} />

      <div style={{ maxWidth: 1080, margin: "0 auto", position:"relative" }}>
        <p style={{ fontFamily: C.display, fontWeight: 700, fontSize: "clamp(2rem,5vw,4rem)", color: "#fff", letterSpacing:"-0.03em", marginBottom: 24 }}>
          Let's <span style={{ color: C.coral }}>build</span> something<br />
          <span style={{ color: C.violetSoft }}>extraordinary.</span>
        </p>
        {data.email && (
          <a href={`mailto:${data.email}`} className="btn-primary" style={{ marginBottom: 48 }}>
            {data.email} →
          </a>
        )}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 32, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <span style={{ fontFamily: C.mono, fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing:"0.1em" }}>
            © {new Date().getFullYear()} {data.full_name.toUpperCase()} · BUILT WITH PORTFOLIO BUILDER
          </span>
          <div style={{ display:"flex", gap:20 }}>
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => onNavigate(page)}
                style={{ background:"none", border:"none", cursor:"pointer", fontFamily:C.body, fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 32px 48px" }}>
      {children}
    </div>
  );
}

// ─── ANIMATED COUNT-UP NUMBER ─────────────────────────────────────────────────
function CountUp({ target, suffix = "" }: { target: number | string; suffix?: string }) {
  const [display, setDisplay] = useState(typeof target === "number" ? 0 : target);
  useEffect(() => {
    if (typeof target !== "number") { setDisplay(target); return; }
    let start = 0;
    const steps = 40;
    const inc = target / steps;
    const timer = setInterval(() => {
      start += inc;
      if (start >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{display}{suffix}</>;
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  // ✅ REAL computed values — no hardcoded numbers
  const yearsExp   = calcYearsExperience(data.experience);
  const firstYear  = earliestYear(data.experience);
  const currentJob = data.experience.find((e) => e.is_current);

  return (
    <PageWrapper>

      {/* ── Hero ── */}
      <div className="float-up" style={{ position:"relative", marginBottom: 80 }}>
        {/* Decorative blobs */}
        <div className="blob" style={{
          position:"absolute", top: -40, right: -60,
          width: 380, height: 380,
          background: `radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(255,107,107,0.08) 60%, transparent 80%)`,
          pointerEvents:"none", zIndex: 0,
        }} />
        <div style={{
          position:"absolute", bottom: 0, left: -40,
          width: 250, height: 250,
          background: `radial-gradient(circle, rgba(6,214,160,0.10) 0%, transparent 70%)`,
          pointerEvents:"none", zIndex: 0,
        }} />

        {/* Status badge */}
        {currentJob && (
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(6,214,160,0.1)", border:"1.5px solid rgba(6,214,160,0.3)",
            borderRadius:100, padding:"6px 16px", marginBottom:28,
            position:"relative", zIndex:1,
          }}>
            <div className="live-dot" />
            <span style={{ fontFamily:C.mono, fontSize:11, color:"#059669", fontWeight:500, letterSpacing:"0.08em" }}>
              {currentJob.role} @ {currentJob.company}
            </span>
          </div>
        )}

        <h1 style={{
          fontFamily: C.display, fontWeight: 700, lineHeight: 1.0,
          fontSize: "clamp(3rem, 7vw, 6.5rem)",
          letterSpacing: "-0.04em", marginBottom: 24, position:"relative", zIndex:1,
        }}>
          <span style={{ color: C.ink }}>Hi, I'm </span>
          <span className="grad-text">{data.full_name}</span>
          <span style={{ color: C.amber, display:"inline-block", animation:"wiggle 2s ease-in-out infinite", marginLeft:8 }}>✦</span>
        </h1>

        <p style={{
          fontFamily: C.body, fontSize: 17, lineHeight: 1.75,
          color: C.inkMid, maxWidth: 560, marginBottom: 36, position:"relative", zIndex:1,
        }}>
          {data.bio}
        </p>

        <div style={{ display:"flex", gap:12, flexWrap:"wrap", position:"relative", zIndex:1 }}>
          <button className="btn-primary" onClick={() => onNavigate("projects")}>
            View My Work →
          </button>
          <button className="btn-outline" onClick={() => onNavigate("experience")}>
            Experience
          </button>
          {data.email && (
            <a href={`mailto:${data.email}`} className="btn-outline">
              Say Hello 👋
            </a>
          )}
        </div>
      </div>

      {/* ── Stats — ALL from real data ── */}
      <div className="float-up float-up-1" style={{
        display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:72,
      }}>
        {[
          { value: data.projects.length,   suffix:"",  label:"Projects Shipped",     color: C.coral,  bg:"#fff0f0" },
          { value: data.skills.length,     suffix:"+", label:"Technologies",          color: C.violet, bg:"#f3f0ff" },
          { value: data.experience.length, suffix:"",  label:"Roles Held",            color: C.mint,   bg:"#f0fff8" },
          { value: yearsExp,               suffix:"",  label:"Yrs Experience",        color: C.amber,  bg:"#fffbeb" },
        ].map(({ value, suffix, label, color, bg }, i) => (
          <div key={label} className="card" style={{
            padding:"28px 20px", textAlign:"center",
            background: bg, borderColor: "transparent",
            animation:`countUp 0.5s cubic-bezier(0.22,1,0.36,1) ${0.08 * i}s both`,
          }}>
            <p style={{
              fontFamily: C.display, fontWeight: 700,
              fontSize: 40, color, lineHeight: 1, marginBottom: 6,
            }}>
              <CountUp target={typeof value === "number" ? value : value} suffix={suffix} />
            </p>
            <p style={{ fontFamily:C.mono, fontSize:10, color:C.inkFaint, letterSpacing:"0.15em", textTransform:"uppercase" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* ── About + Skills ── */}
      <div className="float-up float-up-2" style={{
        display:"grid", gridTemplateColumns:"1fr 1.3fr", gap:20, marginBottom:72,
      }}>
        {/* About card */}
        <div className="card" style={{ padding:28 }}>
          <span className="eyebrow">About Me</span>
          <h3 style={{ fontFamily:C.display, fontWeight:700, fontSize:20, color:C.ink, marginBottom:20, letterSpacing:"-0.02em" }}>
            Quick Info
          </h3>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              { emoji:"📍", label:"Location", val: data.location, link: null },
              { emoji:"✉️", label:"Email",    val: data.email,    link: `mailto:${data.email}` },
              { emoji:"🌐", label:"Website",  val: data.website ? "Visit →" : null, link: data.website },
              { emoji:"💼", label:"Since",    val: firstYear ? `${firstYear}` : null, link: null },
              { emoji:"🐙", label:"GitHub",   val: data.github_url ? "View Profile →" : null, link: data.github_url },
            ].filter(({ val }) => val).map(({ emoji, label, val, link }) => (
              <div key={label} style={{
                display:"flex", alignItems:"center", gap:12,
                padding:"10px 14px", borderRadius:12,
                background: C.bg, border:`1.5px solid ${C.border}`,
                transition:"border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.violetSoft)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}
              >
                <span style={{ fontSize:16, flexShrink:0 }}>{emoji}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:C.mono, fontSize:9, color:C.inkFaint, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:2 }}>{label}</p>
                  {link
                    ? <a href={link} target="_blank" rel="noreferrer"
                        style={{ fontFamily:C.body, fontSize:13, color:C.violet, fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>
                        {val}
                      </a>
                    : <p style={{ fontFamily:C.body, fontSize:13, color:C.inkMid, fontWeight:500 }}>{val}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skills card */}
        <div className="card" style={{ padding:28 }}>
          <span className="eyebrow">Tech Stack</span>
          <h3 style={{ fontFamily:C.display, fontWeight:700, fontSize:20, color:C.ink, marginBottom:20, letterSpacing:"-0.02em" }}>
            {data.skills.length} Technologies
          </h3>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {data.skills.map((s, i) => {
              const col = PILL_COLOURS[i % PILL_COLOURS.length];
              return (
                <span key={s.id} className="tag" style={{
                  background: col.bg, color: col.text, borderColor: col.border,
                  animationDelay: `${i * 0.04}s`,
                }}>
                  {s.name}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Featured Projects ── */}
      <div className="float-up float-up-3" style={{ marginBottom: 72 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <span className="eyebrow">Selected Work</span>
            <h2 style={{ fontFamily:C.display, fontWeight:700, fontSize:"clamp(1.6rem,3vw,2.4rem)", color:C.ink, letterSpacing:"-0.03em" }}>
              Featured Projects
            </h2>
          </div>
          <button className="btn-outline" onClick={() => onNavigate("projects")} style={{ fontSize:13, padding:"10px 20px" }}>
            All {data.projects.length} projects →
          </button>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {data.projects.slice(0, 2).map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      </div>

      {/* ── Experience Preview — REAL data ── */}
      <div className="float-up float-up-4" style={{ marginBottom: 72 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div>
            <span className="eyebrow">Career</span>
            <h2 style={{ fontFamily:C.display, fontWeight:700, fontSize:"clamp(1.6rem,3vw,2.4rem)", color:C.ink, letterSpacing:"-0.03em" }}>
              Experience
            </h2>
          </div>
          <button className="btn-outline" onClick={() => onNavigate("experience")} style={{ fontSize:13, padding:"10px 20px" }}>
            Full history →
          </button>
        </div>
        <div className="card" style={{ padding:0, overflow:"hidden" }}>
          {data.experience.slice(0, 3).map((item, idx) => (
            <div key={item.id} style={{
              display:"flex", gap:20, alignItems:"center",
              padding:"22px 28px",
              borderBottom: idx < Math.min(data.experience.length, 3) - 1 ? `1px solid ${C.border}` : "none",
              transition:"background 0.15s",
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "#faf8ff")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Index */}
              <div style={{
                width:42, height:42, borderRadius:12, flexShrink:0,
                background: item.is_current
                  ? `linear-gradient(135deg,${C.violet},${C.coral})`
                  : C.bg,
                border: item.is_current ? "none" : `1.5px solid ${C.border}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontFamily:C.mono, fontWeight:500, fontSize:12,
                color: item.is_current ? "#fff" : C.inkFaint,
              }}>
                {item.is_current ? "●" : String(idx + 1).padStart(2,"0")}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontFamily:C.display, fontWeight:700, fontSize:15, color:C.ink, marginBottom:2, letterSpacing:"-0.01em" }}>
                  {item.role}
                </p>
                <p style={{ fontFamily:C.body, fontSize:13, color:C.violet, fontWeight:600 }}>{item.company}</p>
              </div>
              <div style={{ textAlign:"right", flexShrink:0 }}>
                <p style={{ fontFamily:C.mono, fontSize:11, color:C.inkFaint, letterSpacing:"0.04em" }}>
                  {item.start_date}
                </p>
                <p style={{ fontFamily:C.mono, fontSize:11, color:C.inkFaint, letterSpacing:"0.04em" }}>
                  {item.is_current ? "Present" : item.end_date}
                </p>
              </div>
              {item.is_current && (
                <span style={{
                  fontFamily:C.mono, fontSize:9, fontWeight:600,
                  letterSpacing:"0.15em", textTransform:"uppercase",
                  background:"rgba(6,214,160,0.12)", color:"#059669",
                  border:"1.5px solid rgba(6,214,160,0.3)",
                  padding:"3px 10px", borderRadius:100, flexShrink:0,
                }}>Live</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact banner ── */}
      <div className="float-up float-up-5" style={{
        borderRadius:24, overflow:"hidden",
        background:`linear-gradient(135deg, ${C.violet} 0%, #a855f7 40%, ${C.coral} 100%)`,
        padding:"52px 48px", position:"relative",
      }}>
        <div style={{ position:"absolute", top:-40, right:-40, width:200, height:200, borderRadius:"50%", background:"rgba(255,255,255,0.07)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-30, left:30, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.05)", pointerEvents:"none" }} />
        <div style={{ position:"relative" }}>
          <span style={{ fontFamily:C.mono, fontSize:11, color:"rgba(255,255,255,0.7)", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:12, display:"block" }}>
            Open to opportunities
          </span>
          <h2 style={{ fontFamily:C.display, fontWeight:700, fontSize:"clamp(1.6rem,3.5vw,2.8rem)", color:"#fff", letterSpacing:"-0.03em", marginBottom:28, lineHeight:1.1 }}>
            Ready to work together?<br />Let's talk. 🚀
          </h2>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {data.email && (
              <a href={`mailto:${data.email}`}
                style={{
                  fontFamily:C.body, fontWeight:700, fontSize:14,
                  padding:"12px 28px", borderRadius:100,
                  background:"#fff", color:C.violet, textDecoration:"none",
                  transition:"transform 0.18s, box-shadow 0.18s",
                  boxShadow:"0 4px 20px rgba(0,0,0,0.15)",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.15)"; }}
              >
                {data.email} →
              </a>
            )}
            {data.linkedin_url && (
              <a href={data.linkedin_url} target="_blank" rel="noreferrer"
                style={{ fontFamily:C.body, fontWeight:600, fontSize:14, padding:"12px 24px", borderRadius:100, border:"2px solid rgba(255,255,255,0.4)", color:"#fff", textDecoration:"none", transition:"border-color 0.15s, background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                LinkedIn →
              </a>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
const PROJECT_GRADIENTS = [
  `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
  `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`,
  `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
  `linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)`,
  `linear-gradient(135deg, #fa709a 0%, #fee140 100%)`,
  `linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)`,
];

function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const grad = PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length];

  return (
    <article
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow:"hidden" }}
    >
      {/* Thumbnail */}
      <a href={project.live_url ?? "#"} target={project.live_url ? "_blank" : "_self"} rel="noreferrer"
        style={{ display:"block", position:"relative", overflow:"hidden", height:180, textDecoration:"none" }}>
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title}
            style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.4s cubic-bezier(0.22,1,0.36,1)", transform: hovered ? "scale(1.08)" : "scale(1)" }} />
        ) : (
          <div style={{
            width:"100%", height:"100%", background: grad,
            display:"flex", alignItems:"center", justifyContent:"center",
            position:"relative",
          }}>
            <span style={{
              fontFamily:C.display, fontWeight:700, fontSize:68,
              color:"rgba(255,255,255,0.3)", letterSpacing:"-0.05em",
              transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1) rotate(0deg)",
              transition:"transform 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        {/* Hover overlay */}
        {project.live_url && hovered && (
          <div style={{
            position:"absolute", inset:0,
            background:"rgba(0,0,0,0.45)",
            display:"flex", alignItems:"center", justifyContent:"center",
            animation:"pop 0.2s ease both",
          }}>
            <span style={{
              fontFamily:C.body, fontWeight:700, fontSize:13,
              color:"#fff", background:"rgba(255,255,255,0.15)",
              border:"1.5px solid rgba(255,255,255,0.4)",
              backdropFilter:"blur(8px)",
              padding:"8px 20px", borderRadius:100,
            }}>
              Visit Site ↗
            </span>
          </div>
        )}
        {/* Featured badge */}
        {project.featured && (
          <div style={{
            position:"absolute", top:12, left:12,
            background:C.amber, color:C.ink,
            fontFamily:C.mono, fontSize:9, fontWeight:600,
            letterSpacing:"0.15em", textTransform:"uppercase",
            padding:"3px 10px", borderRadius:100,
          }}>
            ✦ Featured
          </div>
        )}
      </a>

      <div style={{ padding:"22px 24px 24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:10 }}>
          <h3 style={{ fontFamily:C.display, fontWeight:700, fontSize:17, color:C.ink, letterSpacing:"-0.02em", lineHeight:1.2 }}>
            {project.title}
          </h3>
          <div style={{ display:"flex", gap:6, flexShrink:0 }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                style={{ fontFamily:C.mono, fontSize:10, fontWeight:600, padding:"4px 12px", borderRadius:100, background:`linear-gradient(135deg,${C.violet},${C.coral})`, color:"#fff", boxShadow:"0 2px 8px rgba(124,58,237,0.3)", letterSpacing:"0.06em" }}>
                Live ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                style={{ fontFamily:C.mono, fontSize:10, fontWeight:600, padding:"4px 12px", borderRadius:100, background:C.bg, color:C.inkMid, border:`1.5px solid ${C.border}`, letterSpacing:"0.06em" }}>
                Code
              </a>
            )}
          </div>
        </div>
        <p style={{ fontFamily:C.body, fontSize:13, color:C.inkMid, lineHeight:1.72, marginBottom:16 }}>
          {project.description}
        </p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {project.tech_stack.map((t, i) => {
            const col = PILL_COLOURS[i % PILL_COLOURS.length];
            return (
              <span key={t} className="tag" style={{ background:col.bg, color:col.text, borderColor:col.border, fontSize:10, padding:"3px 10px" }}>
                {t}
              </span>
            );
          })}
        </div>
      </div>
    </article>
  );
}

// ─── ADD PROJECT MODAL ────────────────────────────────────────────────────────
function AddProjectModal({ onClose, onAdd }: { onClose:()=>void; onAdd:(p:Project)=>void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title:"", description:"", live_url:"", github_url:"", tech_stack_raw:"" });
  const [preview, setPreview] = useState<string|null>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file: File|null|undefined) => {
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => { if (typeof e.target?.result === "string") setPreview(e.target.result); };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd({
      id: Date.now().toString(), title:form.title, description:form.description,
      live_url:form.live_url||null, github_url:form.github_url||null,
      thumbnail_url:preview||null,
      tech_stack:form.tech_stack_raw.split(",").map(s=>s.trim()).filter(Boolean),
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`,
    borderRadius:12, padding:"11px 16px", fontSize:14, color:C.ink,
    background:C.bg, outline:"none", fontFamily:C.body,
    transition:"border-color 0.18s, box-shadow 0.18s",
  };
  const labelStyle: React.CSSProperties = {
    fontFamily:C.mono, fontSize:10, color:C.inkFaint,
    letterSpacing:"0.15em", textTransform:"uppercase",
    display:"block", marginBottom:8, fontWeight:500,
  };

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, background:"rgba(0,0,0,0.55)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(12px)" }}>
      <div style={{ background:"#fff", borderRadius:24, padding:32, width:"100%", maxWidth:520, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 32px 80px rgba(0,0,0,0.25)", border:`1.5px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
          <div>
            <span className="eyebrow">New Entry</span>
            <h3 style={{ fontFamily:C.display, fontWeight:700, fontSize:22, color:C.ink, letterSpacing:"-0.02em" }}>Add Project</h3>
          </div>
          <button onClick={onClose}
            style={{ background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:12, width:36, height:36, cursor:"pointer", fontSize:16, color:C.inkFaint, display:"flex", alignItems:"center", justifyContent:"center", transition:"background 0.15s" }}
            onMouseEnter={e=>(e.currentTarget.style.background="#fee2e2")}
            onMouseLeave={e=>(e.currentTarget.style.background=C.bg)}>✕</button>
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
          <div>
            <label style={labelStyle}>Screenshot</label>
            <div
              onClick={()=>fileRef.current?.click()}
              onDragOver={e=>{e.preventDefault();setDragging(true);}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0]);}}
              style={{ border:`2px dashed ${dragging?C.violet:C.border}`, borderRadius:16, cursor:"pointer", background:dragging?"rgba(124,58,237,0.05)":C.bg, transition:"all 0.15s", overflow:"hidden", minHeight:preview?"auto":100, display:"flex", alignItems:"center", justifyContent:"center" }}>
              {preview ? (
                <div style={{position:"relative",width:"100%"}}>
                  <img src={preview} alt="preview" style={{width:"100%",maxHeight:180,objectFit:"cover",display:"block",borderRadius:14}}/>
                  <button onClick={e=>{e.stopPropagation();setPreview(null);}}
                    style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,0.5)",border:"none",borderRadius:100,width:28,height:28,cursor:"pointer",fontSize:12,color:"#fff"}}>✕</button>
                </div>
              ) : (
                <div style={{textAlign:"center",padding:"24px 16px"}}>
                  <div style={{fontSize:32,marginBottom:8}}>🖼️</div>
                  <p style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint,letterSpacing:"0.1em"}}>Drop image or click to upload</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files?.[0])}/>
          </div>

          <div><label style={labelStyle}>Title *</label>
            <input style={inputStyle} placeholder="My Awesome Project" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}
              onFocus={e=>{e.target.style.borderColor=C.violet;e.target.style.boxShadow=`0 0 0 3px rgba(124,58,237,0.12)`;}}
              onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none";}} /></div>

          <div><label style={labelStyle}>Description</label>
            <textarea style={{...inputStyle,resize:"vertical",minHeight:80}} rows={3} placeholder="What does this project do?"
              value={form.description} onChange={e=>setForm({...form,description:e.target.value})}
              onFocus={e=>{e.target.style.borderColor=C.violet;e.target.style.boxShadow=`0 0 0 3px rgba(124,58,237,0.12)`;}}
              onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none";}}/></div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div><label style={labelStyle}>Live URL</label>
              <input style={inputStyle} placeholder="https://..." type="url" value={form.live_url} onChange={e=>setForm({...form,live_url:e.target.value})}
                onFocus={e=>{e.target.style.borderColor=C.violet;e.target.style.boxShadow=`0 0 0 3px rgba(124,58,237,0.12)`;}}
                onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none";}}/></div>
            <div><label style={labelStyle}>GitHub URL</label>
              <input style={inputStyle} placeholder="https://github.com/..." type="url" value={form.github_url} onChange={e=>setForm({...form,github_url:e.target.value})}
                onFocus={e=>{e.target.style.borderColor=C.violet;e.target.style.boxShadow=`0 0 0 3px rgba(124,58,237,0.12)`;}}
                onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none";}}/></div>
          </div>

          <div><label style={labelStyle}>Tech Stack</label>
            <input style={inputStyle} placeholder="React, TypeScript, Tailwind (comma separated)" value={form.tech_stack_raw} onChange={e=>setForm({...form,tech_stack_raw:e.target.value})}
              onFocus={e=>{e.target.style.borderColor=C.violet;e.target.style.boxShadow=`0 0 0 3px rgba(124,58,237,0.12)`;}}
              onBlur={e=>{e.target.style.borderColor=C.border;e.target.style.boxShadow="none";}}/></div>
        </div>

        <div style={{display:"flex",justifyContent:"flex-end",gap:10,marginTop:24}}>
          <button onClick={onClose} className="btn-outline" style={{fontSize:13,padding:"10px 20px"}}>Cancel</button>
          <button onClick={submit} disabled={!form.title.trim()} className="btn-primary"
            style={{fontSize:13,padding:"10px 24px",opacity:form.title.trim()?1:0.4,cursor:form.title.trim()?"pointer":"not-allowed"}}>
            Add Project ✦
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

  const allTechs = [...new Set(projects.flatMap(p => p.tech_stack))];
  const filtered = filter === "all" ? projects : projects.filter(p => p.tech_stack.includes(filter));

  return (
    <PageWrapper>
      {showModal && <AddProjectModal onClose={()=>setShowModal(false)} onAdd={p=>setProjects([p,...projects])} />}

      <div style={{marginBottom:48}}>
        <button onClick={()=>onNavigate("home")}
          style={{background:"none",border:"none",cursor:"pointer",fontFamily:C.mono,fontSize:11,color:C.inkFaint,letterSpacing:"0.12em",textTransform:"uppercase",padding:"0 0 16px",display:"flex",alignItems:"center",gap:6}}>
          ← Back
        </button>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",flexWrap:"wrap",gap:16}}>
          <div>
            <span className="eyebrow">Portfolio</span>
            <h1 style={{fontFamily:C.display,fontWeight:700,fontSize:"clamp(2.2rem,5vw,3.5rem)",color:C.ink,letterSpacing:"-0.04em",lineHeight:1}}>
              Projects <span className="grad-text">({filtered.length})</span>
            </h1>
          </div>
          <button onClick={()=>setShowModal(true)} className="btn-primary">+ Add Project</button>
        </div>
      </div>

      {allTechs.length > 0 && (
        <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:36}}>
          {["all",...allTechs].map((t,i) => {
            const active = filter === t;
            const col = i===0 ? {bg:C.violet,text:"#fff",border:C.violet} : PILL_COLOURS[(i-1)%PILL_COLOURS.length];
            return (
              <button key={t} onClick={()=>setFilter(t)} className="tag"
                style={{
                  background: active ? (i===0?C.violet:col.bg) : C.bg,
                  color: active ? (i===0?"#fff":col.text) : C.inkFaint,
                  borderColor: active ? (i===0?C.violet:col.border) : C.border,
                  fontSize:11, padding:"5px 14px", cursor:"pointer",
                  boxShadow: active ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
                }}>
                {t === "all" ? "✦ All" : t}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length > 0 ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          {filtered.map((p,i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      ) : (
        <div style={{textAlign:"center",padding:"80px 0"}}>
          <p style={{fontFamily:C.display,fontSize:24,color:C.border,fontWeight:700}}>Nothing here yet ✦</p>
        </div>
      )}
    </PageWrapper>
  );
}

// ─── EXPERIENCE PAGE — REAL data only ────────────────────────────────────────
function ExperiencePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const current = data.experience.filter(e => e.is_current);
  const past    = data.experience.filter(e => !e.is_current);
  const yearsExp = calcYearsExperience(data.experience);
  const companies = new Set(data.experience.map(e => e.company)).size;

  const ExpCard = ({ item, idx }: { item: Experience; idx: number }) => {
    const [open, setOpen] = useState(false);
    const col = PILL_COLOURS[idx % PILL_COLOURS.length];
    return (
      <div className="card" style={{
        overflow:"hidden", cursor:"pointer",
        borderLeft: item.is_current ? `4px solid ${C.violet}` : `4px solid ${C.border}`,
      }} onClick={()=>setOpen(!open)}>
        <div style={{ display:"flex", gap:18, alignItems:"center", padding:"24px 28px" }}>
          {/* colour index */}
          <div style={{
            width:48, height:48, borderRadius:14, flexShrink:0,
            background: item.is_current
              ? `linear-gradient(135deg,${C.violet},${C.coral})`
              : col.bg,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontFamily:C.display, fontWeight:700, fontSize:16,
            color: item.is_current ? "#fff" : col.text,
          }}>
            {item.company.charAt(0)}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8}}>
              <div>
                <p style={{fontFamily:C.display,fontWeight:700,fontSize:16,color:C.ink,marginBottom:3,letterSpacing:"-0.01em"}}>{item.role}</p>
                <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
                  <span style={{fontFamily:C.body,fontSize:13,color:C.violet,fontWeight:600}}>{item.company}</span>
                  {item.location && <span style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint}}>📍 {item.location}</span>}
                </div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                {item.is_current && (
                  <span style={{fontFamily:C.mono,fontSize:9,fontWeight:600,letterSpacing:"0.15em",textTransform:"uppercase",background:"rgba(6,214,160,0.12)",color:"#059669",border:"1.5px solid rgba(6,214,160,0.3)",padding:"3px 10px",borderRadius:100}}>
                    Current
                  </span>
                )}
                <span style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint}}>
                  {item.start_date} — {item.is_current ? "Present" : item.end_date}
                </span>
                <span style={{color:C.inkFaint,transition:"transform 0.2s",transform:open?"rotate(180deg)":"rotate(0deg)",display:"inline-block"}}>▾</span>
              </div>
            </div>
          </div>
        </div>
        {/* Expandable details */}
        {open && (
          <div style={{padding:"0 28px 24px 28px",borderTop:`1px solid ${C.border}`,paddingTop:20,animation:"floatUp 0.25s ease both"}}>
            {item.description && (
              <p style={{fontFamily:C.body,fontSize:14,color:C.inkMid,lineHeight:1.75,marginBottom:14}}>{item.description}</p>
            )}
            {item.skills && item.skills.length > 0 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {item.skills.map((s,i) => {
                  const c = PILL_COLOURS[i%PILL_COLOURS.length];
                  return <span key={s} className="tag" style={{background:c.bg,color:c.text,borderColor:c.border,fontSize:11}}>{s}</span>;
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <PageWrapper>
      <button onClick={()=>onNavigate("home")}
        style={{background:"none",border:"none",cursor:"pointer",fontFamily:C.mono,fontSize:11,color:C.inkFaint,letterSpacing:"0.12em",textTransform:"uppercase",padding:"0 0 16px"}}>
        ← Back
      </button>
      <span className="eyebrow">Career History</span>
      <h1 style={{fontFamily:C.display,fontWeight:700,fontSize:"clamp(2.2rem,5vw,3.5rem)",color:C.ink,letterSpacing:"-0.04em",lineHeight:1,marginBottom:4}}>
        Experience
      </h1>
      <p style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:48}}>
        {data.experience.length} position{data.experience.length!==1?"s":""}
      </p>

      {/* ✅ Real stats */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:52}}>
        {[
          { v: data.experience.length, l:"Total Roles",       color:C.coral,  bg:"#fff0f0" },
          { v: yearsExp,               l:"Years Experience",  color:C.violet, bg:"#f3f0ff" },
          { v: companies,              l:"Companies",         color:C.mint,   bg:"#f0fff8" },
        ].map(({v,l,color,bg}) => (
          <div key={l} className="card" style={{padding:"24px 20px",textAlign:"center",background:bg,borderColor:"transparent"}}>
            <p style={{fontFamily:C.display,fontWeight:700,fontSize:36,color,lineHeight:1,marginBottom:6}}>
              <CountUp target={typeof v==="number"?v:v} />
            </p>
            <p style={{fontFamily:C.mono,fontSize:10,color:C.inkFaint,letterSpacing:"0.15em",textTransform:"uppercase"}}>{l}</p>
          </div>
        ))}
      </div>

      {current.length>0 && (
        <div style={{marginBottom:36}}>
          <span className="eyebrow" style={{marginBottom:16}}>Current Position</span>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {current.map((e,i)=><ExpCard key={e.id} item={e} idx={i}/>)}
          </div>
        </div>
      )}
      {past.length>0 && (
        <div style={{marginBottom:36}}>
          <span className="eyebrow" style={{marginBottom:16}}>Past Positions</span>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {past.map((e,i)=><ExpCard key={e.id} item={e} idx={i}/>)}
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:12,marginTop:8}}>
        <button onClick={()=>onNavigate("education")} className="btn-outline" style={{fontSize:13,padding:"10px 22px"}}>Education →</button>
        <button onClick={()=>onNavigate("projects")}  className="btn-primary"  style={{fontSize:13,padding:"10px 24px"}}>Projects →</button>
      </div>
    </PageWrapper>
  );
}

// ─── EDUCATION PAGE ───────────────────────────────────────────────────────────
const DEGREE_ICONS: Record<string,string> = {
  bachelor:"🎓", master:"📚", phd:"🔬", bootcamp:"💻", certificate:"📋", diploma:"📜",
};
const getDegreeIcon = (d:string) => {
  const k = Object.keys(DEGREE_ICONS).find(k=>d?.toLowerCase().includes(k));
  return k ? DEGREE_ICONS[k] : "🎓";
};

function EducationPage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const certs = data.certifications ?? [];

  return (
    <PageWrapper>
      <button onClick={()=>onNavigate("home")}
        style={{background:"none",border:"none",cursor:"pointer",fontFamily:C.mono,fontSize:11,color:C.inkFaint,letterSpacing:"0.12em",textTransform:"uppercase",padding:"0 0 16px"}}>
        ← Back
      </button>
      <span className="eyebrow">Academic Background</span>
      <h1 style={{fontFamily:C.display,fontWeight:700,fontSize:"clamp(2.2rem,5vw,3.5rem)",color:C.ink,letterSpacing:"-0.04em",lineHeight:1,marginBottom:4}}>
        Education
      </h1>
      <p style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:48}}>
        {data.education.length} institution{data.education.length!==1?"s":""}
        {certs.length>0?` · ${certs.length} certification${certs.length!==1?"s":""}` : ""}
      </p>

      {/* Education entries */}
      <div style={{display:"flex",flexDirection:"column",gap:16,marginBottom:52}}>
        {data.education.map((item,idx) => {
          const dur = item.start_year&&item.end_year ? parseInt(item.end_year)-parseInt(item.start_year) : null;
          const col = PILL_COLOURS[idx%PILL_COLOURS.length];
          return (
            <div key={item.id} className="card" style={{padding:28}}>
              <div style={{display:"flex",gap:20,alignItems:"flex-start"}}>
                <div style={{
                  width:56,height:56,borderRadius:16,flexShrink:0,
                  background:`linear-gradient(135deg,${col.bg},${col.border})`,
                  border:`1.5px solid ${col.border}`,
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,
                }}>
                  {getDegreeIcon(item.degree)}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,flexWrap:"wrap",marginBottom:12}}>
                    <div>
                      <h3 style={{fontFamily:C.display,fontWeight:700,fontSize:17,color:C.ink,margin:"0 0 4px",letterSpacing:"-0.02em"}}>{item.degree}</h3>
                      {item.field && <p style={{fontFamily:C.body,fontSize:14,color:C.violet,fontWeight:600,margin:"0 0 2px"}}>{item.field}</p>}
                      <p style={{fontFamily:C.body,fontSize:13,color:C.inkMid,fontWeight:500}}>{item.institution}</p>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
                      <span style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint}}>{item.start_year} — {item.end_year}</span>
                      {dur!==null&&dur>0 && (
                        <span className="tag" style={{background:col.bg,color:col.text,borderColor:col.border,fontSize:10}}>
                          {dur}yr{dur!==1?"s":""}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.gpa && (
                    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:`${col.bg}`,border:`1.5px solid ${col.border}`,borderRadius:100,padding:"4px 14px",marginBottom:12}}>
                      <span style={{fontFamily:C.mono,fontSize:10,color:C.inkFaint,letterSpacing:"0.1em"}}>GPA</span>
                      <span style={{fontFamily:C.display,fontWeight:700,fontSize:14,color:col.text}}>{item.gpa}</span>
                    </div>
                  )}
                  {item.description && (
                    <p style={{fontFamily:C.body,fontSize:13.5,color:C.inkMid,lineHeight:1.75,marginBottom:14}}>{item.description}</p>
                  )}
                  {item.achievements&&item.achievements.length>0 && (
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {item.achievements.map((a,i)=>(
                        <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                          <span style={{color:C.amber,fontSize:14,flexShrink:0,marginTop:1}}>✦</span>
                          <span style={{fontFamily:C.body,fontSize:13.5,color:C.inkMid,lineHeight:1.6}}>{a}</span>
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

      {/* Certifications */}
      {certs.length>0 && (
        <div style={{marginBottom:48}}>
          <span className="eyebrow" style={{marginBottom:16}}>Credentials</span>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {certs.map((c,idx)=>{
              const col=PILL_COLOURS[idx%PILL_COLOURS.length];
              return (
                <div key={c.id} className="card" style={{padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
                  <div style={{display:"flex",gap:16,alignItems:"center"}}>
                    <div style={{width:44,height:44,borderRadius:12,background:col.bg,border:`1.5px solid ${col.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📋</div>
                    <div>
                      <p style={{fontFamily:C.display,fontWeight:700,fontSize:14,color:C.ink,margin:"0 0 3px",letterSpacing:"-0.01em"}}>{c.name}</p>
                      <p style={{fontFamily:C.mono,fontSize:10,color:C.inkFaint,letterSpacing:"0.08em",textTransform:"uppercase"}}>{c.issuer}</p>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:12,flexShrink:0}}>
                    {c.year && <span style={{fontFamily:C.mono,fontSize:11,color:C.inkFaint}}>{c.year}</span>}
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noreferrer"
                        style={{fontFamily:C.body,fontWeight:700,fontSize:12,padding:"6px 16px",borderRadius:100,background:`linear-gradient(135deg,${col.text},${C.violet})`,color:"#fff",boxShadow:`0 2px 8px rgba(0,0,0,0.12)`}}>
                        View ↗
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{display:"flex",gap:12}}>
        <button onClick={()=>onNavigate("experience")} className="btn-outline" style={{fontSize:13,padding:"10px 22px"}}>← Experience</button>
        <button onClick={()=>onNavigate("projects")}   className="btn-primary"  style={{fontSize:13,padding:"10px 24px"}}>Projects →</button>
      </div>
    </PageWrapper>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function CreativeTemplate({ data = SAMPLE_DATA }: { data?: PortfolioData }) {
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
      <div style={{ minHeight:"100vh", background:C.bg }}>
        <Nav data={data} currentPage={page} onNavigate={setPage} />
        <main key={page}>{pages[page]}</main>
        <Footer data={data} onNavigate={setPage} />
      </div>
    </>
  );
}