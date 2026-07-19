# Focus Only (Focus timer app)

## Project

This Project implements a focus timer for iOS using React Native with expo and Typescript.

Whenever issues or tickets are mentioned, they refer to issues in the "Focus Only" team in Linear.

Errors and crashes are tracked in the "Focus Only" project in Sentry.

## Do
Before commiting check that everything works (if not don't commit and fix the warnings/errors).
+ `bun run test`
+ `bun format`
+ `bun lint`  (you can fix some problems automatically with `bun lint --fix`)
+ `bunx tsc --noEmit`

Format commit messages as `ISSUE-ID: message` (for example, `FOC-10: add daily statistics screen`). Use `FOC-000` as the issue ID when a change is not associated with an issue.

When you add a string:
+ `bun extract`
+ `bun compile`

## Don't
Do not hardcode colors.

Do not put routing logic in components. Modules under `src/app` are responsible for navigation and route parameters. Keep components router-independent and pass data or callbacks from route modules when needed. Screen options such as header transparency belong in modules under `src/app`. Only the title and header items should be configured in the parent scene component, which is typically named with a `Scene` suffix.

Unistyles `StyleSheet` can be a function that returns a dictionary of styles. The parameter of this function are the theme and rt (runtime). Use this instead of the hook `useUnistyles` when possible (don't create functions for the styles keys that take a theme, and provide the theme from outside).

<Context.Provider value={value}> is old syntax. Just <Context value={value}> is right

Don't create a useContext function. You can use the context directly with `use`.
