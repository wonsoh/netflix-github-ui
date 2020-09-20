module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    quotes: [2, "double"],
    "jsx-a11y/anchor-is-valid": 0,
    "import/prefer-default-export": 0,
    "max-classes-per-file": 0,
    // TODO: Later re-enable with react prop-types validation
    "react/prop-types": 0,
    "react/jsx-props-no-spreading": 0,
    "no-await-in-loop": 0,
    "react/jsx-wrap-multilines": 0,
    indent: ["error", 2],
  },
};
