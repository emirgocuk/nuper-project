# hybrid-cloud-networking
Source: https://antigravity.codes/agent-skills/devops/hybrid-cloud-networking

## AI Worker Instructions
When the user requests functionality related to hybrid-cloud-networking, follow these guidelines and utilize this context.

## Scraped Content

# hybrid-cloud-networking
```
resource "aws_vpn_gateway" "main" {  vpc_id = aws_vpc.main.id  tags = {    Name = "main-vpn-gateway"  }}resource "aws_customer_gateway" "main" {  bgp_asn    = 65000  ip_address = "203.0.113.1"  type       = "ipsec.1"}resource "aws_vpn_connection" "main" {  vpn_gateway_id      = aws_vpn_gateway.main.id  customer_gateway_id = aws_customer_gateway.main.id  type                = "ipsec.1"  static_routes_only  = false}
```
```
resource "aws_vpn_gateway" "main" {  vpc_id = aws_vpc.main.id  tags = {    Name = "main-vpn-gateway"  }}resource "aws_customer_gateway" "main" {  bgp_asn    = 65000  ip_address = "203.0.113.1"  type       = "ipsec.1"}resource "aws_vpn_connection" "main" {  vpn_gateway_id      = aws_vpn_gateway.main.id  customer_gateway_id = aws_customer_gateway.main.id  type                = "ipsec.1"  static_routes_only  = false}
```
```
references/direct-connect.md
```
```
resource "azurerm_virtual_network_gateway" "vpn" {  name                = "vpn-gateway"  location            = azurerm_resource_group.main.location  resource_group_name = azurerm_resource_group.main.name  type     = "Vpn"  vpn_type = "RouteBased"  sku      = "VpnGw1"  ip_configuration {    name                          = "vnetGatewayConfig"    public_ip_address_id          = azurerm_public_ip.vpn.id    private_ip_address_allocation = "Dynamic"    subnet_id                     = azurerm_subnet.gateway.id  }}
```
```
resource "azurerm_virtual_network_gateway" "vpn" {  name                = "vpn-gateway"  location            = azurerm_resource_group.main.location  resource_group_name = azurerm_resource_group.main.name  type     = "Vpn"  vpn_type = "RouteBased"  sku      = "VpnGw1"  ip_configuration {    name                          = "vnetGatewayConfig"    public_ip_address_id          = azurerm_public_ip.vpn.id    private_ip_address_allocation = "Dynamic"    subnet_id                     = azurerm_subnet.gateway.id  }}
```
```
On-Premises Datacenter         ↓    VPN/Direct Connect         ↓    Transit Gateway (AWS) / vWAN (Azure)         ↓    ├─ Production VPC/VNet    ├─ Staging VPC/VNet    └─ Development VPC/VNet
```
```
On-Premises Datacenter         ↓    VPN/Direct Connect         ↓    Transit Gateway (AWS) / vWAN (Azure)         ↓    ├─ Production VPC/VNet    ├─ Staging VPC/VNet    └─ Development VPC/VNet
```
```
On-Premises    ├─ Direct Connect → us-east-1    └─ Direct Connect → us-west-2            ↓        Cross-Region Peering
```
```
On-Premises    ├─ Direct Connect → us-east-1    └─ Direct Connect → us-west-2            ↓        Cross-Region Peering
```
```
On-Premises Datacenter    ├─ Direct Connect → AWS    ├─ ExpressRoute → Azure    └─ Interconnect → GCP
```
```
On-Premises Datacenter    ├─ Direct Connect → AWS    ├─ ExpressRoute → Azure    └─ Interconnect → GCP
```
```
On-Premises Router:- AS Number: 65000- Advertise: 10.0.0.0/8Cloud Router:- AS Number: 64512 (AWS), 65515 (Azure)- Advertise: Cloud VPC/VNet CIDRs
```
```
On-Premises Router:- AS Number: 65000- Advertise: 10.0.0.0/8Cloud Router:- AS Number: 64512 (AWS), 65515 (Azure)- Advertise: Cloud VPC/VNet CIDRs
```
```
resource "aws_vpn_connection" "primary" {  vpn_gateway_id      = aws_vpn_gateway.main.id  customer_gateway_id = aws_customer_gateway.primary.id  type                = "ipsec.1"}resource "aws_vpn_connection" "secondary" {  vpn_gateway_id      = aws_vpn_gateway.main.id  customer_gateway_id = aws_customer_gateway.secondary.id  type                = "ipsec.1"}
```
```
resource "aws_vpn_connection" "primary" {  vpn_gateway_id      = aws_vpn_gateway.main.id  customer_gateway_id = aws_customer_gateway.primary.id  type                = "ipsec.1"}resource "aws_vpn_connection" "secondary" {  vpn_gateway_id      = aws_vpn_gateway.main.id  customer_gateway_id = aws_customer_gateway.secondary.id  type                = "ipsec.1"}
```
```
# AWS VPNaws ec2 describe-vpn-connectionsaws ec2 get-vpn-connection-telemetry# Azure VPNaz network vpn-connection showaz network vpn-connection show-device-config-script
```
```
# AWS VPNaws ec2 describe-vpn-connectionsaws ec2 get-vpn-connection-telemetry# Azure VPNaz network vpn-connection showaz network vpn-connection show-device-config-script
```
```
references/vpn-setup.md
```
```
references/direct-connect.md
```
```
multi-cloud-architecture
```
```
terraform-module-library
```
Navigating the complexities of modern IT infrastructure often means bridging the gap between traditional on-premises environments and the agility of public cloud platforms. This agent skill empowers you to architect and implement robust hybrid cloud networking solutions, ensuring seamless and secure data flow. Whether you're extending your data center, facilitating cloud migrations, or building resilient multi-cloud architectures, mastering these connectivity options is crucial. Unlock the full potential of your hybrid cloud strategy by optimizing performance, enhancing security, and simplifying network management across diverse environments.

# When to Use This Skill
- •Connecting on-premises data centers to AWS, Azure, or GCP for hybrid operations.
- •Gradually migrating applications and data to the cloud while maintaining on-premises dependencies.
- •Implementing secure cross-premises networking for disaster recovery or business continuity.
- •Extending corporate networks into the cloud to host specific workloads or services.
- •Establishing secure connections for remote offices to access cloud resources.

# Pro Tips
- 💡Always plan your IP addressing scheme carefully to avoid overlaps between on-premises and cloud networks, utilizing private RFC 1918 ranges.
- 💡Prioritize dedicated connections (Direct Connect, ExpressRoute) for mission-critical applications requiring high bandwidth, low latency, and consistent performance over VPNs.
- 💡Implement robust monitoring and logging for all hybrid network connections to quickly identify and troubleshoot connectivity or performance issues.
- 💡Automate your connection provisioning using Infrastructure as Code (e.g., Terraform) to ensure consistency, reduce manual errors, and speed up deployment.

