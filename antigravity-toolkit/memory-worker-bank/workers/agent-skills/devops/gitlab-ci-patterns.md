# gitlab-ci-patterns
Source: https://antigravity.codes/agent-skills/devops/gitlab-ci-patterns

## AI Worker Instructions
When the user requests functionality related to gitlab-ci-patterns, follow these guidelines and utilize this context.

## Scraped Content

# gitlab-ci-patterns
```
stages:  - build  - test  - deployvariables:  DOCKER_DRIVER: overlay2  DOCKER_TLS_CERTDIR: "/certs"build:  stage: build  image: node:20  script:    - npm ci    - npm run build  artifacts:    paths:      - dist/    expire_in: 1 hour  cache:    key: ${CI_COMMIT_REF_SLUG}    paths:      - node_modules/test:  stage: test  image: node:20  script:    - npm ci    - npm run lint    - npm test  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'  artifacts:    reports:      coverage_report:        coverage_format: cobertura        path: coverage/cobertura-coverage.xmldeploy:  stage: deploy  image: bitnami/kubectl:latest  script:    - kubectl apply -f k8s/    - kubectl rollout status deployment/my-app  only:    - main  environment:    name: production    url: https://app.example.com
```
```
stages:  - build  - test  - deployvariables:  DOCKER_DRIVER: overlay2  DOCKER_TLS_CERTDIR: "/certs"build:  stage: build  image: node:20  script:    - npm ci    - npm run build  artifacts:    paths:      - dist/    expire_in: 1 hour  cache:    key: ${CI_COMMIT_REF_SLUG}    paths:      - node_modules/test:  stage: test  image: node:20  script:    - npm ci    - npm run lint    - npm test  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'  artifacts:    reports:      coverage_report:        coverage_format: cobertura        path: coverage/cobertura-coverage.xmldeploy:  stage: deploy  image: bitnami/kubectl:latest  script:    - kubectl apply -f k8s/    - kubectl rollout status deployment/my-app  only:    - main  environment:    name: production    url: https://app.example.com
```
```
build-docker:  stage: build  image: docker:24  services:    - docker:24-dind  before_script:    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY  script:    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .    - docker build -t $CI_REGISTRY_IMAGE:latest .    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA    - docker push $CI_REGISTRY_IMAGE:latest  only:    - main    - tags
```
```
build-docker:  stage: build  image: docker:24  services:    - docker:24-dind  before_script:    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY  script:    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .    - docker build -t $CI_REGISTRY_IMAGE:latest .    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA    - docker push $CI_REGISTRY_IMAGE:latest  only:    - main    - tags
```
```
.deploy_template: &deploy_template  image: bitnami/kubectl:latest  before_script:    - kubectl config set-cluster k8s --server="$KUBE_URL" --insecure-skip-tls-verify=true    - kubectl config set-credentials admin --token="$KUBE_TOKEN"    - kubectl config set-context default --cluster=k8s --user=admin    - kubectl config use-context defaultdeploy:staging:  <<: *deploy_template  stage: deploy  script:    - kubectl apply -f k8s/ -n staging    - kubectl rollout status deployment/my-app -n staging  environment:    name: staging    url: https://staging.example.com  only:    - developdeploy:production:  <<: *deploy_template  stage: deploy  script:    - kubectl apply -f k8s/ -n production    - kubectl rollout status deployment/my-app -n production  environment:    name: production    url: https://app.example.com  when: manual  only:    - main
```
```
.deploy_template: &deploy_template  image: bitnami/kubectl:latest  before_script:    - kubectl config set-cluster k8s --server="$KUBE_URL" --insecure-skip-tls-verify=true    - kubectl config set-credentials admin --token="$KUBE_TOKEN"    - kubectl config set-context default --cluster=k8s --user=admin    - kubectl config use-context defaultdeploy:staging:  <<: *deploy_template  stage: deploy  script:    - kubectl apply -f k8s/ -n staging    - kubectl rollout status deployment/my-app -n staging  environment:    name: staging    url: https://staging.example.com  only:    - developdeploy:production:  <<: *deploy_template  stage: deploy  script:    - kubectl apply -f k8s/ -n production    - kubectl rollout status deployment/my-app -n production  environment:    name: production    url: https://app.example.com  when: manual  only:    - main
```
```
stages:  - validate  - plan  - applyvariables:  TF_ROOT: ${CI_PROJECT_DIR}/terraform  TF_VERSION: "1.6.0"before_script:  - cd ${TF_ROOT}  - terraform --versionvalidate:  stage: validate  image: hashicorp/terraform:${TF_VERSION}  script:    - terraform init -backend=false    - terraform validate    - terraform fmt -checkplan:  stage: plan  image: hashicorp/terraform:${TF_VERSION}  script:    - terraform init    - terraform plan -out=tfplan  artifacts:    paths:      - ${TF_ROOT}/tfplan    expire_in: 1 dayapply:  stage: apply  image: hashicorp/terraform:${TF_VERSION}  script:    - terraform init    - terraform apply -auto-approve tfplan  dependencies:    - plan  when: manual  only:    - main
```
```
stages:  - validate  - plan  - applyvariables:  TF_ROOT: ${CI_PROJECT_DIR}/terraform  TF_VERSION: "1.6.0"before_script:  - cd ${TF_ROOT}  - terraform --versionvalidate:  stage: validate  image: hashicorp/terraform:${TF_VERSION}  script:    - terraform init -backend=false    - terraform validate    - terraform fmt -checkplan:  stage: plan  image: hashicorp/terraform:${TF_VERSION}  script:    - terraform init    - terraform plan -out=tfplan  artifacts:    paths:      - ${TF_ROOT}/tfplan    expire_in: 1 dayapply:  stage: apply  image: hashicorp/terraform:${TF_VERSION}  script:    - terraform init    - terraform apply -auto-approve tfplan  dependencies:    - plan  when: manual  only:    - main
```
```
include:  - template: Security/SAST.gitlab-ci.yml  - template: Security/Dependency-Scanning.gitlab-ci.yml  - template: Security/Container-Scanning.gitlab-ci.ymltrivy-scan:  stage: test  image: aquasec/trivy:latest  script:    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA  allow_failure: true
```
```
include:  - template: Security/SAST.gitlab-ci.yml  - template: Security/Dependency-Scanning.gitlab-ci.yml  - template: Security/Container-Scanning.gitlab-ci.ymltrivy-scan:  stage: test  image: aquasec/trivy:latest  script:    - trivy image --exit-code 1 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA  allow_failure: true
```
```
# Cache node_modulesbuild:  cache:    key: ${CI_COMMIT_REF_SLUG}    paths:      - node_modules/    policy: pull-push# Global cachecache:  key: ${CI_COMMIT_REF_SLUG}  paths:    - .cache/    - vendor/# Separate cache per jobjob1:  cache:    key: job1-cache    paths:      - build/job2:  cache:    key: job2-cache    paths:      - dist/
```
```
# Cache node_modulesbuild:  cache:    key: ${CI_COMMIT_REF_SLUG}    paths:      - node_modules/    policy: pull-push# Global cachecache:  key: ${CI_COMMIT_REF_SLUG}  paths:    - .cache/    - vendor/# Separate cache per jobjob1:  cache:    key: job1-cache    paths:      - build/job2:  cache:    key: job2-cache    paths:      - dist/
```
```
generate-pipeline:  stage: build  script:    - python generate_pipeline.py > child-pipeline.yml  artifacts:    paths:      - child-pipeline.ymltrigger-child:  stage: deploy  trigger:    include:      - artifact: child-pipeline.yml        job: generate-pipeline    strategy: depend
```
```
generate-pipeline:  stage: build  script:    - python generate_pipeline.py > child-pipeline.yml  artifacts:    paths:      - child-pipeline.ymltrigger-child:  stage: deploy  trigger:    include:      - artifact: child-pipeline.yml        job: generate-pipeline    strategy: depend
```
```
assets/gitlab-ci.yml.template
```
```
references/pipeline-stages.md
```
```
github-actions-templates
```
```
deployment-pipeline-design
```
```
secrets-management
```
This specialized agent skill equips you with the blueprints for crafting sophisticated GitLab CI/CD pipelines. Beyond basic setup, it delves into advanced patterns for managing multi-stage workflows, ensuring efficient resource utilization through intelligent caching, and scaling your automation with distributed runners. Whether you're aiming to accelerate development cycles, enhance deployment reliability, or integrate robust testing, this skill provides the structured knowledge to implement cutting-edge CI/CD strategies directly within your GitLab environment, transforming your build, test, and deploy processes.

# When to Use This Skill
- •Automating full CI/CD lifecycles within GitLab projects.
- •Implementing complex multi-stage pipelines with dependencies and parallel jobs.
- •Optimizing pipeline execution speed and resource usage through strategic caching and artifact management.
- •Deploying applications to various environments, including Kubernetes, directly from GitLab CI/CD.

# Pro Tips
- 💡Leverage `include` statements for reusable job templates and complex pipeline compositions, promoting DRY principles across your projects.
- 💡Strategically combine `cache` and `artifacts` to minimize build times; use cache for dependencies (`node_modules`) and artifacts for build outputs passed between stages (e.g., `dist/`).
- 💡Monitor pipeline analytics in GitLab to identify bottlenecks and optimize resource allocation for your runners, especially in distributed setups, to maximize efficiency.

