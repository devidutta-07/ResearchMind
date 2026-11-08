import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUp,
  Check,
  ChevronDown,
  Download,
  FileText,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

/* ==========================================================================
   Research backend adapter
   --------------------------------------------------------------------------
   The multi-agent pipeline is not wired into this component yet.
   To connect it, make `getResearchRunner` return a function that:
     - calls your existing research workflow with the query,
     - calls `onAgentUpdate(agent, status)` ONLY when the backend reports it,
     - resolves with the finished report ({ title, markdown }).
   While it returns null, the UI shows a clear "not connected" notice and
   never simulates agent progress.
   ========================================================================== */

type AgentId = "search" | "reader" | "writer" | "critic";
type AgentStatus = "pending" | "active" | "done" | "error";

interface ResearchReport {
  title: string;
  markdown: string;
}

interface ResearchCallbacks {
  onAgentUpdate: (agent: AgentId, status: AgentStatus) => void;
}

type ResearchRunner = (
  query: string,
  callbacks: ResearchCallbacks
) => Promise<ResearchReport>;

const getResearchRunner = (): ResearchRunner | null => {
  return null; // <- connect the existing research workflow here
};

/* ==========================================================================
   Constants & types
   ========================================================================== */

const AGENTS: { id: AgentId; name: string; description: string }[] = [
  { id: "search", name: "Search Agent", description: "Finding relevant sources" },
  {
    id: "reader",
    name: "Reader Agent",
    description: "Extracting and understanding information",
  },
  {
    id: "writer",
    name: "Writer Agent",
    description: "Generating the research report",
  },
  {
    id: "critic",
    name: "Critic Agent",
    description: "Reviewing and refining the report",
  },
];

const INITIAL_AGENTS: Record<AgentId, AgentStatus> = {
  search: "pending",
  reader: "pending",
  writer: "pending",
  critic: "pending",
};

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ProfileLike {
  name?: string;
  email?: string;
  avatar_url?: string;
}

/* ==========================================================================
   Helpers
   ========================================================================== */

const makeId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const getInitials = (name?: string, email?: string) => {
  const source = (name ?? "").trim();
  if (source) {
    const parts = source.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }
  return (email ?? "").trim().charAt(0).toUpperCase() || "?";
};

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "research-report";

function useDismiss(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  close: () => void
) {
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, close]);
}

/* ==========================================================================
   Minimal, safe markdown renderer (no dependencies, no innerHTML)
   ========================================================================== */

const renderInline = (text: string): ReactNode[] =>
  text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4)
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2)
      return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2)
      return <em key={i}>{part.slice(1, -1)}</em>;
    return part;
  });

const renderMarkdown = (markdown: string): ReactNode[] => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const isSpecial = (l: string) =>
    /^(#{1,4})\s/.test(l) ||
    /^\s*([-*])\s+/.test(l) ||
    /^\s*\d+\.\s+/.test(l) ||
    /^>\s?/.test(l) ||
    /^```/.test(l) ||
    /^(-{3,}|\*{3,})\s*$/.test(l);

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i++;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre key={key++}>
          <code>{code.join("\n")}</code>
        </pre>
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      const content = renderInline(heading[2]);
      if (level === 1) blocks.push(<h1 key={key++}>{content}</h1>);
      else if (level === 2) blocks.push(<h2 key={key++}>{content}</h2>);
      else if (level === 3) blocks.push(<h3 key={key++}>{content}</h3>);
      else blocks.push(<h4 key={key++}>{content}</h4>);
      i++;
      continue;
    }

    if (/^(-{3,}|\*{3,})\s*$/.test(line)) {
      blocks.push(<hr key={key++} />);
      i++;
      continue;
    }

    if (/^>\s?/.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <blockquote key={key++}>{renderInline(quote.join(" "))}</blockquote>
      );
      continue;
    }

    if (/^\s*([-*])\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*([-*])\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*([-*])\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++}>
          {items.map((t, n) => (
            <li key={n}>{renderInline(t)}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++}>
          {items.map((t, n) => (
            <li key={n}>{renderInline(t)}</li>
          ))}
        </ol>
      );
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !isSpecial(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(<p key={key++}>{renderInline(para.join(" "))}</p>);
  }

  return blocks;
};

/* ==========================================================================
   Styles (scoped via the .rm- prefix; strictly #000 / #FFF + opacity)
   ========================================================================== */

const STYLES = `
.rm-root {
  --rm-fg: #ffffff;
  --rm-bg: #000000;
  --rm-fg-90: rgba(255,255,255,.9);
  --rm-fg-70: rgba(255,255,255,.7);
  --rm-fg-50: rgba(255,255,255,.5);
  --rm-fg-35: rgba(255,255,255,.35);
  --rm-line: rgba(255,255,255,.12);
  --rm-line-strong: rgba(255,255,255,.28);
  --rm-wash: rgba(255,255,255,.05);
  --rm-wash-2: rgba(255,255,255,.09);
  --rm-sans: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --rm-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
  position: fixed; inset: 0;
  display: flex; flex-direction: column;
  background: var(--rm-bg); color: var(--rm-fg);
  font-family: var(--rm-sans);
  font-size: 15px; line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.rm-root *, .rm-root *::before, .rm-root *::after { box-sizing: border-box; }
:where(.rm-root) button { font-family: inherit; color: inherit; cursor: pointer; }
.rm-root button:disabled { cursor: not-allowed; }
.rm-root button:focus-visible { outline: 1px solid var(--rm-fg); outline-offset: 2px; }
.rm-root .rm-send svg, .rm-root .rm-avatar svg { stroke: currentColor; }

/* scrollbars */
.rm-scroll { overflow-y: auto; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.2) transparent; }
.rm-scroll::-webkit-scrollbar { width: 8px; }
.rm-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.18); border-radius: 8px; }
.rm-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.3); }

