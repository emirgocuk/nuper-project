# plugin-forge
Source: https://antigravity.codes/agent-skills/ai-tools/plugin-forge

## AI Worker Instructions
When the user requests functionality related to plugin-forge, follow these guidelines and utilize this context.

## Scraped Content

# plugin-forge
```
create_plugin.py
```
```
python scripts/create_plugin.py plugin-name \  --marketplace-root /path/to/marketplace \  --author-name "Your Name" \  --author-email "your.email@example.com" \  --description "Plugin description" \  --keywords "keyword1,keyword2" \  --category "productivity"
```
```
python scripts/create_plugin.py plugin-name \  --marketplace-root /path/to/marketplace \  --author-name "Your Name" \  --author-email "your.email@example.com" \  --description "Plugin description" \  --keywords "keyword1,keyword2" \  --category "productivity"
```
```
plugin.json
```
```
marketplace.json
```
```
bump_version.py
```
```
python scripts/bump_version.py plugin-name major|minor|patch \  --marketplace-root /path/to/marketplace
```
```
python scripts/bump_version.py plugin-name major|minor|patch \  --marketplace-root /path/to/marketplace
```
```
mkdir -p plugins/plugin-name/.claude-pluginmkdir -p plugins/plugin-name/commandsmkdir -p plugins/plugin-name/skills
```
```
mkdir -p plugins/plugin-name/.claude-pluginmkdir -p plugins/plugin-name/commandsmkdir -p plugins/plugin-name/skills
```
```
plugins/plugin-name/.claude-plugin/plugin.json
```
```
{  "name": "plugin-name",  "version": "0.1.0",  "description": "Plugin description",  "author": {    "name": "Your Name",    "email": "your.email@example.com"  },  "keywords": ["keyword1", "keyword2"]}
```
```
{  "name": "plugin-name",  "version": "0.1.0",  "description": "Plugin description",  "author": {    "name": "Your Name",    "email": "your.email@example.com"  },  "keywords": ["keyword1", "keyword2"]}
```
```
.claude-plugin/marketplace.json
```
```
{  "name": "plugin-name",  "source": "./plugins/plugin-name",  "description": "Plugin description",  "version": "0.1.0",  "keywords": ["keyword1", "keyword2"],  "category": "productivity"}
```
```
{  "name": "plugin-name",  "source": "./plugins/plugin-name",  "description": "Plugin description",  "version": "0.1.0",  "keywords": ["keyword1", "keyword2"],  "category": "productivity"}
```
```
commands/
```
```
skills/<name>/
```
```
SKILL.md
```
```
agents/
```
```
hooks/hooks.json
```
```
.mcp.json
```
```
# Add marketplace/plugin marketplace add /path/to/marketplace-root# Install plugin/plugin install plugin-name@marketplace-name# After changes: reinstall/plugin uninstall plugin-name@marketplace-name/plugin install plugin-name@marketplace-name
```
```
# Add marketplace/plugin marketplace add /path/to/marketplace-root# Install plugin/plugin install plugin-name@marketplace-name# After changes: reinstall/plugin uninstall plugin-name@marketplace-name/plugin install plugin-name@marketplace-name
```
```
plugins/framework-name/├── .claude-plugin/plugin.json├── skills/│   └── framework-name/│       ├── SKILL.md│       └── references/├── commands/│   └── prime/│       ├── components.md│       └── framework.md└── README.md
```
```
plugins/framework-name/├── .claude-plugin/plugin.json├── skills/│   └── framework-name/│       ├── SKILL.md│       └── references/├── commands/│   └── prime/│       ├── components.md│       └── framework.md└── README.md
```
```
plugins/utility-name/├── .claude-plugin/plugin.json├── commands/│   ├── action1.md│   └── action2.md└── README.md
```
```
plugins/utility-name/├── .claude-plugin/plugin.json├── commands/│   ├── action1.md│   └── action2.md└── README.md
```
```
plugins/domain-name/├── .claude-plugin/plugin.json├── skills/│   └── domain-name/│       ├── SKILL.md│       ├── references/│       └── scripts/└── README.md
```
```
plugins/domain-name/├── .claude-plugin/plugin.json├── skills/│   └── domain-name/│       ├── SKILL.md│       ├── references/│       └── scripts/└── README.md
```
```
:
```
```
commands/namespace/command.md
```
```
/namespace:command
```
```
commands/simple.md
```
```
/simple
```
```
commands/prime/vue.md
```
```
/prime:vue
```
```
commands/docs/generate.md
```
```
/docs:generate
```
```
plugins/<name>/.claude-plugin/plugin.json
```
```
.claude-plugin/marketplace.json
```
```
bump_version.py
```
```
git commit -m "feat: add new plugin"git commit -m "fix: correct plugin manifest"git commit -m "docs: update plugin README"git commit -m "feat!: breaking change"
```
```
git commit -m "feat: add new plugin"git commit -m "fix: correct plugin manifest"git commit -m "docs: update plugin README"git commit -m "feat!: breaking change"
```
```
references/plugin-structure.md
```
```
references/marketplace-schema.md
```
```
references/workflows.md
```
```
scripts/create_plugin.py
```
```
scripts/bump_version.py
```
For developers aiming to extend the capabilities of Claude Code, the Plugin Forge Agent Skill provides an indispensable toolkit. This skill streamlines the entire lifecycle of plugin creation, from initial scaffolding to meticulous version management and seamless marketplace integration. It empowers users to build robust, well-structured plugins that adhere to best practices, ensuring compatibility and discoverability. Leverage this skill to transform your innovative ideas into functional enhancements that enrich the Claude Code ecosystem, making your custom solutions easily accessible and manageable.

# When to Use This Skill
- •Developing a new custom tool or extension for the Claude Code environment.
- •Updating existing plugin functionalities, commands, or hooks with new features.
- •Preparing a plugin for submission to a public marketplace, ensuring manifest correctness.
- •Automating manifest updates and version bumping for a plugin during its release cycle.

# Pro Tips
- 💡Always use the provided Python scripts (e.g., `create_plugin.py`, `bump_version.py`) to ensure manifest consistency and prevent manual errors.
- 💡Leverage the `--marketplace-root` flag for centralizing plugin management when contributing to a shared marketplace.
- 💡Integrate the version bumping scripts into your CI/CD pipeline for automated, semantic version releases.

