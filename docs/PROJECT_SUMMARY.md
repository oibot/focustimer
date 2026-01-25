# Pomodoro

## Project summary
- Expo + React Native app with expo-router entrypoint.
- Timer logic in `src/hooks/useTimer.ts` (countdown, pause/resume, cancel).
- UI lives in `src/components/home/Timer.tsx` and is used by `src/app/index.tsx`.
- Prettier configured for no semicolons; format script runs on `src/`.

## Work done today
- Fixed countdown math, added stop-at-zero, and reset behavior in `useTimer`.
- Added `cancelTimer` and wired cancel support in UI.
- Added time formatting helper (mm:ss) and display wiring.
- Moved timer UI into `Timer` component and cleaned page wiring.
- Added Prettier config and `format` script.
