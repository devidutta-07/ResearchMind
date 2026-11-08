import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Globe,
  Layers,
  ListChecks,
  Menu,
  Network,
  PenTool,
  ScanSearch,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
];

const AGENTS = [
  {
    icon: Search,
    name: "Search Agent",
    role: "Searching the web",
    desc: "Finds relevant and recent information across the web.",
  },
  {
    icon: BookOpen,
    name: "Reader Agent",
    role: "Reading sources",
    desc: "Extracts and analyzes the useful content from each source.",
  },
  {
    icon: PenTool,
    name: "Writer Agent",
    role: "Writing the report",
    desc: "Generates structured, detailed research reports.",
  },
  {
    icon: ShieldCheck,
    name: "Critic Agent",
    role: "Reviewing quality",
    desc: "Reviews the report and improves its overall quality.",
  },
];

const FEATURES = [
  {
    icon: Globe,
    title: "Intelligent Web Research",
    desc: "Search the web for relevant, recent information on any topic you want to explore.",
  },
  {
    icon: Users,
    title: "Multi-Agent Collaboration",
    desc: "Specialized agents work together, each handling a focused part of the research process.",
  },
  {
    icon: ScanSearch,
    title: "Deep Content Extraction",
    desc: "Pull out and analyze the meaningful content from the sources that matter.",
  },
  {
    icon: FileText,
    title: "AI-Powered Report Generation",
    desc: "Turn collected information into well-structured, detailed research reports.",
  },
  {
    icon: ShieldCheck,
    title: "Critical Review and Refinement",
    desc: "A dedicated critic reviews each report and helps improve it before you read it.",
  },
  {
    icon: Download,
    title: "Exportable Research Reports",
    desc: "Export your finished reports so you can keep, share, and build on your work.",
  },
];

const STEPS = [
  {
    title: "Enter your research topic",
    desc: "Type in a topic or question you want to understand.",
  },
  {
    title: "Agents search and collect",
    desc: "AI agents search the web and gather relevant information.",
  },
  {
    title: "Analyze, write, and review",
    desc: "The agents analyze sources, write the report, and review it.",
  },
  {
    title: "Receive your report",
    desc: "Get a structured research report that is ready to read and export.",
  },
];

const BENEFITS = [
  { icon: Clock, text: "Save hours of manual research." },
  { icon: Layers, text: "Organize information efficiently." },
  { icon: ListChecks, text: "Get structured research reports." },
  { icon: Network, text: "Use multiple specialized AI agents." },
  { icon: Sparkles, text: "Simplify complex research tasks." },
];

const TECH = ["LangChain", "LangGraph", "Tavily", "Gemini", "Mistral AI", "Hugging Face"];

const HERO_LINE_1 = ["Your", "Research,"];
const HERO_LINE_2 = ["Reimagined", "with", "AI."];

// Sets the --d (delay) custom property used by the animations.
const d = (ms: number): CSSProperties => ({ "--d": `${ms}ms` } as CSSProperties);

