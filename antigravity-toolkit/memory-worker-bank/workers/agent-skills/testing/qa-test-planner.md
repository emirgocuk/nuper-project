# qa-test-planner
Source: https://antigravity.codes/agent-skills/testing/qa-test-planner

## AI Worker Instructions
When the user requests functionality related to qa-test-planner, follow these guidelines and utilize this context.

## Scraped Content

# qa-test-planner
```
/qa-test-planner
```
```
qa-test-planner
```
```
use the skill qa-test-planner
```
```
"Create a test plan for the user authentication feature"
```
```
"Create a test plan for the user authentication feature"
```
```
"Generate manual test cases for the checkout flow"
```
```
"Generate manual test cases for the checkout flow"
```
```
"Build a regression test suite for the payment module"
```
```
"Build a regression test suite for the payment module"
```
```
"Compare the login page against the Figma design at [URL]"
```
```
"Compare the login page against the Figma design at [URL]"
```
```
"Create a bug report for the form validation issue"
```
```
"Create a bug report for the form validation issue"
```
```
Your Request    │    ▼┌─────────────────────────────────────────────────────┐│ 1. ANALYZE                                          ││    • Parse feature/requirement                      ││    • Identify test types needed                     ││    • Determine scope and priorities                 │├─────────────────────────────────────────────────────┤│ 2. GENERATE                                         ││    • Create structured deliverables                 ││    • Apply templates and best practices             ││    • Include edge cases and variations              │├─────────────────────────────────────────────────────┤│ 3. VALIDATE                                         ││    • Check completeness                             ││    • Verify traceability                            ││    • Ensure actionable steps                        │└─────────────────────────────────────────────────────┘    │    ▼QA Deliverable Ready
```
```
Your Request    │    ▼┌─────────────────────────────────────────────────────┐│ 1. ANALYZE                                          ││    • Parse feature/requirement                      ││    • Identify test types needed                     ││    • Determine scope and priorities                 │├─────────────────────────────────────────────────────┤│ 2. GENERATE                                         ││    • Create structured deliverables                 ││    • Apply templates and best practices             ││    • Include edge cases and variations              │├─────────────────────────────────────────────────────┤│ 3. VALIDATE                                         ││    • Check completeness                             ││    • Verify traceability                            ││    • Ensure actionable steps                        │└─────────────────────────────────────────────────────┘    │    ▼QA Deliverable Ready
```
```
./scripts/generate_test_cases.sh
```
```
./scripts/create_bug_report.sh
```
```
## TC-001: [Test Case Title]**Priority:** High | Medium | Low**Type:** Functional | UI | Integration | Regression**Status:** Not Run | Pass | Fail | Blocked### Objective[What are we testing and why]### Preconditions- [Setup requirement 1]- [Setup requirement 2]- [Test data needed]### Test Steps1. [Action to perform]   **Expected:** [What should happen]2. [Action to perform]   **Expected:** [What should happen]3. [Action to perform]   **Expected:** [What should happen]### Test Data- Input: [Test data values]- User: [Test account details]- Configuration: [Environment settings]### Post-conditions- [System state after test]- [Cleanup required]### Notes- [Edge cases to consider]- [Related test cases]- [Known issues]
```
```
## TC-001: [Test Case Title]**Priority:** High | Medium | Low**Type:** Functional | UI | Integration | Regression**Status:** Not Run | Pass | Fail | Blocked### Objective[What are we testing and why]### Preconditions- [Setup requirement 1]- [Setup requirement 2]- [Test data needed]### Test Steps1. [Action to perform]   **Expected:** [What should happen]2. [Action to perform]   **Expected:** [What should happen]3. [Action to perform]   **Expected:** [What should happen]### Test Data- Input: [Test data values]- User: [Test account details]- Configuration: [Environment settings]### Post-conditions- [System state after test]- [Cleanup required]### Notes- [Edge cases to consider]- [Related test cases]- [Known issues]
```
```
# Test Plan: [Feature/Release Name]## Executive Summary- Feature/product being tested- Testing objectives- Key risks- Timeline overview## Test Scope**In Scope:**- Features to be tested- Test types (functional, UI, performance)- Platforms and environments- User flows and scenarios**Out of Scope:**- Features not being tested- Known limitations- Third-party integrations (if applicable)## Test Strategy**Test Types:**- Manual testing- Exploratory testing- Regression testing- Integration testing- User acceptance testing**Test Approach:**- Black box testing- Positive and negative testing- Boundary value analysis- Equivalence partitioning## Test Environment- Operating systems- Browsers and versions- Devices (mobile, tablet, desktop)- Test data requirements- Backend/API environments## Entry Criteria- [ ] Requirements documented- [ ] Designs finalized- [ ] Test environment ready- [ ] Test data prepared- [ ] Build deployed## Exit Criteria- [ ] All high-priority test cases executed- [ ] 90%+ test case pass rate- [ ] All critical bugs fixed- [ ] No open high-severity bugs- [ ] Regression suite passed## Risk Assessment| Risk | Probability | Impact | Mitigation ||------|-------------|--------|------------|| [Risk 1] | H/M/L | H/M/L | [Mitigation] |## Test Deliverables- Test plan document- Test cases- Test execution reports- Bug reports- Test summary report
```
```
# Test Plan: [Feature/Release Name]## Executive Summary- Feature/product being tested- Testing objectives- Key risks- Timeline overview## Test Scope**In Scope:**- Features to be tested- Test types (functional, UI, performance)- Platforms and environments- User flows and scenarios**Out of Scope:**- Features not being tested- Known limitations- Third-party integrations (if applicable)## Test Strategy**Test Types:**- Manual testing- Exploratory testing- Regression testing- Integration testing- User acceptance testing**Test Approach:**- Black box testing- Positive and negative testing- Boundary value analysis- Equivalence partitioning## Test Environment- Operating systems- Browsers and versions- Devices (mobile, tablet, desktop)- Test data requirements- Backend/API environments## Entry Criteria- [ ] Requirements documented- [ ] Designs finalized- [ ] Test environment ready- [ ] Test data prepared- [ ] Build deployed## Exit Criteria- [ ] All high-priority test cases executed- [ ] 90%+ test case pass rate- [ ] All critical bugs fixed- [ ] No open high-severity bugs- [ ] Regression suite passed## Risk Assessment| Risk | Probability | Impact | Mitigation ||------|-------------|--------|------------|| [Risk 1] | H/M/L | H/M/L | [Mitigation] |## Test Deliverables- Test plan document- Test cases- Test execution reports- Bug reports- Test summary report
```
```
# BUG-[ID]: [Clear, specific title]**Severity:** Critical | High | Medium | Low**Priority:** P0 | P1 | P2 | P3**Type:** Functional | UI | Performance | Security**Status:** Open | In Progress | Fixed | Closed## Environment- **OS:** [Windows 11, macOS 14, etc.]- **Browser:** [Chrome 120, Firefox 121, etc.]- **Device:** [Desktop, iPhone 15, etc.]- **Build:** [Version/commit]- **URL:** [Page where bug occurs]## Description[Clear, concise description of the issue]## Steps to Reproduce1. [Specific step]2. [Specific step]3. [Specific step]## Expected Behavior[What should happen]## Actual Behavior[What actually happens]## Visual Evidence- Screenshot: [attached]- Video: [link if applicable]- Console errors: [paste errors]## Impact- **User Impact:** [How many users affected]- **Frequency:** [Always, Sometimes, Rarely]- **Workaround:** [If one exists]## Additional Context- Related to: [Feature/ticket]- Regression: [Yes/No]- Figma design: [Link if UI bug]
```
```
# BUG-[ID]: [Clear, specific title]**Severity:** Critical | High | Medium | Low**Priority:** P0 | P1 | P2 | P3**Type:** Functional | UI | Performance | Security**Status:** Open | In Progress | Fixed | Closed## Environment- **OS:** [Windows 11, macOS 14, etc.]- **Browser:** [Chrome 120, Firefox 121, etc.]- **Device:** [Desktop, iPhone 15, etc.]- **Build:** [Version/commit]- **URL:** [Page where bug occurs]## Description[Clear, concise description of the issue]## Steps to Reproduce1. [Specific step]2. [Specific step]3. [Specific step]## Expected Behavior[What should happen]## Actual Behavior[What actually happens]## Visual Evidence- Screenshot: [attached]- Video: [link if applicable]- Console errors: [paste errors]## Impact- **User Impact:** [How many users affected]- **Frequency:** [Always, Sometimes, Rarely]- **Workaround:** [If one exists]## Additional Context- Related to: [Feature/ticket]- Regression: [Yes/No]- Figma design: [Link if UI bug]
```
```
"Get the button specifications from Figma file [URL]"Response includes:- Dimensions (width, height)- Colors (background, text, border)- Typography (font, size, weight)- Spacing (padding, margin)- Border radius- States (default, hover, active, disabled)
```
```
"Get the button specifications from Figma file [URL]"Response includes:- Dimensions (width, height)- Colors (background, text, border)- Typography (font, size, weight)- Spacing (padding, margin)- Border radius- States (default, hover, active, disabled)
```
```
TC: Primary Button Visual Validation1. Inspect primary button in browser dev tools2. Compare against Figma specs:   - Dimensions: 120x40px   - Border-radius: 8px   - Background color: #0066FF   - Font: 16px Medium #FFFFFF3. Document discrepancies
```
```
TC: Primary Button Visual Validation1. Inspect primary button in browser dev tools2. Compare against Figma specs:   - Dimensions: 120x40px   - Border-radius: 8px   - Background color: #0066FF   - Font: 16px Medium #FFFFFF3. Document discrepancies
```
```
BUG: Primary button color doesn't match designSeverity: MediumExpected (Figma): #0066FFActual (Implementation): #0052CCScreenshot: [attached]Figma link: [specific component]
```
```
BUG: Primary button color doesn't match designSeverity: MediumExpected (Figma): #0066FFActual (Implementation): #0052CCScreenshot: [attached]Figma link: [specific component]
```
```
"Get button specifications from Figma design [URL]""Compare navigation menu implementation against Figma design""Extract spacing values for dashboard layout from Figma""List all color tokens used in Figma design system"
```
```
"Get button specifications from Figma design [URL]""Compare navigation menu implementation against Figma design""Extract spacing values for dashboard layout from Figma""List all color tokens used in Figma design system"
```
```
# Test Run: [Release Version]**Date:** 2024-01-15**Build:** v2.5.0-rc1**Tester:** [Name]**Environment:** Staging## Summary- Total Test Cases: 150- Executed: 145- Passed: 130- Failed: 10- Blocked: 5- Not Run: 5- Pass Rate: 90%## Test Cases by Priority| Priority | Total | Pass | Fail | Blocked ||----------|-------|------|------|---------|| P0 (Critical) | 25 | 23 | 2 | 0 || P1 (High) | 50 | 45 | 3 | 2 || P2 (Medium) | 50 | 45 | 3 | 2 || P3 (Low) | 25 | 17 | 2 | 1 |## Critical Failures- TC-045: Payment processing fails  - Bug: BUG-234  - Status: Open## Blocked Tests- TC-112: Dashboard widget (API endpoint down)## Risks- 2 critical bugs blocking release- Payment integration needs attention## Next Steps- Retest after BUG-234 fix- Complete remaining 5 test cases- Run full regression before sign-off
```
```
# Test Run: [Release Version]**Date:** 2024-01-15**Build:** v2.5.0-rc1**Tester:** [Name]**Environment:** Staging## Summary- Total Test Cases: 150- Executed: 145- Passed: 130- Failed: 10- Blocked: 5- Not Run: 5- Pass Rate: 90%## Test Cases by Priority| Priority | Total | Pass | Fail | Blocked ||----------|-------|------|------|---------|| P0 (Critical) | 25 | 23 | 2 | 0 || P1 (High) | 50 | 45 | 3 | 2 || P2 (Medium) | 50 | 45 | 3 | 2 || P3 (Low) | 25 | 17 | 2 | 1 |## Critical Failures- TC-045: Payment processing fails  - Bug: BUG-234  - Status: Open## Blocked Tests- TC-112: Dashboard widget (API endpoint down)## Risks- 2 critical bugs blocking release- Payment integration needs attention## Next Steps- Retest after BUG-234 fix- Complete remaining 5 test cases- Run full regression before sign-off
```
```
## Coverage Matrix| Feature | Requirements | Test Cases | Status | Gaps ||---------|--------------|------------|--------|------|| Login | 8 | 12 | Complete | None || Checkout | 15 | 10 | Partial | Payment errors || Dashboard | 12 | 15 | Complete | None |
```
```
## Coverage Matrix| Feature | Requirements | Test Cases | Status | Gaps ||---------|--------------|------------|--------|------|| Login | 8 | 12 | Complete | None || Checkout | 15 | 10 | Partial | Payment errors || Dashboard | 12 | 15 | Complete | None |
```
```
## TC-LOGIN-001: Valid User Login**Priority:** P0 (Critical)**Type:** Functional**Estimated Time:** 2 minutes### ObjectiveVerify users can successfully login with valid credentials### Preconditions- User account exists (test@example.com / Test123!)- User is not already logged in- Browser cookies cleared### Test Steps1. Navigate to https://app.example.com/login   **Expected:** Login page displays with email and password fields2. Enter email: test@example.com   **Expected:** Email field accepts input3. Enter password: Test123!   **Expected:** Password field shows masked characters4. Click "Login" button   **Expected:**   - Loading indicator appears   - User redirected to /dashboard   - Welcome message shown: "Welcome back, Test User"   - Avatar/profile image displayed in header### Post-conditions- User session created- Auth token stored- Analytics event logged### Edge Cases to Consider- TC-LOGIN-002: Invalid password- TC-LOGIN-003: Non-existent email- TC-LOGIN-004: SQL injection attempt- TC-LOGIN-005: Very long password
```
```
## TC-LOGIN-001: Valid User Login**Priority:** P0 (Critical)**Type:** Functional**Estimated Time:** 2 minutes### ObjectiveVerify users can successfully login with valid credentials### Preconditions- User account exists (test@example.com / Test123!)- User is not already logged in- Browser cookies cleared### Test Steps1. Navigate to https://app.example.com/login   **Expected:** Login page displays with email and password fields2. Enter email: test@example.com   **Expected:** Email field accepts input3. Enter password: Test123!   **Expected:** Password field shows masked characters4. Click "Login" button   **Expected:**   - Loading indicator appears   - User redirected to /dashboard   - Welcome message shown: "Welcome back, Test User"   - Avatar/profile image displayed in header### Post-conditions- User session created- Auth token stored- Analytics event logged### Edge Cases to Consider- TC-LOGIN-002: Invalid password- TC-LOGIN-003: Non-existent email- TC-LOGIN-004: SQL injection attempt- TC-LOGIN-005: Very long password
```
```
## TC-UI-045: Mobile Navigation Menu**Priority:** P1 (High)**Type:** UI/Responsive**Devices:** Mobile (iPhone, Android)### ObjectiveVerify navigation menu works correctly on mobile devices### Preconditions- Access from mobile device or responsive mode- Viewport width: 375px (iPhone SE) to 428px (iPhone Pro Max)### Test Steps1. Open homepage on mobile device   **Expected:** Hamburger menu icon visible (top-right)2. Tap hamburger icon   **Expected:**   - Menu slides in from right   - Overlay appears over content   - Close (X) button visible3. Tap menu item   **Expected:** Navigate to section, menu closes4. Compare against Figma mobile design [link]   **Expected:**   - Menu width: 280px   - Slide animation: 300ms ease-out   - Overlay opacity: 0.5, color #000000   - Font size: 16px, line-height 24px### Breakpoints to Test- 375px (iPhone SE)- 390px (iPhone 14)- 428px (iPhone 14 Pro Max)- 360px (Galaxy S21)
```
```
## TC-UI-045: Mobile Navigation Menu**Priority:** P1 (High)**Type:** UI/Responsive**Devices:** Mobile (iPhone, Android)### ObjectiveVerify navigation menu works correctly on mobile devices### Preconditions- Access from mobile device or responsive mode- Viewport width: 375px (iPhone SE) to 428px (iPhone Pro Max)### Test Steps1. Open homepage on mobile device   **Expected:** Hamburger menu icon visible (top-right)2. Tap hamburger icon   **Expected:**   - Menu slides in from right   - Overlay appears over content   - Close (X) button visible3. Tap menu item   **Expected:** Navigate to section, menu closes4. Compare against Figma mobile design [link]   **Expected:**   - Menu width: 280px   - Slide animation: 300ms ease-out   - Overlay opacity: 0.5, color #000000   - Font size: 16px, line-height 24px### Breakpoints to Test- 375px (iPhone SE)- 390px (iPhone 14)- 428px (iPhone 14 Pro Max)- 360px (Galaxy S21)
```
The QA Test Planner Agent Skill is designed to revolutionize the way quality assurance professionals approach their daily tasks. By leveraging advanced AI, this tool empowers engineers to rapidly create essential testing artifacts, ensuring software reliability and design fidelity. From initial test strategy formulation to detailed bug tracking, it integrates seamlessly into the development lifecycle. Enhance productivity and maintain high standards by automating the generation of comprehensive test documentation, allowing your team to focus on critical analysis and execution. This skill is an invaluable asset for delivering flawless user experiences.

# When to Use This Skill
- •Planning a new feature's testing strategy by generating a detailed test plan.
- •Quickly creating step-by-step manual test cases for a specific user flow.
- •Building a robust regression test suite to ensure existing functionalities remain intact after code changes.
- •Comparing the implemented UI of a web page directly against its Figma design mockups to identify discrepancies.
- •Documenting and reporting discovered software bugs with clear, structured information.

# Pro Tips
- 💡Always provide as much context as possible, including user stories, feature descriptions, or existing documentation links, for more accurate test plan and test case generation.
- 💡When validating designs, ensure the Figma URL provided grants appropriate access, and specify particular components or screens if needed for focused comparison.
- 💡For bug reports, clearly describe the steps to reproduce, expected behavior, and actual behavior to assist developers in quick resolution.

