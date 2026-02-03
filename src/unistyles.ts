import { StyleSheet } from "react-native-unistyles"

const lightTheme = {
  colors: {
    primary: "#1C1C1E",
    secondary: "rgba(60, 60, 67, 0.6)",
    background: "#F2F2F7",
    transparent: "rgba(255,255,255,0)",
  },
}

const darkTheme = {
  colors: {
    primary: "#EDEDED",
    secondary: "rgba(235, 235, 245, 0.60)",
    background: "#1C1C1E",
    transparent: "rgba(0,0,0,0)",
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
