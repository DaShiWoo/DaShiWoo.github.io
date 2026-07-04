# Architecture - Clean MVP Design

## Core Principle: Single Source of Truth

All game state and business logic lives in **one place**: `GameEngine`.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    GameEngine                        │
│  ─────────────────────────────────────────────────── │
│  INTERNAL STATE (private, mutable):                  │
│    - currentPhase: GamePhase                         │
│    - teams: MutableList<Team>                        │
│    - buzzedTeamId: String?                          │
│    - activeTeamId: String?                          │
│    - currentRoundNumber: Int                        │
│                                                      │
│  PUBLIC API (business logic):                        │
│    - startGame(teamList)                             │
│    - selectTeam(teamId)                              │
│    - registerBuzz(teamId)                            │
│    - submitAnswer(teamId, answer)                   │
│    - startNextRound()                                │
│    - endGame()                                       │
│                                                      │
│  READ-ONLY ACCESSORS:                                │
│    - getGameState(): GameState (immutable snapshot) │
│    - canBuzz(): Boolean                              │
└───────────────────────┬─────────────────────────────┘
                        │
            ┌───────────┴───────────┐
            │                       │
            ▼                       ▼
    ┌──────────────┐        ┌──────────────┐
    │  GameState   │        │  GameEvent  │
    │ (Snapshot)   │        │(Notification)│
    │              │        │              │
    │ For UI       │        │ For UI       │
    │ rendering    │        │ updates      │
    └──────────────┘        └──────────────┘
```

---

## Component Responsibilities

### GameEngine (SINGLE OWNER)
- Owns ALL internal mutable state
- Contains ALL business logic
- Emits events for UI notifications
- Exposes immutable GameState snapshot

### GameState (UI SNAPSHOT ONLY)
- Immutable data class
- No logic, no mutations
- Pure rendering data for UI

### GameEvent (NOTIFICATIONS ONLY)
- Minimal event types
- PhaseChanged, TeamBuzzed, ScoreUpdated, AnswerSubmitted
- One-way communication: Engine → UI

---

## MVP Game Loop

```
LOBBY 
  ↓ [startGame()]
TEAM_SELECT
  ↓ [selectTeam(teamId)]
ROUND_PLAYING
  ↓ [registerBuzz(teamId)]
BUZZ_LOCKED
  ↓ [submitAnswer(teamId, answer)]
ROUND_END
  ↓ [startNextRound()] → back to TEAM_SELECT
  OR [endGame()] → GAME_END
```

---

## What Was Removed

| Deleted | Reason |
 GameStateManager | State ownership moved to GameEngine |
| BuzzManager | Buzz logic integrated into GameEngine |
| GameFlowController | Flow control is part of GameEngine |

---

## Key Design Decisions

1. **No state machines** - Simple phase transitions via if/else
2. **No layered architecture** - Engine owns everything
3. **No separate buzz system** - Integrated into engine
4. **Minimal events** - Only what UI needs to know
5. **Immutable snapshots** - GameState is read-only for UI
