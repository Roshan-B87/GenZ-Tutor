"use client";

import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";
import type { PhysicsWidget } from "@/types/widget";

const WIDTH = 640;
const HEIGHT = 360;

export default function PhysicsSandbox({ spec }: { spec: PhysicsWidget }) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      spec.controls.map((c) => [c.label, c.default ?? c.range[0]])
    )
  );
  // gravity is a special-cased control: if the LLM includes a control
  // literally labeled "Gravity", it drives the engine's gravity directly.
  const gravityOverride = values["Gravity"];

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    engine.gravity.y = spec.gravity;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: WIDTH,
        height: HEIGHT,
        wireframes: false,
        background: "transparent",
      },
    });

    const walls = [
      Matter.Bodies.rectangle(WIDTH / 2, HEIGHT + 10, WIDTH, 20, { isStatic: true }),
      Matter.Bodies.rectangle(-10, HEIGHT / 2, 20, HEIGHT, { isStatic: true }),
      Matter.Bodies.rectangle(WIDTH + 10, HEIGHT / 2, 20, HEIGHT, { isStatic: true }),
    ];

    const bodies = spec.bodies.map((b) => {
      const options: Matter.IBodyDefinition = {
        isStatic: b.is_static,
        render: {
          fillStyle: b.color ?? "#FFB020",
          strokeStyle: "#FFB020",
          lineWidth: 1,
        },
      };
      if (b.shape === "circle") {
        return Matter.Bodies.circle(b.x, b.y, b.radius ?? 20, options);
      }
      return Matter.Bodies.rectangle(
        b.x,
        b.y,
        b.width ?? 40,
        b.height ?? 40,
        options
      );
    });

    Matter.Composite.add(engine.world, [...walls, ...bodies]);

    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.Composite.clear(engine.world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
    // Re-running the whole sim on every slider tick is intentional here —
    // it keeps this starting version simple. For smoother control, swap to
    // mutating engine.gravity.y in a separate effect keyed on the value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec, gravityOverride]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={sceneRef}
        className="overflow-hidden rounded-lg bg-canvas-panel shadow-glow-physics"
        style={{ width: WIDTH, height: HEIGHT }}
      />

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
                className="h-1 flex-1 cursor-pointer accent-glow-physics"
              />
              <span className="w-14 text-right font-mono text-sm text-glow-physics">
                {values[control.label].toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
