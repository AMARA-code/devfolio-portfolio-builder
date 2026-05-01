"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView, Variants } from "framer-motion";

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

// ─── DESIGN TOKENS — Premium Nebula Dark ─────────────────────────────────────
const T = {
  bg:           "#04030a",
  surface:      "#080612",
  elevated:     "#0d0a1a",
  card:         "#100d1f",
  cardAlt:      "#0e0b1c",
  border:       "#1e1535",
  borderHi:     "#2d2050",
  borderGlow:   "#5b3fa0",

  // Premium violet-purple accent system
  accent:       "#9b6dff",
  accentBright: "#b48aff",
  accentDeep:   "#7c50e8",
  accentAlt:    "#c084fc",
  accentCyan:   "#67e8f9",
  accentPink:   "#f472b6",
  accentGold:   "#fbbf24",
  accentDim:    "rgba(155,109,255,0.08)",
  accentGlow:   "rgba(155,109,255,0.25)",
  accentGlow2:  "rgba(192,132,252,0.18)",

  textPri:   "#f0ebff",
  textSec:   "#9985bb",
  textDim:   "#3d2e60",
  textMuted: "#5a4880",

  font:    "'DM Sans', sans-serif",
  mono:    "'JetBrains Mono', monospace",
  display: "'Syne', 'DM Sans', sans-serif",

  gradientA: "linear-gradient(135deg, #9b6dff 0%, #c084fc 40%, #67e8f9 100%)",
  gradientB: "linear-gradient(135deg, #7c50e8 0%, #9b6dff 50%, #c084fc 100%)",
  gradientCard: "linear-gradient(145deg, #100d1f 0%, #0c091a 100%)",
  gradientHero: "linear-gradient(160deg, #080612 0%, #0d0821 50%, #080612 100%)",
};

