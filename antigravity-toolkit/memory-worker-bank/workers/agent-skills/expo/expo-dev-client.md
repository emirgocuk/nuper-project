# expo-dev-client
Source: https://antigravity.codes/agent-skills/expo/expo-dev-client

## AI Worker Instructions
When the user requests functionality related to expo-dev-client, follow these guidelines and utilize this context.

## Scraped Content

# expo-dev-client
```
npx expo start
```
```
eas.json
```
```
{  "cli": {    "version": ">= 16.0.1",    "appVersionSource": "remote"  },  "build": {    "production": {      "autoIncrement": true    },    "development": {      "autoIncrement": true,      "developmentClient": true    }  },  "submit": {    "production": {},    "development": {}  }}
```
```
{  "cli": {    "version": ">= 16.0.1",    "appVersionSource": "remote"  },  "build": {    "production": {      "autoIncrement": true    },    "development": {      "autoIncrement": true,      "developmentClient": true    }  },  "submit": {    "production": {},    "development": {}  }}
```
```
developmentClient: true
```
```
autoIncrement: true
```
```
appVersionSource: "remote"
```
```
eas build -p ios --profile development --submit
```
```
eas build -p ios --profile development --submit
```
```
# iOS (requires Xcode)eas build -p ios --profile development --local# Androideas build -p android --profile development --local
```
```
# iOS (requires Xcode)eas build -p ios --profile development --local# Androideas build -p android --profile development --local
```
```
.ipa
```
```
.apk
```
```
.aab
```
```
# Find the .app in the .tar.gz outputtar -xzf build-*.tar.gzxcrun simctl install booted ./path/to/App.app
```
```
# Find the .app in the .tar.gz outputtar -xzf build-*.tar.gzxcrun simctl install booted ./path/to/App.app
```
```
# Use Xcode Devices window or ideviceinstallerideviceinstaller -i build.ipa
```
```
# Use Xcode Devices window or ideviceinstallerideviceinstaller -i build.ipa
```
```
adb install build.apk
```
```
adb install build.apk
```
```
# iOS onlyeas build -p ios --profile development# Android onlyeas build -p android --profile development# Both platformseas build --profile development
```
```
# iOS onlyeas build -p ios --profile development# Android onlyeas build -p android --profile development# Both platformseas build --profile development
```
```
# List recent buildseas build:list# View build detailseas build:view
```
```
# List recent buildseas build:list# View build detailseas build:view
```
```
# Start Metro bundlernpx expo start --dev-client# Scan QR code with dev client or enter URL manually
```
```
# Start Metro bundlernpx expo start --dev-client# Scan QR code with dev client or enter URL manually
```
```
eas credentials
```
```
eas credentials
```
```
eas build -p ios --profile development --clear-cache
```
```
eas build -p ios --profile development --clear-cache
```
```
eas --versioneas update
```
```
eas --versioneas update
```
This skill empowers AI agents to guide developers through the intricate process of setting up and utilizing Expo development clients. Moving beyond standard Expo Go, it's crucial for projects incorporating custom native modules or advanced platform features like Apple widgets. The agent assists in configuring `eas.json` for development builds, ensuring correct bundling of `expo-dev-client` for seamless local testing and distribution via TestFlight. This expertise is invaluable for teams pushing the boundaries of what's possible with Expo, enabling robust testing of native code interactions before production deployment.

# When to Use This Skill
- •Testing a newly developed custom native module for an Expo app on a physical device.
- •Developing an iOS app that includes Apple Watch complications or an iMessage extension using Expo.
- •Creating a specific version of Expo Go with pre-installed third-party native modules for a project.
- •Distributing a development build of an Expo app to internal testers via TestFlight for native feature testing.

# Pro Tips
- 💡Always start with `npx expo start` in Expo Go; only create a dev client if native features explicitly fail or are required.
- 💡Utilize `eas build --profile development --platform ios` (or `android`) to ensure your `eas.json` configuration is correctly applied and the development client is built with the right settings.
- 💡Integrate dev client builds into your CI/CD pipeline to automate testing of native changes across different environments, ensuring consistent quality.