/* navbar */
.rm-nav {
  height: 60px; flex: none;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
  border-bottom: 1px solid var(--rm-line);
  background: var(--rm-bg);
  position: relative; z-index: 20;
}
.rm-brand { display: flex; align-items: center; gap: 12px; }
.rm-brand img { width: 26px; height: 26px; object-fit: contain; display: block; }
.rm-brand span { font-size: 16px; font-weight: 600; letter-spacing: -.01em; }
.rm-nav-right { display: flex; align-items: center; gap: 12px; }

.rm-menu-wrap { position: relative; }
.rm-btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  height: 36px; padding: 0 14px;
  background: transparent; border: 1px solid var(--rm-line-strong);
  border-radius: 999px; font-size: 13px; font-weight: 500;
  transition: background .2s, border-color .2s, opacity .2s;
}
.rm-btn-ghost:hover:not(:disabled) { background: var(--rm-wash-2); border-color: var(--rm-fg-50); }
.rm-btn-ghost:disabled { opacity: .35; }

.rm-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  display: grid; place-items: center; overflow: hidden;
  background: var(--rm-fg); color: var(--rm-bg);
  font-size: 13px; font-weight: 600; letter-spacing: .02em;
  border: 1px solid var(--rm-fg); padding: 0;
  transition: opacity .2s, box-shadow .2s;
}
.rm-avatar:hover { opacity: .88; }
.rm-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

