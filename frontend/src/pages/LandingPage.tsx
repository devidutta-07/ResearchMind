import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent as ReactMouseEvent } from "react";
import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Layers,
  ListChecks,
  Menu,
  Network,
  PenTool,
  Search,
  ShieldCheck,
  Sparkles,
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

// Feature images live in the /public folder (f1, f2, f3, f4, f5).
// If your files use a different extension (.jpg, .webp ...), change it here.
const FEATURES = [
  {
    img: "/f1.png",
    tag: "Research",
    title: "Intelligent Web Research",
    desc: "Search the web for relevant, recent information on any topic you want to explore.",
    points: ["Live web search", "Recent sources"],
  },
  {
    img: "/f2.png",
    tag: "Agents",
    title: "Multi-Agent Collaboration",
    desc: "Specialized agents work together, each handling a focused part of the research process.",
    points: ["4 specialized agents", "Seamless handoffs"],
  },
  {
    img: "/f3.png",
    tag: "Writing",
    title: "AI-Powered Report Generation",
    desc: "Turn collected information into well-structured, detailed research reports.",
    points: ["Structured output", "Detailed reports"],
  },
  {
    img: "/f4.png",
    tag: "Review",
    title: "Critical Review and Refinement",
    desc: "A dedicated critic reviews each report and helps improve it before you read it.",
    points: ["Quality review", "Automatic refinement"],
  },
  {
    img: "/f5.png",
    tag: "Export",
    title: "Exportable Research Reports",
    desc: "Export your finished reports so you can keep, share, and build on your work.",
    points: ["Keep & share", "Build on your work"],
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
  {
    icon: Clock,
    text: "Save hours of manual research.",
    desc: "Agents handle the searching, reading and drafting so your time goes into understanding.",
  },
  {
    icon: Layers,
    text: "Organize information efficiently.",
    desc: "Findings are gathered and arranged in one place.",
  },
  {
    icon: ListChecks,
    text: "Get structured research reports.",
    desc: "Clear sections and detailed write-ups, ready to read.",
  },
  {
    icon: Network,
    text: "Use multiple specialized AI agents.",
    desc: "Search, read, write and review, each handled by a focused agent.",
  },
  {
    icon: Sparkles,
    text: "Simplify complex research tasks.",
    desc: "Big questions broken into simple, guided steps.",
  },
];

const TECH = ["LangChain", "LangGraph", "Tavily", "Gemini", "Mistral AI", "Hugging Face"];

const HERO_LINE_1 = ["Your", "Research,"];
const HERO_LINE_2 = ["Reimagined", "with", "AI."];

// Sets the --d (delay) custom property used by the animations.
const d = (ms: number): CSSProperties => ({ "--d": `${ms}ms` } as CSSProperties);

// Sets several custom properties at once.
const v = (vars: Record<string, string>): CSSProperties => vars as unknown as CSSProperties;

// Cursor-follow spotlight for cards.
const spot = (e: ReactMouseEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

// Brand name: "Research" gets the icy gradient highlight.
const Brand = () => (
  <>
    Light<span className="brand-highlight">Research</span>
  </>
);

// Small animated illustration shown at the top of each "How it works" card.
function StepVisual({ i }: { i: number }) {
  if (i === 0) {
    return (
      <>
        <div className="lr-v1">
          <Search size={14} />
          <span className="lr-v1-type">AI in drug discovery</span>
        </div>
        <div className="lr-v1-chips">
          {["Web", "News", "Papers"].map((c, j) => (
            <span key={c} style={{ animationDelay: `${j * 0.25}s` }}>
              {c}
            </span>
          ))}
        </div>
      </>
    );
  }
  if (i === 1) {
    const pts = [
      [34, 30],
      [50, 86],
      [206, 26],
      [192, 88],
    ];
    return (
      <svg className="lr-v2" viewBox="0 0 240 110" aria-hidden="true">
        {pts.map(([x, y], j) => (
          <Fragment key={j}>
            <path className="lr-v2-l" d={`M${x} ${y} L120 55`} />
            <path
              className="lr-v2-f"
              d={`M${x} ${y} L120 55`}
              pathLength={1}
              style={{ animationDelay: `${j * 0.55}s` }}
            />
            <circle className="lr-v2-n" cx={x} cy={y} r="5" style={{ animationDelay: `${j * 0.55}s` }} />
          </Fragment>
        ))}
        <circle className="lr-v2-ring" cx="120" cy="55" r="11" />
        <circle className="lr-v2-c" cx="120" cy="55" r="11" />
        <circle cx="120" cy="55" r="3" fill="#a5e8ff" />
      </svg>
    );
  }
  if (i === 2) {
    return (
      <div className="lr-v3">
        <div className="lr-v3-ttl" />
        {[100, 88, 94, 62].map((w, j) => (
          <div key={j} className="lr-v3-ln" style={{ width: `${w}%`, animationDelay: `${(j + 1) * 0.4}s` }} />
        ))}
        <span className="lr-v3-scan" />
        <span className="lr-v3-badge">
          <CheckCircle2 size={14} />
        </span>
      </div>
    );
  }
  return (
    <div className="lr-v4">
      <div className="lr-v4-doc">
        <span className="lr-v4-l t" />
        {[100, 86, 94, 58].map((w, j) => (
          <span key={j} className="lr-v4-l" style={{ width: `${w}%` }} />
        ))}
        <span className="lr-v4-seal">
          <CheckCircle2 size={13} />
        </span>
      </div>
      <div className="lr-v4-side">
        <span className="lr-v4-pill">
          <CheckCircle2 size={12} /> Report ready
        </span>
        <span className="lr-v4-btn">
          <Download size={13} /> Export
        </span>
      </div>
    </div>
  );
}

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

/* ---------- Agent workflow (figures) ---------- */
.lr-lead-big { font-size: clamp(28px, 3.9vw, 52px); line-height: 1.12; letter-spacing: -.035em; font-weight: 500; margin: 0; max-width: 1180px; color: var(--text); }
.lr-dimtxt { color: #7d808b; }
.lr-figs { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 84px; }
.lr-fig { position: relative; padding: 0 clamp(18px, 2.2vw, 36px); border-left: 1px solid var(--border); }
.lr-fig:first-child { padding-left: 0; border-left: 0; }
.lr-fig:last-child { padding-right: 0; }
.lr-fig-label { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 11.5px; letter-spacing: .14em; color: var(--dim); }
.lr-fig-art { position: relative; height: 230px; display: grid; place-items: center; margin: 12px 0 30px; }
.lr-fig-art svg { width: 100%; max-width: 280px; height: auto; overflow: visible; transition: transform .5s cubic-bezier(.2,.7,.2,1); }
.lr-fig:hover .lr-fig-art svg { transform: translateY(-4px); }
.lr-fig h3 { font-size: 16px; font-weight: 500; margin: 0 0 10px; color: var(--text); }
.lr-fig p { margin: 0; color: var(--muted); font-size: 15px; line-height: 1.55; max-width: 260px; }
.lr-fig-link { position: absolute; left: -11px; top: 140px; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; border: 1px solid var(--border-strong); background: var(--bg); color: var(--ice-2); z-index: 2; }

/* shared shape styling */
.lr-fig svg .lr-s { stroke: rgba(255, 255, 255, .26); stroke-width: 1; stroke-linejoin: round; transition: stroke .35s ease; }
.lr-fig svg .lr-top { fill: #111215; }
.lr-fig svg .lr-lf { fill: #0a0b0d; }
.lr-fig svg .lr-rt { fill: #0d0e11; }
.lr-fig:hover svg .lr-s { stroke: rgba(255, 255, 255, .45); }
.lr-fig svg .lr-ln { fill: none; stroke: rgba(255, 255, 255, .3); stroke-width: 1.4; stroke-linecap: round; }
.lr-fig svg .lr-ice-ln { stroke: rgba(165, 232, 255, .95); }
.lr-fig svg .lr-ttl { stroke: rgba(255, 255, 255, .75); stroke-width: 3; }
.lr-fig svg .lr-dash { stroke-dasharray: 1; stroke-dashoffset: 0; stroke-linecap: butt; }

/* AGENT 1 - a beam sweeps the sources; the matches lift out of the grid */
.lr-fig svg .lr-beam { fill: rgba(165, 232, 255, .2); stroke: rgba(165, 232, 255, .85); stroke-width: 1; animation: lr-sweep 6s linear infinite backwards; }
.lr-hit { animation: lr-pop 6s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }
.lr-hit .lr-s { animation: lr-hitc 6s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }

/* AGENT 2 - lines are picked out of the page and copied onto note cards */
.lr-ext { animation: lr-extline 8s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }
.lr-fly { opacity: 0; animation: lr-chipfly 8s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }
.lr-note .lr-s { animation: lr-notec 8s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }

/* AGENT 3 - the report is written line by line, then the chart grows */
.lr-w { animation: lr-write 9s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }
.lr-grow { transform-box: fill-box; transform-origin: 50% 100%; animation: lr-grow 9s ease-in-out infinite backwards; animation-delay: var(--d, 0ms); }
.lr-pen { animation: lr-pen 9s linear infinite backwards; }
.lr-fig svg .lr-pentile { fill: rgba(165, 232, 255, .9); stroke: none; }
.lr-fig svg .lr-penline { stroke: rgba(165, 232, 255, .95); stroke-width: 1.4; stroke-linecap: round; }

/* AGENT 4 - a lens reviews each line, flags one, replaces it, then approves */
.lr-lens { animation: lr-lens 9s ease-in-out infinite backwards; }
.lr-lens ellipse { fill: rgba(85, 207, 255, .06); stroke: rgba(165, 232, 255, .9); stroke-width: 1.3; }
.lr-fig svg .lr-flag { stroke: rgba(165, 232, 255, .9); stroke-dasharray: 4 3; opacity: 0; animation: lr-flag 9s ease-in-out infinite backwards; }
.lr-fig svg .lr-oldln { stroke-dasharray: 9 3 5 3 12 3 7 3; animation: lr-oldln 9s ease-in-out infinite backwards; }
.lr-fig svg .lr-newln { animation: lr-newln 9s ease-in-out infinite backwards; }
.lr-seal { transform-box: fill-box; transform-origin: 50% 100%; animation: lr-seal 9s ease-in-out infinite backwards; }
.lr-seal circle { fill: #0b0c0e; stroke: rgba(165, 232, 255, .95); stroke-width: 1.4; }
.lr-seal path, .lr-seal line { fill: none; stroke: rgba(165, 232, 255, .95); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }

/* ---------- Features: stacking cards ---------- */
.lr-stack { display: flex; flex-direction: column; gap: 40px; padding-bottom: 60px; }
.lr-stack-card {
  --scale: 1; --shade: 0;
  position: sticky;
  top: calc(104px + var(--i) * 16px);
  display: grid; grid-template-columns: 1.05fr 1fr; align-items: stretch;
  min-height: 340px; overflow: hidden;
  border-radius: 24px; border: 1px solid var(--border-strong);
  background: var(--card-bg, #0f1013);
  box-shadow: 0 -18px 50px -24px rgba(0, 0, 0, .85), 0 30px 60px -30px rgba(0, 0, 0, .95);
  transform: scale(var(--scale)); transform-origin: 50% 0;
  will-change: transform;
}
/* darkens a card as the next one covers it */
.lr-stack-card::before {
  content: ""; position: absolute; inset: 0; z-index: 4; pointer-events: none;
  background: #08090a; opacity: var(--shade);
}
/* cursor spotlight */
.lr-stack-card::after {
  content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; transition: opacity .35s ease;
  background: radial-gradient(320px circle at var(--mx, 50%) var(--my, 0%), rgba(85, 207, 255, .1), transparent 70%);
}
.lr-stack-card:hover::after { opacity: 1; }

.lr-stack-body { position: relative; z-index: 2; display: flex; flex-direction: column; padding: 34px 38px 30px; }
.lr-stack-tag {
  align-self: flex-start; padding: 5px 12px; border-radius: 999px;
  font-size: 11px; font-weight: 600; letter-spacing: .12em; text-transform: uppercase;
  color: var(--muted); background: rgba(255, 255, 255, .06); border: 1px solid var(--border);
}
.lr-stack-body h3 { font-size: clamp(24px, 2.6vw, 34px); font-weight: 500; letter-spacing: -.03em; line-height: 1.12; margin: 26px 0 12px; }
.lr-stack-body p { margin: 0; color: var(--muted); font-size: 16px; max-width: 460px; }
.lr-stack-meta { margin-top: auto; padding-top: 26px; display: flex; align-items: flex-end; gap: 28px; border-top: 1px solid var(--border); }
.lr-stack-body > p + .lr-stack-meta { margin-top: 32px; }
.lr-stack-num { font-size: 34px; font-weight: 400; letter-spacing: -.03em; color: var(--text); line-height: 1; }
.lr-stack-points { display: flex; flex-wrap: wrap; gap: 8px 18px; }
.lr-stack-points span { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--muted); }
.lr-stack-points svg { color: var(--ice); }

/* image visual panel */
.lr-stack-art {
  position: relative; overflow: hidden; min-height: 240px;
  background: transparent;
}
.lr-stack-img {
  position: absolute; inset: 0; z-index: 1;
  width: 100%; height: 100%; display: block;
  object-fit: cover; object-position: center;
  transition: transform .8s cubic-bezier(.2,.7,.2,1);
  /* fade the image's left edge into the card so there is no visible seam */
  -webkit-mask-image: linear-gradient(90deg, transparent 0%, #000 45%);
  mask-image: linear-gradient(90deg, transparent 0%, #000 45%);
}
.lr-stack-card:hover .lr-stack-img { transform: scale(1.04); }

/* ---------- How it works ---------- */
.lr-hw { position: relative; }
.lr-hw-track { position: absolute; top: 22px; left: 23px; right: 23px; height: 2px; border-radius: 2px; background: rgba(255, 255, 255, .07); overflow: hidden; z-index: 0; }
.lr-hw-progress { position: absolute; inset: 0; background: linear-gradient(90deg, var(--ice), var(--ice-2) 70%, rgba(165, 232, 255, .45)); box-shadow: 0 0 14px rgba(85, 207, 255, .7); transform: scaleX(0); transform-origin: left; transition: transform 2.4s cubic-bezier(.2,.7,.2,1) .3s; }
.lr-hw.lr-in .lr-hw-progress { transform: scaleX(1); }
.lr-hw-pulse { position: absolute; top: -2px; left: -90px; width: 90px; height: 6px; border-radius: 6px; background: linear-gradient(90deg, transparent, rgba(224, 247, 255, .95), transparent); opacity: 0; animation: lr-hwpulse 4.8s ease-in-out 2.8s infinite; }
.lr-hw-grid { position: relative; z-index: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.lr-hw-item { display: flex; flex-direction: column; }
.lr-hw-node { position: relative; width: 46px; height: 46px; margin-bottom: 22px; border-radius: 50%; display: grid; place-items: center; font-weight: 600; font-size: 16px; background: var(--bg); border: 1px solid rgba(85, 207, 255, .6); color: var(--ice-3); box-shadow: 0 0 26px rgba(85, 207, 255, .28); transform: scale(.5); opacity: 0; transition: transform .6s cubic-bezier(.3,1.5,.5,1), opacity .5s ease; transition-delay: var(--d, 0ms); animation: lr-hwnode 14s ease-in-out infinite; animation-delay: calc(var(--k, 0) * 3.5s + 2.8s); }
.lr-hw-item.lr-in .lr-hw-node { transform: scale(1); opacity: 1; }

.lr-hw-card { position: relative; flex: 1; display: flex; flex-direction: column; overflow: hidden; border-radius: 20px; border: 1px solid var(--border); background: linear-gradient(180deg, #121317 0%, #0d0e11 100%); box-shadow: 0 30px 60px -36px rgba(0, 0, 0, .9); transition: transform .4s cubic-bezier(.2,.7,.2,1); animation: lr-hwcard 14s ease-in-out infinite; animation-delay: calc(var(--k, 0) * 3.5s + 2.8s); }
.lr-hw-card:hover { transform: translateY(-6px); }
.lr-hw-card::after { content: ""; position: absolute; inset: 0; z-index: 3; pointer-events: none; opacity: 0; transition: opacity .35s ease; background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(85, 207, 255, .12), transparent 70%); }
.lr-hw-card:hover::after { opacity: 1; }
.lr-hw-vis { position: relative; height: 150px; padding: 0 22px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-bottom: 1px solid var(--border); background: radial-gradient(75% 95% at 50% 0%, rgba(85, 207, 255, .14), transparent 72%), linear-gradient(rgba(255, 255, 255, .03) 1px, transparent 1px) 0 0 / 100% 24px; }
.lr-hw-body { padding: 22px 22px 26px; }
.lr-hw-step { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: var(--ice); }
.lr-hw-card h3 { font-size: 18px; font-weight: 600; margin: 8px 0 8px; letter-spacing: -.01em; }
.lr-hw-card p { margin: 0; color: var(--muted); font-size: 15px; }

/* step 1 - typing a topic, sources appear */
.lr-v1 { display: flex; align-items: center; gap: 9px; width: 100%; max-width: 230px; padding: 10px 12px; border-radius: 11px; border: 1px solid var(--border-strong); background: rgba(0, 0, 0, .4); }
.lr-v1 svg { color: var(--ice); flex-shrink: 0; }
.lr-v1-type { display: inline-block; overflow: hidden; white-space: nowrap; width: 0; border-right: 2px solid var(--ice); font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 12px; color: #dfe3ea; animation: lr-v1type 6s steps(20, end) infinite, lr-caret 1s step-end infinite; }
.lr-v1-chips { display: flex; gap: 6px; margin-top: 12px; }
.lr-v1-chips span { padding: 3px 10px; font-size: 10.5px; border-radius: 999px; border: 1px solid rgba(85, 207, 255, .35); color: var(--ice-2); background: rgba(85, 207, 255, .07); opacity: 0; animation: lr-v1chip 6s ease-in-out infinite backwards; }

/* step 2 - agents feed information to the center */
.lr-v2 { width: 100%; max-width: 240px; height: auto; overflow: visible; }
.lr-v2 .lr-v2-l { fill: none; stroke: rgba(255, 255, 255, .14); stroke-width: 1; }
.lr-v2 .lr-v2-f { fill: none; stroke: rgba(165, 232, 255, .95); stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: .22 1.2; stroke-dashoffset: .22; animation: lr-v2flow 3.2s linear infinite backwards; }
.lr-v2 .lr-v2-n { fill: #0b0c0e; stroke: rgba(255, 255, 255, .3); stroke-width: 1.2; animation: lr-v2node 3.2s ease-in-out infinite backwards; }
.lr-v2 .lr-v2-c { fill: rgba(85, 207, 255, .18); stroke: rgba(165, 232, 255, .95); stroke-width: 1.4; }
.lr-v2 .lr-v2-ring { fill: none; stroke: rgba(165, 232, 255, .55); stroke-width: 1; transform-box: fill-box; transform-origin: 50% 50%; animation: lr-v2ring 3.2s ease-out infinite; }

/* step 3 - the report is written, scanned, approved */
.lr-v3 { position: relative; width: 100%; max-width: 210px; padding: 15px 14px 9px; border-radius: 12px; border: 1px solid var(--border-strong); background: rgba(0, 0, 0, .35); }
.lr-v3-ttl { width: 55%; height: 7px; border-radius: 4px; margin-bottom: 12px; background: rgba(165, 232, 255, .6); transform-origin: left; animation: lr-v3w 7s ease-in-out infinite backwards; }
.lr-v3-ln { height: 5px; border-radius: 4px; margin-bottom: 9px; background: rgba(255, 255, 255, .18); transform-origin: left; animation: lr-v3w 7s ease-in-out infinite backwards; }
.lr-v3-scan { position: absolute; left: 8px; right: 8px; top: 10%; height: 2px; border-radius: 2px; background: linear-gradient(90deg, transparent, rgba(165, 232, 255, .95), transparent); box-shadow: 0 0 10px rgba(85, 207, 255, .8); opacity: 0; animation: lr-v3scan 7s ease-in-out infinite; }
.lr-v3-badge { position: absolute; right: -9px; bottom: -9px; width: 26px; height: 26px; border-radius: 50%; display: grid; place-items: center; background: #0b0c0e; border: 1px solid rgba(165, 232, 255, .9); color: var(--ice-2); transform: scale(0); opacity: 0; animation: lr-v3badge 7s ease-in-out infinite; }

/* step 4 - finished report, ready to export */
.lr-v4 { display: flex; align-items: center; gap: 18px; }
.lr-v4-doc { position: relative; width: 84px; height: 106px; padding: 14px 11px; border-radius: 10px; border: 1px solid var(--border-strong); background: linear-gradient(180deg, #181a20, #0d0e11); box-shadow: 0 16px 36px -16px rgba(85, 207, 255, .45); animation: lr-v4float 5s ease-in-out infinite; }
.lr-v4-l { display: block; height: 4px; border-radius: 3px; margin-bottom: 8px; background: rgba(255, 255, 255, .2); }
.lr-v4-l.t { width: 55%; height: 6px; background: rgba(165, 232, 255, .65); margin-bottom: 11px; }
.lr-v4-seal { position: absolute; top: -9px; right: -9px; width: 24px; height: 24px; border-radius: 50%; display: grid; place-items: center; background: #0b0c0e; border: 1px solid rgba(165, 232, 255, .9); color: var(--ice-2); }
.lr-v4-side { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.lr-v4-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; font-size: 11px; border-radius: 999px; color: var(--ice-2); border: 1px solid rgba(85, 207, 255, .35); background: rgba(85, 207, 255, .08); }
.lr-v4-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; font-size: 12px; font-weight: 600; border-radius: 999px; background: #f4f5f8; color: #0a0b0d; animation: lr-v4btn 3.2s ease-out infinite; }

/* ---------- About ---------- */
.lr-about { display: grid; grid-template-columns: .95fr 1.05fr; gap: 64px; align-items: center; }
.lr-about .lr-sub { margin-top: 20px; max-width: 500px; }
.lr-flow { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-top: 28px; }
.lr-flow-chip { display: inline-flex; align-items: center; gap: 7px; padding: 7px 13px; font-size: 13px; border-radius: 999px; border: 1px solid var(--border-strong); background: rgba(255, 255, 255, .03); color: var(--text); animation: lr-flowchip 8s ease-in-out infinite; animation-delay: calc(var(--k, 0) * 2s); }
.lr-flow-chip svg { color: var(--ice); }
.lr-flow-arrow { color: var(--dim); }
.lr-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 32px; max-width: 520px; }
.lr-stat { padding: 18px 18px 16px; border-radius: 16px; border: 1px solid var(--border); background: rgba(255, 255, 255, .02); }
.lr-stat b { display: block; font-size: 38px; font-weight: 500; letter-spacing: -.03em; line-height: 1; background: var(--ice-grad); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }
.lr-stat span { display: block; margin-top: 9px; font-size: 13px; line-height: 1.4; color: var(--muted); }
.lr-bento { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.lr-bento-item:first-child { grid-column: 1 / -1; }
.lr-bento-item { display: flex; }
.lr-bento-card { position: relative; flex: 1; overflow: hidden; padding: 22px; border-radius: 20px; border: 1px solid var(--border); background: linear-gradient(180deg, #121317 0%, #0d0e11 100%); transition: transform .35s cubic-bezier(.2,.7,.2,1), border-color .35s ease; }
.lr-bento-card::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .35s ease; background: radial-gradient(280px circle at var(--mx, 50%) var(--my, 0%), rgba(85, 207, 255, .12), transparent 70%); }
.lr-bento-card:hover { transform: translateY(-4px); border-color: rgba(85, 207, 255, .4); }
.lr-bento-card:hover::after { opacity: 1; }
.lr-bento-item:first-child .lr-bento-card { display: flex; align-items: center; gap: 20px; padding: 28px; border-color: rgba(85, 207, 255, .28); background: radial-gradient(460px circle at 0% 0%, rgba(85, 207, 255, .18), transparent 60%), linear-gradient(180deg, #121317 0%, #0d0e11 100%); }
.lr-bento-ico { width: 44px; height: 44px; margin-bottom: 16px; border-radius: 12px; display: grid; place-items: center; flex-shrink: 0; color: var(--ice-2); background: rgba(85, 207, 255, .1); border: 1px solid rgba(85, 207, 255, .22); transition: transform .4s cubic-bezier(.3,1.5,.5,1); }
.lr-bento-item:first-child .lr-bento-ico { width: 58px; height: 58px; margin-bottom: 0; border-radius: 16px; }
.lr-bento-card:hover .lr-bento-ico { transform: scale(1.1) rotate(-5deg); }
.lr-bento-num { position: absolute; top: 16px; right: 18px; font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 11.5px; letter-spacing: .12em; color: var(--dim); }
.lr-bento-card h3 { font-size: 16.5px; font-weight: 600; letter-spacing: -.01em; line-height: 1.3; margin: 0 0 6px; }
.lr-bento-card p { margin: 0; color: var(--muted); font-size: 14.5px; line-height: 1.55; }

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

@keyframes lr-sweep { 0% { transform: translate(0, 0); opacity: 0; } 5% { opacity: 1; } 70% { transform: translate(var(--sx), var(--sy)); opacity: 1; } 76%, 100% { transform: translate(var(--sx), var(--sy)); opacity: 0; } }
@keyframes lr-pop { 0%, 100% { transform: translateY(0); } 5%, 42% { transform: translateY(-12px); } 52% { transform: translateY(0); } }
@keyframes lr-hitc { 0%, 52%, 100% { stroke: rgba(255, 255, 255, .26); } 5%, 42% { stroke: rgba(165, 232, 255, .95); } }
@keyframes lr-extline { 0%, 16%, 100% { stroke: rgba(255, 255, 255, .3); stroke-width: 1.4; } 3%, 12% { stroke: rgba(165, 232, 255, 1); stroke-width: 2.4; } }
@keyframes lr-chipfly { 0% { opacity: 0; transform: translate(0, 0); } 3% { opacity: 1; transform: translate(0, 0); } 12% { opacity: 1; transform: translate(0, -9px); } 40% { opacity: 1; transform: translate(calc(var(--tx) * .55), calc(var(--ty) * .55 - 28px)); } 56% { opacity: 1; transform: translate(var(--tx), var(--ty)); } 62%, 100% { opacity: 0; transform: translate(var(--tx), var(--ty)); } }
@keyframes lr-notec { 0%, 54%, 100% { stroke: rgba(255, 255, 255, .26); } 60%, 92% { stroke: rgba(165, 232, 255, .95); } }
@keyframes lr-write { 0% { stroke-dashoffset: 1; } 6%, 88% { stroke-dashoffset: 0; } 96%, 100% { stroke-dashoffset: 1; } }
@keyframes lr-grow { 0% { transform: scaleY(0); } 6%, 88% { transform: scaleY(1); } 96%, 100% { transform: scaleY(0); } }
@keyframes lr-pen { 0% { opacity: 0; transform: translate(0, 0); } 2% { opacity: 1; } 52% { opacity: 1; transform: translate(var(--sx), var(--sy)); } 58%, 100% { opacity: 0; transform: translate(var(--sx), var(--sy)); } }
@keyframes lr-lens { 0% { opacity: 0; transform: translate(0, 0); } 4%, 10% { opacity: 1; transform: translate(0, 0); } 22%, 28% { transform: translate(calc(var(--sx) * .25), calc(var(--sy) * .25)); } 40%, 60% { transform: translate(calc(var(--sx) * .5), calc(var(--sy) * .5)); } 72%, 78% { transform: translate(calc(var(--sx) * .75), calc(var(--sy) * .75)); } 88%, 92% { opacity: 1; transform: translate(var(--sx), var(--sy)); } 98%, 100% { opacity: 0; transform: translate(var(--sx), var(--sy)); } }
@keyframes lr-flag { 0%, 40% { opacity: 0; } 44%, 56% { opacity: 1; } 60%, 100% { opacity: 0; } }
@keyframes lr-oldln { 0%, 48% { opacity: 1; } 56%, 90% { opacity: .1; } 98%, 100% { opacity: 1; } }
@keyframes lr-newln { 0%, 50% { stroke-dashoffset: 1; } 58%, 90% { stroke-dashoffset: 0; } 96%, 100% { stroke-dashoffset: 1; } }
@keyframes lr-seal { 0%, 60% { transform: scale(0); opacity: 0; } 66% { transform: scale(1.15); opacity: 1; } 70%, 90% { transform: scale(1); opacity: 1; } 96%, 100% { transform: scale(0); opacity: 0; } }

/* how it works */
@keyframes lr-hwpulse { 0% { left: -90px; opacity: 0; } 8% { opacity: 1; } 92% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
@keyframes lr-hwcard { 0%, 28%, 100% { border-color: var(--border); box-shadow: 0 30px 60px -36px rgba(0, 0, 0, .9); } 3%, 22% { border-color: rgba(85, 207, 255, .45); box-shadow: 0 24px 56px -26px rgba(85, 207, 255, .5); } }
@keyframes lr-hwnode { 0%, 28%, 100% { border-color: rgba(85, 207, 255, .6); box-shadow: 0 0 26px rgba(85, 207, 255, .28); } 3%, 22% { border-color: #a5e8ff; box-shadow: 0 0 0 6px rgba(85, 207, 255, .12), 0 0 38px rgba(85, 207, 255, .75); } }
@keyframes lr-v1type { 0% { width: 0; } 45% { width: 20ch; } 90% { width: 20ch; } 100% { width: 0; } }
@keyframes lr-v1chip { 0%, 40% { opacity: 0; transform: translateY(6px); } 52%, 88% { opacity: 1; transform: none; } 96%, 100% { opacity: 0; transform: translateY(6px); } }
@keyframes lr-v2flow { from { stroke-dashoffset: .22; } to { stroke-dashoffset: -1; } }
@keyframes lr-v2node { 0%, 28%, 100% { stroke: rgba(255, 255, 255, .3); fill: #0b0c0e; } 6%, 22% { stroke: rgba(165, 232, 255, .95); fill: rgba(85, 207, 255, .3); } }
@keyframes lr-v2ring { 0%, 65% { opacity: 0; transform: scale(1); } 72% { opacity: .9; } 100% { opacity: 0; transform: scale(2.4); } }
@keyframes lr-v3w { 0% { transform: scaleX(0); } 12%, 82% { transform: scaleX(1); } 92%, 100% { transform: scaleX(0); } }
@keyframes lr-v3scan { 0%, 34% { top: 10%; opacity: 0; } 38% { opacity: 1; } 54% { top: 88%; opacity: 1; } 58%, 100% { top: 88%; opacity: 0; } }
@keyframes lr-v3badge { 0%, 56% { transform: scale(0); opacity: 0; } 63% { transform: scale(1.2); opacity: 1; } 69%, 84% { transform: scale(1); opacity: 1; } 92%, 100% { transform: scale(0); opacity: 0; } }
@keyframes lr-v4float { 0%, 100% { transform: translateY(0) rotate(-1.5deg); } 50% { transform: translateY(-7px) rotate(1.5deg); } }
@keyframes lr-v4btn { 0% { box-shadow: 0 0 0 0 rgba(165, 232, 255, .6); } 70%, 100% { box-shadow: 0 0 0 12px rgba(165, 232, 255, 0); } }
/* about */
@keyframes lr-flowchip { 0%, 28%, 100% { border-color: var(--border-strong); background: rgba(255, 255, 255, .03); color: var(--text); } 4%, 22% { border-color: rgba(85, 207, 255, .55); background: rgba(85, 207, 255, .1); color: var(--ice-3); } }

/* ---------- Responsive ---------- */
@media (max-width: 1060px) {
  .lr-float { display: none; }
  .lr-figs { grid-template-columns: repeat(2, 1fr); row-gap: 64px; }
  .lr-fig:nth-child(odd) { border-left: 0; padding-left: 0; }
  .lr-fig:nth-child(even) { padding-right: 0; }
  .lr-fig:nth-child(odd) .lr-fig-link { display: none; }
  .lr-hw-grid { grid-template-columns: repeat(2, 1fr); row-gap: 40px; }
  .lr-hw-track { display: none; }
  .lr-about { grid-template-columns: 1fr; gap: 40px; }
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
  .lr-stack-card { grid-template-columns: 1fr; min-height: 0; top: calc(92px + var(--i) * 12px); }
  .lr-stack-art { order: -1; min-height: 190px; }
  .lr-stack-img {
    -webkit-mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 55%, transparent 100%);
  }
  .lr-stack-body { padding: 26px 24px 24px; }
}
@media (max-width: 600px) {
  .lr-hero-row { margin-bottom: 44px; }
  .lr-section { padding: 72px 0; }
  .lr-hw-grid { grid-template-columns: 1fr; }
  .lr-bento { grid-template-columns: 1fr; }
  .lr-bento-item:first-child .lr-bento-card { flex-direction: column; align-items: flex-start; gap: 16px; }
  .lr-stat b { font-size: 30px; }
  .lr-figs { grid-template-columns: 1fr; row-gap: 0; margin-top: 56px; }
  .lr-fig, .lr-fig:nth-child(n) { border-left: 0; padding: 0; }
  .lr-fig + .lr-fig { border-top: 1px solid var(--border); margin-top: 40px; padding-top: 40px; }
  .lr-fig-link { display: none; }
  .lr-foot-grid { grid-template-columns: 1fr; gap: 28px; }
  .lr-hero-actions { width: 100%; }
  .lr-hero-actions .lr-btn { flex: 1; }
  .lr-cta-box { padding: 48px 22px; border-radius: 22px; }
  .lr-stack { gap: 24px; }
  .lr-stack-meta { gap: 18px; }
}
@media (prefers-reduced-motion: reduce) {
  .lr-landing *, .lr-landing *::before, .lr-landing *::after { animation: none !important; transition: none !important; }
  .lr-reveal, .lr-tilt, .lr-word { opacity: 1; transform: none; filter: none; }
  .lr-hw-progress { transform: scaleX(1); }
  .lr-hw-node { opacity: 1; transform: none; }
  .lr-v1-chips span { opacity: 1; }
  .lr-v3-badge { opacity: 1; transform: none; }
  .lr-v2 .lr-v2-f { display: none; }
  .lr-typing { width: 34ch; }
  .lr-fill { width: 100%; }
  html { scroll-behavior: auto; }
}
`;

export default function LandingPage() {
  usePageTitle("LightResearch - Meet your intelligent multi-agent research assistant");
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

  // Stacked feature cards: shrink + dim a card as the next one slides over it.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".lr-stack-card"));
    if (cards.length < 2) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        const pinned = parseFloat(getComputedStyle(next).top) || 0;
        const travel = card.offsetHeight * 0.9;
        // 0 = next card still far below, 1 = next card has fully covered this one
        const p = Math.min(1, Math.max(0, 1 - (next.getBoundingClientRect().top - pinned) / travel));
        card.style.setProperty("--scale", String(1 - p * 0.05));
        card.style.setProperty("--shade", String(p * 0.55));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
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
            <span>
              <Brand />
            </span>
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
                  <span className="lr-preview-title"><Brand /> · Research session (illustrative)</span>
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
        <section id="agents" className="lr-section">
          <div className="lr-wrap">
            <div className="lr-reveal">
              <span className="lr-eyebrow">Multi-Agent Architecture</span>
              <h2 className="lr-lead-big">
                Four specialized agents. <span className="brand-highlight">One seamless workflow.</span>{" "}
                <span className="lr-dimtxt">
                  Each agent focuses on what it does best, then hands its work to the next to deliver a reliable research report.
                </span>
              </h2>
            </div>

            <div className="lr-figs">
              <article className="lr-fig lr-reveal" style={d(0)}>
                <div className="lr-fig-label">AGENT 1</div>
                <div className="lr-fig-art">
                  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
                      <polygon className="lr-s lr-lf" points="23.0,105.6 120.0,161.6 120.0,154.9 23.0,98.9" />
                      <polygon className="lr-s lr-rt" points="217.0,105.6 120.0,161.6 120.0,154.9 217.0,98.9" />
                      <polygon className="lr-s lr-top" points="120.0,42.9 217.0,98.9 120.0,154.9 23.0,98.9" />
                      <polygon className="lr-beam" points="120.0,42.9 123.9,45.1 26.9,101.1 23.0,98.9" style={v({ "--sx": "93.1px", "--sy": "53.8px" })} />
                      <polygon className="lr-s lr-lf" points="100.6,65.3 120.0,76.5 120.0,60.8 100.6,49.6" />
                      <polygon className="lr-s lr-rt" points="139.4,65.3 120.0,76.5 120.0,60.8 139.4,49.6" />
                      <polygon className="lr-s lr-top" points="120.0,38.4 139.4,49.6 120.0,60.8 100.6,49.6" />
                      <polygon className="lr-s lr-lf" points="71.5,82.1 90.9,93.3 90.9,77.6 71.5,66.4" />
                      <polygon className="lr-s lr-rt" points="110.3,82.1 90.9,93.3 90.9,77.6 110.3,66.4" />
                      <polygon className="lr-s lr-top" points="90.9,55.2 110.3,66.4 90.9,77.6 71.5,66.4" />
                      <g className="lr-hit" style={v({ "--d": "2100ms" })}>
                      <polygon className="lr-s lr-lf" points="129.7,82.1 149.1,93.3 149.1,77.6 129.7,66.4" />
                      <polygon className="lr-s lr-rt" points="168.5,82.1 149.1,93.3 149.1,77.6 168.5,66.4" />
                      <polygon className="lr-s lr-top" points="149.1,55.2 168.5,66.4 149.1,77.6 129.7,66.4" />
                      </g>
                      <g className="lr-hit" style={v({ "--d": "840ms" })}>
                      <polygon className="lr-s lr-lf" points="42.4,98.9 61.8,110.1 61.8,94.4 42.4,83.2" />
                      <polygon className="lr-s lr-rt" points="81.2,98.9 61.8,110.1 61.8,94.4 81.2,83.2" />
                      <polygon className="lr-s lr-top" points="61.8,72.0 81.2,83.2 61.8,94.4 42.4,83.2" />
                      </g>
                      <polygon className="lr-s lr-lf" points="100.6,98.9 120.0,110.1 120.0,94.4 100.6,83.2" />
                      <polygon className="lr-s lr-rt" points="139.4,98.9 120.0,110.1 120.0,94.4 139.4,83.2" />
                      <polygon className="lr-s lr-top" points="120.0,72.0 139.4,83.2 120.0,94.4 100.6,83.2" />
                      <polygon className="lr-s lr-lf" points="158.8,98.9 178.2,110.1 178.2,94.4 158.8,83.2" />
                      <polygon className="lr-s lr-rt" points="197.6,98.9 178.2,110.1 178.2,94.4 197.6,83.2" />
                      <polygon className="lr-s lr-top" points="178.2,72.0 197.6,83.2 178.2,94.4 158.8,83.2" />
                      <polygon className="lr-s lr-lf" points="71.5,115.7 90.9,126.9 90.9,111.2 71.5,100.0" />
                      <polygon className="lr-s lr-rt" points="110.3,115.7 90.9,126.9 90.9,111.2 110.3,100.0" />
                      <polygon className="lr-s lr-top" points="90.9,88.8 110.3,100.0 90.9,111.2 71.5,100.0" />
                      <g className="lr-hit" style={v({ "--d": "3360ms" })}>
                      <polygon className="lr-s lr-lf" points="129.7,115.7 149.1,126.9 149.1,111.2 129.7,100.0" />
                      <polygon className="lr-s lr-rt" points="168.5,115.7 149.1,126.9 149.1,111.2 168.5,100.0" />
                      <polygon className="lr-s lr-top" points="149.1,88.8 168.5,100.0 149.1,111.2 129.7,100.0" />
                      </g>
                      <polygon className="lr-s lr-lf" points="100.6,132.5 120.0,143.7 120.0,128.0 100.6,116.8" />
                      <polygon className="lr-s lr-rt" points="139.4,132.5 120.0,143.7 120.0,128.0 139.4,116.8" />
                      <polygon className="lr-s lr-top" points="120.0,105.6 139.4,116.8 120.0,128.0 100.6,116.8" />
                    </svg>
                </div>
                <h3>{AGENTS[0].name}</h3>
                <p>{AGENTS[0].desc}</p>
              </article>
              <article className="lr-fig lr-reveal" style={d(120)}>
                <span className="lr-fig-link" aria-hidden="true">
                  <ArrowRight size={12} />
                </span>
                <div className="lr-fig-label">AGENT 2</div>
                <div className="lr-fig-art">
                  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
                      <polygon className="lr-s lr-lf" points="25.4,107.0 93.3,146.2 93.3,142.8 25.4,103.6" />
                      <polygon className="lr-s lr-rt" points="180.6,95.8 93.3,146.2 93.3,142.8 180.6,92.4" />
                      <polygon className="lr-s lr-top" points="112.7,53.2 180.6,92.4 93.3,142.8 25.4,103.6" />
                      <polygon className="lr-s lr-lf" points="25.4,96.9 93.3,136.1 93.3,132.8 25.4,93.6" />
                      <polygon className="lr-s lr-rt" points="180.6,85.7 93.3,136.1 93.3,132.8 180.6,82.4" />
                      <polygon className="lr-s lr-top" points="112.7,43.2 180.6,82.4 93.3,132.8 25.4,93.6" />
                      <polygon className="lr-s lr-lf" points="25.4,86.8 93.3,126.0 93.3,122.7 25.4,83.5" />
                      <polygon className="lr-s lr-rt" points="180.6,75.6 93.3,126.0 93.3,122.7 180.6,72.3" />
                      <polygon className="lr-s lr-top" points="112.7,33.1 180.6,72.3 93.3,122.7 25.4,83.5" />
                      <path className="lr-ln lr-ext" d="M106.9 45.4 L155.4 73.4" style={v({ "--d": "0ms" })} />
                      <path className="lr-ln " d="M91.4 54.4 L132.1 77.9" />
                      <path className="lr-ln lr-ext" d="M75.9 63.3 L128.2 93.6" style={v({ "--d": "1600ms" })} />
                      <path className="lr-ln " d="M60.3 72.3 L95.3 92.4" />
                      <path className="lr-ln lr-ext" d="M44.8 81.2 L89.4 107.0" style={v({ "--d": "3200ms" })} />
                      <g className="lr-note" style={v({ "--d": "0ms" })}>
                      <polygon className="lr-s lr-lf" points="170.0,117.6 193.2,131.1 193.2,127.7 170.0,114.3" />
                      <polygon className="lr-s lr-rt" points="214.6,118.8 193.2,131.1 193.2,127.7 214.6,115.4" />
                      <polygon className="lr-s lr-top" points="191.3,102.0 214.6,115.4 193.2,127.7 170.0,114.3" />
                      </g>
                      <g className="lr-note" style={v({ "--d": "1600ms" })}>
                      <polygon className="lr-s lr-lf" points="138.9,135.6 162.2,149.0 162.2,145.6 138.9,132.2" />
                      <polygon className="lr-s lr-rt" points="183.5,136.7 162.2,149.0 162.2,145.6 183.5,133.3" />
                      <polygon className="lr-s lr-top" points="160.3,119.9 183.5,133.3 162.2,145.6 138.9,132.2" />
                      </g>
                      <g className="lr-note" style={v({ "--d": "3200ms" })}>
                      <polygon className="lr-s lr-lf" points="107.9,153.5 131.2,166.9 131.2,163.6 107.9,150.1" />
                      <polygon className="lr-s lr-rt" points="152.5,154.6 131.2,166.9 131.2,163.6 152.5,151.2" />
                      <polygon className="lr-s lr-top" points="129.2,137.8 152.5,151.2 131.2,163.6 107.9,150.1" />
                      </g>
                      <g className="lr-fly" style={v({ "--d": "0ms", "--tx": "81.0px", "--ty": "66.9px" })}>
                      <polygon className="lr-s lr-lf" points="103.0,47.6 111.8,52.7 111.8,49.3 103.0,44.3" />
                      <polygon className="lr-s lr-rt" points="119.5,48.2 111.8,52.7 111.8,49.3 119.5,44.8" />
                      <polygon className="lr-s lr-top" points="110.8,39.8 119.5,44.8 111.8,49.3 103.0,44.3" />
                      </g>
                      <g className="lr-fly" style={v({ "--d": "1600ms", "--tx": "81.0px", "--ty": "66.9px" })}>
                      <polygon className="lr-s lr-lf" points="72.0,65.6 80.7,70.6 80.7,67.2 72.0,62.2" />
                      <polygon className="lr-s lr-rt" points="88.5,66.1 80.7,70.6 80.7,67.2 88.5,62.8" />
                      <polygon className="lr-s lr-top" points="79.7,57.7 88.5,62.8 80.7,67.2 72.0,62.2" />
                      </g>
                      <g className="lr-fly" style={v({ "--d": "3200ms", "--tx": "81.0px", "--ty": "66.9px" })}>
                      <polygon className="lr-s lr-lf" points="41.0,83.5 49.7,88.5 49.7,85.2 41.0,80.1" />
                      <polygon className="lr-s lr-rt" points="57.4,84.0 49.7,88.5 49.7,85.2 57.4,80.7" />
                      <polygon className="lr-s lr-top" points="48.7,75.6 57.4,80.7 49.7,85.2 41.0,80.1" />
                      </g>
                    </svg>
                </div>
                <h3>{AGENTS[1].name}</h3>
                <p>{AGENTS[1].desc}</p>
              </article>
              <article className="lr-fig lr-reveal" style={d(240)}>
                <span className="lr-fig-link" aria-hidden="true">
                  <ArrowRight size={12} />
                </span>
                <div className="lr-fig-label">AGENT 3</div>
                <div className="lr-fig-art">
                  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
                      <polygon className="lr-s lr-lf" points="32.7,114.7 110.3,159.5 110.3,155.0 32.7,110.2" />
                      <polygon className="lr-s lr-rt" points="207.3,103.5 110.3,159.5 110.3,155.0 207.3,99.0" />
                      <polygon className="lr-s lr-top" points="129.7,54.2 207.3,99.0 110.3,155.0 32.7,110.2" />
                      <polygon className="lr-s lr-lf" points="32.7,105.7 110.3,150.5 110.3,146.1 32.7,101.3" />
                      <polygon className="lr-s lr-rt" points="207.3,94.5 110.3,150.5 110.3,146.1 207.3,90.1" />
                      <polygon className="lr-s lr-top" points="129.7,45.3 207.3,90.1 110.3,146.1 32.7,101.3" />
                      <path className="lr-ln lr-ttl lr-dash lr-w" d="M127.8 55.3 L162.7 75.5" pathLength={1} style={v({ "--d": "0ms" })} />
                      <path className="lr-ln lr-dash lr-w" d="M116.1 62.1 L178.2 97.9" pathLength={1} style={v({ "--d": "500ms" })} />
                      <path className="lr-ln lr-dash lr-w" d="M107.4 67.1 L161.7 98.5" pathLength={1} style={v({ "--d": "1000ms" })} />
                      <path className="lr-ln lr-dash lr-w" d="M98.7 72.1 L158.8 106.9" pathLength={1} style={v({ "--d": "1500ms" })} />
                      <g className="lr-grow" style={v({ "--d": "2000ms" })}>
                      <polygon className="lr-s lr-lf" points="77.3,84.5 90.9,92.3 90.9,83.3 77.3,75.5" />
                      <polygon className="lr-s lr-rt" points="98.7,87.8 90.9,92.3 90.9,83.3 98.7,78.9" />
                      <polygon className="lr-s lr-top" points="85.1,71.0 98.7,78.9 90.9,83.3 77.3,75.5" />
                      </g>
                      <path className="lr-ln lr-dash lr-w" d="M102.5 94.5 L135.5 113.6" pathLength={1} style={v({ "--d": "2500ms" })} />
                      <g className="lr-grow" style={v({ "--d": "3000ms" })}>
                      <polygon className="lr-s lr-lf" points="65.7,91.2 79.3,99.0 79.3,81.1 65.7,73.3" />
                      <polygon className="lr-s lr-rt" points="87.0,94.5 79.3,99.0 79.3,81.1 87.0,76.6" />
                      <polygon className="lr-s lr-top" points="73.4,68.8 87.0,76.6 79.3,81.1 65.7,73.3" />
                      </g>
                      <path className="lr-ln lr-dash lr-w" d="M90.9 101.3 L118.1 116.9" pathLength={1} style={v({ "--d": "3500ms" })} />
                      <g className="lr-grow" style={v({ "--d": "4000ms" })}>
                      <polygon className="lr-s lr-lf" points="54.0,97.9 67.6,105.7 67.6,93.4 54.0,85.6" />
                      <polygon className="lr-s lr-rt" points="75.4,101.3 67.6,105.7 67.6,93.4 75.4,88.9" />
                      <polygon className="lr-s lr-top" points="61.8,81.1 75.4,88.9 67.6,93.4 54.0,85.6" />
                      </g>
                      <path className="lr-ln lr-dash lr-w" d="M79.3 108.0 L110.3 125.9" pathLength={1} style={v({ "--d": "4500ms" })} />
                      <g className="lr-pen" style={v({ "--sx": "-69.8px", "--sy": "40.3px" })}>
                      <polygon className="lr-pentile" points="123.9,49.7 128.7,52.5 122.9,55.9 118.1,53.1" />
                      <line className="lr-penline" x1="123.4" y1="52.8" x2="123.4" y2="40.5" />
                      </g>
                    </svg>
                </div>
                <h3>{AGENTS[2].name}</h3>
                <p>{AGENTS[2].desc}</p>
              </article>
              <article className="lr-fig lr-reveal" style={d(360)}>
                <span className="lr-fig-link" aria-hidden="true">
                  <ArrowRight size={12} />
                </span>
                <div className="lr-fig-label">AGENT 4</div>
                <div className="lr-fig-art">
                  <svg viewBox="0 0 240 200" fill="none" aria-hidden="true">
                      <polygon className="lr-s lr-lf" points="32.7,112.3 110.3,157.1 110.3,152.6 32.7,107.8" />
                      <polygon className="lr-s lr-rt" points="207.3,101.1 110.3,157.1 110.3,152.6 207.3,96.6" />
                      <polygon className="lr-s lr-top" points="129.7,51.8 207.3,96.6 110.3,152.6 32.7,107.8" />
                      <polygon className="lr-s lr-lf" points="32.7,103.4 110.3,148.2 110.3,143.7 32.7,98.9" />
                      <polygon className="lr-s lr-rt" points="207.3,92.2 110.3,148.2 110.3,143.7 207.3,87.7" />
                      <polygon className="lr-s lr-top" points="129.7,42.9 207.3,87.7 110.3,143.7 32.7,98.9" />
                      <path className="lr-ln " d="M123.9 55.2 L178.2 86.6" />
                      <path className="lr-ln " d="M110.3 63.0 L170.4 97.8" />
                      <path className="lr-ln " d="M83.1 78.7 L139.4 111.2" />
                      <path className="lr-ln " d="M69.6 86.6 L108.4 109.0" />
                      <path className="lr-ln lr-oldln" d="M96.7 70.9 L153.0 103.4" />
                      <path className="lr-ln lr-flag" d="M90.9 74.2 L147.2 106.7" />
                      <path className="lr-ln lr-ice-ln lr-newln lr-dash" d="M96.7 70.9 L137.5 94.4" pathLength={1} />
                      <g className="lr-lens" style={v({ "--sx": "-54.3px", "--sy": "31.4px" })}>
                      <ellipse cx="154.9" cy="73.1" rx="34" ry="19" />
                      </g>
                      <g className="lr-seal">
                      <line x1="203.4" y1="87.7" x2="203.4" y2="73.7" />
                      <circle cx="203.4" cy="63.7" r="10" />
                      <path d="M198.9 64.2 L202.2 67.7 L208.4 60.2" />
                      </g>
                    </svg>
                </div>
                <h3>{AGENTS[3].name}</h3>
                <p>{AGENTS[3].desc}</p>
              </article>
            </div>
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
              <p className="lr-sub">From the first search to the final export, <Brand /> handles the heavy lifting.</p>
            </div>

            <div className="lr-stack">
              {FEATURES.map((f, i) => (
                <article
                  className="lr-stack-card"
                  key={f.title}
                  style={v({ "--i": String(i) })}
                  onMouseMove={spot}
                >
                  <div className="lr-stack-body">
                    <span className="lr-stack-tag">{f.tag}</span>
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                    <div className="lr-stack-meta">
                      <span className="lr-stack-num">0{i + 1}</span>
                      <div className="lr-stack-points">
                        {f.points.map((p) => (
                          <span key={p}>
                            <CheckCircle2 size={14} /> {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="lr-stack-art">
                    <img className="lr-stack-img" src={f.img} alt={`${f.title} illustration`} loading="lazy" />
                  </div>
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

            <div className="lr-hw lr-reveal">
              <div className="lr-hw-track" aria-hidden="true">
                <span className="lr-hw-progress" />
                <span className="lr-hw-pulse" />
              </div>
              <div className="lr-hw-grid">
                {STEPS.map((st, i) => (
                  <div
                    className="lr-hw-item lr-reveal"
                    key={st.title}
                    style={v({ "--d": `${300 + i * 250}ms`, "--k": String(i) })}
                  >
                    <div className="lr-hw-node">{i + 1}</div>
                    <article className="lr-hw-card" onMouseMove={spot}>
                      <div className="lr-hw-vis" aria-hidden="true">
                        <StepVisual i={i} />
                      </div>
                      <div className="lr-hw-body">
                        <span className="lr-hw-step">Step 0{i + 1}</span>
                        <h3>{st.title}</h3>
                        <p>{st.desc}</p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============ Why LightResearch ============ */}
        <section id="about" className="lr-section">
          <div className="lr-wrap">
            <div className="lr-about">
              <div className="lr-reveal">
                <span className="lr-eyebrow">
                  Why <Brand />
                </span>
                <h2 className="lr-h2">
                  Research that is faster, clearer, and <span className="brand-highlight">better organized.</span>
                </h2>
                <p className="lr-sub">
                  <Brand /> is an AI-powered multi-agent research assistant built to automate the research process, so you
                  can spend less time searching and more time understanding.
                </p>

                <div className="lr-flow" aria-label="Agent workflow">
                  {AGENTS.map((a, i) => (
                    <Fragment key={a.name}>
                      <span className="lr-flow-chip" style={v({ "--k": String(i) })}>
                        <a.icon size={14} />
                        {a.name.replace(" Agent", "")}
                      </span>
                      {i < AGENTS.length - 1 && <ArrowRight size={14} className="lr-flow-arrow" aria-hidden="true" />}
                    </Fragment>
                  ))}
                </div>

                <div className="lr-stats">
                  <div className="lr-stat lr-reveal" style={d(150)}>
                    <b>{AGENTS.length}</b>
                    <span>Specialized AI agents</span>
                  </div>
                  <div className="lr-stat lr-reveal" style={d(260)}>
                    <b>1</b>
                    <span>Seamless workflow</span>
                  </div>
                  <div className="lr-stat lr-reveal" style={d(370)}>
                    <b>{FEATURES.length}</b>
                    <span>Core features</span>
                  </div>
                </div>
              </div>

              <div className="lr-bento">
                {BENEFITS.map((bn, i) => (
                  <div className="lr-bento-item lr-reveal" key={bn.text} style={d(i * 90)}>
                    <article className="lr-bento-card" onMouseMove={spot}>
                      <span className="lr-bento-num">0{i + 1}</span>
                      <div className="lr-bento-ico">
                        <bn.icon size={i === 0 ? 26 : 21} />
                      </div>
                      <div>
                        <h3>{bn.text}</h3>
                        <p>{bn.desc}</p>
                      </div>
                    </article>
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
                <p>Start exploring smarter research with <Brand />.</p>
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
                <span>
              <Brand />
            </span>
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
          <div className="lr-copy">© 2026 <Brand />.</div>
        </div>
      </footer>
    </div>
  );
}