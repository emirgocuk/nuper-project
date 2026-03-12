# uv-package-manager
Source: https://antigravity.codes/agent-skills/python/uv-package-manager

## AI Worker Instructions
When the user requests functionality related to uv-package-manager, follow these guidelines and utilize this context.

## Scraped Content

# uv-package-manager
```
# macOS/Linuxcurl -LsSf https://astral.sh/uv/install.sh | sh# Windows (PowerShell)powershell -c "irm https://astral.sh/uv/install.ps1 | iex"# Using pip (if you already have Python)pip install uv# Using Homebrew (macOS)brew install uv# Using cargo (if you have Rust)cargo install --git https://github.com/astral-sh/uv uv
```
```
# macOS/Linuxcurl -LsSf https://astral.sh/uv/install.sh | sh# Windows (PowerShell)powershell -c "irm https://astral.sh/uv/install.ps1 | iex"# Using pip (if you already have Python)pip install uv# Using Homebrew (macOS)brew install uv# Using cargo (if you have Rust)cargo install --git https://github.com/astral-sh/uv uv
```
```
uv --version# uv 0.x.x
```
```
uv --version# uv 0.x.x
```
```
# Create new project with virtual environmentuv init my-projectcd my-project# Or create in current directoryuv init .# Initialize creates:# - .python-version (Python version)# - pyproject.toml (project config)# - README.md# - .gitignore
```
```
# Create new project with virtual environmentuv init my-projectcd my-project# Or create in current directoryuv init .# Initialize creates:# - .python-version (Python version)# - pyproject.toml (project config)# - README.md# - .gitignore
```
```
# Install packages (creates venv if needed)uv add requests pandas# Install dev dependenciesuv add --dev pytest black ruff# Install from requirements.txtuv pip install -r requirements.txt# Install from pyproject.tomluv sync
```
```
# Install packages (creates venv if needed)uv add requests pandas# Install dev dependenciesuv add --dev pytest black ruff# Install from requirements.txtuv pip install -r requirements.txt# Install from pyproject.tomluv sync
```
```
# Create virtual environment with uvuv venv# Create with specific Python versionuv venv --python 3.12# Create with custom nameuv venv my-env# Create with system site packagesuv venv --system-site-packages# Specify locationuv venv /path/to/venv
```
```
# Create virtual environment with uvuv venv# Create with specific Python versionuv venv --python 3.12# Create with custom nameuv venv my-env# Create with system site packagesuv venv --system-site-packages# Specify locationuv venv /path/to/venv
```
```
# Linux/macOSsource .venv/bin/activate# Windows (Command Prompt).venv\Scripts\activate.bat# Windows (PowerShell).venv\Scripts\Activate.ps1# Or use uv run (no activation needed)uv run python script.pyuv run pytest
```
```
# Linux/macOSsource .venv/bin/activate# Windows (Command Prompt).venv\Scripts\activate.bat# Windows (PowerShell).venv\Scripts\Activate.ps1# Or use uv run (no activation needed)uv run python script.pyuv run pytest
```
```
# Run Python script (auto-activates venv)uv run python app.py# Run installed CLI tooluv run black .uv run pytest# Run with specific Python versionuv run --python 3.11 python script.py# Pass argumentsuv run python script.py --arg value
```
```
# Run Python script (auto-activates venv)uv run python app.py# Run installed CLI tooluv run black .uv run pytest# Run with specific Python versionuv run --python 3.11 python script.py# Pass argumentsuv run python script.py --arg value
```
```
# Add package (adds to pyproject.toml)uv add requests# Add with version constraintuv add "django>=4.0,<5.0"# Add multiple packagesuv add numpy pandas matplotlib# Add dev dependencyuv add --dev pytest pytest-cov# Add optional dependency groupuv add --optional docs sphinx# Add from gituv add git+https://github.com/user/repo.git# Add from git with specific refuv add git+https://github.com/user/repo.git@v1.0.0# Add from local pathuv add ./local-package# Add editable local packageuv add -e ./local-package
```
```
# Add package (adds to pyproject.toml)uv add requests# Add with version constraintuv add "django>=4.0,<5.0"# Add multiple packagesuv add numpy pandas matplotlib# Add dev dependencyuv add --dev pytest pytest-cov# Add optional dependency groupuv add --optional docs sphinx# Add from gituv add git+https://github.com/user/repo.git# Add from git with specific refuv add git+https://github.com/user/repo.git@v1.0.0# Add from local pathuv add ./local-package# Add editable local packageuv add -e ./local-package
```
```
# Remove packageuv remove requests# Remove dev dependencyuv remove --dev pytest# Remove multiple packagesuv remove numpy pandas matplotlib
```
```
# Remove packageuv remove requests# Remove dev dependencyuv remove --dev pytest# Remove multiple packagesuv remove numpy pandas matplotlib
```
```
# Upgrade specific packageuv add --upgrade requests# Upgrade all packagesuv sync --upgrade# Upgrade package to latestuv add --upgrade requests# Show what would be upgradeduv tree --outdated
```
```
# Upgrade specific packageuv add --upgrade requests# Upgrade all packagesuv sync --upgrade# Upgrade package to latestuv add --upgrade requests# Show what would be upgradeduv tree --outdated
```
```
# Generate uv.lock fileuv lock# Update lock fileuv lock --upgrade# Lock without installinguv lock --no-install# Lock specific packageuv lock --upgrade-package requests
```
```
# Generate uv.lock fileuv lock# Update lock fileuv lock --upgrade# Lock without installinguv lock --no-install# Lock specific packageuv lock --upgrade-package requests
```
```
# Install Python versionuv python install 3.12# Install multiple versionsuv python install 3.11 3.12 3.13# Install latest versionuv python install# List installed versionsuv python list# Find available versionsuv python list --all-versions
```
```
# Install Python versionuv python install 3.12# Install multiple versionsuv python install 3.11 3.12 3.13# Install latest versionuv python install# List installed versionsuv python list# Find available versionsuv python list --all-versions
```
```
# Set Python version for projectuv python pin 3.12# This creates/updates .python-version file# Use specific Python version for commanduv --python 3.11 run python script.py# Create venv with specific versionuv venv --python 3.12
```
```
# Set Python version for projectuv python pin 3.12# This creates/updates .python-version file# Use specific Python version for commanduv --python 3.11 run python script.py# Create venv with specific versionuv venv --python 3.12
```
```
[project]name = "my-project"version = "0.1.0"description = "My awesome project"readme = "README.md"requires-python = ">=3.8"dependencies = [    "requests>=2.31.0",    "pydantic>=2.0.0",    "click>=8.1.0",][project.optional-dependencies]dev = [    "pytest>=7.4.0",    "pytest-cov>=4.1.0",    "black>=23.0.0",    "ruff>=0.1.0",    "mypy>=1.5.0",]docs = [    "sphinx>=7.0.0",    "sphinx-rtd-theme>=1.3.0",][build-system]requires = ["hatchling"]build-backend = "hatchling.build"[tool.uv]dev-dependencies = [    # Additional dev dependencies managed by uv][tool.uv.sources]# Custom package sourcesmy-package = { git = "https://github.com/user/repo.git" }
```
```
[project]name = "my-project"version = "0.1.0"description = "My awesome project"readme = "README.md"requires-python = ">=3.8"dependencies = [    "requests>=2.31.0",    "pydantic>=2.0.0",    "click>=8.1.0",][project.optional-dependencies]dev = [    "pytest>=7.4.0",    "pytest-cov>=4.1.0",    "black>=23.0.0",    "ruff>=0.1.0",    "mypy>=1.5.0",]docs = [    "sphinx>=7.0.0",    "sphinx-rtd-theme>=1.3.0",][build-system]requires = ["hatchling"]build-backend = "hatchling.build"[tool.uv]dev-dependencies = [    # Additional dev dependencies managed by uv][tool.uv.sources]# Custom package sourcesmy-package = { git = "https://github.com/user/repo.git" }
```
```
# Migrate from requirements.txtuv add -r requirements.txt# Migrate from poetry# Already have pyproject.toml, just use:uv sync# Export to requirements.txtuv pip freeze > requirements.txt# Export with hashesuv pip freeze --require-hashes > requirements.txt
```
```
# Migrate from requirements.txtuv add -r requirements.txt# Migrate from poetry# Already have pyproject.toml, just use:uv sync# Export to requirements.txtuv pip freeze > requirements.txt# Export with hashesuv pip freeze --require-hashes > requirements.txt
```
```
# Project structure# monorepo/#   packages/#     package-a/#       pyproject.toml#     package-b/#       pyproject.toml#   pyproject.toml (root)# Root pyproject.toml[tool.uv.workspace]members = ["packages/*"]# Install all workspace packagesuv sync# Add workspace dependencyuv add --path ./packages/package-a
```
```
# Project structure# monorepo/#   packages/#     package-a/#       pyproject.toml#     package-b/#       pyproject.toml#   pyproject.toml (root)# Root pyproject.toml[tool.uv.workspace]members = ["packages/*"]# Install all workspace packagesuv sync# Add workspace dependencyuv add --path ./packages/package-a
```
```
# .github/workflows/test.ymlname: Testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Install uv        uses: astral-sh/setup-uv@v2        with:          enable-cache: true      - name: Set up Python        run: uv python install 3.12      - name: Install dependencies        run: uv sync --all-extras --dev      - name: Run tests        run: uv run pytest      - name: Run linting        run: |          uv run ruff check .          uv run black --check .
```
```
# .github/workflows/test.ymlname: Testson: [push, pull_request]jobs:  test:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v4      - name: Install uv        uses: astral-sh/setup-uv@v2        with:          enable-cache: true      - name: Set up Python        run: uv python install 3.12      - name: Install dependencies        run: uv sync --all-extras --dev      - name: Run tests        run: uv run pytest      - name: Run linting        run: |          uv run ruff check .          uv run black --check .
```
```
# DockerfileFROM python:3.12-slim# Install uvCOPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv# Set working directoryWORKDIR /app# Copy dependency filesCOPY pyproject.toml uv.lock ./# Install dependenciesRUN uv sync --frozen --no-dev# Copy application codeCOPY . .# Run applicationCMD ["uv", "run", "python", "app.py"]
```
```
# DockerfileFROM python:3.12-slim# Install uvCOPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv# Set working directoryWORKDIR /app# Copy dependency filesCOPY pyproject.toml uv.lock ./# Install dependenciesRUN uv sync --frozen --no-dev# Copy application codeCOPY . .# Run applicationCMD ["uv", "run", "python", "app.py"]
```
```
# Multi-stage DockerfileFROM python:3.12-slim AS builder# Install uvCOPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uvWORKDIR /app# Install dependencies to venvCOPY pyproject.toml uv.lock ./RUN uv sync --frozen --no-dev --no-editable# Runtime stageFROM python:3.12-slimWORKDIR /app# Copy venv from builderCOPY --from=builder /app/.venv .venvCOPY . .# Use venvENV PATH="/app/.venv/bin:$PATH"CMD ["python", "app.py"]
```
```
# Multi-stage DockerfileFROM python:3.12-slim AS builder# Install uvCOPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uvWORKDIR /app# Install dependencies to venvCOPY pyproject.toml uv.lock ./RUN uv sync --frozen --no-dev --no-editable# Runtime stageFROM python:3.12-slimWORKDIR /app# Copy venv from builderCOPY --from=builder /app/.venv .venvCOPY . .# Use venvENV PATH="/app/.venv/bin:$PATH"CMD ["python", "app.py"]
```
```
# Create lockfile (uv.lock)uv lock# Install from lockfile (exact versions)uv sync --frozen# Update lockfile without installinguv lock --no-install# Upgrade specific package in lockuv lock --upgrade-package requests# Check if lockfile is up to dateuv lock --check# Export lockfile to requirements.txtuv export --format requirements-txt > requirements.txt# Export with hashes for securityuv export --format requirements-txt --hash > requirements.txt
```
```
# Create lockfile (uv.lock)uv lock# Install from lockfile (exact versions)uv sync --frozen# Update lockfile without installinguv lock --no-install# Upgrade specific package in lockuv lock --upgrade-package requests# Check if lockfile is up to dateuv lock --check# Export lockfile to requirements.txtuv export --format requirements-txt > requirements.txt# Export with hashes for securityuv export --format requirements-txt --hash > requirements.txt
```
```
# UV automatically uses global cache at:# Linux: ~/.cache/uv# macOS: ~/Library/Caches/uv# Windows: %LOCALAPPDATA%\uv\cache# Clear cacheuv cache clean# Check cache sizeuv cache dir
```
```
# UV automatically uses global cache at:# Linux: ~/.cache/uv# macOS: ~/Library/Caches/uv# Windows: %LOCALAPPDATA%\uv\cache# Clear cacheuv cache clean# Check cache sizeuv cache dir
```
```
# UV installs packages in parallel by default# Control parallelismuv pip install --jobs 4 package1 package2# No parallel (sequential)uv pip install --jobs 1 package
```
```
# UV installs packages in parallel by default# Control parallelismuv pip install --jobs 4 package1 package2# No parallel (sequential)uv pip install --jobs 1 package
```
```
# Install from cache only (no network)uv pip install --offline package# Sync from lockfile offlineuv sync --frozen --offline
```
```
# Install from cache only (no network)uv pip install --offline package# Sync from lockfile offlineuv sync --frozen --offline
```
```
# pippython -m venv .venvsource .venv/bin/activatepip install requests pandas numpy# ~30 seconds# uvuv venvuv add requests pandas numpy# ~2 seconds (10-15x faster)
```
```
# pippython -m venv .venvsource .venv/bin/activatepip install requests pandas numpy# ~30 seconds# uvuv venvuv add requests pandas numpy# ~2 seconds (10-15x faster)
```
```
# poetrypoetry initpoetry add requests pandaspoetry install# ~20 seconds# uvuv inituv add requests pandasuv sync# ~3 seconds (6-7x faster)
```
```
# poetrypoetry initpoetry add requests pandaspoetry install# ~20 seconds# uvuv inituv add requests pandasuv sync# ~3 seconds (6-7x faster)
```
```
# pip-toolspip-compile requirements.inpip-sync requirements.txt# ~15 seconds# uvuv lockuv sync --frozen# ~2 seconds (7-8x faster)
```
```
# pip-toolspip-compile requirements.inpip-sync requirements.txt# ~15 seconds# uvuv lockuv sync --frozen# ~2 seconds (7-8x faster)
```
```
# Complete workflowuv init my-projectcd my-project# Set Python versionuv python pin 3.12# Add dependenciesuv add fastapi uvicorn pydantic# Add dev dependenciesuv add --dev pytest black ruff mypy# Create structuremkdir -p src/my_project tests# Run testsuv run pytest# Format codeuv run black .uv run ruff check .
```
```
# Complete workflowuv init my-projectcd my-project# Set Python versionuv python pin 3.12# Add dependenciesuv add fastapi uvicorn pydantic# Add dev dependenciesuv add --dev pytest black ruff mypy# Create structuremkdir -p src/my_project tests# Run testsuv run pytest# Format codeuv run black .uv run ruff check .
```
```
# Clone repositorygit clone https://github.com/user/project.gitcd project# Install dependencies (creates venv automatically)uv sync# Install with dev dependenciesuv sync --all-extras# Update dependenciesuv lock --upgrade# Run applicationuv run python app.py# Run testsuv run pytest# Add new dependencyuv add new-package# Commit updated filesgit add pyproject.toml uv.lockgit commit -m "Add new-package dependency"
```
```
# Clone repositorygit clone https://github.com/user/project.gitcd project# Install dependencies (creates venv automatically)uv sync# Install with dev dependenciesuv sync --all-extras# Update dependenciesuv lock --upgrade# Run applicationuv run python app.py# Run testsuv run pytest# Add new dependencyuv add new-package# Commit updated filesgit add pyproject.toml uv.lockgit commit -m "Add new-package dependency"
```
```
# .pre-commit-config.yamlrepos:  - repo: local    hooks:      - id: uv-lock        name: uv lock        entry: uv lock        language: system        pass_filenames: false      - id: ruff        name: ruff        entry: uv run ruff check --fix        language: system        types: [python]      - id: black        name: black        entry: uv run black        language: system        types: [python]
```
```
# .pre-commit-config.yamlrepos:  - repo: local    hooks:      - id: uv-lock        name: uv lock        entry: uv lock        language: system        pass_filenames: false      - id: ruff        name: ruff        entry: uv run ruff check --fix        language: system        types: [python]      - id: black        name: black        entry: uv run black        language: system        types: [python]
```
```
// .vscode/settings.json{  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",  "python.terminal.activateEnvironment": true,  "python.testing.pytestEnabled": true,  "python.testing.pytestArgs": ["-v"],  "python.linting.enabled": true,  "python.formatting.provider": "black",  "[python]": {    "editor.defaultFormatter": "ms-python.black-formatter",    "editor.formatOnSave": true  }}
```
```
// .vscode/settings.json{  "python.defaultInterpreterPath": "${workspaceFolder}/.venv/bin/python",  "python.terminal.activateEnvironment": true,  "python.testing.pytestEnabled": true,  "python.testing.pytestArgs": ["-v"],  "python.linting.enabled": true,  "python.formatting.provider": "black",  "[python]": {    "editor.defaultFormatter": "ms-python.black-formatter",    "editor.formatOnSave": true  }}
```
```
# Issue: uv not found# Solution: Add to PATH or reinstallecho 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc# Issue: Wrong Python version# Solution: Pin version explicitlyuv python pin 3.12uv venv --python 3.12# Issue: Dependency conflict# Solution: Check resolutionuv lock --verbose# Issue: Cache issues# Solution: Clear cacheuv cache clean# Issue: Lockfile out of sync# Solution: Regenerateuv lock --upgrade
```
```
# Issue: uv not found# Solution: Add to PATH or reinstallecho 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc# Issue: Wrong Python version# Solution: Pin version explicitlyuv python pin 3.12uv venv --python 3.12# Issue: Dependency conflict# Solution: Check resolutionuv lock --verbose# Issue: Cache issues# Solution: Clear cacheuv cache clean# Issue: Lockfile out of sync# Solution: Regenerateuv lock --upgrade
```
```
# Use frozen installs in CIuv sync --frozen# Use offline mode when possibleuv sync --offline# Parallel operations (automatic)# uv does this by default# Reuse cache across environments# uv shares cache globally# Use lockfiles to skip resolutionuv sync --frozen  # skips resolution
```
```
# Use frozen installs in CIuv sync --frozen# Use offline mode when possibleuv sync --offline# Parallel operations (automatic)# uv does this by default# Reuse cache across environments# uv shares cache globally# Use lockfiles to skip resolutionuv sync --frozen  # skips resolution
```
```
# Beforepython -m venv .venvsource .venv/bin/activatepip install -r requirements.txt# Afteruv venvuv pip install -r requirements.txt# Or better:uv inituv add -r requirements.txt
```
```
# Beforepython -m venv .venvsource .venv/bin/activatepip install -r requirements.txt# Afteruv venvuv pip install -r requirements.txt# Or better:uv inituv add -r requirements.txt
```
```
# Beforepoetry installpoetry add requests# Afteruv syncuv add requests# Keep existing pyproject.toml# uv reads [project] and [tool.poetry] sections
```
```
# Beforepoetry installpoetry add requests# Afteruv syncuv add requests# Keep existing pyproject.toml# uv reads [project] and [tool.poetry] sections
```
```
# Beforepip-compile requirements.inpip-sync requirements.txt# Afteruv lockuv sync --frozen
```
```
# Beforepip-compile requirements.inpip-sync requirements.txt# Afteruv lockuv sync --frozen
```
```
# Project managementuv init [PATH]              # Initialize projectuv add PACKAGE              # Add dependencyuv remove PACKAGE           # Remove dependencyuv sync                     # Install dependenciesuv lock                     # Create/update lockfile# Virtual environmentsuv venv [PATH]              # Create venvuv run COMMAND              # Run in venv# Python managementuv python install VERSION   # Install Pythonuv python list              # List installed Pythonsuv python pin VERSION       # Pin Python version# Package installation (pip-compatible)uv pip install PACKAGE      # Install packageuv pip uninstall PACKAGE    # Uninstall packageuv pip freeze               # List installeduv pip list                 # List packages# Utilityuv cache clean              # Clear cacheuv cache dir                # Show cache locationuv --version                # Show version
```
```
# Project managementuv init [PATH]              # Initialize projectuv add PACKAGE              # Add dependencyuv remove PACKAGE           # Remove dependencyuv sync                     # Install dependenciesuv lock                     # Create/update lockfile# Virtual environmentsuv venv [PATH]              # Create venvuv run COMMAND              # Run in venv# Python managementuv python install VERSION   # Install Pythonuv python list              # List installed Pythonsuv python pin VERSION       # Pin Python version# Package installation (pip-compatible)uv pip install PACKAGE      # Install packageuv pip uninstall PACKAGE    # Uninstall packageuv pip freeze               # List installeduv pip list                 # List packages# Utilityuv cache clean              # Clear cacheuv cache dir                # Show cache locationuv --version                # Show version
```
```
uv init
```
Unlock unparalleled speed in your Python development with the uv-package-manager agent skill. This skill is engineered to empower developers with the full capabilities of uv, a cutting-edge package installer and resolver written in Rust. Say goodbye to slow dependency installations and complex virtual environment setups. By leveraging uv, you can significantly accelerate project initialization, streamline CI/CD pipelines, and ensure robust, reproducible builds. Dive into a modern approach to Python project management that prioritizes performance and efficiency, giving you more time to focus on coding innovation rather than dependency wrangling.

# When to Use This Skill
- •Setting up new Python projects quickly with optimized dependency resolution.
- •Migrating existing projects from pip, pip-tools, or poetry to leverage uv's speed.
- •Optimizing CI/CD pipelines for Python projects by dramatically reducing build times.
- •Managing complex monorepo Python projects with consistent lockfiles.

# Pro Tips
- 💡Always use a lockfile (`uv lock`) in your projects to ensure reproducible builds across all environments, especially in production or CI/CD.
- 💡Leverage `uv venv` for creating isolated virtual environments and `uv run` to execute commands within them, simplifying your workflow.
- 💡When migrating, start by using `uv sync` with your existing `requirements.txt` to quickly transition and see speed benefits without major changes.