.rm-dropdown {
  position: absolute; right: 0; top: calc(100% + 10px);
  min-width: 248px;
  background: var(--rm-bg);
  border: 1px solid var(--rm-line-strong);
  border-radius: 14px; padding: 6px;
  box-shadow: 0 24px 60px rgba(255,255,255,.06);
  animation: rm-pop .16s ease-out;
}
@keyframes rm-pop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
.rm-dd-head { padding: 12px 12px 12px; border-bottom: 1px solid var(--rm-line); margin-bottom: 6px; }
.rm-dd-name { font-size: 14px; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rm-dd-email { font-size: 12.5px; color: var(--rm-fg-50); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-top: 2px; }
.rm-dd-item {
  width: 100%; display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; background: transparent; border: 0;
  border-radius: 9px; font-size: 13.5px; text-align: left;
  transition: background .15s;
}
.rm-dd-item:hover:not(:disabled) { background: var(--rm-wash-2); }
.rm-dd-item:disabled { opacity: .5; }
.rm-dd-sub { display: block; font-size: 12px; color: var(--rm-fg-50); }

/* tabs (mobile) */
.rm-tabs { display: none; flex: none; border-bottom: 1px solid var(--rm-line); }
.rm-tab {
  flex: 1; height: 44px; background: transparent; border: 0;
  border-bottom: 1px solid transparent; margin-bottom: -1px;
  font-size: 13px; font-weight: 500; color: var(--rm-fg-50);
  transition: color .2s, border-color .2s;
}
.rm-tab[aria-selected="true"] { color: var(--rm-fg); border-bottom-color: var(--rm-fg); }

/* layout */
.rm-main { flex: 1; min-height: 0; display: flex; }
.rm-chat { flex: 1 1 50%; min-width: 0; display: flex; flex-direction: column; min-height: 0; }
.rm-divider { width: 1px; background: var(--rm-line); flex: none; }
.rm-report { flex: 1 1 50%; min-width: 0; display: flex; flex-direction: column; min-height: 0; }

/* chat — welcome */
.rm-welcome {
  flex: 1; min-height: 0;
  display: flex; flex-direction: column; justify-content: center;
  padding: 40px 48px; width: 100%; max-width: 760px; margin: 0 auto;
}
.rm-welcome h1 {
  margin: 0; font-family: var(--rm-serif); font-weight: 500;
  font-size: clamp(30px, 3.6vw, 44px); line-height: 1.12; letter-spacing: -.02em;
}
.rm-welcome p { margin: 16px 0 36px; max-width: 520px; color: var(--rm-fg-50); font-size: 16px; line-height: 1.6; }

/* chat — conversation */
.rm-thread { flex: 1; min-height: 0; padding: 32px 48px 8px; }
.rm-thread-inner { max-width: 720px; margin: 0 auto; display: flex; flex-direction: column; gap: 28px; }
.rm-msg { display: flex; flex-direction: column; gap: 8px; animation: rm-rise .25s ease-out; }
@keyframes rm-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
.rm-msg-user { align-self: flex-end; max-width: 85%; }
.rm-msg-user .rm-bubble {
  background: var(--rm-wash-2); border: 1px solid var(--rm-line);
  border-radius: 18px 18px 4px 18px; padding: 12px 16px;
}
.rm-msg-ai .rm-label { display: flex; align-items: center; gap: 8px; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--rm-fg-50); }
.rm-msg-ai .rm-label img { width: 16px; height: 16px; object-fit: contain; }
.rm-msg-ai .rm-bubble { color: var(--rm-fg-90); padding-left: 24px; border-left: 1px solid var(--rm-line-strong); }
.rm-bubble { white-space: pre-wrap; word-break: break-word; }

/* agent progress */
.rm-agents { border: 1px solid var(--rm-line); border-radius: 14px; padding: 6px 18px; animation: rm-rise .25s ease-out; }
.rm-agents-title { padding: 12px 0 6px; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; color: var(--rm-fg-50); }
.rm-agent { display: flex; align-items: center; gap: 14px; padding: 11px 0; border-top: 1px solid var(--rm-line); transition: opacity .3s; }
.rm-agent:first-of-type { border-top: 0; }
.rm-agent[data-status="pending"] { opacity: .45; }
.rm-dot { width: 18px; height: 18px; flex: none; border-radius: 50%; border: 1px solid var(--rm-line-strong); display: grid; place-items: center; position: relative; }
.rm-agent[data-status="active"] .rm-dot { border-color: var(--rm-fg); }
.rm-agent[data-status="active"] .rm-dot::after { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--rm-fg); animation: rm-pulse 1.2s ease-in-out infinite; }
.rm-agent[data-status="done"] .rm-dot { background: var(--rm-fg); border-color: var(--rm-fg); color: var(--rm-bg); }
.rm-agent[data-status="error"] .rm-dot { border-style: dashed; border-color: var(--rm-fg-70); }
@keyframes rm-pulse { 0%,100% { opacity: .25; transform: scale(.8); } 50% { opacity: 1; transform: scale(1.15); } }
.rm-agent-name { font-size: 14px; font-weight: 500; }
.rm-agent-desc { font-size: 12.5px; color: var(--rm-fg-50); }
.rm-agent-state { margin-left: auto; font-size: 12px; color: var(--rm-fg-50); }

