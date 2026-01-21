# Pomodoro

This Project implements a pomodoro timer for iOS using React Native with expo and Typescript. The project uses bun for package management.

# Code Standards

+ use `bun` and `bunx` instead of `npm` and `npmx`
+ when you install packages use `bunx expo install ...`
+ unit tests: `bun run test`
+ Don't put dependencies in the package.json yourself. Add them with `bunx expo install ` or `bunx expo install ... --dev` 
+ run tests regularly
+ run `bun run format` after each edit.
+ run `bunx tsc --noEmit` after finishing some edits
+ The pages in the app directory only are responsible for routing. They should build the UI from components in the components directory.
+ The components are organized by feature. For example /components/home contains all components related to the home feature.

# Knowledge

+ expo-router: https://docs.expo.dev/router/introduction/
+ unit tests: https://docs.expo.dev/develop/unit-testing/





