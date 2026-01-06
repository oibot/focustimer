# Tools

+ use `bun` and `bunx` instead of `npm` and `npmx`
+ when you install packages use `bunx expo install ...`
+ unit tests: `bun run test`

# Tools

+ expo-router: https://docs.expo.dev/router/introduction/
+ unit tests: https://docs.expo.dev/develop/unit-testing/

# Style Guides

+ The pages in the app directory only are responsible for routing. They should build the UI from components in the components directory.
+ The components are organized by feature. For example /components/home contains all components related to the home feature.

# Other
+ Don't put dependencies in the package.json yourself. Add them with `bunx expo install ` or `bunx expo install ... --dev` 


