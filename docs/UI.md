# Timer Screen Summary

## Purpose

The Timer Screen is the **primary screen** of the app.
It allows the user to:

* Run a guided Pomodoro flow
* **Interrupt and jump** between Focus and Break modes instantly
* Start, pause, resume, reset, or skip sessions with minimal friction

## Screen Structure (Top → Bottom)

### 1. Mode Selector (Interrupt Control)

**Visible at all times**

Modes:

* Focus
* Short Break
* Long Break

**Behavior**

* Acts as a **hard mode switch**
* Switching modes:

  * Stops the current timer (if running or paused)
  * Discards current session (not counted as completed)
  * Resets timer to the selected mode’s duration
  * Does **not auto-start**

**Intent**

* Allows users to jump directly to a break or focus
* Serves as a fast, discoverable interruption mechanism
* Not navigation, not configuration

### 2. Timer Focus Area (Attention Anchor)

**Centered, dominant visual**

Elements:

* Large time display (`mm:ss`)
* Current mode label (e.g. `FOCUS`)

### 3. Primary Action Button

**Single main control**

States:

* Start
* Pause
* Resume

Rules:

* Explicit user action always required to start timing
* No automatic start on manual mode switches

### 4. Secondary Actions (Low Emphasis)

* Reset
* Skip

**Reset**

* Restarts the current mode duration

**Skip**

* Advances to the next automatic mode in the Pomodoro cycle
* Counts current session as completed if it reached 0

### 5. Context Footer (Guidance Only)

**Informational, not interactive**

Displays:

* Current session number (e.g. `Session 2 of 4`)

## Timer Flow & State Model

### States

* Idle
* Running
* Paused
* Completed (leads to bottom sheet)

### Key Rules

* Manual mode switch ≠ session completion
* Manual switches never auto-start timers

