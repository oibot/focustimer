import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { zustandStorage } from "@/state/storage"

const MINUTE_MS = 60 * 1000

export type CompletedFocusSession = {
  id: string
  completedAt: string
  durationMs: number
}

export type AddCompletedFocusSessionInput = Pick<
  CompletedFocusSession,
  "durationMs"
>

export type DailyFocusSessionSummary = {
  dateKey: string
  sessionCount: number
  totalDurationMs: number
  totalMinutes: number
}

type SessionHistoryState = {
  completedFocusSessions: CompletedFocusSession[]
  addCompletedFocusSession: (input: AddCompletedFocusSessionInput) => void
}

const createSessionId = () => {
  const randomPart = () =>
    Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36)

  return `${Date.now().toString(36)}-${randomPart()}-${randomPart()}`
}

export const getLocalDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export const getTodayFocusSessions = (
  sessions: CompletedFocusSession[],
  now: Date = new Date(),
) => {
  const todayDateKey = getLocalDateKey(now)

  return sessions.filter(
    (session) =>
      getLocalDateKey(new Date(session.completedAt)) === todayDateKey,
  )
}

export const getTotalDurationMs = (sessions: CompletedFocusSession[]) =>
  sessions.reduce((total, session) => total + session.durationMs, 0)

export const getTotalMinutes = (sessions: CompletedFocusSession[]) =>
  getTotalDurationMs(sessions) / MINUTE_MS

export const getDailyFocusSessionSummaries = (
  sessions: CompletedFocusSession[],
): DailyFocusSessionSummary[] => {
  const sessionsByDate = new Map<string, CompletedFocusSession[]>()

  for (const session of sessions) {
    const dateKey = getLocalDateKey(new Date(session.completedAt))
    const sessionsForDate = sessionsByDate.get(dateKey) ?? []
    sessionsForDate.push(session)
    sessionsByDate.set(dateKey, sessionsForDate)
  }

  return Array.from(sessionsByDate, ([dateKey, sessionsForDate]) => ({
    dateKey,
    sessionCount: sessionsForDate.length,
    totalDurationMs: getTotalDurationMs(sessionsForDate),
    totalMinutes: getTotalMinutes(sessionsForDate),
  })).sort((left, right) => right.dateKey.localeCompare(left.dateKey))
}

export const useSessionHistoryStore = create<SessionHistoryState>()(
  persist(
    (set) => ({
      completedFocusSessions: [],
      addCompletedFocusSession: ({ durationMs }) => {
        const session: CompletedFocusSession = {
          id: createSessionId(),
          completedAt: new Date().toISOString(),
          durationMs,
        }

        set((state) => ({
          completedFocusSessions: [...state.completedFocusSessions, session],
        }))
      },
    }),
    {
      name: "session-history",
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
)
