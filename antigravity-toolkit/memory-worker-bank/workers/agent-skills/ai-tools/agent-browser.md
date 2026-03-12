# agent-browser
Source: https://antigravity.codes/agent-skills/ai-tools/agent-browser

## AI Worker Instructions
When the user requests functionality related to agent-browser, follow these guidelines and utilize this context.

## Scraped Content

# agent-browser
```
agent-browser open <url>        # Navigate to pageagent-browser snapshot -i       # Get interactive elements with refsagent-browser click @e1         # Click element by refagent-browser fill @e2 "text"   # Fill input by refagent-browser close             # Close browser
```
```
agent-browser open <url>        # Navigate to pageagent-browser snapshot -i       # Get interactive elements with refsagent-browser click @e1         # Click element by refagent-browser fill @e2 "text"   # Fill input by refagent-browser close             # Close browser
```
```
agent-browser open <url>
```
```
agent-browser snapshot -i
```
```
@e1
```
```
@e2
```
```
agent-browser open <url>      # Navigate to URL (aliases: goto, navigate)                              # Supports: https://, http://, file://, about:, data://                              # Auto-prepends https:// if no protocol givenagent-browser back            # Go backagent-browser forward         # Go forwardagent-browser reload          # Reload pageagent-browser close           # Close browser (aliases: quit, exit)agent-browser connect 9222    # Connect to browser via CDP port
```
```
agent-browser open <url>      # Navigate to URL (aliases: goto, navigate)                              # Supports: https://, http://, file://, about:, data://                              # Auto-prepends https:// if no protocol givenagent-browser back            # Go backagent-browser forward         # Go forwardagent-browser reload          # Reload pageagent-browser close           # Close browser (aliases: quit, exit)agent-browser connect 9222    # Connect to browser via CDP port
```
```
agent-browser snapshot            # Full accessibility treeagent-browser snapshot -i         # Interactive elements only (recommended)agent-browser snapshot -c         # Compact outputagent-browser snapshot -d 3       # Limit depth to 3agent-browser snapshot -s "#main" # Scope to CSS selector
```
```
agent-browser snapshot            # Full accessibility treeagent-browser snapshot -i         # Interactive elements only (recommended)agent-browser snapshot -c         # Compact outputagent-browser snapshot -d 3       # Limit depth to 3agent-browser snapshot -s "#main" # Scope to CSS selector
```
```
agent-browser click @e1           # Clickagent-browser dblclick @e1        # Double-clickagent-browser focus @e1           # Focus elementagent-browser fill @e2 "text"     # Clear and typeagent-browser type @e2 "text"     # Type without clearingagent-browser press Enter         # Press key (alias: key)agent-browser press Control+a     # Key combinationagent-browser keydown Shift       # Hold key downagent-browser keyup Shift         # Release keyagent-browser hover @e1           # Hoveragent-browser check @e1           # Check checkboxagent-browser uncheck @e1         # Uncheck checkboxagent-browser select @e1 "value"  # Select dropdown optionagent-browser select @e1 "a" "b"  # Select multiple optionsagent-browser scroll down 500     # Scroll page (default: down 300px)agent-browser scrollintoview @e1  # Scroll element into view (alias: scrollinto)agent-browser drag @e1 @e2        # Drag and dropagent-browser upload @e1 file.pdf # Upload files
```
```
agent-browser click @e1           # Clickagent-browser dblclick @e1        # Double-clickagent-browser focus @e1           # Focus elementagent-browser fill @e2 "text"     # Clear and typeagent-browser type @e2 "text"     # Type without clearingagent-browser press Enter         # Press key (alias: key)agent-browser press Control+a     # Key combinationagent-browser keydown Shift       # Hold key downagent-browser keyup Shift         # Release keyagent-browser hover @e1           # Hoveragent-browser check @e1           # Check checkboxagent-browser uncheck @e1         # Uncheck checkboxagent-browser select @e1 "value"  # Select dropdown optionagent-browser select @e1 "a" "b"  # Select multiple optionsagent-browser scroll down 500     # Scroll page (default: down 300px)agent-browser scrollintoview @e1  # Scroll element into view (alias: scrollinto)agent-browser drag @e1 @e2        # Drag and dropagent-browser upload @e1 file.pdf # Upload files
```
```
agent-browser get text @e1        # Get element textagent-browser get html @e1        # Get innerHTMLagent-browser get value @e1       # Get input valueagent-browser get attr @e1 href   # Get attributeagent-browser get title           # Get page titleagent-browser get url             # Get current URLagent-browser get count ".item"   # Count matching elementsagent-browser get box @e1         # Get bounding boxagent-browser get styles @e1      # Get computed styles (font, color, bg, etc.)
```
```
agent-browser get text @e1        # Get element textagent-browser get html @e1        # Get innerHTMLagent-browser get value @e1       # Get input valueagent-browser get attr @e1 href   # Get attributeagent-browser get title           # Get page titleagent-browser get url             # Get current URLagent-browser get count ".item"   # Count matching elementsagent-browser get box @e1         # Get bounding boxagent-browser get styles @e1      # Get computed styles (font, color, bg, etc.)
```
```
agent-browser is visible @e1      # Check if visibleagent-browser is enabled @e1      # Check if enabledagent-browser is checked @e1      # Check if checked
```
```
agent-browser is visible @e1      # Check if visibleagent-browser is enabled @e1      # Check if enabledagent-browser is checked @e1      # Check if checked
```
```
agent-browser screenshot          # Screenshot to stdoutagent-browser screenshot path.png # Save to fileagent-browser screenshot --full   # Full pageagent-browser pdf output.pdf      # Save as PDF
```
```
agent-browser screenshot          # Screenshot to stdoutagent-browser screenshot path.png # Save to fileagent-browser screenshot --full   # Full pageagent-browser pdf output.pdf      # Save as PDF
```
```
agent-browser record start ./demo.webm    # Start recording (uses current URL + state)agent-browser click @e1                   # Perform actionsagent-browser record stop                 # Stop and save videoagent-browser record restart ./take2.webm # Stop current + start new recording
```
```
agent-browser record start ./demo.webm    # Start recording (uses current URL + state)agent-browser click @e1                   # Perform actionsagent-browser record stop                 # Stop and save videoagent-browser record restart ./take2.webm # Stop current + start new recording
```
```
agent-browser wait @e1                     # Wait for elementagent-browser wait 2000                    # Wait millisecondsagent-browser wait --text "Success"        # Wait for text (or -t)agent-browser wait --url "**/dashboard"    # Wait for URL pattern (or -u)agent-browser wait --load networkidle      # Wait for network idle (or -l)agent-browser wait --fn "window.ready"     # Wait for JS condition (or -f)
```
```
agent-browser wait @e1                     # Wait for elementagent-browser wait 2000                    # Wait millisecondsagent-browser wait --text "Success"        # Wait for text (or -t)agent-browser wait --url "**/dashboard"    # Wait for URL pattern (or -u)agent-browser wait --load networkidle      # Wait for network idle (or -l)agent-browser wait --fn "window.ready"     # Wait for JS condition (or -f)
```
```
agent-browser mouse move 100 200      # Move mouseagent-browser mouse down left         # Press buttonagent-browser mouse up left           # Release buttonagent-browser mouse wheel 100         # Scroll wheel
```
```
agent-browser mouse move 100 200      # Move mouseagent-browser mouse down left         # Press buttonagent-browser mouse up left           # Release buttonagent-browser mouse wheel 100         # Scroll wheel
```
```
agent-browser find role button click --name "Submit"agent-browser find text "Sign In" clickagent-browser find text "Sign In" click --exact      # Exact match onlyagent-browser find label "Email" fill "user@test.com"agent-browser find placeholder "Search" type "query"agent-browser find alt "Logo" clickagent-browser find title "Close" clickagent-browser find testid "submit-btn" clickagent-browser find first ".item" clickagent-browser find last ".item" clickagent-browser find nth 2 "a" hover
```
```
agent-browser find role button click --name "Submit"agent-browser find text "Sign In" clickagent-browser find text "Sign In" click --exact      # Exact match onlyagent-browser find label "Email" fill "user@test.com"agent-browser find placeholder "Search" type "query"agent-browser find alt "Logo" clickagent-browser find title "Close" clickagent-browser find testid "submit-btn" clickagent-browser find first ".item" clickagent-browser find last ".item" clickagent-browser find nth 2 "a" hover
```
```
agent-browser set viewport 1920 1080          # Set viewport sizeagent-browser set device "iPhone 14"          # Emulate deviceagent-browser set geo 37.7749 -122.4194       # Set geolocation (alias: geolocation)agent-browser set offline on                  # Toggle offline modeagent-browser set headers '{"X-Key":"v"}'     # Extra HTTP headersagent-browser set credentials user pass       # HTTP basic auth (alias: auth)agent-browser set media dark                  # Emulate color schemeagent-browser set media light reduced-motion  # Light mode + reduced motion
```
```
agent-browser set viewport 1920 1080          # Set viewport sizeagent-browser set device "iPhone 14"          # Emulate deviceagent-browser set geo 37.7749 -122.4194       # Set geolocation (alias: geolocation)agent-browser set offline on                  # Toggle offline modeagent-browser set headers '{"X-Key":"v"}'     # Extra HTTP headersagent-browser set credentials user pass       # HTTP basic auth (alias: auth)agent-browser set media dark                  # Emulate color schemeagent-browser set media light reduced-motion  # Light mode + reduced motion
```
```
agent-browser cookies                     # Get all cookiesagent-browser cookies set name value      # Set cookieagent-browser cookies clear               # Clear cookiesagent-browser storage local               # Get all localStorageagent-browser storage local key           # Get specific keyagent-browser storage local set k v       # Set valueagent-browser storage local clear         # Clear all
```
```
agent-browser cookies                     # Get all cookiesagent-browser cookies set name value      # Set cookieagent-browser cookies clear               # Clear cookiesagent-browser storage local               # Get all localStorageagent-browser storage local key           # Get specific keyagent-browser storage local set k v       # Set valueagent-browser storage local clear         # Clear all
```
```
agent-browser network route <url>              # Intercept requestsagent-browser network route <url> --abort      # Block requestsagent-browser network route <url> --body '{}'  # Mock responseagent-browser network unroute [url]            # Remove routesagent-browser network requests                 # View tracked requestsagent-browser network requests --filter api    # Filter requests
```
```
agent-browser network route <url>              # Intercept requestsagent-browser network route <url> --abort      # Block requestsagent-browser network route <url> --body '{}'  # Mock responseagent-browser network unroute [url]            # Remove routesagent-browser network requests                 # View tracked requestsagent-browser network requests --filter api    # Filter requests
```
```
agent-browser tab                 # List tabsagent-browser tab new [url]       # New tabagent-browser tab 2               # Switch to tab by indexagent-browser tab close           # Close current tabagent-browser tab close 2         # Close tab by indexagent-browser window new          # New window
```
```
agent-browser tab                 # List tabsagent-browser tab new [url]       # New tabagent-browser tab 2               # Switch to tab by indexagent-browser tab close           # Close current tabagent-browser tab close 2         # Close tab by indexagent-browser window new          # New window
```
```
agent-browser frame "#iframe"     # Switch to iframeagent-browser frame main          # Back to main frame
```
```
agent-browser frame "#iframe"     # Switch to iframeagent-browser frame main          # Back to main frame
```
```
agent-browser dialog accept [text]  # Accept dialogagent-browser dialog dismiss        # Dismiss dialog
```
```
agent-browser dialog accept [text]  # Accept dialogagent-browser dialog dismiss        # Dismiss dialog
```
```
agent-browser eval "document.title"   # Run JavaScript
```
```
agent-browser eval "document.title"   # Run JavaScript
```
```
agent-browser --session <name> ...    # Isolated browser sessionagent-browser --json ...              # JSON output for parsingagent-browser --headed ...            # Show browser window (not headless)agent-browser --full ...              # Full page screenshot (-f)agent-browser --cdp <port> ...        # Connect via Chrome DevTools Protocolagent-browser --proxy <url> ...       # Use proxy serveragent-browser --headers <json> ...    # HTTP headers scoped to URL's originagent-browser --executable-path <p>   # Custom browser executableagent-browser --extension <path> ...  # Load browser extension (repeatable)agent-browser --help                  # Show help (-h)agent-browser --version               # Show version (-V)agent-browser <command> --help        # Show detailed help for a command
```
```
agent-browser --session <name> ...    # Isolated browser sessionagent-browser --json ...              # JSON output for parsingagent-browser --headed ...            # Show browser window (not headless)agent-browser --full ...              # Full page screenshot (-f)agent-browser --cdp <port> ...        # Connect via Chrome DevTools Protocolagent-browser --proxy <url> ...       # Use proxy serveragent-browser --headers <json> ...    # HTTP headers scoped to URL's originagent-browser --executable-path <p>   # Custom browser executableagent-browser --extension <path> ...  # Load browser extension (repeatable)agent-browser --help                  # Show help (-h)agent-browser --version               # Show version (-V)agent-browser <command> --help        # Show detailed help for a command
```
```
agent-browser --proxy http://proxy.com:8080 open example.comagent-browser --proxy http://user:pass@proxy.com:8080 open example.comagent-browser --proxy socks5://proxy.com:1080 open example.com
```
```
agent-browser --proxy http://proxy.com:8080 open example.comagent-browser --proxy http://user:pass@proxy.com:8080 open example.comagent-browser --proxy socks5://proxy.com:1080 open example.com
```
```
AGENT_BROWSER_SESSION="mysession"            # Default session nameAGENT_BROWSER_EXECUTABLE_PATH="/path/chrome" # Custom browser pathAGENT_BROWSER_EXTENSIONS="/ext1,/ext2"       # Comma-separated extension pathsAGENT_BROWSER_STREAM_PORT="9223"             # WebSocket streaming portAGENT_BROWSER_HOME="/path/to/agent-browser"  # Custom install location (for daemon.js)
```
```
AGENT_BROWSER_SESSION="mysession"            # Default session nameAGENT_BROWSER_EXECUTABLE_PATH="/path/chrome" # Custom browser pathAGENT_BROWSER_EXTENSIONS="/ext1,/ext2"       # Comma-separated extension pathsAGENT_BROWSER_STREAM_PORT="9223"             # WebSocket streaming portAGENT_BROWSER_HOME="/path/to/agent-browser"  # Custom install location (for daemon.js)
```
```
agent-browser open https://example.com/formagent-browser snapshot -i# Output shows: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]agent-browser fill @e1 "user@example.com"agent-browser fill @e2 "password123"agent-browser click @e3agent-browser wait --load networkidleagent-browser snapshot -i  # Check result
```
```
agent-browser open https://example.com/formagent-browser snapshot -i# Output shows: textbox "Email" [ref=e1], textbox "Password" [ref=e2], button "Submit" [ref=e3]agent-browser fill @e1 "user@example.com"agent-browser fill @e2 "password123"agent-browser click @e3agent-browser wait --load networkidleagent-browser snapshot -i  # Check result
```
```
# Login onceagent-browser open https://app.example.com/loginagent-browser snapshot -iagent-browser fill @e1 "username"agent-browser fill @e2 "password"agent-browser click @e3agent-browser wait --url "**/dashboard"agent-browser state save auth.json# Later sessions: load saved stateagent-browser state load auth.jsonagent-browser open https://app.example.com/dashboard
```
```
# Login onceagent-browser open https://app.example.com/loginagent-browser snapshot -iagent-browser fill @e1 "username"agent-browser fill @e2 "password"agent-browser click @e3agent-browser wait --url "**/dashboard"agent-browser state save auth.json# Later sessions: load saved stateagent-browser state load auth.jsonagent-browser open https://app.example.com/dashboard
```
```
agent-browser --session test1 open site-a.comagent-browser --session test2 open site-b.comagent-browser session list
```
```
agent-browser --session test1 open site-a.comagent-browser --session test2 open site-b.comagent-browser session list
```
```
--json
```
```
agent-browser snapshot -i --jsonagent-browser get text @e1 --json
```
```
agent-browser snapshot -i --jsonagent-browser get text @e1 --json
```
```
agent-browser --headed open example.com   # Show browser windowagent-browser --cdp 9222 snapshot         # Connect via CDP portagent-browser connect 9222                # Alternative: connect commandagent-browser console                     # View console messagesagent-browser console --clear             # Clear consoleagent-browser errors                      # View page errorsagent-browser errors --clear              # Clear errorsagent-browser highlight @e1               # Highlight elementagent-browser trace start                 # Start recording traceagent-browser trace stop trace.zip        # Stop and save traceagent-browser record start ./debug.webm   # Record video from current pageagent-browser record stop                 # Save recording
```
```
agent-browser --headed open example.com   # Show browser windowagent-browser --cdp 9222 snapshot         # Connect via CDP portagent-browser connect 9222                # Alternative: connect commandagent-browser console                     # View console messagesagent-browser console --clear             # Clear consoleagent-browser errors                      # View page errorsagent-browser errors --clear              # Clear errorsagent-browser highlight @e1               # Highlight elementagent-browser trace start                 # Start recording traceagent-browser trace stop trace.zip        # Stop and save traceagent-browser record start ./debug.webm   # Record video from current pageagent-browser record stop                 # Save recording
```
```
./templates/form-automation.sh https://example.com/form./templates/authenticated-session.sh https://app.example.com/login./templates/capture-workflow.sh https://example.com ./output
```
```
./templates/form-automation.sh https://example.com/form./templates/authenticated-session.sh https://app.example.com/login./templates/capture-workflow.sh https://example.com ./output
```
The `agent-browser` skill empowers your AI assistant to seamlessly interact with web pages, transforming complex manual browser tasks into simple, programmable commands. Designed for efficiency and precision, it allows for sophisticated web navigation, dynamic content interaction, and robust data acquisition directly from any URL. Whether you're conducting repetitive testing, automating data entry, or gathering critical information, this skill provides a powerful interface for controlling web environments without ever leaving your development workflow, significantly boosting productivity for a wide array of web-centric projects.

# When to Use This Skill
- •Automating end-to-end web application testing and quality assurance checks.
- •Efficiently scraping data from websites for market research or content aggregation.
- •Filling out complex online forms and submitting data for registration or application processes.
- •Generating interactive screenshots or visual regression tests for web pages.

# Pro Tips
- 💡Always use `agent-browser snapshot -i` after significant page changes or navigation to get updated element references (`@e1`, `@e2`), ensuring reliable interactions.
- 💡Combine `agent-browser` with other data processing skills to refine extracted information, such as parsing JSON or cleaning text for further analysis.
- 💡When dealing with dynamic content or waiting for elements to load, implement retry logic or explicit waits in your agent's workflow to enhance robustness and prevent failures.

