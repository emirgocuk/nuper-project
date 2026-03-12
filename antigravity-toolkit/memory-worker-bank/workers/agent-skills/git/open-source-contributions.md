# open-source-contributions
Source: https://antigravity.codes/agent-skills/git/open-source-contributions

## AI Worker Instructions
When the user requests functionality related to open-source-contributions, follow these guidelines and utilize this context.

## Scraped Content

# open-source-contributions
```
❌ SESSION.md              # Session tracking notes❌ NOTES.md                # Personal development notes❌ TODO.md                 # Personal todo lists❌ planning/*              # Planning documents directory❌ IMPLEMENTATION_PHASES.md # Project planning❌ DATABASE_SCHEMA.md      # Unless adding new schema to project❌ ARCHITECTURE.md         # Unless documenting new architecture❌ SCRATCH.md              # Temporary notes❌ DEBUGGING.md            # Debugging notes❌ research-logs/*         # Research notes
```
```
❌ SESSION.md              # Session tracking notes❌ NOTES.md                # Personal development notes❌ TODO.md                 # Personal todo lists❌ planning/*              # Planning documents directory❌ IMPLEMENTATION_PHASES.md # Project planning❌ DATABASE_SCHEMA.md      # Unless adding new schema to project❌ ARCHITECTURE.md         # Unless documenting new architecture❌ SCRATCH.md              # Temporary notes❌ DEBUGGING.md            # Debugging notes❌ research-logs/*         # Research notes
```
```
❌ screenshots/debug-*.png     # Debugging screenshots❌ screenshots/test-*.png      # Testing screenshots❌ screenshot-*.png            # Ad-hoc screenshots❌ screen-recording-*.mp4      # Screen recordings❌ before-after-local.png      # Local comparison images✅ screenshots/feature-demo.png   # IF demonstrating feature in PR description✅ docs/assets/ui-example.png     # IF part of documentation update
```
```
❌ screenshots/debug-*.png     # Debugging screenshots❌ screenshots/test-*.png      # Testing screenshots❌ screenshot-*.png            # Ad-hoc screenshots❌ screen-recording-*.mp4      # Screen recordings❌ before-after-local.png      # Local comparison images✅ screenshots/feature-demo.png   # IF demonstrating feature in PR description✅ docs/assets/ui-example.png     # IF part of documentation update
```
```
❌ test-manual.js          # Manual testing scripts❌ test-debug.ts           # Debugging test files❌ quick-test.py           # Quick validation scripts❌ scratch-test.sh         # Temporary test scripts❌ example-local.json      # Local test data✅ tests/feature.test.js   # Proper test suite additions✅ tests/fixtures/data.json # Required test fixtures✅ __tests__/component.tsx  # Component tests
```
```
❌ test-manual.js          # Manual testing scripts❌ test-debug.ts           # Debugging test files❌ quick-test.py           # Quick validation scripts❌ scratch-test.sh         # Temporary test scripts❌ example-local.json      # Local test data✅ tests/feature.test.js   # Proper test suite additions✅ tests/fixtures/data.json # Required test fixtures✅ __tests__/component.tsx  # Component tests
```
```
❌ node_modules/           # Dependencies (in .gitignore)❌ dist/                   # Build output (in .gitignore)❌ build/                  # Build artifacts (in .gitignore)❌ .cache/                 # Cache files (in .gitignore)❌ package-lock.json       # Unless explicitly required by project❌ yarn.lock               # Unless explicitly required by project
```
```
❌ node_modules/           # Dependencies (in .gitignore)❌ dist/                   # Build output (in .gitignore)❌ build/                  # Build artifacts (in .gitignore)❌ .cache/                 # Cache files (in .gitignore)❌ package-lock.json       # Unless explicitly required by project❌ yarn.lock               # Unless explicitly required by project
```
```
❌ .vscode/                # VS Code settings❌ .idea/                  # IntelliJ settings❌ .DS_Store               # macOS file system❌ Thumbs.db               # Windows thumbnails❌ *.swp, *.swo            # Vim swap files❌ *~                      # Editor backup files
```
```
❌ .vscode/                # VS Code settings❌ .idea/                  # IntelliJ settings❌ .DS_Store               # macOS file system❌ Thumbs.db               # Windows thumbnails❌ *.swp, *.swo            # Vim swap files❌ *~                      # Editor backup files
```
```
❌ .env                    # Environment variables (NEVER!)❌ .env.local              # Local environment config❌ config/local.json       # Local configuration❌ credentials.json        # Credentials (NEVER!)❌ *.key, *.pem            # Private keys (NEVER!)❌ secrets/*               # Secrets directory (NEVER!)
```
```
❌ .env                    # Environment variables (NEVER!)❌ .env.local              # Local environment config❌ config/local.json       # Local configuration❌ credentials.json        # Credentials (NEVER!)❌ *.key, *.pem            # Private keys (NEVER!)❌ secrets/*               # Secrets directory (NEVER!)
```
```
❌ temp/*                  # Temporary files❌ tmp/*                   # Temporary directory❌ debug.log               # Debug logs❌ *.log                   # Log files❌ dump.sql                # Database dumps❌ core                    # Core dumps❌ *.prof                  # Profiling output
```
```
❌ temp/*                  # Temporary files❌ tmp/*                   # Temporary directory❌ debug.log               # Debug logs❌ *.log                   # Log files❌ dump.sql                # Database dumps❌ core                    # Core dumps❌ *.prof                  # Profiling output
```
```
✅ Source code changes      # The actual feature/fix✅ Tests for changes        # Required tests for new code✅ Documentation updates    # README, API docs, inline comments✅ Configuration changes    # If part of the feature✅ Migration scripts        # If needed for the feature✅ Package.json updates     # If adding/removing dependencies✅ Schema changes           # If part of feature (with migrations)✅ CI/CD updates            # If needed for new workflows
```
```
✅ Source code changes      # The actual feature/fix✅ Tests for changes        # Required tests for new code✅ Documentation updates    # README, API docs, inline comments✅ Configuration changes    # If part of the feature✅ Migration scripts        # If needed for the feature✅ Package.json updates     # If adding/removing dependencies✅ Schema changes           # If part of feature (with migrations)✅ CI/CD updates            # If needed for new workflows
```
```
scripts/pre-pr-check.sh
```
```
./scripts/pre-pr-check.sh
```
```
./scripts/pre-pr-check.sh
```
```
git statusgit diff --stat
```
```
git statusgit diff --stat
```
```
git rm --cached SESSION.mdgit rm --cached -r planning/git rm --cached screenshots/debug-*.pnggit rm --cached test-manual.js
```
```
git rm --cached SESSION.mdgit rm --cached -r planning/git rm --cached screenshots/debug-*.pnggit rm --cached test-manual.js
```
```
./scripts/clean-branch.sh
```
```
./scripts/clean-branch.sh
```
```
.git/info/exclude
```
```
# Personal development artifactsSESSION.mdNOTES.mdTODO.mdplanning/screenshots/debug-*.pngtest-manual.*scratch.*
```
```
# Personal development artifactsSESSION.mdNOTES.mdTODO.mdplanning/screenshots/debug-*.pngtest-manual.*scratch.*
```
```
references/pr-template.md
```
```
## What?[Brief description of what this PR does]## Why?[Explain the reasoning, business value, or problem being solved]## How?[Describe the implementation approach and key decisions]## Testing[Step-by-step instructions for reviewers to test]## Checklist- [ ] Tests added/updated- [ ] Documentation updated- [ ] CI passing- [ ] Breaking changes documented## Related IssuesCloses #123Relates to #456
```
```
## What?[Brief description of what this PR does]## Why?[Explain the reasoning, business value, or problem being solved]## How?[Describe the implementation approach and key decisions]## Testing[Step-by-step instructions for reviewers to test]## Checklist- [ ] Tests added/updated- [ ] Documentation updated- [ ] CI passing- [ ] Breaking changes documented## Related IssuesCloses #123Relates to #456
```
```
<type>(<scope>): <subject>
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
refactor
```
```
test
```
```
ci
```
```
chore
```
```
feat(auth): add OAuth2 support for Google and GitHub
```
```
references/commit-message-guide.md
```
```
if (featureFlags.newAuth) {    // New OAuth flow (incomplete but behind flag)  } else {    // Existing flow  }
```
```
if (featureFlags.newAuth) {    // New OAuth flow (incomplete but behind flag)  } else {    // Existing flow  }
```
```
/
```
```
/.github/
```
```
/docs/
```
```
npm run lint
```
```
npm run format
```
```
npm test && npm run lint && npm run build
```
```
npm test && npm run lint && npm run build
```
```
# ✅ CORRECTgit checkout maingit pull upstream maingit checkout -b feature/add-oauth-support# make changes on feature branchgit commit -m "feat(auth): add OAuth support"
```
```
# ✅ CORRECTgit checkout maingit pull upstream maingit checkout -b feature/add-oauth-support# make changes on feature branchgit commit -m "feat(auth): add OAuth support"
```
```
feature/name
```
```
fix/issue-123
```
```
docs/update-readme
```
```
refactor/utils
```
```
test/add-tests
```
```
npm test && npm run lint && npm run build
```
```
## Testing Performed### Automated Tests- ✅ All existing tests pass- ✅ Added 12 new tests for OAuth flow- ✅ Coverage increased from 85% to 87%### Manual Testing- ✅ Tested Google/GitHub OAuth flows end-to-end- ✅ Verified error handling- ✅ Tested on Chrome, Firefox, Safari
```
```
## Testing Performed### Automated Tests- ✅ All existing tests pass- ✅ Added 12 new tests for OAuth flow- ✅ Coverage increased from 85% to 87%### Manual Testing- ✅ Tested Google/GitHub OAuth flows end-to-end- ✅ Verified error handling- ✅ Tested on Chrome, Firefox, Safari
```
```
git diff
```
```
PR #1: Database schema and modelsPR #2: API endpointsPR #3: Frontend componentsPR #4: Integration and tests
```
```
PR #1: Database schema and modelsPR #2: API endpointsPR #3: Frontend componentsPR #4: Integration and tests
```
```
gh pr create --draft
```
```
gh pr ready
```
```
Closes #123Fixes #456Resolves #789# Multiple: Fixes #10, closes #20, resolves #30# Cross-repo: Fixes owner/repo#123
```
```
Closes #123Fixes #456Resolves #789# Multiple: Fixes #10, closes #20, resolves #30# Cross-repo: Fixes owner/repo#123
```
```
gh pr create --fill                    # Auto-fill from commitsgh pr create --draft                   # Draft PRgh pr status                           # See your PRsgh pr checks                           # View CI statusgh pr ready                            # Mark draft as ready
```
```
gh pr create --fill                    # Auto-fill from commitsgh pr create --draft                   # Draft PRgh pr status                           # See your PRsgh pr checks                           # View CI statusgh pr ready                            # Mark draft as ready
```
```
references/pr-checklist.md
```
```
npm test && npm run lint && npm run build
```
```
./scripts/pre-pr-check.sh
```
```
scripts/pre-pr-check.sh
```
```
scripts/clean-branch.sh
```
```
references/pr-template.md
```
```
references/pr-checklist.md
```
```
references/commit-message-guide.md
```
```
assets/good-pr-example.md
```
```
assets/bad-pr-example.md
```
```
./scripts/pre-pr-check.sh
```
Navigating the landscape of open-source projects can be incredibly rewarding, but submitting a pull request that truly resonates with maintainers requires a nuanced approach. This AI Agent Skill is engineered to demystify the contribution process, offering strategic guidance to ensure your code is not only technically sound but also aligns with project standards and community expectations. By leveraging intelligent insights, developers can significantly enhance their chances of successful PR merges, fostering a more collaborative and efficient open-source ecosystem. It's an indispensable tool for anyone looking to make a meaningful impact and build a strong reputation within the developer community.

# When to Use This Skill
- •When preparing a pull request for a new feature in a community library.
- •When fixing a bug in an open-source framework and needing to submit a patch.
- •When contributing documentation or example code to an existing project.
- •When seeking to improve the quality and maintainability of your open-source submissions.

# Pro Tips
- 💡**Pre-flight Check:** Always run the skill *before* committing to identify and rectify common PR pitfalls, especially regarding temporary files or debugging artifacts.
- 💡**Incremental Contributions:** For larger features, break down your work into smaller, focused pull requests. The skill can help ensure each PR is clean and self-contained.
- 💡**Read the Project's CONTRIBUTING.md:** While this skill provides general best practices, always prioritize and cross-reference with the specific guidelines outlined in the target repository's contribution document.

