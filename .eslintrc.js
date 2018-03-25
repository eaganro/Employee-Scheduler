module.exports = {
    "extends": "airbnb",
    "rules": {
      "prefer-const": [0],
      "func-names": [0,"disallowFunctionDeclarations"],
      "max-len": [1, 120, 2, {ignoreComments: true}],
      "quote-props": [1, "consistent-as-needed"],
      "no-cond-assign": [2, "except-parens"],
      "radix": 0,
      "space-infix-ops": 0,
      "no-unused-vars": [0, {"vars": "local", "args": "none"}],
      "no-console": 0,
      "react/jsx-filename-extension": ["error", { "extensions": [".js", ".jsx"] }],
      "react/forbid-prop-types": 0,
    }
  }
