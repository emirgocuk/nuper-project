# python-packaging
Source: https://antigravity.codes/agent-skills/python/python-packaging

## AI Worker Instructions
When the user requests functionality related to python-packaging, follow these guidelines and utilize this context.

## Scraped Content

# python-packaging
```
src/package_name/
```
```
package_name/
```
```
my-package/├── pyproject.toml├── README.md├── LICENSE├── src/│   └── my_package/│       ├── __init__.py│       └── module.py└── tests/    └── test_module.py
```
```
my-package/├── pyproject.toml├── README.md├── LICENSE├── src/│   └── my_package/│       ├── __init__.py│       └── module.py└── tests/    └── test_module.py
```
```
[build-system]requires = ["setuptools>=61.0"]build-backend = "setuptools.build_meta"[project]name = "my-package"version = "0.1.0"description = "A short description"authors = [{name = "Your Name", email = "you@example.com"}]readme = "README.md"requires-python = ">=3.8"dependencies = [    "requests>=2.28.0",][project.optional-dependencies]dev = [    "pytest>=7.0",    "black>=22.0",]
```
```
[build-system]requires = ["setuptools>=61.0"]build-backend = "setuptools.build_meta"[project]name = "my-package"version = "0.1.0"description = "A short description"authors = [{name = "Your Name", email = "you@example.com"}]readme = "README.md"requires-python = ">=3.8"dependencies = [    "requests>=2.28.0",][project.optional-dependencies]dev = [    "pytest>=7.0",    "black>=22.0",]
```
```
my-package/├── pyproject.toml├── README.md├── LICENSE├── .gitignore├── src/│   └── my_package/│       ├── __init__.py│       ├── core.py│       ├── utils.py│       └── py.typed          # For type hints├── tests/│   ├── __init__.py│   ├── test_core.py│   └── test_utils.py└── docs/    └── index.md
```
```
my-package/├── pyproject.toml├── README.md├── LICENSE├── .gitignore├── src/│   └── my_package/│       ├── __init__.py│       ├── core.py│       ├── utils.py│       └── py.typed          # For type hints├── tests/│   ├── __init__.py│   ├── test_core.py│   └── test_utils.py└── docs/    └── index.md
```
```
[tool.setuptools.packages.find]where = ["src"]
```
```
[tool.setuptools.packages.find]where = ["src"]
```
```
my-package/├── pyproject.toml├── README.md├── my_package/│   ├── __init__.py│   └── module.py└── tests/    └── test_module.py
```
```
my-package/├── pyproject.toml├── README.md├── my_package/│   ├── __init__.py│   └── module.py└── tests/    └── test_module.py
```
```
project/├── pyproject.toml├── packages/│   ├── package-a/│   │   └── src/│   │       └── package_a/│   └── package-b/│       └── src/│           └── package_b/└── tests/
```
```
project/├── pyproject.toml├── packages/│   ├── package-a/│   │   └── src/│   │       └── package_a/│   └── package-b/│       └── src/│           └── package_b/└── tests/
```
```
[build-system]requires = ["setuptools>=61.0", "wheel"]build-backend = "setuptools.build_meta"[project]name = "my-awesome-package"version = "1.0.0"description = "An awesome Python package"readme = "README.md"requires-python = ">=3.8"license = {text = "MIT"}authors = [    {name = "Your Name", email = "you@example.com"},]maintainers = [    {name = "Maintainer Name", email = "maintainer@example.com"},]keywords = ["example", "package", "awesome"]classifiers = [    "Development Status :: 4 - Beta",    "Intended Audience :: Developers",    "License :: OSI Approved :: MIT License",    "Programming Language :: Python :: 3",    "Programming Language :: Python :: 3.8",    "Programming Language :: Python :: 3.9",    "Programming Language :: Python :: 3.10",    "Programming Language :: Python :: 3.11",    "Programming Language :: Python :: 3.12",]dependencies = [    "requests>=2.28.0,<3.0.0",    "click>=8.0.0",    "pydantic>=2.0.0",][project.optional-dependencies]dev = [    "pytest>=7.0.0",    "pytest-cov>=4.0.0",    "black>=23.0.0",    "ruff>=0.1.0",    "mypy>=1.0.0",]docs = [    "sphinx>=5.0.0",    "sphinx-rtd-theme>=1.0.0",]all = [    "my-awesome-package[dev,docs]",][project.urls]Homepage = "https://github.com/username/my-awesome-package"Documentation = "https://my-awesome-package.readthedocs.io"Repository = "https://github.com/username/my-awesome-package""Bug Tracker" = "https://github.com/username/my-awesome-package/issues"Changelog = "https://github.com/username/my-awesome-package/blob/main/CHANGELOG.md"[project.scripts]my-cli = "my_package.cli:main"awesome-tool = "my_package.tools:run"[project.entry-points."my_package.plugins"]plugin1 = "my_package.plugins:plugin1"[tool.setuptools]package-dir = {"" = "src"}zip-safe = false[tool.setuptools.packages.find]where = ["src"]include = ["my_package*"]exclude = ["tests*"][tool.setuptools.package-data]my_package = ["py.typed", "*.pyi", "data/*.json"]# Black configuration[tool.black]line-length = 100target-version = ["py38", "py39", "py310", "py311"]include = '\.pyi?$'# Ruff configuration[tool.ruff]line-length = 100target-version = "py38"[tool.ruff.lint]select = ["E", "F", "I", "N", "W", "UP"]# MyPy configuration[tool.mypy]python_version = "3.8"warn_return_any = truewarn_unused_configs = truedisallow_untyped_defs = true# Pytest configuration[tool.pytest.ini_options]testpaths = ["tests"]python_files = ["test_*.py"]addopts = "-v --cov=my_package --cov-report=term-missing"# Coverage configuration[tool.coverage.run]source = ["src"]omit = ["*/tests/*"][tool.coverage.report]exclude_lines = [    "pragma: no cover",    "def __repr__",    "raise AssertionError",    "raise NotImplementedError",]
```
```
[build-system]requires = ["setuptools>=61.0", "wheel"]build-backend = "setuptools.build_meta"[project]name = "my-awesome-package"version = "1.0.0"description = "An awesome Python package"readme = "README.md"requires-python = ">=3.8"license = {text = "MIT"}authors = [    {name = "Your Name", email = "you@example.com"},]maintainers = [    {name = "Maintainer Name", email = "maintainer@example.com"},]keywords = ["example", "package", "awesome"]classifiers = [    "Development Status :: 4 - Beta",    "Intended Audience :: Developers",    "License :: OSI Approved :: MIT License",    "Programming Language :: Python :: 3",    "Programming Language :: Python :: 3.8",    "Programming Language :: Python :: 3.9",    "Programming Language :: Python :: 3.10",    "Programming Language :: Python :: 3.11",    "Programming Language :: Python :: 3.12",]dependencies = [    "requests>=2.28.0,<3.0.0",    "click>=8.0.0",    "pydantic>=2.0.0",][project.optional-dependencies]dev = [    "pytest>=7.0.0",    "pytest-cov>=4.0.0",    "black>=23.0.0",    "ruff>=0.1.0",    "mypy>=1.0.0",]docs = [    "sphinx>=5.0.0",    "sphinx-rtd-theme>=1.0.0",]all = [    "my-awesome-package[dev,docs]",][project.urls]Homepage = "https://github.com/username/my-awesome-package"Documentation = "https://my-awesome-package.readthedocs.io"Repository = "https://github.com/username/my-awesome-package""Bug Tracker" = "https://github.com/username/my-awesome-package/issues"Changelog = "https://github.com/username/my-awesome-package/blob/main/CHANGELOG.md"[project.scripts]my-cli = "my_package.cli:main"awesome-tool = "my_package.tools:run"[project.entry-points."my_package.plugins"]plugin1 = "my_package.plugins:plugin1"[tool.setuptools]package-dir = {"" = "src"}zip-safe = false[tool.setuptools.packages.find]where = ["src"]include = ["my_package*"]exclude = ["tests*"][tool.setuptools.package-data]my_package = ["py.typed", "*.pyi", "data/*.json"]# Black configuration[tool.black]line-length = 100target-version = ["py38", "py39", "py310", "py311"]include = '\.pyi?$'# Ruff configuration[tool.ruff]line-length = 100target-version = "py38"[tool.ruff.lint]select = ["E", "F", "I", "N", "W", "UP"]# MyPy configuration[tool.mypy]python_version = "3.8"warn_return_any = truewarn_unused_configs = truedisallow_untyped_defs = true# Pytest configuration[tool.pytest.ini_options]testpaths = ["tests"]python_files = ["test_*.py"]addopts = "-v --cov=my_package --cov-report=term-missing"# Coverage configuration[tool.coverage.run]source = ["src"]omit = ["*/tests/*"][tool.coverage.report]exclude_lines = [    "pragma: no cover",    "def __repr__",    "raise AssertionError",    "raise NotImplementedError",]
```
```
[build-system]requires = ["setuptools>=61.0", "setuptools-scm>=8.0"]build-backend = "setuptools.build_meta"[project]name = "my-package"dynamic = ["version"]description = "Package with dynamic version"[tool.setuptools.dynamic]version = {attr = "my_package.__version__"}# Or use setuptools-scm for git-based versioning[tool.setuptools_scm]write_to = "src/my_package/_version.py"
```
```
[build-system]requires = ["setuptools>=61.0", "setuptools-scm>=8.0"]build-backend = "setuptools.build_meta"[project]name = "my-package"dynamic = ["version"]description = "Package with dynamic version"[tool.setuptools.dynamic]version = {attr = "my_package.__version__"}# Or use setuptools-scm for git-based versioning[tool.setuptools_scm]write_to = "src/my_package/_version.py"
```
```
# src/my_package/__init__.py__version__ = "1.0.0"# Or with setuptools-scmfrom importlib.metadata import version__version__ = version("my-package")
```
```
# src/my_package/__init__.py__version__ = "1.0.0"# Or with setuptools-scmfrom importlib.metadata import version__version__ = version("my-package")
```
```
# src/my_package/cli.pyimport click@click.group()@click.version_option()def cli():    """My awesome CLI tool."""    pass@cli.command()@click.argument("name")@click.option("--greeting", default="Hello", help="Greeting to use")def greet(name: str, greeting: str):    """Greet someone."""    click.echo(f"{greeting}, {name}!")@cli.command()@click.option("--count", default=1, help="Number of times to repeat")def repeat(count: int):    """Repeat a message."""    for i in range(count):        click.echo(f"Message {i + 1}")def main():    """Entry point for CLI."""    cli()if __name__ == "__main__":    main()
```
```
# src/my_package/cli.pyimport click@click.group()@click.version_option()def cli():    """My awesome CLI tool."""    pass@cli.command()@click.argument("name")@click.option("--greeting", default="Hello", help="Greeting to use")def greet(name: str, greeting: str):    """Greet someone."""    click.echo(f"{greeting}, {name}!")@cli.command()@click.option("--count", default=1, help="Number of times to repeat")def repeat(count: int):    """Repeat a message."""    for i in range(count):        click.echo(f"Message {i + 1}")def main():    """Entry point for CLI."""    cli()if __name__ == "__main__":    main()
```
```
[project.scripts]my-tool = "my_package.cli:main"
```
```
[project.scripts]my-tool = "my_package.cli:main"
```
```
pip install -e .my-tool greet Worldmy-tool greet Alice --greeting="Hi"my-tool repeat --count=3
```
```
pip install -e .my-tool greet Worldmy-tool greet Alice --greeting="Hi"my-tool repeat --count=3
```
```
# src/my_package/cli.pyimport argparseimport sysdef main():    """Main CLI entry point."""    parser = argparse.ArgumentParser(        description="My awesome tool",        prog="my-tool"    )    parser.add_argument(        "--version",        action="version",        version="%(prog)s 1.0.0"    )    subparsers = parser.add_subparsers(dest="command", help="Commands")    # Add subcommand    process_parser = subparsers.add_parser("process", help="Process data")    process_parser.add_argument("input_file", help="Input file path")    process_parser.add_argument(        "--output", "-o",        default="output.txt",        help="Output file path"    )    args = parser.parse_args()    if args.command == "process":        process_data(args.input_file, args.output)    else:        parser.print_help()        sys.exit(1)def process_data(input_file: str, output_file: str):    """Process data from input to output."""    print(f"Processing {input_file} -> {output_file}")if __name__ == "__main__":    main()
```
```
# src/my_package/cli.pyimport argparseimport sysdef main():    """Main CLI entry point."""    parser = argparse.ArgumentParser(        description="My awesome tool",        prog="my-tool"    )    parser.add_argument(        "--version",        action="version",        version="%(prog)s 1.0.0"    )    subparsers = parser.add_subparsers(dest="command", help="Commands")    # Add subcommand    process_parser = subparsers.add_parser("process", help="Process data")    process_parser.add_argument("input_file", help="Input file path")    process_parser.add_argument(        "--output", "-o",        default="output.txt",        help="Output file path"    )    args = parser.parse_args()    if args.command == "process":        process_data(args.input_file, args.output)    else:        parser.print_help()        sys.exit(1)def process_data(input_file: str, output_file: str):    """Process data from input to output."""    print(f"Processing {input_file} -> {output_file}")if __name__ == "__main__":    main()
```
```
# Install build toolspip install build twine# Build distributionpython -m build# This creates:# dist/#   my-package-1.0.0.tar.gz (source distribution)#   my_package-1.0.0-py3-none-any.whl (wheel)# Check the distributiontwine check dist/*
```
```
# Install build toolspip install build twine# Build distributionpython -m build# This creates:# dist/#   my-package-1.0.0.tar.gz (source distribution)#   my_package-1.0.0-py3-none-any.whl (wheel)# Check the distributiontwine check dist/*
```
```
# Install publishing toolspip install twine# Test on TestPyPI firsttwine upload --repository testpypi dist/*# Install from TestPyPI to testpip install --index-url https://test.pypi.org/simple/ my-package# If all good, publish to PyPItwine upload dist/*
```
```
# Install publishing toolspip install twine# Test on TestPyPI firsttwine upload --repository testpypi dist/*# Install from TestPyPI to testpip install --index-url https://test.pypi.org/simple/ my-package# If all good, publish to PyPItwine upload dist/*
```
```
# Create ~/.pypirc[distutils]index-servers =    pypi    testpypi[pypi]username = __token__password = pypi-...your-token...[testpypi]username = __token__password = pypi-...your-test-token...
```
```
# Create ~/.pypirc[distutils]index-servers =    pypi    testpypi[pypi]username = __token__password = pypi-...your-token...[testpypi]username = __token__password = pypi-...your-test-token...
```
```
# .github/workflows/publish.ymlname: Publish to PyPIon:  release:    types: [created]jobs:  publish:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Set up Python        uses: actions/setup-python@v4        with:          python-version: "3.11"      - name: Install dependencies        run: |          pip install build twine      - name: Build package        run: python -m build      - name: Check package        run: twine check dist/*      - name: Publish to PyPI        env:          TWINE_USERNAME: __token__          TWINE_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}        run: twine upload dist/*
```
```
# .github/workflows/publish.ymlname: Publish to PyPIon:  release:    types: [created]jobs:  publish:    runs-on: ubuntu-latest    steps:      - uses: actions/checkout@v3      - name: Set up Python        uses: actions/setup-python@v4        with:          python-version: "3.11"      - name: Install dependencies        run: |          pip install build twine      - name: Build package        run: python -m build      - name: Check package        run: twine check dist/*      - name: Publish to PyPI        env:          TWINE_USERNAME: __token__          TWINE_PASSWORD: ${{ secrets.PYPI_API_TOKEN }}        run: twine upload dist/*
```
```
[tool.setuptools.package-data]my_package = [    "data/*.json",    "templates/*.html",    "static/css/*.css",    "py.typed",]
```
```
[tool.setuptools.package-data]my_package = [    "data/*.json",    "templates/*.html",    "static/css/*.css",    "py.typed",]
```
```
# src/my_package/loader.pyfrom importlib.resources import filesimport jsondef load_config():    """Load configuration from package data."""    config_file = files("my_package").joinpath("data/config.json")    with config_file.open() as f:        return json.load(f)# Python 3.9+from importlib.resources import filesdata = files("my_package").joinpath("data/file.txt").read_text()
```
```
# src/my_package/loader.pyfrom importlib.resources import filesimport jsondef load_config():    """Load configuration from package data."""    config_file = files("my_package").joinpath("data/config.json")    with config_file.open() as f:        return json.load(f)# Python 3.9+from importlib.resources import filesdata = files("my_package").joinpath("data/file.txt").read_text()
```
```
# Package 1: company-corecompany/└── core/    ├── __init__.py    └── models.py# Package 2: company-apicompany/└── api/    ├── __init__.py    └── routes.py
```
```
# Package 1: company-corecompany/└── core/    ├── __init__.py    └── models.py# Package 2: company-apicompany/└── api/    ├── __init__.py    └── routes.py
```
```
# company-core/pyproject.toml[project]name = "company-core"[tool.setuptools.packages.find]where = ["."]include = ["company.core*"]# company-api/pyproject.toml[project]name = "company-api"[tool.setuptools.packages.find]where = ["."]include = ["company.api*"]
```
```
# company-core/pyproject.toml[project]name = "company-core"[tool.setuptools.packages.find]where = ["."]include = ["company.core*"]# company-api/pyproject.toml[project]name = "company-api"[tool.setuptools.packages.find]where = ["."]include = ["company.api*"]
```
```
# Both packages can be imported under same namespacefrom company.core import modelsfrom company.api import routes
```
```
# Both packages can be imported under same namespacefrom company.core import modelsfrom company.api import routes
```
```
[build-system]requires = ["setuptools>=61.0", "wheel", "Cython>=0.29"]build-backend = "setuptools.build_meta"[tool.setuptools]ext-modules = [    {name = "my_package.fast_module", sources = ["src/fast_module.c"]},]
```
```
[build-system]requires = ["setuptools>=61.0", "wheel", "Cython>=0.29"]build-backend = "setuptools.build_meta"[tool.setuptools]ext-modules = [    {name = "my_package.fast_module", sources = ["src/fast_module.c"]},]
```
```
# setup.pyfrom setuptools import setup, Extensionsetup(    ext_modules=[        Extension(            "my_package.fast_module",            sources=["src/fast_module.c"],            include_dirs=["src/include"],        )    ])
```
```
# setup.pyfrom setuptools import setup, Extensionsetup(    ext_modules=[        Extension(            "my_package.fast_module",            sources=["src/fast_module.c"],            include_dirs=["src/include"],        )    ])
```
```
# src/my_package/__init__.py__version__ = "1.2.3"# Semantic versioning: MAJOR.MINOR.PATCH# MAJOR: Breaking changes# MINOR: New features (backward compatible)# PATCH: Bug fixes
```
```
# src/my_package/__init__.py__version__ = "1.2.3"# Semantic versioning: MAJOR.MINOR.PATCH# MAJOR: Breaking changes# MINOR: New features (backward compatible)# PATCH: Bug fixes
```
```
dependencies = [    "requests>=2.28.0,<3.0.0",  # Compatible range    "click~=8.1.0",              # Compatible release (~= 8.1.0 means >=8.1.0,<8.2.0)    "pydantic>=2.0",             # Minimum version    "numpy==1.24.3",             # Exact version (avoid if possible)]
```
```
dependencies = [    "requests>=2.28.0,<3.0.0",  # Compatible range    "click~=8.1.0",              # Compatible release (~= 8.1.0 means >=8.1.0,<8.2.0)    "pydantic>=2.0",             # Minimum version    "numpy==1.24.3",             # Exact version (avoid if possible)]
```
```
[build-system]requires = ["setuptools>=61.0", "setuptools-scm>=8.0"]build-backend = "setuptools.build_meta"[project]name = "my-package"dynamic = ["version"][tool.setuptools_scm]write_to = "src/my_package/_version.py"version_scheme = "post-release"local_scheme = "dirty-tag"
```
```
[build-system]requires = ["setuptools>=61.0", "setuptools-scm>=8.0"]build-backend = "setuptools.build_meta"[project]name = "my-package"dynamic = ["version"][tool.setuptools_scm]write_to = "src/my_package/_version.py"version_scheme = "post-release"local_scheme = "dirty-tag"
```
```
1.0.0
```
```
1.0.1.dev3+g1234567
```
```
# Install in development modepip install -e .# With optional dependenciespip install -e ".[dev]"pip install -e ".[dev,docs]"# Now changes to source code are immediately reflected
```
```
# Install in development modepip install -e .# With optional dependenciespip install -e ".[dev]"pip install -e ".[dev,docs]"# Now changes to source code are immediately reflected
```
```
# Create virtual environmentpython -m venv test-envsource test-env/bin/activate  # Linux/Mac# test-env\Scripts\activate  # Windows# Install packagepip install dist/my_package-1.0.0-py3-none-any.whl# Test it workspython -c "import my_package; print(my_package.__version__)"# Test CLImy-tool --help# Cleanupdeactivaterm -rf test-env
```
```
# Create virtual environmentpython -m venv test-envsource test-env/bin/activate  # Linux/Mac# test-env\Scripts\activate  # Windows# Install packagepip install dist/my_package-1.0.0-py3-none-any.whl# Test it workspython -c "import my_package; print(my_package.__version__)"# Test CLImy-tool --help# Cleanupdeactivaterm -rf test-env
```
```
# My Package[![PyPI version](https://badge.fury.io/py/my-package.svg)](https://pypi.org/project/my-package/)[![Python versions](https://img.shields.io/pypi/pyversions/my-package.svg)](https://pypi.org/project/my-package/)[![Tests](https://github.com/username/my-package/workflows/Tests/badge.svg)](https://github.com/username/my-package/actions)Brief description of your package.## Installationbashpip install my-package
```
```
# My Package[![PyPI version](https://badge.fury.io/py/my-package.svg)](https://pypi.org/project/my-package/)[![Python versions](https://img.shields.io/pypi/pyversions/my-package.svg)](https://pypi.org/project/my-package/)[![Tests](https://github.com/username/my-package/workflows/Tests/badge.svg)](https://github.com/username/my-package/actions)Brief description of your package.## Installation
```
```
# My Package[![PyPI version](https://badge.fury.io/py/my-package.svg)](https://pypi.org/project/my-package/)[![Python versions](https://img.shields.io/pypi/pyversions/my-package.svg)](https://pypi.org/project/my-package/)[![Tests](https://github.com/username/my-package/workflows/Tests/badge.svg)](https://github.com/username/my-package/actions)Brief description of your package.## Installation
```
```

```
```

```
```
from my_package import somethingresult = something.do_stuff()
```
```
from my_package import somethingresult = something.do_stuff()
```
```
git clone https://github.com/username/my-package.gitcd my-packagepip install -e ".[dev]"pytest
```
```
git clone https://github.com/username/my-package.gitcd my-packagepip install -e ".[dev]"pytest
```
```
## Common Patterns### Pattern 19: Multi-Architecture Wheelsyaml# .github/workflows/wheels.ymlname: Build wheelson: [push, pull_request]jobs:  build_wheels:    name: Build wheels on ${{ matrix.os }}    runs-on: ${{ matrix.os }}    strategy:      matrix:        os: [ubuntu-latest, windows-latest, macos-latest]    steps:      - uses: actions/checkout@v3      - name: Build wheels        uses: pypa/cibuildwheel@v2.16.2      - uses: actions/upload-artifact@v3        with:          path: ./wheelhouse/*.whl
```
```
## Common Patterns### Pattern 19: Multi-Architecture Wheels
```
```
## Common Patterns### Pattern 19: Multi-Architecture Wheels
```
```
### Pattern 20: Private Package Index
```
```
### Pattern 20: Private Package Index
```
```
## File Templates### .gitignore for Python Packages
```
```
## File Templates### .gitignore for Python Packages
```
```
### MANIFEST.in
```
```
### MANIFEST.in
```
Crafting robust and distributable Python code is essential for sharing your work effectively, whether with a team or the global open-source community. This skill empowers AI agents to navigate the complexities of Python packaging, ensuring your projects are properly structured, easy to install, and ready for publication. By leveraging modern tools and best practices, it streamlines the process of transforming raw code into professional, installable packages, reducing friction in development and deployment workflows for any Python-based project.

# When to Use This Skill
- •Distributing a new Python library to PyPI for public consumption.
- •Creating a standalone command-line interface (CLI) tool with proper entry points.
- •Setting up a new Python project with a standard, maintainable structure.
- •Bundling internal Python utilities for easy installation across an organization.

# Pro Tips
- 💡Always use the `src/` directory layout for your package source code to prevent common packaging pitfalls.
- 💡Automate your package publishing process using CI/CD pipelines (e.g., GitHub Actions) to ensure consistent releases.
- 💡Embrace `pyproject.toml` as your single source of truth for project metadata and build configuration for modern tooling.

