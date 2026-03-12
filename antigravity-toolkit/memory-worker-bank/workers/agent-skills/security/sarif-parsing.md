# sarif-parsing
Source: https://antigravity.codes/agent-skills/security/sarif-parsing

## AI Worker Instructions
When the user requests functionality related to sarif-parsing, follow these guidelines and utilize this context.

## Scraped Content

# sarif-parsing
```
sarifLog├── version: "2.1.0"├── $schema: (optional, enables IDE validation)└── runs[] (array of analysis runs)    ├── tool    │   ├── driver    │   │   ├── name (required)    │   │   ├── version    │   │   └── rules[] (rule definitions)    │   └── extensions[] (plugins)    ├── results[] (findings)    │   ├── ruleId    │   ├── level (error/warning/note)    │   ├── message.text    │   ├── locations[]    │   │   └── physicalLocation    │   │       ├── artifactLocation.uri    │   │       └── region (startLine, startColumn, etc.)    │   ├── fingerprints{}    │   └── partialFingerprints{}    └── artifacts[] (scanned files metadata)
```
```
sarifLog├── version: "2.1.0"├── $schema: (optional, enables IDE validation)└── runs[] (array of analysis runs)    ├── tool    │   ├── driver    │   │   ├── name (required)    │   │   ├── version    │   │   └── rules[] (rule definitions)    │   └── extensions[] (plugins)    ├── results[] (findings)    │   ├── ruleId    │   ├── level (error/warning/note)    │   ├── message.text    │   ├── locations[]    │   │   └── physicalLocation    │   │       ├── artifactLocation.uri    │   │       └── region (startLine, startColumn, etc.)    │   ├── fingerprints{}    │   └── partialFingerprints{}    └── artifacts[] (scanned files metadata)
```
```
/path/to/project/
```
```
/github/workspace/
```
```
brew install jq
```
```
apt install jq
```
```
pip install pysarif
```
```
pip install sarif-tools
```
```
go get github.com/chavacava/garif
```
```
# Pretty print the filejq '.' results.sarif# Count total findingsjq '[.runs[].results[]] | length' results.sarif# List all rule IDs triggeredjq '[.runs[].results[].ruleId] | unique' results.sarif# Extract errors onlyjq '.runs[].results[] | select(.level == "error")' results.sarif# Get findings with file locationsjq '.runs[].results[] | {  rule: .ruleId,  message: .message.text,  file: .locations[0].physicalLocation.artifactLocation.uri,  line: .locations[0].physicalLocation.region.startLine}' results.sarif# Filter by severity and get count per rulejq '[.runs[].results[] | select(.level == "error")] | group_by(.ruleId) | map({rule: .[0].ruleId, count: length})' results.sarif# Extract findings for a specific filejq --arg file "src/auth.py" '.runs[].results[] | select(.locations[].physicalLocation.artifactLocation.uri | contains($file))' results.sarif
```
```
# Pretty print the filejq '.' results.sarif# Count total findingsjq '[.runs[].results[]] | length' results.sarif# List all rule IDs triggeredjq '[.runs[].results[].ruleId] | unique' results.sarif# Extract errors onlyjq '.runs[].results[] | select(.level == "error")' results.sarif# Get findings with file locationsjq '.runs[].results[] | {  rule: .ruleId,  message: .message.text,  file: .locations[0].physicalLocation.artifactLocation.uri,  line: .locations[0].physicalLocation.region.startLine}' results.sarif# Filter by severity and get count per rulejq '[.runs[].results[] | select(.level == "error")] | group_by(.ruleId) | map({rule: .[0].ruleId, count: length})' results.sarif# Extract findings for a specific filejq --arg file "src/auth.py" '.runs[].results[] | select(.locations[].physicalLocation.artifactLocation.uri | contains($file))' results.sarif
```
```
from pysarif import load_from_file, save_to_file# Load SARIF filesarif = load_from_file("results.sarif")# Iterate through runs and resultsfor run in sarif.runs:    tool_name = run.tool.driver.name    print(f"Tool: {tool_name}")    for result in run.results:        print(f"  [{result.level}] {result.rule_id}: {result.message.text}")        if result.locations:            loc = result.locations[0].physical_location            if loc and loc.artifact_location:                print(f"    File: {loc.artifact_location.uri}")                if loc.region:                    print(f"    Line: {loc.region.start_line}")# Save modified SARIFsave_to_file(sarif, "modified.sarif")
```
```
from pysarif import load_from_file, save_to_file# Load SARIF filesarif = load_from_file("results.sarif")# Iterate through runs and resultsfor run in sarif.runs:    tool_name = run.tool.driver.name    print(f"Tool: {tool_name}")    for result in run.results:        print(f"  [{result.level}] {result.rule_id}: {result.message.text}")        if result.locations:            loc = result.locations[0].physical_location            if loc and loc.artifact_location:                print(f"    File: {loc.artifact_location.uri}")                if loc.region:                    print(f"    Line: {loc.region.start_line}")# Save modified SARIFsave_to_file(sarif, "modified.sarif")
```
```
from sarif import loader# Load single filesarif_data = loader.load_sarif_file("results.sarif")# Or load multiple filessarif_set = loader.load_sarif_files(["tool1.sarif", "tool2.sarif"])# Get summary reportreport = sarif_data.get_report()# Get histogram by severityerrors = report.get_issue_type_histogram_for_severity("error")warnings = report.get_issue_type_histogram_for_severity("warning")# Filter resultshigh_severity = [r for r in sarif_data.get_results()                 if r.get("level") == "error"]
```
```
from sarif import loader# Load single filesarif_data = loader.load_sarif_file("results.sarif")# Or load multiple filessarif_set = loader.load_sarif_files(["tool1.sarif", "tool2.sarif"])# Get summary reportreport = sarif_data.get_report()# Get histogram by severityerrors = report.get_issue_type_histogram_for_severity("error")warnings = report.get_issue_type_histogram_for_severity("warning")# Filter resultshigh_severity = [r for r in sarif_data.get_results()                 if r.get("level") == "error"]
```
```
# Summary of findingssarif summary results.sarif# List all results with detailssarif ls results.sarif# Get results by severitysarif ls --level error results.sarif# Diff two SARIF files (find new/fixed issues)sarif diff baseline.sarif current.sarif# Convert to other formatssarif csv results.sarif > results.csvsarif html results.sarif > report.html
```
```
# Summary of findingssarif summary results.sarif# List all results with detailssarif ls results.sarif# Get results by severitysarif ls --level error results.sarif# Diff two SARIF files (find new/fixed issues)sarif diff baseline.sarif current.sarif# Convert to other formatssarif csv results.sarif > results.csvsarif html results.sarif > report.html
```
```
import jsonfrom pathlib import Pathdef aggregate_sarif_files(sarif_paths: list[str]) -> dict:    """Combine multiple SARIF files into one."""    aggregated = {        "version": "2.1.0",        "$schema": "https://json.schemastore.org/sarif-2.1.0.json",        "runs": []    }    for path in sarif_paths:        with open(path) as f:            sarif = json.load(f)            aggregated["runs"].extend(sarif.get("runs", []))    return aggregateddef deduplicate_results(sarif: dict) -> dict:    """Remove duplicate findings based on fingerprints."""    seen_fingerprints = set()    for run in sarif["runs"]:        unique_results = []        for result in run.get("results", []):            # Use partialFingerprints or create key from location            fp = None            if result.get("partialFingerprints"):                fp = tuple(sorted(result["partialFingerprints"].items()))            elif result.get("fingerprints"):                fp = tuple(sorted(result["fingerprints"].items()))            else:                # Fallback: create fingerprint from rule + location                loc = result.get("locations", [{}])[0]                phys = loc.get("physicalLocation", {})                fp = (                    result.get("ruleId"),                    phys.get("artifactLocation", {}).get("uri"),                    phys.get("region", {}).get("startLine")                )            if fp not in seen_fingerprints:                seen_fingerprints.add(fp)                unique_results.append(result)        run["results"] = unique_results    return sarif
```
```
import jsonfrom pathlib import Pathdef aggregate_sarif_files(sarif_paths: list[str]) -> dict:    """Combine multiple SARIF files into one."""    aggregated = {        "version": "2.1.0",        "$schema": "https://json.schemastore.org/sarif-2.1.0.json",        "runs": []    }    for path in sarif_paths:        with open(path) as f:            sarif = json.load(f)            aggregated["runs"].extend(sarif.get("runs", []))    return aggregateddef deduplicate_results(sarif: dict) -> dict:    """Remove duplicate findings based on fingerprints."""    seen_fingerprints = set()    for run in sarif["runs"]:        unique_results = []        for result in run.get("results", []):            # Use partialFingerprints or create key from location            fp = None            if result.get("partialFingerprints"):                fp = tuple(sorted(result["partialFingerprints"].items()))            elif result.get("fingerprints"):                fp = tuple(sorted(result["fingerprints"].items()))            else:                # Fallback: create fingerprint from rule + location                loc = result.get("locations", [{}])[0]                phys = loc.get("physicalLocation", {})                fp = (                    result.get("ruleId"),                    phys.get("artifactLocation", {}).get("uri"),                    phys.get("region", {}).get("startLine")                )            if fp not in seen_fingerprints:                seen_fingerprints.add(fp)                unique_results.append(result)        run["results"] = unique_results    return sarif
```
```
import jsonfrom dataclasses import dataclassfrom typing import Optional@dataclassclass Finding:    rule_id: str    level: str    message: str    file_path: Optional[str]    start_line: Optional[int]    end_line: Optional[int]    fingerprint: Optional[str]def extract_findings(sarif_path: str) -> list[Finding]:    """Extract structured findings from SARIF file."""    with open(sarif_path) as f:        sarif = json.load(f)    findings = []    for run in sarif.get("runs", []):        for result in run.get("results", []):            loc = result.get("locations", [{}])[0]            phys = loc.get("physicalLocation", {})            region = phys.get("region", {})            findings.append(Finding(                rule_id=result.get("ruleId", "unknown"),                level=result.get("level", "warning"),                message=result.get("message", {}).get("text", ""),                file_path=phys.get("artifactLocation", {}).get("uri"),                start_line=region.get("startLine"),                end_line=region.get("endLine"),                fingerprint=next(iter(result.get("partialFingerprints", {}).values()), None)            ))    return findings# Filter and prioritizedef prioritize_findings(findings: list[Finding]) -> list[Finding]:    """Sort findings by severity."""    severity_order = {"error": 0, "warning": 1, "note": 2, "none": 3}    return sorted(findings, key=lambda f: severity_order.get(f.level, 99))
```
```
import jsonfrom dataclasses import dataclassfrom typing import Optional@dataclassclass Finding:    rule_id: str    level: str    message: str    file_path: Optional[str]    start_line: Optional[int]    end_line: Optional[int]    fingerprint: Optional[str]def extract_findings(sarif_path: str) -> list[Finding]:    """Extract structured findings from SARIF file."""    with open(sarif_path) as f:        sarif = json.load(f)    findings = []    for run in sarif.get("runs", []):        for result in run.get("results", []):            loc = result.get("locations", [{}])[0]            phys = loc.get("physicalLocation", {})            region = phys.get("region", {})            findings.append(Finding(                rule_id=result.get("ruleId", "unknown"),                level=result.get("level", "warning"),                message=result.get("message", {}).get("text", ""),                file_path=phys.get("artifactLocation", {}).get("uri"),                start_line=region.get("startLine"),                end_line=region.get("endLine"),                fingerprint=next(iter(result.get("partialFingerprints", {}).values()), None)            ))    return findings# Filter and prioritizedef prioritize_findings(findings: list[Finding]) -> list[Finding]:    """Sort findings by severity."""    severity_order = {"error": 0, "warning": 1, "note": 2, "none": 3}    return sorted(findings, key=lambda f: severity_order.get(f.level, 99))
```
```
from urllib.parse import unquotefrom pathlib import Pathdef normalize_path(uri: str, base_path: str = "") -> str:    """Normalize SARIF artifact URI to consistent path."""    # Remove file:// prefix if present    if uri.startswith("file://"):        uri = uri[7:]    # URL decode    uri = unquote(uri)    # Handle relative paths    if not Path(uri).is_absolute() and base_path:        uri = str(Path(base_path) / uri)    # Normalize separators    return str(Path(uri))
```
```
from urllib.parse import unquotefrom pathlib import Pathdef normalize_path(uri: str, base_path: str = "") -> str:    """Normalize SARIF artifact URI to consistent path."""    # Remove file:// prefix if present    if uri.startswith("file://"):        uri = uri[7:]    # URL decode    uri = unquote(uri)    # Handle relative paths    if not Path(uri).is_absolute() and base_path:        uri = str(Path(base_path) / uri)    # Normalize separators    return str(Path(uri))
```
```
def compute_stable_fingerprint(result: dict, file_content: str = None) -> str:    """Compute environment-independent fingerprint."""    import hashlib    components = [        result.get("ruleId", ""),        result.get("message", {}).get("text", "")[:100],  # First 100 chars    ]    # Add code snippet if available    if file_content and result.get("locations"):        region = result["locations"][0].get("physicalLocation", {}).get("region", {})        if region.get("startLine"):            lines = file_content.split("\n")            line_idx = region["startLine"] - 1            if 0 <= line_idx < len(lines):                # Normalize whitespace                components.append(lines[line_idx].strip())    return hashlib.sha256("".join(components).encode()).hexdigest()[:16]
```
```
def compute_stable_fingerprint(result: dict, file_content: str = None) -> str:    """Compute environment-independent fingerprint."""    import hashlib    components = [        result.get("ruleId", ""),        result.get("message", {}).get("text", "")[:100],  # First 100 chars    ]    # Add code snippet if available    if file_content and result.get("locations"):        region = result["locations"][0].get("physicalLocation", {}).get("region", {})        if region.get("startLine"):            lines = file_content.split("\n")            line_idx = region["startLine"] - 1            if 0 <= line_idx < len(lines):                # Normalize whitespace                components.append(lines[line_idx].strip())    return hashlib.sha256("".join(components).encode()).hexdigest()[:16]
```
```
def safe_get_location(result: dict) -> tuple[str, int]:    """Safely extract file and line from result."""    try:        loc = result.get("locations", [{}])[0]        phys = loc.get("physicalLocation", {})        file_path = phys.get("artifactLocation", {}).get("uri", "unknown")        line = phys.get("region", {}).get("startLine", 0)        return file_path, line    except (IndexError, KeyError, TypeError):        return "unknown", 0
```
```
def safe_get_location(result: dict) -> tuple[str, int]:    """Safely extract file and line from result."""    try:        loc = result.get("locations", [{}])[0]        phys = loc.get("physicalLocation", {})        file_path = phys.get("artifactLocation", {}).get("uri", "unknown")        line = phys.get("region", {}).get("startLine", 0)        return file_path, line    except (IndexError, KeyError, TypeError):        return "unknown", 0
```
```
import ijson  # pip install ijsondef stream_results(sarif_path: str):    """Stream results without loading entire file."""    with open(sarif_path, "rb") as f:        # Stream through results arrays        for result in ijson.items(f, "runs.item.results.item"):            yield result
```
```
import ijson  # pip install ijsondef stream_results(sarif_path: str):    """Stream results without loading entire file."""    with open(sarif_path, "rb") as f:        # Stream through results arrays        for result in ijson.items(f, "runs.item.results.item"):            yield result
```
```
# Using ajv-clinpm install -g ajv-cliajv validate -s sarif-schema-2.1.0.json -d results.sarif# Using Python jsonschemapip install jsonschema
```
```
# Using ajv-clinpm install -g ajv-cliajv validate -s sarif-schema-2.1.0.json -d results.sarif# Using Python jsonschemapip install jsonschema
```
```
from jsonschema import validate, ValidationErrorimport jsondef validate_sarif(sarif_path: str, schema_path: str) -> bool:    """Validate SARIF file against schema."""    with open(sarif_path) as f:        sarif = json.load(f)    with open(schema_path) as f:        schema = json.load(f)    try:        validate(sarif, schema)        return True    except ValidationError as e:        print(f"Validation error: {e.message}")        return False
```
```
from jsonschema import validate, ValidationErrorimport jsondef validate_sarif(sarif_path: str, schema_path: str) -> bool:    """Validate SARIF file against schema."""    with open(sarif_path) as f:        sarif = json.load(f)    with open(schema_path) as f:        schema = json.load(f)    try:        validate(sarif, schema)        return True    except ValidationError as e:        print(f"Validation error: {e.message}")        return False
```
```
- name: Upload SARIF  uses: github/codeql-action/upload-sarif@v3  with:    sarif_file: results.sarif- name: Check for high severity  run: |    HIGH_COUNT=$(jq '[.runs[].results[] | select(.level == "error")] | length' results.sarif)    if [ "$HIGH_COUNT" -gt 0 ]; then      echo "Found $HIGH_COUNT high severity issues"      exit 1    fi
```
```
- name: Upload SARIF  uses: github/codeql-action/upload-sarif@v3  with:    sarif_file: results.sarif- name: Check for high severity  run: |    HIGH_COUNT=$(jq '[.runs[].results[] | select(.level == "error")] | length' results.sarif)    if [ "$HIGH_COUNT" -gt 0 ]; then      echo "Found $HIGH_COUNT high severity issues"      exit 1    fi
```
```
from sarif import loaderdef check_for_regressions(baseline: str, current: str) -> int:    """Return count of new issues not in baseline."""    baseline_data = loader.load_sarif_file(baseline)    current_data = loader.load_sarif_file(current)    baseline_fps = {get_fingerprint(r) for r in baseline_data.get_results()}    new_issues = [r for r in current_data.get_results()                  if get_fingerprint(r) not in baseline_fps]    return len(new_issues)
```
```
from sarif import loaderdef check_for_regressions(baseline: str, current: str) -> int:    """Return count of new issues not in baseline."""    baseline_data = loader.load_sarif_file(baseline)    current_data = loader.load_sarif_file(current)    baseline_fps = {get_fingerprint(r) for r in baseline_data.get_results()}    new_issues = [r for r in current_data.get_results()                  if get_fingerprint(r) not in baseline_fps]    return len(new_issues)
```
```
normalize_path()
```
```
compute_fingerprint()
```
```
deduplicate_results()
```
The SARIF Parsing agent skill empowers developers and security engineers to effectively manage and interpret security findings. SARIF (Static Analysis Results Interchange Format) is the standardized way to communicate results from various static analysis tools. This skill helps you navigate complex SARIF structures, extract critical vulnerability data, and streamline the integration of security insights into your development workflows. Leverage its capabilities to gain a clearer understanding of your codebase's security posture and automate the processing of scan outputs, ensuring timely remediation and robust security practices.

# When to Use This Skill
- •Reading and interpreting static analysis scan results provided in SARIF format.
- •Aggregating security findings from diverse static analysis tools into a unified view.
- •Deduplicating and filtering security alerts to focus on unique and critical vulnerabilities.
- •Integrating SARIF data directly into CI/CD pipelines for automated security gating and reporting.

# Pro Tips
- 💡Always validate SARIF files against the official SARIF 2.1.0 JSON schema to ensure correctness and prevent parsing errors.
- 💡When aggregating results from multiple tools, leverage common properties like 'ruleId' and 'fingerprints' to accurately deduplicate findings.
- 💡Consider scripting common SARIF processing tasks, such as extracting specific vulnerability types or converting to other formats, to automate your security workflows.

