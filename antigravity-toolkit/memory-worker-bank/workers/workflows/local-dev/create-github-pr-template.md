# Create GitHub PR Template
Source: https://antigravity.codes/workflows/local-dev/create-github-pull-request-template-markdown

## AI Worker Instructions
When the user requests functionality related to Create GitHub PR Template, follow these guidelines and utilize this context.

## Scraped Content

# Create GitHub PR Template
```
.github/
```
```
mkdir -p .github
```
```
markdown\n   ## Description\n   Briefly describe what this PR does.\n   \n   ## Type of Change\n   - [ ] Bug fix\n   - [ ] New feature\n   - [ ] Breaking change\n   - [ ] Documentation update\n   \n   ## Testing\n   - [ ] I have tested these changes locally\n   - [ ] I have added/updated tests\n   - [ ] All tests pass\n   \n   ## Screenshots (if applicable)\n   \n   ## Checklist\n   - [ ] My code follows the project's style guidelines\n   - [ ] I have performed a self-review\n   - [ ] I have commented complex code\n   - [ ] I have updated documentation\n   - [ ] No new warnings generated\n   \n   ## Related Issues\n   Closes #\n
```
```
\n   - Save this as
```
```
\n3. **Commit and Push**:   - Add the template to your repository.   // turbo   - Run
```
```
4. **Test It**:   - Create a new PR and the template will auto-populate.5. **Pro Tips**:   - Customize the template for your team's workflow.   - Add a link to your contributing guidelines.   - Use multiple templates for different PR types (create
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as create-github-pull-request-template-markdown.md
```
create-github-pull-request-template-markdown.md
```
- In Antigravity, type /create_github_pull_request_template_markdown or just describe what you want to do
```
/create_github_pull_request_template_markdown
```
Learn more about workflows →

# Related Workflows

# Setup Husky Git Hooks

# Kill Port 3000

# Generate .env from Example

