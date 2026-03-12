# deployment-pipeline-design
Source: https://antigravity.codes/agent-skills/devops/deployment-pipeline-design

## AI Worker Instructions
When the user requests functionality related to deployment-pipeline-design, follow these guidelines and utilize this context.

## Scraped Content

# deployment-pipeline-design
```
┌─────────┐   ┌──────┐   ┌─────────┐   ┌────────┐   ┌──────────┐│  Build  │ → │ Test │ → │ Staging │ → │ Approve│ → │Production│└─────────┘   └──────┘   └─────────┘   └────────┘   └──────────┘
```
```
┌─────────┐   ┌──────┐   ┌─────────┐   ┌────────┐   ┌──────────┐│  Build  │ → │ Test │ → │ Staging │ → │ Approve│ → │Production│└─────────┘   └──────┘   └─────────┘   └────────┘   └──────────┘
```
```
# GitHub Actionsproduction-deploy:  needs: staging-deploy  environment:    name: production    url: https://app.example.com  runs-on: ubuntu-latest  steps:    - name: Deploy to production      run: |        # Deployment commands
```
```
# GitHub Actionsproduction-deploy:  needs: staging-deploy  environment:    name: production    url: https://app.example.com  runs-on: ubuntu-latest  steps:    - name: Deploy to production      run: |        # Deployment commands
```
```
# GitLab CIdeploy:production:  stage: deploy  script:    - deploy.sh production  environment:    name: production  when: delayed  start_in: 30 minutes  only:    - main
```
```
# GitLab CIdeploy:production:  stage: deploy  script:    - deploy.sh production  environment:    name: production  when: delayed  start_in: 30 minutes  only:    - main
```
```
# Azure Pipelinesstages:  - stage: Production    dependsOn: Staging    jobs:      - deployment: Deploy        environment:          name: production          resourceType: Kubernetes        strategy:          runOnce:            preDeploy:              steps:                - task: ManualValidation@0                  inputs:                    notifyUsers: "team-leads@example.com"                    instructions: "Review staging metrics before approving"
```
```
# Azure Pipelinesstages:  - stage: Production    dependsOn: Staging    jobs:      - deployment: Deploy        environment:          name: production          resourceType: Kubernetes        strategy:          runOnce:            preDeploy:              steps:                - task: ManualValidation@0                  inputs:                    notifyUsers: "team-leads@example.com"                    instructions: "Review staging metrics before approving"
```
```
assets/approval-gate-template.yml
```
```
apiVersion: apps/v1kind: Deploymentmetadata:  name: my-appspec:  replicas: 10  strategy:    type: RollingUpdate    rollingUpdate:      maxSurge: 2      maxUnavailable: 1
```
```
apiVersion: apps/v1kind: Deploymentmetadata:  name: my-appspec:  replicas: 10  strategy:    type: RollingUpdate    rollingUpdate:      maxSurge: 2      maxUnavailable: 1
```
```
# Blue (current)kubectl apply -f blue-deployment.yamlkubectl label service my-app version=blue# Green (new)kubectl apply -f green-deployment.yaml# Test green environmentkubectl label service my-app version=green# Rollback if neededkubectl label service my-app version=blue
```
```
# Blue (current)kubectl apply -f blue-deployment.yamlkubectl label service my-app version=blue# Green (new)kubectl apply -f green-deployment.yaml# Test green environmentkubectl label service my-app version=green# Rollback if neededkubectl label service my-app version=blue
```
```
apiVersion: argoproj.io/v1alpha1kind: Rolloutmetadata:  name: my-appspec:  replicas: 10  strategy:    canary:      steps:        - setWeight: 10        - pause: { duration: 5m }        - setWeight: 25        - pause: { duration: 5m }        - setWeight: 50        - pause: { duration: 5m }        - setWeight: 100
```
```
apiVersion: argoproj.io/v1alpha1kind: Rolloutmetadata:  name: my-appspec:  replicas: 10  strategy:    canary:      steps:        - setWeight: 10        - pause: { duration: 5m }        - setWeight: 25        - pause: { duration: 5m }        - setWeight: 50        - pause: { duration: 5m }        - setWeight: 100
```
```
from flagsmith import Flagsmithflagsmith = Flagsmith(environment_key="API_KEY")if flagsmith.has_feature("new_checkout_flow"):    # New code path    process_checkout_v2()else:    # Existing code path    process_checkout_v1()
```
```
from flagsmith import Flagsmithflagsmith = Flagsmith(environment_key="API_KEY")if flagsmith.has_feature("new_checkout_flow"):    # New code path    process_checkout_v2()else:    # Existing code path    process_checkout_v1()
```
```
name: Production Pipelineon:  push:    branches: [main]jobs:  build:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Build application        run: make build      - name: Build Docker image        run: docker build -t myapp:${{ github.sha }} .      - name: Push to registry        run: docker push myapp:${{ github.sha }}  test:    needs: build    runs-on: ubuntu-latest    steps:      - name: Unit tests        run: make test      - name: Security scan        run: trivy image myapp:${{ github.sha }}  deploy-staging:    needs: test    runs-on: ubuntu-latest    environment:      name: staging    steps:      - name: Deploy to staging        run: kubectl apply -f k8s/staging/  integration-test:    needs: deploy-staging    runs-on: ubuntu-latest    steps:      - name: Run E2E tests        run: npm run test:e2e  deploy-production:    needs: integration-test    runs-on: ubuntu-latest    environment:      name: production    steps:      - name: Canary deployment        run: |          kubectl apply -f k8s/production/          kubectl argo rollouts promote my-app  verify:    needs: deploy-production    runs-on: ubuntu-latest    steps:      - name: Health check        run: curl -f https://app.example.com/health      - name: Notify team        run: |          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \            -d '{"text":"Production deployment successful!"}'
```
```
name: Production Pipelineon:  push:    branches: [main]jobs:  build:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Build application        run: make build      - name: Build Docker image        run: docker build -t myapp:${{ github.sha }} .      - name: Push to registry        run: docker push myapp:${{ github.sha }}  test:    needs: build    runs-on: ubuntu-latest    steps:      - name: Unit tests        run: make test      - name: Security scan        run: trivy image myapp:${{ github.sha }}  deploy-staging:    needs: test    runs-on: ubuntu-latest    environment:      name: staging    steps:      - name: Deploy to staging        run: kubectl apply -f k8s/staging/  integration-test:    needs: deploy-staging    runs-on: ubuntu-latest    steps:      - name: Run E2E tests        run: npm run test:e2e  deploy-production:    needs: integration-test    runs-on: ubuntu-latest    environment:      name: production    steps:      - name: Canary deployment        run: |          kubectl apply -f k8s/production/          kubectl argo rollouts promote my-app  verify:    needs: deploy-production    runs-on: ubuntu-latest    steps:      - name: Health check        run: curl -f https://app.example.com/health      - name: Notify team        run: |          curl -X POST ${{ secrets.SLACK_WEBHOOK }} \            -d '{"text":"Production deployment successful!"}'
```
```
deploy-and-verify:  steps:    - name: Deploy new version      run: kubectl apply -f k8s/    - name: Wait for rollout      run: kubectl rollout status deployment/my-app    - name: Health check      id: health      run: |        for i in {1..10}; do          if curl -sf https://app.example.com/health; then            exit 0          fi          sleep 10        done        exit 1    - name: Rollback on failure      if: failure()      run: kubectl rollout undo deployment/my-app
```
```
deploy-and-verify:  steps:    - name: Deploy new version      run: kubectl apply -f k8s/    - name: Wait for rollout      run: kubectl rollout status deployment/my-app    - name: Health check      id: health      run: |        for i in {1..10}; do          if curl -sf https://app.example.com/health; then            exit 0          fi          sleep 10        done        exit 1    - name: Rollback on failure      if: failure()      run: kubectl rollout undo deployment/my-app
```
```
# List revision historykubectl rollout history deployment/my-app# Rollback to previous versionkubectl rollout undo deployment/my-app# Rollback to specific revisionkubectl rollout undo deployment/my-app --to-revision=3
```
```
# List revision historykubectl rollout history deployment/my-app# Rollback to previous versionkubectl rollout undo deployment/my-app# Rollback to specific revisionkubectl rollout undo deployment/my-app --to-revision=3
```
```
- name: Post-deployment verification  run: |    # Wait for metrics stabilization    sleep 60    # Check error rate    ERROR_RATE=$(curl -s "$PROMETHEUS_URL/api/v1/query?query=rate(http_errors_total[5m])" | jq '.data.result[0].value[1]')    if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then      echo "Error rate too high: $ERROR_RATE"      exit 1    fi
```
```
- name: Post-deployment verification  run: |    # Wait for metrics stabilization    sleep 60    # Check error rate    ERROR_RATE=$(curl -s "$PROMETHEUS_URL/api/v1/query?query=rate(http_errors_total[5m])" | jq '.data.result[0].value[1]')    if (( $(echo "$ERROR_RATE > 0.01" | bc -l) )); then      echo "Error rate too high: $ERROR_RATE"      exit 1    fi
```
```
references/pipeline-orchestration.md
```
```
assets/approval-gate-template.yml
```
```
github-actions-templates
```
```
gitlab-ci-patterns
```
```
secrets-management
```
In today's fast-paced development landscape, a well-architected deployment pipeline is critical for delivering software reliably and efficiently. This skill empowers you to design sophisticated CI/CD workflows, ensuring your applications move from commit to production with speed, security, and controlled approvals. Leverage AI to conceptualize robust multi-stage pipelines, integrate essential security checks, and orchestrate complex deployment strategies like blue-green or canary releases. It's an indispensable tool for engineers looking to optimize their release cycles and uphold best practices in continuous integration and delivery.

# When to Use This Skill
- •Architecting new CI/CD systems for a greenfield project.
- •Enhancing existing deployment pipelines with new approval gates and security scans.
- •Implementing progressive delivery strategies like canary or blue-green deployments.
- •Establishing enterprise-wide CI/CD best practices and standards.

# Pro Tips
- 💡Start with a high-level overview of your desired pipeline, then iteratively refine each stage with specific tools and services.
- 💡Always specify security and compliance requirements upfront to ensure the agent integrates necessary checks at appropriate stages.
- 💡When designing approval gates, clearly define the criteria and stakeholders for each stage to automate the process effectively.

