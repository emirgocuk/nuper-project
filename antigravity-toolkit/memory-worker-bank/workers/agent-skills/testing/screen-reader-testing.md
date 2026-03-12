# screen-reader-testing
Source: https://antigravity.codes/agent-skills/testing/screen-reader-testing

## AI Worker Instructions
When the user requests functionality related to screen-reader-testing, follow these guidelines and utilize this context.

## Scraped Content

# screen-reader-testing
```
Minimum Coverage:1. NVDA + Firefox (Windows)2. VoiceOver + Safari (macOS)3. VoiceOver + Safari (iOS)Comprehensive Coverage:+ JAWS + Chrome (Windows)+ TalkBack + Chrome (Android)+ Narrator + Edge (Windows)
```
```
Minimum Coverage:1. NVDA + Firefox (Windows)2. VoiceOver + Safari (macOS)3. VoiceOver + Safari (iOS)Comprehensive Coverage:+ JAWS + Chrome (Windows)+ TalkBack + Chrome (Android)+ Narrator + Edge (Windows)
```
```
Enable: System Preferences → Accessibility → VoiceOverToggle: Cmd + F5Quick Toggle: Triple-press Touch ID
```
```
Enable: System Preferences → Accessibility → VoiceOverToggle: Cmd + F5Quick Toggle: Triple-press Touch ID
```
```
Navigation:VO = Ctrl + Option (VoiceOver modifier)VO + Right Arrow   Next elementVO + Left Arrow    Previous elementVO + Shift + Down  Enter groupVO + Shift + Up    Exit groupReading:VO + A             Read all from cursorCtrl               Stop speakingVO + B             Read current paragraphInteraction:VO + Space         Activate elementVO + Shift + M     Open menuTab                Next focusable elementShift + Tab        Previous focusable elementRotor (VO + U):Navigate by: Headings, Links, Forms, LandmarksLeft/Right Arrow   Change rotor categoryUp/Down Arrow      Navigate within categoryEnter              Go to itemWeb Specific:VO + Cmd + H       Next headingVO + Cmd + J       Next form controlVO + Cmd + L       Next linkVO + Cmd + T       Next table
```
```
Navigation:VO = Ctrl + Option (VoiceOver modifier)VO + Right Arrow   Next elementVO + Left Arrow    Previous elementVO + Shift + Down  Enter groupVO + Shift + Up    Exit groupReading:VO + A             Read all from cursorCtrl               Stop speakingVO + B             Read current paragraphInteraction:VO + Space         Activate elementVO + Shift + M     Open menuTab                Next focusable elementShift + Tab        Previous focusable elementRotor (VO + U):Navigate by: Headings, Links, Forms, LandmarksLeft/Right Arrow   Change rotor categoryUp/Down Arrow      Navigate within categoryEnter              Go to itemWeb Specific:VO + Cmd + H       Next headingVO + Cmd + J       Next form controlVO + Cmd + L       Next linkVO + Cmd + T       Next table
```
```
## VoiceOver Testing Checklist### Page Load- [ ] Page title announced- [ ] Main landmark found- [ ] Skip link works### Navigation- [ ] All headings discoverable via rotor- [ ] Heading levels logical (H1 → H2 → H3)- [ ] Landmarks properly labeled- [ ] Skip links functional### Links & Buttons- [ ] Link purpose clear- [ ] Button actions described- [ ] New window/tab announced### Forms- [ ] All labels read with inputs- [ ] Required fields announced- [ ] Error messages read- [ ] Instructions available- [ ] Focus moves to errors### Dynamic Content- [ ] Alerts announced immediately- [ ] Loading states communicated- [ ] Content updates announced- [ ] Modals trap focus correctly### Tables- [ ] Headers associated with cells- [ ] Table navigation works- [ ] Complex tables have captions
```
```
## VoiceOver Testing Checklist### Page Load- [ ] Page title announced- [ ] Main landmark found- [ ] Skip link works### Navigation- [ ] All headings discoverable via rotor- [ ] Heading levels logical (H1 → H2 → H3)- [ ] Landmarks properly labeled- [ ] Skip links functional### Links & Buttons- [ ] Link purpose clear- [ ] Button actions described- [ ] New window/tab announced### Forms- [ ] All labels read with inputs- [ ] Required fields announced- [ ] Error messages read- [ ] Instructions available- [ ] Focus moves to errors### Dynamic Content- [ ] Alerts announced immediately- [ ] Loading states communicated- [ ] Content updates announced- [ ] Modals trap focus correctly### Tables- [ ] Headers associated with cells- [ ] Table navigation works- [ ] Complex tables have captions
```
```
<!-- Issue: Button not announcing purpose --><button><svg>...</svg></button><!-- Fix --><button aria-label="Close dialog"><svg aria-hidden="true">...</svg></button><!-- Issue: Dynamic content not announced --><div id="results">New results loaded</div><!-- Fix --><div id="results" role="status" aria-live="polite">New results loaded</div><!-- Issue: Form error not read --><input type="email" /><span class="error">Invalid email</span><!-- Fix --><input type="email" aria-invalid="true" aria-describedby="email-error" /><span id="email-error" role="alert">Invalid email</span>
```
```
<!-- Issue: Button not announcing purpose --><button><svg>...</svg></button><!-- Fix --><button aria-label="Close dialog"><svg aria-hidden="true">...</svg></button><!-- Issue: Dynamic content not announced --><div id="results">New results loaded</div><!-- Fix --><div id="results" role="status" aria-live="polite">New results loaded</div><!-- Issue: Form error not read --><input type="email" /><span class="error">Invalid email</span><!-- Fix --><input type="email" aria-invalid="true" aria-describedby="email-error" /><span id="email-error" role="alert">Invalid email</span>
```
```
Download: nvaccess.orgStart: Ctrl + Alt + NStop: Insert + Q
```
```
Download: nvaccess.orgStart: Ctrl + Alt + NStop: Insert + Q
```
```
Navigation:Insert = NVDA modifierDown Arrow         Next lineUp Arrow           Previous lineTab                Next focusableShift + Tab        Previous focusableReading:NVDA + Down Arrow  Say allCtrl               Stop speechNVDA + Up Arrow    Current lineHeadings:H                  Next headingShift + H          Previous heading1-6                Heading level 1-6Forms:F                  Next form fieldB                  Next buttonE                  Next edit fieldX                  Next checkboxC                  Next combo boxLinks:K                  Next linkU                  Next unvisited linkV                  Next visited linkLandmarks:D                  Next landmarkShift + D          Previous landmarkTables:T                  Next tableCtrl + Alt + Arrows Navigate cellsElements List (NVDA + F7):Shows all links, headings, form fields, landmarks
```
```
Navigation:Insert = NVDA modifierDown Arrow         Next lineUp Arrow           Previous lineTab                Next focusableShift + Tab        Previous focusableReading:NVDA + Down Arrow  Say allCtrl               Stop speechNVDA + Up Arrow    Current lineHeadings:H                  Next headingShift + H          Previous heading1-6                Heading level 1-6Forms:F                  Next form fieldB                  Next buttonE                  Next edit fieldX                  Next checkboxC                  Next combo boxLinks:K                  Next linkU                  Next unvisited linkV                  Next visited linkLandmarks:D                  Next landmarkShift + D          Previous landmarkTables:T                  Next tableCtrl + Alt + Arrows Navigate cellsElements List (NVDA + F7):Shows all links, headings, form fields, landmarks
```
```
NVDA automatically switches modes:- Browse Mode: Arrow keys navigate content- Focus Mode: Arrow keys control interactive elementsManual switch: NVDA + SpaceWatch for:- "Browse mode" announcement when navigating- "Focus mode" when entering form fields- Application role forces forms mode
```
```
NVDA automatically switches modes:- Browse Mode: Arrow keys navigate content- Focus Mode: Arrow keys control interactive elementsManual switch: NVDA + SpaceWatch for:- "Browse mode" announcement when navigating- "Focus mode" when entering form fields- Application role forces forms mode
```
```
## NVDA Test Script### Initial Load1. Navigate to page2. Let page finish loading3. Press Insert + Down to read all4. Note: Page title, main content identified?### Landmark Navigation1. Press D repeatedly2. Check: All main areas reachable?3. Check: Landmarks properly labeled?### Heading Navigation1. Press Insert + F7 → Headings2. Check: Logical heading structure?3. Press H to navigate headings4. Check: All sections discoverable?### Form Testing1. Press F to find first form field2. Check: Label read?3. Fill in invalid data4. Submit form5. Check: Errors announced?6. Check: Focus moved to error?### Interactive Elements1. Tab through all interactive elements2. Check: Each announces role and state3. Activate buttons with Enter/Space4. Check: Result announced?### Dynamic Content1. Trigger content update2. Check: Change announced?3. Open modal4. Check: Focus trapped?5. Close modal6. Check: Focus returns?
```
```
## NVDA Test Script### Initial Load1. Navigate to page2. Let page finish loading3. Press Insert + Down to read all4. Note: Page title, main content identified?### Landmark Navigation1. Press D repeatedly2. Check: All main areas reachable?3. Check: Landmarks properly labeled?### Heading Navigation1. Press Insert + F7 → Headings2. Check: Logical heading structure?3. Press H to navigate headings4. Check: All sections discoverable?### Form Testing1. Press F to find first form field2. Check: Label read?3. Fill in invalid data4. Submit form5. Check: Errors announced?6. Check: Focus moved to error?### Interactive Elements1. Tab through all interactive elements2. Check: Each announces role and state3. Activate buttons with Enter/Space4. Check: Result announced?### Dynamic Content1. Trigger content update2. Check: Change announced?3. Open modal4. Check: Focus trapped?5. Close modal6. Check: Focus returns?
```
```
Start: Desktop shortcut or Ctrl + Alt + JVirtual Cursor: Auto-enabled in browsersNavigation:Arrow keys         Navigate contentTab                Next focusableInsert + Down      Read allCtrl               Stop speechQuick Keys:H                  Next headingT                  Next tableF                  Next form fieldB                  Next buttonG                  Next graphicL                  Next list;                  Next landmarkForms Mode:Enter              Enter forms modeNumpad +           Exit forms modeF5                 List form fieldsLists:Insert + F7        Link listInsert + F6        Heading listInsert + F5        Form field listTables:Ctrl + Alt + Arrows Table navigation
```
```
Start: Desktop shortcut or Ctrl + Alt + JVirtual Cursor: Auto-enabled in browsersNavigation:Arrow keys         Navigate contentTab                Next focusableInsert + Down      Read allCtrl               Stop speechQuick Keys:H                  Next headingT                  Next tableF                  Next form fieldB                  Next buttonG                  Next graphicL                  Next list;                  Next landmarkForms Mode:Enter              Enter forms modeNumpad +           Exit forms modeF5                 List form fieldsLists:Insert + F7        Link listInsert + F6        Heading listInsert + F5        Form field listTables:Ctrl + Alt + Arrows Table navigation
```
```
Enable: Settings → Accessibility → TalkBackToggle: Hold both volume buttons 3 seconds
```
```
Enable: Settings → Accessibility → TalkBackToggle: Hold both volume buttons 3 seconds
```
```
Explore: Drag finger across screenNext: Swipe rightPrevious: Swipe leftActivate: Double tapScroll: Two finger swipeReading Controls (swipe up then right):- Headings- Links- Controls- Characters- Words- Lines- Paragraphs
```
```
Explore: Drag finger across screenNext: Swipe rightPrevious: Swipe leftActivate: Double tapScroll: Two finger swipeReading Controls (swipe up then right):- Headings- Links- Controls- Characters- Words- Lines- Paragraphs
```
```
<!-- Accessible modal structure --><div  role="dialog"  aria-modal="true"  aria-labelledby="dialog-title"  aria-describedby="dialog-desc">  <h2 id="dialog-title">Confirm Delete</h2>  <p id="dialog-desc">This action cannot be undone.</p>  <button>Cancel</button>  <button>Delete</button></div>
```
```
<!-- Accessible modal structure --><div  role="dialog"  aria-modal="true"  aria-labelledby="dialog-title"  aria-describedby="dialog-desc">  <h2 id="dialog-title">Confirm Delete</h2>  <p id="dialog-desc">This action cannot be undone.</p>  <button>Cancel</button>  <button>Delete</button></div>
```
```
// Focus managementfunction openModal(modal) {  // Store last focused element  lastFocus = document.activeElement;  // Move focus to modal  modal.querySelector("h2").focus();  // Trap focus  modal.addEventListener("keydown", trapFocus);}function closeModal(modal) {  // Return focus  lastFocus.focus();}function trapFocus(e) {  if (e.key === "Tab") {    const focusable = modal.querySelectorAll(      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',    );    const first = focusable[0];    const last = focusable[focusable.length - 1];    if (e.shiftKey && document.activeElement === first) {      last.focus();      e.preventDefault();    } else if (!e.shiftKey && document.activeElement === last) {      first.focus();      e.preventDefault();    }  }  if (e.key === "Escape") {    closeModal(modal);  }}
```
```
// Focus managementfunction openModal(modal) {  // Store last focused element  lastFocus = document.activeElement;  // Move focus to modal  modal.querySelector("h2").focus();  // Trap focus  modal.addEventListener("keydown", trapFocus);}function closeModal(modal) {  // Return focus  lastFocus.focus();}function trapFocus(e) {  if (e.key === "Tab") {    const focusable = modal.querySelectorAll(      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',    );    const first = focusable[0];    const last = focusable[focusable.length - 1];    if (e.shiftKey && document.activeElement === first) {      last.focus();      e.preventDefault();    } else if (!e.shiftKey && document.activeElement === last) {      first.focus();      e.preventDefault();    }  }  if (e.key === "Escape") {    closeModal(modal);  }}
```
```
<!-- Status messages (polite) --><div role="status" aria-live="polite" aria-atomic="true">  <!-- Content updates will be announced after current speech --></div><!-- Alerts (assertive) --><div role="alert" aria-live="assertive">  <!-- Content updates interrupt current speech --></div><!-- Progress updates --><div  role="progressbar"  aria-valuenow="75"  aria-valuemin="0"  aria-valuemax="100"  aria-label="Upload progress"></div><!-- Log (additions only) --><div role="log" aria-live="polite" aria-relevant="additions">  <!-- New messages announced, removals not --></div>
```
```
<!-- Status messages (polite) --><div role="status" aria-live="polite" aria-atomic="true">  <!-- Content updates will be announced after current speech --></div><!-- Alerts (assertive) --><div role="alert" aria-live="assertive">  <!-- Content updates interrupt current speech --></div><!-- Progress updates --><div  role="progressbar"  aria-valuenow="75"  aria-valuemin="0"  aria-valuemax="100"  aria-label="Upload progress"></div><!-- Log (additions only) --><div role="log" aria-live="polite" aria-relevant="additions">  <!-- New messages announced, removals not --></div>
```
```
<div role="tablist" aria-label="Product information">  <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">    Description  </button>  <button    role="tab"    id="tab-2"    aria-selected="false"    aria-controls="panel-2"    tabindex="-1"  >    Reviews  </button></div><div role="tabpanel" id="panel-1" aria-labelledby="tab-1">  Product description content...</div><div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>  Reviews content...</div>
```
```
<div role="tablist" aria-label="Product information">  <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">    Description  </button>  <button    role="tab"    id="tab-2"    aria-selected="false"    aria-controls="panel-2"    tabindex="-1"  >    Reviews  </button></div><div role="tabpanel" id="panel-1" aria-labelledby="tab-1">  Product description content...</div><div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>  Reviews content...</div>
```
```
// Tab keyboard navigationtablist.addEventListener("keydown", (e) => {  const tabs = [...tablist.querySelectorAll('[role="tab"]')];  const index = tabs.indexOf(document.activeElement);  let newIndex;  switch (e.key) {    case "ArrowRight":      newIndex = (index + 1) % tabs.length;      break;    case "ArrowLeft":      newIndex = (index - 1 + tabs.length) % tabs.length;      break;    case "Home":      newIndex = 0;      break;    case "End":      newIndex = tabs.length - 1;      break;    default:      return;  }  tabs[newIndex].focus();  activateTab(tabs[newIndex]);  e.preventDefault();});
```
```
// Tab keyboard navigationtablist.addEventListener("keydown", (e) => {  const tabs = [...tablist.querySelectorAll('[role="tab"]')];  const index = tabs.indexOf(document.activeElement);  let newIndex;  switch (e.key) {    case "ArrowRight":      newIndex = (index + 1) % tabs.length;      break;    case "ArrowLeft":      newIndex = (index - 1 + tabs.length) % tabs.length;      break;    case "Home":      newIndex = 0;      break;    case "End":      newIndex = tabs.length - 1;      break;    default:      return;  }  tabs[newIndex].focus();  activateTab(tabs[newIndex]);  e.preventDefault();});
```
```
// Log what screen reader seesfunction logAccessibleName(element) {  const computed = window.getComputedStyle(element);  console.log({    role: element.getAttribute("role") || element.tagName,    name:      element.getAttribute("aria-label") ||      element.getAttribute("aria-labelledby") ||      element.textContent,    state: {      expanded: element.getAttribute("aria-expanded"),      selected: element.getAttribute("aria-selected"),      checked: element.getAttribute("aria-checked"),      disabled: element.disabled,    },    visible: computed.display !== "none" && computed.visibility !== "hidden",  });}
```
```
// Log what screen reader seesfunction logAccessibleName(element) {  const computed = window.getComputedStyle(element);  console.log({    role: element.getAttribute("role") || element.tagName,    name:      element.getAttribute("aria-label") ||      element.getAttribute("aria-labelledby") ||      element.textContent,    state: {      expanded: element.getAttribute("aria-expanded"),      selected: element.getAttribute("aria-selected"),      checked: element.getAttribute("aria-checked"),      disabled: element.disabled,    },    visible: computed.display !== "none" && computed.visibility !== "hidden",  });}
```
This skill empowers your AI agent to thoroughly evaluate web applications for screen reader compatibility, a crucial aspect of inclusive design. By leveraging expertise across major screen readers like VoiceOver, NVDA, and JAWS, it helps identify and resolve accessibility barriers. From verifying ARIA attributes to ensuring seamless navigation and dynamic content announcements, this tool guides you in building digital experiences that are accessible to everyone. It's an indispensable asset for developers and QA engineers committed to universal access.

# When to Use This Skill
- •Thoroughly validating new feature releases for compliance with WCAG screen reader requirements.
- •Debugging specific accessibility issues reported by users or automated audits, pinpointing the exact screen reader behavior.
- •Conducting comprehensive accessibility audits of existing web applications to identify gaps in assistive technology support.
- •Ensuring critical user flows, such as form submissions or complex data interactions, are fully navigable and understandable via screen readers.

# Pro Tips
- 💡Always test with a minimum set of screen reader/browser combinations (NVDA+Firefox, VoiceOver+Safari) before broader testing.
- 💡Focus on interactive elements, form fields, and dynamic content updates, as these are common areas for screen reader issues.
- 💡Listen carefully to the spoken output and navigate exclusively with keyboard commands, mimicking a real screen reader user experience.

