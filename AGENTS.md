# Focus Only (Focus timer app)

## Project

This Project implements a focus timer for iOS using React Native with expo and Typescript.

## Do
Before commiting check that everything works (if not don't commit and fix the warnings/errors).
+ `bun test`
+ `bun format`
+ `bun lint`  (you can fix some problems automatically with `bun lint --fix`)
+ `bunx tsc --noEmit`

When you add a string:
+ `bun extract`
+ `bun compile`

## Don't
Do not hardcode colors.

Unistyles `StyleSheet` can be a function that returns a dictionary of styles. The parameter of this function are the theme and rt (runtime). Use this instead of the hook `useUnistyles` when possible (don't create functions for the styles keys that take a theme, and provide the theme from outside).
