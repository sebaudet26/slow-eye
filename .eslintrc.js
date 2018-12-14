module.exports = {
  "extends": "airbnb",
  "rules": {
    "jsx-a11y/label-has-associated-control": [ 2, {
      "labelComponents": ["CustomLabel"],
      "labelAttributes": ["inputLabel"],
      "controlComponents": ["CustomInput"],
      "depth": 3,
    }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
};
