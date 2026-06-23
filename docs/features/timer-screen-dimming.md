# Timer Screen Dimming Spec

## Goal

Allow users to optionally dim the device screen while a focus or break timer is running.

This should use native iOS screen brightness via Expo rather than an in-app overlay.

## Settings

Add the setting at the end of the settings list.

### Toggle

- Label: **Dim screen when timer runs**
- Helper text: **Dim the screen when the timer is running**
- Default: disabled

### Slider

Shown only when the toggle is enabled.

- Title: **Dimmed brightness**
- Value label: percentage only, for example **15%**
- Default: **15%**
- Range: **5%–20%**
- Step: **1%**
- The slider controls absolute screen brightness, not overlay opacity.
- Turning screen dimming off resets the dimmed brightness value to the default of **15%**.

## Runtime behavior

Applies to both focus and break timers. There are no separate settings per timer type.

Dimming is only active while a timer is actually running.

### Dimming trigger

When the dimming conditions are met, wait **5 seconds**, then dim the screen.

Dimming conditions:

- dim setting is enabled
- timer is running
- app is active/in foreground

Dimming is independent of timer controls visibility. Focus and break timers both dim after the same 5 second delay while running.

The dimmed brightness target is:

```ts
targetBrightness = Math.min(currentBrightness, configuredDimmedBrightness)
```

This means the feature should reduce brightness if the current brightness is higher than the setting, but should not increase brightness if the user already has lower brightness.

### Restoring brightness

Restore the previous brightness immediately when:

- timer pauses
- timer finishes
- timer stops/resets/skips
- app leaves the active foreground state
- user taps the timer screen
- the focus cancel confirmation alert appears

When the timer ends, the last pre-dim brightness percentage should be restored.

Dimming should remain disabled while the focus cancel confirmation alert is visible. If the timer is still running after the alert is dismissed, the 5 second dimming delay starts again.

### Tapping the screen

Tapping the dimmed screen should restore brightness immediately.

If the timer is still running after the tap, the 5 second dimming delay starts again.

### App lifecycle

When the app is no longer active, restore brightness immediately.

This should cover iOS `inactive` states such as Notification Center, multitasking view, and incoming calls if React Native reports the state change.

When the app returns to active and the timer is still running, dimming should be eligible again using the same 5 second delay.

### Manual brightness changes

If the user manually changes device brightness, do not try to detect, reverse, or fight it.

The next time our dimming logic runs, it should again read the current brightness and apply:

```ts
Math.min(currentBrightness, configuredDimmedBrightness)
```

## Platform and APIs

This app targets iOS only.

Use Expo APIs where possible:

- `expo-brightness`
  - `getBrightnessAsync()`
  - `setBrightnessAsync(value)`
- React Native `AppState`
  - restore brightness when state changes away from `active`
- `@expo/ui` SwiftUI or universal slider can provide the settings slider

On iOS, Expo Brightness requires no user permission.

## Non-goals / caveats

- No in-app overlay unless native brightness control proves insufficient.
- No fade animation for now.
- Crash restore is best-effort only. If the app crashes while brightness is dimmed, Expo does not provide a guaranteed cleanup hook. iOS will restore brightness when the device is locked or powered off.
