# Pomodoro

## Project

This Project implements a focus timer for iOS using React Native with expo and Typescript. The project uses bun for package management.

## Quick Commands
+ all tests: `bun run test`
+ format all files: `bun run format`
+ type check: `bunx tsc --noEmit`
+ test changed files: `bun run test:changed`
+ format changed files: `bun run format:changed`
+ install dependencies: `bunx expo install`

## Repo Layout
+ All source files are in *src/*.
+ *src/app* contains files for routing with expo-router.
+ *src/hooks* contains all hooks.
+ *src/components* contains all scenes and components, ordered by the overall scene in the app (for example *src/components/home* for the home view).
+ Test file live alongside their implementation.

## Coding Conventions
+ The responsibility of file in *src/app* are only routing and showing a *scene*
+ The scene builds itself from components.
+ Components should be mostly dumb, that is no own state. They are controlled by the scene.
+ We are using React 19 with the new compiler enabled.
+ We are using Unistyles for styling.

## Workflow
+ Always plan your edits.
+ After each task/feature do a type check, test of changed files and format of changed files.
+ Before each commit do a type check, test of all files, and format of all files.
+ use context7 for third party dependencies
