# terraform-module-library
Source: https://antigravity.codes/agent-skills/devops/terraform-module-library

## AI Worker Instructions
When the user requests functionality related to terraform-module-library, follow these guidelines and utilize this context.

## Scraped Content

# terraform-module-library
```
terraform-modules/├── aws/│   ├── vpc/│   ├── eks/│   ├── rds/│   └── s3/├── azure/│   ├── vnet/│   ├── aks/│   └── storage/└── gcp/    ├── vpc/    ├── gke/    └── cloud-sql/
```
```
terraform-modules/├── aws/│   ├── vpc/│   ├── eks/│   ├── rds/│   └── s3/├── azure/│   ├── vnet/│   ├── aks/│   └── storage/└── gcp/    ├── vpc/    ├── gke/    └── cloud-sql/
```
```
module-name/├── main.tf          # Main resources├── variables.tf     # Input variables├── outputs.tf       # Output values├── versions.tf      # Provider versions├── README.md        # Documentation├── examples/        # Usage examples│   └── complete/│       ├── main.tf│       └── variables.tf└── tests/           # Terratest files    └── module_test.go
```
```
module-name/├── main.tf          # Main resources├── variables.tf     # Input variables├── outputs.tf       # Output values├── versions.tf      # Provider versions├── README.md        # Documentation├── examples/        # Usage examples│   └── complete/│       ├── main.tf│       └── variables.tf└── tests/           # Terratest files    └── module_test.go
```
```
resource "aws_vpc" "main" {  cidr_block           = var.cidr_block  enable_dns_hostnames = var.enable_dns_hostnames  enable_dns_support   = var.enable_dns_support  tags = merge(    {      Name = var.name    },    var.tags  )}resource "aws_subnet" "private" {  count             = length(var.private_subnet_cidrs)  vpc_id            = aws_vpc.main.id  cidr_block        = var.private_subnet_cidrs[count.index]  availability_zone = var.availability_zones[count.index]  tags = merge(    {      Name = "${var.name}-private-${count.index + 1}"      Tier = "private"    },    var.tags  )}resource "aws_internet_gateway" "main" {  count  = var.create_internet_gateway ? 1 : 0  vpc_id = aws_vpc.main.id  tags = merge(    {      Name = "${var.name}-igw"    },    var.tags  )}
```
```
resource "aws_vpc" "main" {  cidr_block           = var.cidr_block  enable_dns_hostnames = var.enable_dns_hostnames  enable_dns_support   = var.enable_dns_support  tags = merge(    {      Name = var.name    },    var.tags  )}resource "aws_subnet" "private" {  count             = length(var.private_subnet_cidrs)  vpc_id            = aws_vpc.main.id  cidr_block        = var.private_subnet_cidrs[count.index]  availability_zone = var.availability_zones[count.index]  tags = merge(    {      Name = "${var.name}-private-${count.index + 1}"      Tier = "private"    },    var.tags  )}resource "aws_internet_gateway" "main" {  count  = var.create_internet_gateway ? 1 : 0  vpc_id = aws_vpc.main.id  tags = merge(    {      Name = "${var.name}-igw"    },    var.tags  )}
```
```
variable "name" {  description = "Name of the VPC"  type        = string}variable "cidr_block" {  description = "CIDR block for VPC"  type        = string  validation {    condition     = can(regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$", var.cidr_block))    error_message = "CIDR block must be valid IPv4 CIDR notation."  }}variable "availability_zones" {  description = "List of availability zones"  type        = list(string)}variable "private_subnet_cidrs" {  description = "CIDR blocks for private subnets"  type        = list(string)  default     = []}variable "enable_dns_hostnames" {  description = "Enable DNS hostnames in VPC"  type        = bool  default     = true}variable "tags" {  description = "Additional tags"  type        = map(string)  default     = {}}
```
```
variable "name" {  description = "Name of the VPC"  type        = string}variable "cidr_block" {  description = "CIDR block for VPC"  type        = string  validation {    condition     = can(regex("^([0-9]{1,3}\\.){3}[0-9]{1,3}/[0-9]{1,2}$", var.cidr_block))    error_message = "CIDR block must be valid IPv4 CIDR notation."  }}variable "availability_zones" {  description = "List of availability zones"  type        = list(string)}variable "private_subnet_cidrs" {  description = "CIDR blocks for private subnets"  type        = list(string)  default     = []}variable "enable_dns_hostnames" {  description = "Enable DNS hostnames in VPC"  type        = bool  default     = true}variable "tags" {  description = "Additional tags"  type        = map(string)  default     = {}}
```
```
output "vpc_id" {  description = "ID of the VPC"  value       = aws_vpc.main.id}output "private_subnet_ids" {  description = "IDs of private subnets"  value       = aws_subnet.private[*].id}output "vpc_cidr_block" {  description = "CIDR block of VPC"  value       = aws_vpc.main.cidr_block}
```
```
output "vpc_id" {  description = "ID of the VPC"  value       = aws_vpc.main.id}output "private_subnet_ids" {  description = "IDs of private subnets"  value       = aws_subnet.private[*].id}output "vpc_cidr_block" {  description = "CIDR block of VPC"  value       = aws_vpc.main.cidr_block}
```
```
module "vpc" {  source = "../../modules/aws/vpc"  name               = "production"  cidr_block         = "10.0.0.0/16"  availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]  private_subnet_cidrs = [    "10.0.1.0/24",    "10.0.2.0/24",    "10.0.3.0/24"  ]  tags = {    Environment = "production"    ManagedBy   = "terraform"  }}module "rds" {  source = "../../modules/aws/rds"  identifier     = "production-db"  engine         = "postgres"  engine_version = "15.3"  instance_class = "db.t3.large"  vpc_id     = module.vpc.vpc_id  subnet_ids = module.vpc.private_subnet_ids  tags = {    Environment = "production"  }}
```
```
module "vpc" {  source = "../../modules/aws/vpc"  name               = "production"  cidr_block         = "10.0.0.0/16"  availability_zones = ["us-west-2a", "us-west-2b", "us-west-2c"]  private_subnet_cidrs = [    "10.0.1.0/24",    "10.0.2.0/24",    "10.0.3.0/24"  ]  tags = {    Environment = "production"    ManagedBy   = "terraform"  }}module "rds" {  source = "../../modules/aws/rds"  identifier     = "production-db"  engine         = "postgres"  engine_version = "15.3"  instance_class = "db.t3.large"  vpc_id     = module.vpc.vpc_id  subnet_ids = module.vpc.private_subnet_ids  tags = {    Environment = "production"  }}
```
```
assets/vpc-module/
```
```
assets/rds-module/
```
```
references/aws-modules.md
```
```
references/azure-modules.md
```
```
references/gcp-modules.md
```
```
// tests/vpc_test.gopackage testimport (    "testing"    "github.com/gruntwork-io/terratest/modules/terraform"    "github.com/stretchr/testify/assert")func TestVPCModule(t *testing.T) {    terraformOptions := &terraform.Options{        TerraformDir: "../examples/complete",    }    defer terraform.Destroy(t, terraformOptions)    terraform.InitAndApply(t, terraformOptions)    vpcID := terraform.Output(t, terraformOptions, "vpc_id")    assert.NotEmpty(t, vpcID)}
```
```
// tests/vpc_test.gopackage testimport (    "testing"    "github.com/gruntwork-io/terratest/modules/terraform"    "github.com/stretchr/testify/assert")func TestVPCModule(t *testing.T) {    terraformOptions := &terraform.Options{        TerraformDir: "../examples/complete",    }    defer terraform.Destroy(t, terraformOptions)    terraform.InitAndApply(t, terraformOptions)    vpcID := terraform.Output(t, terraformOptions, "vpc_id")    assert.NotEmpty(t, vpcID)}
```
```
multi-cloud-architecture
```
```
cost-optimization
```
This powerful AI Agent Skill acts as your expert guide to building robust, reusable Terraform modules across AWS, Azure, and GCP. Designed for developers and DevOps engineers, it champions infrastructure-as-code best practices, enabling you to create standardized, maintainable, and scalable cloud provisioning patterns. Eliminate boilerplate, enhance collaboration, and accelerate your multi-cloud deployments by leveraging a structured approach to module development. Whether you're a seasoned architect or just starting with IaC, this skill provides the patterns and guidance necessary to elevate your infrastructure automation workflows to a production-ready standard.

# When to Use This Skill
- •Creating a new standardized AWS VPC module that can be reused across multiple projects.
- •Implementing a common Azure Kubernetes Service (AKS) deployment pattern following organizational best practices.
- •Refactoring existing ad-hoc Terraform configurations into a structured, modular library for easier maintenance.
- •Establishing a baseline for multi-cloud infrastructure provisioning across different environments.

# Pro Tips
- 💡Always include `examples/complete` directories within your modules to demonstrate full, working deployments, making it easier for consumers to adopt and understand.
- 💡Integrate `Terratest` for comprehensive module testing, ensuring your infrastructure components are reliable and resilient before deployment.
- 💡Utilize `terraform-docs` to automatically generate and maintain README files for your modules, keeping documentation synchronized with your code changes.

