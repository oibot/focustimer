# Maestro UI Test Plan

## Goal

Create Maestro end-to-end UI coverage for the main app features in Focus Only.

The main suite should run in the default app locale and cover behavior. Locale-specific suites should be smaller smoke tests that verify translated UI strings are present and usable.

## Main feature test cases

### Launch / Home timer

- `launch_shows_focus_timer_default_state`
- `notification_permission_denied_still_opens_timer`

### Focus timer

- `focus_timer_start_hides_controls_and_disables_navigation`
- `focus_timer_tap_reveals_pause_and_cancel_controls`
- `focus_timer_pause_shows_resume_and_cancel`
- `focus_timer_resume_continues_running`
- `focus_timer_cancel_keep_going_keeps_timer_running`
- `focus_timer_cancel_end_resets_to_idle`

### Timer mode switching

- `mode_switch_button_changes_focus_to_break_when_idle`
- `mode_switch_button_changes_break_to_focus_when_idle`
- `mode_switch_button_disabled_while_timer_running`
- `mode_switch_button_disabled_while_timer_paused`
- `edge_swipe_changes_focus_to_break_when_idle`
- `edge_swipe_changes_break_to_focus_when_idle`
- `edge_swipe_disabled_while_timer_active`

### Break timer

- `break_timer_initial_state`
- `break_timer_start_keeps_controls_visible`
- `break_timer_pause_and_resume`
- `break_timer_stop_opens_start_focus_done_sheet`
- `break_timer_stop_cancel_returns_to_break_timer`

### Timer completion

These cases use the test-only `focusonly://e2e-setup` route to configure short timer durations before starting the timer. The route is guarded by `APP_VARIANT=test` and accepts `focusDurationMs`, `breakDurationMs`, `completionSound`, and optional `mode=short` query parameters.

- `focus_timer_completion_opens_start_break_sheet`
- `focus_timer_completion_start_break_enters_break_mode`
- `focus_timer_completion_cancel_returns_to_timer`
- `break_timer_completion_opens_start_focus_sheet`
- `break_timer_completion_start_focus_enters_focus_mode`
- `completion_sound_off_does_not_block_completion_flow`
- `completion_sound_selected_does_not_block_completion_flow`

### Settings

- `settings_open_from_idle_timer`
- `settings_cancel_without_changes_returns_home`
- `settings_sections_are_visible`
- `settings_save_without_changes_returns_home`
- `settings_unsaved_cancel_discard_returns_home`
- `settings_unsaved_cancel_keep_editing_stays_on_settings`
- `settings_focus_duration_change_persists_after_save`
- `settings_break_duration_change_persists_after_save`
- `settings_completion_sound_picker_changes_and_persists`
- `settings_live_activities_toggle_changes_and_persists`
- `settings_keep_screen_awake_toggle_changes_and_persists`
- `settings_screen_dimming_toggle_shows_brightness_slider`
- `settings_screen_dimming_toggle_off_hides_slider`
- `settings_screen_dimming_off_resets_brightness_to_default`
- `settings_screen_dimming_brightness_change_persists`
- `settings_values_persist_after_app_relaunch`

### Runtime settings behavior

Some of these may only be partially automatable in Maestro and may need manual/device verification.

- `updated_focus_duration_applies_to_new_focus_timer`
- `updated_break_duration_applies_to_new_break_timer`
- `settings_button_disabled_while_timer_running`
- `settings_button_disabled_while_timer_paused`
- `screen_dimming_enabled_does_not_break_focus_timer_flow`
- `screen_dimming_enabled_does_not_break_break_timer_flow`

## Translation UI test cases

Do not duplicate the full E2E suite for every locale. Use the default locale for the full behavioral suite, then add focused smoke coverage for each supported translation.

### English smoke tests

- `en_launch_shows_default_timer_labels`

### German smoke tests

- `de_launch_shows_default_timer_labels`
- `de_focus_timer_controls_are_translated`
- `de_focus_cancel_alert_is_translated`
- `de_break_timer_controls_are_translated`
- `de_settings_sections_are_translated`
- `de_settings_discard_changes_alert_is_translated`
- `de_timer_completion_sheet_is_translated`

## Implemented Maestro coverage

Current flows in `.maestro/` are organized by feature folder:

- `.maestro/launch/` — app launch and notification permission behavior
- `.maestro/focus-timer/` — focus timer controls and cancellation
- `.maestro/break-timer/` — break timer controls and stop behavior
- `.maestro/mode-switching/` — toolbar and edge-swipe mode changes
- `.maestro/timer-completion/` — completion sheets and completion sound flows
- `.maestro/settings/` — settings navigation, persistence, and unsaved-change flows
- `.maestro/common/` — reusable setup subflows

`.maestro/config.yaml` defines the feature-folder inclusion patterns. This lets `maestro test .maestro` discover nested flows while keeping common subflows and disabled `.yaml.disabled` dimming flows out of the runnable suite.

Implemented flows:

- `launch_shows_focus_timer_default_state`
- `notification_permission_denied_still_opens_timer`
- `focus_timer_start_hides_controls_and_disables_navigation`
- `focus_timer_tap_reveals_pause_and_cancel_controls`
- `focus_timer_pause_shows_resume_and_cancel`
- `focus_timer_resume_continues_running`
- `focus_timer_cancel_keep_going_keeps_timer_running`
- `focus_timer_cancel_end_resets_to_idle`
- `mode_switch_button_changes_focus_to_break_when_idle`
- `mode_switch_button_changes_break_to_focus_when_idle`
- `mode_switch_button_disabled_while_timer_running`
- `mode_switch_button_disabled_while_timer_paused`
- `edge_swipe_changes_focus_to_break_when_idle`
- `edge_swipe_changes_break_to_focus_when_idle`
- `edge_swipe_disabled_while_timer_active`
- `break_timer_initial_state`
- `break_timer_start_keeps_controls_visible`
- `break_timer_pause_and_resume`
- `break_timer_stop_opens_start_focus_done_sheet`
- `break_timer_stop_cancel_returns_to_break_timer`
- `focus_timer_completion_opens_start_break_sheet`
- `focus_timer_completion_start_break_enters_break_mode`
- `focus_timer_completion_cancel_returns_to_timer`
- `break_timer_completion_opens_start_focus_sheet`
- `break_timer_completion_start_focus_enters_focus_mode`
- `completion_sound_off_does_not_block_completion_flow`
- `completion_sound_selected_does_not_block_completion_flow`
- `settings_open_from_idle_timer`
- `settings_cancel_without_changes_returns_home`
- `settings_sections_are_visible`
- `settings_save_without_changes_returns_home`
- `settings_unsaved_cancel_discard_returns_home`
- `settings_unsaved_cancel_keep_editing_stays_on_settings`
- `settings_focus_duration_change_persists_after_save`
- `settings_break_duration_change_persists_after_save`
- `settings_completion_sound_picker_changes_and_persists`
- `settings_live_activities_toggle_changes_and_persists`
- `settings_keep_screen_awake_toggle_changes_and_persists`
- `settings_screen_dimming_toggle_shows_brightness_slider`
- `settings_screen_dimming_toggle_off_hides_slider`
- `settings_screen_dimming_off_resets_brightness_to_default`
- `settings_screen_dimming_brightness_change_persists`
- `settings_values_persist_after_app_relaunch`

Main missing areas are runtime settings behavior and focused translation smoke tests.
