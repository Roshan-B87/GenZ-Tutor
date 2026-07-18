"use client";

import type { WidgetSpec } from "@/types/widget";
import CartesianGraph from "@/components/widgets/CartesianGraph";
import PhysicsSandbox from "@/components/widgets/PhysicsSandbox";
import FlowDiagram from "@/components/widgets/FlowDiagram";

/**
 * The engine described in the project brief: takes whatever JSON the
 * backend/LLM produced and maps it to the matching visualization
 * component. Add a new widget type in three places: schemas.py,
 * types/widget.ts, and a `case` here.
 */
export default function WidgetRenderer({ spec }: { spec: WidgetSpec }) {
  switch (spec.widget) {
    case "graph":
      return <CartesianGraph spec={spec} />;
    case "physics":
      return <PhysicsSandbox spec={spec} />;
    case "flow":
      return <FlowDiagram spec={spec} />;
    default:
      // Exhaustiveness check — TypeScript will flag this if a new widget
      // type is added to the union but not handled above.
      return null;
  }
}
