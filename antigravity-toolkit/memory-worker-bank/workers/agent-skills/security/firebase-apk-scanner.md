# firebase-apk-scanner
Source: https://antigravity.codes/agent-skills/security/firebase-apk-scanner

## AI Worker Instructions
When the user requests functionality related to firebase-apk-scanner, follow these guidelines and utilize this context.

## Scraped Content

# firebase-apk-scanner
```
auth != null
```
```
$ARGUMENTS
```
```
ls -la $ARGUMENTS
```
```
ls -la $ARGUMENTS
```
```
$ARGUMENTS
```
```
{baseDir}/scanner.sh $ARGUMENTS
```
```
{baseDir}/scanner.sh $ARGUMENTS
```
```
cat firebase_scan_*/scan_report.txt
```
```
cat firebase_scan_*/scan_report.txt
```
```
extracted_value
```
```
extracted_value
```
```
extracted_value
```
```
extracted_value
```
```
extracted_value
```
```
# Decompileapktool d -f -o ./decompiled $ARGUMENTS# Find google-services.jsonfind ./decompiled -name "google-services.json"# Search XML resourcesgrep -r "firebaseio.com\|appspot.com\|AIza" ./decompiled/res/# Search assets (hybrid apps)grep -r "firebaseio.com\|AIza" ./decompiled/assets/
```
```
# Decompileapktool d -f -o ./decompiled $ARGUMENTS# Find google-services.jsonfind ./decompiled -name "google-services.json"# Search XML resourcesgrep -r "firebaseio.com\|appspot.com\|AIza" ./decompiled/res/# Search assets (hybrid apps)grep -r "firebaseio.com\|AIza" ./decompiled/assets/
```
```
# Test open signupcurl -s -X POST -H "Content-Type: application/json" \  -d '{"email":"test@test.com","password":"Test123!","returnSecureToken":true}' \  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY"# Test anonymous authcurl -s -X POST -H "Content-Type: application/json" \  -d '{"returnSecureToken":true}' \  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY"
```
```
# Test open signupcurl -s -X POST -H "Content-Type: application/json" \  -d '{"email":"test@test.com","password":"Test123!","returnSecureToken":true}' \  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY"# Test anonymous authcurl -s -X POST -H "Content-Type: application/json" \  -d '{"returnSecureToken":true}' \  "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY"
```
```
# Realtime Database readcurl -s "https://PROJECT_ID.firebaseio.com/.json"# Firestore readcurl -s "https://firestore.googleapis.com/v1/projects/PROJECT_ID/databases/(default)/documents"
```
```
# Realtime Database readcurl -s "https://PROJECT_ID.firebaseio.com/.json"# Firestore readcurl -s "https://firestore.googleapis.com/v1/projects/PROJECT_ID/databases/(default)/documents"
```
```
# List bucketcurl -s "https://firebasestorage.googleapis.com/v0/b/PROJECT_ID.appspot.com/o"
```
```
# List bucketcurl -s "https://firebasestorage.googleapis.com/v0/b/PROJECT_ID.appspot.com/o"
```
```
curl -s -H "x-goog-api-key: API_KEY" \  "https://firebaseremoteconfig.googleapis.com/v1/projects/PROJECT_ID/remoteConfig"
```
```
curl -s -H "x-goog-api-key: API_KEY" \  "https://firebaseremoteconfig.googleapis.com/v1/projects/PROJECT_ID/remoteConfig"
```
Ensuring the security of mobile applications is paramount, especially when they leverage powerful backend services like Google Firebase. Misconfigurations can expose sensitive data or allow unauthorized access, posing significant risks. This specialized agent skill acts as a dedicated Firebase security analyst, empowering developers and security researchers to proactively identify potential vulnerabilities directly within Android APKs. It streamlines the process of uncovering common security pitfalls, enhancing the overall resilience of Firebase-backed applications and safeguarding user data against malicious exploitation.

# When to Use This Skill
- •Auditing Android applications for Firebase security misconfigurations during development or pre-release.
- •Testing Firebase endpoints (Realtime Database, Firestore, Storage) extracted from APKs for proper access controls.
- •Checking Firebase authentication security for issues like open signup, anonymous auth, or email enumeration.
- •Performing authorized penetration tests on mobile applications that utilize a Firebase backend.

# Pro Tips
- 💡Always combine findings from this skill with manual verification and source code review for comprehensive security assessments.
- 💡Prioritize remediation of identified open Firebase databases or storage buckets, as these often represent the highest data exposure risks.
- 💡Use in conjunction with dynamic analysis tools to observe runtime interactions and confirm endpoint vulnerabilities uncovered statically by this skill.

