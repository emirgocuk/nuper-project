# accessibility
Source: https://antigravity.codes/agent-skills/ui-design/accessibility

## AI Worker Instructions
When the user requests functionality related to accessibility, follow these guidelines and utilize this context.

## Scraped Content

# accessibility
```
div
```
```
<!-- ❌ WRONG - divs with onClick --><div onclick="submit()">Submit</div><div onclick="navigate()">Next page</div><!-- ✅ CORRECT - semantic elements --><button type="submit">Submit</button><a href="/next">Next page</a>
```
```
<!-- ❌ WRONG - divs with onClick --><div onclick="submit()">Submit</div><div onclick="navigate()">Next page</div><!-- ✅ CORRECT - semantic elements --><button type="submit">Submit</button><a href="/next">Next page</a>
```
```
/* ❌ WRONG - removes focus outline */button:focus { outline: none; }/* ✅ CORRECT - custom accessible outline */button:focus-visible {  outline: 2px solid var(--primary);  outline-offset: 2px;}
```
```
/* ❌ WRONG - removes focus outline */button:focus { outline: none; }/* ✅ CORRECT - custom accessible outline */button:focus-visible {  outline: 2px solid var(--primary);  outline-offset: 2px;}
```
```
:focus-visible
```
```
<!-- ❌ WRONG - no alt text --><img src="logo.png"><button><svg>...</svg></button><!-- ✅ CORRECT - proper alternatives --><img src="logo.png" alt="Company Name"><button aria-label="Close dialog"><svg>...</svg></button>
```
```
<!-- ❌ WRONG - no alt text --><img src="logo.png"><button><svg>...</svg></button><!-- ✅ CORRECT - proper alternatives --><img src="logo.png" alt="Company Name"><button aria-label="Close dialog"><svg>...</svg></button>
```
```
Need clickable element?├─ Navigates to another page? → <a href="...">├─ Submits form? → <button type="submit">├─ Opens dialog? → <button aria-haspopup="dialog">└─ Other action? → <button type="button">Grouping content?├─ Self-contained article? → <article>├─ Thematic section? → <section>├─ Navigation links? → <nav>└─ Supplementary info? → <aside>Form element?├─ Text input? → <input type="text">├─ Multiple choice? → <select> or <input type="radio">├─ Toggle? → <input type="checkbox"> or <button aria-pressed>└─ Long text? → <textarea>
```
```
Need clickable element?├─ Navigates to another page? → <a href="...">├─ Submits form? → <button type="submit">├─ Opens dialog? → <button aria-haspopup="dialog">└─ Other action? → <button type="button">Grouping content?├─ Self-contained article? → <article>├─ Thematic section? → <section>├─ Navigation links? → <nav>└─ Supplementary info? → <aside>Form element?├─ Text input? → <input type="text">├─ Multiple choice? → <select> or <input type="radio">├─ Toggle? → <input type="checkbox"> or <button aria-pressed>└─ Long text? → <textarea>
```
```
references/semantic-html.md
```
```
<!-- ❌ WRONG - unnecessary ARIA --><button role="button">Click me</button>  <!-- Button already has role --><!-- ✅ CORRECT - ARIA fills semantic gap --><div role="dialog" aria-labelledby="title" aria-modal="true">  <h2 id="title">Confirm action</h2>  <!-- No HTML dialog yet, so role needed --></div><!-- ✅ BETTER - Use native HTML when available --><dialog aria-labelledby="title">  <h2 id="title">Confirm action</h2></dialog>
```
```
<!-- ❌ WRONG - unnecessary ARIA --><button role="button">Click me</button>  <!-- Button already has role --><!-- ✅ CORRECT - ARIA fills semantic gap --><div role="dialog" aria-labelledby="title" aria-modal="true">  <h2 id="title">Confirm action</h2>  <!-- No HTML dialog yet, so role needed --></div><!-- ✅ BETTER - Use native HTML when available --><dialog aria-labelledby="title">  <h2 id="title">Confirm action</h2></dialog>
```
```
aria-label
```
```
aria-labelledby
```
```
aria-describedby
```
```
aria-live
```
```
aria-expanded
```
```
references/aria-patterns.md
```
```
// Tab order managementfunction Dialog({ onClose }) {  const dialogRef = useRef<HTMLDivElement>(null);  const previousFocus = useRef<HTMLElement | null>(null);  useEffect(() => {    // Save previous focus    previousFocus.current = document.activeElement as HTMLElement;    // Focus first element in dialog    const firstFocusable = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');    (firstFocusable as HTMLElement)?.focus();    // Trap focus within dialog    const handleKeyDown = (e: KeyboardEvent) => {      if (e.key === 'Escape') onClose();      if (e.key === 'Tab') {        // Focus trap logic here      }    };    document.addEventListener('keydown', handleKeyDown);    return () => {      document.removeEventListener('keydown', handleKeyDown);      // Restore focus on close      previousFocus.current?.focus();    };  }, [onClose]);  return <div ref={dialogRef} role="dialog">...</div>;}
```
```
// Tab order managementfunction Dialog({ onClose }) {  const dialogRef = useRef<HTMLDivElement>(null);  const previousFocus = useRef<HTMLElement | null>(null);  useEffect(() => {    // Save previous focus    previousFocus.current = document.activeElement as HTMLElement;    // Focus first element in dialog    const firstFocusable = dialogRef.current?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');    (firstFocusable as HTMLElement)?.focus();    // Trap focus within dialog    const handleKeyDown = (e: KeyboardEvent) => {      if (e.key === 'Escape') onClose();      if (e.key === 'Tab') {        // Focus trap logic here      }    };    document.addEventListener('keydown', handleKeyDown);    return () => {      document.removeEventListener('keydown', handleKeyDown);      // Restore focus on close      previousFocus.current?.focus();    };  }, [onClose]);  return <div ref={dialogRef} role="dialog">...</div>;}
```
```
references/focus-management.md
```
```
/* ❌ WRONG - insufficient contrast */:root {  --background: #ffffff;  --text: #999999;  /* 2.8:1 - fails WCAG AA */}/* ✅ CORRECT - sufficient contrast */:root {  --background: #ffffff;  --text: #595959;  /* 4.6:1 - passes WCAG AA */}
```
```
/* ❌ WRONG - insufficient contrast */:root {  --background: #ffffff;  --text: #999999;  /* 2.8:1 - fails WCAG AA */}/* ✅ CORRECT - sufficient contrast */:root {  --background: #ffffff;  --text: #595959;  /* 4.6:1 - passes WCAG AA */}
```
```
references/color-contrast.md
```
```
<!-- ❌ WRONG - placeholder is not a label --><input type="email" placeholder="Email address"><!-- ✅ CORRECT - proper label --><label for="email">Email address</label><input type="email" id="email" name="email" required aria-required="true">
```
```
<!-- ❌ WRONG - placeholder is not a label --><input type="email" placeholder="Email address"><!-- ✅ CORRECT - proper label --><label for="email">Email address</label><input type="email" id="email" name="email" required aria-required="true">
```
```
<label for="email">Email address</label><input  type="email"  id="email"  name="email"  aria-invalid="true"  aria-describedby="email-error"><span id="email-error" role="alert">  Please enter a valid email address</span>
```
```
<label for="email">Email address</label><input  type="email"  id="email"  name="email"  aria-invalid="true"  aria-describedby="email-error"><span id="email-error" role="alert">  Please enter a valid email address</span>
```
```
<div role="alert" aria-live="assertive" aria-atomic="true">  Form submission failed. Please fix the errors above.</div>
```
```
<div role="alert" aria-live="assertive" aria-atomic="true">  Form submission failed. Please fix the errors above.</div>
```
```
references/forms-validation.md
```
```
outline: none
```
```
aria-live
```
```
div
```
```
onClick
```
```
button
```
```
tabindex
```
```
role="presentation"
```
```
<label>
```
```
<html lang="en">
```
```
<span lang="es">
```
```
1. Unplug mouse or hide cursor2. Tab through entire page   - Can you reach all interactive elements?   - Can you activate all buttons/links?   - Is focus order logical?3. Use Enter/Space to activate4. Use Escape to close dialogs5. Use arrow keys in menus/tabs
```
```
1. Unplug mouse or hide cursor2. Tab through entire page   - Can you reach all interactive elements?   - Can you activate all buttons/links?   - Is focus order logical?3. Use Enter/Space to activate4. Use Escape to close dialogs5. Use arrow keys in menus/tabs
```
```
interface DialogProps {  isOpen: boolean;  onClose: () => void;  title: string;  children: React.ReactNode;}function Dialog({ isOpen, onClose, title, children }: DialogProps) {  const dialogRef = useRef<HTMLDivElement>(null);  useEffect(() => {    if (!isOpen) return;    const previousFocus = document.activeElement as HTMLElement;    // Focus first focusable element    const firstFocusable = dialogRef.current?.querySelector(      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'    ) as HTMLElement;    firstFocusable?.focus();    // Focus trap    const handleKeyDown = (e: KeyboardEvent) => {      if (e.key === 'Escape') {        onClose();      }      if (e.key === 'Tab') {        const focusableElements = dialogRef.current?.querySelectorAll(          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'        );        if (!focusableElements?.length) return;        const first = focusableElements[0] as HTMLElement;        const last = focusableElements[focusableElements.length - 1] as HTMLElement;        if (e.shiftKey && document.activeElement === first) {          e.preventDefault();          last.focus();        } else if (!e.shiftKey && document.activeElement === last) {          e.preventDefault();          first.focus();        }      }    };    document.addEventListener('keydown', handleKeyDown);    return () => {      document.removeEventListener('keydown', handleKeyDown);      previousFocus?.focus();    };  }, [isOpen, onClose]);  if (!isOpen) return null;  return (    <>      {/* Backdrop */}      <div        className="dialog-backdrop"        onClick={onClose}        aria-hidden="true"      />      {/* Dialog */}      <div        ref={dialogRef}        role="dialog"        aria-modal="true"        aria-labelledby="dialog-title"        className="dialog"      >        <h2 id="dialog-title">{title}</h2>        <div className="dialog-content">{children}</div>        <button onClick={onClose} aria-label="Close dialog">×</button>      </div>    </>  );}
```
```
interface DialogProps {  isOpen: boolean;  onClose: () => void;  title: string;  children: React.ReactNode;}function Dialog({ isOpen, onClose, title, children }: DialogProps) {  const dialogRef = useRef<HTMLDivElement>(null);  useEffect(() => {    if (!isOpen) return;    const previousFocus = document.activeElement as HTMLElement;    // Focus first focusable element    const firstFocusable = dialogRef.current?.querySelector(      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'    ) as HTMLElement;    firstFocusable?.focus();    // Focus trap    const handleKeyDown = (e: KeyboardEvent) => {      if (e.key === 'Escape') {        onClose();      }      if (e.key === 'Tab') {        const focusableElements = dialogRef.current?.querySelectorAll(          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'        );        if (!focusableElements?.length) return;        const first = focusableElements[0] as HTMLElement;        const last = focusableElements[focusableElements.length - 1] as HTMLElement;        if (e.shiftKey && document.activeElement === first) {          e.preventDefault();          last.focus();        } else if (!e.shiftKey && document.activeElement === last) {          e.preventDefault();          first.focus();        }      }    };    document.addEventListener('keydown', handleKeyDown);    return () => {      document.removeEventListener('keydown', handleKeyDown);      previousFocus?.focus();    };  }, [isOpen, onClose]);  if (!isOpen) return null;  return (    <>      {/* Backdrop */}      <div        className="dialog-backdrop"        onClick={onClose}        aria-hidden="true"      />      {/* Dialog */}      <div        ref={dialogRef}        role="dialog"        aria-modal="true"        aria-labelledby="dialog-title"        className="dialog"      >        <h2 id="dialog-title">{title}</h2>        <div className="dialog-content">{children}</div>        <button onClick={onClose} aria-label="Close dialog">×</button>      </div>    </>  );}
```
```
function Tabs({ tabs }: { tabs: Array<{ label: string; content: React.ReactNode }> }) {  const [activeIndex, setActiveIndex] = useState(0);  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {    if (e.key === 'ArrowLeft') {      e.preventDefault();      const newIndex = index === 0 ? tabs.length - 1 : index - 1;      setActiveIndex(newIndex);    } else if (e.key === 'ArrowRight') {      e.preventDefault();      const newIndex = index === tabs.length - 1 ? 0 : index + 1;      setActiveIndex(newIndex);    } else if (e.key === 'Home') {      e.preventDefault();      setActiveIndex(0);    } else if (e.key === 'End') {      e.preventDefault();      setActiveIndex(tabs.length - 1);    }  };  return (    <div>      <div role="tablist" aria-label="Content tabs">        {tabs.map((tab, index) => (          <button            key={index}            role="tab"            aria-selected={activeIndex === index}            aria-controls={panel-${index}}            id={tab-${index}}            tabIndex={activeIndex === index ? 0 : -1}            onClick={() => setActiveIndex(index)}            onKeyDown={(e) => handleKeyDown(e, index)}          >            {tab.label}          </button>        ))}      </div>      {tabs.map((tab, index) => (        <div          key={index}          role="tabpanel"          id={panel-${index}}          aria-labelledby={tab-${index}}          hidden={activeIndex !== index}          tabIndex={0}        >          {tab.content}        </div>      ))}    </div>  );}
```
```
function Tabs({ tabs }: { tabs: Array<{ label: string; content: React.ReactNode }> }) {  const [activeIndex, setActiveIndex] = useState(0);  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {    if (e.key === 'ArrowLeft') {      e.preventDefault();      const newIndex = index === 0 ? tabs.length - 1 : index - 1;      setActiveIndex(newIndex);    } else if (e.key === 'ArrowRight') {      e.preventDefault();      const newIndex = index === tabs.length - 1 ? 0 : index + 1;      setActiveIndex(newIndex);    } else if (e.key === 'Home') {      e.preventDefault();      setActiveIndex(0);    } else if (e.key === 'End') {      e.preventDefault();      setActiveIndex(tabs.length - 1);    }  };  return (    <div>      <div role="tablist" aria-label="Content tabs">        {tabs.map((tab, index) => (          <button            key={index}            role="tab"            aria-selected={activeIndex === index}            aria-controls={panel-${index}}            id={tab-${index}}            tabIndex={activeIndex === index ? 0 : -1}            onClick={() => setActiveIndex(index)}            onKeyDown={(e) => handleKeyDown(e, index)}          >            {tab.label}          </button>        ))}      </div>      {tabs.map((tab, index) => (        <div          key={index}          role="tabpanel"          id={panel-${index}}          aria-labelledby={tab-${index}}          hidden={activeIndex !== index}          tabIndex={0}        >          {tab.content}        </div>      ))}    </div>  );}
```
```
panel-${index}
```
```
tab-${index}
```
```
panel-${index}
```
```
tab-${index}
```
```
<!-- Place at very top of body --><a href="#main-content" class="skip-link">  Skip to main content</a><style>.skip-link {  position: absolute;  top: -40px;  left: 0;  background: var(--primary);  color: white;  padding: 8px 16px;  z-index: 9999;}.skip-link:focus {  top: 0;}</style><!-- Then in your layout --><main id="main-content" tabindex="-1">  <!-- Page content --></main>
```
```
<!-- Place at very top of body --><a href="#main-content" class="skip-link">  Skip to main content</a><style>.skip-link {  position: absolute;  top: -40px;  left: 0;  background: var(--primary);  color: white;  padding: 8px 16px;  z-index: 9999;}.skip-link:focus {  top: 0;}</style><!-- Then in your layout --><main id="main-content" tabindex="-1">  <!-- Page content --></main>
```
```
function ContactForm() {  const [errors, setErrors] = useState<Record<string, string>>({});  const [touched, setTouched] = useState<Record<string, boolean>>({});  const validateEmail = (email: string) => {    if (!email) return 'Email is required';    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email is invalid';    return '';  };  const handleBlur = (field: string, value: string) => {    setTouched(prev => ({ ...prev, [field]: true }));    const error = validateEmail(value);    setErrors(prev => ({ ...prev, [field]: error }));  };  return (    <form>      <div>        <label htmlFor="email">Email address *</label>        <input          type="email"          id="email"          name="email"          required          aria-required="true"          aria-invalid={touched.email && !!errors.email}          aria-describedby={errors.email ? 'email-error' : undefined}          onBlur={(e) => handleBlur('email', e.target.value)}        />        {touched.email && errors.email && (          <span id="email-error" role="alert" className="error">            {errors.email}          </span>        )}      </div>      <button type="submit">Submit</button>      {/* Global form error */}      <div role="alert" aria-live="assertive" aria-atomic="true">        {/* Dynamic error message appears here */}      </div>    </form>  );}
```
```
function ContactForm() {  const [errors, setErrors] = useState<Record<string, string>>({});  const [touched, setTouched] = useState<Record<string, boolean>>({});  const validateEmail = (email: string) => {    if (!email) return 'Email is required';    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Email is invalid';    return '';  };  const handleBlur = (field: string, value: string) => {    setTouched(prev => ({ ...prev, [field]: true }));    const error = validateEmail(value);    setErrors(prev => ({ ...prev, [field]: error }));  };  return (    <form>      <div>        <label htmlFor="email">Email address *</label>        <input          type="email"          id="email"          name="email"          required          aria-required="true"          aria-invalid={touched.email && !!errors.email}          aria-describedby={errors.email ? 'email-error' : undefined}          onBlur={(e) => handleBlur('email', e.target.value)}        />        {touched.email && errors.email && (          <span id="email-error" role="alert" className="error">            {errors.email}          </span>        )}      </div>      <button type="submit">Submit</button>      {/* Global form error */}      <div role="alert" aria-live="assertive" aria-atomic="true">        {/* Dynamic error message appears here */}      </div>    </form>  );}
```
```
<!-- Polite: Wait for screen reader to finish current announcement --><div aria-live="polite">New messages: 3</div><!-- Assertive: Interrupt immediately --><div aria-live="assertive" role="alert">  Error: Form submission failed</div><!-- Off: Don't announce (default) --><div aria-live="off">Loading...</div>
```
```
<!-- Polite: Wait for screen reader to finish current announcement --><div aria-live="polite">New messages: 3</div><!-- Assertive: Interrupt immediately --><div aria-live="assertive" role="alert">  Error: Form submission failed</div><!-- Off: Don't announce (default) --><div aria-live="off">Loading...</div>
```
```
polite
```
```
assertive
```
```
aria-atomic="true"
```
```
function App() {  const location = useLocation();  const mainRef = useRef<HTMLElement>(null);  useEffect(() => {    // Focus main content on route change    mainRef.current?.focus();    // Announce page title to screen readers    const title = document.title;    const announcement = document.createElement('div');    announcement.setAttribute('role', 'status');    announcement.setAttribute('aria-live', 'polite');    announcement.textContent = Navigated to ${title};    document.body.appendChild(announcement);    setTimeout(() => announcement.remove(), 1000);  }, [location.pathname]);  return <main ref={mainRef} tabIndex={-1} id="main-content">...</main>;}
```
```
function App() {  const location = useLocation();  const mainRef = useRef<HTMLElement>(null);  useEffect(() => {    // Focus main content on route change    mainRef.current?.focus();    // Announce page title to screen readers    const title = document.title;    const announcement = document.createElement('div');    announcement.setAttribute('role', 'status');    announcement.setAttribute('aria-live', 'polite');    announcement.textContent = Navigated to ${title};    document.body.appendChild(announcement);    setTimeout(() => announcement.remove(), 1000);  }, [location.pathname]);  return <main ref={mainRef} tabIndex={-1} id="main-content">...</main>;}
```
```
Navigated to ${title}
```
```
<table>  <caption>Monthly sales by region</caption>  <thead>    <tr>      <th scope="col">Region</th>      <th scope="col">Q1</th>      <th scope="col">Q2</th>    </tr>  </thead>  <tbody>    <tr>      <th scope="row">North</th>      <td>$10,000</td>      <td>$12,000</td>    </tr>  </tbody></table>
```
```
<table>  <caption>Monthly sales by region</caption>  <thead>    <tr>      <th scope="col">Region</th>      <th scope="col">Q1</th>      <th scope="col">Q2</th>    </tr>  </thead>  <tbody>    <tr>      <th scope="row">North</th>      <td>$10,000</td>      <td>$12,000</td>    </tr>  </tbody></table>
```
```
<caption>
```
```
scope="col"
```
```
scope="row"
```
```
*:focus-visible {  outline: 2px solid var(--primary);  outline-offset: 2px;}
```
```
*:focus-visible {  outline: 2px solid var(--primary);  outline-offset: 2px;}
```
```
<div aria-live="polite">
```
```
<html lang="en">
```
```
references/wcag-checklist.md
```
```
/a11y-auditor
```
```
<div onclick="doThing()">Click</div>
```
```
<button type="button" onclick="doThing()">Click</button>
```
```
<span onclick="submit()">Submit</span>
```
```
<button type="submit">Submit</button>
```
```
<a href="#" onclick="doThing()">Action</a>
```
```
<button type="button" onclick="doThing()">Action</button>
```
```
<a href="javascript:void(0)">Action</a>
```
```
<button type="button">Action</button>
```
```
<div class="button">Click</div>
```
```
<button>Click</button>
```
```
<button>
```
```
<a>
```
```
*:focus { outline: none; }
```
```
*:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
```
```
button:focus { outline: 0; }
```
```
button:focus-visible { outline: 2px solid var(--primary); }
```
```
:focus-visible
```
```
<img src="logo.png">
```
```
<img src="logo.png" alt="Company Name">
```
```
<img src="icon.png" alt="">
```
```
<button aria-label="Close"><img src="icon.png" alt=""></button>
```
```
<div style="background-image: url(...)">
```
```
<img src="..." alt="Description">
```
```
alt=""
```
```
<input placeholder="Email">
```
```
<label for="email">Email</label><input type="email" id="email" placeholder="name@example.com">
```
```
<input aria-label="Email">
```
```
<label for="email">Email</label><input type="email" id="email">
```
```
<label for="email">Email</label><input id="email">
```
```
<h1>Title</h1><h3>Subtitle</h3>
```
```
<h1>Title</h1><h2>Subtitle</h2>
```
```
<h3 class="big">Title</h3>
```
```
<h2 class="smaller">Title</h2>
```
```
<h1>
```
```
<h1>
```
```
#999
```
```
#595959
```
```
#737373
```
```
#4d90fe
```
```
#0066cc
```
```
#004080
```
```
#ef4444
```
```
#b91c1c
```
```
<button role="button">Click</button>
```
```
<button>Click</button>
```
```
<div role="button">Click</div>
```
```
<button>Click</button>
```
```
<button aria-hidden="true">Click</button>
```
```
tabindex="1"
```
```
tabindex="0"
```
```
<button>
```
```
<div class="header">
```
```
<header>
```
```
<div class="nav">
```
```
<nav>
```
```
<div class="article">
```
```
<article>
```
```
<div class="section">
```
```
<section>
```
```
<span onclick="...">
```
```
<button>
```
```
<a href="/article">Click here</a>
```
```
<a href="/article">Read our accessibility guide</a>
```
```
<a href="/more">Read more</a>
```
```
<a href="/article" aria-label="Read more about accessibility">Read more</a>
```
```
<input aria-invalid="true" aria-describedby="error">
```
```
<span id="error" role="alert">Error message</span>
```
```
<input required aria-required="true">
```
```
<div aria-live="polite">New content</div>
```
```
<div role="alert">Error message</div>
```
```
<div role="status">Update</div>
```
```
<table>
```
```
<table><thead><tr><th scope="col">Header</th></tr></thead>
```
```
<th scope="col">
```
```
<th scope="row">
```
```
<table><caption>Table description</caption>
```
```
<a href="#main" class="skip-link">Skip to main content</a>
```
```
<main id="main" tabindex="-1">
```
```
<video autoplay>
```
```
<video controls>
```
```
<audio autoplay>
```
```
<audio controls>
```
```
<html>
```
```
<html lang="en">
```
```
<span lang="fr">bonjour</span>
```
```
✅ Completed. Please test:1. Tab through with keyboard only2. Run axe DevTools scan3. Test with screen reader (NVDA or VoiceOver)4. Verify 4.5:1 contrast on all text
```
```
✅ Completed. Please test:1. Tab through with keyboard only2. Run axe DevTools scan3. Test with screen reader (NVDA or VoiceOver)4. Verify 4.5:1 contrast on all text
```
Building an inclusive web is not just good practice, it's essential. This AI Agent Skill empowers developers to write code that meets WCAG 2.1 Level AA standards, ensuring your applications are usable by everyone, regardless of ability. From foundational semantic HTML to critical focus management and providing essential text alternatives, this skill guides you through the core principles of web accessibility. Leverage this tool to create digital experiences that are robust, perceivable, operable, and understandable for all users, elevating the quality and reach of your web projects.

# When to Use This Skill
- •Developing new web applications or features, ensuring accessibility is baked in from the start.
- •Auditing existing website codebases to identify and rectify WCAG 2.1 AA violations.
- •Refactoring UI components to improve keyboard navigability and screen reader compatibility.
- •Educating development teams on best practices for inclusive design and coding standards.

# Pro Tips
- 💡Combine automated accessibility checkers with manual keyboard navigation and screen reader testing for comprehensive coverage.
- 💡Prioritize proper semantic HTML structure, as it provides the foundation for most accessibility features without extra effort.
- 💡Always test focus order and visibility using keyboard navigation (Tab and Shift+Tab) to ensure all interactive elements are reachable.

