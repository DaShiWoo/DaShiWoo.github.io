# Guess The Song — Developer Context Package v1.0

This document serves as the complete, single-source developer context for the Android application **Guess The Song**. It contains all the context, rules, architectures, and state information required for any new Antigravity chat session to resume development immediately.

---

## 1. PROJECT OVERVIEW

### What this application is
**Guess The Song** is a pass-and-play local multiplayer music trivia game for Android. Players gather in teams, listen to short audio segments, buzz in, and guess the correct song title or artist from multiple choices. It also features a solo-friendly text-based "Music Facts" mode for testing trivia knowledge about songs, artists, and music history.

### Target Audience
Local groups, families, party-goers, and music trivia enthusiasts. The pass-and-play mechanic makes it ideal for group settings, while the Music Facts mode caters to solo players.

### Supported Game Modes
1. **Quiz Mode**: Classic competitive multiplayer mode. Teams listen to a song segment, buzz in, and select the correct answer from 4 options. Points are awarded for correct answers and deducted for wrong ones.
2. **Pair Mode**: A cooperative or casual split-screen/local team mode where players guess the song, but the interface, scoring rules, and thematic color palettes change (using a softer, pink/magenta tint).
3. **Music Facts Mode**: A text-only solo-friendly trivia mode using pre-generated packs. Players answer questions on song release years, genres, eras, or artists. Features a daily challenge system with medals.

### Current MVP Scope
The app is a fully offline, local-only Android application. It utilizes local device music files (imported manually or scanned) and assets to play audio. No backend server, cloud synchronization, or external login systems exist.

### Long-Term Vision
A scalable, community-driven offline and online music trivia platform where users can import their playlists, download curated content packs, unlock levels, earn coins, and compete globally.

---

## 2. CURRENT ARCHITECTURE

### Folder Structure
```
D:\Projects\GuessTheSong\android-app\app\src\main\java\com\daisl\guessthesong
├── core
│   ├── ads
│   │   ├── AdEvent.kt
│   │   └── AdsManager.kt
│   ├── audio
│   │   ├── AudioPlayer.kt
│   │   ├── ExoAudioPlayer.kt
│   │   └── SoundManager.kt
│   ├── facts
│   │   └── MusicFactsEngine.kt
│   ├── game
│   │   ├── GameEngine.kt
│   │   └── GameEvent.kt
│   ├── model
│   │   ├── AppSettingsState.kt
│   │   ├── GameMode.kt
│   │   ├── GamePhase.kt
│   │   ├── GameState.kt
│   │   ├── MusicFactsState.kt
│   │   ├── Pack.kt
│   │   ├── SelectedSongsStorage.kt
│   │   ├── Song.kt
│   │   ├── SongCatalogParser.kt
│   │   ├── SongDifficulty.kt
│   │   ├── Team.kt
│   │   └── providers
│   │       ├── AssetSongProvider.kt
│   │       ├── DeviceSongProvider.kt
│   │       └── MusicSourceRepository.kt
│   └── progression
│       └── ProgressionManager.kt
└── ui
    ├── GameScreen.kt
    ├── GameThemeWrapper.kt
    └── GameViewModel.kt
```

### Major Modules
- **`core/game`**: Houses `GameEngine.kt` which is the single source of truth for the active audio game state machine.
- **`core/facts`**: Houses `MusicFactsEngine.kt`, which runs the state machine for the text-only trivia mode.
- **`core/audio`**: Wraps MediaPlayer/ExoPlayer and SoundPool for background music segment playback and buzz/correct/wrong sound effects.
- **`core/model`**: Houses domain entities, data classes, and song/pack parsers.
- **`core/ads`**: Lightweight monetization abstraction layer.
- **`core/progression`**: Persistent Level, XP, Coins, and Stats management.
- **`ui`**: Jetpack Compose presentation layer using a single-Activity, single-ViewModel setup.

### GameEngine Responsibilities
- Manages the entire state flow of Quiz/Pair games (`Lobby` ➔ `RoundPlaying` ➔ `BuzzLocked` ➔ `RoundEnd` ➔ `GameEnd`).
- Validates scores, active teams, round numbers, and option generation.
- Decoupled from Android Framework classes (pure Kotlin logic).
- Emits events (`GameEvent`) to communicate transitions (like segment play requests).

### ViewModel Responsibilities
- Coordinates interactions between the engines (`GameEngine`, `MusicFactsEngine`), the repositories, the audio layers, the ad manager, and the progression system.
- Exposes UI-observables (`StateFlow`) for settings, loaded songs, packs, onboarding, and player stats.
- Handles background coroutine operations (e.g. music scanning, SharedPreferences updates).

### Audio Layer
- **`ExoAudioPlayer`**: Implementation of `AudioPlayer` using Google ExoPlayer to stream, seek, and play local audio files and URIs.
- **`SoundManager`**: Utilizes Android SoundPool to play ultra-low-latency game sound effects (buzzers, correct answers, wrong answers).

