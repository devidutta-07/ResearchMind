const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface ResearchResult {
  topic: string;
  search: string;
  reader: string;
  report: string;
  critique: string;
}

async function parseError(res: Response): Promise<never> {
  const body = await res.json().catch(() => null);
  throw new Error(body?.detail ?? `Request failed (${res.status})`);
}

export const runResearch = async (topic: string): Promise<ResearchResult> => {
  const res = await fetch(`${API_URL}/api/research`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });
  if (!res.ok) await parseError(res);
  return res.json();
};

export const downloadExport = async (
  markdown: string,
  format: "md" | "pdf" | "docx"
): Promise<void> => {
  const res = await fetch(`${API_URL}/api/export/${format}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown }),
  });
  if (!res.ok) await parseError(res);

  const blob = await res.blob();
  const disposition = res.headers.get("Content-Disposition") ?? "";
  const filename = disposition.match(/filename=([^;]+)/)?.[1] ?? `report.${format}`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
