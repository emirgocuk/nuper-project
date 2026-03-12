# ray-so-code-snippet
Source: https://antigravity.codes/agent-skills/workflow/ray-so-code-snippet

## AI Worker Instructions
When the user requests functionality related to ray-so-code-snippet, follow these guidelines and utilize this context.

## Scraped Content

# ray-so-code-snippet
```
agent-browser
```
```
agent-browser
```
```
which agent-browser
```
```
which agent-browser
```
```
agent-browser
```
```
# Fetch and parse available themescurl -s "https://raw.githubusercontent.com/raycast/ray-so/main/app/(navigation)/(code)/store/themes.ts" | grep -oE 'id:\s*"[^"]+"' | sed 's/id:\s*"//;s/"//' | sort -u# Fetch and parse available languagescurl -s "https://raw.githubusercontent.com/raycast/ray-so/main/app/(navigation)/(code)/util/languages.ts" | grep -oE '^[[:space:]]*"?[a-zA-Z0-9+#-]+"?\s*:\s*\{' | sed 's/[[:space:]]*"//g;s/".*//;s/:.*//' | sort -u
```
```
# Fetch and parse available themescurl -s "https://raw.githubusercontent.com/raycast/ray-so/main/app/(navigation)/(code)/store/themes.ts" | grep -oE 'id:\s*"[^"]+"' | sed 's/id:\s*"//;s/"//' | sort -u# Fetch and parse available languagescurl -s "https://raw.githubusercontent.com/raycast/ray-so/main/app/(navigation)/(code)/util/languages.ts" | grep -oE '^[[:space:]]*"?[a-zA-Z0-9+#-]+"?\s*:\s*\{' | sed 's/[[:space:]]*"//g;s/".*//;s/:.*//' | sort -u
```
```
Question: "Which theme would you like?"Description: "Available themes: [list ALL themes from curl output]"Options (pick 4 popular ones for quick select):- breeze (default, purple gradient)- midnight (cyan-blue)- vercel (minimalist dark)- sunset (warm orange)Note: User can select "Other" to type any theme from the full list
```
```
Question: "Which theme would you like?"Description: "Available themes: [list ALL themes from curl output]"Options (pick 4 popular ones for quick select):- breeze (default, purple gradient)- midnight (cyan-blue)- vercel (minimalist dark)- sunset (warm orange)Note: User can select "Other" to type any theme from the full list
```
```
.py
```
```
.js
```
```
.ts
```
```
.rs
```
```
.go
```
```
def
```
```
import
```
```
func
```
```
package
```
```
fn
```
```
let mut
```
```
Question: "Which language for syntax highlighting?"Description: "Available languages: [list ALL languages from curl output]"Options:- auto (auto-detect)- javascript- python- typescriptNote: User can select "Other" to type any language from the full list
```
```
Question: "Which language for syntax highlighting?"Description: "Available languages: [list ALL languages from curl output]"Options:- auto (auto-detect)- javascript- python- typescriptNote: User can select "Other" to type any language from the full list
```
```
Question: "Dark or light mode?"Options:- Dark mode (default)- Light mode
```
```
Question: "Dark or light mode?"Options:- Dark mode (default)- Light mode
```
```
Question: "Show the gradient background?"Options:- Yes, show background (default)- No, transparent/minimal background
```
```
Question: "Show the gradient background?"Options:- Yes, show background (default)- No, transparent/minimal background
```
```
Question: "How much padding around the code?"Options:- 16 (compact)- 32 (small)- 64 (medium, default)- 128 (large)
```
```
Question: "How much padding around the code?"Options:- 16 (compact)- 32 (small)- 64 (medium, default)- 128 (large)
```
```
Question: "Show line numbers?"Options:- No (default)- Yes
```
```
Question: "Show line numbers?"Options:- No (default)- Yes
```
```
Question: "Add a title above the code? (e.g., filename)"Options:- No title (default)- Yes, add titleIf yes, ask for the title text.
```
```
Question: "Add a title above the code? (e.g., filename)"Options:- No title (default)- Yes, add titleIf yes, ask for the title text.
```
```
rayso-snippet.png
```
```
fibonacci.png
```
```
# 1. Base64 encode the codeCODE_BASE64=$(echo -n 'YOUR_CODE_HERE' | base64)# 2. URL encode the base64 stringCODE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CODE_BASE64'))")# 3. Build the URL with ALL parameters in the hash# Format: https://ray.so/#param1=value1&param2=value2&code=ENCODED_CODE# Do NOT include width parameter - let ray.so auto-size to fit contentURL="https://ray.so/#theme=THEME&padding=PADDING&background=BACKGROUND&darkMode=DARKMODE&language=LANGUAGE&code=${CODE_ENCODED}"# Add optional parameters if needed:# If lineNumbers: add "&lineNumbers=true" before &code=# If title: add "&title=URL_ENCODED_TITLE" before &code=
```
```
# 1. Base64 encode the codeCODE_BASE64=$(echo -n 'YOUR_CODE_HERE' | base64)# 2. URL encode the base64 stringCODE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CODE_BASE64'))")# 3. Build the URL with ALL parameters in the hash# Format: https://ray.so/#param1=value1&param2=value2&code=ENCODED_CODE# Do NOT include width parameter - let ray.so auto-size to fit contentURL="https://ray.so/#theme=THEME&padding=PADDING&background=BACKGROUND&darkMode=DARKMODE&language=LANGUAGE&code=${CODE_ENCODED}"# Add optional parameters if needed:# If lineNumbers: add "&lineNumbers=true" before &code=# If title: add "&title=URL_ENCODED_TITLE" before &code=
```
```
width
```
```
# For code: for i in range(23):\n    print(i)# Theme: midnight, Padding: 64, Dark mode: true, Background: true, Language: python, Title: test.pyCODE='for i in range(23):    print(i)'CODE_BASE64=$(echo -n "$CODE" | base64)CODE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CODE_BASE64'))")TITLE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('test.py'))")URL="https://ray.so/#theme=midnight&padding=64&background=true&darkMode=true&language=python&title=${TITLE_ENCODED}&code=${CODE_ENCODED}"echo "$URL"
```
```
# For code: for i in range(23):\n    print(i)# Theme: midnight, Padding: 64, Dark mode: true, Background: true, Language: python, Title: test.pyCODE='for i in range(23):    print(i)'CODE_BASE64=$(echo -n "$CODE" | base64)CODE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CODE_BASE64'))")TITLE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('test.py'))")URL="https://ray.so/#theme=midnight&padding=64&background=true&darkMode=true&language=python&title=${TITLE_ENCODED}&code=${CODE_ENCODED}"echo "$URL"
```
```
html-to-image
```
```
--session
```
```
# Generate unique session nameSESSION="rayso-$(date +%s)"# 1. Set viewportagent-browser --session $SESSION set viewport 1400 900# 2. Open the URLagent-browser --session $SESSION open "$URL"# 3. Wait for the page to fully renderagent-browser --session $SESSION wait --load networkidleagent-browser --session $SESSION wait 3000# 4. Load html-to-image library (same library ray.so uses internally)agent-browser --session $SESSION eval 'new Promise((r,e)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";s.onload=r;s.onerror=e;document.head.appendChild(s)})'# 5. Capture at 4x resolution using html-to-image (produces crisp text)agent-browser --session $SESSION eval 'htmlToImage.toPng(document.querySelector("#frame > div"),{pixelRatio:4,skipAutoScale:true})' > /tmp/rayso-dataurl-$SESSION.txt# 6. Close the browseragent-browser --session $SESSION close# 7. Convert data URL to PNG fileDATAURL=$(cat /tmp/rayso-dataurl-$SESSION.txt | tr -d '"' | tr -d '\n')echo "$DATAURL" | sed 's/data:image\/png;base64,//' | base64 -d > /path/to/output.png# 8. Clean up temp filerm /tmp/rayso-dataurl-$SESSION.txt
```
```
# Generate unique session nameSESSION="rayso-$(date +%s)"# 1. Set viewportagent-browser --session $SESSION set viewport 1400 900# 2. Open the URLagent-browser --session $SESSION open "$URL"# 3. Wait for the page to fully renderagent-browser --session $SESSION wait --load networkidleagent-browser --session $SESSION wait 3000# 4. Load html-to-image library (same library ray.so uses internally)agent-browser --session $SESSION eval 'new Promise((r,e)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";s.onload=r;s.onerror=e;document.head.appendChild(s)})'# 5. Capture at 4x resolution using html-to-image (produces crisp text)agent-browser --session $SESSION eval 'htmlToImage.toPng(document.querySelector("#frame > div"),{pixelRatio:4,skipAutoScale:true})' > /tmp/rayso-dataurl-$SESSION.txt# 6. Close the browseragent-browser --session $SESSION close# 7. Convert data URL to PNG fileDATAURL=$(cat /tmp/rayso-dataurl-$SESSION.txt | tr -d '"' | tr -d '\n')echo "$DATAURL" | sed 's/data:image\/png;base64,//' | base64 -d > /path/to/output.png# 8. Clean up temp filerm /tmp/rayso-dataurl-$SESSION.txt
```
```
html-to-image
```
```
pixelRatio: 4
```
```
def fibonacci(n):    if n <= 1:        return n    return fibonacci(n-1) + fibonacci(n-2)
```
```
def fibonacci(n):    if n <= 1:        return n    return fibonacci(n-1) + fibonacci(n-2)
```
```
which agent-browser
```
```
curl -s "https://raw.githubusercontent.com/raycast/ray-so/main/app/(navigation)/(code)/store/themes.ts" | grep -oE 'id:\s*"[^"]+"' | sed 's/id:\s*"//;s/"//' | sort -u
```
```
curl -s "https://raw.githubusercontent.com/raycast/ray-so/main/app/(navigation)/(code)/store/themes.ts" | grep -oE 'id:\s*"[^"]+"' | sed 's/id:\s*"//;s/"//' | sort -u
```
```
def
```
```
CODE='def fibonacci(n):    if n <= 1:        return n    return fibonacci(n-1) + fibonacci(n-2)'CODE_BASE64=$(echo -n "$CODE" | base64)CODE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CODE_BASE64'))")URL="https://ray.so/#theme=midnight&padding=64&background=true&darkMode=true&language=python&code=${CODE_ENCODED}"
```
```
CODE='def fibonacci(n):    if n <= 1:        return n    return fibonacci(n-1) + fibonacci(n-2)'CODE_BASE64=$(echo -n "$CODE" | base64)CODE_ENCODED=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CODE_BASE64'))")URL="https://ray.so/#theme=midnight&padding=64&background=true&darkMode=true&language=python&code=${CODE_ENCODED}"
```
```
SESSION="rayso-$(date +%s)"agent-browser --session $SESSION set viewport 1400 900agent-browser --session $SESSION open "$URL"agent-browser --session $SESSION wait --load networkidleagent-browser --session $SESSION wait 3000# Load html-to-image libraryagent-browser --session $SESSION eval 'new Promise((r,e)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";s.onload=r;s.onerror=e;document.head.appendChild(s)})'# Capture at 4x resolutionagent-browser --session $SESSION eval 'htmlToImage.toPng(document.querySelector("#frame > div"),{pixelRatio:4,skipAutoScale:true})' > /tmp/rayso-dataurl-$SESSION.txtagent-browser --session $SESSION close# Save as PNGDATAURL=$(cat /tmp/rayso-dataurl-$SESSION.txt | tr -d '"' | tr -d '\n')echo "$DATAURL" | sed 's/data:image\/png;base64,//' | base64 -d > ./fibonacci.pngrm /tmp/rayso-dataurl-$SESSION.txt
```
```
SESSION="rayso-$(date +%s)"agent-browser --session $SESSION set viewport 1400 900agent-browser --session $SESSION open "$URL"agent-browser --session $SESSION wait --load networkidleagent-browser --session $SESSION wait 3000# Load html-to-image libraryagent-browser --session $SESSION eval 'new Promise((r,e)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js";s.onload=r;s.onerror=e;document.head.appendChild(s)})'# Capture at 4x resolutionagent-browser --session $SESSION eval 'htmlToImage.toPng(document.querySelector("#frame > div"),{pixelRatio:4,skipAutoScale:true})' > /tmp/rayso-dataurl-$SESSION.txtagent-browser --session $SESSION close# Save as PNGDATAURL=$(cat /tmp/rayso-dataurl-$SESSION.txt | tr -d '"' | tr -d '\n')echo "$DATAURL" | sed 's/data:image\/png;base64,//' | base64 -d > ./fibonacci.pngrm /tmp/rayso-dataurl-$SESSION.txt
```
```
html-to-image
```
```
pixelRatio: 4
```
```
pixelRatio:4
```
```
pixelRatio:2
```
```
pixelRatio:6
```
```
&width=NUMBER
```
```
#title=filename.py&code=...
```
```
#frame > div
```
```
--session
```
Elevate your code sharing and documentation with the `ray-so-code-snippet` agent skill. This powerful tool transforms plain code into visually appealing images, perfect for presentations, articles, or social media. By leveraging the popular ray.so platform, developers can quickly generate high-quality, customizable code screenshots directly within their AI coding environment. Say goodbye to plain text and hello to professional, shareable code visuals that enhance clarity and engagement, making your work stand out.

# When to Use This Skill
- •Creating visually appealing code examples for technical blog posts or articles.
- •Generating polished code snippets for slide presentations or workshops.
- •Quickly sharing a formatted code block on social media or in a team chat.
- •Enhancing project documentation with attractive code screenshots.

# Pro Tips
- 💡Always specify your preferred theme and language upfront to streamline the image generation process.
- 💡Leverage the local saving feature to integrate generated images directly into your project's `docs` or `assets` directory.
- 💡Experiment with different styling parameters to match the aesthetic of your documentation or branding guidelines.

