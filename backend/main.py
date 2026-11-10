import os
import re
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel, Field

from agent.agents import web_extractor_agent, web_search_agent, writer_chain, critic_chain
from core.export import md_to_pdf_bytes, md_to_docx_bytes

app = FastAPI(title="ResearchMind API")

cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,https://your-frontend.vercel.app").split(",")
app.add_middleware(CORSMiddleware, allow_origins=[o.strip() for o in cors_origins],
                   allow_methods=["*"], allow_headers=["*"])


class ResearchRequest(BaseModel):
    topic: str = Field(min_length=3, max_length=200)


class ExportRequest(BaseModel):
    markdown: str = Field(min_length=1)


def _tool_output(resp) -> str:
    for m in reversed(resp["messages"]):
        if getattr(m, "type", "") == "tool" and str(getattr(m, "content", "")).strip():
            return m.content
    for m in reversed(resp["messages"]):
        if getattr(m, "type", "") in ("human", "tool"):
            continue
        c = str(getattr(m, "content", "")).strip()
        if c and not c.startswith('{"name"'):
            return c
    return "No tool output received."


def _links_output(resp) -> str:
    links = []
    for m in resp["messages"]:
        for tc in getattr(m, "tool_calls", None) or []:
            args = tc.get("args") or {}
            for v in ([args.get("links")] if isinstance(args.get("links"), str) else args.get("links") or []):
                if v and v not in links:
                    links.append(v)
        for u in re.findall(r"https?://[^\s\"']+", str(getattr(m, "content", ""))):
            if u not in links:
                links.append(u.rstrip(".,;"))
    links = [l for l in links if l.startswith("http")]
    out = _tool_output(resp)
    if links:
        return "Links to extract:\n" + "\n".join(links) + "\n\n" + out
    return out


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/research")
def research(req: ResearchRequest):
    topic = req.topic.strip()
    missing = [k for k in ("TAVILY_API_KEY", "OPENROUTER_API_KEY", "GROK_API_KEY") if not os.getenv(k)]
    if missing:
        raise HTTPException(status_code=503, detail=f"Backend not configured — missing env vars: {', '.join(missing)}")
    try:
        sr = web_search_agent().invoke(
            {"messages": [("user", f"Find recent, reliable and detailed information about: {topic}")]})
        search = _tool_output(sr)

        rr = web_extractor_agent().invoke(
            {"messages": [("user",
                f"Based on the following search results about '{topic}', "
                f"extract ALL URLs (up to 3) and scrape them for deeper content.\n\nSearch Results:\n{search}")]})
        reader = _links_output(rr)

        combined = f"SEARCH RESULTS:\n{search[:1000]}\n\nDETAILED SCRAPED CONTENT:\n{reader[:1000]}"
        report = writer_chain.invoke({"topic": topic, "research": combined})
        critique = critic_chain.invoke({"report": report})
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Research pipeline failed: {e}")

    return {"topic": topic, "search": search, "reader": reader, "report": report, "critique": critique}


def _attachment(filename: str) -> dict:
    return {"Content-Disposition": f"attachment; filename={uuid.uuid4().hex}_{filename}"}


@app.post("/api/export/md")
def export_md(req: ExportRequest):
    return Response(req.markdown.encode("utf-8"), media_type="text/markdown",
                    headers=_attachment("report.md"))


@app.post("/api/export/pdf")
def export_pdf(req: ExportRequest):
    try:
        data = md_to_pdf_bytes(req.markdown)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")
    return Response(data, media_type="application/pdf",
                    headers=_attachment("report.pdf"))


@app.post("/api/export/docx")
def export_docx(req: ExportRequest):
    try:
        data = md_to_docx_bytes(req.markdown)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"DOCX generation failed: {e}")
    return Response(data,
                    media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    headers=_attachment("report.docx"))
