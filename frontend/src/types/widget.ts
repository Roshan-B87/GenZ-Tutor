// Mirrors backend/app/models/schemas.py — keep these two files in sync.

export interface SliderControl {
  type: "slider";
  label: string;
  range: [number, number];
  step: number;
  default?: number;
}

export interface ToggleControl {
  type: "toggle";
  label: string;
  default: boolean;
}

export type Control = SliderControl | ToggleControl;

export interface GraphWidget {
  widget: "graph";
  tutor_text: string;
  equation: string;
  x_range: [number, number];
  controls: SliderControl[];
}

export interface PhysicsBody {
  id: string;
  shape: "circle" | "rectangle";
  x: number;
  y: number;
  radius?: number;
  width?: number;
  height?: number;
  is_static: boolean;
  color?: string;
}

export interface PhysicsWidget {
  widget: "physics";
  tutor_text: string;
  gravity: number;
  bodies: PhysicsBody[];
  controls: SliderControl[];
}

export interface FlowNode {
  id: string;
  label: string;
}

export interface FlowEdge {
  source: string;
  target: string;
  label?: string;
  animated: boolean;
}

export interface FlowWidget {
  widget: "flow";
  tutor_text: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export type WidgetSpec = GraphWidget | PhysicsWidget | FlowWidget;

export interface AskResponse {
  spec: WidgetSpec;
}

// Discipline glow color per widget type — the app's signature visual cue.
export const GLOW_COLOR: Record<WidgetSpec["widget"], string> = {
  graph: "#22D3EE",
  physics: "#FFB020",
  flow: "#4AFFA0",
};
