from io import BytesIO


def md_to_pdf_bytes(md_text: str) -> bytes:
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
    from reportlab.lib.units import cm
    import re

    buf = BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=A4, leftMargin=2.5 * cm, rightMargin=2.5 * cm,
                            topMargin=2.5 * cm, bottomMargin=2.5 * cm)
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
            clean = re.sub(r"\*(.*?)\*", r"<i>\1</i>", clean)
            story.append(Paragraph(clean, styles["Normal"]))
        else:
            story.append(Spacer(1, 0.3 * cm))
    doc.build(story)
    return buf.getvalue()


def md_to_docx_bytes(md_text: str) -> bytes:
    from docx import Document

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

