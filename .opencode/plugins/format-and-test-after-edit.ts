import type { Plugin } from "@opencode-ai/plugin"

const EDIT_TOOLS = new Set(["write", "edit", "patch"])
let running = false

type CmdResult = {
  exitCode: number
  stdout: string
  stderr: string
}

const exec = async ($: any, cmd: string[]): Promise<CmdResult> => {
  const res = await $`${cmd}`.nothrow().quiet()
  return {
    exitCode: res.exitCode,
    stdout: res.stdout.toString().trim(),
    stderr: res.stderr.toString().trim(),
  }
}

const throwIfFailed = (label: string, cmd: string[], r: CmdResult) => {
  if (r.exitCode === 0) return
  const msg = r.stderr || r.stdout || `${label} failed: ${cmd.join(" ")}`
  throw new Error(`❌ ${label} failed\n\n${msg}`)
}

export const FormatAndTestAfterEdit: Plugin = async ({ $ }) => {
  return {
    "tool.execute.after": async (input) => {
      if (running) return
      if (!EDIT_TOOLS.has(input.tool)) return

      running = true
      try {
        const fmtChangedCmd = ["bun", "run", "format:changed"]
        const fmtChanged = await exec($, fmtChangedCmd)
        throwIfFailed("format:changed", fmtChangedCmd, fmtChanged)

        const testChangedCmd = ["bun", "run", "test:changed"]
        const testChanged = await exec($, testChangedCmd)
        throwIfFailed("test:changed", testChangedCmd, testChanged)
      } finally {
        running = false
      }
    },
  }
}

export default FormatAndTestAfterEdit
