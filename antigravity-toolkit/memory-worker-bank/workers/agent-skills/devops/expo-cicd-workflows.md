# expo-cicd-workflows
Source: https://antigravity.codes/agent-skills/devops/expo-cicd-workflows

## AI Worker Instructions
When the user requests functionality related to expo-cicd-workflows, follow these guidelines and utilize this context.

## Scraped Content

# expo-cicd-workflows
```
scripts/
```
```
# Fetch resourcesnode {baseDir}/scripts/fetch.js <url>
```
```
# Fetch resourcesnode {baseDir}/scripts/fetch.js <url>
```
```
.eas/workflows/*.yml
```
```
.yaml
```
```
name
```
```
on
```
```
jobs
```
```
defaults
```
```
concurrency
```
```
${{ }}
```
```
github.*
```
```
inputs.*
```
```
workflow_dispatch
```
```
needs.*
```
```
jobs.*
```
```
steps.*
```
```
workflow.*
```
```
needs
```
```
after
```
```
if
```
```
# Install dependencies if missing[ -d "{baseDir}/scripts/node_modules" ] || npm install --prefix {baseDir}/scriptsnode {baseDir}/scripts/validate.js <workflow.yml> [workflow2.yml ...]
```
```
# Install dependencies if missing[ -d "{baseDir}/scripts/node_modules" ] || npm install --prefix {baseDir}/scriptsnode {baseDir}/scripts/validate.js <workflow.yml> [workflow2.yml ...]
```
This specialized AI agent skill empowers Expo developers to effortlessly navigate the complexities of EAS (Expo Application Services) CI/CD workflows. Designed to streamline your development process, it assists in crafting robust and efficient YAML configuration files for automating builds, tests, and deployments. Leverage its deep understanding of Expo's ecosystem to ensure your mobile projects move from development to production with unparalleled precision and speed, minimizing manual errors and accelerating release cycles. It's your ultimate co-pilot for mastering continuous integration and delivery within the Expo framework.

# When to Use This Skill
- •Writing a new `.eas/workflows/` YAML file for an Expo project's CI/CD pipeline from scratch.
- •Debugging errors or optimizing an existing EAS workflow configuration that isn't behaving as expected.
- •Adding custom build steps, triggers, or integrating pre-packaged jobs into your Expo deployment strategy.
- •Understanding the latest EAS workflow schema and best practices for secure and efficient mobile app builds.

# Pro Tips
- 💡Always fetch the latest EAS workflow JSON schema (https://api.expo.dev/v2/workflows/schema) using the provided script before attempting to validate or generate new YAML files, as it's the definitive source of truth.
- 💡Leverage the skill's ability to reference syntax and pre-packaged job documentation to avoid common mistakes and implement best practices directly in your workflow configurations.
- 💡For complex workflows, break down the configuration into smaller, manageable jobs and test them incrementally before combining them, using the skill for step-by-step validation and refinement.

