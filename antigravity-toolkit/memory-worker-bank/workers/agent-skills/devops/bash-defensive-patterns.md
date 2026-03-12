# bash-defensive-patterns
Source: https://antigravity.codes/agent-skills/devops/bash-defensive-patterns

## AI Worker Instructions
When the user requests functionality related to bash-defensive-patterns, follow these guidelines and utilize this context.

## Scraped Content

# bash-defensive-patterns
```
#!/bin/bashset -Eeuo pipefail  # Exit on error, unset variables, pipe failures
```
```
#!/bin/bashset -Eeuo pipefail  # Exit on error, unset variables, pipe failures
```
```
set -E
```
```
set -e
```
```
set -u
```
```
set -o pipefail
```
```
#!/bin/bashset -Eeuo pipefailtrap 'echo "Error on line $LINENO"' ERRtrap 'echo "Cleaning up..."; rm -rf "$TMPDIR"' EXITTMPDIR=$(mktemp -d)# Script code here
```
```
#!/bin/bashset -Eeuo pipefailtrap 'echo "Error on line $LINENO"' ERRtrap 'echo "Cleaning up..."; rm -rf "$TMPDIR"' EXITTMPDIR=$(mktemp -d)# Script code here
```
```
# Wrong - unsafecp $source $dest# Correct - safecp "$source" "$dest"# Required variables - fail with message if unset: "${REQUIRED_VAR:?REQUIRED_VAR is not set}"
```
```
# Wrong - unsafecp $source $dest# Correct - safecp "$source" "$dest"# Required variables - fail with message if unset: "${REQUIRED_VAR:?REQUIRED_VAR is not set}"
```
```
# Safe array iterationdeclare -a items=("item 1" "item 2" "item 3")for item in "${items[@]}"; do    echo "Processing: $item"done# Reading output into array safelymapfile -t lines < <(some_command)readarray -t numbers < <(seq 1 10)
```
```
# Safe array iterationdeclare -a items=("item 1" "item 2" "item 3")for item in "${items[@]}"; do    echo "Processing: $item"done# Reading output into array safelymapfile -t lines < <(some_command)readarray -t numbers < <(seq 1 10)
```
```
[[ ]]
```
```
[ ]
```
```
# Bash - saferif [[ -f "$file" && -r "$file" ]]; then    content=$(<"$file")fi# POSIX - portableif [ -f "$file" ] && [ -r "$file" ]; then    content=$(cat "$file")fi# Test for existence before operationsif [[ -z "${VAR:-}" ]]; then    echo "VAR is not set or is empty"fi
```
```
# Bash - saferif [[ -f "$file" && -r "$file" ]]; then    content=$(<"$file")fi# POSIX - portableif [ -f "$file" ] && [ -r "$file" ]; then    content=$(cat "$file")fi# Test for existence before operationsif [[ -z "${VAR:-}" ]]; then    echo "VAR is not set or is empty"fi
```
```
#!/bin/bashset -Eeuo pipefail# Correctly determine script directorySCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"SCRIPT_NAME="$(basename -- "${BASH_SOURCE[0]}")"echo "Script location: $SCRIPT_DIR/$SCRIPT_NAME"
```
```
#!/bin/bashset -Eeuo pipefail# Correctly determine script directorySCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"SCRIPT_NAME="$(basename -- "${BASH_SOURCE[0]}")"echo "Script location: $SCRIPT_DIR/$SCRIPT_NAME"
```
```
#!/bin/bashset -Eeuo pipefail# Prefix for functions: handle_*, process_*, check_*, validate_*# Include documentation and error handlingvalidate_file() {    local -r file="$1"    local -r message="${2:-File not found: $file}"    if [[ ! -f "$file" ]]; then        echo "ERROR: $message" >&2        return 1    fi    return 0}process_files() {    local -r input_dir="$1"    local -r output_dir="$2"    # Validate inputs    [[ -d "$input_dir" ]] || { echo "ERROR: input_dir not a directory" >&2; return 1; }    # Create output directory if needed    mkdir -p "$output_dir" || { echo "ERROR: Cannot create output_dir" >&2; return 1; }    # Process files safely    while IFS= read -r -d '' file; do        echo "Processing: $file"        # Do work    done < <(find "$input_dir" -maxdepth 1 -type f -print0)    return 0}
```
```
#!/bin/bashset -Eeuo pipefail# Prefix for functions: handle_*, process_*, check_*, validate_*# Include documentation and error handlingvalidate_file() {    local -r file="$1"    local -r message="${2:-File not found: $file}"    if [[ ! -f "$file" ]]; then        echo "ERROR: $message" >&2        return 1    fi    return 0}process_files() {    local -r input_dir="$1"    local -r output_dir="$2"    # Validate inputs    [[ -d "$input_dir" ]] || { echo "ERROR: input_dir not a directory" >&2; return 1; }    # Create output directory if needed    mkdir -p "$output_dir" || { echo "ERROR: Cannot create output_dir" >&2; return 1; }    # Process files safely    while IFS= read -r -d '' file; do        echo "Processing: $file"        # Do work    done < <(find "$input_dir" -maxdepth 1 -type f -print0)    return 0}
```
```
#!/bin/bashset -Eeuo pipefailtrap 'rm -rf -- "$TMPDIR"' EXIT# Create temporary directoryTMPDIR=$(mktemp -d) || { echo "ERROR: Failed to create temp directory" >&2; exit 1; }# Create temporary files in directoryTMPFILE1="$TMPDIR/temp1.txt"TMPFILE2="$TMPDIR/temp2.txt"# Use temporary filestouch "$TMPFILE1" "$TMPFILE2"echo "Temp files created in: $TMPDIR"
```
```
#!/bin/bashset -Eeuo pipefailtrap 'rm -rf -- "$TMPDIR"' EXIT# Create temporary directoryTMPDIR=$(mktemp -d) || { echo "ERROR: Failed to create temp directory" >&2; exit 1; }# Create temporary files in directoryTMPFILE1="$TMPDIR/temp1.txt"TMPFILE2="$TMPDIR/temp2.txt"# Use temporary filestouch "$TMPFILE1" "$TMPFILE2"echo "Temp files created in: $TMPDIR"
```
```
#!/bin/bashset -Eeuo pipefail# Default valuesVERBOSE=falseDRY_RUN=falseOUTPUT_FILE=""THREADS=4usage() {    cat <<EOFUsage: $0 [OPTIONS]Options:    -v, --verbose       Enable verbose output    -d, --dry-run       Run without making changes    -o, --output FILE   Output file path    -j, --jobs NUM      Number of parallel jobs    -h, --help          Show this help messageEOF    exit "${1:-0}"}# Parse argumentswhile [[ $# -gt 0 ]]; do    case "$1" in        -v|--verbose)            VERBOSE=true            shift            ;;        -d|--dry-run)            DRY_RUN=true            shift            ;;        -o|--output)            OUTPUT_FILE="$2"            shift 2            ;;        -j|--jobs)            THREADS="$2"            shift 2            ;;        -h|--help)            usage 0            ;;        --)            shift            break            ;;        *)            echo "ERROR: Unknown option: $1" >&2            usage 1            ;;    esacdone# Validate required arguments[[ -n "$OUTPUT_FILE" ]] || { echo "ERROR: -o/--output is required" >&2; usage 1; }
```
```
#!/bin/bashset -Eeuo pipefail# Default valuesVERBOSE=falseDRY_RUN=falseOUTPUT_FILE=""THREADS=4usage() {    cat <<EOFUsage: $0 [OPTIONS]Options:    -v, --verbose       Enable verbose output    -d, --dry-run       Run without making changes    -o, --output FILE   Output file path    -j, --jobs NUM      Number of parallel jobs    -h, --help          Show this help messageEOF    exit "${1:-0}"}# Parse argumentswhile [[ $# -gt 0 ]]; do    case "$1" in        -v|--verbose)            VERBOSE=true            shift            ;;        -d|--dry-run)            DRY_RUN=true            shift            ;;        -o|--output)            OUTPUT_FILE="$2"            shift 2            ;;        -j|--jobs)            THREADS="$2"            shift 2            ;;        -h|--help)            usage 0            ;;        --)            shift            break            ;;        *)            echo "ERROR: Unknown option: $1" >&2            usage 1            ;;    esacdone# Validate required arguments[[ -n "$OUTPUT_FILE" ]] || { echo "ERROR: -o/--output is required" >&2; usage 1; }
```
```
#!/bin/bashset -Eeuo pipefail# Logging functionslog_info() {    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $*" >&2}log_warn() {    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $*" >&2}log_error() {    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2}log_debug() {    if [[ "${DEBUG:-0}" == "1" ]]; then        echo "[$(date +'%Y-%m-%d %H:%M:%S')] DEBUG: $*" >&2    fi}# Usagelog_info "Starting script"log_debug "Debug information"log_warn "Warning message"log_error "Error occurred"
```
```
#!/bin/bashset -Eeuo pipefail# Logging functionslog_info() {    echo "[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $*" >&2}log_warn() {    echo "[$(date +'%Y-%m-%d %H:%M:%S')] WARN: $*" >&2}log_error() {    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $*" >&2}log_debug() {    if [[ "${DEBUG:-0}" == "1" ]]; then        echo "[$(date +'%Y-%m-%d %H:%M:%S')] DEBUG: $*" >&2    fi}# Usagelog_info "Starting script"log_debug "Debug information"log_warn "Warning message"log_error "Error occurred"
```
```
#!/bin/bashset -Eeuo pipefail# Track background processesPIDS=()cleanup() {    log_info "Shutting down..."    # Terminate all background processes    for pid in "${PIDS[@]}"; do        if kill -0 "$pid" 2>/dev/null; then            kill -TERM "$pid" 2>/dev/null || true        fi    done    # Wait for graceful shutdown    for pid in "${PIDS[@]}"; do        wait "$pid" 2>/dev/null || true    done}trap cleanup SIGTERM SIGINT# Start background tasksbackground_task &PIDS+=($!)another_task &PIDS+=($!)# Wait for all background processeswait
```
```
#!/bin/bashset -Eeuo pipefail# Track background processesPIDS=()cleanup() {    log_info "Shutting down..."    # Terminate all background processes    for pid in "${PIDS[@]}"; do        if kill -0 "$pid" 2>/dev/null; then            kill -TERM "$pid" 2>/dev/null || true        fi    done    # Wait for graceful shutdown    for pid in "${PIDS[@]}"; do        wait "$pid" 2>/dev/null || true    done}trap cleanup SIGTERM SIGINT# Start background tasksbackground_task &PIDS+=($!)another_task &PIDS+=($!)# Wait for all background processeswait
```
```
#!/bin/bashset -Eeuo pipefail# Use -i flag to move safely without overwritingsafe_move() {    local -r source="$1"    local -r dest="$2"    if [[ ! -e "$source" ]]; then        echo "ERROR: Source does not exist: $source" >&2        return 1    fi    if [[ -e "$dest" ]]; then        echo "ERROR: Destination already exists: $dest" >&2        return 1    fi    mv "$source" "$dest"}# Safe directory cleanupsafe_rmdir() {    local -r dir="$1"    if [[ ! -d "$dir" ]]; then        echo "ERROR: Not a directory: $dir" >&2        return 1    fi    # Use -I flag to prompt before rm (BSD/GNU compatible)    rm -rI -- "$dir"}# Atomic file writesatomic_write() {    local -r target="$1"    local -r tmpfile    tmpfile=$(mktemp) || return 1    # Write to temp file first    cat > "$tmpfile"    # Atomic rename    mv "$tmpfile" "$target"}
```
```
#!/bin/bashset -Eeuo pipefail# Use -i flag to move safely without overwritingsafe_move() {    local -r source="$1"    local -r dest="$2"    if [[ ! -e "$source" ]]; then        echo "ERROR: Source does not exist: $source" >&2        return 1    fi    if [[ -e "$dest" ]]; then        echo "ERROR: Destination already exists: $dest" >&2        return 1    fi    mv "$source" "$dest"}# Safe directory cleanupsafe_rmdir() {    local -r dir="$1"    if [[ ! -d "$dir" ]]; then        echo "ERROR: Not a directory: $dir" >&2        return 1    fi    # Use -I flag to prompt before rm (BSD/GNU compatible)    rm -rI -- "$dir"}# Atomic file writesatomic_write() {    local -r target="$1"    local -r tmpfile    tmpfile=$(mktemp) || return 1    # Write to temp file first    cat > "$tmpfile"    # Atomic rename    mv "$tmpfile" "$target"}
```
```
#!/bin/bashset -Eeuo pipefail# Check if resource already existsensure_directory() {    local -r dir="$1"    if [[ -d "$dir" ]]; then        log_info "Directory already exists: $dir"        return 0    fi    mkdir -p "$dir" || {        log_error "Failed to create directory: $dir"        return 1    }    log_info "Created directory: $dir"}# Ensure configuration stateensure_config() {    local -r config_file="$1"    local -r default_value="$2"    if [[ ! -f "$config_file" ]]; then        echo "$default_value" > "$config_file"        log_info "Created config: $config_file"    fi}# Rerunning script multiple times should be safeensure_directory "/var/cache/myapp"ensure_config "/etc/myapp/config" "DEBUG=false"
```
```
#!/bin/bashset -Eeuo pipefail# Check if resource already existsensure_directory() {    local -r dir="$1"    if [[ -d "$dir" ]]; then        log_info "Directory already exists: $dir"        return 0    fi    mkdir -p "$dir" || {        log_error "Failed to create directory: $dir"        return 1    }    log_info "Created directory: $dir"}# Ensure configuration stateensure_config() {    local -r config_file="$1"    local -r default_value="$2"    if [[ ! -f "$config_file" ]]; then        echo "$default_value" > "$config_file"        log_info "Created config: $config_file"    fi}# Rerunning script multiple times should be safeensure_directory "/var/cache/myapp"ensure_config "/etc/myapp/config" "DEBUG=false"
```
```
#!/bin/bashset -Eeuo pipefail# Use $() instead of backticksname=$(<"$file")  # Modern, safe variable assignment from fileoutput=$(command -v python3)  # Get command location safely# Handle command substitution with error checkingresult=$(command -v node) || {    log_error "node command not found"    return 1}# For multiple linesmapfile -t lines < <(grep "pattern" "$file")# NUL-safe iterationwhile IFS= read -r -d '' file; do    echo "Processing: $file"done < <(find /path -type f -print0)
```
```
#!/bin/bashset -Eeuo pipefail# Use $() instead of backticksname=$(<"$file")  # Modern, safe variable assignment from fileoutput=$(command -v python3)  # Get command location safely# Handle command substitution with error checkingresult=$(command -v node) || {    log_error "node command not found"    return 1}# For multiple linesmapfile -t lines < <(grep "pattern" "$file")# NUL-safe iterationwhile IFS= read -r -d '' file; do    echo "Processing: $file"done < <(find /path -type f -print0)
```
```
#!/bin/bashset -Eeuo pipefailDRY_RUN="${DRY_RUN:-false}"run_cmd() {    if [[ "$DRY_RUN" == "true" ]]; then        echo "[DRY RUN] Would execute: $*"        return 0    fi    "$@"}# Usagerun_cmd cp "$source" "$dest"run_cmd rm "$file"run_cmd chown "$owner" "$target"
```
```
#!/bin/bashset -Eeuo pipefailDRY_RUN="${DRY_RUN:-false}"run_cmd() {    if [[ "$DRY_RUN" == "true" ]]; then        echo "[DRY RUN] Would execute: $*"        return 0    fi    "$@"}# Usagerun_cmd cp "$source" "$dest"run_cmd rm "$file"run_cmd chown "$owner" "$target"
```
```
#!/bin/bashset -Eeuo pipefailprocess_data() {    local input_file=""    local output_dir=""    local format="json"    # Parse named parameters    while [[ $# -gt 0 ]]; do        case "$1" in            --input=*)                input_file="${1#*=}"                ;;            --output=*)                output_dir="${1#*=}"                ;;            --format=*)                format="${1#*=}"                ;;            *)                echo "ERROR: Unknown parameter: $1" >&2                return 1                ;;        esac        shift    done    # Validate required parameters    [[ -n "$input_file" ]] || { echo "ERROR: --input is required" >&2; return 1; }    [[ -n "$output_dir" ]] || { echo "ERROR: --output is required" >&2; return 1; }}
```
```
#!/bin/bashset -Eeuo pipefailprocess_data() {    local input_file=""    local output_dir=""    local format="json"    # Parse named parameters    while [[ $# -gt 0 ]]; do        case "$1" in            --input=*)                input_file="${1#*=}"                ;;            --output=*)                output_dir="${1#*=}"                ;;            --format=*)                format="${1#*=}"                ;;            *)                echo "ERROR: Unknown parameter: $1" >&2                return 1                ;;        esac        shift    done    # Validate required parameters    [[ -n "$input_file" ]] || { echo "ERROR: --input is required" >&2; return 1; }    [[ -n "$output_dir" ]] || { echo "ERROR: --output is required" >&2; return 1; }}
```
```
#!/bin/bashset -Eeuo pipefailcheck_dependencies() {    local -a missing_deps=()    local -a required=("jq" "curl" "git")    for cmd in "${required[@]}"; do        if ! command -v "$cmd" &>/dev/null; then            missing_deps+=("$cmd")        fi    done    if [[ ${#missing_deps[@]} -gt 0 ]]; then        echo "ERROR: Missing required commands: ${missing_deps[*]}" >&2        return 1    fi}check_dependencies
```
```
#!/bin/bashset -Eeuo pipefailcheck_dependencies() {    local -a missing_deps=()    local -a required=("jq" "curl" "git")    for cmd in "${required[@]}"; do        if ! command -v "$cmd" &>/dev/null; then            missing_deps+=("$cmd")        fi    done    if [[ ${#missing_deps[@]} -gt 0 ]]; then        echo "ERROR: Missing required commands: ${missing_deps[*]}" >&2        return 1    fi}check_dependencies
```
```
set -Eeuo pipefail
```
```
"$variable"
```
```
command -v
```
```
which
```
Elevate your shell scripting from functional to absolutely bulletproof with the Bash Defensive Patterns agent skill. This comprehensive guide equips AI coding assistants with the knowledge to craft robust, production-ready Bash scripts that anticipate errors, handle edge cases gracefully, and ensure system stability. By integrating these defensive strategies, you can significantly reduce debugging time, prevent costly outages, and build a foundation for highly reliable automation. It’s an essential tool for any developer aiming to deploy resilient CI/CD pipelines, secure system administration utilities, or maintain complex server-side logic, transforming your Bash scripts into guardians of your infrastructure.

# When to Use This Skill
- •Writing production automation scripts that require high reliability.
- •Building CI/CD pipeline scripts that must handle failures gracefully.
- •Creating system administration utilities that are fault-tolerant and safe.
- •Developing deployment automation that can recover from unexpected issues.

# Pro Tips
- 💡Always start your scripts with `set -Eeuo pipefail` to enforce strict mode and catch errors early, making debugging significantly easier.
- 💡Leverage `trap` commands for robust cleanup routines, ensuring temporary files or processes are always handled, even if the script exits unexpectedly.
- 💡Implement comprehensive logging and conditional checks around critical operations to provide clear insights into script execution and prevent unintended side effects.