// ─── EASING HELPERS ───────────────────────────────────────────────────────────
// Framer Motion requires cubic bezier arrays typed as [number, number, number, number]
const ease1: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── ANIMATION VARIANTS ───────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: ease1 },
  }),
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.06, ease: "easeOut" as const },
  }),
};

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: ease1 },
  }),
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: (i = 0) => ({
    opacity: 1, scale: 1,
    transition: { duration: 0.55, delay: i * 0.07, ease: ease1 },
  }),
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    background: ${T.bg};
    color: ${T.textPri};
    font-family: ${T.font};
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${T.bg}; }
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #7c50e8, #c084fc);
    border-radius: 3px;
  }

  @keyframes pulse-ring {
    0%   { transform: scale(1); opacity: 0.8; }
    70%  { transform: scale(1.9); opacity: 0; }
    100% { transform: scale(1); opacity: 0; }
  }
  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes orb-drift {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(40px, -30px) scale(1.07); }
    66%  { transform: translate(-20px, 20px) scale(0.95); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes orb-drift-alt {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(-30px, 20px) scale(1.05); }
    66%  { transform: translate(20px, -15px) scale(0.97); }
    100% { transform: translate(0, 0) scale(1); }
  }
  @keyframes scanLine {
    0%   { transform: translateY(-100%); opacity: 0; }
    10%  { opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(1500%); opacity: 0; }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  @keyframes aurora {
    0%, 100% { opacity: 0.4; transform: scale(1) rotate(0deg); }
    50%       { opacity: 0.7; transform: scale(1.1) rotate(3deg); }
  }
  @keyframes borderPulse {
    0%, 100% { opacity: 0.3; }
    50%       { opacity: 0.8; }
  }

  /* ── CARDS ── */
  .card {
    background: ${T.gradientCard};
    border: 1px solid ${T.border};
    border-radius: 18px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.35s ease, transform 0.35s cubic-bezier(0.22,1,0.36,1), box-shadow 0.35s ease;
  }
  .card::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: inherit;
    background: linear-gradient(135deg, rgba(155,109,255,0.04) 0%, transparent 50%);
    pointer-events: none; opacity: 0;
    transition: opacity 0.3s;
  }
  .card:hover {
    border-color: rgba(155,109,255,0.35);
    transform: translateY(-4px);
    box-shadow:
      0 24px 80px rgba(0,0,0,0.6),
      0 0 0 1px rgba(155,109,255,0.1),
      0 0 40px rgba(155,109,255,0.06),
      inset 0 1px 0 rgba(255,255,255,0.04);
  }
  .card:hover::before { opacity: 1; }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 6px;
    background: linear-gradient(135deg, #7c50e8 0%, #9b6dff 50%, #b48aff 100%);
    background-size: 200% 200%;
    color: #f0ebff;
    border: none;
    font-family: ${T.font}; font-weight: 700; font-size: 13px;
    letter-spacing: 0.02em;
    padding: 11px 24px;
    border-radius: 10px; cursor: pointer;
    position: relative; overflow: hidden;
    transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, background-position 0.4s;
    white-space: nowrap;
    box-shadow: 0 4px 20px rgba(124,80,232,0.3), inset 0 1px 0 rgba(255,255,255,0.12);
  }
  .btn-primary:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 12px 40px rgba(155,109,255,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
    background-position: right center;
  }
  .btn-primary:active { transform: translateY(0) scale(0.99); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 6px;
    background: rgba(155,109,255,0.05);
    color: ${T.textSec};
    border: 1px solid ${T.border};
    font-family: ${T.font}; font-weight: 600; font-size: 13px;
    letter-spacing: 0.02em; padding: 10px 22px;
    border-radius: 10px; cursor: pointer;
    transition: border-color 0.25s, color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
    white-space: nowrap;
  }
  .btn-ghost:hover {
    border-color: rgba(155,109,255,0.45);
    color: ${T.textPri};
    background: rgba(155,109,255,0.1);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(155,109,255,0.12);
  }

  /* ── TAGS ── */
  .tag {
    font-family: ${T.mono}; font-size: 10.5px; font-weight: 500;
    padding: 4px 11px; border-radius: 7px;
    background: rgba(155,109,255,0.1);
    border: 1px solid rgba(155,109,255,0.22);
    color: ${T.accentBright};
    transition: background 0.2s, border-color 0.2s, transform 0.2s, box-shadow 0.2s;
    cursor: default; display: inline-block;
  }
  .tag:hover {
    background: rgba(155,109,255,0.2);
    border-color: rgba(155,109,255,0.5);
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(155,109,255,0.15);
  }

  .tag-neutral {
    font-family: ${T.mono}; font-size: 10.5px; font-weight: 500;
    padding: 4px 11px; border-radius: 7px;
    background: rgba(255,255,255,0.03);
    border: 1px solid ${T.border};
    color: ${T.textMuted};
    transition: background 0.2s, border-color 0.2s, color 0.2s;
    display: inline-block;
  }
  .tag-neutral:hover {
    background: rgba(155,109,255,0.06);
    border-color: ${T.borderHi};
    color: ${T.textSec};
  }

  /* ── NAV LINKS ── */
  .nav-link {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 7px 15px; border-radius: 8px;
    border: none; cursor: pointer;
    font-family: ${T.mono};
    transition: background 0.25s, color 0.25s, box-shadow 0.25s;
    position: relative;
  }
  .nav-link.active {
    background: rgba(155,109,255,0.14);
    color: ${T.accentBright};
    box-shadow: 0 0 0 1px rgba(155,109,255,0.3), 0 4px 14px rgba(155,109,255,0.08);
  }
  .nav-link.inactive {
    background: transparent; color: ${T.textDim};
  }
  .nav-link.inactive:hover {
    color: ${T.textSec}; background: rgba(155,109,255,0.06);
  }

  /* ── SECTION LABEL ── */
  .section-label {
    font-family: ${T.mono}; font-size: 10px; font-weight: 600;
    letter-spacing: 0.28em; text-transform: uppercase;
    background: ${T.gradientA};
    background-clip: text; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px; display: inline-block;
  }

  /* ── GRADIENT TEXT ── */
  .gradient-text {
    background: ${T.gradientA};
    background-size: 200% auto;
    background-clip: text; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientShift 5s linear infinite;
  }

  /* ── SHIMMER TEXT ── */
  .shimmer {
    background: linear-gradient(90deg, ${T.textSec} 0%, ${T.textPri} 40%, ${T.accent} 50%, ${T.textPri} 60%, ${T.textSec} 100%);
    background-size: 200% auto;
    background-clip: text; -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  /* ── LINK ── */
  .link-accent {
    color: ${T.accentBright}; text-decoration: none;
    position: relative; transition: opacity 0.2s;
  }
  .link-accent::after {
    content: ''; position: absolute;
    bottom: -1px; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, ${T.accent}, ${T.accentAlt});
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.25s ease;
  }
  .link-accent:hover { opacity: 0.85; }
  .link-accent:hover::after { transform: scaleX(1); }

  /* ── DIVIDER ── */
  .divider { border: none; border-top: 1px solid ${T.border}; }

  /* ── FLOATING ORB ── */
  .orb {
    position: absolute; border-radius: 50%;
    pointer-events: none; filter: blur(90px);
  }

  /* ── GRIDS ── */
  .stats-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  }
  .two-col-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
  }
  .three-col-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
  }
  .project-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  /* ── MOBILE NAV ── */
  .mobile-menu { display: none; }
  .desktop-nav { display: flex; gap: 2px; }

  /* ── CURSOR GLOW ── */
  .cursor-glow {
    position: fixed; width: 360px; height: 360px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(155,109,255,0.07) 0%, transparent 70%);
    pointer-events: none; transform: translate(-50%, -50%);
    transition: opacity 0.3s; z-index: 9999;
    mix-blend-mode: screen;
  }

  /* ── BREAKPOINTS ── */
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

  /* ── NOISE ── */
  .noise::after {
    content: '';
    position: absolute; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none; border-radius: inherit; opacity: 0.5;
    mix-blend-mode: overlay;
  }

  /* ── STATUS PULSE ── */
  .status-dot {
    position: relative; width: 8px; height: 8px;
    border-radius: 50%; background: #4ade80; flex-shrink: 0;
  }
  .status-dot::before {
    content: ''; position: absolute; inset: -3px;
    border-radius: 50%; background: rgba(74,222,128,0.3);
    animation: pulse-ring 2.2s ease infinite;
  }

  /* ── HERO GRID ── */
  .hero-grid {
    background-image:
      linear-gradient(rgba(155,109,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(155,109,255,0.03) 1px, transparent 1px);
    background-size: 52px 52px;
  }

  /* ── GLOW LINE ── */
  .glow-line {
    position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent 0%, ${T.accent} 30%, ${T.accentAlt} 70%, transparent 100%);
    opacity: 0.5;
  }

  /* ── CONTACT ROW ── */
  .contact-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 11px 14px; border-radius: 11px;
    background: ${T.elevated}; border: 1px solid ${T.border};
    text-decoration: none;
    transition: border-color 0.25s, background 0.25s, transform 0.25s, box-shadow 0.25s;
  }
  .contact-row:hover {
    border-color: rgba(155,109,255,0.4);
    background: rgba(155,109,255,0.06);
    transform: translateX(4px);
    box-shadow: 0 4px 20px rgba(155,109,255,0.08);
  }

  /* ── EXP CARDS ── */
  .exp-card-current {
    border-left: 2px solid ${T.accent} !important;
    box-shadow: -4px 0 30px rgba(155,109,255,0.12) !important;
  }
  .exp-card-past { border-left: 2px solid ${T.border} !important; }

  /* ── FILTER PILLS ── */
  .filter-pill {
    padding: 5px 16px; border-radius: 20px;
    border: 1px solid ${T.border};
    font-family: ${T.mono}; font-size: 10.5px; font-weight: 600;
    cursor: pointer; letter-spacing: 0.07em; text-transform: uppercase;
    transition: all 0.25s; background: transparent; color: ${T.textDim};
  }
  .filter-pill:hover { border-color: ${T.borderHi}; color: ${T.textSec}; }
  .filter-pill.active {
    background: linear-gradient(135deg, #7c50e8, #9b6dff);
    border-color: transparent; color: #f0ebff;
    box-shadow: 0 4px 18px rgba(155,109,255,0.4);
  }

  /* ── FORM INPUTS ── */
  .form-input {
    width: 100%; box-sizing: border-box;
    border: 1px solid ${T.border}; border-radius: 10px;
    padding: 11px 14px; font-size: 13px;
    color: ${T.textPri}; background: ${T.elevated};
    outline: none; font-family: ${T.font};
    transition: border-color 0.25s, box-shadow 0.25s;
  }
  .form-input:focus {
    border-color: rgba(155,109,255,0.5);
    box-shadow: 0 0 0 3px rgba(155,109,255,0.1), 0 0 20px rgba(155,109,255,0.05);
  }
  .form-input::placeholder { color: ${T.textDim}; }

  /* ── CARD NUMBER LABEL ── */
  .card-number {
    font-family: ${T.mono}; font-size: 10px; color: ${T.textDim};
    letter-spacing: 0.1em; position: absolute; top: 14px; right: 16px;
  }

  /* ── AURORA BG ── */
  .aurora-container {
    position: absolute; inset: 0; overflow: hidden;
    pointer-events: none; border-radius: inherit;
  }
`;

// ─── CURSOR GLOW ──────────────────────────────────────────────────────────────
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

// ─── REVEAL WRAPPER (InView trigger) ─────────────────────────────────────────
// Accept any Variants from framer-motion so all variant shapes are valid
function Reveal({ children, variants = fadeUp, custom = 0, className = "", style = {} }: {
  children: React.ReactNode;
  variants?: Variants;
  custom?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      custom={custom}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
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

  const handleNav = (p: Page) => { onNavigate(p); setMenuOpen(false); };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: ease1 }}
      style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(4,3,10,0.94)" : "rgba(4,3,10,0.6)",
        backdropFilter: "blur(28px)",
        borderBottom: `1px solid ${scrolled ? T.border : "transparent"}`,
        transition: "background 0.35s, border-color 0.35s",
        boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(155,109,255,0.08)" : "none",
      }}
    >
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "0 clamp(16px, 4vw, 32px)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: "clamp(56px, 8vw, 66px)",
      }}>
        {/* Brand */}
        <motion.button onClick={() => handleNav("home")}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 11,
            background: "linear-gradient(135deg, rgba(155,109,255,0.25) 0%, rgba(192,132,252,0.2) 100%)",
            border: "1px solid rgba(155,109,255,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: T.display, fontWeight: 800, fontSize: 17,
            color: T.accentBright,
            boxShadow: "0 0 24px rgba(155,109,255,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}>
            {data.full_name.charAt(0)}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 14, color: T.textPri, letterSpacing: "0.01em", lineHeight: 1.2 }}>
              {data.full_name}
            </span>
            <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              @{data.username}
            </span>
          </div>
        </motion.button>

        {/* Desktop Nav */}
        <nav className="desktop-nav">
          {NAV_ITEMS.map(({ label, page }) => (
            <button key={page} onClick={() => handleNav(page)}
              className={`nav-link ${currentPage === page ? "active" : "inactive"}`}>
              {label}
              {currentPage === page && (
                <motion.span
                  layoutId="nav-indicator"
                  style={{
                    position: "absolute", bottom: -1, left: "50%",
                    width: 20, height: 2, borderRadius: 2,
                    background: T.accent, transform: "translateX(-50%)",
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {data.email && (
            <motion.a href={`mailto:${data.email}`} className="btn-primary hire-me-btn"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ textDecoration: "none", fontSize: 12 }}>
              Hire Me ↗
            </motion.a>
          )}
          <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: menuOpen ? "rgba(155,109,255,0.12)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${menuOpen ? "rgba(155,109,255,0.35)" : T.border}`,
              borderRadius: 9, width: 40, height: 40, cursor: "pointer",
              flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: "block", width: i === 1 ? (menuOpen ? 14 : 20) : 20, height: 1.5,
                background: menuOpen ? T.accent : T.textSec, borderRadius: 2,
                transition: "all 0.25s",
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: ease1 }}
            style={{
              background: "rgba(4,3,10,0.98)",
              borderTop: `1px solid ${T.border}`,
              padding: "16px clamp(16px,4vw,32px)", overflow: "hidden",
            }}>
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: currentPage === page ? "rgba(155,109,255,0.12)" : "transparent",
                  border: "none", borderRadius: 9,
                  padding: "12px 14px", marginBottom: 4,
                  fontFamily: T.mono, fontWeight: 600, fontSize: 11,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: currentPage === page ? T.accentBright : T.textSec,
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
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <footer style={{
      borderTop: `1px solid ${T.border}`,
      padding: "clamp(24px,4vw,44px) clamp(16px,4vw,32px)",
      marginTop: 80, position: "relative",
      background: `linear-gradient(180deg, transparent 0%, rgba(124,80,232,0.02) 100%)`,
    }}>
      <div style={{
        position: "absolute", top: 0, left: "5%", right: "5%", height: 1,
        background: `linear-gradient(90deg, transparent, ${T.accent}, ${T.accentAlt}, ${T.accentCyan}, transparent)`,
        opacity: 0.4,
      }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 9,
              background: "rgba(155,109,255,0.12)", border: "1px solid rgba(155,109,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: T.display, fontWeight: 800, fontSize: 14, color: T.accentBright,
            }}>
              {data.full_name.charAt(0)}
            </div>
            <span style={{ fontFamily: T.display, fontWeight: 800, fontSize: 13, color: T.textSec }}>
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
                  padding: "6px 10px", borderRadius: 5,
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
            CRAFTED WITH PRECISION ✦ {data.location}
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
      padding: "clamp(24px,5vw,56px) clamp(16px,4vw,32px) 40px",
    }}>
      {children}
    </div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = Math.ceil(value / 24);
    const timer = setInterval(() => {
      start = Math.min(start + step, value);
      setDisplay(start);
      if (start >= value) clearInterval(timer);
    }, 36);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return <span ref={ref}>{display}</span>;
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <PageWrapper>
      {/* ── Hero ── */}
      <Reveal variants={fadeIn} style={{ marginBottom: 14 }}>
        <div className="hero-grid noise" style={{
          position: "relative", borderRadius: 22,
          border: `1px solid ${T.border}`, overflow: "hidden",
          padding: "clamp(32px,6vw,72px) clamp(24px,5vw,64px)",
          background: T.gradientHero,
        }}>
          {/* Aurora orbs */}
          <div className="aurora-container">
            <div className="orb" style={{
              width: 500, height: 500,
              background: "radial-gradient(circle, rgba(124,80,232,0.18) 0%, rgba(155,109,255,0.08) 40%, transparent 70%)",
              top: -150, right: -100,
              animation: "orb-drift 14s ease-in-out infinite",
            }} />
            <div className="orb" style={{
              width: 380, height: 380,
              background: "radial-gradient(circle, rgba(192,132,252,0.12) 0%, transparent 70%)",
              bottom: -100, left: -80,
              animation: "orb-drift-alt 18s ease-in-out infinite",
            }} />
            <div className="orb" style={{
              width: 200, height: 200,
              background: "radial-gradient(circle, rgba(103,232,249,0.08) 0%, transparent 70%)",
              top: "30%", left: "40%",
              animation: "orb-drift 22s ease-in-out infinite reverse",
            }} />
          </div>

          {/* Animated scan line */}
          <div style={{
            position: "absolute", left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, transparent, rgba(155,109,255,0.6), ${T.accentAlt}, rgba(155,109,255,0.6), transparent)`,
            pointerEvents: "none",
            animation: "scanLine 8s ease-in-out infinite",
          }} />

          <div className="glow-line" />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: ease1 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                marginBottom: 24, padding: "6px 16px", borderRadius: 20,
                background: "rgba(74,222,128,0.07)",
                border: "1px solid rgba(74,222,128,0.2)",
                boxShadow: "0 0 24px rgba(74,222,128,0.05)",
              }}>
              <div className="status-dot" />
              <span style={{ fontFamily: T.mono, fontSize: 10, color: "#86efac", letterSpacing: "0.16em", fontWeight: 600 }}>
                AVAILABLE FOR WORK
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.18, ease: ease1 }}
              style={{
                fontFamily: T.display, fontWeight: 800,
                fontSize: "clamp(2.6rem, 7vw, 5rem)",
                lineHeight: 1.0, letterSpacing: "-0.04em",
                margin: "0 0 8px",
                background: "linear-gradient(135deg, #f0ebff 0%, #c084fc 50%, #9b6dff 100%)",
                backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
              {data.full_name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: ease1 }}
              style={{ fontFamily: T.mono, fontSize: "clamp(11px,1.5vw,12px)", marginBottom: 22, letterSpacing: "0.1em" }}>
              <span className="gradient-text">@{data.username}</span>
              <span style={{ color: T.textDim }}> · {data.location}</span>
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36, ease: ease1 }}
              style={{
                fontFamily: T.font, fontSize: "clamp(13px,1.8vw,16px)", lineHeight: 1.85,
                color: T.textSec, maxWidth: 580, margin: "0 0 38px",
              }}>
              {data.bio}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44, ease: ease1 }}
              className="btn-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <motion.button className="btn-primary" onClick={() => onNavigate("projects")}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                View Projects →
              </motion.button>
              <motion.button className="btn-ghost" onClick={() => onNavigate("experience")}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Experience
              </motion.button>
              {data.email && (
                <motion.a href={`mailto:${data.email}`} className="btn-ghost"
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ textDecoration: "none" }}>
                  Get in Touch
                </motion.a>
              )}
            </motion.div>
          </div>
        </div>
      </Reveal>

      {/* ── Stats ── */}
      <motion.div
        className="stats-grid"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 14 }}>
        {[
          { v: data.projects.length, l: "Projects", suffix: "", color: T.accent },
          { v: data.skills.length, l: "Skills", suffix: "+", color: T.accentAlt },
          { v: data.experience.length, l: "Positions", suffix: "", color: T.accentCyan },
          { v: data.education.length, l: "Degrees", suffix: "", color: T.accentPink },
        ].map(({ v, l, suffix, color }, i) => (
          <motion.div key={l} className="card" variants={scaleIn} custom={i}
            style={{ padding: "clamp(16px,3vw,26px) clamp(12px,2vw,18px)", textAlign: "center" }}>
            <div className="glow-line" style={{ opacity: 0.35, background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
            <p style={{
              fontFamily: T.display, fontSize: "clamp(28px,4vw,40px)", fontWeight: 800,
              background: `linear-gradient(135deg, ${color}, #f0ebff)`,
              backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              margin: "0 0 5px",
              filter: `drop-shadow(0 0 20px ${color}60)`,
            }}>
              <AnimatedNumber value={v} />{suffix}
            </p>
            <p style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              {l}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* ── About + Skills ── */}
      <div className="two-col-grid" style={{ marginBottom: 14 }}>
        <Reveal variants={slideLeft}>
          <div className="card" style={{ padding: "clamp(18px,3vw,30px)", height: "100%" }}>
            <p className="section-label">About</p>
            <hr className="divider" style={{ margin: "12px 0 20px" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { l: "Location", v: data.location },
                { l: "Email", v: data.email, link: `mailto:${data.email}` },
                { l: "Website", v: "Visit →", link: data.website },
                { l: "GitHub", v: "View Profile →", link: data.github_url },
              ].filter(({ v }) => v).map(({ l, v, link }) => (
                <div key={l} style={{ display: "flex", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <span style={{
                    fontFamily: T.mono, fontSize: 9, color: T.textDim,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    minWidth: 62, flexShrink: 0, paddingTop: 2,
                  }}>{l}</span>
                  {link
                    ? <a href={link} target="_blank" rel="noreferrer" className="link-accent"
                      style={{ fontFamily: T.font, fontSize: 13, fontWeight: 500, wordBreak: "break-all" }}>{v}</a>
                    : <span style={{ fontFamily: T.font, fontSize: 13, color: T.textSec }}>{v}</span>}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variants={slideLeft} custom={1}>
          <div className="card" style={{ padding: "clamp(18px,3vw,30px)", height: "100%" }}>
            <p className="section-label">Tech Stack</p>
            <hr className="divider" style={{ margin: "12px 0 20px" }} />
            <motion.div
              style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
              variants={staggerContainer} initial="hidden" whileInView="visible"
              viewport={{ once: true }}>
              {data.skills.map((s, i) => (
                <motion.span key={s.id} className="tag" variants={scaleIn} custom={i}>
                  {s.name}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </Reveal>
      </div>

      {/* ── Featured Projects ── */}
      <Reveal style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
          <div>
            <p className="section-label">Featured Work</p>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(18px,3vw,24px)", color: T.textPri, letterSpacing: "-0.02em" }}>
              Recent Projects
            </h2>
          </div>
          <motion.button className="btn-ghost" onClick={() => onNavigate("projects")}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ fontSize: 12, padding: "7px 16px" }}>
            All projects →
          </motion.button>
        </div>
        <motion.div className="project-grid"
          variants={staggerContainer} initial="hidden" whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}>
          {data.projects.slice(0, 2).map((p, i) => (
            <motion.div key={p.id} variants={fadeUp} custom={i}>
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      </Reveal>

      {/* ── Experience Preview + Contact ── */}
      <div className="two-col-grid">
        <Reveal variants={fadeUp} custom={0}>
          <div className="card" style={{ padding: "clamp(18px,3vw,30px)", height: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 8 }}>
              <div>
                <p className="section-label">Career</p>
                <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 19, color: T.textPri, letterSpacing: "-0.02em" }}>Experience</h2>
              </div>
              <motion.button className="btn-ghost" onClick={() => onNavigate("experience")}
                whileHover={{ scale: 1.04 }} style={{ fontSize: 11, padding: "5px 12px" }}>
                Full history →
              </motion.button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {data.experience.slice(0, 3).map((item, idx) => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.09, ease: ease1 }}
                  style={{
                    display: "flex", gap: 14, alignItems: "flex-start",
                    paddingBottom: idx < 2 ? 16 : 0,
                    marginBottom: idx < 2 ? 16 : 0,
                    borderBottom: idx < 2 ? `1px solid ${T.border}` : "none",
                  }}>
                  <div style={{ paddingTop: 5, flexShrink: 0 }}>
                    {item.is_current
                      ? <div className="status-dot" />
                      : <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.textDim }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: T.font, fontWeight: 700, fontSize: 13, color: T.textPri, margin: "0 0 2px" }}>{item.role}</p>
                    <p style={{ fontFamily: T.font, fontSize: 12, color: T.accentBright, fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
                    <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.04em" }}>
                      {item.start_date} — {item.is_current ? "Present" : item.end_date}
                    </p>
                  </div>
                  {item.is_current && (
                    <span style={{
                      fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                      padding: "3px 8px", borderRadius: 5,
                      background: "rgba(74,222,128,0.1)", color: "#86efac",
                      border: "1px solid rgba(74,222,128,0.2)",
                      letterSpacing: "0.1em", flexShrink: 0,
                    }}>LIVE</span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal variants={fadeUp} custom={1}>
          <div className="card" style={{ padding: "clamp(18px,3vw,30px)", display: "flex", flexDirection: "column", height: "100%" }}>
            <p className="section-label">Let's Talk</p>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: 19, color: T.textPri, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
              Contact
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
              {[
                { label: "Email", val: data.email, href: `mailto:${data.email}` },
                { label: "LinkedIn", val: "linkedin →", href: data.linkedin_url },
                { label: "Twitter", val: "twitter →", href: data.twitter_url },
                { label: "GitHub", val: "github →", href: data.github_url },
              ].filter(({ href }) => href).map(({ label, val, href }, i) => (
                <motion.a key={label} href={href} target="_blank" rel="noreferrer"
                  className="contact-row"
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.07, ease: ease1 }}>
                  <span style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}</span>
                  <span style={{ fontFamily: T.font, fontSize: 12, color: T.accentBright, fontWeight: 600 }}>{val}</span>
                </motion.a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </PageWrapper>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  const PALETTE = ["#9b6dff", "#c084fc", "#67e8f9", "#f472b6", "#fbbf24", "#4ade80"];
  const colorIdx = project.id.charCodeAt(0) % PALETTE.length;
  const accentColor = PALETTE[colorIdx];

  return (
    <motion.article
      className="card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: ease1 }}
      style={{ overflow: "hidden", height: "100%" }}>

      {/* Thumbnail area */}
      <a
        href={project.live_url ?? "#"}
        target={project.live_url ? "_blank" : "_self"}
        rel="noreferrer"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          height: "clamp(150px, 20vw, 200px)",
          background: `linear-gradient(135deg, ${T.elevated} 0%, ${T.surface} 100%)`,
          position: "relative", overflow: "hidden", textDecoration: "none",
        }}>
        {/* Grid pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(rgba(155,109,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(155,109,255,0.04) 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
        }} />

        {/* Ambient glow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute", inset: 0,
            background: `radial-gradient(ellipse at center, ${accentColor}22 0%, transparent 70%)`,
          }} />

        {project.thumbnail_url ? (
          <motion.img src={project.thumbnail_url} alt={project.title}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.5, ease: ease1 }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <motion.span
            animate={{ scale: hovered ? 1.12 : 1, opacity: hovered ? 0.9 : 0.5 }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: T.display, fontWeight: 800,
              fontSize: "clamp(44px,9vw,68px)",
              color: accentColor, position: "relative",
              letterSpacing: "-0.04em",
              filter: `drop-shadow(0 0 40px ${accentColor}80)`,
            }}>
            {project.title.charAt(0)}
          </motion.span>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {project.live_url && hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute", inset: 0,
                background: "rgba(4,3,10,0.78)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
              <motion.span
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                style={{
                  fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                  color: accentColor, border: `1px solid ${accentColor}`,
                  padding: "8px 20px", borderRadius: 8, letterSpacing: "0.12em",
                  boxShadow: `0 0 24px ${accentColor}50`,
                }}>
                VISIT SITE ↗
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured badge */}
        {project.featured && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            fontFamily: T.mono, fontSize: 9, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20,
            background: "rgba(155,109,255,0.18)", color: T.accentBright,
            border: "1px solid rgba(155,109,255,0.35)",
            letterSpacing: "0.12em",
            boxShadow: "0 4px 14px rgba(155,109,255,0.15)",
          }}>
            FEATURED
          </div>
        )}
      </a>

      <div style={{ padding: "clamp(14px,3vw,22px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: T.display, fontSize: "clamp(14px,2vw,17px)", fontWeight: 800,
            color: T.textPri, letterSpacing: "-0.01em", lineHeight: 1.3,
          }}>
            {project.title}
          </h3>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 6,
                  background: `${accentColor}18`, color: accentColor,
                  textDecoration: "none", border: `1px solid ${accentColor}35`,
                  letterSpacing: "0.1em", transition: "background 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = `${accentColor}30`; e.currentTarget.style.boxShadow = `0 4px 14px ${accentColor}35`; }}
                onMouseLeave={e => { e.currentTarget.style.background = `${accentColor}18`; e.currentTarget.style.boxShadow = "none"; }}>
                LIVE ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                  padding: "4px 10px", borderRadius: 6,
                  background: T.elevated, color: T.textMuted,
                  textDecoration: "none", border: `1px solid ${T.border}`,
                  letterSpacing: "0.1em", transition: "border-color 0.2s, color 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textSec; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; }}>
                CODE
              </a>
            )}
          </div>
        </div>
        <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.8, margin: "0 0 14px" }}>
          {project.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tech_stack.map((t) => (
            <span key={t} className="tag-neutral">{t}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

// ─── PROJECTS PAGE ────────────────────────────────────────────────────────────
function ProjectsPage({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  const [filter, setFilter] = useState<string>("all");
  const allTechs = [...new Set(data.projects.flatMap((p) => p.tech_stack))];
  const filtered = filter === "all" ? data.projects : data.projects.filter((p) => p.tech_stack.includes(filter));

  return (
    <PageWrapper>
      <motion.button onClick={() => onNavigate("home")}
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: ease1 }}
        whileHover={{ x: -4 }}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: "0 0 18px", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accentBright)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
        ← Back
      </motion.button>

      <Reveal style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 14 }}>
          <div>
            <p className="section-label">Portfolio</p>
            <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(28px,5vw,42px)", color: T.textPri, letterSpacing: "-0.03em", margin: 0 }}>
              Projects
            </h1>
            <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, marginTop: 5, letterSpacing: "0.14em" }}>
              {filtered.length} ITEMS
            </p>
          </div>
        </div>
      </Reveal>

      {/* Filter pills */}
      {allTechs.length > 0 && (
        <Reveal style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["all", ...allTechs].map((t, i) => (
              <motion.button key={t} onClick={() => setFilter(t)}
                className={`filter-pill ${filter === t ? "active" : ""}`}
                whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.04, ease: ease1 }}>
                {t === "all" ? "All" : t}
              </motion.button>
            ))}
          </div>
        </Reveal>
      )}

      <AnimatePresence mode="wait">
        {filtered.length > 0 ? (
          <motion.div
            key={filter}
            className="project-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: ease1 }}>
            {filtered.map((p, i) => (
              <motion.div key={p.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: ease1 }}>
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontFamily: T.mono, fontSize: 12, color: T.textDim, letterSpacing: "0.15em" }}>NO RESULTS</p>
          </motion.div>
        )}
      </AnimatePresence>
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
          <motion.div key={item.id}
            className={`card ${item.is_current ? "exp-card-current" : "exp-card-past"}`}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.55, delay: i * 0.09, ease: ease1 }}
            whileHover={{ x: 4 }}
            style={{ padding: "clamp(16px,3vw,26px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
              <div>
                <h3 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(14px,2vw,17px)", color: T.textPri, margin: "0 0 4px", letterSpacing: "-0.01em" }}>
                  {item.role}
                </h3>
                <p style={{ fontFamily: T.font, fontSize: 13, color: T.accentBright, fontWeight: 600, margin: "0 0 2px" }}>
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
                    background: "rgba(74,222,128,0.1)", color: "#86efac",
                    border: "1px solid rgba(74,222,128,0.25)",
                  }}>CURRENT</span>
                )}
                <span style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.04em" }}>
                  {item.start_date} — {item.is_current ? "Present" : item.end_date}
                </span>
              </div>
            </div>
            {item.description && (
              <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.8, margin: "0 0 14px" }}>
                {item.description}
              </p>
            )}
            {item.skills && item.skills.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.skills.map((s) => <span key={s} className="tag-neutral">{s}</span>)}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <PageWrapper>
      <motion.button onClick={() => onNavigate("home")}
        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: ease1 }} whileHover={{ x: -4 }}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: "0 0 18px", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accentBright)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
        ← Back
      </motion.button>

      <Reveal style={{ marginBottom: 32 }}>
        <p className="section-label">Career History</p>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(28px,5vw,42px)", color: T.textPri, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
          Experience
        </h1>
        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.14em" }}>
          {data.experience.length} POSITIONS
        </p>
      </Reveal>

      {/* Stats */}
      <motion.div className="three-col-grid"
        variants={staggerContainer} initial="hidden" whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        style={{ marginBottom: 44 }}>
        {[
          { v: data.experience.length, l: "Total Roles", color: T.accent },
          { v: current.length, l: "Currently Active", color: "#4ade80" },
          { v: new Set(data.experience.map((e) => e.company)).size, l: "Companies", color: T.accentAlt },
        ].map(({ v, l, color }) => (
          <motion.div key={l} className="card" variants={scaleIn}
            style={{ padding: "clamp(14px,3vw,22px)", textAlign: "center" }}>
            <p style={{
              fontFamily: T.display, fontSize: "clamp(26px,4vw,36px)", fontWeight: 800,
              color, margin: "0 0 5px",
              filter: `drop-shadow(0 0 20px ${color}50)`,
            }}>
              <AnimatedNumber value={v} />
            </p>
            <p style={{ fontFamily: T.mono, fontSize: 9, color: T.textDim, letterSpacing: "0.16em", textTransform: "uppercase" }}>{l}</p>
          </motion.div>
        ))}
      </motion.div>

      {current.length > 0 && <ExpSection title="// Current Position" items={current} />}
      {past.length > 0 && <ExpSection title="// Past Positions" items={past} />}

      <div className="btn-row" style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
        <motion.button onClick={() => onNavigate("education")} className="btn-ghost"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Education →</motion.button>
        <motion.button onClick={() => onNavigate("projects")} className="btn-primary"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Projects →</motion.button>
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
      <motion.button onClick={() => onNavigate("home")}
        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: ease1 }} whileHover={{ x: -4 }}
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: T.mono, fontSize: 10, color: T.textDim, padding: "0 0 18px", letterSpacing: "0.1em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.color = T.accentBright)}
        onMouseLeave={e => (e.currentTarget.style.color = T.textDim)}>
        ← Back
      </motion.button>

      <Reveal style={{ marginBottom: 32 }}>
        <p className="section-label">Academic Background</p>
        <h1 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(28px,5vw,42px)", color: T.textPri, letterSpacing: "-0.03em", margin: "0 0 4px" }}>
          Education
        </h1>
        <p style={{ fontFamily: T.mono, fontSize: 10, color: T.textDim, letterSpacing: "0.14em" }}>
          {data.education.length} INSTITUTION{data.education.length !== 1 ? "S" : ""}
          {certs.length > 0 ? ` · ${certs.length} CERTIFICATIONS` : ""}
        </p>
      </Reveal>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 48 }}>
        {data.education.map((item, i) => {
          const dur = item.start_year && item.end_year
            ? parseInt(item.end_year) - parseInt(item.start_year)
            : null;
          return (
            <motion.div key={item.id} className="card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: ease1 }}
              style={{ padding: "clamp(16px,3vw,26px)" }}>
              <div style={{ display: "flex", gap: "clamp(12px,3vw,22px)", alignItems: "flex-start" }}>
                <motion.div
                  whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: "clamp(44px,6vw,56px)", height: "clamp(44px,6vw,56px)",
                    borderRadius: 14, flexShrink: 0,
                    background: "linear-gradient(135deg, rgba(155,109,255,0.15), rgba(192,132,252,0.12))",
                    border: `1px solid rgba(155,109,255,0.25)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "clamp(20px,3vw,26px)",
                    boxShadow: "0 0 24px rgba(155,109,255,0.1)",
                  }}>
                  {getDegreeIcon(item.degree)}
                </motion.div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(13px,2vw,16px)", color: T.textPri, margin: "0 0 3px", letterSpacing: "-0.01em" }}>
                        {item.degree}
                      </h3>
                      {item.field && (
                        <p style={{ fontFamily: T.font, fontSize: 13, color: T.accentBright, fontWeight: 600, margin: "0 0 2px" }}>{item.field}</p>
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
                      GPA: <span style={{ color: T.accentBright, fontWeight: 600 }}>{item.gpa}</span>
                    </p>
                  )}
                  {item.description && (
                    <p style={{ fontFamily: T.font, fontSize: 13, color: T.textSec, lineHeight: 1.8, margin: "10px 0 0" }}>
                      {item.description}
                    </p>
                  )}
                  {item.achievements && item.achievements.length > 0 && (
                    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
                      {item.achievements.map((a, i) => (
                        <motion.div key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.07 }}
                          style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ color: T.accent, fontFamily: T.mono, fontSize: 12, flexShrink: 0, paddingTop: 1 }}>→</span>
                          <span style={{ fontFamily: T.font, fontSize: 13, color: T.textSec }}>{a}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {certs.length > 0 && (
        <>
          <Reveal style={{ marginBottom: 20 }}>
            <p className="section-label">Certifications</p>
            <h2 style={{ fontFamily: T.display, fontWeight: 800, fontSize: "clamp(20px,3vw,26px)", color: T.textPri, letterSpacing: "-0.02em", margin: 0 }}>
              Credentials
            </h2>
          </Reveal>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 48 }}>
            {certs.map((c, i) => (
              <motion.div key={c.id} className="card"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.07, ease: ease1 }}
                whileHover={{ x: 4 }}
                style={{ padding: "clamp(12px,2.5vw,18px) clamp(14px,3vw,22px)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 11,
                    background: "linear-gradient(135deg, rgba(155,109,255,0.12), rgba(192,132,252,0.1))",
                    border: "1px solid rgba(155,109,255,0.22)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 16, flexShrink: 0,
                    boxShadow: "0 4px 16px rgba(155,109,255,0.08)",
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
                    <motion.a href={c.url} target="_blank" rel="noreferrer"
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}
                      style={{
                        fontFamily: T.mono, fontSize: 9, fontWeight: 700,
                        padding: "5px 14px", borderRadius: 7,
                        background: "rgba(155,109,255,0.1)", color: T.accentBright,
                        textDecoration: "none", border: "1px solid rgba(155,109,255,0.28)",
                        letterSpacing: "0.1em", transition: "background 0.2s, box-shadow 0.2s",
                        display: "inline-block",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(155,109,255,0.2)"; e.currentTarget.style.boxShadow = "0 4px 18px rgba(155,109,255,0.22)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(155,109,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}>
                      VIEW ↗
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      <div className="btn-row" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <motion.button onClick={() => onNavigate("experience")} className="btn-ghost"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>← Experience</motion.button>
        <motion.button onClick={() => onNavigate("projects")} className="btn-primary"
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>Projects →</motion.button>
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
        <AnimatePresence mode="wait">
          <motion.main
            key={page}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: ease1 }}>
            {pages[page]}
          </motion.main>
        </AnimatePresence>
        <Footer data={data} onNavigate={handleNavigate} />
      </div>
    </>
  );
}