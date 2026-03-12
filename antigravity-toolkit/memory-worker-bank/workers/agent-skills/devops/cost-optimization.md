# cost-optimization
Source: https://antigravity.codes/agent-skills/devops/cost-optimization

## AI Worker Instructions
When the user requests functionality related to cost-optimization, follow these guidelines and utilize this context.

## Scraped Content

# cost-optimization
```
Savings: 30-72% vs On-DemandTerm: 1 or 3 yearsPayment: All/Partial/No upfrontFlexibility: Standard or Convertible
```
```
Savings: 30-72% vs On-DemandTerm: 1 or 3 yearsPayment: All/Partial/No upfrontFlexibility: Standard or Convertible
```
```
Compute Savings Plans: 66% savingsEC2 Instance Savings Plans: 72% savingsApplies to: EC2, Fargate, LambdaFlexible across: Instance families, regions, OS
```
```
Compute Savings Plans: 66% savingsEC2 Instance Savings Plans: 72% savingsApplies to: EC2, Fargate, LambdaFlexible across: Instance families, regions, OS
```
```
Savings: Up to 90% vs On-DemandBest for: Batch jobs, CI/CD, stateless workloadsRisk: 2-minute interruption noticeStrategy: Mix with On-Demand for resilience
```
```
Savings: Up to 90% vs On-DemandBest for: Batch jobs, CI/CD, stateless workloadsRisk: 2-minute interruption noticeStrategy: Mix with On-Demand for resilience
```
```
resource "aws_s3_bucket_lifecycle_configuration" "example" {  bucket = aws_s3_bucket.example.id  rule {    id     = "transition-to-ia"    status = "Enabled"    transition {      days          = 30      storage_class = "STANDARD_IA"    }    transition {      days          = 90      storage_class = "GLACIER"    }    expiration {      days = 365    }  }}
```
```
resource "aws_s3_bucket_lifecycle_configuration" "example" {  bucket = aws_s3_bucket.example.id  rule {    id     = "transition-to-ia"    status = "Enabled"    transition {      days          = 30      storage_class = "STANDARD_IA"    }    transition {      days          = 90      storage_class = "GLACIER"    }    expiration {      days = 365    }  }}
```
```
locals {  common_tags = {    Environment = "production"    Project     = "my-project"    CostCenter  = "engineering"    Owner       = "team@example.com"    ManagedBy   = "terraform"  }}resource "aws_instance" "example" {  ami           = "ami-12345678"  instance_type = "t3.medium"  tags = merge(    local.common_tags,    {      Name = "web-server"    }  )}
```
```
locals {  common_tags = {    Environment = "production"    Project     = "my-project"    CostCenter  = "engineering"    Owner       = "team@example.com"    ManagedBy   = "terraform"  }}resource "aws_instance" "example" {  ami           = "ami-12345678"  instance_type = "t3.medium"  tags = merge(    local.common_tags,    {      Name = "web-server"    }  )}
```
```
references/tagging-standards.md
```
```
# AWS Budgetresource "aws_budgets_budget" "monthly" {  name              = "monthly-budget"  budget_type       = "COST"  limit_amount      = "1000"  limit_unit        = "USD"  time_period_start = "2024-01-01_00:00"  time_unit         = "MONTHLY"  notification {    comparison_operator        = "GREATER_THAN"    threshold                  = 80    threshold_type            = "PERCENTAGE"    notification_type         = "ACTUAL"    subscriber_email_addresses = ["team@example.com"]  }}
```
```
# AWS Budgetresource "aws_budgets_budget" "monthly" {  name              = "monthly-budget"  budget_type       = "COST"  limit_amount      = "1000"  limit_unit        = "USD"  time_period_start = "2024-01-01_00:00"  time_unit         = "MONTHLY"  notification {    comparison_operator        = "GREATER_THAN"    threshold                  = 80    threshold_type            = "PERCENTAGE"    notification_type         = "ACTUAL"    subscriber_email_addresses = ["team@example.com"]  }}
```
```
Development: t3.small RDSStaging: t3.large RDSProduction: r6g.2xlarge RDS with read replicas
```
```
Development: t3.small RDSStaging: t3.large RDSProduction: r6g.2xlarge RDS with read replicas
```
```
Hot data: S3 StandardWarm data: S3 Standard-IA (30 days)Cold data: S3 Glacier (90 days)Archive: S3 Deep Archive (365 days)
```
```
Hot data: S3 StandardWarm data: S3 Standard-IA (30 days)Cold data: S3 Glacier (90 days)Archive: S3 Deep Archive (365 days)
```
```
resource "aws_autoscaling_policy" "scale_up" {  name                   = "scale-up"  scaling_adjustment     = 2  adjustment_type        = "ChangeInCapacity"  cooldown              = 300  autoscaling_group_name = aws_autoscaling_group.main.name}resource "aws_cloudwatch_metric_alarm" "cpu_high" {  alarm_name          = "cpu-high"  comparison_operator = "GreaterThanThreshold"  evaluation_periods  = "2"  metric_name         = "CPUUtilization"  namespace           = "AWS/EC2"  period              = "60"  statistic           = "Average"  threshold           = "80"  alarm_actions       = [aws_autoscaling_policy.scale_up.arn]}
```
```
resource "aws_autoscaling_policy" "scale_up" {  name                   = "scale-up"  scaling_adjustment     = 2  adjustment_type        = "ChangeInCapacity"  cooldown              = 300  autoscaling_group_name = aws_autoscaling_group.main.name}resource "aws_cloudwatch_metric_alarm" "cpu_high" {  alarm_name          = "cpu-high"  comparison_operator = "GreaterThanThreshold"  evaluation_periods  = "2"  metric_name         = "CPUUtilization"  namespace           = "AWS/EC2"  period              = "60"  statistic           = "Average"  threshold           = "80"  alarm_actions       = [aws_autoscaling_policy.scale_up.arn]}
```
```
references/tagging-standards.md
```
```
assets/cost-analysis-template.xlsx
```
```
terraform-module-library
```
```
multi-cloud-architecture
```
Navigating the complexities of cloud billing can be daunting, leading to significant overspending if not managed proactively. This AI Agent Skill empowers developers and operations teams to systematically identify, analyze, and implement strategies for reducing cloud expenditures across major providers like AWS, Azure, and GCP. By leveraging advanced patterns for resource optimization, smart pricing models, and robust governance frameworks, it transforms abstract spending into actionable insights, ensuring your infrastructure is not only performant but also cost-efficient. Harness its capabilities to build a resilient and economically sustainable cloud environment.

# When to Use This Skill
- •Reduce overall cloud spending across multi-cloud environments.
- •Right-size specific cloud resources like virtual machines, databases, or storage.
- •Implement and enforce cost governance policies within an organization.
- •Analyze and optimize infrastructure costs for new or existing projects.

# Pro Tips
- 💡Integrate cost optimization checks into your CI/CD pipeline to identify and prevent costly deployments proactively.
- 💡Regularly review and adjust resource allocations using data from your cloud provider's cost management tools to catch over-provisioning.
- 💡Leverage cloud-native budgeting and alert features to monitor spending against thresholds and prevent unexpected cost spikes.

