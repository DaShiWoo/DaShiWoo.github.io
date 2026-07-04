# Architectural Decisions

## ADR-001

Decision:
GameFlowController is the single source of truth.

Reason:
Prevents duplicated state ownership.

Status:
Accepted

---

## ADR-002

Decision:
GameStateManager is forbidden.

Reason:
Creates duplicated ownership and God Object risk.

Status:
Accepted

---

## ADR-003

Decision:
No additional rule layer.

Reason:
MVP scope.
State machine already enforces rules.

Status:
Accepted