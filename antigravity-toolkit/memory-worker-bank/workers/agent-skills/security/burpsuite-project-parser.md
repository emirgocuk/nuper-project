# burpsuite-project-parser
Source: https://antigravity.codes/agent-skills/security/skills

## AI Worker Instructions
When the user requests functionality related to burpsuite-project-parser, follow these guidelines and utilize this context.

## Scraped Content

# burpsuite-project-parser
```
{baseDir}/scripts/burp-search.sh /path/to/project.burp [FLAGS]
```
```
{baseDir}/scripts/burp-search.sh /path/to/project.burp [FLAGS]
```
```
BURP_JAVA
```
```
BURP_JAR
```
```
proxyHistory
```
```
siteMap
```
```
proxyHistory.request.headers
```
```
proxyHistory.request.body
```
```
proxyHistory.response.headers
```
```
proxyHistory.response.body
```
```
siteMap.request.headers
```
```
siteMap.request.body
```
```
siteMap.response.headers
```
```
siteMap.response.body
```
```
# GOOD - headers only, safe to retrieve{baseDir}/scripts/burp-search.sh project.burp proxyHistory.request.headers | head -c 50000{baseDir}/scripts/burp-search.sh project.burp proxyHistory.response.headers | head -c 50000# BAD - full records include bodies, can be gigabytes{baseDir}/scripts/burp-search.sh project.burp proxyHistory  # NEVER DO THIS
```
```
# GOOD - headers only, safe to retrieve{baseDir}/scripts/burp-search.sh project.burp proxyHistory.request.headers | head -c 50000{baseDir}/scripts/burp-search.sh project.burp proxyHistory.response.headers | head -c 50000# BAD - full records include bodies, can be gigabytes{baseDir}/scripts/burp-search.sh project.burp proxyHistory  # NEVER DO THIS
```
```
# 1. First, find interesting URLs from headers{baseDir}/scripts/burp-search.sh project.burp proxyHistory.response.headers | \  jq -r 'select(.headers | test("text/html")) | .url' | head -n 20# 2. Then search bodies with targeted regex - MUST truncate body to 1000 chars{baseDir}/scripts/burp-search.sh project.burp "responseBody='.*specific-pattern.*'" | \  head -n 10 | jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
# 1. First, find interesting URLs from headers{baseDir}/scripts/burp-search.sh project.burp proxyHistory.response.headers | \  jq -r 'select(.headers | test("text/html")) | .url' | head -n 20# 2. Then search bodies with targeted regex - MUST truncate body to 1000 chars{baseDir}/scripts/burp-search.sh project.burp "responseBody='.*specific-pattern.*'" | \  head -n 10 | jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
responseHeader='.*regex.*'
```
```
responseHeader='.*regex.*'
```
```
{"url":"...", "header":"..."}
```
```
responseHeader='.*(nginx|Apache|Servlet).*' | head -c 50000
```
```
responseHeader='.*(nginx|Apache|Servlet).*' | head -c 50000
```
```
responseBody='.*regex.*'
```
```
responseBody='.*regex.*'
```
```
# REQUIRED format - always truncate .body field{baseDir}/scripts/burp-search.sh project.burp "responseBody='.*<form.*action.*'" | \  head -n 10 | jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
# REQUIRED format - always truncate .body field{baseDir}/scripts/burp-search.sh project.burp "responseBody='.*<form.*action.*'" | \  head -n 10 | jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
auditItems
```
```
auditItems
```
```
head -n 100
```
```
proxyHistory
```
```
proxyHistory
```
```
proxyHistory.request.headers
```
```
proxyHistory.response.headers
```
```
siteMap
```
```
siteMap
```
```
# Check record count AND total bytes - never skip this step{baseDir}/scripts/burp-search.sh project.burp proxyHistory | wc -cl{baseDir}/scripts/burp-search.sh project.burp "responseHeader='.*Server.*'" | wc -cl{baseDir}/scripts/burp-search.sh project.burp auditItems | wc -cl
```
```
# Check record count AND total bytes - never skip this step{baseDir}/scripts/burp-search.sh project.burp proxyHistory | wc -cl{baseDir}/scripts/burp-search.sh project.burp "responseHeader='.*Server.*'" | wc -cl{baseDir}/scripts/burp-search.sh project.burp auditItems | wc -cl
```
```
wc -cl
```
```
<bytes> <lines>
```
```
524288 42
```
```
# Instead of: proxyHistory (gigabytes)   # Use: proxyHistory.request.headers (kilobytes)
```
```
# Instead of: proxyHistory (gigabytes)   # Use: proxyHistory.request.headers (kilobytes)
```
```
# Too broad (matches everything):   responseHeader='.*'   # Better - target specific headers:   responseHeader='.*X-Frame-Options.*'   responseHeader='.*Content-Security-Policy.*'
```
```
# Too broad (matches everything):   responseHeader='.*'   # Better - target specific headers:   responseHeader='.*X-Frame-Options.*'   responseHeader='.*Content-Security-Policy.*'
```
```
# Get only specific content types   {baseDir}/scripts/burp-search.sh project.burp proxyHistory.response.headers | \     jq -c 'select(.url | test("/api/"))' | head -n 50
```
```
# Get only specific content types   {baseDir}/scripts/burp-search.sh project.burp proxyHistory.response.headers | \     jq -c 'select(.url | test("/api/"))' | head -n 50
```
```
# ALWAYS use head -c to limit total bytes (max 50KB){baseDir}/scripts/burp-search.sh project.burp proxyHistory.request.headers | head -c 50000# For body searches, truncate each JSON object's body field:{baseDir}/scripts/burp-search.sh project.burp "responseBody='pattern'" | \  head -n 20 | jq -c '.body = (.body | if length > 1000 then .[:1000] + "...[TRUNCATED]" else . end)'# Limit both record count AND byte size:{baseDir}/scripts/burp-search.sh project.burp auditItems | head -n 50 | head -c 50000
```
```
# ALWAYS use head -c to limit total bytes (max 50KB){baseDir}/scripts/burp-search.sh project.burp proxyHistory.request.headers | head -c 50000# For body searches, truncate each JSON object's body field:{baseDir}/scripts/burp-search.sh project.burp "responseBody='pattern'" | \  head -n 20 | jq -c '.body = (.body | if length > 1000 then .[:1000] + "...[TRUNCATED]" else . end)'# Limit both record count AND byte size:{baseDir}/scripts/burp-search.sh project.burp auditItems | head -n 50 | head -c 50000
```
```
head -c 50000
```
```
.body
```
```
jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
proxyHistory
```
```
siteMap
```
```
responseBody='...'
```
```
.*
```
```
.+
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | jq 'select(.severity == "High")'
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | jq 'select(.severity == "High")'
```
```
... | jq 'select(.confidence == "Certain" or .confidence == "Firm")'
```
```
... | jq 'select(.confidence == "Certain" or .confidence == "Firm")'
```
```
... | jq -r '.url' | sort -u
```
```
... | jq -r '.url' | sort -u
```
```
{baseDir}/scripts/burp-search.sh project.burp "responseBody='pattern'"
```
```
{baseDir}/scripts/burp-search.sh project.burp "responseBody='pattern'"
```
```
jq
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | jq .
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | jq .
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | grep -i "sql injection"
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | grep -i "sql injection"
```
```
{baseDir}/scripts/burp-search.sh project.burp "responseHeader='.*Access-Control.*'" | head -c 50000
```
```
{baseDir}/scripts/burp-search.sh project.burp "responseHeader='.*Access-Control.*'" | head -c 50000
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | jq -c 'select(.severity == "High")' | head -n 100
```
```
{baseDir}/scripts/burp-search.sh project.burp auditItems | jq -c 'select(.severity == "High")' | head -n 100
```
```
{baseDir}/scripts/burp-search.sh project.burp proxyHistory.request.headers | jq -r '.request.url' | head -n 200
```
```
{baseDir}/scripts/burp-search.sh project.burp proxyHistory.request.headers | jq -r '.request.url' | head -n 200
```
```
{baseDir}/scripts/burp-search.sh project.burp "responseBody='.*password.*'" | \  head -n 10 | jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
{baseDir}/scripts/burp-search.sh project.burp "responseBody='.*password.*'" | \  head -n 10 | jq -c '.body = (.body[:1000] + "...[TRUNCATED]")'
```
```
export BURP_JAVA="/Applications/Burp Suite Professional.app/Contents/Resources/jre.bundle/Contents/Home/bin/java"export BURP_JAR="/Applications/Burp Suite Professional.app/Contents/Resources/app/burpsuite_pro.jar"
```
```
export BURP_JAVA="/Applications/Burp Suite Professional.app/Contents/Resources/jre.bundle/Contents/Home/bin/java"export BURP_JAR="/Applications/Burp Suite Professional.app/Contents/Resources/app/burpsuite_pro.jar"
```
```
$env:BURP_JAVA = "C:\Program Files\BurpSuiteProfessional\jre\bin\java.exe"$env:BURP_JAR = "C:\Program Files\BurpSuiteProfessional\burpsuite_pro.jar"
```
```
$env:BURP_JAVA = "C:\Program Files\BurpSuiteProfessional\jre\bin\java.exe"$env:BURP_JAR = "C:\Program Files\BurpSuiteProfessional\burpsuite_pro.jar"
```
```
export BURP_JAVA="/opt/BurpSuiteProfessional/jre/bin/java"export BURP_JAR="/opt/BurpSuiteProfessional/burpsuite_pro.jar"
```
```
export BURP_JAVA="/opt/BurpSuiteProfessional/jre/bin/java"export BURP_JAR="/opt/BurpSuiteProfessional/burpsuite_pro.jar"
```
```
.bashrc
```
```
.zshrc
```
```
"$BURP_JAVA" -jar -Djava.awt.headless=true "$BURP_JAR" \  --project-file=/path/to/project.burp [FLAGS]
```
```
"$BURP_JAVA" -jar -Djava.awt.headless=true "$BURP_JAR" \  --project-file=/path/to/project.burp [FLAGS]
```
For security professionals and developers, automating the analysis of Burp Suite project files is a game-changer. This agent skill empowers your coding assistant to delve into vast amounts of captured web traffic and security findings without manual intervention. By leveraging the command line, it transforms static `.burp` files into actionable intelligence, enabling rapid identification of vulnerabilities, comprehensive audit trail examination, and efficient data extraction for further processing or reporting. Integrate this skill to streamline your security workflows and enhance the depth of your automated assessments.

# When to Use This Skill
- •Perform targeted regex searches across all response headers and bodies within a Burp project.
- •Automate the extraction and reporting of security audit findings and issues from saved Burp Suite scans.
- •Programmatically dump and analyze full proxy history or site map data for large-scale investigations.
- •Integrate HTTP traffic analysis from Burp projects into CI/CD pipelines for automated security checks.

# Pro Tips
- 💡Ensure `BURP_JAVA` and `BURP_JAR` environment variables are correctly configured for seamless execution, especially in containerized or CI/CD environments.
- 💡Combine this skill with data processing or reporting skills (e.g., for JSON/CSV output) to fully automate the generation of security reports from extracted Burp data.
- 💡Familiarize yourself with the full range of command-line flags available for the underlying `burpsuite-project-file-parser` extension to unlock advanced filtering and extraction capabilities.

