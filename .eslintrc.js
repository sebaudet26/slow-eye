module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true,
    "jest": true,
    "es6": true
  },
  "rules": {
    "operator-linebreak": "off",
    "implicit-arrow-linebreak": "off",
    "no-plusplus": "off",
    "import/no-named-as-default-member": "off",
    "import/no-named-as-default": "off",
    "jsx-a11y/alt-text": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/label-has-associated-control": [ 2, {
      "labelComponents": ["CustomLabel"],
      "labelAttributes": ["inputLabel"],
      "controlComponents": ["CustomInput"],
      "depth": 3,
    }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
  }
};
