"use client";

import { useMemo } from "react";
import type { FlowWidget } from "@/types/widget";

const HEIGHT = 360;
const NODE_W = 140;
const NODE_H = 48;
const MIN_GAP = 80;
const PADDING = 40;

/**
 * Auto-layout: nodes are placed in a single horizontal row in the order
 * they appear. If there are many nodes, the SVG width grows to accommodate
 * them, and the container handles horizontal scrolling.
 */
function layoutNodes(nodes: { id: string; label: string }[]) {
  const n = nodes.length;
  const nodeWidths = nodes.map((node) => Math.max(140, node.label.length * 8 + 40));
  const totalNodesWidth = nodeWidths.reduce((a, b) => a + b, 0);
  const requiredWidth = totalNodesWidth + (n - 1) * MIN_GAP + PADDING * 2;
  const svgWidth = Math.max(640, requiredWidth);
  const drawableWidth = svgWidth - PADDING * 2;
  
  const extraSpace = drawableWidth - totalNodesWidth;
  const gap = n > 1 ? Math.max(MIN_GAP, extraSpace / (n - 1)) : 0;
  const y = HEIGHT / 2 - NODE_H / 2;
  
  let currentX = PADDING;
  const positions: Record<string, { x: number; y: number; w: number }> = {};
  
  nodes.forEach((node, i) => {
    positions[node.id] = { x: currentX, y, w: nodeWidths[i] };
    currentX += nodeWidths[i] + gap;
  });
  
  return { svgWidth, positions };
}

export default function FlowDiagram({ spec }: { spec: FlowWidget }) {
  const { svgWidth, positions } = useMemo(
    () => layoutNodes(spec.nodes),
    [spec.nodes]
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full overflow-x-auto overflow-y-hidden pb-4 custom-scrollbar">
      <svg
        width={svgWidth}
        height={HEIGHT}
        className="rounded-lg bg-canvas-panel shadow-glow-flow flex-shrink-0"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4AFFA0" />
          </marker>
        </defs>

        {spec.edges.map((edge, i) => {
          const from = positions[edge.source];
          const to = positions[edge.target];
          if (!from || !to) return null;
          const x1 = from.x + from.w;
          const y1 = from.y + NODE_H / 2;
          const x2 = to.x;
          const y2 = to.y + NODE_H / 2;
          const midX = (x1 + x2) / 2;

          return (
            <g key={i}>
              <path
                d={`M ${x1} ${y1} L ${x2} ${y2}`}
                stroke="#4AFFA0"
                strokeWidth={2}
                fill="none"
                markerEnd="url(#arrow)"
                strokeDasharray={edge.animated ? "6 5" : undefined}
                style={{ filter: "drop-shadow(0 0 4px #4AFFA0)" }}
              >
                {edge.animated && (
                  <animate
                    attributeName="stroke-dashoffset"
                    from="22"
                    to="0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              {edge.label && (
                <text
                  x={midX}
                  y={y1 - 8}
                  fill="#8891A3"
                  fontSize={11}
                  fontFamily="monospace"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {spec.nodes.map((node) => {
          const pos = positions[node.id];
          return (
            <g key={node.id}>
              <rect
                x={pos.x}
                y={pos.y}
                width={pos.w}
                height={NODE_H}
                rx={8}
                fill="#12141C"
                stroke="#4AFFA0"
                strokeWidth={1.5}
                style={{ filter: "drop-shadow(0 0 5px #4AFFA0)" }}
              />
              <text
                x={pos.x + pos.w / 2}
                y={pos.y + NODE_H / 2 + 4}
                fill="#E8EAF0"
                fontSize={13}
                fontFamily="var(--font-inter), sans-serif"
                textAnchor="middle"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
