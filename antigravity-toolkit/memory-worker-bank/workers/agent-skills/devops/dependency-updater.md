# dependency-updater
Source: https://antigravity.codes/agent-skills/devops/dependency-updater

## AI Worker Instructions
When the user requests functionality related to dependency-updater, follow these guidelines and utilize this context.

## Scraped Content

# dependency-updater
```
update my dependencies
```
```
update my dependencies
```
```
taze
```
```
npm audit
```
```
pip-review
```
```
safety
```
```
pip-audit
```
```
go get -u
```
```
govulncheck
```
```
cargo update
```
```
cargo audit
```
```
bundle update
```
```
bundle audit
```
```
mvn versions:*
```
```
mvn dependency:*
```
```
dotnet outdated
```
```
dotnet list package --vulnerable
```
```
^
```
```
~
```
```
x.y.z
```
```
x.y.Z
```
```
x.y.z
```
```
x.Y.0
```
```
x.y.z
```
```
X.0.0
```
```
User Request    │    ▼┌─────────────────────────────────────────────────────┐│ Step 1: DETECT PROJECT TYPE                         ││ • Scan for package files (package.json, go.mod...) ││ • Identify package manager                          │├─────────────────────────────────────────────────────┤│ Step 2: CHECK PREREQUISITES                         ││ • Verify required tools are installed               ││ • Suggest installation if missing                   │├─────────────────────────────────────────────────────┤│ Step 3: SCAN FOR UPDATES                            ││ • Run language-specific outdated check              ││ • Categorize: MAJOR / MINOR / PATCH / Fixed         │├─────────────────────────────────────────────────────┤│ Step 4: AUTO-APPLY SAFE UPDATES                     ││ • Apply MINOR and PATCH automatically               ││ • Report what was updated                           │├─────────────────────────────────────────────────────┤│ Step 5: PROMPT FOR MAJOR UPDATES                    ││ • AskUserQuestion for each MAJOR update             ││ • Show current → new version                        │├─────────────────────────────────────────────────────┤│ Step 6: APPLY APPROVED MAJORS                       ││ • Update only approved packages                     │├─────────────────────────────────────────────────────┤│ Step 7: FINALIZE                                    ││ • Run install command                               ││ • Run security audit                                │└─────────────────────────────────────────────────────┘
```
```
User Request    │    ▼┌─────────────────────────────────────────────────────┐│ Step 1: DETECT PROJECT TYPE                         ││ • Scan for package files (package.json, go.mod...) ││ • Identify package manager                          │├─────────────────────────────────────────────────────┤│ Step 2: CHECK PREREQUISITES                         ││ • Verify required tools are installed               ││ • Suggest installation if missing                   │├─────────────────────────────────────────────────────┤│ Step 3: SCAN FOR UPDATES                            ││ • Run language-specific outdated check              ││ • Categorize: MAJOR / MINOR / PATCH / Fixed         │├─────────────────────────────────────────────────────┤│ Step 4: AUTO-APPLY SAFE UPDATES                     ││ • Apply MINOR and PATCH automatically               ││ • Report what was updated                           │├─────────────────────────────────────────────────────┤│ Step 5: PROMPT FOR MAJOR UPDATES                    ││ • AskUserQuestion for each MAJOR update             ││ • Show current → new version                        │├─────────────────────────────────────────────────────┤│ Step 6: APPLY APPROVED MAJORS                       ││ • Update only approved packages                     │├─────────────────────────────────────────────────────┤│ Step 7: FINALIZE                                    ││ • Run install command                               ││ • Run security audit                                │└─────────────────────────────────────────────────────┘
```
```
# Check prerequisitesscripts/check-tool.sh taze "npm install -g taze"# Scan for updatestaze# Apply minor/patchtaze minor --write# Apply specific majorstaze major --write --include pkg1,pkg2# Monorepo supporttaze -r  # recursive# Securitynpm auditnpm audit fix
```
```
# Check prerequisitesscripts/check-tool.sh taze "npm install -g taze"# Scan for updatestaze# Apply minor/patchtaze minor --write# Apply specific majorstaze major --write --include pkg1,pkg2# Monorepo supporttaze -r  # recursive# Securitynpm auditnpm audit fix
```
```
# Check outdatedpip list --outdated# Update all (careful!)pip-review --auto# Update specificpip install --upgrade package-name# Securitypip-auditsafety check
```
```
# Check outdatedpip list --outdated# Update all (careful!)pip-review --auto# Update specificpip install --upgrade package-name# Securitypip-auditsafety check
```
```
# Check outdatedgo list -m -u all# Update allgo get -u ./...# Tidy upgo mod tidy# Securitygovulncheck ./...
```
```
# Check outdatedgo list -m -u all# Update allgo get -u ./...# Tidy upgo mod tidy# Securitygovulncheck ./...
```
```
# Check outdatedcargo outdated# Update within semvercargo update# Securitycargo audit
```
```
# Check outdatedcargo outdated# Update within semvercargo update# Securitycargo audit
```
```
# Check outdatedbundle outdated# Update allbundle update# Update specificbundle update --conservative gem-name# Securitybundle audit
```
```
# Check outdatedbundle outdated# Update allbundle update# Update specificbundle update --conservative gem-name# Securitybundle audit
```
```
# Check outdatedmvn versions:display-dependency-updates# Update to latestmvn versions:use-latest-releases# Securitymvn dependency:treemvn dependency-check:check
```
```
# Check outdatedmvn versions:display-dependency-updates# Update to latestmvn versions:use-latest-releases# Securitymvn dependency:treemvn dependency-check:check
```
```
# Check outdateddotnet list package --outdated# Update specificdotnet add package PackageName# Securitydotnet list package --vulnerable
```
```
# Check outdateddotnet list package --outdated# Update specificdotnet add package PackageName# Securitydotnet list package --vulnerable
```
```
npm audit
```
```
npm audit fix
```
```
depcheck
```
```
npm dedupe
```
```
# Node.js - Nuclear resetrm -rf node_modules package-lock.jsonnpm cache clean --forcenpm install# Python - Clean virtualenvrm -rf venvpython -m venv venvsource venv/bin/activatepip install -r requirements.txt# Go - Reset modulesrm go.sumgo mod tidy
```
```
# Node.js - Nuclear resetrm -rf node_modules package-lock.jsonnpm cache clean --forcenpm install# Python - Clean virtualenvrm -rf venvpython -m venv venvsource venv/bin/activatepip install -r requirements.txt# Go - Reset modulesrm go.sumgo mod tidy
```
```
# Node.jsnpm auditnpm audit --json | jq '.metadata.vulnerabilities'# Pythonpip-auditsafety check# Gogovulncheck ./...# Rustcargo audit# Rubybundle audit# .NETdotnet list package --vulnerable
```
```
# Node.jsnpm auditnpm audit --json | jq '.metadata.vulnerabilities'# Pythonpip-auditsafety check# Gogovulncheck ./...# Rustcargo audit# Rubybundle audit# .NETdotnet list package --vulnerable
```
```
package.json
```
```
requirements.txt
```
```
pyproject.toml
```
```
Pipfile
```
```
go.mod
```
```
Cargo.toml
```
```
Gemfile
```
```
pom.xml
```
```
build.gradle
```
```
*.csproj
```
```
# Install taze globally (recommended)npm install -g taze# Or use npxnpx taze
```
```
# Install taze globally (recommended)npm install -g taze# Or use npxnpx taze
```
```
# 1. Scan all updatestaze# 2. Apply safe updates (minor + patch)taze minor --write# 3. For each major, prompt user:#    "Update @types/node from ^20.0.0 to ^22.0.0?"#    If yes, add to approved list# 4. Apply approved majorstaze major --write --include approved-pkg1,approved-pkg2# 5. Installnpm install  # or pnpm install / yarn
```
```
# 1. Scan all updatestaze# 2. Apply safe updates (minor + patch)taze minor --write# 3. For each major, prompt user:#    "Update @types/node from ^20.0.0 to ^22.0.0?"#    If yes, add to approved list# 4. Apply approved majorstaze major --write --include approved-pkg1,approved-pkg2# 5. Installnpm install  # or pnpm install / yarn
```
```
lucide-react
```
```
@types/*
```
```
MAJOR.MINOR.PATCH (e.g., 2.3.1)MAJOR: Breaking changes - requires code changesMINOR: New features - backward compatiblePATCH: Bug fixes - backward compatible
```
```
MAJOR.MINOR.PATCH (e.g., 2.3.1)MAJOR: Breaking changes - requires code changesMINOR: New features - backward compatiblePATCH: Bug fixes - backward compatible
```
```
^1.2.3
```
```
>=1.2.3 <2.0.0
```
```
~1.2.3
```
```
>=1.2.3 <1.3.0
```
```
1.2.3
```
```
1.2.3
```
```
>=1.2.3
```
```
>=1.2.3
```
```
*
```
```
{  "dependencies": {    "critical-lib": "1.2.3",      // Exact for critical    "stable-lib": "~1.2.3",       // Patch only for stable    "modern-lib": "^1.2.3"        // Minor OK for active  }}
```
```
{  "dependencies": {    "critical-lib": "1.2.3",      // Exact for critical    "stable-lib": "~1.2.3",       // Patch only for stable    "modern-lib": "^1.2.3"        // Minor OK for active  }}
```
```
npm ls package-name      # See dependency treenpm explain package-name # Why installedyarn why package-name    # Yarn equivalent
```
```
npm ls package-name      # See dependency treenpm explain package-name # Why installedyarn why package-name    # Yarn equivalent
```
```
// package.json{  "overrides": {    "lodash": "^4.18.0"  }}
```
```
// package.json{  "overrides": {    "lodash": "^4.18.0"  }}
```
```
{  "resolutions": {    "lodash": "^4.18.0"  }}
```
```
{  "resolutions": {    "lodash": "^4.18.0"  }}
```
```
pip checkpipdeptree -p package-name
```
```
pip checkpipdeptree -p package-name
```
```
# Use virtual environmentpython -m venv venvsource venv/bin/activatepip install -r requirements.txt# Or use constraintspip install -c constraints.txt -r requirements.txt
```
```
# Use virtual environmentpython -m venv venvsource venv/bin/activatepip install -r requirements.txt# Or use constraintspip install -c constraints.txt -r requirements.txt
```
```
scripts/check-tool.sh
```
```
scripts/run-taze.sh
```
This skill elevates your development workflow by intelligently handling the complexities of project dependencies. Designed for polyglot environments, it seamlessly integrates across various programming languages, ensuring your applications remain secure, up-to-date, and performant. Forget manual checks and tedious updates; this agent not only identifies outdated packages but also suggests and applies safe updates, proactively diagnosing and resolving potential conflicts. Empower your team to focus on innovation while the "Dependency Updater" maintains the health of your project's ecosystem. A crucial asset for modern software development, it simplifies a critical but often overlooked aspect of code maintenance.

# When to Use This Skill
- •Automating weekly or nightly checks for outdated packages across multiple repositories.
- •Quickly resolving CI/CD pipeline failures caused by dependency conflicts or security vulnerabilities.
- •Performing a comprehensive security audit on a legacy project before a major release.
- •Onboarding new developers by providing a tool to standardize dependency versions across the team.

# Pro Tips
- 💡Combine 'update dependencies' with a specific branch checkout command in your workflow to ensure updates are applied to dedicated feature branches first.
- 💡Utilize the 'security audit' trigger regularly in pre-commit hooks or CI pipelines to catch vulnerabilities early.
- 💡For major version upgrades, always review the change logs provided by the package maintainers before confirming the update to prevent breaking changes.

