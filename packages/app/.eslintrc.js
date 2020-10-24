module.exports = {
  root: true,
  extends: "@react-native-community",
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    "no-console": ["error", { allow: ["warn"] }],
    quotes: ["error", "double"],
    "react-native/no-inline-styles": 0,
  },
  env: {
    "jest/globals": true,
  },
};
