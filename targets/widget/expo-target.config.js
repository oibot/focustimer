/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = (config) => ({
  type: "widget",
  name: "FocusOnlyWidget",
  displayName: "Focus Only Widget",
  icon: "https://github.com/expo.png",
  entitlements: {
    /* Add entitlements */
  },
  deploymentTarget: "26.0",
})
