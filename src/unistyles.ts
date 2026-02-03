import { StyleSheet } from "react-native-unistyles"

const lightTheme = {
  colors: {
    primary: "#000000FF",
    secondary: "rgba(60, 60, 67, 0.6)",
    background: "#F2F2F7",
    transparent: "rgba(255,255,255,0)",
    accent: "#5B7CFF",
  },
}

const darkTheme = {
  colors: {
    primary: "#FFFFFFFF",
    secondary: "rgba(235, 235, 245, 0.60)",
    background: "#1C1C1E",
    transparent: "rgba(0,0,0,0)",
    accent: "#5B7CFF",
  },
}

const appThemes = {
  light: lightTheme,
  dark: darkTheme,
}

const settings = {
  adaptiveThemes: true,
}

StyleSheet.configure({
  themes: appThemes,
  settings,
})

type AppThemes = typeof appThemes

declare module "react-native-unistyles" {
  export interface UnistylesThemes extends AppThemes {}
}