### Music Providers & Repository
- **`AssetSongProvider`**: Loads songs from internal application assets (used previously for demo audio).
- **`DeviceSongProvider`**: Scans the user's local external device storage (under `Music/` folder or via custom file selection) using MediaStore queries.
- **`MusicSourceRepository`**: Merges audio files from providers, filters out unsupported formats, and validates file formats (supporting `.mp3`, `.m4a`, and `.wav`).

### Settings
- **`AppSettingsState`**: Model representing player-defined options: default game mode (Quiz/Pair), segment duration (3s/5s/7s), sound effects toggle, and language. Stored persistently in SharedPreferences (`app_settings`).

### Localization
- App supports English (`en`), Russian (`ru`), and Ukrainian (`uk`) locales.
- Localization is switched dynamically at runtime inside the Compose tree via configurations update inside `GameScreen.kt`.

### Ads
- Decoupled monetization abstraction. `AdsManager` controls display logic and tracks facts mode interaction counts, triggering callbacks in the UI layer without real SDK dependencies.

### Persistence
- Player profile stats, progression, coins, and unlocks are stored inside `player_progression` SharedPreferences. App settings reside in `app_settings` SharedPreferences.

---

## 3. IMPLEMENTED FEATURES

### 1. Unified Onboarding Overlay
- **Purpose**: Welcomes players, explains mechanics/modes, introduces local file scanning, and guides the user through initial setup.
- **Main Classes**: `UnifiedOnboardingOverlay` (in `GameScreen.kt`), `GameViewModel` (onboarding flags).
- **Status**: Stable. Persistent via `onboarding_completed` preference.
- **Limitations**: Step 4 requires Android runtime storage permission setup which is handled sequentially.

### 2. Music Coins & Unlocks
- **Purpose**: Retention system where players earn coins by playing and spend them to unlock content packs.
- **Main Classes**: `ProgressionManager.kt`, `GameViewModel.kt`, `LobbyScreen`.
- **Status**: Stable. Custom unlock dialog wired.
- **Limitations**: Cost is hardcoded to 100 coins per pack.

### 3. Daily Facts Challenge
- **Purpose**: Rewards players with coin bonuses (Bronze, Silver, Gold, Platinum, Legend medals) for completing a daily 10-question trivia game.
- **Main Classes**: `ProgressionManager.kt`, `MusicFactsEndScreen` (medal display).
- **Status**: Stable. Uses date-checking (`YYYY-MM-DD`) to prevent multiple reward claims.

### 4. Player Statistics Profile
- **Purpose**: Displays persistent stats: XP, Level, total coins earned, packs unlocked, and challenges completed.
- **Main Classes**: `PlayerStatistics`, `SettingsScreen` (stats card).
- **Status**: Stable. Resets/reloads automatically on purchases or rewards.

---

## 4. GAMEPLAY FLOW

### 1. App Launch
- Check `onboarding_completed` preference.
- If incomplete: Show `UnifiedOnboardingOverlay` (6 steps).
- If complete: Enter **Lobby Screen**.

### 2. Lobby Screen
- Displays the Player Dashboard at the top (Level, XP bar, Coins wallet).
- Displays the Daily Challenge banner button (active or completed ✓).
- **Game Mode Selection**: Quiz, Pair, or Music Facts.
- **Teams Configuration**: Add teams (minimum 2 for Quiz, 1 for Facts/Pair).
- **Packs / Song Count**:
  - Quiz/Pair: Displays loaded song count. If empty, displays `EmptyStateCard` prompting Scan/Import/Help.
  - Music Facts: Displays pack cards list. Locked packs require 100 coins and must be unlocked before selection.
- Clicking **"Start Game"** triggers `AdsManager.shouldShowAd` and begins the match.

### 3. Gameplay Screen
- **Quiz / Pair Mode**:
  - `TeamSelectScreen`: Displays active team selection.
  - `RoundPlayingScreen`: Plays audio segment. Active team buzzes in.
  - `BuzzLockedScreen`: Selected team has limited time to choose from 4 options.
  - `RoundEndScreen`: Displays points awarded and round result.
- **Music Facts Mode**:
  - `MusicFactsQuestionScreen`: Displays a text question and 4 choices with a progress indicator.
  - `MusicFactsAnswerScreen`: Shows whether the submitted choice was correct.

### 4. Game End Screen
- Displays final standings, scores, and winner.
- Awards XP and Coins.
- In Facts Mode: Shows the Reward Medal (Bronze, Silver, etc.) and coin/XP animation.

---

## 5. PROJECT STATE

- **Stable**: Core gameplay loops, sound effects, dynamic localization, persistent coins, levels, daily challenges, and local music imports.
- **Experimental**: The `AdsManager` monetization stub system is fully wired, but does not load any third-party ads SDKs yet.
- **Refactoring Needed**: Clean up inline styling tokens in `GameScreen.kt` using structured design themes, and move large UI components out of `GameScreen.kt` to improve maintainability.

---

## 6. CONTENT SYSTEM

### Asset Packs
Metadata for content packs is defined in `assets/packs/packs_metadata.json` and parsed by `SongCatalogParser.kt`.

