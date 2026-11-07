import streamlit as st
import time
from agent.agents import web_extractor_agent, web_search_agent, writer_chain, critic_chain

# ── Page config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="ResearchMind · AI Research Agent",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="collapsed",
)



# ── Session state init ────────────────────────────────────────────────────────
for key, default in [("results", {}), ("running", False), ("done", False), ("page", "home"), ("topic_val", "")]:
    if key not in st.session_state:
        st.session_state[key] = default


# ── Helper: step card ─────────────────────────────────────────────────────────
def step_card(num, title, state, desc=""):
    status_map = {"waiting": ("WAITING", "status-waiting"), "running": ("● RUNNING", "status-running"), "done": ("✓ DONE", "status-done")}
    label, cls = status_map.get(state, ("", ""))
    card_cls = {"running": "active", "done": "done"}.get(state, "")
    st.markdown(f"""
    <div class="step-card {card_cls}">
        <div class="step-header">
            <span class="step-num">{num}</span>
            <span class="step-title">{title}</span>
            <span class="step-status {cls}">{label}</span>
        </div>
        {"<div style='font-size:0.82rem;color:#706860;margin-top:0.3rem;'>" + desc + "</div>" if desc else ""}
    </div>""", unsafe_allow_html=True)


# ── Helper: convert markdown → simple DOCX bytes ─────────────────────────────
def md_to_docx_bytes(md_text: str) -> bytes:
    try:
        from docx import Document
        from io import BytesIO
        doc = Document()
        for line in md_text.split("\n"):
            if line.startswith("# "):
                doc.add_heading(line[2:], level=1)
            elif line.startswith("## "):
                doc.add_heading(line[3:], level=2)
            elif line.startswith("### "):
                doc.add_heading(line[4:], level=3)
            elif line.strip():
                doc.add_paragraph(line)
        buf = BytesIO()
        doc.save(buf)
        return buf.getvalue()
    except ImportError:
        return None


# ── Helper: convert markdown → simple PDF bytes ──────────────────────────────
def md_to_pdf_bytes(md_text: str, topic: str) -> bytes:
    try:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.units import cm
        from io import BytesIO
        import re

        buf = BytesIO()
        doc = SimpleDocTemplate(buf, pagesize=A4,
                                leftMargin=2.5*cm, rightMargin=2.5*cm,
                                topMargin=2.5*cm, bottomMargin=2.5*cm)
        styles = getSampleStyleSheet()
        story = []

        for line in md_text.split("\n"):
            if line.startswith("# "):
                story.append(Paragraph(line[2:], styles["h1"]))
            elif line.startswith("## "):
                story.append(Paragraph(line[3:], styles["h2"]))
            elif line.startswith("### "):
                story.append(Paragraph(line[4:], styles["h3"]))
            elif line.strip():
                clean = re.sub(r"\*\*(.*?)\*\*", r"<b>\1</b>", line)
                clean = re.sub(r"\*(.*?)\*",   r"<i>\1</i>", clean)
                story.append(Paragraph(clean, styles["Normal"]))
            else:
                story.append(Spacer(1, 0.3*cm))

        doc.build(story)
        return buf.getvalue()
    except ImportError:
        return None


