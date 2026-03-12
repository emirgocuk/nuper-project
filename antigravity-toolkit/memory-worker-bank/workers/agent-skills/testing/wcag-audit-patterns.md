# wcag-audit-patterns
Source: https://antigravity.codes/agent-skills/testing/wcag-audit-patterns

## AI Worker Instructions
When the user requests functionality related to wcag-audit-patterns, follow these guidelines and utilize this context.

## Scraped Content

# wcag-audit-patterns
```
Perceivable:  Can users perceive the content?Operable:     Can users operate the interface?Understandable: Can users understand the content?Robust:       Does it work with assistive tech?
```
```
Perceivable:  Can users perceive the content?Operable:     Can users operate the interface?Understandable: Can users understand the content?Robust:       Does it work with assistive tech?
```
```
Critical (Blockers):├── Missing alt text for functional images├── No keyboard access to interactive elements├── Missing form labels└── Auto-playing media without controlsSerious:├── Insufficient color contrast├── Missing skip links├── Inaccessible custom widgets└── Missing page titlesModerate:├── Missing language attribute├── Unclear link text├── Missing landmarks└── Improper heading hierarchy
```
```
Critical (Blockers):├── Missing alt text for functional images├── No keyboard access to interactive elements├── Missing form labels└── Auto-playing media without controlsSerious:├── Insufficient color contrast├── Missing skip links├── Inaccessible custom widgets└── Missing page titlesModerate:├── Missing language attribute├── Unclear link text├── Missing landmarks└── Improper heading hierarchy
```
```
## 1.1 Text Alternatives### 1.1.1 Non-text Content (Level A)- [ ] All images have alt text- [ ] Decorative images have alt=""- [ ] Complex images have long descriptions- [ ] Icons with meaning have accessible names- [ ] CAPTCHAs have alternativesCheck:html<!-- Good --><img src="chart.png" alt="Sales increased 25% from Q1 to Q2" /><img src="decorative-line.png" alt="" /><!-- Bad --><img src="chart.png" /><img src="decorative-line.png" alt="decorative line" />
```
```
## 1.1 Text Alternatives### 1.1.1 Non-text Content (Level A)- [ ] All images have alt text- [ ] Decorative images have alt=""- [ ] Complex images have long descriptions- [ ] Icons with meaning have accessible names- [ ] CAPTCHAs have alternativesCheck:
```
```
## 1.1 Text Alternatives### 1.1.1 Non-text Content (Level A)- [ ] All images have alt text- [ ] Decorative images have alt=""- [ ] Complex images have long descriptions- [ ] Icons with meaning have accessible names- [ ] CAPTCHAs have alternativesCheck:
```
```

```
```

```
```
<!-- Heading hierarchy --><h1>Page Title</h1><h2>Section</h2><h3>Subsection</h3><h2>Another Section</h2><!-- Table headers --><table>  <thead>    <tr>      <th scope="col">Name</th>      <th scope="col">Price</th>    </tr>  </thead></table>
```
```
<!-- Heading hierarchy --><h1>Page Title</h1><h2>Section</h2><h3>Subsection</h3><h2>Another Section</h2><!-- Table headers --><table>  <thead>    <tr>      <th scope="col">Name</th>      <th scope="col">Price</th>    </tr>  </thead></table>
```
```
### Operable (Principle 2)markdown## 2.1 Keyboard Accessible### 2.1.1 Keyboard (Level A)- [ ] All functionality keyboard accessible- [ ] No keyboard traps- [ ] Tab order is logical- [ ] Custom widgets are keyboard operableCheck:// Custom button must be keyboard accessible<div role="button" tabindex="0"     onkeydown="if(event.key === 'Enter' || event.key === ' ') activate()">
```
```
### Operable (Principle 2)
```
```
### Operable (Principle 2)
```
```
// Custom button must be keyboard accessible<div role="button" tabindex="0"     onkeydown="if(event.key === 'Enter' || event.key === ' ') activate()">
```
```
// Custom button must be keyboard accessible<div role="button" tabindex="0"     onkeydown="if(event.key === 'Enter' || event.key === ' ') activate()">
```
```
@media (prefers-reduced-motion: reduce) {  * {    animation: none !important;    transition: none !important;  }}
```
```
@media (prefers-reduced-motion: reduce) {  * {    animation: none !important;    transition: none !important;  }}
```
```
<a href="#main" class="skip-link">Skip to main content</a><main id="main">...</main>
```
```
<a href="#main" class="skip-link">Skip to main content</a><main id="main">...</main>
```
```
<!-- Bad --><a href="report.pdf">Click here</a><!-- Good --><a href="report.pdf">Download Q4 Sales Report (PDF)</a>
```
```
<!-- Bad --><a href="report.pdf">Click here</a><!-- Good --><a href="report.pdf">Download Q4 Sales Report (PDF)</a>
```
```
:focus {  outline: 3px solid #005fcc;  outline-offset: 2px;}
```
```
:focus {  outline: 3px solid #005fcc;  outline-offset: 2px;}
```
```
### Understandable (Principle 3)markdown## 3.1 Readable### 3.1.1 Language of Page (Level A)- [ ] HTML lang attribute set- [ ] Language correct for content<html lang="en">
```
```
### Understandable (Principle 3)
```
```
### Understandable (Principle 3)
```
```
<html lang="en">
```
```
<html lang="en">
```
```
<p>The French word <span lang="fr">bonjour</span> means hello.</p>
```
```
<p>The French word <span lang="fr">bonjour</span> means hello.</p>
```
```
<input aria-describedby="email-error" aria-invalid="true" /><span id="email-error" role="alert">Please enter valid email</span>
```
```
<input aria-describedby="email-error" aria-invalid="true" /><span id="email-error" role="alert">Please enter valid email</span>
```
```
### Robust (Principle 4)markdown## 4.1 Compatible### 4.1.1 Parsing (Level A) - Obsolete in WCAG 2.2- [ ] Valid HTML (good practice)- [ ] No duplicate IDs- [ ] Complete start/end tags### 4.1.2 Name, Role, Value (Level A)- [ ] Custom widgets have accessible names- [ ] ARIA roles correct- [ ] State changes announced<!-- Accessible custom checkbox --><div role="checkbox"     aria-checked="false"     tabindex="0"     aria-labelledby="label"></div><span id="label">Accept terms</span>
```
```
### Robust (Principle 4)
```
```
### Robust (Principle 4)
```
```
<!-- Accessible custom checkbox --><div role="checkbox"     aria-checked="false"     tabindex="0"     aria-labelledby="label"></div><span id="label">Accept terms</span>
```
```
<!-- Accessible custom checkbox --><div role="checkbox"     aria-checked="false"     tabindex="0"     aria-labelledby="label"></div><span id="label">Accept terms</span>
```
```
<div role="status" aria-live="polite">3 items added to cart</div><div role="alert" aria-live="assertive">Error: Form submission failed</div>
```
```
<div role="status" aria-live="polite">3 items added to cart</div><div role="alert" aria-live="assertive">Error: Form submission failed</div>
```
```
## Automated Testingjavascript// axe-core integrationconst axe = require('axe-core');async function runAccessibilityAudit(page) {  await page.addScriptTag({ path: require.resolve('axe-core') });  const results = await page.evaluate(async () => {    return await axe.run(document, {      runOnly: {        type: 'tag',        values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']      }    });  });  return {    violations: results.violations,    passes: results.passes,    incomplete: results.incomplete  };}// Playwright test exampletest('should have no accessibility violations', async ({ page }) => {  await page.goto('/');  const results = await runAccessibilityAudit(page);  expect(results.violations).toHaveLength(0);});
```
```
## Automated Testing
```
```
## Automated Testing
```
```

```
```

```
```
## Remediation Patterns### Fix: Missing Form Labels
```
```
## Remediation Patterns### Fix: Missing Form Labels
```
```
### Fix: Insufficient Color Contrast
```
```
### Fix: Insufficient Color Contrast
```
```
### Fix: Keyboard Navigation
```
```
### Fix: Keyboard Navigation
```
This AI Agent Skill provides a structured framework for ensuring your web applications meet the highest accessibility standards. Dive into comprehensive WCAG 2.2 guidelines, understand the critical POUR principles, and learn to identify and resolve common violations efficiently. Whether you're a developer striving for inclusive design, a QA engineer validating compliance, or a project manager aiming for legal adherence, this skill equips you with the tools and knowledge to build truly accessible digital experiences. Leverage its patterns for automated tests, manual checks, and effective remediation strategies to create a more usable web for everyone.

# When to Use This Skill
- •Performing comprehensive WCAG 2.2 audits on new or existing web platforms.
- •Identifying and remediating critical accessibility violations to improve user experience.
- •Designing and implementing accessible UI components compliant with POUR principles.
- •Ensuring legal compliance with ADA, Section 508, or preparing for VPAT reports.

# Pro Tips
- 💡Always combine automated tools (like Lighthouse or Axe) with thorough manual testing, especially for keyboard navigation and screen reader experience.
- 💡Prioritize fixing Critical and Serious violations first, as these often create complete blockers for users with disabilities.
- 💡Integrate accessibility checks into your CI/CD pipeline to catch regressions early and ensure continuous compliance.

