# macos-spm-app-packaging
Source: https://antigravity.codes/agent-skills/mobile/macos-spm-app-packaging

## AI Worker Instructions
When the user requests functionality related to macos-spm-app-packaging, follow these guidelines and utilize this context.

## Scraped Content

# macos-spm-app-packaging
```
assets/templates/bootstrap/
```
```
references/packaging.md
```
```
references/release.md
```
```
assets/templates/bootstrap/
```
```
MyApp
```
```
Package.swift
```
```
Sources/MyApp/
```
```
version.env
```
```
APP_NAME
```
```
BUNDLE_ID
```
```
assets/templates/
```
```
Scripts/
```
```
swift build
```
```
swift test
```
```
Scripts/package_app.sh
```
```
Scripts/compile_and_run.sh
```
```
Scripts/launch.sh
```
```
Scripts/sign-and-notarize.sh
```
```
Scripts/make_appcast.sh
```
```
assets/templates/package_app.sh
```
```
assets/templates/compile_and_run.sh
```
```
assets/templates/build_icon.sh
```
```
assets/templates/sign-and-notarize.sh
```
```
assets/templates/make_appcast.sh
```
```
assets/templates/setup_dev_signing.sh
```
```
assets/templates/launch.sh
```
```
assets/templates/version.env
```
```
assets/templates/bootstrap/
```
```
CFBundleVersion
```
```
BUILD_NUMBER
```
```
version.env
```
```
MENU_BAR_APP=1
```
```
LSUIElement
```
Dive into the world of macOS application development without the heavy reliance on Xcode projects. This skill empowers you to rapidly set up, build, and package your SwiftPM-based macOS applications, offering a streamlined path from source code to a fully signed and notarized `.app` bundle. It’s ideal for developers seeking more control over their build process, integrating custom scripting, or working within a CI/CD environment where a lean, command-line-driven approach is paramount. Unlock efficient macOS app creation with precision and flexibility.

# When to Use This Skill
- •Automating macOS app builds and packaging in a CI/CD pipeline.
- •Creating lightweight macOS utilities with SwiftPM that don't require a full Xcode project.
- •Developers needing to customize the `.app` bundle structure or add pre/post-build scripts.
- •Independent developers looking for a simplified release process for macOS apps, including signing and notarization.

# Pro Tips
- 💡Integrate `version.env` with your CI/CD system to automatically increment build numbers for each release.
- 💡Utilize environment variables within your packaging scripts to easily switch between development and production signing identities.
- 💡Consider wrapping the packaging and notarization scripts in a single Makefile or Fastlane lane for a more cohesive release workflow.

