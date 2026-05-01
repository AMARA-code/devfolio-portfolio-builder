"use client";

import { useState, useRef, useEffect } from "react";
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

// ─── DESIGN TOKENS — Premium Obsidian Dark ───────────────────────────────────
const T = {
  bg:           "#050709",
  surface:      "#0a0e14",
  elevated:     "#0f1520",
  card:         "#111827",
  border:       "#1a2332",
  borderHi:     "#243040",
  borderGlow:   "#2a4060",

  // Electric violet-blue accent system
  accent:       "#6c8eff",
  accentAlt:    "#a78bfa",
  accentCyan:   "#22d3ee",
  accentWarm:   "#fb923c",
  accentDim:    "rgba(108,142,255,0.1)",
  accentGlow:   "rgba(108,142,255,0.2)",
  accentGlow2:  "rgba(167,139,250,0.15)",

  textPri:   "#f0f4ff",
  textSec:   "#8892a4",
  textDim:   "#3d4a5c",
  textMuted: "#5a6878",

  font:  "'DM Sans', sans-serif",
  mono:  "'JetBrains Mono', monospace",
  display: "'Clash Display', 'DM Sans', sans-serif",

  gradientA: "linear-gradient(135deg, #6c8eff 0%, #a78bfa 50%, #22d3ee 100%)",
  gradientB: "linear-gradient(135deg, #0a0e14 0%, #0f1a28 100%)",
  gradientCard: "linear-gradient(145deg, #111827 0%, #0d1421 100%)",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: smooth; }

  body {
    background: ${T.bg};
    color: ${T.textPri};
    font-family: ${T.font};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, ${T.accent}, ${T.accentAlt});
    border-radius: 3px;
  }

  /* ── KEYFRAMES ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.8; }
    70%  { transform: scale(1.8); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes scanLine {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(1000%); opacity: 0; }
  }
  @keyframes orb-drift {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(30px, -20px) scale(1.05); }
    66%  { transform: translate(-15px, 15px) scale(0.97); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes borderGlow {
    0%, 100% { border-color: ${T.border}; box-shadow: none; }
    50%       { border-color: rgba(108,142,255,0.4); box-shadow: 0 0 20px rgba(108,142,255,0.1); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }

  /* ── UTILITY CLASSES ── */
  .fade-up   { animation: fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-in   { animation: fadeIn 0.5s ease both; }
  .slide-left { animation: slideInLeft 0.5s cubic-bezier(0.22,1,0.36,1) both; }

  .delay-1 { animation-delay: 0.05s; }
  .delay-2 { animation-delay: 0.12s; }
  .delay-3 { animation-delay: 0.20s; }
  .delay-4 { animation-delay: 0.30s; }
  .delay-5 { animation-delay: 0.40s; }
  .delay-6 { animation-delay: 0.52s; }

  /* ── CARDS ── */
  .card {
    background: ${T.gradientCard};
    border: 1px solid ${T.border};
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.3s ease, transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
  }
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(108,142,255,0.03) 0%, transparent 60%);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
  }
  .card:hover {
    border-color: ${T.borderGlow};
    transform: translateY(-3px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,142,255,0.08);
  }
  .card:hover::before { opacity: 1; }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: ${T.accent};
    color: #050709;
    border: none;
    font-family: ${T.font};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.02em;
    padding: 11px 22px;
    border-radius: 8px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s, opacity 0.2s;
    white-space: nowrap;
  }
  .btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(108,142,255,0.4);
    opacity: 0.95;
  }
  .btn-primary:hover::before { opacity: 1; }
  .btn-primary:active { transform: translateY(0); }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.03);
    color: ${T.textSec};
    border: 1px solid ${T.border};
    font-family: ${T.font};
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.02em;
    padding: 10px 22px;
    border-radius: 8px;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s;
    white-space: nowrap;
  }
  .btn-ghost:hover {
    border-color: rgba(108,142,255,0.4);
    color: ${T.textPri};
    background: rgba(108,142,255,0.06);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(108,142,255,0.1);
  }

  /* ── TAGS ── */
  .tag {
    font-family: ${T.mono};
    font-size: 10.5px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(108,142,255,0.1);
    border: 1px solid rgba(108,142,255,0.2);
    color: ${T.accent};
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
    cursor: default;
    display: inline-block;
  }
  .tag:hover {
    background: rgba(108,142,255,0.18);
    border-color: rgba(108,142,255,0.4);
    transform: translateY(-1px);
  }

  .tag-neutral {
    font-family: ${T.mono};
    font-size: 10.5px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    border: 1px solid ${T.border};
    color: ${T.textMuted};
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    display: inline-block;
  }
  .tag-neutral:hover {
    background: rgba(255,255,255,0.07);
    border-color: ${T.borderHi};
    color: ${T.textSec};
  }

  /* ── NAV LINKS ── */
  .nav-link {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 7px 14px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-family: ${T.mono};
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    position: relative;
  }
  .nav-link.active {
    background: rgba(108,142,255,0.12);
    color: ${T.accent};
    box-shadow: 0 0 0 1px rgba(108,142,255,0.25);
  }
  .nav-link.inactive {
    background: transparent;
    color: ${T.textDim};
  }
  .nav-link.inactive:hover {
    color: ${T.textSec};
    background: rgba(255,255,255,0.04);
  }

  /* ── SECTION LABEL ── */
  .section-label {
    font-family: ${T.mono};
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    background: ${T.gradientA};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;
    display: inline-block;
  }

  /* ── GRADIENT TEXT ── */
  .gradient-text {
    background: ${T.gradientA};
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 4s linear infinite;
  }

  /* ── SHIMMER TEXT ── */
  .shimmer {
    background: linear-gradient(90deg, ${T.textSec} 0%, ${T.textPri} 40%, ${T.accent} 50%, ${T.textPri} 60%, ${T.textSec} 100%);
    background-size: 200% auto;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  /* ── LINK ── */
  .link-accent {
    color: ${T.accent};
    text-decoration: none;
    position: relative;
    transition: opacity 0.2s;
  }
  .link-accent::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 0; right: 0;
    height: 1px;
    background: ${T.accent};
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.25s ease;
  }
  .link-accent:hover { opacity: 0.85; }
  .link-accent:hover::after { transform: scaleX(1); }

  /* ── DIVIDER ── */
  .divider {
    border: none;
    border-top: 1px solid ${T.border};
  }

  /* ── FLOATING ORB ── */
  .orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
  }

  /* ── RESPONSIVE GRID ── */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }
  .two-col-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .three-col-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* ── MOBILE NAV ── */
  .mobile-menu {
    display: none;
  }
  .desktop-nav {
    display: flex;
    gap: 2px;
  }

  /* ── CURSOR GLOW ── */
  .cursor-glow {
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(108,142,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    z-index: 9999;
    mix-blend-mode: screen;
  }

  /* ── RESPONSIVE BREAKPOINTS ── */
  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .two-col-grid { grid-template-columns: 1fr; }
    .three-col-grid { grid-template-columns: repeat(2, 1fr); }
    .desktop-nav { display: none; }
    .mobile-menu { display: flex; }
    .project-grid { grid-template-columns: 1fr; }
    .hire-me-btn { display: none; }
  }

  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .three-col-grid { grid-template-columns: 1fr; }
    .btn-row { flex-direction: column; width: 100%; }
    .btn-row .btn-primary, .btn-row .btn-ghost { width: 100%; justify-content: center; }
  }

  /* ── NOISE TEXTURE ── */
  .noise::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    border-radius: inherit;
    opacity: 0.4;
  }

  /* ── STATUS PULSE ── */
  .status-dot {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;
    flex-shrink: 0;
  }
  .status-dot::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    background: rgba(34,197,94,0.3);
    animation: pulse-ring 2s ease infinite;
  }

  /* ── TYPING CURSOR ── */
  .cursor-blink::after {
    content: '|';
    animation: blink 1s step-end infinite;
    color: ${T.accent};
    margin-left: 2px;
  }

  /* INPUT STYLES */
  .form-input {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid ${T.border};
    border-radius: 8px;
    padding: 11px 14px;
    font-size: 13px;
    color: ${T.textPri};
    background: ${T.elevated};
    outline: none;
    font-family: ${T.font};
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-input:focus {
    border-color: rgba(108,142,255,0.5);
    box-shadow: 0 0 0 3px rgba(108,142,255,0.08);
  }
  .form-input::placeholder { color: ${T.textDim}; }

  /* CONTACT ROW HOVER */
  .contact-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 11px 14px;
    border-radius: 10px;
    background: ${T.elevated};
    border: 1px solid ${T.border};
    text-decoration: none;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
  }
  .contact-row:hover {
    border-color: rgba(108,142,255,0.35);
    background: rgba(108,142,255,0.05);
    transform: translateX(3px);
  }

  /* EXP CARD LEFT BORDER GLOW */
  .exp-card-current {
    border-left: 2px solid ${T.accent} !important;
    box-shadow: -3px 0 20px rgba(108,142,255,0.1);
  }
  .exp-card-past {
    border-left: 2px solid ${T.border} !important;
  }

  /* FILTER PILLS */
  .filter-pill {
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid ${T.border};
    font-family: ${T.mono};
    font-size: 10.5px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    transition: all 0.2s;
    background: transparent;
    color: ${T.textDim};
  }
  .filter-pill:hover {
    border-color: ${T.borderHi};
    color: ${T.textSec};
  }
  .filter-pill.active {
    background: ${T.accent};
    border-color: ${T.accent};
    color: #050709;
    box-shadow: 0 4px 14px rgba(108,142,255,0.3);
  }

  /* Hero grid lines */
  .hero-grid {
    background-image:
      linear-gradient(rgba(108,142,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(108,142,255,0.04) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  /* Glow line bottom */
  .glow-line {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, ${T.accent} 30%, ${T.accentAlt} 70%, transparent 100%);
    opacity: 0.4;
  }

  /* Card number label */
  .card-number {
    font-family: ${T.mono};
    font-size: 10px;
    color: ${T.textDim};
    letter-spacing: 0.1em;
    position: absolute;
    top: 14px; right: 16px;
  }
`;

// ─── CURSOR GLOW EFFECT ───────────────────────────────────────────────────────
function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return <div ref={ref} className="cursor-glow" />;
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (p: Page) => {
    onNavigate(p);
    setMenuOpen(false);
  };

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(5,7,9,0.92)" : "rgba(5,7,9,0.7)",
        backdropFilter: "blur(24px)",
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto",
          padding: "0 clamp(16px, 4vw, 32px)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          height: "clamp(56px, 8vw, 64px)",
        }}>
          {/* Brand */}
          <button onClick={() => handleNav("home")}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, rgba(108,142,255,0.2) 0%, rgba(167,139,250,0.2) 100%)",
              border: "1px solid rgba(108,142,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.font, fontWeight: 800, fontSize: 16,
              color: T.accent,
              boxShadow: "0 0 20px rgba(108,142,255,0.15)",
              transition: "box-shadow 0.3s",
              flexShrink: 0,
            }}>
              {data.full_name.charAt(0)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 14, color: T.textPri, letterSpacing: "0.01em", lineHeight: 1.2 }}>
                {data.full_name}
              </span>
              <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                @{data.username}
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="desktop-nav">
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                className={`nav-link ${currentPage === page ? "active" : "inactive"}`}>
                {label}
              </button>
            ))}
          </nav>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {data.email && (
              <a href={`mailto:${data.email}`} className="btn-primary hire-me-btn" style={{ textDecoration: "none", fontSize: 12 }}>
                Hire Me ↗
              </a>
            )}
            {/* Mobile Hamburger */}
            <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: menuOpen ? "rgba(108,142,255,0.1)" : "rgba(255,255,255,0.04)",
                border: `1px solid ${menuOpen ? "rgba(108,142,255,0.3)" : T.border}`,
                borderRadius: 8, width: 40, height: 40, cursor: "pointer",
                flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
              }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: "block", width: i === 1 ? (menuOpen ? 14 : 20) : 20, height: 1.5,
                  background: menuOpen ? T.accent : T.textSec, borderRadius: 2,
                  transition: "all 0.2s",
                }} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            background: "rgba(5,7,9,0.98)", borderTop: `1px solid ${T.border}`,
            padding: "16px clamp(16px,4vw,32px)",
            animation: "fadeUp 0.2s ease",
          }}>
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: currentPage === page ? "rgba(108,142,255,0.1)" : "transparent",
                  border: "none", borderRadius: 8,
                  padding: "12px 14px", marginBottom: 4,
                  fontFamily: T.mono, fontWeight: 600, fontSize: 11,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: currentPage === page ? T.accent : T.textSec,
                  cursor: "pointer", transition: "all 0.2s",
                }}>
                {label}
              </button>
            ))}
            {data.email && (
              <a href={`mailto:${data.email}`} className="btn-primary"
                style={{ textDecoration: "none", width: "100%", justifyContent: "center", marginTop: 8, fontSize: 12 }}>
                Hire Me ↗
              </a>
            )}
          </div>
        )}
      </header>
    </>
  );
}

function Footer({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: "clamp(24px,4vw,40px) clamp(16px,4vw,32px)",
      marginTop: 80, position: "relative",
    }}>
      <div style={{
        position: "absolute", top: 0, left: "10%", right: "10%", height: 1,
        background: `linear-gradient(90deg, transparent, ${T.accent}, ${T.accentAlt}, transparent)`,
        opacity: 0.3,
      }} />
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: "rgba(108,142,255,0.1)", border: "1px solid rgba(108,142,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.font, fontWeight: 800, fontSize: 13, color: T.accent,
            }}>
              {data.full_name.charAt(0)}
            </div>
            <span style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.textSec }}>
              {data.full_name}
            </span>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => onNavigate(page)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: T.mono, fontSize: 10, color: T.textDim,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  padding: "6px 10px", borderRadius: 4,
                  transition: "color 0.2s", 
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.textSec)}
                onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 12,
          paddingTop: 16, borderTop: `1px solid ${T.border}`,
        }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()} {data.full_name.toUpperCase()} · ALL RIGHTS RESERVED
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.08em" }}>
            BUILT WITH CRAFT ✦ {data.location}
          </span>
        </div>
      </div>
    </footer>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: 1100, margin: "0 auto",
      padding: "clamp(24px,5vw,52px) clamp(16px,4vw,32px) 40px",
    }}>
      {children}
    </div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = Math.ceil(value / 20);
          const timer = setInterval(() => {
            start = Math.min(start + step, value);
            setDisplay(start);
            if (start >= value) clearInterval(timer);
          }, 40);
          observer.disconnect();
        }
      }, { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}</span>;
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <div className="fade-up hero-grid noise" style={{
        position: "relative",
        borderRadius: 20,
        border: `1px solid ${T.border}`,
        overflow: "hidden",
        marginBottom: 14,
        padding: "clamp(28px,6vw,68px) clamp(20px,5vw,60px)",
        background: T.surface,
      }}>
        {/* Orbs */}
        <div className="orb" style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(108,142,255,0.15) 0%, transparent 70%)",
          top: -100, right: -100,
          animation: "orb-drift 12s ease-in-out infinite",
        }} />
        <div className="orb" style={{
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(167,139,250,0.1) 0%, transparent 70%)",
          bottom: -80, left: -80,
          animation: "orb-drift 16s ease-in-out infinite reverse",
        }} />

        {/* Scan line */}
        <div style={{
          position: "absolute", left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
          opacity: 0.4, pointerEvents: "none",
          animation: "scanLine 6s ease-in-out infinite",
        }} />

        <div className="glow-line" />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Status badge */}
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, padding: "6px 14px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
            <div className="status-dot" />
            <span style={{ fontFamily: T.mono, fontSize: 10, color: "#86efac", letterSpacing: "0.15em", fontWeight: 600 }}>
              AVAILABLE FOR WORK
            </span>
          </div>

          <h1 className="fade-up delay-1" style={{
            fontFamily: T.font, fontWeight: 800,
            fontSize: "clamp(2.2rem, 6vw, 4.2rem)",
            color: T.textPri, lineHeight: 1.05,
            letterSpacing: "-0.04em", margin: "0 0 6px",
          }}>
            {data.full_name}
          </h1>

          <p className="fade-up delay-2" style={{
            fontFamily: T.mono, fontSize: "clamp(11px,1.5vw,13px)",
            marginBottom: 20, letterSpacing: "0.1em",
          }}>
            <span className="gradient-text">@{data.username}</span>
            <span style={{ color: T.textDim }}> · {data.location}</span>
          </p>

          <p className="fade-up delay-3" style={{
            fontFamily: T.font, fontSize: "clamp(13px,1.8vw,15px)", lineHeight: 1.8,
            color: T.textSec, maxWidth: 560, margin: "0 0 36px",
          }}>
            {data.bio}
          </p>

          <div className="fade-up delay-4 btn-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
      <div className="fade-up delay-2 stats-grid" style={{ marginBottom: 14 }}>
        {[
          { v: data.projects.length, l: "Projects", suffix: "" },
          { v: data.skills.length, l: "Skills", suffix: "+" },
          { v: data.experience.length, l: "Positions", suffix: "" },
          { v: data.education.length, l: "Degrees", suffix: "" },
        ].map(({ v, l, suffix }, i) => (
          <div key={l} className="card" style={{ padding: "clamp(16px,3vw,24px) clamp(12px,2vw,16px)", textAlign: "center" }}>
            <div className="glow-line" style={{ opacity: 0.3, background: `linear-gradient(90deg, transparent, ${[T.accent, T.accentAlt, T.accentCyan, T.accentWarm][i]}, transparent)` }} />
            <p style={{
              fontFamily: T.font, fontSize: "clamp(24px,4vw,34px)", fontWeight: 800,
              background: `linear-gradient(135deg, ${[T.accent, T.accentAlt, T.accentCyan, T.accentWarm][i]}, ${T.textPri})`,
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              margin: "0 0 4px",
            }}>
              <AnimatedNumber value={v} />{suffix}
            </p>
            <p style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {l}
            </p>
          </div>
        ))}
      </div>

      {/* ── About + Skills ── */}
      <div className="fade-up delay-3 two-col-grid" style={{ marginBottom: 14 }}>
        {/* About */}
        <div className="card" style={{ padding: "clamp(18px,3vw,28px)" }}>
          <p className="section-label">About</p>
          <hr className="divider" style={{ margin: "12px 0 18px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[
              { l: "Location", v: data.location },
              { l: "Email", v: data.email, link: `mailto:${data.email}` },
              { l: "Website", v: "Visit →", link: data.website },
              { l: "GitHub", v: "View Profile →", link: data.github_url },
            ].filter(({ v }) => v).map(({ l, v, link }) => (
              <div key={l} style={{ display: "flex", gap: 10, alignItems: "flex-start", flexWrap: "wrap" }}>
                <span style={{
                  fontFamily: T.mono, fontSize: 9, color: T.textDim,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  minWidth: 60, flexShrink: 0, paddingTop: 2,
                }}>
                  {l}
                </span>
                {link
                  ? <a href={link} target="_blank" rel="noreferrer" className="link-accent"
                    style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, wordBreak: "break-all" }}>{v}</a>
                  : <span style={{ fontFamily: T.font, fontSize: 13, color: T.textSec }}>{v}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ padding: "clamp(18px,3vw,28px)" }}>
          <p className="section-label">Tech Stack</p>
          <hr className="divider" style={{ margin: "12px 0 18px" }} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {data.skills.map((s, i) => (
              <span key={s.id} className="tag" style={{
                animationDelay: `${i * 0.04}s`,
                animation: "fadeIn 0.4s ease both",
              }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Projects ── */}
      <div className="fade-up delay-4" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
          <div>
            <p className="section-label">Featured Work</p>
            <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(18px,3vw,22px)", color: T.textPri, letterSpacing: "-0.02em" }}>
              Recent Projects
            </h2>
          </div>
          <button className="btn-ghost" onClick={() => onNavigate("projects")} style={{ fontSize: 12, padding: "7px 16px" }}>
            All projects →
          </button>
        </div>
        <div className="project-grid">
          {data.projects.slice(0, 2).map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </div>

      {/* ── Experience Preview + Contact ── */}
      <div className="fade-up delay-5 two-col-grid">
        {/* Exp preview */}
        <div className="card" style={{ padding: "clamp(18px,3vw,28px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
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
                transition: "opacity 0.2s",
              }}>
                <div style={{ paddingTop: 5, flexShrink: 0 }}>
                  {item.is_current
                    ? <div className="status-dot" />
                    : <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.textDim }} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.textPri, margin: "0 0 2px" }}>{item.role}</p>
                  <p style={{ fontFamily: T.font, fontSize: 12, color: T.accent, fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
                  <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.04em" }}>
                    {item.start_date} — {item.is_current ? "Present" : item.end_date}
                  </p>
                </div>
                {item.is_current && (
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, fontWeight: 600,
                    padding: "3px 8px", borderRadius: 4,
                    background: "rgba(34,197,94,0.1)", color: "#86efac",
                    border: "1px solid rgba(34,197,94,0.2)",
                    letterSpacing: "0.1em", flexShrink: 0,
                  }}>LIVE</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="card" style={{ padding: "clamp(18px,3vw,28px)", display: "flex", flexDirection: "column" }}>
          <p className="section-label">Let's Talk</p>
          <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 18, color: T.textPri, letterSpacing: "-0.02em", margin: "0 0 18px" }}>
            Contact
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {[
              { label: "Email", val: data.email, href: `mailto:${data.email}` },
              { label: "LinkedIn", val: "linkedin →", href: data.linkedin_url },
              { label: "Twitter", val: "twitter →", href: data.twitter_url },
              { label: "GitHub", val: "github →", href: data.github_url },
            ].filter(({ href }) => href).map(({ label, val, href }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="contact-row">
                <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
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

  const colors = ["#6c8eff", "#a78bfa", "#22d3ee", "#fb923c", "#34d399"];
  const colorIdx = project.id.charCodeAt(0) % colors.length;
  const accentColor = colors[colorIdx];

  return (
    <article
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ overflow: "hidden" }}
    >
      {/* Thumbnail */}
      <a
        href={project.live_url ?? "#"}
        target={project.live_url ? "_blank" : "_self"}
        rel="noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "clamp(140px, 20vw, 180px)",
          background: `linear-gradient(135deg, ${T.elevated} 0%, ${T.surface} 100%)`,
          position: "relative", overflow: "hidden", textDecoration: "none",
        }}
      >
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(108,142,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(108,142,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }} />

        {/* Colored ambient light */}
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at center, ${accentColor}18 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0.5,
          transition: "opacity 0.4s",
        }} />

        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
        ) : (
          <span style={{
            fontFamily: T.font, fontWeight: 800,
            fontSize: "clamp(40px,8vw,60px)",
            color: accentColor, position: "relative",
            letterSpacing: "-0.04em", opacity: hovered ? 0.9 : 0.5,
            transition: "opacity 0.3s, transform 0.3s",
            transform: hovered ? "scale(1.08)" : "scale(1)",
            textShadow: `0 0 40px ${accentColor}60`,
          }}>
            {project.title.charAt(0)}
          </span>
        )}

        {/* Hover overlay */}
        {project.live_url && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(5,7,9,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s",
          }}>
            <span style={{
              fontFamily: T.mono, fontSize: 11, fontWeight: 700,
              color: accentColor, border: `1px solid ${accentColor}`,
              padding: "7px 18px", borderRadius: 6, letterSpacing: "0.12em",
              boxShadow: `0 0 20px ${accentColor}40`,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition: "transform 0.3s",
            }}>
              VISIT SITE ↗
            </span>
          </div>
        )}

        {/* Top right badge */}
        {project.featured && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            fontFamily: T.mono, fontSize: 9, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20,
            background: "rgba(108,142,255,0.15)", color: T.accent,
            border: "1px solid rgba(108,142,255,0.3)",
            letterSpacing: "0.12em",
          }}>
            FEATURED
          </div>
        )}
      </a>

      <div style={{ padding: "clamp(14px,3vw,20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: T.font, fontSize: "clamp(14px,2vw,16px)", fontWeight: 800,
            color: T.textPri, letterSpacing: "-0.01em", lineHeight: 1.3,
          }}>
            {project.title}
          </h3>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 5,
                  background: `${accentColor}18`, color: accentColor,
                  textDecoration: "none",
                  border: `1px solid ${accentColor}35`,
                  letterSpacing: "0.1em",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}28`; e.currentTarget.style.boxShadow = `0 4px 12px ${accentColor}30`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${accentColor}18`; e.currentTarget.style.boxShadow = "none"; }}>
                LIVE ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 5,
                  background: T.elevated, color: T.textMuted,
                  textDecoration: "none", border: `1px solid ${T.border}`,
                  letterSpacing: "0.1em",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textSec; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                CODE
              </a>
            )}
          </div>
        </div>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.75, margin: "0 0 14px" }}>
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
function AddProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Project) => void }) {
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

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "clamp(12px,3vw,20px)", backdropFilter: "blur(12px)",
    }}>
      <div className="card" style={{
        borderRadius: 20, padding: "clamp(20px,4vw,32px)",
        width: "100%", maxWidth: 520,
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 32px 100px rgba(0,0,0,0.8)",
        animation: "fadeUp 0.25s cubic-bezier(0.22,1,0.36,1)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <p className="section-label">New Entry</p>
            <h3 style={{ fontFamily: T.font, fontWeight: 800, fontSize: 20, color: T.textPri }}>Add Project</h3>
          </div>
          <button onClick={onClose}
            style={{
              background: T.elevated, border: `1px solid ${T.border}`,
              borderRadius: 8, width: 34, height: 34, cursor: "pointer",
              color: T.textSec, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textPri; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}>
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Image upload */}
          <div>
            <label style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Screenshot
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `1px dashed ${dragging ? T.accent : T.border}`,
                borderRadius: 12, cursor: "pointer",
                background: dragging ? T.accentDim : T.elevated,
                transition: "all 0.2s", overflow: "hidden",
                minHeight: preview ? "auto" : 110,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {preview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 180, objectFit: "cover", display: "block" }} />
                  <button onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                    style={{
                      position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)",
                      border: `1px solid ${T.border}`, borderRadius: 6, width: 28, height: 28,
                      cursor: "pointer", fontSize: 12, color: T.textPri,
                    }}>
                    ✕
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "24px 16px" }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📷</div>
                  <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.1em" }}>DROP IMAGE OR CLICK TO UPLOAD</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          {[
            { key: "title", label: "Title *", placeholder: "My Awesome Project" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
                {label}
              </label>
              <input className="form-input" placeholder={placeholder}
                value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}

          <div>
            <label style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Description
            </label>
            <textarea className="form-input" style={{ resize: "vertical", minHeight: 80 }} rows={3}
              placeholder="What does this project do?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { key: "live_url", label: "Live URL", placeholder: "https://..." },
              { key: "github_url", label: "GitHub URL", placeholder: "https://github.com/..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>{label}</label>
                <input className="form-input" placeholder={placeholder} type="url"
                  value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.15em", textTransform: "uppercase", display: "block", marginBottom: 8 }}>
              Tech Stack
            </label>
            <input className="form-input" placeholder="React, TypeScript, Tailwind (comma separated)"
              value={form.tech_stack_raw} onChange={(e) => setForm({ ...form, tech_stack_raw: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={submit} disabled={!form.title.trim()} className="btn-primary"
            style={{ opacity: form.title.trim() ? 1 : 0.35, cursor: form.title.trim() ? "pointer" : "not-allowed" }}>
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

      <button onClick={() => onNavigate("home")} className="fade-up"
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: "0 0 16px", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
        ← Back
      </button>

      <div className="fade-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 14 }}>
        <div>
          <p className="section-label">Portfolio</p>
          <h1 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(26px,5vw,36px)", color: T.textPri, letterSpacing: "-0.03em", margin: 0 }}>
            Projects
          </h1>
          <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 4, letterSpacing: "0.12em" }}>
            {filtered.length} ITEMS
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + Add Project
        </button>
      </div>

      {/* Filter pills */}
      {allTechs.length > 0 && (
        <div className="fade-up delay-1" style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
          {["all", ...allTechs].map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`filter-pill ${filter === t ? "active" : ""}`}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="project-grid fade-up delay-2">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontFamily: T.mono, fontSize: 12, color: T.textDim, letterSpacing: "0.15em" }}>NO RESULTS</p>
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
        {items.map((item, i) => (
          <div key={item.id} className={`card ${item.is_current ? "exp-card-current" : "exp-card-past"}`}
            style={{
              padding: "clamp(16px,3vw,24px)",
              animation: `fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`,
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(14px,2vw,16px)", color: T.textPri, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                  {item.role}
                </h3>
                <p style={{ fontFamily: T.font, fontSize: 13, color: T.accent, fontWeight: 600, margin: "0 0 2px" }}>
                  {item.company}
                </p>
                {item.location && (
                  <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.06em" }}>{item.location}</p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, flexWrap: "wrap" }}>
                {item.is_current && (
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, fontWeight: 700, letterSpacing: "0.15em",
                    padding: "3px 10px", borderRadius: 20,
                    background: "rgba(34,197,94,0.1)", color: "#86efac",
                    border: "1px solid rgba(34,197,94,0.25)",
                  }}>CURRENT</span>
                )}
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.04em" }}>
                  {item.start_date} — {item.is_current ? "Present" : item.end_date}
                </span>
              </div>
            </div>
            {item.description && (
              <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.75, margin: "0 0 14px" }}>
                {item.description}
              </p>
            )}
            {item.skills && item.skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.skills.map((s) => <span key={s} className="tag-neutral">{s}</span>)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <button onClick={() => onNavigate("home")} className="fade-up"
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: "0 0 16px", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
        ← Back
      </button>

      <div className="fade-up">
        <p className="section-label">Career History</p>
        <h1 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(26px,5vw,36px)", color: T.textPri, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
          Experience
        </h1>
        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, margin: "0 0 32px", letterSpacing: "0.12em" }}>
          {data.experience.length} POSITIONS
        </p>
      </div>

      {/* Stats */}
      <div className="three-col-grid fade-up delay-1" style={{ marginBottom: 40 }}>
        {[
          { v: data.experience.length, l: "Total Roles", color: T.accent },
          { v: current.length, l: "Currently Active", color: "#22c55e" },
          { v: new Set(data.experience.map((e) => e.company)).size, l: "Companies", color: T.accentAlt },
        ].map(({ v, l, color }) => (
          <div key={l} className="card" style={{ padding: "clamp(14px,3vw,20px)", textAlign: "center" }}>
            <p style={{
              fontFamily: T.font, fontSize: "clamp(22px,4vw,30px)", fontWeight: 800,
              color, margin: "0 0 4px",
              textShadow: `0 0 24px ${color}40`,
            }}>
              <AnimatedNumber value={v} />
            </p>
            <p style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.14em", textTransform: "uppercase" }}>{l}</p>
          </div>
        ))}
      </div>

      {current.length > 0 && <ExpSection title="// Current Position" items={current} />}
      {past.length > 0 && <ExpSection title="// Past Positions" items={past} />}

      <div className="btn-row fade-up" style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
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
const getDegreeIcon = (d: string) => {
  const k = Object.keys(DEGREE_ICONS).find((k) => d?.toLowerCase().includes(k));
  return k ? DEGREE_ICONS[k] : "🎓";
};

function EducationPage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const certs = data.certifications ?? [];

  return (
    <PageWrapper>
      <button onClick={() => onNavigate("home")} className="fade-up"
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: "0 0 16px", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accent)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
        ← Back
      </button>

      <div className="fade-up">
        <p className="section-label">Academic Background</p>
        <h1 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(26px,5vw,36px)", color: T.textPri, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
          Education
        </h1>
        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, margin: "0 0 32px", letterSpacing: "0.12em" }}>
          {data.education.length} INSTITUTION{data.education.length !== 1 ? "S" : ""}
          {certs.length > 0 ? ` · ${certs.length} CERTIFICATIONS` : ""}
        </p>
      </div>

      <div className="fade-up delay-1" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 44 }}>
        {data.education.map((item, i) => {
          const dur = item.start_year && item.end_year
            ? parseInt(item.end_year) - parseInt(item.start_year)
            : null;
          return (
            <div key={item.id} className="card"
              style={{ padding: "clamp(16px,3vw,24px)", animation: `fadeUp 0.5s ease ${i * 0.08}s both` }}>
              <div style={{ display: "flex", gap: "clamp(12px,3vw,20px)", alignItems: "flex-start" }}>
                <div style={{
                  width: "clamp(40px,6vw,50px)", height: "clamp(40px,6vw,50px)",
                  borderRadius: 12, flexShrink: 0,
                  background: "linear-gradient(135deg, rgba(108,142,255,0.1), rgba(167,139,250,0.1))",
                  border: `1px solid rgba(108,142,255,0.2)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(18px,3vw,24px)",
                  boxShadow: "0 0 20px rgba(108,142,255,0.08)",
                }}>
                  {getDegreeIcon(item.degree)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(13px,2vw,15px)", color: T.textPri, margin: "0 0 3px", letterSpacing: "-0.01em" }}>
                        {item.degree}
                      </h3>
                      {item.field && (
                        <p style={{ fontFamily: T.font, fontSize: 13, color: T.accent, fontWeight: 600, margin: "0 0 2px" }}>{item.field}</p>
                      )}
                      <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, margin: 0 }}>{item.institution}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.04em" }}>
                        {item.start_year} — {item.end_year}
                      </span>
                      {dur !== null && dur > 0 && (
                        <span className="tag-neutral">{dur}yr{dur !== 1 ? "s" : ""}</span>
                      )}
                    </div>
                  </div>
                  {item.gpa && (
                    <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, margin: "10px 0 0", letterSpacing: "0.08em" }}>
                      GPA: <span style={{ color: T.accent, fontWeight: 600 }}>{item.gpa}</span>
                    </p>
                  )}
                  {item.description && (
                    <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.75, margin: "10px 0 0" }}>
                      {item.description}
                    </p>
                  )}
                  {item.achievements && item.achievements.length > 0 && (
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
                      {item.achievements.map((a, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ color: T.accent, fontFamily: T.mono, fontSize: 12, flexShrink: 0, paddingTop: 1 }}>→</span>
                          <span style={{ fontFamily: T.font, fontSize: 13, color: T.textSec }}>{a}</span>
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
          <div className="fade-up delay-2">
            <p className="section-label" style={{ marginBottom: 8 }}>Certifications</p>
            <h2 style={{ fontFamily: T.font, fontWeight: 800, fontSize: "clamp(18px,3vw,22px)", color: T.textPri, letterSpacing: "-0.02em", margin: "0 0 18px" }}>
              Credentials
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 44 }}>
            {certs.map((c, i) => (
              <div key={c.id} className="card fade-up"
                style={{
                  padding: "clamp(12px,2.5vw,16px) clamp(14px,3vw,20px)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  flexWrap: "wrap", gap: 12,
                  animationDelay: `${i * 0.06 + 0.2}s`,
                }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "linear-gradient(135deg, rgba(108,142,255,0.1), rgba(167,139,250,0.1))",
                    border: "1px solid rgba(108,142,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                    flexShrink: 0,
                  }}>
                    📋
                  </div>
                  <div>
                    <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.textPri, margin: 0 }}>{c.name}</p>
                    <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, margin: "3px 0 0", letterSpacing: "0.06em" }}>{c.issuer}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {c.year && <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.08em" }}>{c.year}</span>}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer"
                      style={{
                        fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                        padding: "5px 12px", borderRadius: 6,
                        background: "rgba(108,142,255,0.1)", color: T.accent,
                        textDecoration: "none",
                        border: "1px solid rgba(108,142,255,0.25)",
                        letterSpacing: "0.1em",
                        transition: "background 0.2s, box-shadow 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,142,255,0.18)"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(108,142,255,0.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(108,142,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
                      VIEW ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="btn-row fade-up" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button onClick={() => onNavigate("experience")} className="btn-ghost">← Experience</button>
        <button onClick={() => onNavigate("projects")} className="btn-primary">Projects →</button>
      </div>
    </PageWrapper>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function DarkTemplate({ data = SAMPLE_DATA }: { data?: PortfolioData }) {
  const [page, setPage] = useState<Page>("home");

  const handleNavigate = (p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages: Record<Page, React.ReactNode> = {
    home:       <HomePage       data={data} onNavigate={handleNavigate} />,
    projects:   <ProjectsPage   data={data} onNavigate={handleNavigate} />,
    experience: <ExperiencePage data={data} onNavigate={handleNavigate} />,
    education:  <EducationPage  data={data} onNavigate={handleNavigate} />,
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <CursorGlow />
      <div style={{ minHeight: "100vh", background: T.bg, overflowX: "hidden" }}>
        <Nav data={data} currentPage={page} onNavigate={handleNavigate} />
        <main key={page} style={{ animation: "fadeIn 0.3s ease" }}>
          {pages[page]}
        </main>
        <Footer data={data} onNavigate={handleNavigate} />
      </div>
    </>
  );
}