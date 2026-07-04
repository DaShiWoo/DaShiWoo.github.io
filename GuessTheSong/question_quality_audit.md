# Guess The Song: Quiz Question Quality Audit

This document audits a sample of trivia questions from the game database using the criteria of guess-proofing, cognitive traps, distractor relevance, and bias.

---

## Audit Summary

| Sample # | Song & Artist | Question | Target Level | Verdict | Primary Issue |
|---|---|---|---|---|---|
| **1** | *Bohemian Rhapsody* - Queen | Who wrote it? | Level 1 | **PASS** | Prominent Artist Bias (Expected for L1) |
| **2** | *Sandstorm* - Darude | Roland synth model? | Level 4 | **PASS** | None (Excellent expert-level design) |
| **3** | *Around the World* - Daft Punk | Number of repetitions? | Level 3 | **FAIL** | Specific Number Bias (Stands out from round options) |
| **4** | *Stairway to Heaven* - Led Zeppelin| Intro instrument? | Level 2 | **FAIL** | Logical Obviousness / Low-relevant distractors |

---

## Detailed Audits

### Sample Question 1: Queen - *Bohemian Rhapsody*
* **Question**: *Кто написал знаменитую песню «Bohemian Rhapsody» группы Queen?*
* **Options**:
  - A. Брайан Мэй
  - B. **Фредди Меркьюри** (Correct)
  - C. Роджер Тейлор
  - D. Джон Дикон
* **Analysis**:
  - **Guessability**: Moderate. Because Freddie Mercury is the most famous member of Queen, casual listeners will guess him.
  - **Cognitive Trap**: Distractors are all the actual members of the band (Discography Proximity). This is appropriate for a Level 1 recognition question.
  - **Verdict**: **PASS** (Highly suited for Level 1).
  - **Improvement**: To elevate this to Level 3, target a song where songwriting is less famous:
    - *Кто из участников Queen написал стадионный хит «Another One Bites the Dust»?* (Correct: Джон Дикон).

---

### Sample Question 2: Darude - *Sandstorm*
* **Question**: *Какой легендарный синтезатор Roland использовался для создания лид-звука в «Sandstorm»?*
* **Options**:
  - A. **JP-8080** (Correct)
  - B. TB-303
  - C. Juno-106
  - D. D-50
* **Analysis**:
  - **Guessability**: Extremely low. Impossible to guess without specific electronic music gear knowledge.
  - **Cognitive Trap**: Excellent "Genre Neighbors" distractors. Every option is a legendary Roland synthesizer (TB-303 for Acid House, Juno-106 for Classic House, D-50 for 80s Pop).
  - **Verdict**: **PASS** (Outstanding design for Level 4).

---

### Sample Question 3: Daft Punk - *Around the World*
* **Question**: *Сколько раз повторяется фраза «Around the world» в оригинальной альбомной версии трека Daft Punk?*
* **Options**:
  - A. 50 раз
  - B. 100 раз
  - C. **144 раза** (Correct)
  - D. 200 раз
* **Analysis**:
  - **Guessability**: High due to formatting. The correct option (`144`) is a specific, non-round number, while all distractors are highly rounded numbers (`50`, `100`, `200`). Experienced trivia players will immediately spot that the specific number is the correct answer without any music knowledge.
  - **Verdict**: **FAIL** (Specific Number Bias).
  - **Fix Suggestion**: Make all distractors specific, non-round numbers of similar magnitude.
  - **Improved Version**:
    - Options: `["120 раз", "144 раза", "168 раз", "192 раза"]`

---

### Sample Question 4: Led Zeppelin - *Stairway to Heaven*
* **Question**: *На каком инструменте исполняется знаменитая вступительная мелодия в «Stairway to Heaven»?*
* **Options**:
  - A. **Акустическая гитара** (Correct)
  - B. Клавесин
  - C. Скрипка
  - D. Пианино
* **Analysis**:
  - **Guessability**: Very high. Led Zeppelin is a guitar rock band. Distractors like Harpsichord, Violin, and Piano are classical instruments rarely heard in classic hard-rock intros, making them logically obvious incorrect choices.
  - **Verdict**: **FAIL** (Obvious Distractors / No Trap).
  - **Fix Suggestion**: Ask about the unique secondary instrument in the intro (the recorders/woodwinds) or use actual guitar-adjacent options (e.g. 12-string guitar, mandolin, lute) to confuse the player.
  - **Improved Version**:
    - *Какой старинный духовой инструмент создает меланхоличное сопровождение гитаре во вступлении к «Stairway to Heaven»?*
    - Options: `["Блокфлейта (Recorder)", "Пан-флейта", "Окарина", "Кларнет"]` (Correct: Блокфлейта).
