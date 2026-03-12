# github-actions-templates
Source: https://antigravity.codes/agent-skills/devops/github-actions-templates

## AI Worker Instructions
When the user requests functionality related to github-actions-templates, follow these guidelines and utilize this context.

## Scraped Content

# github-actions-templates
```
name: Teston:  push:    branches: [main, develop]  pull_request:    branches: [main]jobs:  test:    runs-on: ubuntu-latest    strategy:      matrix:        node-version: [18.x, 20.x]    steps:      - uses: actions/checkout@v4      - name: Use Node.js ${{ matrix.node-version }}        uses: actions/setup-node@v4        with:          node-version: ${{ matrix.node-version }}          cache: "npm"      - name: Install dependencies        run: npm ci      - name: Run linter        run: npm run lint      - name: Run tests        run: npm test      - name: Upload coverage        uses: codecov/codecov-action@v3        with:          files: ./coverage/lcov.info
```
```
name: Teston:  push:    branches: [main, develop]  pull_request:    branches: [main]jobs:  test:    runs-on: ubuntu-latest    strategy:      matrix:        node-version: [18.x, 20.x]    steps:      - uses: actions/checkout@v4      - name: Use Node.js ${{ matrix.node-version }}        uses: actions/setup-node@v4        with:          node-version: ${{ matrix.node-version }}          cache: "npm"      - name: Install dependencies        run: npm ci      - name: Run linter        run: npm run lint      - name: Run tests        run: npm test      - name: Upload coverage        uses: codecov/codecov-action@v3        with:          files: ./coverage/lcov.info
```
```
assets/test-workflow.yml
```
```
name: Build and Pushon:  push:    branches: [main]    tags: ["v*"]env:  REGISTRY: ghcr.io  IMAGE_NAME: ${{ github.repository }}jobs:  build:    runs-on: ubuntu-latest    permissions:      contents: read      packages: write    steps:      - uses: actions/checkout@v4      - name: Log in to Container Registry        uses: docker/login-action@v3        with:          registry: ${{ env.REGISTRY }}          username: ${{ github.actor }}          password: ${{ secrets.GITHUB_TOKEN }}      - name: Extract metadata        id: meta        uses: docker/metadata-action@v5        with:          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}          tags: |            type=ref,event=branch            type=ref,event=pr            type=semver,pattern={{version}}            type=semver,pattern={{major}}.{{minor}}      - name: Build and push        uses: docker/build-push-action@v5        with:          context: .          push: true          tags: ${{ steps.meta.outputs.tags }}          labels: ${{ steps.meta.outputs.labels }}          cache-from: type=gha          cache-to: type=gha,mode=max
```
```
name: Build and Pushon:  push:    branches: [main]    tags: ["v*"]env:  REGISTRY: ghcr.io  IMAGE_NAME: ${{ github.repository }}jobs:  build:    runs-on: ubuntu-latest    permissions:      contents: read      packages: write    steps:      - uses: actions/checkout@v4      - name: Log in to Container Registry        uses: docker/login-action@v3        with:          registry: ${{ env.REGISTRY }}          username: ${{ github.actor }}          password: ${{ secrets.GITHUB_TOKEN }}      - name: Extract metadata        id: meta        uses: docker/metadata-action@v5        with:          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}          tags: |            type=ref,event=branch            type=ref,event=pr            type=semver,pattern={{version}}            type=semver,pattern={{major}}.{{minor}}      - name: Build and push        uses: docker/build-push-action@v5        with:          context: .          push: true          tags: ${{ steps.meta.outputs.tags }}          labels: ${{ steps.meta.outputs.labels }}          cache-from: type=gha          cache-to: type=gha,mode=max
```
```
assets/deploy-workflow.yml
```
```
name: Deploy to Kuberneteson:  push:    branches: [main]jobs:  deploy:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Configure AWS credentials        uses: aws-actions/configure-aws-credentials@v4        with:          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}          aws-region: us-west-2      - name: Update kubeconfig        run: |          aws eks update-kubeconfig --name production-cluster --region us-west-2      - name: Deploy to Kubernetes        run: |          kubectl apply -f k8s/          kubectl rollout status deployment/my-app -n production          kubectl get services -n production      - name: Verify deployment        run: |          kubectl get pods -n production          kubectl describe deployment my-app -n production
```
```
name: Deploy to Kuberneteson:  push:    branches: [main]jobs:  deploy:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Configure AWS credentials        uses: aws-actions/configure-aws-credentials@v4        with:          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}          aws-region: us-west-2      - name: Update kubeconfig        run: |          aws eks update-kubeconfig --name production-cluster --region us-west-2      - name: Deploy to Kubernetes        run: |          kubectl apply -f k8s/          kubectl rollout status deployment/my-app -n production          kubectl get services -n production      - name: Verify deployment        run: |          kubectl get pods -n production          kubectl describe deployment my-app -n production
```
```
name: Matrix Buildon: [push, pull_request]jobs:  build:    runs-on: ${{ matrix.os }}    strategy:      matrix:        os: [ubuntu-latest, macos-latest, windows-latest]        python-version: ["3.9", "3.10", "3.11", "3.12"]    steps:      - uses: actions/checkout@v4      - name: Set up Python        uses: actions/setup-python@v5        with:          python-version: ${{ matrix.python-version }}      - name: Install dependencies        run: |          python -m pip install --upgrade pip          pip install -r requirements.txt      - name: Run tests        run: pytest
```
```
name: Matrix Buildon: [push, pull_request]jobs:  build:    runs-on: ${{ matrix.os }}    strategy:      matrix:        os: [ubuntu-latest, macos-latest, windows-latest]        python-version: ["3.9", "3.10", "3.11", "3.12"]    steps:      - uses: actions/checkout@v4      - name: Set up Python        uses: actions/setup-python@v5        with:          python-version: ${{ matrix.python-version }}      - name: Install dependencies        run: |          python -m pip install --upgrade pip          pip install -r requirements.txt      - name: Run tests        run: pytest
```
```
assets/matrix-build.yml
```
```
# .github/workflows/reusable-test.ymlname: Reusable Test Workflowon:  workflow_call:    inputs:      node-version:        required: true        type: string    secrets:      NPM_TOKEN:        required: truejobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - uses: actions/setup-node@v4        with:          node-version: ${{ inputs.node-version }}      - run: npm ci      - run: npm test
```
```
# .github/workflows/reusable-test.ymlname: Reusable Test Workflowon:  workflow_call:    inputs:      node-version:        required: true        type: string    secrets:      NPM_TOKEN:        required: truejobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - uses: actions/setup-node@v4        with:          node-version: ${{ inputs.node-version }}      - run: npm ci      - run: npm test
```
```
jobs:  call-test:    uses: ./.github/workflows/reusable-test.yml    with:      node-version: "20.x"    secrets:      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
```
jobs:  call-test:    uses: ./.github/workflows/reusable-test.yml    with:      node-version: "20.x"    secrets:      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```
```
name: Security Scanon:  push:    branches: [main]  pull_request:    branches: [main]jobs:  security:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Run Trivy vulnerability scanner        uses: aquasecurity/trivy-action@master        with:          scan-type: "fs"          scan-ref: "."          format: "sarif"          output: "trivy-results.sarif"      - name: Upload Trivy results to GitHub Security        uses: github/codeql-action/upload-sarif@v2        with:          sarif_file: "trivy-results.sarif"      - name: Run Snyk Security Scan        uses: snyk/actions/node@master        env:          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```
```
name: Security Scanon:  push:    branches: [main]  pull_request:    branches: [main]jobs:  security:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Run Trivy vulnerability scanner        uses: aquasecurity/trivy-action@master        with:          scan-type: "fs"          scan-ref: "."          format: "sarif"          output: "trivy-results.sarif"      - name: Upload Trivy results to GitHub Security        uses: github/codeql-action/upload-sarif@v2        with:          sarif_file: "trivy-results.sarif"      - name: Run Snyk Security Scan        uses: snyk/actions/node@master        env:          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```
```
name: Deploy to Productionon:  push:    tags: ["v*"]jobs:  deploy:    runs-on: ubuntu-latest    environment:      name: production      url: https://app.example.com    steps:      - uses: actions/checkout@v4      - name: Deploy application        run: |          echo "Deploying to production..."          # Deployment commands here      - name: Notify Slack        if: success()        uses: slackapi/slack-github-action@v1        with:          webhook-url: ${{ secrets.SLACK_WEBHOOK }}          payload: |            {              "text": "Deployment to production completed successfully!"            }
```
```
name: Deploy to Productionon:  push:    tags: ["v*"]jobs:  deploy:    runs-on: ubuntu-latest    environment:      name: production      url: https://app.example.com    steps:      - uses: actions/checkout@v4      - name: Deploy application        run: |          echo "Deploying to production..."          # Deployment commands here      - name: Notify Slack        if: success()        uses: slackapi/slack-github-action@v1        with:          webhook-url: ${{ secrets.SLACK_WEBHOOK }}          payload: |            {              "text": "Deployment to production completed successfully!"            }
```
```
assets/test-workflow.yml
```
```
assets/deploy-workflow.yml
```
```
assets/matrix-build.yml
```
```
references/common-workflows.md
```
```
gitlab-ci-patterns
```
```
deployment-pipeline-design
```
```
secrets-management
```
Leverage the GitHub Actions Templates Agent Skill to rapidly establish robust and secure continuous integration and continuous deployment pipelines. This tool empowers developers to automate tedious manual processes, from multi-environment testing and Docker image creation to seamless deployments to cloud platforms like Kubernetes. By providing battle-tested workflow patterns, it ensures best practices are followed, enhancing code quality, accelerating release cycles, and fostering a more efficient development ecosystem. Say goodbye to manual setup and hello to streamlined, production-ready automation.

# When to Use This Skill
- •Setting up a new project's CI/CD pipeline from scratch with automated testing and deployment stages.
- •Automating multi-environment or matrix builds for testing applications across various runtime versions (e.g., Node.js 18.x and 20.x).
- •Implementing secure, automated Docker image building, tagging, and pushing to container registries.
- •Streamlining application deployment to Kubernetes clusters or other cloud providers after successful CI builds.

# Pro Tips
- 💡Utilize GitHub Actions 'secrets' to securely manage sensitive credentials, API keys, and deployment tokens, preventing their exposure in public repositories.
- 💡Parameterize your workflows with inputs or environment variables to make them more reusable and adaptable across different projects or environments.
- 💡Integrate security scanning actions (e.g., SAST, DAST, dependency scanning) directly into your CI pipeline to identify vulnerabilities early in the development cycle.