/* composer */
.rm-composer-wrap { flex: none; padding: 12px 48px 28px; width: 100%; max-width: 856px; margin: 0 auto; }
.rm-welcome .rm-composer-wrap { padding: 0; max-width: none; }
.rm-composer {
  position: relative; display: flex; align-items: flex-end; gap: 10px;
  border: 1px solid var(--rm-line-strong); border-radius: 20px;
  padding: 14px 14px 14px 20px; background: var(--rm-bg);
  transition: border-color .2s, background .2s;
}
.rm-composer:focus-within { border-color: var(--rm-fg-70); background: var(--rm-wash); }
.rm-welcome .rm-composer { min-height: 128px; padding: 20px 18px 18px 22px; border-radius: 24px; }
.rm-input {
  flex: 1; min-width: 0; resize: none; border: 0; outline: none;
  background: transparent; color: var(--rm-fg);
  font: inherit; font-size: 15.5px; line-height: 1.55;
  max-height: 220px; padding: 4px 0;
}
.rm-root .rm-input,
.rm-root .rm-input:hover,
.rm-root .rm-input:focus,
.rm-root .rm-input:focus-visible,
.rm-root .rm-input:active {
  outline: none !important;
  box-shadow: none !important;
  border: 0 !important;
  background: transparent !important;
  -webkit-appearance: none; appearance: none;
  -webkit-tap-highlight-color: transparent;
}
.rm-input::placeholder { color: var(--rm-fg-35); }
.rm-welcome .rm-input { min-height: 84px; }
.rm-send {
  flex: none; width: 36px; height: 36px; border-radius: 50%;
  display: grid; place-items: center;
  background: var(--rm-fg); color: var(--rm-bg); border: 1px solid var(--rm-fg);
  transition: opacity .2s, transform .15s;
}
.rm-send:hover:not(:disabled) { transform: translateY(-1px); }
.rm-send:disabled { opacity: .2; }
.rm-hint { margin-top: 10px; text-align: center; font-size: 12px; color: var(--rm-fg-35); }

/* report */
.rm-report-head {
  flex: none; height: 52px; display: flex; align-items: center; justify-content: space-between;
  padding: 0 40px; border-bottom: 1px solid var(--rm-line);
}
.rm-report-tab { font-size: 12px; letter-spacing: .08em; text-transform: uppercase; font-weight: 500; position: relative; height: 52px; display: flex; align-items: center; }
.rm-report-tab::after { content: ""; position: absolute; left: 0; right: 0; bottom: -1px; height: 1px; background: var(--rm-fg); }
.rm-report-body { flex: 1; min-height: 0; padding: 48px 40px 96px; }
.rm-doc { max-width: 680px; margin: 0 auto; font-family: var(--rm-serif); font-size: 17px; line-height: 1.75; color: var(--rm-fg-90); }
.rm-doc-title { margin: 0 0 8px; font-family: var(--rm-serif); font-size: clamp(28px, 3vw, 38px); line-height: 1.15; letter-spacing: -.02em; font-weight: 500; color: var(--rm-fg); }
.rm-doc-rule { height: 1px; background: var(--rm-line); margin: 28px 0 8px; border: 0; }
.rm-doc h1 { font-size: 30px; line-height: 1.2; margin: 2em 0 .6em; font-weight: 500; color: var(--rm-fg); letter-spacing: -.015em; }
.rm-doc h2 { font-size: 24px; line-height: 1.25; margin: 2em 0 .55em; font-weight: 500; color: var(--rm-fg); letter-spacing: -.01em; padding-top: .6em; border-top: 1px solid var(--rm-line); }
.rm-doc h3 { font-size: 19px; margin: 1.7em 0 .45em; font-weight: 600; color: var(--rm-fg); }
.rm-doc h4 { font-family: var(--rm-sans); font-size: 12px; letter-spacing: .08em; text-transform: uppercase; margin: 1.7em 0 .5em; font-weight: 600; color: var(--rm-fg-70); }
.rm-doc > :first-child { margin-top: 0; border-top: 0; padding-top: 0; }
.rm-doc p { margin: 0 0 1.15em; }
.rm-doc ul, .rm-doc ol { margin: 0 0 1.3em; padding-left: 1.4em; }
.rm-doc li { margin-bottom: .45em; padding-left: .2em; }
.rm-doc li::marker { color: var(--rm-fg-50); }
.rm-doc strong { color: var(--rm-fg); font-weight: 600; }
.rm-doc code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .85em; background: var(--rm-wash-2); padding: .12em .4em; border-radius: 5px; }
.rm-doc pre { background: var(--rm-wash); border: 1px solid var(--rm-line); border-radius: 10px; padding: 16px 18px; overflow-x: auto; margin: 0 0 1.3em; }
.rm-doc pre code { background: none; padding: 0; font-size: 13.5px; line-height: 1.6; }
.rm-doc blockquote { margin: 0 0 1.3em; padding: 2px 0 2px 20px; border-left: 1px solid var(--rm-fg-50); color: var(--rm-fg-70); font-style: italic; }
.rm-doc hr { border: 0; height: 1px; background: var(--rm-line); margin: 2.2em 0; }
.rm-doc a { color: var(--rm-fg); text-decoration: underline; text-underline-offset: 3px; }