### Device Music
Audio tracks are scanned from external device directories. Only files ending with `.mp3`, `.m4a`, or `.wav` are added to prevent playback crashes.

### Quiz & Pair Modes
Utilize local device files found in `loadedSongs`. Songs must be shuffled and loaded before these modes become playable.

### Facts Mode
Offline trivia mode using `assets/packs/songs_catalog.json` (metadata catalogue) and `assets/packs/questions_<pack_id>.json` (pre-generated questions).

### Current JSON Structure
```json
[
  {
    "id": "rock_90s",
    "name": "90s Rock Hits",
    "description": "Legendary rock hits from the nineties.",
    "isSoloFriendly": true,
    "difficultyCurve": "Progressive",
    "songIds": ["song1", "song2"]
  }
]
```

---

## 7. App Settings

- **Default Game Mode**: Saves the starting game mode.
- **Segment Duration**: Duration of the song segment played (3000ms, 5000ms, 7000ms).
- **Sound Effects**: Toggles the low-latency sound effects on/off.
- **Language**: Language switcher (English, Russian, Ukrainian).

---

## 8. LOCALIZATION

- Custom layout-switching based on Android locale configuration update.
- Locale fallbacks: English (`en`) is the default language if the system language does not match Ukrainian or Russian.
- Application name is localized inside `res/values-*/strings.xml` under `<string name="app_name">`.

---

## 9. ADS (MONETIZATION STUB)

### AdsManager
- Helper object `AdsManager.kt` coordinates ad policies.
- **`showAd(context, event, onAdClosed)`**: Triggers a console log stub and executes `onAdClosed` immediately.
- **`shouldShowAd(gameMode, event, counter)`**: Returns true if the policy permits an ad for the specified state.

### Ad Events & Policy
- `GAME_START`: Quiz mode only.
- `GAME_END`: Quiz mode only.
- `FACTS_INTERVAL`: Music Facts mode only (shown every 10 question interactions).
- **Pair Mode**: Always ad-free.

---

## 10. CURRENT ROADMAP

1. **Clean Code & UI Organization** (High Priority): Split `GameScreen.kt` (currently over 2200 lines) into separate feature composable files.
2. **Online Packs Downloading** (Medium Priority): Implement an API provider to download new packs metadata and JSON questions remotely.
3. **Sound Effects Pack Expansion** (Low Priority): Add custom transition sounds and gameplay background audio.

---

## 11. TECHNICAL DEBT

- **`GameScreen.kt` File Size**: Over 2200 lines. Requires modularization.
- **Hardcoded Pack Cost**: Unlocking cost is hardcoded to 100 coins. It should be dynamically read from `packs_metadata.json` if available.
- **Test Coverage**: Lack of unit tests for `GameEngine` state transitions and `ProgressionManager` SharedPreferences.

---

## 12. DESIGN PRINCIPLES

- **Single Source of Truth**: The `GameEngine` and `MusicFactsEngine` own and modify their states entirely. UI must only collect and render read-only state flows.
- **No Direct AdMob Coupling**: Real ads SDKs must implement the `AdsManager` interface. Do not pollute ViewModel or UI layouts with AdMob SDK classes.

---

## 13. DEVELOPMENT RULES

1. **Compile Verification**: Always run `.\gradlew.bat compileDebugKotlin` before proposing any changes.
2. **Build Success**: Verify `.\gradlew.bat assembleDebug` succeeds to guarantee packaging is intact.
3. **Resource Management**: Do not hardcode strings; use resources (`strings.xml`) in all three languages.

---

## 14. FILES CHANGED (LAST SESSION SUMMARY)

- **`ProgressionManager.kt`**: Main persistence engine for coins, XP, levels, and unlocks.
- **`GameViewModel.kt`**: Wired progression, stats reload, and daily challenges.
- **`GameScreen.kt`**: Integrated Lobby Dashboard, settings statistics card, reward medal card, and pack lock badges.
- **`strings.xml`**: Added localization keys for level, coins, daily challenge medals, and stats description.

---

## 15. NEXT TASK

**Refactor `GameScreen.kt` to modularize UI components.**
Create a new directory `ui/components/` and move the following dialogs/cards into separate files:
1. `EmptyStateCard` ➔ `ui/components/EmptyStateCard.kt`
2. `UnifiedOnboardingOverlay` ➔ `ui/components/UnifiedOnboardingOverlay.kt`
3. `HelpDialog` ➔ `ui/components/HelpDialog.kt`

This will reduce the clutter in `GameScreen.kt` and make the codebase more maintainable.

---

## 16. HANDOFF PROMPT

Paste the following text into a brand new Anti-Gravity conversation to start:

```
You are Antigravity, a coding assistant working on the Android game "Guess The Song".
Please read the developer context file located at:
file:///D:/Projects/GuessTheSong/docs/handoff/developer_context_v1.md
Understand the architecture, state, and rules of the project.
Once you have parsed this file, complete the task documented in Section 15 (modularizing the UI components in GameScreen.kt).
```
