"use client";

import { useMemo, useState } from "react";
import { evaluate } from "mathjs";
import type { GraphWidget } from "@/types/widget";

const WIDTH = 640;
const HEIGHT = 360;
const PADDING = 32;

export default function CartesianGraph({ spec }: { spec: GraphWidget }) {
  // One state slot per control, keyed by label, seeded with each control's default.
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      spec.controls.map((c) => [c.label, c.default ?? c.range[0]])
    )
  );

  const [xMin, xMax] = spec.x_range;

  const points = useMemo(() => {
    const scope = { ...values };
    const pts: [number, number][] = [];
    const steps = 240;
    for (let i = 0; i <= steps; i++) {
      const x = xMin + ((xMax - xMin) * i) / steps;
      try {
        const y = evaluate(spec.equation, { ...scope, x });
        if (typeof y === "number" && Number.isFinite(y)) {
          pts.push([x, y]);
        }
      } catch {
        // skip points where the equation can't evaluate (e.g. singularities)
      }
    }
    return pts;
  }, [spec.equation, values, xMin, xMax]);

  const yValues = points.map((p) => p[1]);
  const yMin = Math.min(-1, ...yValues);
  const yMax = Math.max(1, ...yValues);

  const toSvgX = (x: number) =>
    PADDING + ((x - xMin) / (xMax - xMin)) * (WIDTH - 2 * PADDING);
  const toSvgY = (y: number) =>
    HEIGHT -
    PADDING -
    ((y - yMin) / (yMax - yMin || 1)) * (HEIGHT - 2 * PADDING);

  const path = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${toSvgX(x)} ${toSvgY(y)}`)
    .join(" ");

  const zeroY = toSvgY(0);
  const zeroX = toSvgX(0);

  return (
    <div className="flex flex-col items-center gap-6">
      <svg
        width={WIDTH}
        height={HEIGHT}
        className="rounded-lg bg-canvas-panel shadow-glow-graph"
      >
        {/* axes */}
        <line
          x1={PADDING}
          y1={zeroY}
          x2={WIDTH - PADDING}
          y2={zeroY}
          stroke="#2A2E3A"
          strokeWidth={1}
        />
        <line
          x1={zeroX}
          y1={PADDING}
          x2={zeroX}
          y2={HEIGHT - PADDING}
          stroke="#2A2E3A"
          strokeWidth={1}
        />
        {/* function curve */}
        <path
          d={path}
          fill="none"
          stroke="#22D3EE"
          strokeWidth={2.5}
          style={{ filter: "drop-shadow(0 0 6px #22D3EE)" }}
        />
        <text x={PADDING} y={20} fill="#8891A3" fontSize={12} fontFamily="monospace">
          y = {spec.equation}
        </text>
      </svg>

      {spec.controls.length > 0 && (
        <div className="flex w-full max-w-[640px] flex-col gap-4">
          {spec.controls.map((control) => (
            <div key={control.label} className="flex items-center gap-4">
              <label className="w-40 shrink-0 font-mono text-sm text-ink-muted">
                {control.label}
              </label>
              <input
                type="range"
                min={control.range[0]}
                max={control.range[1]}
                step={control.step}
                value={values[control.label]}
                onChange={(e) =>
                  setValues((v) => ({
                    ...v,
                    [control.label]: Number(e.target.value),
                  }))
                }
                className="h-1 flex-1 cursor-pointer accent-glow-graph"
              />
              <span className="w-14 text-right font-mono text-sm text-glow-graph">
                {values[control.label].toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
