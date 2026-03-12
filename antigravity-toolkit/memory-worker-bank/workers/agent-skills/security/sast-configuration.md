# sast-configuration
Source: https://antigravity.codes/agent-skills/security/sast-configuration

## AI Worker Instructions
When the user requests functionality related to sast-configuration, follow these guidelines and utilize this context.

## Scraped Content

# sast-configuration
```
# Semgrep quick startpip install semgrepsemgrep --config=auto --error# SonarQube with Dockerdocker run -d --name sonarqube -p 9000:9000 sonarqube:latest# CodeQL CLI setupgh extension install github/gh-codeqlcodeql database create mydb --language=python
```
```
# Semgrep quick startpip install semgrepsemgrep --config=auto --error# SonarQube with Dockerdocker run -d --name sonarqube -p 9000:9000 sonarqube:latest# CodeQL CLI setupgh extension install github/gh-codeqlcodeql database create mydb --language=python
```
```
# GitHub Actions example- name: Run Semgrep  uses: returntocorp/semgrep-action@v1  with:    config: >-      p/security-audit      p/owasp-top-ten
```
```
# GitHub Actions example- name: Run Semgrep  uses: returntocorp/semgrep-action@v1  with:    config: >-      p/security-audit      p/owasp-top-ten
```
```
# .pre-commit-config.yaml- repo: https://github.com/returntocorp/semgrep  rev: v1.45.0  hooks:    - id: semgrep      args: ['--config=auto', '--error']
```
```
# .pre-commit-config.yaml- repo: https://github.com/returntocorp/semgrep  rev: v1.45.0  hooks:    - id: semgrep      args: ['--config=auto', '--error']
```
```
./scripts/run-sast.sh --setup --language python --tools semgrep,sonarqube
```
```
./scripts/run-sast.sh --setup --language python --tools semgrep,sonarqube
```
```
# See references/semgrep-rules.md for detailed examplesrules:  - id: hardcoded-jwt-secret    pattern: jwt.encode($DATA, "...", ...)    message: JWT secret should not be hardcoded    severity: ERROR
```
```
# See references/semgrep-rules.md for detailed examplesrules:  - id: hardcoded-jwt-secret    pattern: jwt.encode($DATA, "...", ...)    message: JWT secret should not be hardcoded    severity: ERROR
```
```
# PCI-DSS focused scansemgrep --config p/pci-dss --json -o pci-scan-results.json
```
```
# PCI-DSS focused scansemgrep --config p/pci-dss --json -o pci-scan-results.json
```
In today's fast-paced development landscape, integrating robust security measures from the outset is paramount. Static Application Security Testing (SAST) plays a critical role in identifying vulnerabilities early in the software development lifecycle, saving significant time and resources. This specialized agent skill empowers developers and security engineers to effortlessly configure, customize, and integrate leading SAST tools like Semgrep, SonarQube, and CodeQL into their existing workflows. By automating the detection of security flaws directly within your codebase, you can enforce security policies, enhance code quality, and maintain a proactive posture against potential threats, fostering a secure-by-design approach.

# When to Use This Skill
- •Setting up automated security scanning within CI/CD pipelines for continuous integration.
- •Creating and customizing security rules to detect specific vulnerabilities unique to your application's codebase.
- •Implementing DevSecOps practices to integrate security testing early and consistently in the development lifecycle.
- •Configuring quality gates and compliance policies to ensure secure code releases.

# Pro Tips
- 💡Prioritize integrating SAST scans as early as possible in your development workflow (e.g., pre-commit hooks, pull request checks) to catch issues before they escalate.
- 💡Regularly review and fine-tune your SAST tool's rules and configurations to minimize false positives and ensure relevant, actionable findings.
- 💡Combine this skill with dynamic application security testing (DAST) or software composition analysis (SCA) for a multi-layered, comprehensive security approach.

