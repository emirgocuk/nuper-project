# web-to-markdown
Source: https://antigravity.codes/agent-skills/documentation/web-to-markdown

## AI Worker Instructions
When the user requests functionality related to web-to-markdown, follow these guidelines and utilize this context.

## Scraped Content

# web-to-markdown
```
web2md
```
```
use the skill web-to-markdown ...
```
```
use a skill web-to-markdown ...
```
```
use the skill web-to-markdown
```
```
puppeteer-core
```
```
web2md
```
```
url
```
```
--print
```
```
--out ./file.md
```
```
--out ./some-dir/
```
```
--chrome-path <path>
```
```
--interactive
```
```
--wait-until load|domcontentloaded|networkidle0|networkidle2
```
```
--wait-for '<css selector>'
```
```
--wait-ms <milliseconds>
```
```
--headful
```
```
--no-sandbox
```
```
--user-data-dir <dir>
```
```
use the skill web-to-markdown
```
```
http://
```
```
https://
```
```
web2md
```
```
command -v web2md
```
```
~/workspace/softaworks/projects/web2md
```
```
cd ~/workspace/softaworks/projects/web2md && npm install && npm run build && npm link
```
```
cd ~/workspace/softaworks/projects/web2md && npm install && npm run build && npm install -g .
```
```
web2md '<url>' --out ./page.md
```
```
mkdir -p ./out && web2md '<url>' --out ./out/
```
```
mkdir -p ./out && web2md '<url>' --interactive --user-data-dir ./tmp/web2md-profile --out ./out/
```
```
web2md '<url>' --print
```
```
./out/
```
```
web2md
```
```
--out ./out/
```
```
ls -la <path>
```
```
wc -c <path>
```
```
--wait-until networkidle2
```
```
--wait-until domcontentloaded --wait-ms 2000
```
```
--wait-for 'main'
```
This skill empowers your AI agent to transform complex web pages, including those heavily reliant on JavaScript, into clean, structured Markdown. Leveraging the `web2md` CLI, it's a powerful tool for developers and content creators who need to quickly extract core information from online sources without manual copy-pasting. Seamlessly integrate web content into your projects, documentation, or knowledge base, ensuring readability and easy manipulation. It streamlines the process of converting dynamic web layouts into a static, maintainable format, enhancing productivity for various development and research tasks within your coding assistant environment.

# When to Use This Skill
- •Archiving web content for offline reference or long-term storage.
- •Extracting articles or tutorials from blogs for documentation generation.
- •Converting research papers or technical specifications from web formats into a readable Markdown knowledge base.
- •Preparing web content for integration into static site generators or personal wikis.

# Pro Tips
- 💡Specify `--chrome-path` if you have multiple Chrome installations or a non-standard path to ensure `puppeteer-core` targets the correct browser.
- 💡For bulk conversions, utilize a script to feed multiple URLs to the skill, specifying an output directory (`--out ./some-dir/`) for automatic file naming.
- 💡Always verify the Markdown output, especially for very complex or interactive pages, and be prepared to manually tweak if Readability misidentifies the main content.