# ════════════════════════════════════════════════════════════════════════════
#  PAGE: HOME
# ════════════════════════════════════════════════════════════════════════════
if st.session_state.page == "home":

    # ── Hero ──
    st.markdown("""
    <div class="hero">
        <div class="hero-eyebrow">Multi-Agent AI System</div>
        <h1>Research<span>Mind</span></h1>
        <p class="hero-sub">
            Four specialized AI agents collaborate — searching, scraping, writing,
            and critiquing — to deliver a polished research report on any topic.
        </p>
    </div>
    <div class="divider"></div>
    """, unsafe_allow_html=True)

    col_input, col_spacer, col_pipeline = st.columns([5, 0.5, 4])

    with col_input:
        st.markdown('<div class="input-card">', unsafe_allow_html=True)
        topic = st.text_input("Research Topic", placeholder="e.g. Quantum computing breakthroughs in 2025", key="topic_input")
        run_btn = st.button("⚡  Run Research Pipeline", use_container_width=True)
        st.markdown('</div>', unsafe_allow_html=True)

        st.markdown("""<div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1.5rem;">
            <span style="font-family:'DM Mono',monospace;font-size:0.68rem;color:#3a3250;letter-spacing:0.1em;">TRY →</span>""",
            unsafe_allow_html=True)
        for ex in ["LLM agents 2025", "CRISPR gene editing", "Fusion energy progress"]:
            st.markdown(f"""<span style="background:rgba(157,111,255,0.07);border:1px solid rgba(157,111,255,0.18);
                border-radius:6px;padding:0.25rem 0.7rem;font-size:0.75rem;color:#b8b4c8;
                font-family:'DM Sans',sans-serif;">{ex}</span>""", unsafe_allow_html=True)
        st.markdown("</div>", unsafe_allow_html=True)

    with col_pipeline:
        st.markdown('<div class="section-heading">Pipeline</div>', unsafe_allow_html=True)
        r = st.session_state.results

        def s(step):
            steps = ["search", "reader", "writer", "critic"]
            if step in r: return "done"
            if st.session_state.running:
                for k in steps:
                    if k not in r:
                        return "running" if k == step else "waiting"
            return "waiting"

        step_card("01", "Search Agent",  s("search"), "Gathers recent web information")
        step_card("02", "Reader Agent",  s("reader"), "Scrapes & extracts deep content")
        step_card("03", "Writer Chain",  s("writer"), "Drafts the full research report")
        step_card("04", "Critic Chain",  s("critic"), "Reviews & scores the report")

    # ── Trigger pipeline ──
    if run_btn:
        if not topic.strip():
            st.warning("Please enter a research topic first.")
        else:
            st.session_state.topic_val = topic.strip()
            st.session_state.results = {}
            st.session_state.running = True
            st.session_state.done = False
            st.rerun()

    if st.session_state.running and not st.session_state.done:
        results = {}
        topic_val = st.session_state.topic_val

        import re as _re
        def _tool_output(resp):
            for m in reversed(resp["messages"]):
                if getattr(m, "type", "") == "tool" and str(getattr(m, "content", "")).strip():
                    return m.content
            for m in reversed(resp["messages"]):
                if getattr(m, "type", "") in ("human", "tool"):
                    continue
                c = str(getattr(m, "content", "")).strip()
                if c and not c.startswith('{"name"') and "web_search" not in c[:50] and "web_extractor" not in c[:50] and not c.startswith("Find recent") and not c.startswith("Based on"):
                    return m.content
            return "No tool output received."
        def _links_output(resp):
            links = []
            for m in resp["messages"]:
                for tc in getattr(m, "tool_calls", None) or []:
                    args = tc.get("args") or {}
                    for v in ([args.get("links")] if isinstance(args.get("links"), str) else args.get("links") or []):
                        if v and v not in links: links.append(v)
                txt = str(getattr(m, "content", ""))
                for u in _re.findall(r'https?://[^\s"\']+', txt):
                    if u not in links: links.append(u.rstrip('.,;') + '')
            links = [l for l in links if l.startswith("http")]
            out = _tool_output(resp)
            if links:
                return "Links to extract:\n" + "\n".join(links) + "\n\n" + out
            return out

        with st.spinner("🔍  Search Agent is working…"):
            search_agent = web_search_agent()
            sr = search_agent.invoke({"messages": [("user", f"Find recent, reliable and detailed information about: {topic_val}")]})
            results["search"] = _tool_output(sr)
            st.session_state.results = dict(results)

        with st.spinner("📄  Reader Agent is scraping top resources…"):
            reader_agent = web_extractor_agent()
            rr = reader_agent.invoke({"messages": [("user",
                f"Based on the following search results about '{topic_val}', "
                f"extract ALL URLs (up to 3) and scrape them for deeper content.\n\nSearch Results:\n{results['search']}")]})
            results["reader"] = _links_output(rr)
            st.session_state.results = dict(results)

        with st.spinner("✍️  Writer is drafting the report…"):
            research_combined = f"SEARCH RESULTS:\n{results['search'][:1000]}\n\nDETAILED SCRAPED CONTENT:\n{results['reader'][:1000]}"
            results["writer"] = writer_chain.invoke({"topic": topic_val, "research": research_combined})
            st.session_state.results = dict(results)

        with st.spinner("🧐  Critic is reviewing the report…"):
            results["critic"] = critic_chain.invoke({"report": results["writer"]})
            st.session_state.results = dict(results)

        st.session_state.running = False
        st.session_state.done = True
        st.session_state.page = "results"   # ← navigate to results page
        st.rerun()

    st.markdown('<div class="notice">ResearchMind · Powered by LangChain multi-agent pipeline · Built with Streamlit</div>', unsafe_allow_html=True)


