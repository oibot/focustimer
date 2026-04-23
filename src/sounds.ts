export type CompletionSound =
  | "cheering"
  | "marimba"
  | "off"
  | "softChime"
  | "trumpets"

type CompletionSoundConfig = {
  audioSource: number | null
}

export const completionSoundOptions: CompletionSound[] = [
  "off",
  "cheering",
  "marimba",
  "softChime",
  "trumpets",
]

export const completionSoundConfig: Record<
  CompletionSound,
  CompletionSoundConfig
> = {
  cheering: {
    audioSource: require("../assets/sounds/cheering.mp3"),
  },
  marimba: {
    audioSource: require("../assets/sounds/marimba.mp3"),
  },
  off: {
    audioSource: null,
  },
  softChime: {
    audioSource: require("../assets/sounds/soft-chime.mp3"),
  },
  trumpets: {
    audioSource: require("../assets/sounds/trumpets.mp3"),
  },
}
