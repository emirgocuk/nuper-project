# changelog-automation
Source: https://antigravity.codes/agent-skills/devops/changelog-automation

## AI Worker Instructions
When the user requests functionality related to changelog-automation, follow these guidelines and utilize this context.

## Scraped Content

# changelog-automation
```
# ChangelogAll notable changes to this project will be documented in this file.The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).## [Unreleased]### Added- New feature X## [1.2.0] - 2024-01-15### Added- User profile avatars- Dark mode support### Changed- Improved loading performance by 40%### Deprecated- Old authentication API (use v2)### Removed- Legacy payment gateway### Fixed- Login timeout issue (#123)### Security- Updated dependencies for CVE-2024-1234[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
```
```
# ChangelogAll notable changes to this project will be documented in this file.The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).## [Unreleased]### Added- New feature X## [1.2.0] - 2024-01-15### Added- User profile avatars- Dark mode support### Changed- Improved loading performance by 40%### Deprecated- Old authentication API (use v2)### Removed- Legacy payment gateway### Fixed- Login timeout issue (#123)### Security- Updated dependencies for CVE-2024-1234[Unreleased]: https://github.com/user/repo/compare/v1.2.0...HEAD[1.2.0]: https://github.com/user/repo/compare/v1.1.0...v1.2.0
```
```
<type>[optional scope]: <description>[optional body][optional footer(s)]
```
```
<type>[optional scope]: <description>[optional body][optional footer(s)]
```
```
feat
```
```
fix
```
```
docs
```
```
style
```
```
refactor
```
```
perf
```
```
test
```
```
chore
```
```
ci
```
```
build
```
```
revert
```
```
MAJOR.MINOR.PATCHMAJOR: Breaking changes (feat! or BREAKING CHANGE)MINOR: New features (feat)PATCH: Bug fixes (fix)
```
```
MAJOR.MINOR.PATCHMAJOR: Breaking changes (feat! or BREAKING CHANGE)MINOR: New features (feat)PATCH: Bug fixes (fix)
```
```
# Install toolsnpm install -D @commitlint/cli @commitlint/config-conventionalnpm install -D huskynpm install -D standard-version# ornpm install -D semantic-release# Setup commitlintcat > commitlint.config.js << 'EOF'module.exports = {  extends: ['@commitlint/config-conventional'],  rules: {    'type-enum': [      2,      'always',      [        'feat',        'fix',        'docs',        'style',        'refactor',        'perf',        'test',        'chore',        'ci',        'build',        'revert',      ],    ],    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],    'subject-max-length': [2, 'always', 72],  },};EOF# Setup huskynpx husky initecho "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```
```
# Install toolsnpm install -D @commitlint/cli @commitlint/config-conventionalnpm install -D huskynpm install -D standard-version# ornpm install -D semantic-release# Setup commitlintcat > commitlint.config.js << 'EOF'module.exports = {  extends: ['@commitlint/config-conventional'],  rules: {    'type-enum': [      2,      'always',      [        'feat',        'fix',        'docs',        'style',        'refactor',        'perf',        'test',        'chore',        'ci',        'build',        'revert',      ],    ],    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],    'subject-max-length': [2, 'always', 72],  },};EOF# Setup huskynpx husky initecho "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```
```
// .versionrc.jsmodule.exports = {  types: [    { type: "feat", section: "Features" },    { type: "fix", section: "Bug Fixes" },    { type: "perf", section: "Performance Improvements" },    { type: "revert", section: "Reverts" },    { type: "docs", section: "Documentation", hidden: true },    { type: "style", section: "Styles", hidden: true },    { type: "chore", section: "Miscellaneous", hidden: true },    { type: "refactor", section: "Code Refactoring", hidden: true },    { type: "test", section: "Tests", hidden: true },    { type: "build", section: "Build System", hidden: true },    { type: "ci", section: "CI/CD", hidden: true },  ],  commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",  compareUrlFormat:    "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",  issueUrlFormat: "{{host}}/{{owner}}/{{repository}}/issues/{{id}}",  userUrlFormat: "{{host}}/{{user}}",  releaseCommitMessageFormat: "chore(release): {{currentTag}}",  scripts: {    prebump: 'echo "Running prebump"',    postbump: 'echo "Running postbump"',    prechangelog: 'echo "Running prechangelog"',    postchangelog: 'echo "Running postchangelog"',  },};
```
```
// .versionrc.jsmodule.exports = {  types: [    { type: "feat", section: "Features" },    { type: "fix", section: "Bug Fixes" },    { type: "perf", section: "Performance Improvements" },    { type: "revert", section: "Reverts" },    { type: "docs", section: "Documentation", hidden: true },    { type: "style", section: "Styles", hidden: true },    { type: "chore", section: "Miscellaneous", hidden: true },    { type: "refactor", section: "Code Refactoring", hidden: true },    { type: "test", section: "Tests", hidden: true },    { type: "build", section: "Build System", hidden: true },    { type: "ci", section: "CI/CD", hidden: true },  ],  commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",  compareUrlFormat:    "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",  issueUrlFormat: "{{host}}/{{owner}}/{{repository}}/issues/{{id}}",  userUrlFormat: "{{host}}/{{user}}",  releaseCommitMessageFormat: "chore(release): {{currentTag}}",  scripts: {    prebump: 'echo "Running prebump"',    postbump: 'echo "Running postbump"',    prechangelog: 'echo "Running prechangelog"',    postchangelog: 'echo "Running postchangelog"',  },};
```
```
// package.json scripts{  "scripts": {    "release": "standard-version",    "release:minor": "standard-version --release-as minor",    "release:major": "standard-version --release-as major",    "release:patch": "standard-version --release-as patch",    "release:dry": "standard-version --dry-run"  }}
```
```
// package.json scripts{  "scripts": {    "release": "standard-version",    "release:minor": "standard-version --release-as minor",    "release:major": "standard-version --release-as major",    "release:patch": "standard-version --release-as patch",    "release:dry": "standard-version --dry-run"  }}
```
```
// release.config.jsmodule.exports = {  branches: [    "main",    { name: "beta", prerelease: true },    { name: "alpha", prerelease: true },  ],  plugins: [    "@semantic-release/commit-analyzer",    "@semantic-release/release-notes-generator",    [      "@semantic-release/changelog",      {        changelogFile: "CHANGELOG.md",      },    ],    [      "@semantic-release/npm",      {        npmPublish: true,      },    ],    [      "@semantic-release/github",      {        assets: ["dist/**/*.js", "dist/**/*.css"],      },    ],    [      "@semantic-release/git",      {        assets: ["CHANGELOG.md", "package.json"],        message:          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",      },    ],  ],};
```
```
// release.config.jsmodule.exports = {  branches: [    "main",    { name: "beta", prerelease: true },    { name: "alpha", prerelease: true },  ],  plugins: [    "@semantic-release/commit-analyzer",    "@semantic-release/release-notes-generator",    [      "@semantic-release/changelog",      {        changelogFile: "CHANGELOG.md",      },    ],    [      "@semantic-release/npm",      {        npmPublish: true,      },    ],    [      "@semantic-release/github",      {        assets: ["dist/**/*.js", "dist/**/*.css"],      },    ],    [      "@semantic-release/git",      {        assets: ["CHANGELOG.md", "package.json"],        message:          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",      },    ],  ],};
```
```
# .github/workflows/release.ymlname: Releaseon:  push:    branches: [main]  workflow_dispatch:    inputs:      release_type:        description: "Release type"        required: true        default: "patch"        type: choice        options:          - patch          - minor          - majorpermissions:  contents: write  pull-requests: writejobs:  release:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4        with:          fetch-depth: 0          token: ${{ secrets.GITHUB_TOKEN }}      - uses: actions/setup-node@v4        with:          node-version: "20"          cache: "npm"      - run: npm ci      - name: Configure Git        run: |          git config user.name "github-actions[bot]"          git config user.email "github-actions[bot]@users.noreply.github.com"      - name: Run semantic-release        env:          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}        run: npx semantic-release  # Alternative: manual release with standard-version  manual-release:    if: github.event_name == 'workflow_dispatch'    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4        with:          fetch-depth: 0      - uses: actions/setup-node@v4        with:          node-version: "20"      - run: npm ci      - name: Configure Git        run: |          git config user.name "github-actions[bot]"          git config user.email "github-actions[bot]@users.noreply.github.com"      - name: Bump version and generate changelog        run: npx standard-version --release-as ${{ inputs.release_type }}      - name: Push changes        run: git push --follow-tags origin main      - name: Create GitHub Release        uses: softprops/action-gh-release@v1        with:          tag_name: ${{ steps.version.outputs.tag }}          body_path: RELEASE_NOTES.md          generate_release_notes: true
```
```
# .github/workflows/release.ymlname: Releaseon:  push:    branches: [main]  workflow_dispatch:    inputs:      release_type:        description: "Release type"        required: true        default: "patch"        type: choice        options:          - patch          - minor          - majorpermissions:  contents: write  pull-requests: writejobs:  release:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4        with:          fetch-depth: 0          token: ${{ secrets.GITHUB_TOKEN }}      - uses: actions/setup-node@v4        with:          node-version: "20"          cache: "npm"      - run: npm ci      - name: Configure Git        run: |          git config user.name "github-actions[bot]"          git config user.email "github-actions[bot]@users.noreply.github.com"      - name: Run semantic-release        env:          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}        run: npx semantic-release  # Alternative: manual release with standard-version  manual-release:    if: github.event_name == 'workflow_dispatch'    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4        with:          fetch-depth: 0      - uses: actions/setup-node@v4        with:          node-version: "20"      - run: npm ci      - name: Configure Git        run: |          git config user.name "github-actions[bot]"          git config user.email "github-actions[bot]@users.noreply.github.com"      - name: Bump version and generate changelog        run: npx standard-version --release-as ${{ inputs.release_type }}      - name: Push changes        run: git push --follow-tags origin main      - name: Create GitHub Release        uses: softprops/action-gh-release@v1        with:          tag_name: ${{ steps.version.outputs.tag }}          body_path: RELEASE_NOTES.md          generate_release_notes: true
```
```
# cliff.toml[changelog]header = """# ChangelogAll notable changes to this project will be documented in this file."""body = """{% if version %}\    ## [{{ version | trim_start_matches(pat="v") }}] - {{ timestamp | date(format="%Y-%m-%d") }}{% else %}\    ## [Unreleased]{% endif %}\{% for group, commits in commits | group_by(attribute="group") %}    ### {{ group | upper_first }}    {% for commit in commits %}        - {% if commit.scope %}**{{ commit.scope }}:** {% endif %}\            {{ commit.message | upper_first }}\            {% if commit.github.pr_number %} ([#{{ commit.github.pr_number }}](https://github.com/owner/repo/pull/{{ commit.github.pr_number }})){% endif %}\    {% endfor %}{% endfor %}"""footer = """{% for release in releases -%}    {% if release.version -%}        {% if release.previous.version -%}            [{{ release.version | trim_start_matches(pat="v") }}]: \                https://github.com/owner/repo/compare/{{ release.previous.version }}...{{ release.version }}        {% endif -%}    {% else -%}        [unreleased]: https://github.com/owner/repo/compare/{{ release.previous.version }}...HEAD    {% endif -%}{% endfor %}"""trim = true[git]conventional_commits = truefilter_unconventional = truesplit_commits = falsecommit_parsers = [    { message = "^feat", group = "Features" },    { message = "^fix", group = "Bug Fixes" },    { message = "^doc", group = "Documentation" },    { message = "^perf", group = "Performance" },    { message = "^refactor", group = "Refactoring" },    { message = "^style", group = "Styling" },    { message = "^test", group = "Testing" },    { message = "^chore\\(release\\)", skip = true },    { message = "^chore", group = "Miscellaneous" },]filter_commits = falsetag_pattern = "v[0-9]*"skip_tags = ""ignore_tags = ""topo_order = falsesort_commits = "oldest"[github]owner = "owner"repo = "repo"
```
```
# cliff.toml[changelog]header = """# ChangelogAll notable changes to this project will be documented in this file."""body = """{% if version %}\    ## [{{ version | trim_start_matches(pat="v") }}] - {{ timestamp | date(format="%Y-%m-%d") }}{% else %}\    ## [Unreleased]{% endif %}\{% for group, commits in commits | group_by(attribute="group") %}    ### {{ group | upper_first }}    {% for commit in commits %}        - {% if commit.scope %}**{{ commit.scope }}:** {% endif %}\            {{ commit.message | upper_first }}\            {% if commit.github.pr_number %} ([#{{ commit.github.pr_number }}](https://github.com/owner/repo/pull/{{ commit.github.pr_number }})){% endif %}\    {% endfor %}{% endfor %}"""footer = """{% for release in releases -%}    {% if release.version -%}        {% if release.previous.version -%}            [{{ release.version | trim_start_matches(pat="v") }}]: \                https://github.com/owner/repo/compare/{{ release.previous.version }}...{{ release.version }}        {% endif -%}    {% else -%}        [unreleased]: https://github.com/owner/repo/compare/{{ release.previous.version }}...HEAD    {% endif -%}{% endfor %}"""trim = true[git]conventional_commits = truefilter_unconventional = truesplit_commits = falsecommit_parsers = [    { message = "^feat", group = "Features" },    { message = "^fix", group = "Bug Fixes" },    { message = "^doc", group = "Documentation" },    { message = "^perf", group = "Performance" },    { message = "^refactor", group = "Refactoring" },    { message = "^style", group = "Styling" },    { message = "^test", group = "Testing" },    { message = "^chore\\(release\\)", skip = true },    { message = "^chore", group = "Miscellaneous" },]filter_commits = falsetag_pattern = "v[0-9]*"skip_tags = ""ignore_tags = ""topo_order = falsesort_commits = "oldest"[github]owner = "owner"repo = "repo"
```
```
# Generate changeloggit cliff -o CHANGELOG.md# Generate for specific rangegit cliff v1.0.0..v2.0.0 -o RELEASE_NOTES.md# Preview without writinggit cliff --unreleased --dry-run
```
```
# Generate changeloggit cliff -o CHANGELOG.md# Generate for specific rangegit cliff v1.0.0..v2.0.0 -o RELEASE_NOTES.md# Preview without writinggit cliff --unreleased --dry-run
```
```
# pyproject.toml[tool.commitizen]name = "cz_conventional_commits"version = "1.0.0"version_files = [    "pyproject.toml:version",    "src/__init__.py:__version__",]tag_format = "v$version"update_changelog_on_bump = truechangelog_incremental = truechangelog_start_rev = "v0.1.0"[tool.commitizen.customize]message_template = "{{change_type}}{% if scope %}({{scope}}){% endif %}: {{message}}"schema = "<type>(<scope>): <subject>"schema_pattern = "^(feat|fix|docs|style|refactor|perf|test|chore)(\\(\\w+\\))?:\\s.*"bump_pattern = "^(feat|fix|perf|refactor)"bump_map = {"feat" = "MINOR", "fix" = "PATCH", "perf" = "PATCH", "refactor" = "PATCH"}
```
```
# pyproject.toml[tool.commitizen]name = "cz_conventional_commits"version = "1.0.0"version_files = [    "pyproject.toml:version",    "src/__init__.py:__version__",]tag_format = "v$version"update_changelog_on_bump = truechangelog_incremental = truechangelog_start_rev = "v0.1.0"[tool.commitizen.customize]message_template = "{{change_type}}{% if scope %}({{scope}}){% endif %}: {{message}}"schema = "<type>(<scope>): <subject>"schema_pattern = "^(feat|fix|docs|style|refactor|perf|test|chore)(\\(\\w+\\))?:\\s.*"bump_pattern = "^(feat|fix|perf|refactor)"bump_map = {"feat" = "MINOR", "fix" = "PATCH", "perf" = "PATCH", "refactor" = "PATCH"}
```
```
# Installpip install commitizen# Create commit interactivelycz commit# Bump version and update changelogcz bump --changelog# Check commitscz check --rev-range HEAD~5..HEAD
```
```
# Installpip install commitizen# Create commit interactivelycz commit# Bump version and update changelogcz bump --changelog# Check commitscz check --rev-range HEAD~5..HEAD
```
```
## What's Changed### 🚀 Features{{ range .Features }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}### 🐛 Bug Fixes{{ range .Fixes }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}### 📚 Documentation{{ range .Docs }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}### 🔧 Maintenance{{ range .Chores }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}## New Contributors{{ range .NewContributors }}- @{{ .Username }} made their first contribution in #{{ .PR }}  {{ end }}**Full Changelog**: https://github.com/owner/repo/compare/v{{ .Previous }}...v{{ .Current }}
```
```
## What's Changed### 🚀 Features{{ range .Features }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}### 🐛 Bug Fixes{{ range .Fixes }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}### 📚 Documentation{{ range .Docs }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}### 🔧 Maintenance{{ range .Chores }}- {{ .Title }} by @{{ .Author }} in #{{ .PR }}  {{ end }}## New Contributors{{ range .NewContributors }}- @{{ .Username }} made their first contribution in #{{ .PR }}  {{ end }}**Full Changelog**: https://github.com/owner/repo/compare/v{{ .Previous }}...v{{ .Current }}
```
```
# Release v2.1.0 - January 15, 2024## SummaryThis release introduces dark mode support and improves checkout performanceby 40%. It also includes important security updates.## Highlights### 🌙 Dark ModeUsers can now switch to dark mode from settings. The preference isautomatically saved and synced across devices.### ⚡ Performance- Checkout flow is 40% faster- Reduced bundle size by 15%## Breaking ChangesNone in this release.## Upgrade GuideNo special steps required. Standard deployment process applies.## Known Issues- Dark mode may flicker on initial load (fix scheduled for v2.1.1)## Dependencies Updated| Package | From    | To      | Reason                   || ------- | ------- | ------- | ------------------------ || react   | 18.2.0  | 18.3.0  | Performance improvements || lodash  | 4.17.20 | 4.17.21 | Security patch           |
```
```
# Release v2.1.0 - January 15, 2024## SummaryThis release introduces dark mode support and improves checkout performanceby 40%. It also includes important security updates.## Highlights### 🌙 Dark ModeUsers can now switch to dark mode from settings. The preference isautomatically saved and synced across devices.### ⚡ Performance- Checkout flow is 40% faster- Reduced bundle size by 15%## Breaking ChangesNone in this release.## Upgrade GuideNo special steps required. Standard deployment process applies.## Known Issues- Dark mode may flicker on initial load (fix scheduled for v2.1.1)## Dependencies Updated| Package | From    | To      | Reason                   || ------- | ------- | ------- | ------------------------ || react   | 18.2.0  | 18.3.0  | Performance improvements || lodash  | 4.17.20 | 4.17.21 | Security patch           |
```
```
# Feature with scopefeat(auth): add OAuth2 support for Google login# Bug fix with issue referencefix(checkout): resolve race condition in payment processingCloses #123# Breaking changefeat(api)!: change user endpoint response formatBREAKING CHANGE: The user endpoint now returns userId instead of id.Migration guide: Update all API consumers to use the new field name.# Multiple paragraphsfix(database): handle connection timeouts gracefullyPreviously, connection timeouts would cause the entire request to failwithout retry. This change implements exponential backoff with up to3 retries before failing.The timeout threshold has been increased from 5s to 10s based on p99latency analysis.Fixes #456Reviewed-by: @alice
```
```
# Feature with scopefeat(auth): add OAuth2 support for Google login# Bug fix with issue referencefix(checkout): resolve race condition in payment processingCloses #123# Breaking changefeat(api)!: change user endpoint response formatBREAKING CHANGE: The user endpoint now returns userId instead of id.Migration guide: Update all API consumers to use the new field name.# Multiple paragraphsfix(database): handle connection timeouts gracefullyPreviously, connection timeouts would cause the entire request to failwithout retry. This change implements exponential backoff with up to3 retries before failing.The timeout threshold has been increased from 5s to 10s based on p99latency analysis.Fixes #456Reviewed-by: @alice
```
```
userId
```
```
id
```
```
!
```
Efficiently managing software releases demands meticulous documentation. The Changelog Automation Agent Skill empowers development teams to streamline this crucial process, ensuring every update, fix, and new feature is clearly cataloged. By leveraging established standards like Keep a Changelog and Conventional Commits, this skill transforms raw commit data into polished, user-friendly release notes. It's an indispensable tool for maintaining transparency, improving communication with users, and fostering robust version control practices across projects, from open-source initiatives to complex enterprise applications.

# When to Use This Skill
- •Automating changelog generation from Git history
- •Implementing Conventional Commits for consistent messaging
- •Creating dynamic release note workflows for CI/CD
- •Standardizing versioning and release announcements

# Pro Tips
- 💡Integrate with your CI/CD pipeline to automate changelog drafting and publishing on release tags.
- 💡Enforce Conventional Commits via pre-commit hooks to ensure high-quality, parsable commit messages.
- 💡Pair with a semantic versioning tool for fully automated version bumping based on commit types.

