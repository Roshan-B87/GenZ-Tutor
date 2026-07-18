# Frontend — Dynamic Synaptic Canvas

Next.js 15 / React 19 app that renders whatever widget spec the backend
returns (see backend/app/models/schemas.py for the JSON contract).

## Setup

    npm install
    cp .env.local.example .env.local

## Run

    npm run dev

Open http://localhost:3000. Make sure the backend is running on
http://localhost:8000 first (or update NEXT_PUBLIC_API_URL).

## Where to work

- `src/types/widget.ts` — TypeScript mirror of the backend Pydantic schemas.
- `src/components/WidgetRenderer.tsx` — routes a spec to the right widget.
- `src/components/widgets/` — CartesianGraph, PhysicsSandbox, FlowDiagram.
  This is where most of the interesting frontend work lives.
