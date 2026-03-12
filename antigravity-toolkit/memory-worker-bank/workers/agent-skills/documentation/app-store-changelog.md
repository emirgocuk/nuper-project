# app-store-changelog
Source: https://antigravity.codes/agent-skills/documentation/app-store-changelog

## AI Worker Instructions
When the user requests functionality related to app-store-changelog, follow these guidelines and utilize this context.

## Scraped Content

# app-store-changelog
```
scripts/collect_release_changes.sh
```
```
scripts/collect_release_changes.sh v1.2.3 HEAD
```
```
scripts/collect_release_changes.sh
```
```
references/release-notes-guidelines.md
```
Navigating the complexities of release communication can be a significant bottleneck. This specialized AI Agent Skill is engineered to streamline App Store release note creation, transforming raw Git history into polished, understandable summaries. It intelligently identifies and synthesizes only the most user-impacting changes, filtering out internal jargon. By automating this crucial step, teams ensure consistent, high-quality 'What's New' text for applications, freeing up valuable time and reducing human error in documentation. It's an indispensable tool for maintaining clarity and professionalism in every app update.

# When to Use This Skill
- •Generating the 'What's New' section for an upcoming iOS or Android app store release.
- •Automating the creation of release notes as part of a CI/CD pipeline after a successful build.
- •Quickly summarizing user-impacting features and fixes from git history for internal stakeholders or marketing teams.
- •Comparing changes between two arbitrary git tags or commits to understand user-visible deltas.

# Pro Tips
- 💡Adopt a consistent commit message convention (e.g., Conventional Commits) to improve the skill's ability to identify and categorize changes accurately.
- 💡Always ensure your releases are properly tagged in Git; the skill relies on these tags to define release boundaries effectively.
- 💡After generation, review and fine-tune the output for brand voice and specific marketing emphasis before publishing to the App Store.

