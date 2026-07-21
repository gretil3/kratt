// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  root: true,
  extends: "expo",
  // dist/ only exists after a local `expo export`; never lint build output.
  ignorePatterns: ["dist/", ".expo/"],
  // Timers (setTimeout etc.) are globals on both native and web.
  env: { "shared-node-browser": true },
  overrides: [
    {
      files: ["**/__tests__/**"],
      env: { jest: true },
    },
  ],
};
