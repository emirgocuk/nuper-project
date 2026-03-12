# Prevent Hydration Mismatch Without Flickering
Source: https://antigravity.codes/agent-skills/rendering/rendering-hydration-no-flicker

## AI Worker Instructions
When the user requests functionality related to Prevent Hydration Mismatch Without Flickering, follow these guidelines and utilize this context.

## Scraped Content

# Prevent Hydration Mismatch Without Flickering
```
function ThemeWrapper({ children }: { children: ReactNode }) {  // localStorage is not available on server - throws error  const theme = localStorage.getItem('theme') || 'light'    return (    <div className={theme}>      {children}    </div>  )}
```
```
function ThemeWrapper({ children }: { children: ReactNode }) {  // localStorage is not available on server - throws error  const theme = localStorage.getItem('theme') || 'light'    return (    <div className={theme}>      {children}    </div>  )}
```
```
localStorage
```
```
function ThemeWrapper({ children }: { children: ReactNode }) {  const [theme, setTheme] = useState('light')    useEffect(() => {    // Runs after hydration - causes visible flash    const stored = localStorage.getItem('theme')    if (stored) {      setTheme(stored)    }  }, [])    return (    <div className={theme}>      {children}    </div>  )}
```
```
function ThemeWrapper({ children }: { children: ReactNode }) {  const [theme, setTheme] = useState('light')    useEffect(() => {    // Runs after hydration - causes visible flash    const stored = localStorage.getItem('theme')    if (stored) {      setTheme(stored)    }  }, [])    return (    <div className={theme}>      {children}    </div>  )}
```
```
light
```
```
function ThemeWrapper({ children }: { children: ReactNode }) {  return (    <>      <div id="theme-wrapper">        {children}      </div>      <script        dangerouslySetInnerHTML={{          __html:             (function() {              try {                var theme = localStorage.getItem('theme') || 'light';                var el = document.getElementById('theme-wrapper');                if (el) el.className = theme;              } catch (e) {}            })();          ,        }}      />    </>  )}
```
```
function ThemeWrapper({ children }: { children: ReactNode }) {  return (    <>      <div id="theme-wrapper">        {children}      </div>      <script        dangerouslySetInnerHTML={{          __html:             (function() {              try {                var theme = localStorage.getItem('theme') || 'light';                var el = document.getElementById('theme-wrapper');                if (el) el.className = theme;              } catch (e) {}            })();          ,        }}      />    </>  )}
```
```
(function() {              try {                var theme = localStorage.getItem('theme') || 'light';                var el = document.getElementById('theme-wrapper');                if (el) el.className = theme;              } catch (e) {}            })();
```

