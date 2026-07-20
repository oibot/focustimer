# Focus Only

## Testflight build

Bump the version in `app.config.ts`.  Create a commit with the tag of the new version.

```sh
   bunx eas-cli@latest build \
     --platform ios \
     --profile production \
     --auto-submit
 ```

## Maestro end-to-end tests

### Build and install the test app

Start the iPhone 17 Pro simulator, then run:

```sh
bun run ios:test
```

When Expo asks for a device, select the **iPhone 17 Pro with iOS 26.0**. This creates a clean native project for the test variant, builds the Release configuration, and installs the app with bundle identifier `de.totap.focustimer.test`.

### Run the Maestro suite

With the simulator running and the test app installed, execute:

```sh
bun run maestro:test
```

This runs every flow configured in `.maestro/config.yaml` against `de.totap.focustimer.test`. The complete suite currently contains 42 flows and takes approximately nine minutes on the documented simulator.
