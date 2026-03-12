# naming-analyzer
Source: https://antigravity.codes/agent-skills/workflow/naming-analyzer

## AI Worker Instructions
When the user requests functionality related to naming-analyzer, follow these guidelines and utilize this context.

## Scraped Content

# naming-analyzer
```
camelCase
```
```
PascalCase
```
```
UPPER_SNAKE_CASE
```
```
_prefixUnderscore
```
```
#privateField
```
```
is
```
```
has
```
```
can
```
```
should
```
```
snake_case
```
```
PascalCase
```
```
UPPER_SNAKE_CASE
```
```
_prefix_underscore
```
```
is_
```
```
has_
```
```
can_
```
```
camelCase
```
```
PascalCase
```
```
UPPER_SNAKE_CASE
```
```
lowercase
```
```
PascalCase
```
```
camelCase
```
```
HTTPServer
```
```
HttpServer
```
```
// ❌ Bad - Too genericfunction process(data) { }const info = getData();let temp = x;// ✓ Good - Specific and clearfunction processPayment(transaction) { }const userProfile = getUserProfile();let previousValue = x;
```
```
// ❌ Bad - Too genericfunction process(data) { }const info = getData();let temp = x;// ✓ Good - Specific and clearfunction processPayment(transaction) { }const userProfile = getUserProfile();let previousValue = x;
```
```
// ❌ Bad - Name doesn't match behaviorfunction getUser(id) {  const user = fetchUser(id);  user.lastLogin = Date.now();  saveUser(user); // Side effect! Not just "getting"  return user;}// ✓ Good - Name reflects actual behaviorfunction fetchAndUpdateUserLogin(id) {  const user = fetchUser(id);  user.lastLogin = Date.now();  saveUser(user);  return user;}
```
```
// ❌ Bad - Name doesn't match behaviorfunction getUser(id) {  const user = fetchUser(id);  user.lastLogin = Date.now();  saveUser(user); // Side effect! Not just "getting"  return user;}// ✓ Good - Name reflects actual behaviorfunction fetchAndUpdateUserLogin(id) {  const user = fetchUser(id);  user.lastLogin = Date.now();  saveUser(user);  return user;}
```
```
// ❌ Bad - Unclear abbreviationsconst usrCfg = loadConfig();function calcTtl(arr) { }// ✓ Good - Clear and readableconst userConfig = loadConfig();function calculateTotal(amounts) { }// ✓ Acceptable - Well-known abbreviationsconst htmlElement = document.getElementById('main');const apiUrl = process.env.API_URL;
```
```
// ❌ Bad - Unclear abbreviationsconst usrCfg = loadConfig();function calcTtl(arr) { }// ✓ Good - Clear and readableconst userConfig = loadConfig();function calculateTotal(amounts) { }// ✓ Acceptable - Well-known abbreviationsconst htmlElement = document.getElementById('main');const apiUrl = process.env.API_URL;
```
```
// ❌ Bad - Unclear stateconst login = user.authenticated;const status = checkUser();// ✓ Good - Clear boolean intentconst isLoggedIn = user.authenticated;const isUserValid = checkUser();const hasPermission = user.roles.includes('admin');const canEditPost = isOwner || isAdmin;const shouldShowNotification = isEnabled && hasUnread;
```
```
// ❌ Bad - Unclear stateconst login = user.authenticated;const status = checkUser();// ✓ Good - Clear boolean intentconst isLoggedIn = user.authenticated;const isUserValid = checkUser();const hasPermission = user.roles.includes('admin');const canEditPost = isOwner || isAdmin;const shouldShowNotification = isEnabled && hasUnread;
```
```
// ❌ Bad - Unnamed constantsif (age > 18) { }setTimeout(callback, 3600000);// ✓ Good - Named constantsconst LEGAL_AGE = 18;const ONE_HOUR_IN_MS = 60 * 60 * 1000;if (age > LEGAL_AGE) { }setTimeout(callback, ONE_HOUR_IN_MS);
```
```
// ❌ Bad - Unnamed constantsif (age > 18) { }setTimeout(callback, 3600000);// ✓ Good - Named constantsconst LEGAL_AGE = 18;const ONE_HOUR_IN_MS = 60 * 60 * 1000;if (age > LEGAL_AGE) { }setTimeout(callback, ONE_HOUR_IN_MS);
```
```
@naming-analyzer@naming-analyzer src/@naming-analyzer UserService.js@naming-analyzer --conventions@naming-analyzer --fix-all
```
```
@naming-analyzer@naming-analyzer src/@naming-analyzer UserService.js@naming-analyzer --conventions@naming-analyzer --fix-all
```
```
# Naming Analysis Report## Summary- Items analyzed: 156- Issues found: 23- Critical: 5 (misleading names)- Major: 12 (unclear/vague)- Minor: 6 (convention violations)---## Critical Issues (5)### src/services/UserService.js:45**Current**: getUser(id)**Issue**: Function name implies read-only but has side effects (updates lastLogin)**Severity**: Critical - Misleading**Suggestion**: fetchAndUpdateUserLogin(id)**Reason**: Name should reflect the mutation### src/utils/helpers.js:23**Current**: validate(x)**Issue**: Generic parameter name, unclear what's being validated**Severity**: Critical - Too vague**Suggestion**: validateEmail(emailAddress)**Reason**: Specific names improve clarity---## Major Issues (12)### src/components/DataList.jsx:12**Current**: const d = new Date()**Issue**: Single-letter variable in large scope**Severity**: Major**Suggestion**: const currentDate = new Date()**Reason**: Clarity and searchability### src/api/client.js:67**Current**: function proc(data) {}**Issue**: Abbreviated function name**Severity**: Major**Suggestion**: function processApiResponse(data) {}**Reason**: Full words are more readable### src/models/User.js:34**Current**: user.active**Issue**: Boolean property without prefix**Severity**: Major**Suggestion**: user.isActive**Reason**: Follow boolean naming convention### src/utils/format.js:89**Current**: const MAX = 100**Issue**: Generic constant name**Severity**: Major**Suggestion**: const MAX_RETRY_ATTEMPTS = 100**Reason**: Specific purpose is clearer---## Minor Issues (6)### src/config/settings.js:12**Current**: const API_url = '...'**Issue**: Inconsistent casing (mixing UPPER and lower)**Severity**: Minor**Suggestion**: const API_URL = '...' or const apiUrl = '...'**Reason**: Consistency in convention### src/helpers/string.js:45**Current**: function strToNum(s) {}**Issue**: Abbreviated function and parameter**Severity**: Minor**Suggestion**: function stringToNumber(value) {}**Reason**: Clarity over brevity---## Convention Violations### Inconsistent Boolean Prefixes**Locations**: 8 files**Issue**: Mixed use of is, has, can vs no prefix**Recommendation**: Standardize on boolean prefixes- Use is for state: isActive, isVisible- Use has for possession: hasPermission, hasError- Use can for ability: canEdit, canDelete- Use should for decisions: shouldRender, shouldValidate### Mixed Naming Conventions**Location**: src/legacy/**Issue**: Mix of camelCase and snake_case in JavaScript**Recommendation**: Convert all to camelCase for consistency---## Suggested Renaming### High Priority (Misleading or Critical)1. getUser → fetchAndUpdateUserLogin (src/services/UserService.js:45)2. validate → validateEmail (src/utils/helpers.js:23)3. process → processPaymentTransaction (src/payment/processor.js:67)### Medium Priority (Clarity)1. d → currentDate (7 locations)2. temp → previousValue (4 locations)3. data → apiResponse or more specific (12 locations)4. arr → items, values, or more specific (8 locations)### Low Priority (Convention)1. active → isActive (12 locations)2. error → hasError (6 locations)3. API_url → API_URL (3 locations)---## Naming Patterns to Follow### Functions/Methods- Verbs: get, set, create, update, delete, fetch, calculate, validate- Clear action: sendEmail(), parseJSON(), formatCurrency()### Classes- Nouns: UserService, PaymentProcessor, EmailValidator- Avoid generic: Don't use Manager, Helper, Utility unless necessary### Variables- Nouns or noun phrases: user, emailAddress, totalAmount- Descriptive: userList not list, activeUsers not users2### Constants- All caps with underscores: MAX_RETRY_ATTEMPTS, DEFAULT_TIMEOUT- Include units: CACHE_DURATION_MS, MAX_FILE_SIZE_MB### Booleans- Question form: isValid, hasPermission, canEdit- Affirmative: isEnabled not isDisabled (prefer positive)---## Refactoring ScriptWould you like me to create a refactoring script to apply these changes?This will:1. Rename all suggested items2. Update all references3. Maintain git history4. Generate migration guide---## Best Practices✓ **DO**:- Use full words over abbreviations- Be specific and descriptive- Follow language conventions- Use consistent patterns- Make booleans obvious- Include units in constants✗ **DON'T**:- Use single letters (except in loops: i, j, k)- Use vague names (data, info, temp, x)- Mix naming conventions- Use misleading names- Over-abbreviate- Use Hungarian notation in modern code
```
```
# Naming Analysis Report## Summary- Items analyzed: 156- Issues found: 23- Critical: 5 (misleading names)- Major: 12 (unclear/vague)- Minor: 6 (convention violations)---## Critical Issues (5)### src/services/UserService.js:45**Current**: getUser(id)**Issue**: Function name implies read-only but has side effects (updates lastLogin)**Severity**: Critical - Misleading**Suggestion**: fetchAndUpdateUserLogin(id)**Reason**: Name should reflect the mutation### src/utils/helpers.js:23**Current**: validate(x)**Issue**: Generic parameter name, unclear what's being validated**Severity**: Critical - Too vague**Suggestion**: validateEmail(emailAddress)**Reason**: Specific names improve clarity---## Major Issues (12)### src/components/DataList.jsx:12**Current**: const d = new Date()**Issue**: Single-letter variable in large scope**Severity**: Major**Suggestion**: const currentDate = new Date()**Reason**: Clarity and searchability### src/api/client.js:67**Current**: function proc(data) {}**Issue**: Abbreviated function name**Severity**: Major**Suggestion**: function processApiResponse(data) {}**Reason**: Full words are more readable### src/models/User.js:34**Current**: user.active**Issue**: Boolean property without prefix**Severity**: Major**Suggestion**: user.isActive**Reason**: Follow boolean naming convention### src/utils/format.js:89**Current**: const MAX = 100**Issue**: Generic constant name**Severity**: Major**Suggestion**: const MAX_RETRY_ATTEMPTS = 100**Reason**: Specific purpose is clearer---## Minor Issues (6)### src/config/settings.js:12**Current**: const API_url = '...'**Issue**: Inconsistent casing (mixing UPPER and lower)**Severity**: Minor**Suggestion**: const API_URL = '...' or const apiUrl = '...'**Reason**: Consistency in convention### src/helpers/string.js:45**Current**: function strToNum(s) {}**Issue**: Abbreviated function and parameter**Severity**: Minor**Suggestion**: function stringToNumber(value) {}**Reason**: Clarity over brevity---## Convention Violations### Inconsistent Boolean Prefixes**Locations**: 8 files**Issue**: Mixed use of is, has, can vs no prefix**Recommendation**: Standardize on boolean prefixes- Use is for state: isActive, isVisible- Use has for possession: hasPermission, hasError- Use can for ability: canEdit, canDelete- Use should for decisions: shouldRender, shouldValidate### Mixed Naming Conventions**Location**: src/legacy/**Issue**: Mix of camelCase and snake_case in JavaScript**Recommendation**: Convert all to camelCase for consistency---## Suggested Renaming### High Priority (Misleading or Critical)1. getUser → fetchAndUpdateUserLogin (src/services/UserService.js:45)2. validate → validateEmail (src/utils/helpers.js:23)3. process → processPaymentTransaction (src/payment/processor.js:67)### Medium Priority (Clarity)1. d → currentDate (7 locations)2. temp → previousValue (4 locations)3. data → apiResponse or more specific (12 locations)4. arr → items, values, or more specific (8 locations)### Low Priority (Convention)1. active → isActive (12 locations)2. error → hasError (6 locations)3. API_url → API_URL (3 locations)---## Naming Patterns to Follow### Functions/Methods- Verbs: get, set, create, update, delete, fetch, calculate, validate- Clear action: sendEmail(), parseJSON(), formatCurrency()### Classes- Nouns: UserService, PaymentProcessor, EmailValidator- Avoid generic: Don't use Manager, Helper, Utility unless necessary### Variables- Nouns or noun phrases: user, emailAddress, totalAmount- Descriptive: userList not list, activeUsers not users2### Constants- All caps with underscores: MAX_RETRY_ATTEMPTS, DEFAULT_TIMEOUT- Include units: CACHE_DURATION_MS, MAX_FILE_SIZE_MB### Booleans- Question form: isValid, hasPermission, canEdit- Affirmative: isEnabled not isDisabled (prefer positive)---## Refactoring ScriptWould you like me to create a refactoring script to apply these changes?This will:1. Rename all suggested items2. Update all references3. Maintain git history4. Generate migration guide---## Best Practices✓ **DO**:- Use full words over abbreviations- Be specific and descriptive- Follow language conventions- Use consistent patterns- Make booleans obvious- Include units in constants✗ **DON'T**:- Use single letters (except in loops: i, j, k)- Use vague names (data, info, temp, x)- Mix naming conventions- Use misleading names- Over-abbreviate- Use Hungarian notation in modern code
```
```
getUser(id)
```
```
fetchAndUpdateUserLogin(id)
```
```
validate(x)
```
```
validateEmail(emailAddress)
```
```
const d = new Date()
```
```
const currentDate = new Date()
```
```
function proc(data) {}
```
```
function processApiResponse(data) {}
```
```
user.active
```
```
user.isActive
```
```
const MAX = 100
```
```
const MAX_RETRY_ATTEMPTS = 100
```
```
const API_url = '...'
```
```
const API_URL = '...'
```
```
const apiUrl = '...'
```
```
function strToNum(s) {}
```
```
function stringToNumber(value) {}
```
```
is
```
```
has
```
```
can
```
```
is
```
```
isActive
```
```
isVisible
```
```
has
```
```
hasPermission
```
```
hasError
```
```
can
```
```
canEdit
```
```
canDelete
```
```
should
```
```
shouldRender
```
```
shouldValidate
```
```
getUser
```
```
fetchAndUpdateUserLogin
```
```
validate
```
```
validateEmail
```
```
process
```
```
processPaymentTransaction
```
```
d
```
```
currentDate
```
```
temp
```
```
previousValue
```
```
data
```
```
apiResponse
```
```
arr
```
```
items
```
```
values
```
```
active
```
```
isActive
```
```
error
```
```
hasError
```
```
API_url
```
```
API_URL
```
```
get
```
```
set
```
```
create
```
```
update
```
```
delete
```
```
fetch
```
```
calculate
```
```
validate
```
```
sendEmail()
```
```
parseJSON()
```
```
formatCurrency()
```
```
UserService
```
```
PaymentProcessor
```
```
EmailValidator
```
```
Manager
```
```
Helper
```
```
Utility
```
```
user
```
```
emailAddress
```
```
totalAmount
```
```
userList
```
```
list
```
```
activeUsers
```
```
users2
```
```
MAX_RETRY_ATTEMPTS
```
```
DEFAULT_TIMEOUT
```
```
CACHE_DURATION_MS
```
```
MAX_FILE_SIZE_MB
```
```
isValid
```
```
hasPermission
```
```
canEdit
```
```
isEnabled
```
```
isDisabled
```
```
Is it a boolean?├─ Yes → Use is/has/can/should prefix└─ No → Is it a function?    ├─ Yes → Use verb phrase (action)    └─ No → Is it a class?        ├─ Yes → Use noun (PascalCase)        └─ No → Is it a constant?            ├─ Yes → Use UPPER_SNAKE_CASE            └─ No → Use descriptive noun (camelCase/snake_case)
```
```
Is it a boolean?├─ Yes → Use is/has/can/should prefix└─ No → Is it a function?    ├─ Yes → Use verb phrase (action)    └─ No → Is it a class?        ├─ Yes → Use noun (PascalCase)        └─ No → Is it a constant?            ├─ Yes → Use UPPER_SNAKE_CASE            └─ No → Use descriptive noun (camelCase/snake_case)
```
```
i
```
```
j
```
```
html
```
```
api
```
```
url
```
```
id
```
Crafting clear and consistent code names is a cornerstone of professional software development, significantly impacting maintainability and collaboration. The Naming Analyzer Agent Skill elevates this practice by acting as your personal naming expert. It scrutinizes existing code entities—from variables and functions to classes and database fields—identifying inconsistencies, ambiguities, and violations of common conventions. Leveraging its deep understanding of language-specific and project-specific standards, this skill provides actionable suggestions, guiding you towards more expressive and maintainable codebases. Integrate it into your workflow to foster a culture of clarity and precision.

# When to Use This Skill
- •Refactoring legacy codebases to adopt modern naming conventions.
- •Onboarding new team members by enforcing consistent naming across projects.
- •Performing code reviews to identify and suggest improvements for unclear names.
- •Developing new features and wanting real-time naming suggestions to maintain high standards.

# Pro Tips
- 💡Integrate Early: Run the Naming Analyzer frequently during development, not just at the end, to catch issues proactively.
- 💡Customize for Project: Educate the skill on your project's specific custom conventions for highly tailored suggestions.
- 💡Review Reasoning: Pay attention to the 'Reasoning for each suggestion' provided by the skill to learn and understand best practices.

