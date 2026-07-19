import { i18n } from "@lingui/core"
import { I18nProvider } from "@lingui/react"
import { render, within } from "@testing-library/react-native"
import type { ReactElement } from "react"

import { StatisticsScene } from "@/components/stats/StatisticsScene"
import { messages as enMessages } from "@/locales/en/messages"
import {
  type CompletedFocusSession,
  useSessionHistoryStore,
} from "@/state/sessionHistory"

jest.mock("expo-router", () => ({
  Stack: {
    Screen: () => null,
  },
}))

const renderWithI18n = (ui: ReactElement) =>
  render(<I18nProvider i18n={i18n}>{ui}</I18nProvider>)

const createSession = (
  id: string,
  completedAt: Date,
  durationMinutes: number,
): CompletedFocusSession => ({
  id,
  completedAt: completedAt.toISOString(),
  durationMs: durationMinutes * 60 * 1000,
})

describe("StatisticsScene", () => {
  beforeAll(() => {
    i18n.load({ en: enMessages })
    i18n.activate("en")
  })

  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2026, 6, 17, 12))
    useSessionHistoryStore.setState({ completedFocusSessions: [] })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it("shows an empty state when there are no completed sessions", async () => {
    const { getByText, getByTestId } = await renderWithI18n(
      <StatisticsScene onClose={jest.fn()} />,
    )

    expect(getByText("No focus sessions yet")).toBeTruthy()
    expect(
      getByText("Complete a focus timer to see your statistics here."),
    ).toBeTruthy()
    expect(
      getByTestId("statistics-list").props.contentInsetAdjustmentBehavior,
    ).toBe("automatic")
  })

  it("shows today's summary and one dot per completed session", async () => {
    useSessionHistoryStore.setState({
      completedFocusSessions: [
        createSession("morning", new Date(2026, 6, 17, 9), 25),
        createSession("afternoon", new Date(2026, 6, 17, 14), 25),
      ],
    })

    const { getByLabelText, getAllByTestId, getByTestId } =
      await renderWithI18n(<StatisticsScene onClose={jest.fn()} />)
    const todayRow = getByTestId("daily-stats-row-2026-07-17")

    expect(getByLabelText("Today, 2 focus sessions, 50 minutes")).toBeTruthy()
    expect(within(todayRow).getByText("JUL")).toBeTruthy()
    expect(within(todayRow).getByText("17")).toBeTruthy()
    expect(within(todayRow).getByText("FRI")).toBeTruthy()
    expect(within(todayRow).queryByText("2 focus sessions")).toBeNull()
    expect(within(todayRow).queryByText("50 minutes")).toBeNull()
    expect(
      getAllByTestId("session-dot-2026-07-17", {
        includeHiddenElements: true,
      }),
    ).toHaveLength(2)
  })

  it("adds a zero-session Today row and orders previous days newest first", async () => {
    useSessionHistoryStore.setState({
      completedFocusSessions: [
        createSession("oldest", new Date(2026, 6, 15, 10), 25),
        createSession("newest", new Date(2026, 6, 16, 10), 15),
      ],
    })

    const { getAllByTestId, getByLabelText, queryByTestId } =
      await renderWithI18n(<StatisticsScene onClose={jest.fn()} />)
    const rows = getAllByTestId(/^daily-stats-row-/)

    expect(rows.map((row) => row.props.testID)).toEqual([
      "daily-stats-row-2026-07-17",
      "daily-stats-row-2026-07-16",
      "daily-stats-row-2026-07-15",
    ])
    expect(getByLabelText("Today, 0 focus sessions, 0 minutes")).toBeTruthy()
    expect(queryByTestId("session-dot-2026-07-17")).toBeNull()
  })
})
