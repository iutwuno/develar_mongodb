module.exports = {
    "env": {
        "browser": true
    },
    "parser": "babel-eslint",

    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": [
            "error", {"allow": ["log", "error", "warn" ]}
        ],
        "no-unused-vars": [
            "error", 
            { "vars": "all", "args": "none","ignoreRestSiblings": false }
        ]

    }
};