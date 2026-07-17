import { createMMKV } from "react-native-mmkv"

import {
  CompletedFocusSession,
  getDailyFocusSessionSummaries,
  getLocalDateKey,
  getTodayFocusSessions,
  getTotalDurationMs,
  getTotalMinutes,
  useSessionHistoryStore,
} from "@/state/sessionHistory"

const createSession = (
  id: string,
  completedAt: Date,
  durationMinutes: number,
): CompletedFocusSession => ({
  id,
  completedAt: completedAt.toISOString(),
  durationMs: durationMinutes * 60 * 1000,
})

const resetStore = () => {
  useSessionHistoryStore.setState({ completedFocusSessions: [] })
}

describe("session history store", () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date("2026-07-17T10:30:00.000Z"))
    resetStore()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("appends completed focus session events with stable event data", () => {
    useSessionHistoryStore
      .getState()
      .addCompletedFocusSession({ durationMs: 25 * 60 * 1000 })

    const firstSession =
      useSessionHistoryStore.getState().completedFocusSessions[0]

    jest.advanceTimersByTime(1000)
    useSessionHistoryStore
      .getState()
      .addCompletedFocusSession({ durationMs: 5 * 60 * 1000 })

    const sessions = useSessionHistoryStore.getState().completedFocusSessions

    expect(firstSession).toEqual({
      id: expect.any(String),
      completedAt: "2026-07-17T10:30:00.000Z",
      durationMs: 25 * 60 * 1000,
    })
    expect(sessions).toHaveLength(2)
    expect(sessions[0]).toBe(firstSession)
    expect(sessions[1]).toEqual({
      id: expect.any(String),
      completedAt: "2026-07-17T10:30:01.000Z",
      durationMs: 5 * 60 * 1000,
    })
    expect(sessions[1].id).not.toBe(firstSession.id)

    const persistedHistory = createMMKV().getString("session-history")
    expect(JSON.parse(persistedHistory ?? "null")).toEqual({
      state: { completedFocusSessions: sessions },
      version: 0,
    })
  })
})

describe("session history helpers", () => {
  it("formats a date as a local YYYY-MM-DD key", () => {
    expect(getLocalDateKey(new Date(2026, 0, 2, 12))).toBe("2026-01-02")
  })

  it("finds sessions completed on the same local day", () => {
    const previousDaySession = createSession(
      "previous",
      new Date(2026, 6, 16, 23, 59),
      25,
    )
    const todaySession = createSession("today", new Date(2026, 6, 17, 0, 1), 25)

    expect(
      getTodayFocusSessions(
        [previousDaySession, todaySession],
        new Date(2026, 6, 17, 12),
      ),
    ).toEqual([todaySession])
  })

  it("groups sessions into newest-first daily summaries", () => {
    const sessions = [
      createSession("oldest", new Date(2026, 6, 15, 12), 25),
      createSession("newest-1", new Date(2026, 6, 17, 8), 25),
      createSession("middle", new Date(2026, 6, 16, 12), 15),
      createSession("newest-2", new Date(2026, 6, 17, 18), 5),
    ]

    expect(getDailyFocusSessionSummaries(sessions)).toEqual([
      {
        dateKey: "2026-07-17",
        sessionCount: 2,
        totalDurationMs: 30 * 60 * 1000,
        totalMinutes: 30,
      },
      {
        dateKey: "2026-07-16",
        sessionCount: 1,
        totalDurationMs: 15 * 60 * 1000,
        totalMinutes: 15,
      },
      {
        dateKey: "2026-07-15",
        sessionCount: 1,
        totalDurationMs: 25 * 60 * 1000,
        totalMinutes: 25,
      },
    ])
  })

  it("calculates total duration and minutes", () => {
    const sessions = [
      createSession("first", new Date(2026, 6, 17, 8), 25),
      createSession("second", new Date(2026, 6, 17, 9), 5),
    ]

    expect(getTotalDurationMs(sessions)).toBe(30 * 60 * 1000)
    expect(getTotalMinutes(sessions)).toBe(30)
  })
})
