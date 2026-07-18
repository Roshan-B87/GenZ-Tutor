import type { AskResponse, WidgetSpec } from "@/types/widget";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function askTutor(question: string): Promise<AskResponse> {
  const res = await fetch(`${API_URL}/api/tutor/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Tutor request failed (${res.status}): ${detail}`);
  }

  return res.json();
}

export interface StreamCallbacks {
  onStatus?: (msg: string) => void;
  onProgress?: (tokens: number) => void;
  onComplete?: (spec: WidgetSpec) => void;
  onError?: (err: string) => void;
}

export async function askTutorStream(question: string, callbacks: StreamCallbacks): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/api/tutor/ask/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    if (!res.ok) {
      const detail = await res.text();
      callbacks.onError?.(`Request failed: ${detail}`);
      return;
    }

    if (!res.body) {
      callbacks.onError?.("No response body");
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const data = JSON.parse(line);
          if (data.type === "status") {
            callbacks.onStatus?.(data.message);
          } else if (data.type === "progress") {
            callbacks.onProgress?.(data.tokens);
          } else if (data.type === "widget") {
            callbacks.onComplete?.(data.spec);
          } else if (data.type === "error") {
            callbacks.onError?.(data.message);
          }
        } catch (e) {
          console.error("Failed to parse stream line", line, e);
        }
      }
    }
  } catch (err) {
    callbacks.onError?.(err instanceof Error ? err.message : "Unknown error");
  }
}

export async function fetchExamples(): Promise<WidgetSpec[]> {
  try {
    const res = await fetch(`${API_URL}/api/tutor/examples`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.examples || [];
  } catch (e) {
    console.error("Failed to fetch examples", e);
    return [];
  }
}
