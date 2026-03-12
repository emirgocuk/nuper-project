# dependency-upgrade
Source: https://antigravity.codes/agent-skills/devops/dependency-upgrade

## AI Worker Instructions
When the user requests functionality related to dependency-upgrade, follow these guidelines and utilize this context.

## Scraped Content

# dependency-upgrade
```
MAJOR.MINOR.PATCH (e.g., 2.3.1)MAJOR: Breaking changesMINOR: New features, backward compatiblePATCH: Bug fixes, backward compatible^2.3.1 = >=2.3.1 <3.0.0 (minor updates)~2.3.1 = >=2.3.1 <2.4.0 (patch updates)2.3.1 = exact version
```
```
MAJOR.MINOR.PATCH (e.g., 2.3.1)MAJOR: Breaking changesMINOR: New features, backward compatiblePATCH: Bug fixes, backward compatible^2.3.1 = >=2.3.1 <3.0.0 (minor updates)~2.3.1 = >=2.3.1 <2.4.0 (patch updates)2.3.1 = exact version
```
```
# npmnpm outdatednpm auditnpm audit fix# yarnyarn outdatedyarn audit# Check for major updatesnpx npm-check-updatesnpx npm-check-updates -u  # Update package.json
```
```
# npmnpm outdatednpm auditnpm audit fix# yarnyarn outdatedyarn audit# Check for major updatesnpx npm-check-updatesnpx npm-check-updates -u  # Update package.json
```
```
# See why a package is installednpm ls package-nameyarn why package-name# Find duplicate packagesnpm dedupeyarn dedupe# Visualize dependenciesnpx madge --image graph.png src/
```
```
# See why a package is installednpm ls package-nameyarn why package-name# Find duplicate packagesnpm dedupeyarn dedupe# Visualize dependenciesnpx madge --image graph.png src/
```
```
// compatibility-matrix.jsconst compatibilityMatrix = {  react: {    "16.x": {      "react-dom": "^16.0.0",      "react-router-dom": "^5.0.0",      "@testing-library/react": "^11.0.0",    },    "17.x": {      "react-dom": "^17.0.0",      "react-router-dom": "^5.0.0 || ^6.0.0",      "@testing-library/react": "^12.0.0",    },    "18.x": {      "react-dom": "^18.0.0",      "react-router-dom": "^6.0.0",      "@testing-library/react": "^13.0.0",    },  },};function checkCompatibility(packages) {  // Validate package versions against matrix}
```
```
// compatibility-matrix.jsconst compatibilityMatrix = {  react: {    "16.x": {      "react-dom": "^16.0.0",      "react-router-dom": "^5.0.0",      "@testing-library/react": "^11.0.0",    },    "17.x": {      "react-dom": "^17.0.0",      "react-router-dom": "^5.0.0 || ^6.0.0",      "@testing-library/react": "^12.0.0",    },    "18.x": {      "react-dom": "^18.0.0",      "react-router-dom": "^6.0.0",      "@testing-library/react": "^13.0.0",    },  },};function checkCompatibility(packages) {  // Validate package versions against matrix}
```
```
# 1. Identify current versionsnpm list --depth=0# 2. Check for breaking changes# Read CHANGELOG.md and MIGRATION.md# 3. Create upgrade planecho "Upgrade order:1. TypeScript2. React3. React Router4. Testing libraries5. Build tools" > UPGRADE_PLAN.md
```
```
# 1. Identify current versionsnpm list --depth=0# 2. Check for breaking changes# Read CHANGELOG.md and MIGRATION.md# 3. Create upgrade planecho "Upgrade order:1. TypeScript2. React3. React Router4. Testing libraries5. Build tools" > UPGRADE_PLAN.md
```
```
# Don't upgrade everything at once!# Step 1: Update TypeScriptnpm install typescript@latest# Testnpm run testnpm run build# Step 2: Update React (one major version at a time)npm install react@17 react-dom@17# Test againnpm run test# Step 3: Continue with other packagesnpm install react-router-dom@6# And so on...
```
```
# Don't upgrade everything at once!# Step 1: Update TypeScriptnpm install typescript@latest# Testnpm run testnpm run build# Step 2: Update React (one major version at a time)npm install react@17 react-dom@17# Test againnpm run test# Step 3: Continue with other packagesnpm install react-router-dom@6# And so on...
```
```
// tests/compatibility.test.jsdescribe("Dependency Compatibility", () => {  it("should have compatible React versions", () => {    const reactVersion = require("react/package.json").version;    const reactDomVersion = require("react-dom/package.json").version;    expect(reactVersion).toBe(reactDomVersion);  });  it("should not have peer dependency warnings", () => {    // Run npm ls and check for warnings  });});
```
```
// tests/compatibility.test.jsdescribe("Dependency Compatibility", () => {  it("should have compatible React versions", () => {    const reactVersion = require("react/package.json").version;    const reactDomVersion = require("react-dom/package.json").version;    expect(reactVersion).toBe(reactDomVersion);  });  it("should not have peer dependency warnings", () => {    // Run npm ls and check for warnings  });});
```
```
# Use changelog parsersnpx changelog-parser react 16.0.0 17.0.0# Or manually checkcurl https://raw.githubusercontent.com/facebook/react/main/CHANGELOG.md
```
```
# Use changelog parsersnpx changelog-parser react 16.0.0 17.0.0# Or manually checkcurl https://raw.githubusercontent.com/facebook/react/main/CHANGELOG.md
```
```
# React upgrade codemodsnpx react-codeshift <transform> <path># Example: Update lifecycle methodsnpx react-codeshift \  --parser tsx \  --transform react-codeshift/transforms/rename-unsafe-lifecycles.js \  src/
```
```
# React upgrade codemodsnpx react-codeshift <transform> <path># Example: Update lifecycle methodsnpx react-codeshift \  --parser tsx \  --transform react-codeshift/transforms/rename-unsafe-lifecycles.js \  src/
```
```
// migration-script.jsconst fs = require("fs");const glob = require("glob");glob("src/**/*.tsx", (err, files) => {  files.forEach((file) => {    let content = fs.readFileSync(file, "utf8");    // Replace old API with new API    content = content.replace(      /componentWillMount/g,      "UNSAFE_componentWillMount",    );    // Update imports    content = content.replace(      /import { Component } from 'react'/g,      "import React, { Component } from 'react'",    );    fs.writeFileSync(file, content);  });});
```
```
// migration-script.jsconst fs = require("fs");const glob = require("glob");glob("src/**/*.tsx", (err, files) => {  files.forEach((file) => {    let content = fs.readFileSync(file, "utf8");    // Replace old API with new API    content = content.replace(      /componentWillMount/g,      "UNSAFE_componentWillMount",    );    // Update imports    content = content.replace(      /import { Component } from 'react'/g,      "import React, { Component } from 'react'",    );    fs.writeFileSync(file, content);  });});
```
```
// Ensure tests pass before and after upgradenpm run test// Update test utilities if needednpm install @testing-library/react@latest
```
```
// Ensure tests pass before and after upgradenpm run test// Update test utilities if needednpm install @testing-library/react@latest
```
```
// tests/integration/app.test.jsdescribe("App Integration", () => {  it("should render without crashing", () => {    render(<App />);  });  it("should handle navigation", () => {    const { getByText } = render(<App />);    fireEvent.click(getByText("Navigate"));    expect(screen.getByText("New Page")).toBeInTheDocument();  });});
```
```
// tests/integration/app.test.jsdescribe("App Integration", () => {  it("should render without crashing", () => {    render(<App />);  });  it("should handle navigation", () => {    const { getByText } = render(<App />);    fireEvent.click(getByText("Navigate"));    expect(screen.getByText("New Page")).toBeInTheDocument();  });});
```
```
// visual-regression.test.jsdescribe("Visual Regression", () => {  it("should match snapshot", () => {    const { container } = render(<App />);    expect(container.firstChild).toMatchSnapshot();  });});
```
```
// visual-regression.test.jsdescribe("Visual Regression", () => {  it("should match snapshot", () => {    const { container } = render(<App />);    expect(container.firstChild).toMatchSnapshot();  });});
```
```
// cypress/e2e/app.cy.jsdescribe("E2E Tests", () => {  it("should complete user flow", () => {    cy.visit("/");    cy.get('[data-testid="login"]').click();    cy.get('input[name="email"]').type("user@example.com");    cy.get('button[type="submit"]').click();    cy.url().should("include", "/dashboard");  });});
```
```
// cypress/e2e/app.cy.jsdescribe("E2E Tests", () => {  it("should complete user flow", () => {    cy.visit("/");    cy.get('[data-testid="login"]').click();    cy.get('input[name="email"]').type("user@example.com");    cy.get('button[type="submit"]').click();    cy.url().should("include", "/dashboard");  });});
```
```
// renovate.json{  "extends": ["config:base"],  "packageRules": [    {      "matchUpdateTypes": ["minor", "patch"],      "automerge": true    },    {      "matchUpdateTypes": ["major"],      "automerge": false,      "labels": ["major-update"]    }  ],  "schedule": ["before 3am on Monday"],  "timezone": "America/New_York"}
```
```
// renovate.json{  "extends": ["config:base"],  "packageRules": [    {      "matchUpdateTypes": ["minor", "patch"],      "automerge": true    },    {      "matchUpdateTypes": ["major"],      "automerge": false,      "labels": ["major-update"]    }  ],  "schedule": ["before 3am on Monday"],  "timezone": "America/New_York"}
```
```
# .github/dependabot.ymlversion: 2updates:  - package-ecosystem: "npm"    directory: "/"    schedule:      interval: "weekly"    open-pull-requests-limit: 5    reviewers:      - "team-leads"    commit-message:      prefix: "chore"      include: "scope"
```
```
# .github/dependabot.ymlversion: 2updates:  - package-ecosystem: "npm"    directory: "/"    schedule:      interval: "weekly"    open-pull-requests-limit: 5    reviewers:      - "team-leads"    commit-message:      prefix: "chore"      include: "scope"
```
```
// rollback.sh#!/bin/bash# Save current stategit stashgit checkout -b upgrade-branch# Attempt upgradenpm install package@latest# Run testsif npm run test; then  echo "Upgrade successful"  git add package.json package-lock.json  git commit -m "chore: upgrade package"else  echo "Upgrade failed, rolling back"  git checkout main  git branch -D upgrade-branch  npm install  # Restore from package-lock.jsonfi
```
```
// rollback.sh#!/bin/bash# Save current stategit stashgit checkout -b upgrade-branch# Attempt upgradenpm install package@latest# Run testsif npm run test; then  echo "Upgrade successful"  git add package.json package-lock.json  git commit -m "chore: upgrade package"else  echo "Upgrade failed, rolling back"  git checkout main  git branch -D upgrade-branch  npm install  # Restore from package-lock.jsonfi
```
```
# npmnpm install --package-lock-only  # Update lock file onlynpm ci  # Clean install from lock file# yarnyarn install --frozen-lockfile  # CI modeyarn upgrade-interactive  # Interactive upgrades
```
```
# npmnpm install --package-lock-only  # Update lock file onlynpm ci  # Clean install from lock file# yarnyarn install --frozen-lockfile  # CI modeyarn upgrade-interactive  # Interactive upgrades
```
```
# npm 7+: strict peer dependenciesnpm install --legacy-peer-deps  # Ignore peer deps# npm 8+: override peer dependenciesnpm install --force
```
```
# npm 7+: strict peer dependenciesnpm install --legacy-peer-deps  # Ignore peer deps# npm 8+: override peer dependenciesnpm install --force
```
```
# Update all workspace packagesnpm install --workspaces# Update specific workspacenpm install package@latest --workspace=packages/app
```
```
# Update all workspace packagesnpm install --workspaces# Update specific workspacenpm install package@latest --workspace=packages/app
```
```
Pre-Upgrade:- [ ] Review current dependency versions- [ ] Read changelogs for breaking changes- [ ] Create feature branch- [ ] Backup current state (git tag)- [ ] Run full test suite (baseline)During Upgrade:- [ ] Upgrade one dependency at a time- [ ] Update peer dependencies- [ ] Fix TypeScript errors- [ ] Update tests if needed- [ ] Run test suite after each upgrade- [ ] Check bundle size impactPost-Upgrade:- [ ] Full regression testing- [ ] Performance testing- [ ] Update documentation- [ ] Deploy to staging- [ ] Monitor for errors- [ ] Deploy to production
```
```
Pre-Upgrade:- [ ] Review current dependency versions- [ ] Read changelogs for breaking changes- [ ] Create feature branch- [ ] Backup current state (git tag)- [ ] Run full test suite (baseline)During Upgrade:- [ ] Upgrade one dependency at a time- [ ] Update peer dependencies- [ ] Fix TypeScript errors- [ ] Update tests if needed- [ ] Run test suite after each upgrade- [ ] Check bundle size impactPost-Upgrade:- [ ] Full regression testing- [ ] Performance testing- [ ] Update documentation- [ ] Deploy to staging- [ ] Monitor for errors- [ ] Deploy to production
```
Keeping project dependencies current is crucial for security, performance, and leveraging the latest features. This agent skill empowers developers to navigate the complexities of major version upgrades with confidence. It goes beyond simple `npm update`, offering structured guidance on compatibility analysis, managing breaking changes, and implementing phased deployment strategies. By focusing on thorough testing and strategic planning, this skill helps mitigate risks associated with dependency updates, ensuring project stability and long-term maintainability. It's an indispensable tool for proactive code stewardship and technical debt reduction.

# When to Use This Skill
- •Initiating an upgrade from an older version of React to the latest major version.
- •Addressing critical security vulnerabilities identified in an outdated backend framework.
- •Migrating a large codebase to a newer Node.js LTS version, requiring multiple dependency updates.
- •Planning a year-long roadmap for incrementally updating all project dependencies to their latest stable versions.

# Pro Tips
- 💡Always start major upgrades in a dedicated branch and integrate continuous integration (CI) tests early to catch regressions.
- 💡Leverage community resources and migration guides provided by the library maintainers, as they often contain critical steps and common pitfalls.
- 💡Consider using tools like Dependabot or Renovate for automated minor/patch updates, reserving this skill for strategic major version shifts.

