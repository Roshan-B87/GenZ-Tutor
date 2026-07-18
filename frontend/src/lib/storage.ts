import { WidgetSpec } from "@/types/widget";

export interface HistoryItem {
  id: string;
  question: string;
  timestamp: number;
  spec: WidgetSpec;
  discipline: "graph" | "physics" | "flow";
}

const STORAGE_KEY = "synaptic_canvas_history";

export const saveToHistory = (question: string, spec: WidgetSpec) => {
  if (typeof window === "undefined") return;
  
  const history = getHistory();
  const newItem: HistoryItem = {
    id: crypto.randomUUID(),
    question,
    timestamp: Date.now(),
    spec,
    discipline: spec.widget,
  };
  
  // Keep only the last 50 items
  const updatedHistory = [newItem, ...history].slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
};

export const getHistory = (): HistoryItem[] => {
  if (typeof window === "undefined") return [];
  
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  
  try {
    return JSON.parse(data) as HistoryItem[];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const clearHistory = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteHistoryItem = (id: string) => {
  if (typeof window === "undefined") return;
  
  const history = getHistory();
  const updated = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