# ════════════════════════════════════════════════════════════════════════════
#  PAGE: RESULTS
# ════════════════════════════════════════════════════════════════════════════
elif st.session_state.page == "results":
    r = st.session_state.results
    topic_val = st.session_state.topic_val
    ts = int(time.time())

    # ── Top bar: back + download ──
    col_back, col_spacer, col_dl = st.columns([2, 5, 3])

    with col_back:
        st.markdown('<div class="back-btn">', unsafe_allow_html=True)
        if st.button("← New Research"):
            st.session_state.page = "home"
            st.session_state.results = {}
            st.session_state.done = False
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

    with col_dl:
        # Small inline download cluster
        st.markdown("""
        <div style="display:flex;align-items:center;justify-content:flex-end;gap:0.5rem;padding-top:0.4rem;">
            <span style="font-family:'DM Mono',monospace;font-size:0.65rem;color:#3a3250;letter-spacing:0.12em;">DOWNLOAD</span>
        </div>""", unsafe_allow_html=True)

        dl_col1, dl_col2, dl_col3 = st.columns(3)
        report_md = r.get("writer", "")

        with dl_col1:
            st.download_button(
                label="MD",
                data=report_md,
                file_name=f"report_{ts}.md",
                mime="text/markdown",
                use_container_width=True,
            )
        with dl_col2:
            pdf_bytes = md_to_pdf_bytes(report_md, topic_val)
            if pdf_bytes:
                st.download_button(
                    label="PDF",
                    data=pdf_bytes,
                    file_name=f"report_{ts}.pdf",
                    mime="application/pdf",
                    use_container_width=True,
                )
            else:
                st.markdown('<span style="font-family:\'DM Mono\',monospace;font-size:0.65rem;color:#444;padding:0.45rem 0.8rem;display:block;text-align:center;">PDF*</span>', unsafe_allow_html=True)

        with dl_col3:
            docx_bytes = md_to_docx_bytes(report_md)
            if docx_bytes:
                st.download_button(
                    label="DOCX",
                    data=docx_bytes,
                    file_name=f"report_{ts}.docx",
                    mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    use_container_width=True,
                )
            else:
                st.markdown('<span style="font-family:\'DM Mono\',monospace;font-size:0.65rem;color:#444;padding:0.45rem 0.8rem;display:block;text-align:center;">DOCX*</span>', unsafe_allow_html=True)

    st.markdown('<div class="divider"></div>', unsafe_allow_html=True)

    # ── Results hero ──
    st.markdown(f"""
    <div class="results-hero">
        <div class="topic-label">Research Report</div>
        <h2>Results</h2>
        <div class="topic-name">Topic: {topic_val}</div>
    </div>""", unsafe_allow_html=True)

    # ── Final report ──
    if "writer" in r:
        st.markdown('<div class="report-panel"><div class="panel-label orange">📝 Final Research Report</div>', unsafe_allow_html=True)
        st.markdown(r["writer"])
        st.markdown("</div>", unsafe_allow_html=True)

    # ── Critic feedback ──
    if "critic" in r:
        st.markdown('<div class="feedback-panel"><div class="panel-label green">🧐 Critic Feedback</div>', unsafe_allow_html=True)
        st.markdown(r["critic"])
        st.markdown("</div>", unsafe_allow_html=True)

    st.markdown('<div class="notice">ResearchMind · Powered by LangChain multi-agent pipeline · Built with Streamlit</div>', unsafe_allow_html=True)

    # ── Install note if PDF/DOCX libraries missing ──
    if md_to_pdf_bytes("test", "test") is None or md_to_docx_bytes("test") is None:
        st.markdown("""
        <div style="margin-top:1rem;font-family:'DM Mono',monospace;font-size:0.68rem;color:#3a3250;text-align:center;">
            * Install <code>reportlab</code> and <code>python-docx</code> to enable PDF & DOCX downloads
        </div>""", unsafe_allow_html=True)