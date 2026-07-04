# Guess The Song: Content & Economy System Specification

This document defines the mathematical models, procedural rules, and structure for the Guess The Song game engine.

---

## 1. Content Model (Paks & Song Difficulty Levels)

Each music pack contains 50 songs. The pack is balanced using a 4-level difficulty schema:

| Difficulty Level | Level Name | Target Mechanics | Distribution per Pack | Description |
|---|---|---|---|---|
| **Level 1** | Recognition | Auditory or visual memory | 25% (12-13 songs) | Obvious hits. High artist popularity and song popularity. |
| **Level 2** | Genre Reasoning | Contextual clue reasoning | 25% (12-13 songs) | Moderately popular tracks. Requires identifying sub-genres or styles. |
| **Level 3** | Knowledge Recall | Deep discography search | 25% (12-13 songs) | Less prominent tracks of major artists, or major hits of niche artists. |
| **Level 4** | Expert Confusion | Edge case differentiation | 25% (12-13 songs) | Deep cuts, b-sides, or highly obscure tracks requiring expert trivia. |

---

## 2. Quiz Engine & Distractor Rules

To prevent trivial guessing, distractors (incorrect answers) must be generated procedurally based on strict cognitive trap rules:

```
[Target Question / Correct Option]
              |
     +--------+--------+------------------+------------------+
     |                 |                  |                  |
[Trap 1: Era]    [Trap 2: Genre]   [Trap 3: Discography] [Trap 4: Fake]
```

### Distractor Categories (Traps)

1. **Same Era Confusion (Trap 1)**:
   - Distractors must come from the exact same era or decade (e.g. if the song is from 1991, distractors must be from 1989-1993).
2. **Genre Neighbors (Trap 2)**:
   - Distractors must share closely related genres (e.g. Synth-Pop and New Wave, or Grunge and Alternative Rock).
3. **Discography Proximity (Trap 3)**:
   - Distractors should be other tracks by the same artist, or side projects/collaborations.
4. **Fake Familiarity (Trap 4)**:
   - Distractors should use titles that sound semantically related to the song lyrics or song title (e.g., target song is "Purple Rain", a distractor could be "Purple Haze" or "Acid Rain").
5. **Semantic Misleading Option (Trap 5)**:
   - Distractors that match a common misconception or a synonym (e.g. translating or rephrasing the title).

---

## 3. Question Types

| Type | Name | Mechanics | Example (Bohemian Rhapsody) |
|---|---|---|---|
| **Type A** | Recognition | Identify artist/track from basic metadata or short sound clip. | *Кто написал знаменитую песню «Bohemian Rhapsody» группы Queen?* |
| **Type B** | Genre Reasoning | Determine style, era, or artist from descriptive clues. | *Какая песня 1975 года сочетает в себе балладу, оперный пассаж и хард-рок?* |
| **Type C** | Knowledge Recall | Deep factual trivia about the song's production, history, or lyrics. | *В каком альбоме группы Queen впервые была выпущена песня «Bohemian Rhapsody»?* |
| **Type D** | Expert Confusion | Features highly plausible distractors requiring exact knowledge of release details. | *Сколько времени заняла студийная запись «Bohemian Rhapsody» в 1975 году?* |

---

## 4. Economy Model (Coins System)

Rewards are earned per gameplay session based on performance:

\[ \text{Coins Earned} = \text{Base} \times \text{Accuracy Multiplier} \times \text{Difficulty Multiplier} \times \text{Streak Bonus} \]

### Mathematical Factors

* **Base**: \(2 \text{ coins}\) per correct answer.
* **Accuracy Multiplier**:
  - \(0\% \le A \le 30\%\): \(0.5\times\)
  - \(31\% \le A \le 60\%\): \(0.8\times\)
  - \(61\% \le A \le 80\%\): \(1.0\times\)
  - \(81\% \le A \le 100\%\): \(1.3\times\)
* **Difficulty Multiplier**:
  - Level 1: \(1.0\times\)
  - Level 2: \(1.3\times\)
  - Level 3: \(1.7\times\)
  - Level 4: \(2.5\times\)
* **Streak Bonus**:
  - 3 correct answers in a row: \(+10\%\)
  - 5 correct answers in a row: \(+25\%\)
  - 8 correct answers in a row: \(+40\%\)
* **Session Capping (Anti-Farm)**:
  - Max coins reward per session is capped at \(30 \text{ coins}\) to prevent botting or fast farming.

---

## 5. Experience & Skill Progression (XP)

XP is fully separated from Coins to measure skill rather than wallet size.

\[ \text{XP Earned} = \text{Correct Answers} \times \text{Difficulty Weight} \]

* **Difficulty Weights**:
  - Level 1: \(5 \text{ XP}\)
  - Level 2: \(10 \text{ XP}\)
  - Level 3: \(20 \text{ XP}\)
  - Level 4: \(40 \text{ XP}\)

---

## 6. Pack Progression (Unlock Costs)

Unlocking new packs requires spending Coins based on level and rarity:

\[ \text{Unlock Cost} = \text{Base Cost} \times \text{Level} \times \text{Rarity Factor} \]

* **Base Cost**: \(50 \text{ coins}\)
* **Rarity Factors**:
  - Common: \(1.0\times\)
  - Rare: \(1.2\times\)
  - Epic: \(1.5\times\)
  - Legendary: \(2.0\times\)

* **Standard Progression Baseline**:
  - Level 2: \(100 \text{ coins}\)
  - Level 3: \(180 \text{ coins}\)
  - Level 4: \(320 \text{ coins}\)

---

## 7. Daily Challenges

Daily challenges promote engagement with high-difficulty, high-reward configurations:
- Uses only **Level 3 and 4** questions.
- **Double XP Boost** to encourage competitive skill ranking.
- **Fixed Coin Reward** (e.g. flat 15 coins) with no session multiplier to prevent farming.

---

## 8. Anti-Farming & Guessing Resistance

To mitigate bot farming and random guessing:
* **Time-Velocity Tracking**: If a user answers within \(<1.5\text{ seconds}\) repeatedly, rewards for the session are throttled by \(50\%\) (detected as automated clicker or blind guessing).
* **Streak Abuse Correction**: If a streak is broken, the streak bonus resets immediately and cannot be recovered in the same round.
* **Accuracy Threshold**: Session accuracy below \(30\%\) sets the accuracy multiplier to \(0.5\times\) and disables the streak bonus for that session.
