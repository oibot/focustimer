import { StyleSheet } from "react-native-unistyles"

const lightTheme = {
  colors: {
    primary: "#000000FF",
    secondary: "rgba(60, 60, 67, 0.6)",
    background: "#F2F2F7"
  }
}
const darkTheme = {
  colors: {
    primary: "#FFFFFFFF",
    secondary: "rgba(235, 235, 245, 0.60)",
    background: "#1C1C1E"
  }
}

const settings = {
  adaptiveThemes: true
}

const appTheme = {
  themes: { light: lightTheme, dark: darkTheme },
  settings
}

StyleSheet.configure(appTheme)

type AppThemes = typeof appTheme

declare module "react-native-unistyles" {
  export interface UniStylesTheme extends AppThemes {}
}
