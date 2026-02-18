/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "FocusOnlyWidget",
  displayName: "Focus Only Widget",
  icon: "https://github.com/expo.png",
  deploymentTarget: "26.0",
  images: {
    icon: "../../assets/widgets/icon.png",
  },
  entitlements: {
    "com.apple.security.application-groups":
      config.ios?.entitlements?.["com.apple.security.application-groups"] ?? [],
  },
})
