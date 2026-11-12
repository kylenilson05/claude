# STACKED

Mobile mini-game app: a daily stack of three games (Name That Tune, Group Up, Name 'Em) with rankings, four free-play games (Rare Words, Zoom Out, Trivia Streak, Higher / Lower) and a pass-the-phone party mode. Built from the "Stacked" Claude Design handoff using Vertex Detailing's carbon-and-orange design tokens.

React Native + Expo SDK 58 (TypeScript), Expo Router.

## Run

```bash
npm install
npx expo start          # press i / a, or scan with Expo Go
npx expo start --web    # browser preview
npm run typecheck
```

## Layout

| Path | What |
|---|---|
| `src/app/` | Routes. `(tabs)/` = Play, Party, Ranks with the custom 3-tab bar. `play/` = daily games, `free/` = free play. |
| `src/components/ui.tsx` | Design-system primitives: Button (primary/secondary/outline/ghost/danger, sm–xl, `cut` chamfer), Input, Checkbox, Switch, `Shape`/`Chamfer` (SVG stand-ins for CSS clip-path), Carbon texture, Bar. |
| `src/components/chrome.tsx` | Game top bar, result bottom sheet, toast, option buttons. |
| `src/components/NameEm.tsx` | Name 'Em board shared by the daily game and party mode. |
| `src/lib/theme.ts` | Colors, fonts (Saira / Barlow / Barlow Semi Condensed), radii, shadows. |
| `src/lib/data.ts` | Puzzle content and demo leaderboards. |
| `src/lib/store.tsx` | App state (React context), persisted to AsyncStorage. Daily progress resets at local midnight. |
| `assets/audio/tune.wav` | Synthesized public-domain clip (Ode to Joy) for Name That Tune. |

## Local only, for now

Everything runs on-device with hard-coded content. Before launch:

- **Backend (Supabase):** auth (Sign in with Apple + email magic link), `profiles`, `daily_stacks`, puzzles, `daily_scores` written by an Edge Function that validates answers, `free_play_best`, friends/school/global leaderboard views. Each spot to replace is marked with a `Production:` comment.
- **Account deletion** must delete server data (Apple requires it). It currently clears local storage.
- **Music:** real songs need licensed clips.
- **Daily reminder:** the Settings switch is stored but `expo-notifications` isn't wired up yet.
- **Bundle ID:** `com.yourname.stacked` in `app.json` is a placeholder.

App Store steps: `npx eas-cli@latest build -p ios`, then `eas submit`. TestFlight first.
