# expo-deployment
Source: https://antigravity.codes/agent-skills/expo/expo-deployment

## AI Worker Instructions
When the user requests functionality related to expo-deployment, follow these guidelines and utilize this context.

## Scraped Content

# expo-deployment
```
npm install -g eas-clieas login
```
```
npm install -g eas-clieas login
```
```
npx eas-cli@latest init
```
```
npx eas-cli@latest init
```
```
eas.json
```
```
# iOS App Store buildnpx eas-cli@latest build -p ios --profile production# Android Play Store buildnpx eas-cli@latest build -p android --profile production# Both platformsnpx eas-cli@latest build --profile production
```
```
# iOS App Store buildnpx eas-cli@latest build -p ios --profile production# Android Play Store buildnpx eas-cli@latest build -p android --profile production# Both platformsnpx eas-cli@latest build --profile production
```
```
# iOS: Build and submit to App Store Connectnpx eas-cli@latest build -p ios --profile production --submit# Android: Build and submit to Play Storenpx eas-cli@latest build -p android --profile production --submit# Shortcut for iOS TestFlightnpx testflight
```
```
# iOS: Build and submit to App Store Connectnpx eas-cli@latest build -p ios --profile production --submit# Android: Build and submit to Play Storenpx eas-cli@latest build -p android --profile production --submit# Shortcut for iOS TestFlightnpx testflight
```
```
# Deploy to productionnpx expo export -p webnpx eas-cli@latest deploy --prod# Deploy PR previewnpx eas-cli@latest deploy
```
```
# Deploy to productionnpx expo export -p webnpx eas-cli@latest deploy --prod# Deploy PR previewnpx eas-cli@latest deploy
```
```
eas.json
```
```
{  "cli": {    "version": ">= 16.0.1",    "appVersionSource": "remote"  },  "build": {    "production": {      "autoIncrement": true,      "ios": {        "resourceClass": "m-medium"      }    },    "development": {      "developmentClient": true,      "distribution": "internal"    }  },  "submit": {    "production": {      "ios": {        "appleId": "your@email.com",        "ascAppId": "1234567890"      },      "android": {        "serviceAccountKeyPath": "./google-service-account.json",        "track": "internal"      }    }  }}
```
```
{  "cli": {    "version": ">= 16.0.1",    "appVersionSource": "remote"  },  "build": {    "production": {      "autoIncrement": true,      "ios": {        "resourceClass": "m-medium"      }    },    "development": {      "developmentClient": true,      "distribution": "internal"    }  },  "submit": {    "production": {      "ios": {        "appleId": "your@email.com",        "ascAppId": "1234567890"      },      "android": {        "serviceAccountKeyPath": "./google-service-account.json",        "track": "internal"      }    }  }}
```
```
npx testflight
```
```
eas credentials
```
```
# .eas/workflows/release.ymlname: Releaseon:  push:    branches: [main]jobs:  build-ios:    type: build    params:      platform: ios      profile: production  submit-ios:    type: submit    needs: [build-ios]    params:      platform: ios      profile: production
```
```
# .eas/workflows/release.ymlname: Releaseon:  push:    branches: [main]jobs:  build-ios:    type: build    params:      platform: ios      profile: production  submit-ios:    type: submit    needs: [build-ios]    params:      platform: ios      profile: production
```
```
appVersionSource: "remote"
```
```
# Check current versionseas build:version:get# Manually set versioneas build:version:set -p ios --build-number 42
```
```
# Check current versionseas build:version:get# Manually set versioneas build:version:set -p ios --build-number 42
```
```
# List recent buildseas build:list# Check build statuseas build:view# View submission statuseas submit:list
```
```
# List recent buildseas build:list# Check build statuseas build:view# View submission statuseas submit:list
```
This skill empowers AI coding assistants like Claude Code to navigate the complex world of deploying Expo applications effortlessly. From initial setup with EAS CLI to submitting your production builds to the iOS App Store and Google Play Store, it provides a comprehensive guide. Developers can leverage this expertise to streamline their CI/CD workflows, manage app store metadata, and ensure their cross-platform projects reach users efficiently across mobile and web environments. It simplifies tasks that often involve multiple steps and platform-specific nuances, making the deployment process more accessible and less error-prone.

# When to Use This Skill
- •Automating the entire app deployment pipeline for Expo projects to various platforms.
- •Submitting new versions of an Expo app to the Apple App Store or Google Play Store.
- •Configuring and running EAS builds for iOS, Android, or web, including production and preview builds.
- •Setting up CI/CD workflows for continuous deployment and PR previews using Expo Application Services.

# Pro Tips
- 💡Always use `eas.json` for managing build profiles and ensure environment variables are securely handled, avoiding hardcoded secrets.
- 💡Integrate EAS with your CI/CD system (e.g., GitHub Actions) to automate builds and submissions on every push to your main branch.
- 💡Utilize TestFlight extensively for iOS beta testing before final App Store submission to catch issues early and streamline the review process.

