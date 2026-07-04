# Guess The Song: Economy Validation Report

This report evaluates the progression speed, reward distribution, inflation risk, and potential exploits of the rebuilt economy system.

---

## 1. Mathematical Analysis of Reward Curves

Using the formula:
\[ \text{Coins} = \text{Base (2)} \times \text{Accuracy} \times \text{Difficulty} \times \text{Streak Bonus} \]

Let us calculate the expected coin payout for a 10-question session across various performance and difficulty profiles:

### Scenario A: Perfect Performance (10/10 Correct, 100% Accuracy)
* **Accuracy Multiplier**: \(1.3\times\)
* **Streak Bonus**: \(1.4\times\) (8+ streak achieved)
* **Calculations**:
  - **Level 1 (Diff 1.0)**: \(2 \times 1.3 \times 1.0 \times 1.4 \times 10 = 36.4 \text{ coins}\) (Clipping at 30 cap)
  - **Level 2 (Diff 1.3)**: \(2 \times 1.3 \times 1.3 \times 1.4 \times 10 = 47.3 \text{ coins}\) (Clipping at 30 cap)
  - **Level 3 (Diff 1.7)**: \(2 \times 1.3 \times 1.7 \times 1.4 \times 10 = 61.8 \text{ coins}\) (Clipping at 30 cap)
  - **Level 4 (Diff 2.5)**: \(2 \times 1.3 \times 2.5 \times 1.4 \times 10 = 91.0 \text{ coins}\) (Clipping at 30 cap)

### Scenario B: Average Performance (7/10 Correct, 70% Accuracy)
* **Accuracy Multiplier**: \(1.0\times\)
* **Streak Bonus**: \(1.1\times\) (Max streak of 3 achieved)
* **Calculations**:
  - **Level 1 (Diff 1.0)**: \(2 \times 1.0 \times 1.0 \times 1.1 \times 7 = 15.4 \text{ coins}\)
  - **Level 2 (Diff 1.3)**: \(2 \times 1.0 \times 1.3 \times 1.1 \times 7 = 20.0 \text{ coins}\)
  - **Level 3 (Diff 1.7)**: \(2 \times 1.0 \times 1.7 \times 1.1 \times 7 = 26.1 \text{ coins}\)
  - **Level 4 (Diff 2.5)**: \(2 \times 1.0 \times 2.5 \times 1.1 \times 7 = 38.5 \text{ coins}\) (Clipping at 30 cap)

---

## 2. Issues & Exploits List

### Issue 1: Difficulty Reward Flattening (De-incentivization of L3/L4)
* **Severity**: **HIGH**
* **Description**: Because the hard cap is set to a flat \(30 \text{ coins}\), an average player playing Level 4 hits the cap, and a perfect player playing Level 1 also hits the cap. This eliminates the financial incentive to unlock and play high-difficulty content (which requires significantly more mental effort).
* **Predicted Player Behavior**: Players will unlock Level 2/3/4 but choose to only farm Level 1 because it is easier and still reaches the maximum possible reward.
* **Recommended Fix**: Implement a **Dynamic Cap** scaled by difficulty level:
  - Level 1 Session Cap: \(20 \text{ coins}\)
  - Level 2 Session Cap: \(30 \text{ coins}\)
  - Level 3 Session Cap: \(45 \text{ coins}\)
  - Level 4 Session Cap: \(60 \text{ coins}\)

### Issue 2: Blind-Clicking Farm Loop (No Penalty for Failing)
* **Severity**: **CRITICAL**
* **Description**: A bot or low-effort player spamming choices randomly will get \(25\%\) accuracy on average. A \(2.5/10\) score on Level 1 pays out:
  \(2 \times 0.5 \text{ (Accuracy)} \times 1.0 \text{ (Diff)} \times 2.5 = 2.5 \text{ coins}\).
  If a session can be spammed in 5 seconds by double-clicking, the player farms \(30 \text{ coins/minute}\) without reading any questions.
* **Predicted Player Behavior**: Bots will auto-click to farm unlimited coins and unlock all packs in under an hour.
* **Recommended Fix**:
  1. Set a **minimum session time** of \(15\text{ seconds}\) before rewards are allowed.
  2. Implement **Time-Velocity Throttling**: If more than 3 questions are answered in under \(1.2 \text{ seconds}\) each, the session reward is set to \(0\).
  3. Change the Accuracy Multiplier for \(0-30\%\) from \(0.5\times\) to \(0\times\) (no coins awarded for random guessing).

### Issue 3: Early-Game Progression Bottleneck
* **Severity**: **MEDIUM**
* **Description**: Level 1 (Common) packs are easy, but with the flat cost, a player earning 10-15 coins per session takes 7-10 sessions to unlock a Level 2 pack.
* **Predicted Player Behavior**: Grinding L1 repeatedly might feel boring to trivia-lovers early on, causing early churn.
* **Recommended Fix**: Add a first-time unlock discount or starter coin bonus (e.g. 50 coins upon completing onboarding) to allow the player to unlock their first custom pack immediately.

---

## 3. Progression Timeline Estimation

With the recommended **Dynamic Cap** and **0x multiplier for <30% accuracy**:

* **Unlocking Level 2 (Cost 100)**:
  - Takes ~6-8 average sessions (\(\approx 15\) minutes of gameplay).
* **Unlocking Level 3 (Cost 180)**:
  - Takes ~9-11 average Level 2 sessions (\(\approx 20\) minutes).
* **Unlocking Level 4 (Cost 320)**:
  - Takes ~12-14 average Level 3 sessions (\(\approx 30\) minutes).

This creates a healthy progression funnel of about 1.5 - 2 hours of active play to unlock the expert tier, which is optimal for retention and offline play loops.
