export type CompletionSound = "cheering" | "off"

type CompletionSoundConfig = {
  audioSource: number | null
}

export const completionSoundOptions: CompletionSound[] = ["off", "cheering"]

export const completionSoundConfig: Record<
  CompletionSound,
  CompletionSoundConfig
> = {
  cheering: {
    audioSource: require("../assets/sounds/cheering.mp3"),
  },
  off: {
    audioSource: null,
  },
}