/* empty report */
.rm-empty { flex: 1; display: grid; place-items: center; padding: 40px; text-align: center; }
.rm-empty-inner { max-width: 340px; }
.rm-empty-icon { width: 52px; height: 52px; border: 1px solid var(--rm-line-strong); border-radius: 14px; display: grid; place-items: center; margin: 0 auto 22px; color: var(--rm-fg-70); }
.rm-empty h3 { margin: 0 0 8px; font-family: var(--rm-serif); font-size: 21px; font-weight: 500; }
.rm-empty p { margin: 0; color: var(--rm-fg-50); font-size: 14px; line-height: 1.6; }

.rm-loading { padding: 4px 0; color: var(--rm-fg-50); font-size: 14px; }

/* responsive */
@media (max-width: 1100px) {
  .rm-welcome, .rm-thread { padding-left: 28px; padding-right: 28px; }
  .rm-composer-wrap { padding-left: 28px; padding-right: 28px; }
  .rm-report-head, .rm-report-body { padding-left: 28px; padding-right: 28px; }
}
@media (max-width: 900px) {
  .rm-nav { padding: 0 16px; }
  .rm-tabs { display: flex; }
  .rm-divider { display: none; }
  .rm-main { flex-direction: column; }
  .rm-chat, .rm-report { flex: 1 1 auto; }
  .rm-pane-hidden { display: none !important; }
  .rm-report-head { display: none; }
  .rm-welcome { padding: 28px 20px; }
  .rm-thread { padding: 24px 20px 8px; }
  .rm-composer-wrap { padding: 8px 16px 20px; }
  .rm-welcome .rm-composer-wrap { padding: 0; }
  .rm-report-body { padding: 32px 20px 72px; }
  .rm-doc { font-size: 16.5px; }
  .rm-btn-label { display: none; }
  .rm-btn-ghost { padding: 0 11px; }
}
@media (prefers-reduced-motion: reduce) {
  .rm-root *, .rm-root *::before, .rm-root *::after { animation: none !important; transition: none !important; }
}
@media print { .rm-root { position: static; } }
`;

/* ==========================================================================
   Dashboard
   ========================================================================== */

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  // The shape of `User` lives in ../types; read optional fields defensively.
  const profile = user as unknown as ProfileLike | null;
  const displayName = profile?.name?.trim() || "";
  const displayEmail = profile?.email?.trim() || "";
  const initials = getInitials(displayName, displayEmail);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [agents, setAgents] = useState<Record<AgentId, AgentStatus>>(INITIAL_AGENTS);
  const [showAgents, setShowAgents] = useState(false);
  const [report, setReport] = useState<ResearchReport | null>(null);
  const [mobileTab, setMobileTab] = useState<"chat" | "report">("chat");

  const [profileOpen, setProfileOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const reportDocRef = useRef<HTMLDivElement>(null);

  const closeProfile = useCallback(() => setProfileOpen(false), []);
  const closeExport = useCallback(() => setExportOpen(false), []);
  useDismiss(profileRef, profileOpen, closeProfile);
  useDismiss(exportRef, exportOpen, closeExport);

  const hasConversation = messages.length > 0;

  // Auto-grow the textarea
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }, [input, hasConversation]);

  // Keep the newest message in view
  useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, agents, showAgents]);

  const pushMessage = (role: ChatMessage["role"], content: string) =>
    setMessages((prev) => [...prev, { id: makeId(), role, content }]);

  const handleSubmit = async () => {
    const query = input.trim();
    if (!query || running) return;

    setInput("");
    pushMessage("user", query);

    const runner = getResearchRunner();
    if (!runner) {
      pushMessage(
        "assistant",
        "The research workflow isn't connected to this dashboard yet, so this request wasn't processed."
      );
      return;
    }

    setRunning(true);
    setShowAgents(true);
    setAgents(INITIAL_AGENTS);

    try {
      const result = await runner(query, {
        onAgentUpdate: (agent, status) =>
          setAgents((prev) => ({ ...prev, [agent]: status })),
      });
      setReport(result);
      setMobileTab("report");
      pushMessage("assistant", `Your report "${result.title}" is ready in the Research Report panel.`);
    } catch (error) {
      console.error("Research request failed:", error);
      pushMessage(
        "assistant",
        "Something went wrong while generating the report. Please try again."
      );
    } finally {
      setRunning(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void handleSubmit();
    }
  };

  /* ---- Logout: reuses the existing auth context ---- */
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  };

  /* ---- Export: real client-side exports of the current report ---- */
  const exportMarkdown = () => {
    if (!report) return;
    const body = report.markdown.trimStart().startsWith("# ")
      ? report.markdown
      : `# ${report.title}\n\n${report.markdown}`;
    const blob = new Blob([body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(report.title)}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  };

  const exportPdf = () => {
    if (!report || !reportDocRef.current) return;
    const win = window.open("", "_blank");
    if (!win) {
      window.alert("Please allow pop-ups to export the report as PDF.");
      return;
    }
    const safeTitle = report.title.replace(/[<>&]/g, "");
    win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${safeTitle}</title>
<style>
  body{font-family:Georgia,'Times New Roman',serif;color:#000;background:#fff;max-width:720px;margin:48px auto;padding:0 24px;line-height:1.7;font-size:15px}
  h1,h2,h3,h4{line-height:1.25;margin:1.6em 0 .5em}
  h1.doc-title{font-size:30px;margin-top:0}
  p,li{margin:0 0 .9em}
  code{font-family:monospace;background:#f2f2f2;padding:1px 4px}
  pre{background:#f2f2f2;padding:12px;overflow:auto}
  blockquote{border-left:2px solid #000;margin:0 0 1em;padding-left:16px;font-style:italic}
  hr{border:0;border-top:1px solid #000;margin:2em 0}
</style></head><body><h1 class="doc-title">${safeTitle}</h1>${reportDocRef.current.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    win.onload = () => win.print();
    setExportOpen(false);
  };

  const renderedReport = useMemo(
    () => (report ? renderMarkdown(report.markdown) : null),
    [report]
  );

  const statusLabel: Record<AgentStatus, string> = {
    pending: "Waiting",
    active: "Working",
    done: "Complete",
    error: "Failed",
  };

  /* ---- Composer (shared by welcome + conversation states) ---- */
  const composer = (
    <div className="rm-composer-wrap">
      <div className="rm-composer">
        <textarea
          ref={textareaRef}
          className="rm-input"
          rows={1}
          value={input}
          placeholder="Ask anything you want to research..."
          aria-label="Research question"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={running}
        />
        <button
          type="button"
          className="rm-send"
          aria-label="Send"
          onClick={() => void handleSubmit()}
          disabled={!input.trim() || running}
        >
          <ArrowUp size={18} strokeWidth={2.2} />
        </button>
      </div>
      <div className="rm-hint">Enter to send · Shift + Enter for a new line</div>
    </div>
  );

  return (
    <div className="rm-root">
      <style>{STYLES}</style>

      {/* ------------------------------ Navbar ------------------------------ */}
      <header className="rm-nav">
        <div className="rm-brand">
          <img src="/lightresearch-logo.png" alt="ResearchMind logo" />
          <span>ResearchMind</span>
        </div>

        <div className="rm-nav-right">
          <div className="rm-menu-wrap" ref={exportRef}>
            <button
              type="button"
              className="rm-btn-ghost"
              onClick={() => setExportOpen((o) => !o)}
              disabled={!report}
              aria-haspopup="menu"
              aria-expanded={exportOpen}
              title={report ? "Export the current report" : "Generate a report to enable export"}
            >
              <Download size={15} />
              <span className="rm-btn-label">Export</span>
              <ChevronDown size={14} />
            </button>
            {exportOpen && report && (
              <div className="rm-dropdown" role="menu" style={{ minWidth: 220 }}>
                <button type="button" role="menuitem" className="rm-dd-item" onClick={exportPdf}>
                  <FileText size={15} />
                  <span>
                    PDF
                    <span className="rm-dd-sub">Opens the print dialog</span>
                  </span>
                </button>
                <button type="button" role="menuitem" className="rm-dd-item" onClick={exportMarkdown}>
                  <Download size={15} />
                  <span>
                    Markdown
                    <span className="rm-dd-sub">Download as .md</span>
                  </span>
                </button>
              </div>
            )}
          </div>

          <div className="rm-menu-wrap" ref={profileRef}>
            <button
              type="button"
              className="rm-avatar"
              onClick={() => setProfileOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={displayName || "Profile"} />
              ) : (
                initials
              )}
            </button>
            {profileOpen && (
              <div className="rm-dropdown" role="menu">
                <div className="rm-dd-head">
                  <div className="rm-dd-name">{displayName || "Your account"}</div>
                  {displayEmail && <div className="rm-dd-email">{displayEmail}</div>}
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="rm-dd-item"
                  onClick={() => void handleLogout()}
                  disabled={loggingOut}
                >
                  <LogOut size={15} />
                  {loggingOut ? "Logging out…" : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ---------------------------- Mobile tabs --------------------------- */}
      <div className="rm-tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className="rm-tab"
          aria-selected={mobileTab === "chat"}
          onClick={() => setMobileTab("chat")}
        >
          Research
        </button>
        <button
          type="button"
          role="tab"
          className="rm-tab"
          aria-selected={mobileTab === "report"}
          onClick={() => setMobileTab("report")}
        >
          Research Report
        </button>
      </div>

      {/* ------------------------------- Main ------------------------------- */}
      <main className="rm-main">
        {/* Chat */}
        <section
          className={`rm-chat ${mobileTab !== "chat" ? "rm-pane-hidden" : ""}`}
          aria-label="Research chat"
        >
          {!hasConversation ? (
            <div className="rm-welcome">
              <h1>What would you like to research today?</h1>
              <p>
                Explore ideas, discover insights, and generate structured research reports with
                ResearchMind.
              </p>
              {composer}
            </div>
          ) : (
            <>
              <div className="rm-thread rm-scroll" ref={threadRef}>
                <div className="rm-thread-inner">
                  {messages.map((m) =>
                    m.role === "user" ? (
                      <div key={m.id} className="rm-msg rm-msg-user">
                        <div className="rm-bubble">{m.content}</div>
                      </div>
                    ) : (
                      <div key={m.id} className="rm-msg rm-msg-ai">
                        <div className="rm-label">
                          <img src="/lightresearch-logo.png" alt="" />
                          ResearchMind
                        </div>
                        <div className="rm-bubble">{m.content}</div>
                      </div>
                    )
                  )}

                  {showAgents && (
                    <div className="rm-agents" aria-live="polite">
                      <div className="rm-agents-title">Research progress</div>
                      {AGENTS.map((agent) => {
                        const status = agents[agent.id];
                        return (
                          <div key={agent.id} className="rm-agent" data-status={status}>
                            <span className="rm-dot">
                              {status === "done" && <Check size={11} strokeWidth={3} />}
                            </span>
                            <div>
                              <div className="rm-agent-name">{agent.name}</div>
                              <div className="rm-agent-desc">{agent.description}</div>
                            </div>
                            <span className="rm-agent-state">{statusLabel[status]}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              {composer}
            </>
          )}
        </section>

        <div className="rm-divider" aria-hidden="true" />

        {/* Report */}
        <section
          className={`rm-report ${mobileTab !== "report" ? "rm-pane-hidden" : ""}`}
          aria-label="Research report"
        >
          <div className="rm-report-head">
            <div className="rm-report-tab">Research Report</div>
          </div>

          {report && renderedReport ? (
            <div className="rm-report-body rm-scroll">
              <article className="rm-doc">
                <h1 className="rm-doc-title">{report.title}</h1>
                <hr className="rm-doc-rule" />
                <div ref={reportDocRef}>{renderedReport}</div>
              </article>
            </div>
          ) : (
            <div className="rm-empty">
              <div className="rm-empty-inner">
                <div className="rm-empty-icon">
                  <FileText size={22} strokeWidth={1.5} />
                </div>
                <h3>{running ? "Your report is being prepared" : "No report yet"}</h3>
                <p>
                  {running
                    ? "The research agents are working. The finished report will appear here."
                    : "Start a research request and the generated report will appear here as a readable document."}
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;