// Cursor-follow spotlight for cards.
const spot = (e: ReactMouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Icy Blue LightResearch Brand Highlight */
.brand-highlight {
  font-weight: 700;
  background: linear-gradient(
    100deg,
    #e0f7ff 0%,
    #a5e8ff 25%,
    #55cfff 50%,
    #8bdcff 75%,
    #e0f7ff 100%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  background-size: 200% auto;
  animation: lr-shine 7s linear infinite;
}

html { scroll-behavior: smooth; }

.lr-landing {
  --bg: #08090a;
  --panel: #0e0f11;
  --panel-2: #131417;
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.15);
  --text: #f7f8f8;
  --muted: #a1a4ad;
  --dim: #6c6f79;
  --ice: #55cfff;
  --ice-2: #a5e8ff;
  --ice-3: #e0f7ff;
  --ice-grad: linear-gradient(135deg, #e0f7ff 0%, #8bdcff 50%, #55cfff 100%);
  background: var(--bg);
  color: var(--text);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.6;
  min-height: 100vh;
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;
}
.lr-landing *, .lr-landing *::before, .lr-landing *::after { box-sizing: border-box; }
:where(.lr-landing) a { color: inherit; text-decoration: none; }
.lr-landing section { scroll-margin-top: 72px; position: relative; }
.lr-wrap { width: 100%; max-width: 1320px; margin: 0 auto; padding: 0 clamp(20px, 4vw, 48px); }

/* ---------- Scroll-in animations ---------- */
.lr-reveal { opacity: 0; transform: translateY(26px); filter: blur(6px); transition: opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1), filter .8s ease; transition-delay: var(--d, 0ms); }
.lr-reveal.lr-in { opacity: 1; transform: none; filter: none; }
.lr-tilt { opacity: 0; transform: perspective(1500px) rotateX(9deg) translateY(70px) scale(.96); transform-origin: 50% 100%; transition: opacity 1.1s ease, transform 1.3s cubic-bezier(.2,.7,.2,1); transition-delay: var(--d, 0ms); }
.lr-tilt.lr-in { opacity: 1; transform: none; }

/* ---------- Buttons ---------- */
.lr-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 11px 22px; border-radius: 999px; font-size: 14.5px; font-weight: 600; border: 1px solid transparent; cursor: pointer; transition: transform .25s ease, box-shadow .3s ease, background .25s ease, border-color .25s ease, color .25s ease; font-family: inherit; white-space: nowrap; }
.lr-btn:focus-visible, .lr-nav-link:focus-visible, .lr-icon-btn:focus-visible, .lr-login:focus-visible, .lr-signup:focus-visible { outline: 2px solid var(--ice); outline-offset: 3px; }
.lr-btn-primary { background: #f4f5f8; color: #0a0b0d; box-shadow: 0 8px 30px -10px rgba(165, 232, 255, .55); }
.lr-btn-primary:hover { transform: translateY(-2px); background: #fff; box-shadow: 0 14px 40px -10px rgba(165, 232, 255, .8); }
.lr-btn-ghost { background: rgba(255, 255, 255, .04); color: var(--text); border-color: var(--border-strong); }
.lr-btn-ghost:hover { background: rgba(255, 255, 255, .09); border-color: rgba(255, 255, 255, .28); transform: translateY(-2px); }
.lr-btn-lg { padding: 14px 28px; font-size: 15.5px; }
.lr-arrow { transition: transform .25s ease; }
.lr-btn:hover .lr-arrow, .lr-tag-link:hover .lr-arrow { transform: translateX(4px); }

/* ---------- Navbar ---------- */
.lr-nav { position: sticky; top: 0; z-index: 60; background: rgba(8, 9, 10, .5); backdrop-filter: blur(18px) saturate(150%); -webkit-backdrop-filter: blur(18px) saturate(150%); border-bottom: 1px solid var(--border); transition: background .3s ease, border-color .3s ease; animation: lr-nav-in .9s cubic-bezier(.2,.7,.2,1) both; }
.lr-nav.scrolled { background: rgba(8, 9, 10, .82); border-bottom-color: var(--border-strong); }
.lr-nav-inner { display: flex; align-items: center; justify-content: space-between; height: 72px; }
.lr-brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 600; font-size: 19px; letter-spacing: -.02em; }
.lr-brand img { height: 30px; width: auto; display: block; }
.lr-nav-right { display: flex; align-items: center; }
.lr-nav-links { display: flex; align-items: center; gap: 2px; }
.lr-nav-link { position: relative; padding: 8px 13px; font-size: 14px; color: var(--muted); border-radius: 8px; transition: color .2s ease; }
.lr-nav-link::after { content: ""; position: absolute; left: 13px; right: 13px; bottom: 3px; height: 1px; background: var(--ice-2); transform: scaleX(0); transform-origin: left; transition: transform .3s ease; }
.lr-nav-link:hover { color: var(--text); }
.lr-nav-link:hover::after { transform: scaleX(1); }
.lr-divider { width: 1px; height: 20px; background: var(--border-strong); margin: 0 16px; }
.lr-login { font-size: 14px; color: var(--muted); padding: 8px 10px; border-radius: 8px; transition: color .2s ease; }
.lr-login:hover { color: var(--text); }
.lr-signup { margin-left: 8px; padding: 9px 18px; border-radius: 999px; background: #f4f5f8; color: #0a0b0d !important; font-size: 14px; font-weight: 600; transition: transform .25s ease, box-shadow .3s ease, background .25s ease; }
.lr-signup:hover { background: #fff; transform: translateY(-1px); box-shadow: 0 8px 28px -8px rgba(165, 232, 255, .75); }
.lr-icon-btn { display: none; background: transparent; border: 1px solid var(--border-strong); color: var(--text); width: 40px; height: 40px; border-radius: 10px; cursor: pointer; align-items: center; justify-content: center; }
.lr-mobile-menu { display: none; border-top: 1px solid var(--border); background: rgba(8, 9, 10, .97); padding: 12px clamp(20px, 4vw, 48px) 22px; }
.lr-mobile-menu .lr-nav-link { display: block; padding: 12px 4px; font-size: 16px; }
.lr-mobile-menu .lr-nav-link::after { display: none; }
.lr-mobile-actions { display: flex; gap: 10px; margin-top: 14px; }
.lr-mobile-actions .lr-btn { flex: 1; }

/* ---------- Hero ---------- */
.lr-hero { position: relative; overflow: hidden; margin: 0 6px; border-radius: 0 0 28px 28px; padding: clamp(72px, 15vh, 160px) 0 clamp(70px, 9vw, 120px); background: linear-gradient(180deg, #08090a 0%, #08090a 45%, #121315 75%, #1d1e21 100%); }
.lr-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; background:
  radial-gradient(110% 58% at 50% 108%, rgba(168, 174, 186, .85) 0%, rgba(110, 116, 128, .5) 36%, transparent 74%),
  radial-gradient(55% 38% at 100% 100%, rgba(165, 232, 255, .16), transparent 70%),
  radial-gradient(55% 34% at 0% 100%, rgba(255, 255, 255, .11), transparent 70%); }
.lr-glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
.lr-glow-a { width: 520px; height: 520px; background: rgba(85, 207, 255, .1); top: -220px; right: 8%; animation: lr-drift 18s ease-in-out infinite; }
.lr-glow-b { width: 420px; height: 420px; background: rgba(255, 255, 255, .06); top: 20%; left: -140px; animation: lr-drift 22s ease-in-out infinite reverse; }
.lr-hero-inner { position: relative; z-index: 2; }
.lr-h1 { font-size: clamp(42px, 7.2vw, 92px); line-height: 1.02; letter-spacing: -.045em; font-weight: 500; margin: 0 0 30px; }
.lr-line { display: block; }
.lr-word { display: inline-block; opacity: 0; padding-bottom: .12em; margin-bottom: -.12em; animation: lr-word .95s cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both; }
.lr-word.brand-highlight { animation: lr-word .95s cubic-bezier(.2,.7,.2,1) var(--d, 0ms) both, lr-shine 7s linear infinite; }
.lr-sub-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; flex-wrap: wrap; margin-bottom: 36px; }
.lr-lead { font-size: clamp(16px, 1.55vw, 18px); color: var(--muted); max-width: 600px; margin: 0; }
.lr-tag-link { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; color: var(--muted); transition: color .2s ease; }
.lr-tag-link strong { color: var(--text); font-weight: 600; }
.lr-tag-link:hover { color: var(--text); }
.lr-hero-row { display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; margin-bottom: 64px; }
.lr-hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
.lr-tech { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.lr-tech-label { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); margin-right: 4px; }
.lr-chip { padding: 5px 12px; font-size: 12.5px; border: 1px solid var(--border); border-radius: 999px; color: var(--muted); background: rgba(255, 255, 255, .03); transition: color .2s ease, border-color .2s ease; }
.lr-chip:hover { color: var(--ice-2); border-color: rgba(85, 207, 255, .4); }

/* Dashboard preview */
.lr-preview-wrap { position: relative; z-index: 2; }
.lr-preview { position: relative; overflow: hidden; border: 1px solid rgba(255, 255, 255, .1); border-radius: 18px; background: var(--panel); box-shadow: 0 0 0 1px rgba(0, 0, 0, .5), 0 40px 90px -20px rgba(0, 0, 0, .75); text-align: left; }
.lr-preview-bar { display: flex; align-items: center; gap: 8px; padding: 13px 18px; border-bottom: 1px solid var(--border); }
.lr-dot { width: 10px; height: 10px; border-radius: 50%; background: #2a2c31; }
.lr-preview-title { margin-left: 10px; font-size: 12.5px; color: var(--muted); }
.lr-preview-body { display: grid; grid-template-columns: 250px 1fr; min-height: 470px; }
.lr-side { padding: 18px 14px; border-right: 1px solid var(--border); }
.lr-side-h { font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--dim); margin: 4px 8px 12px; }
.lr-agent-row { display: flex; align-items: center; gap: 11px; padding: 10px 11px; border: 1px solid var(--border); border-radius: 12px; background: rgba(255, 255, 255, .02); margin-bottom: 9px; animation: lr-row 8s ease-in-out infinite; animation-delay: var(--d, 0ms); }
.lr-agent-ico { width: 32px; height: 32px; border-radius: 9px; display: grid; place-items: center; background: rgba(85, 207, 255, .12); color: var(--ice-2); flex-shrink: 0; }
.lr-agent-row b { display: block; font-size: 13px; font-weight: 600; line-height: 1.3; }
.lr-agent-row span { font-size: 12px; color: var(--muted); }
.lr-main { padding: 26px 32px; }
.lr-query { display: flex; align-items: center; gap: 10px; padding: 13px 16px; border-radius: 12px; border: 1px solid var(--border-strong); background: rgba(0, 0, 0, .4); margin-bottom: 26px; max-width: 520px; }
.lr-query svg { color: var(--ice); flex-shrink: 0; }
.lr-typing { display: inline-block; overflow: hidden; white-space: nowrap; vertical-align: bottom; width: 0; border-right: 2px solid var(--ice); font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 13.5px; color: #dfe3ea; animation: lr-type 7s steps(34, end) infinite, lr-caret 1s step-end infinite; }
.lr-report-h { font-size: 12px; text-transform: uppercase; letter-spacing: .1em; color: var(--dim); margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
.lr-skel { height: 10px; border-radius: 6px; background: linear-gradient(90deg, rgba(255, 255, 255, .05), rgba(255, 255, 255, .12), rgba(255, 255, 255, .05)); background-size: 200% 100%; animation: lr-shimmer 2.6s linear infinite; margin-bottom: 11px; max-width: 560px; }
.lr-skel.h { height: 17px; width: 58%; margin-bottom: 18px; background-color: rgba(85, 207, 255, .25); }
.lr-skel.s1 { width: 100%; } .lr-skel.s2 { width: 92%; } .lr-skel.s3 { width: 78%; } .lr-skel.s4 { width: 96%; } .lr-skel.s5 { width: 58%; }
.lr-skel-gap { height: 16px; }
.lr-float { position: absolute; top: 96px; right: 28px; width: 280px; padding: 16px; border-radius: 14px; border: 1px solid var(--border-strong); background: rgba(19, 20, 23, .85); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: 0 24px 60px -20px rgba(0, 0, 0, .85); animation: lr-float 6s ease-in-out infinite; }
.lr-float-h { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; margin-bottom: 14px; }
.lr-float-h svg { color: var(--ice); }
.lr-prog { margin-bottom: 12px; }
.lr-prog:last-child { margin-bottom: 0; }
.lr-prog span { display: block; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
.lr-track { height: 4px; border-radius: 4px; background: rgba(255, 255, 255, .08); overflow: hidden; }
.lr-fill { height: 100%; width: 0; border-radius: 4px; background: linear-gradient(90deg, var(--ice), var(--ice-2)); animation: lr-fill 8s ease-in-out infinite; animation-delay: var(--d, 0ms); }

/* ---------- Section scaffolding ---------- */
.lr-section { padding: 110px 0; }
.lr-section-alt { background: linear-gradient(180deg, transparent, #0b0c0e 18%, #0b0c0e 82%, transparent); }
.lr-eyebrow { display: inline-block; font-size: 12.5px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--ice); margin-bottom: 16px; }
.lr-h2 { font-size: clamp(30px, 4.4vw, 52px); line-height: 1.08; letter-spacing: -.035em; font-weight: 500; margin: 0; }
.lr-sub { color: var(--muted); font-size: 17px; max-width: 460px; margin: 0; }
.lr-head { display: grid; grid-template-columns: 1.15fr .85fr; gap: 48px; align-items: end; margin-bottom: 60px; }
.lr-head .lr-sub { justify-self: end; }

/* ---------- Agent workflow ---------- */
.lr-flow { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
.lr-flow::before { content: ""; position: absolute; top: 56px; left: 12.5%; right: 12.5%; height: 2px; background: linear-gradient(90deg, rgba(85, 207, 255, .1), rgba(85, 207, 255, .5), rgba(85, 207, 255, .1)); z-index: 0; }
.lr-flow::after { content: ""; position: absolute; top: 52px; left: calc(12.5% - 28px); width: 56px; height: 10px; border-radius: 10px; background: radial-gradient(closest-side, var(--ice-2), transparent); z-index: 0; animation: lr-travel 6s linear infinite; }
.lr-agent { position: relative; z-index: 1; text-align: center; padding: 28px 22px; border-radius: 20px; border: 1px solid var(--border); background: linear-gradient(180deg, var(--panel-2), var(--panel)); overflow: hidden; transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease; }
.lr-agent::after, .lr-card::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s ease; background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(85, 207, 255, .16), transparent 70%); }
.lr-agent:hover, .lr-card:hover { transform: translateY(-5px); border-color: rgba(85, 207, 255, .4); }
.lr-agent:hover { box-shadow: 0 24px 60px -24px rgba(85, 207, 255, .45); }
.lr-agent:hover::after, .lr-card:hover::after { opacity: 1; }
.lr-agent-node { position: relative; width: 56px; height: 56px; margin: 0 auto 20px; border-radius: 16px; display: grid; place-items: center; background: var(--ice-grad); color: #04141c; box-shadow: 0 0 0 6px rgba(85, 207, 255, .08), 0 10px 30px -10px rgba(85, 207, 255, .4); animation: lr-node 6s ease-in-out infinite; animation-delay: var(--d, 0ms); }
.lr-agent-num { font-size: 12px; color: var(--dim); letter-spacing: .12em; margin-bottom: 6px; position: relative; z-index: 1; }
.lr-agent h3 { font-size: 18px; margin: 0 0 8px; font-weight: 600; position: relative; z-index: 1; }
.lr-agent p { margin: 0; font-size: 14.5px; color: var(--muted); position: relative; z-index: 1; }
.lr-flow-foot { margin-top: 30px; color: var(--dim); font-size: 14.5px; letter-spacing: .04em; }

/* ---------- Features ---------- */
.lr-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.lr-card { position: relative; padding: 30px; border-radius: 20px; border: 1px solid var(--border); background: linear-gradient(180deg, rgba(255, 255, 255, .04), rgba(255, 255, 255, .01)); overflow: hidden; transition: transform .35s ease, border-color .35s ease; }
.lr-card-ico { position: relative; z-index: 1; width: 46px; height: 46px; border-radius: 12px; display: grid; place-items: center; background: rgba(85, 207, 255, .1); color: var(--ice-2); border: 1px solid rgba(85, 207, 255, .25); margin-bottom: 20px; transition: transform .35s ease, background .35s ease; }
.lr-card:hover .lr-card-ico { transform: scale(1.08) rotate(-4deg); background: rgba(85, 207, 255, .18); }
.lr-card h3 { position: relative; z-index: 1; font-size: 18px; font-weight: 600; margin: 0 0 8px; }
.lr-card p { position: relative; z-index: 1; margin: 0; color: var(--muted); font-size: 15px; }

/* ---------- Steps ---------- */
.lr-steps { position: relative; display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; }
.lr-steps::before { content: ""; position: absolute; top: 23px; left: 23px; right: 0; height: 1px; background: linear-gradient(90deg, var(--ice), rgba(165, 232, 255, .5) 70%, transparent); transform: scaleX(0); transform-origin: left; transition: transform 1.6s cubic-bezier(.2,.7,.2,1) .2s; }
.lr-steps.lr-in::before { transform: scaleX(1); }
.lr-step { position: relative; padding-right: 8px; }
.lr-step-num { width: 46px; height: 46px; margin: 0 0 22px; border-radius: 50%; display: grid; place-items: center; font-weight: 600; font-size: 16px; background: var(--bg); border: 1px solid rgba(85, 207, 255, .6); color: var(--ice-3); box-shadow: 0 0 26px rgba(85, 207, 255, .28); position: relative; z-index: 1; transform: scale(.5); opacity: 0; transition: transform .6s cubic-bezier(.3,1.5,.5,1), opacity .5s ease; transition-delay: var(--d, 0ms); }
.lr-step.lr-in .lr-step-num { transform: scale(1); opacity: 1; }
.lr-step h3 { font-size: 18px; margin: 0 0 8px; font-weight: 600; }
.lr-step p { margin: 0; color: var(--muted); font-size: 15px; max-width: 260px; }

/* ---------- Why ---------- */
.lr-why { display: grid; grid-template-columns: 1fr 1.05fr; gap: 64px; align-items: center; }
.lr-why .lr-sub { margin-top: 20px; max-width: 480px; }
.lr-benefits { display: grid; gap: 12px; }
.lr-benefit { display: flex; align-items: center; gap: 14px; padding: 17px 20px; border-radius: 14px; border: 1px solid var(--border); background: rgba(255, 255, 255, .02); transition: border-color .3s ease, background .3s ease, transform .3s ease; }
.lr-benefit:hover { border-color: rgba(85, 207, 255, .4); background: rgba(85, 207, 255, .05); transform: translateX(6px); }
.lr-benefit-ico { width: 38px; height: 38px; border-radius: 10px; display: grid; place-items: center; background: rgba(85, 207, 255, .1); color: var(--ice-2); flex-shrink: 0; }
.lr-benefit span { font-size: 16px; font-weight: 500; }
.lr-benefit .lr-check { margin-left: auto; color: var(--ice); flex-shrink: 0; }

/* ---------- CTA ---------- */
.lr-cta { padding: 20px 0 110px; }
.lr-cta-box { position: relative; overflow: hidden; display: grid; grid-template-columns: 1fr auto; gap: 32px; align-items: center; padding: 64px clamp(28px, 5vw, 64px); border-radius: 28px; border: 1px solid var(--border-strong); background:
  radial-gradient(700px circle at 0% 0%, rgba(85, 207, 255, .2), transparent 60%),
  radial-gradient(600px circle at 100% 120%, rgba(224, 230, 242, .16), transparent 60%),
  var(--panel); }
.lr-cta-box h2 { font-size: clamp(28px, 4.2vw, 48px); letter-spacing: -.035em; line-height: 1.1; margin: 0 0 14px; font-weight: 500; max-width: 640px; }
.lr-cta-box p { color: #b4b7c0; font-size: 18px; margin: 0; max-width: 480px; }

/* ---------- Footer ---------- */
.lr-footer { border-top: 1px solid var(--border); padding: 60px 0 32px; background: var(--bg); }
.lr-foot-grid { display: grid; grid-template-columns: 1.6fr 1fr 1fr; gap: 40px; }
.lr-foot-desc { color: var(--muted); font-size: 14.5px; max-width: 360px; margin: 14px 0 10px; }
.lr-foot-tag { font-size: 13.5px; color: var(--ice-2); }
.lr-foot-col h4 { font-size: 13px; letter-spacing: .1em; text-transform: uppercase; color: var(--dim); margin: 0 0 14px; font-weight: 600; }
.lr-foot-col a { display: block; color: var(--muted); font-size: 14.5px; padding: 5px 0; transition: color .2s ease, transform .2s ease; }
.lr-foot-col a:hover { color: var(--text); transform: translateX(3px); }
.lr-copy { margin-top: 48px; padding-top: 22px; border-top: 1px solid var(--border); color: var(--dim); font-size: 13.5px; }

/* ---------- Keyframes ---------- */
@keyframes lr-shine { from { background-position: 0% 50%; } to { background-position: 200% 50%; } }
@keyframes lr-word { from { opacity: 0; transform: translateY(.55em); filter: blur(12px); } to { opacity: 1; transform: none; filter: blur(0); } }
@keyframes lr-nav-in { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: none; } }
@keyframes lr-drift { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(60px, 40px); } }
@keyframes lr-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
@keyframes lr-type { 0% { width: 0; } 50% { width: 34ch; } 90% { width: 34ch; } 100% { width: 0; } }
@keyframes lr-caret { 50% { border-right-color: transparent; } }
@keyframes lr-row { 0%, 25%, 100% { border-color: var(--border); background: rgba(255, 255, 255, .02); } 3%, 22% { border-color: rgba(85, 207, 255, .5); background: rgba(85, 207, 255, .08); } }
@keyframes lr-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes lr-fill { 0% { width: 0; } 20%, 96% { width: 100%; } 100% { width: 0; } }
@keyframes lr-travel { 0% { left: calc(12.5% - 28px); opacity: 0; } 3% { opacity: 1; } 70% { opacity: 1; } 75%, 100% { left: calc(87.5% - 28px); opacity: 0; } }
@keyframes lr-node { 0%, 28%, 100% { box-shadow: 0 0 0 6px rgba(85, 207, 255, .08), 0 10px 30px -10px rgba(85, 207, 255, .4); } 10% { box-shadow: 0 0 0 11px rgba(85, 207, 255, .2), 0 10px 44px -2px rgba(85, 207, 255, .95); } }

/* ---------- Responsive ---------- */
@media (max-width: 1060px) {
  .lr-float { display: none; }
  .lr-features { grid-template-columns: repeat(2, 1fr); }
  .lr-flow { grid-template-columns: repeat(2, 1fr); }
  .lr-flow::before, .lr-flow::after { display: none; }
  .lr-steps { grid-template-columns: repeat(2, 1fr); row-gap: 44px; }
  .lr-steps::before { display: none; }
  .lr-why { grid-template-columns: 1fr; gap: 40px; }
  .lr-head { grid-template-columns: 1fr; gap: 18px; }
  .lr-head .lr-sub { justify-self: start; }
}
@media (max-width: 860px) {
  .lr-nav-right { display: none; }
  .lr-icon-btn { display: inline-flex; }
  .lr-mobile-menu.open { display: block; }
  .lr-preview-body { grid-template-columns: 1fr; min-height: 0; }
  .lr-side { border-right: 0; border-bottom: 1px solid var(--border); }
  .lr-main { padding: 22px 20px; }
  .lr-cta-box { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .lr-hero-row { margin-bottom: 44px; }
  .lr-section { padding: 72px 0; }
  .lr-features, .lr-flow, .lr-steps { grid-template-columns: 1fr; }
  .lr-foot-grid { grid-template-columns: 1fr; gap: 28px; }
  .lr-hero-actions { width: 100%; }
  .lr-hero-actions .lr-btn { flex: 1; }
  .lr-cta-box { padding: 48px 22px; border-radius: 22px; }
}
@media (prefers-reduced-motion: reduce) {
  .lr-landing *, .lr-landing *::before, .lr-landing *::after { animation: none !important; transition: none !important; }
  .lr-reveal, .lr-tilt, .lr-word { opacity: 1; transform: none; filter: none; }
  .lr-steps::before { transform: scaleX(1); }
  .lr-step-num { opacity: 1; transform: none; }
  .lr-typing { width: 34ch; }
  .lr-fill { width: 100%; }
  html { scroll-behavior: auto; }
}
`;

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Scroll-in animations.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>(".lr-reveal, .lr-tilt"));
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("lr-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lr-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Navbar state + scroll progress line.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Smooth in-page scrolling; closes the mobile menu.
  const handleAnchor = (e: ReactMouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    e.preventDefault();
    setMenuOpen(false);
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="lr-landing" ref={rootRef}>
      <style>{CSS}</style>

      {/* ============ Navigation ============ */}
      <header className={`lr-nav${scrolled ? " scrolled" : ""}`}>
        <div className="lr-wrap lr-nav-inner">
          <a href="#home" className="lr-brand" onClick={(e) => handleAnchor(e, "#home")} aria-label="LightResearch home">
            <img src="/lightresearch-logo.png" alt="LightResearch logo" />
            <span>LightResearch</span>
          </a>

          <div className="lr-nav-right">
            <nav className="lr-nav-links" aria-label="Primary">
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="lr-nav-link" onClick={(e) => handleAnchor(e, l.href)}>
                  {l.label}
                </a>
              ))}
            </nav>
            <span className="lr-divider" aria-hidden="true" />
            <Link to="/login" className="lr-login">
              Log in
            </Link>
            <Link to="/signup" className="lr-signup">
              Sign up
            </Link>
          </div>

          <button
            type="button"
            className="lr-icon-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className={`lr-mobile-menu${menuOpen ? " open" : ""}`}>
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="lr-nav-link" onClick={(e) => handleAnchor(e, l.href)}>
              {l.label}
            </a>
          ))}
          <div className="lr-mobile-actions">
            <Link to="/login" className="lr-btn lr-btn-ghost" onClick={() => setMenuOpen(false)}>
              Log in
            </Link>
            <Link to="/signup" className="lr-btn lr-btn-primary" onClick={() => setMenuOpen(false)}>
              Sign up
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ============ Hero ============ */}
        <section id="home" className="lr-hero">
          <div className="lr-hero-bg" aria-hidden="true" />
          <div className="lr-glow lr-glow-a" aria-hidden="true" />
          <div className="lr-glow lr-glow-b" aria-hidden="true" />

          <div className="lr-wrap lr-hero-inner">
            <h1 className="lr-h1" aria-label="Your Research, Reimagined with AI.">
              <span className="lr-line" aria-hidden="true">
                {HERO_LINE_1.map((w, i) => (
                  <Fragment key={w}>
                    <span className="lr-word" style={d(150 + i * 90)}>
                      {w}
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
              <span className="lr-line" aria-hidden="true">
                {HERO_LINE_2.map((w, i) => (
                  <Fragment key={w}>
                    <span className="lr-word brand-highlight" style={d(340 + i * 90)}>
                      {w}
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
            </h1>

            <div className="lr-sub-row lr-reveal" style={d(500)}>
              <p className="lr-lead">
                Meet your intelligent multi-agent research assistant. Discover information, analyze sources, and
                generate comprehensive research reports — all in one place.
              </p>
              <a href="#agents" className="lr-tag-link" onClick={(e) => handleAnchor(e, "#agents")}>
                <strong>Research Smarter.</strong> Discover Deeper <ArrowRight size={16} className="lr-arrow" />
              </a>
            </div>

            <div className="lr-hero-row lr-reveal" style={d(620)}>
              <div className="lr-hero-actions">
                <Link to="/signup" className="lr-btn lr-btn-primary lr-btn-lg">
                  Get Started Free <ArrowRight size={18} className="lr-arrow" />
                </Link>
                <a href="#features" className="lr-btn lr-btn-ghost lr-btn-lg" onClick={(e) => handleAnchor(e, "#features")}>
                  Explore Features
                </a>
              </div>
              <div className="lr-tech">
                <span className="lr-tech-label">Built with</span>
                {TECH.map((t) => (
                  <span key={t} className="lr-chip">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Dashboard-style preview */}
          <div className="lr-wrap lr-hero-inner">
            <div
              className="lr-preview-wrap lr-tilt"
              style={d(700)}
              role="img"
              aria-label="Illustrative preview of AI agents collaborating on a research report"
            >
              <div className="lr-preview">
                <div className="lr-preview-bar">
                  <span className="lr-dot" />
                  <span className="lr-dot" />
                  <span className="lr-dot" />
                  <span className="lr-preview-title">LightResearch · Research session (illustrative)</span>
                </div>
                <div className="lr-preview-body">
                  <aside className="lr-side">
                    <div className="lr-side-h">Agents</div>
                    {AGENTS.map((a, i) => (
                      <div className="lr-agent-row" key={a.name} style={d(i * 2000)}>
                        <div className="lr-agent-ico">
                          <a.icon size={16} />
                        </div>
                        <div>
                          <b>{a.name}</b>
                          <span>{a.role}</span>
                        </div>
                      </div>
                    ))}
                  </aside>

                  <div className="lr-main">
                    <div className="lr-query">
                      <Search size={16} />
                      <span className="lr-typing">How is AI changing drug discovery?</span>
                    </div>
                    <div className="lr-report-h">
                      <FileText size={14} /> Research report
                    </div>
                    <div className="lr-skel h" />
                    <div className="lr-skel s1" />
                    <div className="lr-skel s2" />
                    <div className="lr-skel s3" />
                    <div className="lr-skel-gap" />
                    <div className="lr-skel h" style={{ width: "42%" }} />
                    <div className="lr-skel s4" />
                    <div className="lr-skel s2" />
                    <div className="lr-skel s5" />
                  </div>
                </div>

                <div className="lr-float">
                  <div className="lr-float-h">
                    <Sparkles size={15} /> Research session
                  </div>
                  {AGENTS.map((a, i) => (
                    <div className="lr-prog" key={a.name}>
                      <span>{a.role}</span>
                      <div className="lr-track">
                        <div className="lr-fill" style={d(i * 2000)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ Agent workflow ============ */}
        <section id="agents" className="lr-section lr-section-alt">
          <div className="lr-wrap">
            <div className="lr-head lr-reveal">
              <div>
                <span className="lr-eyebrow">Multi-Agent Architecture</span>
                <h2 className="lr-h2">
                  Four specialized agents. <span className="brand-highlight">One seamless workflow.</span>
                </h2>
              </div>
              <p className="lr-sub">
                Each agent focuses on what it does best, then hands its work to the next to deliver a reliable research report.
              </p>
            </div>

            <div className="lr-flow">
              {AGENTS.map((a, i) => (
                <div className="lr-agent lr-reveal" key={a.name} style={d(i * 110)} onMouseMove={spot}>
                  <div className="lr-agent-node" style={d(i * 1500)}>
                    <a.icon size={24} />
                  </div>
                  <div className="lr-agent-num">AGENT 0{i + 1}</div>
                  <h3>{a.name}</h3>
                  <p>{a.desc}</p>
                </div>
              ))}
            </div>
            <p className="lr-flow-foot lr-reveal">Search → Read → Write → Review</p>
          </div>
        </section>

        {/* ============ Features ============ */}
        <section id="features" className="lr-section">
          <div className="lr-wrap">
            <div className="lr-head lr-reveal">
              <div>
                <span className="lr-eyebrow">Features</span>
                <h2 className="lr-h2">
                  Everything you need to research <span className="brand-highlight">with confidence.</span>
                </h2>
              </div>
              <p className="lr-sub">From the first search to the final export, LightResearch handles the heavy lifting.</p>
            </div>

            <div className="lr-features">
              {FEATURES.map((f, i) => (
                <article className="lr-card lr-reveal" key={f.title} style={d((i % 3) * 110)} onMouseMove={spot}>
                  <div className="lr-card-ico">
                    <f.icon size={22} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ============ How it works ============ */}
        <section id="how-it-works" className="lr-section lr-section-alt">
          <div className="lr-wrap">
            <div className="lr-head lr-reveal">
              <div>
                <span className="lr-eyebrow">How It Works</span>
                <h2 className="lr-h2">
                  From a question to a finished report <span className="brand-highlight">in four steps.</span>
                </h2>
              </div>
              <p className="lr-sub">A simple process, powered by agents working together behind the scenes.</p>
            </div>

            <div className="lr-steps lr-reveal">
              {STEPS.map((s, i) => (
                <div className="lr-step lr-reveal" key={s.title} style={d(300 + i * 250)}>
                  <div className="lr-step-num" style={d(300 + i * 250)}>
                    {i + 1}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ Why LightResearch ============ */}
        <section id="about" className="lr-section">
          <div className="lr-wrap">
            <div className="lr-why">
              <div className="lr-reveal">
                <span className="lr-eyebrow">Why LightResearch</span>
                <h2 className="lr-h2">
                  Research that is faster, clearer, and <span className="brand-highlight">better organized.</span>
                </h2>
                <p className="lr-sub">
                  LightResearch is an AI-powered multi-agent research assistant built to automate the research process, so
                  you can spend less time searching and more time understanding.
                </p>
              </div>
              <div className="lr-benefits">
                {BENEFITS.map((b, i) => (
                  <div className="lr-benefit lr-reveal" key={b.text} style={d(i * 90)}>
                    <div className="lr-benefit-ico">
                      <b.icon size={19} />
                    </div>
                    <span>{b.text}</span>
                    <CheckCircle2 size={18} className="lr-check" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ Call to action ============ */}
        <section className="lr-cta">
          <div className="lr-wrap">
            <div className="lr-cta-box lr-reveal">
              <div>
                <h2>
                  Ready to Transform the Way You <span className="brand-highlight">Research?</span>
                </h2>
                <p>Start exploring smarter research with LightResearch.</p>
              </div>
              <Link to="/signup" className="lr-btn lr-btn-primary lr-btn-lg">
                Get Started Free <ArrowRight size={18} className="lr-arrow" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ============ Footer ============ */}
      <footer className="lr-footer">
        <div className="lr-wrap">
          <div className="lr-foot-grid">
            <div>
              <a href="#home" className="lr-brand" onClick={(e) => handleAnchor(e, "#home")}>
                <img src="/lightresearch-logo.png" alt="LightResearch logo" />
                <span>LightResearch</span>
              </a>
              <p className="lr-foot-desc">
                An AI-powered multi-agent research assistant that searches, analyzes, writes, and reviews research reports for you.
              </p>
              <span className="lr-foot-tag">Research Smarter. Discover Deeper.</span>
            </div>
            <div className="lr-foot-col">
              <h4>Navigate</h4>
              {NAV_LINKS.map((l) => (
                <a key={l.href} href={l.href} onClick={(e) => handleAnchor(e, l.href)}>
                  {l.label}
                </a>
              ))}
            </div>
            <div className="lr-foot-col">
              <h4>Account</h4>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign up</Link>
            </div>
          </div>
          <div className="lr-copy">© 2026 LightResearch.</div>
        </div>
      </footer>
    </div>
  );
}