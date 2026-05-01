"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --font-display: 'Syne', sans-serif;
      --font-body: 'DM Sans', sans-serif;
      --indigo: #6366f1;
      --indigo-light: #818cf8;
      --indigo-dim: #eef2ff;
      --indigo-border: #c7d2fe;
      --indigo-dark: #4338ca;
      --navy: #0f172a;
      --navy-mid: #1e293b;
      --slate: #64748b;
      --slate-light: #94a3b8;
      --slate-dim: #cbd5e1;
      --surface: #ffffff;
      --surface-2: #f8fafc;
      --surface-3: #f1f5f9;
      --border: #e2e8f0;
      --text: #0f172a;
      --text-2: #374151;
      --text-3: #64748b;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06);
      --shadow-indigo: 0 8px 24px rgba(99,102,241,0.25);
      --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
      --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
    }

    body { margin: 0; background: var(--surface-3); font-family: var(--font-body); color: var(--text); }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--slate-dim); border-radius: 3px; }

    /* Animations */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.94); }
      to   { opacity: 1; transform: scale(1); }
    }
    @keyframes slideRight {
      from { transform: translateX(-8px); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes pulse-ring {
      0%   { transform: scale(1); opacity: 1; }
      100% { transform: scale(2.2); opacity: 0; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50%       { transform: translateY(-6px); }
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to   { transform: rotate(360deg); }
    }
    @keyframes gradient-shift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .fade-up { animation: fadeUp 0.55s var(--ease-out) both; }
    .fade-up-1 { animation: fadeUp 0.55s 0.05s var(--ease-out) both; }
    .fade-up-2 { animation: fadeUp 0.55s 0.10s var(--ease-out) both; }
    .fade-up-3 { animation: fadeUp 0.55s 0.15s var(--ease-out) both; }
    .fade-up-4 { animation: fadeUp 0.55s 0.20s var(--ease-out) both; }
    .fade-up-5 { animation: fadeUp 0.55s 0.25s var(--ease-out) both; }
    .fade-up-6 { animation: fadeUp 0.55s 0.30s var(--ease-out) both; }
    .scale-in  { animation: scaleIn 0.45s var(--ease-spring) both; }

    /* Nav */
    .nav-btn {
      padding: clamp(6px,1.2vw,7px) clamp(10px,1.8vw,14px);
      border-radius: var(--radius-sm); border: none;
      cursor: pointer; font-size: clamp(12px,1.4vw,13.5px); font-weight: 500;
      font-family: var(--font-body); transition: all 0.2s var(--ease-out);
      position: relative; overflow: hidden; white-space: nowrap;
      min-height: 36px; touch-action: manipulation;
    }
    .nav-btn::after {
      content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.12);
      opacity: 0; transition: opacity 0.2s;
    }
    .nav-btn:hover::after { opacity: 1; }
    .nav-btn.active { background: var(--navy); color: #fff; box-shadow: 0 2px 8px rgba(15,23,42,0.25); }
    .nav-btn.inactive { background: transparent; color: var(--slate); }
    .nav-btn.inactive:hover { background: var(--surface-3); color: var(--navy); }

    /* Cards */
    .card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); transition: transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out), border-color 0.2s;
    }
    .card:hover {
      transform: translateY(-3px);
      box-shadow: var(--shadow-md);
      border-color: var(--indigo-border);
    }

    /* Project card */
    .project-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      transition: transform 0.3s var(--ease-spring), box-shadow 0.3s var(--ease-out), border-color 0.2s;
    }
    .project-card:hover {
      transform: translateY(-5px) scale(1.01);
      box-shadow: var(--shadow-lg);
      border-color: var(--indigo-border);
    }

    /* Skill badge */
    .skill-badge {
      background: var(--indigo-dim); border: 1px solid var(--indigo-border);
      color: var(--indigo-dark); font-size: 12.5px; font-weight: 600;
      padding: 5px 13px; border-radius: 20px;
      transition: all 0.2s var(--ease-spring);
      cursor: default; display: inline-block;
    }
    .skill-badge:hover {
      background: var(--indigo); color: #fff; border-color: var(--indigo);
      transform: scale(1.07) translateY(-1px);
      box-shadow: var(--shadow-indigo);
    }

    /* Buttons — all use clamp for fluid sizing + 44px min touch target */
    .btn-primary {
      background: var(--navy); color: #fff; border: none;
      padding: clamp(9px,1.5vw,11px) clamp(16px,3vw,24px);
      border-radius: var(--radius-sm);
      font-weight: 700; font-size: clamp(12.5px,1.6vw,14px); cursor: pointer;
      font-family: var(--font-body); transition: all 0.2s var(--ease-out);
      position: relative; overflow: hidden; touch-action: manipulation;
      min-height: 40px; display: inline-flex; align-items: center; justify-content: center;
      white-space: nowrap;
    }
    .btn-primary::before {
      content: ''; position: absolute; inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.2s;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(15,23,42,0.3); }
    .btn-primary:hover::before { opacity: 1; }
    .btn-primary:active { transform: translateY(0); box-shadow: none; }

    .btn-indigo {
      background: var(--indigo); color: #fff; border: none;
      padding: clamp(9px,1.5vw,11px) clamp(16px,3vw,24px);
      border-radius: var(--radius-sm);
      font-weight: 700; font-size: clamp(12.5px,1.6vw,14px); cursor: pointer;
      font-family: var(--font-body); text-decoration: none;
      display: inline-flex; align-items: center; justify-content: center;
      transition: all 0.2s var(--ease-out);
      min-height: 40px; white-space: nowrap; touch-action: manipulation;
    }
    .btn-indigo:hover {
      background: var(--indigo-dark); transform: translateY(-2px);
      box-shadow: var(--shadow-indigo);
    }
    .btn-indigo:active { transform: translateY(0); }

    .btn-ghost {
      background: transparent; border: 1px solid var(--border);
      color: var(--slate);
      padding: clamp(8px,1.4vw,10px) clamp(14px,2.5vw,20px);
      border-radius: var(--radius-sm);
      font-size: clamp(12.5px,1.6vw,14px); font-weight: 500; cursor: pointer;
      font-family: var(--font-body); transition: all 0.2s;
      min-height: 40px; display: inline-flex; align-items: center; justify-content: center;
      white-space: nowrap; touch-action: manipulation;
    }
    .btn-ghost:hover { border-color: var(--indigo-border); color: var(--indigo); background: var(--indigo-dim); }

    /* Filter pills */
    .filter-pill {
      padding: clamp(5px,1vw,7px) clamp(12px,2vw,18px);
      border-radius: 20px; border: 1px solid var(--border);
      font-size: clamp(11.5px,1.4vw,13px); font-weight: 600; cursor: pointer;
      font-family: var(--font-body); transition: all 0.2s var(--ease-spring);
      background: var(--surface); color: var(--slate);
      min-height: 36px; display: inline-flex; align-items: center;
      touch-action: manipulation; white-space: nowrap;
    }
    .filter-pill:hover { border-color: var(--indigo-border); color: var(--indigo); transform: scale(1.04); }
    .filter-pill.active-all { background: var(--navy); color: #fff; border-color: transparent; }
    .filter-pill.active-tech { background: var(--indigo); color: #fff; border-color: transparent; }
    .filter-pill.active-all:hover, .filter-pill.active-tech:hover { transform: scale(1.04); }

    /* Hire me btn */
    .hire-btn {
      font-size: clamp(11px, 1.5vw, 13px); font-weight: 700;
      padding: clamp(7px, 1.2vw, 9px) clamp(12px, 2.2vw, 18px);
      border-radius: var(--radius-sm); text-decoration: none;
      position: relative; overflow: hidden;
      display: inline-flex; align-items: center; gap: 4px;
      white-space: nowrap; flex-shrink: 0;
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #6366f1);
      background-size: 200% 200%; color: #fff;
      transition: transform 0.2s var(--ease-out), box-shadow 0.2s;
      animation: gradient-shift 4s ease infinite;
      min-height: 36px; touch-action: manipulation;
    }
    .hire-btn:hover { transform: translateY(-2px); box-shadow: var(--shadow-indigo); }
    /* ≤479px: hide label, show ✦ icon pill */
    @media (max-width: 479px) {
      .hire-btn .hire-label { display: none; }
      .hire-btn { width: 36px; height: 36px; padding: 0; border-radius: 50%; justify-content: center; }
    }

    /* Stat cards */
    .stat-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 20px 14px; text-align: center;
      transition: all 0.25s var(--ease-spring); position: relative; overflow: hidden;
    }
    .stat-card::before {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--indigo), #8b5cf6);
      transform: scaleX(0); transition: transform 0.3s var(--ease-out); transform-origin: left;
    }
    .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--indigo-border); }
    .stat-card:hover::before { transform: scaleX(1); }

    /* Experience timeline dot */
    .timeline-dot-current {
      position: relative;
    }
    .timeline-dot-current::after {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      border-radius: 50%;
      background: var(--indigo);
      animation: pulse-ring 1.8s ease-out infinite;
    }

    /* Input styles */
    .form-input {
      width: 100%; box-sizing: border-box;
      border: 1.5px solid var(--border); border-radius: var(--radius-sm);
      padding: 10px 14px; font-size: 13.5px; color: var(--text);
      background: var(--surface-2); outline: none;
      font-family: var(--font-body);
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .form-input:focus {
      border-color: var(--indigo); background: var(--surface);
      box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    }
    .form-input::placeholder { color: var(--slate-light); }

    /* Social links */
    .social-link {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: clamp(12px,1.5vw,13.5px); font-weight: 600; text-decoration: none;
      padding: clamp(6px,1vw,8px) clamp(10px,2vw,14px); border-radius: var(--radius-sm);
      border: 1px solid var(--border);
      color: var(--slate); background: var(--surface);
      transition: all 0.2s var(--ease-out);
      min-height: 38px; touch-action: manipulation;
    }
    .social-link:hover {
      color: var(--indigo); border-color: var(--indigo-border);
      background: var(--indigo-dim); transform: translateY(-2px);
    }

    /* Back btn */
    .back-btn {
      background: none; border: none; cursor: pointer;
      font-size: clamp(12px,1.5vw,13px); color: var(--slate-light);
      font-family: var(--font-body); padding: 0 0 10px;
      display: inline-flex; align-items: center; gap: 4px;
      transition: color 0.15s; text-decoration: none;
      min-height: 36px; touch-action: manipulation;
    }
    .back-btn:hover { color: var(--indigo); }

    /* Mobile nav drawer */
    .mobile-menu-btn {
      display: none; background: none; border: 1px solid var(--border);
      border-radius: var(--radius-sm); cursor: pointer; padding: 7px 10px;
      color: var(--navy); font-size: 16px; line-height: 1;
      min-width: 38px; min-height: 36px;
      align-items: center; justify-content: center;
      transition: all 0.2s; touch-action: manipulation;
    }
    .mobile-menu-btn:hover { background: var(--surface-3); border-color: var(--indigo-border); }
    .mobile-drawer {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 200;
      background: rgba(15,23,42,0.5); backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease;
    }
    .mobile-drawer-panel {
      position: absolute; top: 0; right: 0; width: min(280px, 80vw); height: 100%;
      background: var(--surface); box-shadow: -4px 0 24px rgba(0,0,0,0.12);
      padding: 20px; display: flex; flex-direction: column; gap: 6px;
      animation: slideInRight 0.28s var(--ease-out);
    }
    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to   { transform: translateX(0); opacity: 1; }
    }
    .drawer-nav-btn {
      width: 100%; text-align: left; padding: 13px 16px;
      border-radius: var(--radius-md); border: none; cursor: pointer;
      font-size: 15px; font-weight: 600; font-family: var(--font-body);
      transition: all 0.18s; touch-action: manipulation;
      display: flex; align-items: center; gap: 10px; min-height: 48px;
    }
    .drawer-nav-btn.active { background: var(--navy); color: #fff; }
    .drawer-nav-btn.inactive { background: transparent; color: var(--slate); }
    .drawer-nav-btn.inactive:hover { background: var(--surface-3); color: var(--navy); }

    /* Hero action buttons responsive */
    @media (max-width: 560px) {
      .hero-actions { flex-direction: column !important; }
      .hero-actions > * { width: 100% !important; text-align: center; justify-content: center; }
    }

    /* Page-level action button row (Experience/Education bottom row) */
    .btn-row { display: flex; gap: 12px; flex-wrap: wrap; }
    @media (max-width: 400px) {
      .btn-row { flex-direction: column; }
      .btn-row > * { width: 100%; }
    }

    /* Projects header row */
    @media (max-width: 480px) {
      .projects-header { flex-direction: column !important; align-items: flex-start !important; }
      .projects-header .btn-primary { width: 100%; margin-top: 8px !important; }
    }

    /* Nav: hide links on small screens, show hamburger */
    @media (max-width: 640px) {
      .nav-links { display: none !important; }
      .mobile-menu-btn { display: inline-flex !important; }
    }
    /* Hide name on very small screens to give space */
    @media (max-width: 360px) {
      .nav-name { display: none !important; }
    }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; z-index: 100;
      background: rgba(15,23,42,0.55);
      backdrop-filter: blur(6px);
      display: flex; align-items: center; justify-content: center;
      padding: clamp(10px, 3vw, 20px);
      animation: fadeIn 0.2s ease;
    }
    .modal-box {
      background: var(--surface); border-radius: var(--radius-xl);
      padding: clamp(16px, 4vw, 28px);
      width: 100%; max-width: 520px; max-height: 92vh;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
      animation: scaleIn 0.3s var(--ease-spring);
    }
    .modal-box::-webkit-scrollbar { width: 4px; }
    .modal-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .nav-inner { height: 52px !important; }
    }

    /* Hero gradient text */
    .gradient-text {
      background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.75) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    /* Certification card */
    .cert-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;
      gap: 12px; flex-wrap: wrap;
      transition: all 0.2s var(--ease-out);
    }
    .cert-card:hover { border-color: var(--indigo-border); box-shadow: var(--shadow-sm); transform: translateX(4px); }

    /* Page transitions */
    .page-enter { animation: fadeUp 0.4s var(--ease-out) both; }

    /* Floating orbs in hero */
    .orb {
      position: absolute; border-radius: 50%; pointer-events: none;
      animation: float 6s ease-in-out infinite;
    }

    /* Link hover underline */
    .link-hover {
      position: relative; text-decoration: none;
    }
    .link-hover::after {
      content: ''; position: absolute; bottom: -1px; left: 0; right: 0;
      height: 1px; background: currentColor;
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.2s var(--ease-out);
    }
    .link-hover:hover::after { transform: scaleX(1); }

    /* Experience card */
    .exp-card {
      flex: 1; background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: clamp(16px, 3vw, 20px);
      margin-bottom: 14px; transition: all 0.25s var(--ease-out);
    }
    .exp-card:hover {
      border-color: var(--indigo-border);
      box-shadow: var(--shadow-sm);
      transform: translateX(4px);
    }

    /* Tech tag */
    .tech-tag {
      font-size: 11px; color: var(--slate); background: var(--surface-3);
      padding: 3px 9px; border-radius: 20px; font-weight: 500;
      transition: all 0.2s;
    }
    .tech-tag:hover { background: var(--indigo-dim); color: var(--indigo-dark); }

    /* Number counter animation */
    @keyframes countUp {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .count-num { animation: countUp 0.6s var(--ease-spring) 0.2s both; }

    /* Glow on current badge */
    .badge-current {
      font-size: 11px; font-weight: 700;
      background: var(--indigo-dim); color: var(--indigo-dark);
      border: 1px solid var(--indigo-border);
      padding: 3px 10px; border-radius: 20px;
      animation: float 3s ease-in-out infinite;
    }
  `}</style>
);

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Skill { id: string; name: string; }
interface Project {
  id: string; title: string; featured?: boolean; description: string;
  thumbnail_url: string | null; live_url: string | null;
  github_url: string | null; tech_stack: string[];
}
interface Experience {
  id: string; role: string; company: string; location?: string;
  start_date: string; end_date: string | null; is_current: boolean;
  description?: string; skills?: string[];
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
  website: string; github_url: string; linkedin_url: string; twitter_url: string;
  skills: Skill[]; projects: Project[]; experience: Experience[];
  education: Education[]; certifications?: Certification[];
}
type Page = "home" | "projects" | "experience" | "education";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const SAMPLE_DATA: PortfolioData = {
  full_name: "Alex Rivera", username: "alexrivera",
  bio: "Full-stack developer obsessed with clean architecture, great UX, and shipping things that matter. 5+ years building products people actually use.",
  avatar_url: null, email: "alex@example.com", location: "San Francisco, CA",
  website: "https://alexrivera.dev", github_url: "https://github.com/alexrivera",
  linkedin_url: "https://linkedin.com/in/alexrivera", twitter_url: "https://twitter.com/alexrivera",
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
      description: "Building the edge runtime and improving cold-start performance. Reduced build times by 40% through parallelization strategies.",
      skills: ["Next.js", "Rust", "Edge Computing"],
    },
    {
      id: "2", role: "Software Engineer", company: "Stripe",
      location: "San Francisco, CA", start_date: "Mar 2020", end_date: "Dec 2021", is_current: false,
      description: "Worked on the Payments API team, handling millions of transactions daily. Led the migration to a new idempotency system.",
      skills: ["Ruby", "Go", "PostgreSQL", "Kafka"],
    },
    {
      id: "3", role: "Frontend Developer", company: "Figma",
      location: "San Francisco, CA", start_date: "Jun 2018", end_date: "Feb 2020", is_current: false,
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

// ─── AVATAR ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", fontWeight: 700, fontSize: size * 0.38,
      flexShrink: 0, fontFamily: "var(--font-display)",
      boxShadow: "0 0 0 2px rgba(99,102,241,0.3)",
    }}>
      {name?.charAt(0)?.toUpperCase()}
    </div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const step = Math.ceil(end / 20);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(start);
    }, 40);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display}</>;
}

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS: { label: string; page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Projects", page: "projects" },
  { label: "Experience", page: "experience" },
  { label: "Education", page: "education" },
];

function Nav({ data, currentPage, onNavigate }: { data: PortfolioData; currentPage: Page; onNavigate: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (p: Page) => { onNavigate(p); setDrawerOpen(false); };

  const PAGE_ICONS: Record<Page, string> = { home: "⌂", projects: "◈", experience: "◉", education: "✦" };

  return (
    <>
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
        backdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        fontFamily: "var(--font-body)",
        transition: "all 0.3s var(--ease-out)",
        boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
      }}>
        <div className="nav-inner" style={{
          maxWidth: 1020, margin: "0 auto",
          padding: "0 clamp(14px, 4vw, 24px)",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", height: 58,
          gap: 10,
        }}>
          {/* Logo */}
          <button onClick={() => handleNav("home")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer", padding: 0,
              transition: "opacity 0.2s", minWidth: 0, flexShrink: 1,
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <Avatar name={data.full_name} size={32} />
            <span className="nav-name" style={{
              fontWeight: 700, fontSize: "clamp(12px,2vw,14px)",
              color: "var(--navy)", fontFamily: "var(--font-display)",
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              maxWidth: "clamp(80px,20vw,200px)",
            }}>
              {data.full_name}
            </span>
          </button>

          {/* Desktop nav links */}
          <nav className="nav-links" style={{ display: "flex", gap: 4, flexShrink: 0 }}>
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                className={`nav-btn ${currentPage === page ? "active" : "inactive"}`}>
                {label}
              </button>
            ))}
          </nav>

          {/* Right side: Hire Me + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {data.email && (
              <a href={`mailto:${data.email}`} className="hire-btn">
                <span className="hire-label">Hire Me</span>
                <span aria-hidden="true">✦</span>
              </a>
            )}
            <button
              className="mobile-menu-btn"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="mobile-drawer" onClick={() => setDrawerOpen(false)}>
          <div className="mobile-drawer-panel" onClick={e => e.stopPropagation()}>
            {/* Drawer header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Avatar name={data.full_name} size={30} />
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--navy)", fontFamily: "var(--font-display)" }}>
                  {data.full_name}
                </span>
              </div>
              <button onClick={() => setDrawerOpen(false)} style={{
                background: "var(--surface-3)", border: "none", cursor: "pointer",
                width: 30, height: 30, borderRadius: "50%", fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--slate)", transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--slate)"; }}
              >✕</button>
            </div>

            {/* Nav items */}
            {NAV_ITEMS.map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                className={`drawer-nav-btn ${currentPage === page ? "active" : "inactive"}`}>
                <span style={{ fontSize: 16 }}>{PAGE_ICONS[page]}</span>
                {label}
              </button>
            ))}

            {/* CTA */}
            {data.email && (
              <a href={`mailto:${data.email}`}
                onClick={() => setDrawerOpen(false)}
                style={{
                  marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 6, width: "100%", padding: "13px 16px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff", borderRadius: "var(--radius-md)",
                  fontWeight: 700, fontSize: 14, textDecoration: "none",
                  transition: "opacity 0.2s", minHeight: 48,
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Hire Me ✦
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer({ data, onNavigate }: { data: PortfolioData; onNavigate: (p: Page) => void }) {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)", background: "var(--surface)",
      padding: "28px clamp(14px, 4vw, 24px)",
      fontFamily: "var(--font-body)", marginTop: 64,
    }}>
      <div style={{
        maxWidth: 1020, margin: "0 auto",
        display: "flex", flexDirection: "column", gap: 14, alignItems: "center",
      }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", justifyContent: "center" }}>
          {NAV_ITEMS.map(({ label, page }) => (
            <button key={page} onClick={() => onNavigate(page)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 13, color: "var(--slate-light)",
                fontFamily: "var(--font-body)", padding: "6px 10px",
                borderRadius: "var(--radius-sm)", transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--indigo)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--slate-light)")}
            >
              {label}
            </button>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--slate-dim)", fontWeight: 400 }}>
          {data.full_name} · {new Date().getFullYear()} · Built with Portfolio Builder
        </p>
      </div>
    </footer>
  );
}

// ─── PAGE WRAPPER ─────────────────────────────────────────────────────────────
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-enter" style={{
      maxWidth: 1020, margin: "0 auto",
      padding: "clamp(24px, 5vw, 48px) clamp(14px, 4vw, 24px) 32px",
      fontFamily: "var(--font-body)",
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
      <div className="fade-up" style={{
        borderRadius: "var(--radius-xl)",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #312e81 100%)",
        padding: "clamp(28px, 6vw, 56px) clamp(20px, 5vw, 52px)",
        color: "#fff", position: "relative", overflow: "hidden",
        marginBottom: 20,
        boxShadow: "0 20px 60px rgba(99,102,241,0.2), 0 4px 20px rgba(0,0,0,0.3)",
      }}>
        {/* Orbs */}
        <div className="orb" style={{ width: 220, height: 220, background: "rgba(99,102,241,0.18)", top: -60, right: -40, animationDelay: "0s" }} />
        <div className="orb" style={{ width: 140, height: 140, background: "rgba(139,92,246,0.15)", bottom: -30, left: "35%", animationDelay: "2s" }} />
        <div className="orb" style={{ width: 80, height: 80, background: "rgba(167,139,250,0.2)", top: "30%", left: "60%", animationDelay: "4s" }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="fade-up-1" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 600, letterSpacing: "0.14em",
            textTransform: "uppercase",
            background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)",
            padding: "5px 14px", borderRadius: 20, color: "rgba(255,255,255,0.8)",
            marginBottom: 18,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block", animation: "pulse-ring 1.5s ease-out infinite" }} />
            Available for work
          </div>

          <h1 className="fade-up-2 gradient-text" style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 800,
            margin: "0 0 6px", letterSpacing: "-0.03em", lineHeight: 1.08,
            fontFamily: "var(--font-display)",
          }}>
            {data.full_name}
          </h1>
          <p className="fade-up-2" style={{ color: "rgba(255,255,255,0.45)", margin: "0 0 18px", fontSize: 14, fontWeight: 400 }}>
            @{data.username}
          </p>
          <p className="fade-up-3" style={{
            fontSize: "clamp(13px,2vw,15px)", lineHeight: 1.75,
            color: "rgba(255,255,255,0.75)", maxWidth: 540, margin: "0 0 32px",
          }}>
            {data.bio}
          </p>

          <div className="hero-actions fade-up-4" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => onNavigate("projects")} className="btn-primary"
              style={{ background: "#fff", color: "var(--navy)", fontWeight: 700 }}>
              View Projects →
            </button>
            <button onClick={() => onNavigate("experience")} style={{
              background: "rgba(255,255,255,0.1)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.22)",
              padding: "clamp(9px,1.5vw,11px) clamp(16px,3vw,22px)",
              borderRadius: "var(--radius-sm)", fontWeight: 500,
              fontSize: "clamp(12.5px,1.6vw,14px)", cursor: "pointer",
              fontFamily: "var(--font-body)", transition: "all 0.2s",
              minHeight: 40, whiteSpace: "nowrap", touchAction: "manipulation",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = ""; }}
            >
              Experience
            </button>
            {data.email && (
              <a href={`mailto:${data.email}`} style={{
                background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.15)",
                padding: "clamp(9px,1.5vw,11px) clamp(16px,3vw,22px)",
                borderRadius: "var(--radius-sm)", fontWeight: 500,
                fontSize: "clamp(12.5px,1.6vw,14px)", textDecoration: "none",
                fontFamily: "var(--font-body)", transition: "all 0.2s", display: "inline-flex",
                alignItems: "center", justifyContent: "center", minHeight: 40,
                whiteSpace: "nowrap", touchAction: "manipulation",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.transform = ""; }}
              >
                Get in Touch ✉
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="fade-up-2" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12, marginBottom: 20,
      }}>
        {[
          { v: data.projects.length, l: "Projects", icon: "◈" },
          { v: data.skills.length, l: "Skills", icon: "⚡" },
          { v: data.experience.length, l: "Roles", icon: "◉" },
          { v: data.education.length, l: "Degrees", icon: "✦" },
        ].map(({ v, l, icon }) => (
          <div key={l} className="stat-card">
            <p style={{ fontSize: 13, color: "var(--slate-light)", marginBottom: 4 }}>{icon}</p>
            <p className="count-num" style={{
              fontSize: "clamp(22px,3vw,28px)", fontWeight: 800,
              color: "var(--navy)", margin: "0 0 2px", fontFamily: "var(--font-display)",
            }}>
              <AnimatedNumber value={v} />
            </p>
            <p style={{ fontSize: 10.5, color: "var(--slate-light)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* About + Skills */}
      <div className="fade-up-3" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 16, marginBottom: 20,
      }}>
        {/* About */}
        <div className="card" style={{ padding: "clamp(18px,3vw,24px)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: "0 0 16px", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            About
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {[
              { l: "Location", v: data.location, icon: "📍" },
              { l: "Email", v: data.email, link: `mailto:${data.email}`, icon: "✉" },
              { l: "Website", v: data.website ? "Visit →" : null, link: data.website, icon: "🌐" },
              { l: "GitHub", v: data.github_url ? "View Profile →" : null, link: data.github_url, icon: "⌥" },
            ].map(({ l, v, link, icon }) => v && (
              <div key={l} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <span style={{ fontSize: 13, minWidth: 20, textAlign: "center" }}>{icon}</span>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text-2)", minWidth: 58 }}>{l}:</span>
                {link
                  ? <a href={link} target="_blank" rel="noreferrer" className="link-hover" style={{ fontSize: 13, color: "var(--indigo)", fontWeight: 500 }}>{v}</a>
                  : <span style={{ fontSize: 13, color: "var(--slate)" }}>{v}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="card" style={{ padding: "clamp(18px,3vw,24px)" }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: "0 0 16px", fontFamily: "var(--font-display)", letterSpacing: "-0.01em" }}>
            Skills
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.skills.map((s, i) => (
              <span key={s.id} className="skill-badge" style={{ animationDelay: `${i * 0.04}s` }}>
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="fade-up-4" style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 800, color: "var(--navy)", margin: 0, fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}>
            Featured Projects
          </h2>
          <button onClick={() => onNavigate("projects")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--indigo)", fontWeight: 600, fontFamily: "var(--font-body)", padding: 0, transition: "gap 0.2s" }}>
            All projects →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
          {data.projects.slice(0, 2).map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 0.08}s` }} className="fade-up">
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>

      {/* Experience preview */}
      <div className="card fade-up-5" style={{ padding: "clamp(18px,3vw,24px)", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: 0, fontFamily: "var(--font-display)" }}>
            Experience
          </h2>
          <button onClick={() => onNavigate("experience")}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "var(--indigo)", fontWeight: 600, fontFamily: "var(--font-body)", padding: 0 }}>
            Full history →
          </button>
        </div>
        <div style={{ paddingLeft: 20, borderLeft: "2px solid var(--border)", display: "flex", flexDirection: "column", gap: 20 }}>
          {data.experience.slice(0, 2).map((item, i) => (
            <div key={item.id} style={{ position: "relative", animation: `slideRight 0.4s ${i * 0.1}s var(--ease-out) both` }}>
              <div style={{
                position: "absolute", left: -25, top: 4,
                width: 10, height: 10, borderRadius: "50%",
                background: item.is_current ? "var(--indigo)" : "var(--slate-dim)",
                border: "2px solid var(--surface-3)",
                boxShadow: item.is_current ? "0 0 0 3px rgba(99,102,241,0.2)" : "none",
                zIndex: 1,
              }} />
              <p style={{ fontWeight: 700, fontSize: 14, color: "var(--navy)", margin: "0 0 2px", fontFamily: "var(--font-display)" }}>{item.role}</p>
              <p style={{ fontSize: 13, color: "var(--indigo)", fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
              <p style={{ fontSize: 12, color: "var(--slate-light)", margin: 0 }}>
                {item.start_date} – {item.is_current ? "Present" : item.end_date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="card fade-up-6" style={{ padding: "clamp(18px,3vw,24px)" }}>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: "0 0 14px", fontFamily: "var(--font-display)" }}>
          Contact
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {data.email && (
            <a href={`mailto:${data.email}`} className="social-link">✉ {data.email}</a>
          )}
          {data.linkedin_url && (
            <a href={data.linkedin_url} target="_blank" rel="noreferrer" className="social-link">in LinkedIn →</a>
          )}
          {data.twitter_url && (
            <a href={data.twitter_url} target="_blank" rel="noreferrer" className="social-link">𝕏 Twitter →</a>
          )}
          {data.github_url && (
            <a href={data.github_url} target="_blank" rel="noreferrer" className="social-link">⌥ GitHub →</a>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  const colors = ["#eef2ff", "#f0fdf4", "#fff7ed", "#fdf4ff", "#f0f9ff"];
  const textColors = ["#4338ca", "#166534", "#9a3412", "#86198f", "#075985"];
  const colorIdx = project.id.charCodeAt(0) % colors.length;

  return (
    <article
      className="project-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Thumbnail */}
      <a
        href={project.live_url ?? "#"}
        target={project.live_url ? "_blank" : "_self"}
        rel="noreferrer"
        style={{ display: "block", position: "relative", overflow: "hidden", height: 180, textDecoration: "none" }}
      >
        {project.thumbnail_url ? (
          <img
            src={project.thumbnail_url} alt={project.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.4s var(--ease-out)",
            }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            background: colors[colorIdx],
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", overflow: "hidden",
          }}>
            {/* Decorative circles */}
            <div style={{
              position: "absolute", width: 120, height: 120, borderRadius: "50%",
              background: textColors[colorIdx], opacity: 0.07,
              top: -20, right: -20,
              transform: hovered ? "scale(1.3)" : "scale(1)",
              transition: "transform 0.4s var(--ease-out)",
            }} />
            <div style={{
              position: "absolute", width: 70, height: 70, borderRadius: "50%",
              background: textColors[colorIdx], opacity: 0.05,
              bottom: 10, left: 20,
            }} />
            <span style={{
              fontSize: 52, fontWeight: 800, color: textColors[colorIdx],
              opacity: 0.6, fontFamily: "var(--font-display)",
              transform: hovered ? "scale(1.1) rotate(-5deg)" : "scale(1)",
              transition: "transform 0.4s var(--ease-spring)",
              display: "block",
            }}>
              {project.title.charAt(0)}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        {project.live_url && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(15,23,42,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.25s",
          }}>
            <span style={{
              background: "#fff", color: "var(--navy)",
              fontSize: 12.5, fontWeight: 700,
              padding: "7px 16px", borderRadius: 20,
              transform: hovered ? "translateY(0) scale(1)" : "translateY(6px) scale(0.95)",
              transition: "all 0.25s var(--ease-spring)",
              fontFamily: "var(--font-body)",
            }}>
              Visit site ↗
            </span>
          </div>
        )}

        {/* Featured badge */}
        {project.featured && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(99,102,241,0.9)", color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "3px 9px",
            borderRadius: 20, letterSpacing: "0.08em",
            backdropFilter: "blur(4px)",
          }}>
            FEATURED
          </div>
        )}
      </a>

      <div style={{ padding: "clamp(14px,2.5vw,18px) clamp(14px,2.5vw,18px) clamp(16px,2.5vw,20px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: "var(--navy)", margin: 0,
            lineHeight: 1.3, fontFamily: "var(--font-display)",
          }}>
            {project.title}
          </h3>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noreferrer" style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                background: "var(--indigo-dim)", color: "var(--indigo-dark)",
                textDecoration: "none", border: "1px solid var(--indigo-border)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--indigo)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--indigo)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--indigo-dim)"; e.currentTarget.style.color = "var(--indigo-dark)"; e.currentTarget.style.borderColor = "var(--indigo-border)"; }}
              >
                Live ↗
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer" style={{
                fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6,
                background: "var(--surface-2)", color: "var(--slate)",
                textDecoration: "none", border: "1px solid var(--border)",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--navy)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--navy)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--slate)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                Code
              </a>
            )}
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.65, margin: "0 0 12px" }}>
          {project.description}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {project.tech_stack.map((t) => (
            <span key={t} className="tech-tag">{t}</span>
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
      if (typeof e.target?.result === "string") setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd({
      id: Date.now().toString(), title: form.title, description: form.description,
      live_url: form.live_url || null, github_url: form.github_url || null,
      thumbnail_url: preview || null,
      tech_stack: form.tech_stack_raw.split(",").map((s) => s.trim()).filter(Boolean),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--navy)", fontFamily: "var(--font-display)" }}>
            Add Project
          </h3>
          <button onClick={onClose} style={{
            background: "var(--surface-3)", border: "none", cursor: "pointer",
            width: 28, height: 28, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, color: "var(--slate)", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fee2e2"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--slate)"; }}
          >
            ✕
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Upload */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>Screenshot</label>
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
              style={{
                border: `2px dashed ${dragging ? "var(--indigo)" : "var(--border)"}`,
                borderRadius: "var(--radius-md)", cursor: "pointer",
                background: dragging ? "var(--indigo-dim)" : "var(--surface-2)",
                transition: "all 0.2s", overflow: "hidden",
                minHeight: preview ? "auto" : 110,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {preview ? (
                <div style={{ position: "relative", width: "100%" }}>
                  <img src={preview} alt="preview" style={{ width: "100%", maxHeight: 190, objectFit: "cover", display: "block" }} />
                  <button onClick={(e) => { e.stopPropagation(); setPreview(null); }}
                    style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(255,255,255,0.92)", border: "none",
                      borderRadius: "50%", width: 28, height: 28,
                      cursor: "pointer", fontSize: 12, color: "var(--slate)",
                    }}>✕</button>
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "22px 16px" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--slate)" }}>Drop image or click to upload</p>
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "var(--slate-light)" }}>PNG, JPG, WebP</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files?.[0])} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>
              Title <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input className="form-input" placeholder="My Awesome Project"
              value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>Description</label>
            <textarea className="form-input" rows={3} style={{ resize: "vertical", minHeight: 80 }}
              placeholder="What does this project do?"
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>Live URL</label>
              <input className="form-input" placeholder="https://..." type="url"
                value={form.live_url} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>GitHub URL</label>
              <input className="form-input" placeholder="https://github.com/..." type="url"
                value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-2)", display: "block", marginBottom: 8 }}>Tech Stack</label>
            <input className="form-input" placeholder="React, TypeScript, Tailwind (comma separated)"
              value={form.tech_stack_raw} onChange={(e) => setForm({ ...form, tech_stack_raw: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={submit} disabled={!form.title.trim()}
            style={{ opacity: form.title.trim() ? 1 : 0.5, cursor: form.title.trim() ? "pointer" : "not-allowed" }}>
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

  const allTechs = [...new Set(projects.flatMap((p) => p.tech_stack))];
  const filtered = filter === "all" ? projects : projects.filter((p) => p.tech_stack.includes(filter));

  return (
    <PageWrapper>
      {showModal && <AddProjectModal onClose={() => setShowModal(false)} onAdd={(p) => setProjects([p, ...projects])} />}

      <div className="fade-up projects-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12, flexWrap: "wrap" }}>
        <div>
          <button className="back-btn" onClick={() => onNavigate("home")}>← {data.full_name}</button>
          <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", margin: "0 0 4px", letterSpacing: "-0.03em", fontFamily: "var(--font-display)" }}>
            Projects
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--slate-light)", margin: 0 }}>
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary" style={{ marginTop: 28 }}>
          + Add Project
        </button>
      </div>

      {allTechs.length > 0 && (
        <div className="fade-up-1" style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "20px 0 24px" }}>
          {["all", ...allTechs].map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`filter-pill ${filter === t ? (t === "all" ? "active-all" : "active-tech") : ""}`}>
              {t === "all" ? "All" : t}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 ? (
        <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%,280px), 1fr))", gap: 20 }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ animation: `fadeUp 0.4s ${i * 0.07}s var(--ease-out) both` }}>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "80px 0", animation: "fadeIn 0.3s ease" }}>
          <p style={{ fontSize: 15, color: "var(--slate-light)" }}>No projects found for this filter.</p>
        </div>
      )}
    </PageWrapper>
  );
}

