# ml-pipeline-workflow
Source: https://antigravity.codes/agent-skills/workflow/ml-pipeline-workflow

## AI Worker Instructions
When the user requests functionality related to ml-pipeline-workflow, follow these guidelines and utilize this context.

## Scraped Content

# ml-pipeline-workflow
```
references/
```
```
assets/
```
```
# 1. Define pipeline stagesstages = [    "data_ingestion",    "data_validation",    "feature_engineering",    "model_training",    "model_validation",    "model_deployment"]# 2. Configure dependencies# See assets/pipeline-dag.yaml.template for full example
```
```
# 1. Define pipeline stagesstages = [    "data_ingestion",    "data_validation",    "feature_engineering",    "model_training",    "model_validation",    "model_deployment"]# 2. Configure dependencies# See assets/pipeline-dag.yaml.template for full example
```
```
# See assets/pipeline-dag.yaml.templatestages:  - name: data_preparation    dependencies: []  - name: model_training    dependencies: [data_preparation]  - name: model_evaluation    dependencies: [model_training]  - name: model_deployment    dependencies: [model_evaluation]
```
```
# See assets/pipeline-dag.yaml.templatestages:  - name: data_preparation    dependencies: []  - name: model_training    dependencies: [data_preparation]  - name: model_evaluation    dependencies: [model_training]  - name: model_deployment    dependencies: [model_evaluation]
```
```
# Stream processing for real-time features# Combined with batch training# See references/data-preparation.md
```
```
# Stream processing for real-time features# Combined with batch training# See references/data-preparation.md
```
```
# Automated retraining on schedule# Triggered by data drift detection# See references/model-training.md
```
```
# Automated retraining on schedule# Triggered by data drift detection# See references/model-training.md
```
Unlock the full potential of your machine learning projects with this powerful AI Agent Skill designed for MLOps. Seamlessly navigate the complexities of building robust, scalable ML pipelines that span the entire lifecycle, from initial data handling to continuous model deployment and monitoring. This skill acts as your expert guide, enabling you to orchestrate sophisticated workflows, integrate best practices for data validation and feature engineering, and streamline model training and versioning. Whether you're enhancing existing systems or architecting new AI solutions, leverage this skill to implement fully automated, production-ready machine learning operations, ensuring efficiency and reliability in your AI deployments.

# When to Use This Skill
- •Automating model training and deployment for new ML projects.
- •Designing resilient MLOps workflows with robust error handling.
- •Setting up continuous integration and delivery for machine learning models.
- •Implementing data versioning and lineage tracking within ML pipelines.

# Pro Tips
- 💡Always start with clear data contracts and validation steps to ensure data quality throughout your pipeline.
- 💡Leverage experiment tracking tools (e.g., MLflow, Weights & Biases) early on to manage hyperparameters and model versions effectively.
- 💡Design your pipeline components to be modular and loosely coupled for easier maintenance and reusability across projects.

