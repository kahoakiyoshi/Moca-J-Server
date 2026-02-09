module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "feature",
        "fix",
        "bug",
        "chore",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "revert",
        "build",
        "ci",
      ],
    ],
  },
};