// ─── EXPERIENCE PAGE ──────────────────────────────────────────────────────────
function ExperienceSection({ title, items, accent }: { title: string; items: Experience[]; accent: string }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
        color: accent, margin: "0 0 20px", display: "flex", alignItems: "center", gap: 8,
      }}>
        {title}
        <span style={{ height: 1, flex: 1, background: "var(--border)", display: "inline-block", maxWidth: 80 }} />
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {items.map((item, idx) => (
          <div key={item.id} style={{
            display: "flex", gap: "clamp(12px,3vw,18px)", alignItems: "flex-start",
            animation: `fadeUp 0.45s ${idx * 0.1}s var(--ease-out) both`,
          }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 4, flexShrink: 0 }}>
              <div style={{
                width: 12, height: 12, borderRadius: "50%", position: "relative",
                background: item.is_current ? "var(--indigo)" : "var(--slate-dim)",
                border: "2px solid var(--surface-3)",
                boxShadow: item.is_current ? "0 0 0 3px rgba(99,102,241,0.2)" : "none",
                zIndex: 1,
              }}>
                {item.is_current && (
                  <div style={{
                    position: "absolute", inset: -4, borderRadius: "50%",
                    border: "1px solid rgba(99,102,241,0.3)",
                    animation: "pulse-ring 2s ease-out infinite",
                  }} />
                )}
              </div>
              <div style={{ width: 2, flex: 1, background: "var(--border)", marginTop: 4, minHeight: 20, borderRadius: 1 }} />
            </div>

            <div className="exp-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "clamp(13px,2vw,15px)", color: "var(--navy)", margin: "0 0 2px", fontFamily: "var(--font-display)" }}>
                    {item.role}
                  </h3>
                  <p style={{ fontSize: 13.5, color: "var(--indigo)", fontWeight: 600, margin: "0 0 2px" }}>{item.company}</p>
                  {item.location && (
                    <p style={{ fontSize: 12, color: "var(--slate-light)", margin: 0 }}>📍 {item.location}</p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
                  {item.is_current && <span className="badge-current">Current</span>}
                  <span style={{ fontSize: 12, color: "var(--slate-light)", whiteSpace: "nowrap" }}>
                    {item.start_date} – {item.is_current ? "Present" : item.end_date}
                  </span>
                </div>
              </div>
              {item.description && (
                <p style={{ fontSize: 13.5, color: "var(--slate)", lineHeight: 1.65, margin: "0 0 10px" }}>{item.description}</p>
              )}
              {item.skills && item.skills.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {item.skills.map((s) => (
                    <span key={s} className="tech-tag">{s}</span>
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
      <button className="back-btn" onClick={() => onNavigate("home")}>← {data.full_name}</button>
      <h1 className="fade-up" style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", margin: "0 0 4px", letterSpacing: "-0.03em", fontFamily: "var(--font-display)" }}>
        Experience
      </h1>
      <p className="fade-up-1" style={{ fontSize: 13.5, color: "var(--slate-light)", margin: "0 0 32px" }}>
        {data.experience.length} position{data.experience.length !== 1 ? "s" : ""}
      </p>

      {/* Stats */}
      <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 36 }}>
        {[
          { v: data.experience.length, l: "Total Roles" },
          { v: current.length, l: "Current" },
          { v: new Set(data.experience.map((e) => e.company)).size, l: "Companies" },
        ].map(({ v, l }) => (
          <div key={l} className="stat-card">
            <p className="count-num" style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 800, color: "var(--navy)", margin: "0 0 2px", fontFamily: "var(--font-display)" }}>
              <AnimatedNumber value={v} />
            </p>
            <p style={{ fontSize: 10.5, color: "var(--slate-light)", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{l}</p>
          </div>
        ))}
      </div>

      <div className="fade-up-2">
        {current.length > 0 && <ExperienceSection title="Current" items={current} accent="var(--indigo)" />}
        {past.length > 0 && <ExperienceSection title="Past" items={past} accent="var(--slate-light)" />}
      </div>

      <div className="fade-up-3 btn-row" style={{ marginTop: 12 }}>
        <button className="btn-ghost" onClick={() => onNavigate("education")}>Education →</button>
        <button className="btn-primary" onClick={() => onNavigate("projects")}>Projects →</button>
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
      <button className="back-btn" onClick={() => onNavigate("home")}>← {data.full_name}</button>
      <h1 className="fade-up" style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, color: "var(--navy)", margin: "0 0 4px", letterSpacing: "-0.03em", fontFamily: "var(--font-display)" }}>
        Education
      </h1>
      <p className="fade-up-1" style={{ fontSize: 13.5, color: "var(--slate-light)", margin: "0 0 32px" }}>
        {data.education.length} institution{data.education.length !== 1 ? "s" : ""}
        {certs.length > 0 ? ` · ${certs.length} certification${certs.length !== 1 ? "s" : ""}` : ""}
      </p>

      <div className="fade-up-2" style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {data.education.map((item, idx) => {
          const dur = item.start_year && item.end_year ? parseInt(item.end_year) - parseInt(item.start_year) : null;
          return (
            <div key={item.id} className="card" style={{
              padding: "clamp(18px,3vw,24px)",
              animation: `fadeUp 0.45s ${idx * 0.1}s var(--ease-out) both`,
            }}>
              <div style={{ display: "flex", gap: "clamp(12px,3vw,16px)", alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: "var(--radius-md)",
                  background: "linear-gradient(135deg, var(--indigo-dim), #ddd6fe)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                  transition: "transform 0.3s var(--ease-spring)",
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "rotate(-8deg) scale(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "")}
                >
                  {getDegreeIcon(item.degree)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "clamp(13px,2vw,15px)", color: "var(--navy)", margin: "0 0 2px", fontFamily: "var(--font-display)" }}>
                        {item.degree}
                      </h3>
                      {item.field && <p style={{ fontSize: 13.5, color: "var(--indigo)", fontWeight: 600, margin: "0 0 2px" }}>{item.field}</p>}
                      <p style={{ fontSize: 13.5, color: "var(--slate)", fontWeight: 500, margin: 0 }}>{item.institution}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      <span style={{ fontSize: 12.5, color: "var(--slate-light)" }}>
                        {item.start_year}{item.end_year && item.end_year !== item.start_year ? ` – ${item.end_year}` : ""}
                      </span>
                      {dur !== null && dur > 0 && (
                        <span style={{ fontSize: 11, background: "var(--surface-3)", color: "var(--slate)", padding: "3px 9px", borderRadius: 20 }}>
                          {dur}yr{dur !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.gpa && (
                    <p style={{ fontSize: 12.5, color: "var(--slate-light)", margin: "6px 0 0" }}>
                      GPA: <strong style={{ color: "var(--indigo)" }}>{item.gpa}</strong>
                    </p>
                  )}
                  {item.description && (
                    <p style={{ fontSize: 13.5, color: "var(--slate)", lineHeight: 1.65, margin: "8px 0 0" }}>{item.description}</p>
                  )}
                  {item.achievements && item.achievements.length > 0 && (
                    <ul style={{ margin: "10px 0 0", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
                      {item.achievements.map((a, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, fontSize: 13.5, color: "var(--slate)" }}>
                          <span style={{ color: "var(--indigo)", flexShrink: 0 }}>✦</span>{a}
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
        <div className="fade-up-3">
          <h2 style={{ fontSize: "clamp(16px,2.5vw,20px)", fontWeight: 800, color: "var(--navy)", margin: "0 0 16px", fontFamily: "var(--font-display)" }}>
            Certifications
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 40 }}>
            {certs.map((c, idx) => (
              <div key={c.id} className="cert-card"
                style={{ animation: `slideRight 0.4s ${idx * 0.08}s var(--ease-out) both` }}
              >
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>📋</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 13.5, color: "var(--navy)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                    <p style={{ fontSize: 12.5, color: "var(--slate)", margin: "2px 0 0" }}>{c.issuer}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                  {c.year && <span style={{ fontSize: 12, color: "var(--slate-light)" }}>{c.year}</span>}
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noreferrer" className="btn-indigo"
                      style={{ fontSize: 11.5, padding: "4px 12px", borderRadius: 8 }}>
                      View ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fade-up-4 btn-row">
        <button className="btn-ghost" onClick={() => onNavigate("experience")}>← Experience</button>
        <button className="btn-primary" onClick={() => onNavigate("projects")}>Projects →</button>
      </div>
    </PageWrapper>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function MinimalPortfolioTemplate({ data = SAMPLE_DATA }: { data?: PortfolioData }) {
  const [page, setPage] = useState<Page>("home");

  const handleNavigate = (p: Page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(p);
  };

  const pages: Record<Page, React.ReactNode> = {
    home: <HomePage data={data} onNavigate={handleNavigate} />,
    projects: <ProjectsPage data={data} onNavigate={handleNavigate} />,
    experience: <ExperiencePage data={data} onNavigate={handleNavigate} />,
    education: <EducationPage data={data} onNavigate={handleNavigate} />,
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ minHeight: "100vh", background: "var(--surface-3)" }}>
        <Nav data={data} currentPage={page} onNavigate={handleNavigate} />
        <main key={page}>{pages[page]}</main>
        <Footer data={data} onNavigate={handleNavigate} />
      </div>
    </>
  );
}