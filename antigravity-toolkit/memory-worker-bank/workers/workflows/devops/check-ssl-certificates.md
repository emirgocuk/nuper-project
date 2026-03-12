# Check SSL Certificates
Source: https://antigravity.codes/workflows/devops/check-ssl-certificate-expiry-openssl

## AI Worker Instructions
When the user requests functionality related to Check SSL Certificates, follow these guidelines and utilize this context.

## Scraped Content

# Check SSL Certificates
```
google.com
```
```
echo | openssl s_client -servername google.com -connect google.com:443 2>/dev/null | openssl x509 -noout -dates
```

# How to Use This Workflow
- Click "Download" above
- In your project, create the directory: .agent/workflows/
```
.agent/workflows/
```
- Save the file as check-ssl-certificate-expiry-openssl.md
```
check-ssl-certificate-expiry-openssl.md
```
- In Antigravity, type /check_ssl_certificate_expiry_openssl or just describe what you want to do
```
/check_ssl_certificate_expiry_openssl
```
Learn more about workflows →

# Related Workflows

# Implement Feature Flags

# Implement Blue-Green Deployment

# Analyze Bundle Size

