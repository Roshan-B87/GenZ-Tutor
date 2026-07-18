"""
Widget schema contract.

This is the single most important file in the backend. Every widget the LLM
generates must validate against one of these models. The frontend's
WidgetRenderer (src/components/WidgetRenderer.tsx) expects JSON shaped
exactly like this, field for field, so if you change something here, mirror
the change in frontend/src/types/widget.ts.

Add a new widget type by:
  1. Adding a new *Widget model below (give it a unique `widget` literal)
  2. Adding it to the WidgetSpec union
  3. Adding a matching React component + case in WidgetRenderer.tsx
"""

from typing import List, Literal, Optional, Tuple, Union

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Shared building blocks
# ---------------------------------------------------------------------------

class SliderControl(BaseModel):
    type: Literal["slider"] = "slider"
    label: str
    range: Tuple[float, float]
    step: float = 0.1
    default: Optional[float] = None


class ToggleControl(BaseModel):
    type: Literal["toggle"] = "toggle"
    label: str
    default: bool = False


Control = Union[SliderControl, ToggleControl]


# ---------------------------------------------------------------------------
# 1. CartesianGraph — algebra / calculus / trig
# ---------------------------------------------------------------------------

class GraphWidget(BaseModel):
    widget: Literal["graph"] = "graph"
    tutor_text: str
    equation: str = Field(..., description="JS-evaluable expression in terms of x, e.g. 'sin(x)/x'")
    x_range: Tuple[float, float] = (-10, 10)
    controls: List[SliderControl] = []


# ---------------------------------------------------------------------------
# 2. PhysicsSandbox — mechanics, gravity, collisions (Matter.js on frontend)
# ---------------------------------------------------------------------------

class PhysicsBody(BaseModel):
    id: str
    shape: Literal["circle", "rectangle"]
    x: float
    y: float
    radius: Optional[float] = None
    width: Optional[float] = None
    height: Optional[float] = None
    is_static: bool = False
    color: Optional[str] = None


class PhysicsWidget(BaseModel):
    widget: Literal["physics"] = "physics"
    tutor_text: str
    gravity: float = 1.0
    bodies: List[PhysicsBody]
    controls: List[SliderControl] = []


# ---------------------------------------------------------------------------
# 3. FlowDiagram — chemistry / biology processes, algorithms
# ---------------------------------------------------------------------------

class FlowNode(BaseModel):
    id: str
    label: str


class FlowEdge(BaseModel):
    source: str
    target: str
    label: Optional[str] = None
    animated: bool = True


class FlowWidget(BaseModel):
    widget: Literal["flow"] = "flow"
    tutor_text: str
    nodes: List[FlowNode]
    edges: List[FlowEdge]


# ---------------------------------------------------------------------------
# Union + request/response envelopes
# ---------------------------------------------------------------------------

WidgetSpec = Union[GraphWidget, PhysicsWidget, FlowWidget]


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)


class AskResponse(BaseModel):
    spec: WidgetSpec
