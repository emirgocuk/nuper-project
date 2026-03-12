# sveltia-cms
Source: https://antigravity.codes/agent-skills/workflow/sveltia-cms

## AI Worker Instructions
When the user requests functionality related to sveltia-cms, follow these guidelines and utilize this context.

## Scraped Content

# sveltia-cms
```
slug_length
```
```
# ❌ Deprecated (pre-v0.127.0)collections:  - name: posts    slug_length: 50# ✅ New (v0.127.0+)slug:  maxlength: 50
```
```
# ❌ Deprecated (pre-v0.127.0)collections:  - name: posts    slug_length: 50# ✅ New (v0.127.0+)slug:  maxlength: 50
```
```
{{author-email}}
```
```
{{author-login}}
```
```
{{author-name}}
```
```
fields:  - label: Author Email    name: author_email    widget: hidden    default: '{{author-email}}'
```
```
fields:  - label: Author Email    name: author_email    widget: hidden    default: '{{author-email}}'
```
```
{{author-email}}
```
```
# admin/config.toml (NEW)[backend]name = "github"repo = "owner/repo"branch = "main"media_folder = "static/images/uploads"public_folder = "/images/uploads"
```
```
# admin/config.toml (NEW)[backend]name = "github"repo = "owner/repo"branch = "main"media_folder = "static/images/uploads"public_folder = "/images/uploads"
```
```
SiteConfig
```
```
CmsConfig
```
```
// ❌ Old (v0.117.x)import type { SiteConfig } from '@sveltia/cms';// ✅ New (v0.118.0+)import type { CmsConfig } from '@sveltia/cms';const config: CmsConfig = {  backend: { name: 'github', repo: 'owner/repo' },  collections: [/* ... */],};
```
```
// ❌ Old (v0.117.x)import type { SiteConfig } from '@sveltia/cms';// ✅ New (v0.118.0+)import type { CmsConfig } from '@sveltia/cms';const config: CmsConfig = {  backend: { name: 'github', repo: 'owner/repo' },  collections: [/* ... */],};
```
```
CmsConfig
```
```
media_folder
```
```
collections:  - name: posts    label: Blog Posts    folder: content/posts    media_folder: static/images/posts  # Collection-level default    fields:      - label: Featured Image        name: image        widget: image        media_folder: static/images/featured  # ← Field-level override        public_folder: /images/featured      - label: Author Avatar        name: avatar        widget: image        media_folder: static/images/avatars  # ← Another override        public_folder: /images/avatars
```
```
collections:  - name: posts    label: Blog Posts    folder: content/posts    media_folder: static/images/posts  # Collection-level default    fields:      - label: Featured Image        name: image        widget: image        media_folder: static/images/featured  # ← Field-level override        public_folder: /images/featured      - label: Author Avatar        name: avatar        widget: image        media_folder: static/images/avatars  # ← Another override        public_folder: /images/avatars
```
```
logo_url
```
```
logo.src
```
```
# ❌ Deprecatedlogo_url: https://yourdomain.com/logo.svg# ✅ New (v0.113.5+)logo:  src: https://yourdomain.com/logo.svg
```
```
# ❌ Deprecatedlogo_url: https://yourdomain.com/logo.svg# ✅ New (v0.113.5+)logo:  src: https://yourdomain.com/logo.svg
```
```
sanitize_preview
```
```
true
```
```
sanitize_preview: false
```
```
sanitize_preview: true
```
```
collections:  - name: posts    fields:      - label: Body        name: body        widget: markdown        sanitize_preview: false  # ← Add ONLY if you trust all CMS users
```
```
collections:  - name: posts    fields:      - label: Body        name: body        widget: markdown        sanitize_preview: false  # ← Add ONLY if you trust all CMS users
```
```
true
```
```
slug:  encoding: unicode-normalized  clean_accents: false  sanitize_replacement: '-'  lowercase: true   # Default: convert to lowercase (v0.128.0+)  maxlength: 50     # Default: unlimited (v0.127.0+)
```
```
slug:  encoding: unicode-normalized  clean_accents: false  sanitize_replacement: '-'  lowercase: true   # Default: convert to lowercase (v0.128.0+)  maxlength: 50     # Default: unlimited (v0.127.0+)
```
```
false
```
```
raw
```
```
body
```
```
code
```
```
markdown
```
```
richtext
```
```
text
```
```
collections:  - name: config    label: Configuration Files    files:      - label: Site Config        name: site_config        file: config.json        format: raw  # ← NEW format type        fields:          - label: Config            name: body            widget: code            default_language: json
```
```
collections:  - name: config    label: Configuration Files    files:      - label: Site Config        name: site_config        file: config.json        format: raw  # ← NEW format type        fields:          - label: Config            name: body            widget: code            default_language: json
```
```
body
```
```
code
```
```
markdown
```
```
richtext
```
```
text
```
```
value_type
```
```
int/string
```
```
float/string
```
```
age: "25"
```
```
age: 25
```
```
fields:  - label: Age    name: age    widget: number    value_type: int/string  # Saves as "25" not 25  - label: Price    name: price    widget: number    value_type: float/string  # Saves as "19.99" not 19.99
```
```
fields:  - label: Age    name: age    widget: number    value_type: int/string  # Saves as "25" not 25  - label: Price    name: price    widget: number    value_type: float/string  # Saves as "19.99" not 19.99
```
```
?_locale=fr
```
```
https://yourdomain.com/admin/#/collections/posts/entries/my-post?_locale=fr
```
```
https://yourdomain.com/admin/#/collections/posts/entries/my-post?_locale=fr
```
```
richtext
```
```
markdown
```
```
fields:  - label: Body    name: body    widget: richtext  # ← NEW alias for markdown
```
```
fields:  - label: Body    name: body    widget: richtext  # ← NEW alias for markdown
```
```
richtext
```
```
static/admin/
```
```
admin/
```
```
admin/
```
```
public/admin/
```
```
public/admin/
```
```
<!doctype html>   <html lang="en">     <head>       <meta charset="utf-8" />       <meta name="viewport" content="width=device-width, initial-scale=1.0" />       <title>Content Manager</title>     </head>     <body>       <script src="https://unpkg.com/@sveltia/cms@0.128.5/dist/sveltia-cms.js" type="module"></script>     </body>   </html>
```
```
<!doctype html>   <html lang="en">     <head>       <meta charset="utf-8" />       <meta name="viewport" content="width=device-width, initial-scale=1.0" />       <title>Content Manager</title>     </head>     <body>       <script src="https://unpkg.com/@sveltia/cms@0.128.5/dist/sveltia-cms.js" type="module"></script>     </body>   </html>
```
```
backend:     name: github     repo: owner/repo     branch: main     base_url: https://your-worker.workers.dev  # OAuth proxy (required)   media_folder: static/images/uploads  # Framework-specific path   public_folder: /images/uploads   collections:     - name: posts       label: Blog Posts       folder: content/posts       create: true       fields:         - { label: 'Title', name: 'title', widget: 'string' }         - { label: 'Date', name: 'date', widget: 'datetime' }         - { label: 'Body', name: 'body', widget: 'markdown' }
```
```
backend:     name: github     repo: owner/repo     branch: main     base_url: https://your-worker.workers.dev  # OAuth proxy (required)   media_folder: static/images/uploads  # Framework-specific path   public_folder: /images/uploads   collections:     - name: posts       label: Blog Posts       folder: content/posts       create: true       fields:         - { label: 'Title', name: 'title', widget: 'string' }         - { label: 'Date', name: 'date', widget: 'datetime' }         - { label: 'Body', name: 'body', widget: 'markdown' }
```
```
http://localhost:<port>/admin/
```
```
templates/
```
```
git clone https://github.com/sveltia/sveltia-cms-auth   cd sveltia-cms-auth   npm install   npx wrangler deploy
```
```
git clone https://github.com/sveltia/sveltia-cms-auth   cd sveltia-cms-auth   npm install   npx wrangler deploy
```
```
https://your-worker.workers.dev/callback
```
```
npx wrangler secret put GITHUB_CLIENT_ID   # Paste your Client ID   npx wrangler secret put GITHUB_CLIENT_SECRET   # Paste your Client Secret
```
```
npx wrangler secret put GITHUB_CLIENT_ID   # Paste your Client ID   npx wrangler secret put GITHUB_CLIENT_SECRET   # Paste your Client Secret
```
```
backend:     name: github     repo: owner/repo     branch: main     base_url: https://your-worker.workers.dev  # ← Add this line
```
```
backend:     name: github     repo: owner/repo     branch: main     base_url: https://your-worker.workers.dev  # ← Add this line
```
```
/admin/
```
```
templates/vercel-serverless/
```
```
https://api.netlify.com/auth
```
```
base_url
```
```
base_url
```
```
backend:  name: github  repo: owner/repo  branch: main  base_url: https://your-worker.workers.dev  # ← Must be present
```
```
backend:  name: github  repo: owner/repo  branch: main  base_url: https://your-worker.workers.dev  # ← Must be present
```
```
https://your-worker.workers.dev/callback
```
```
https://yourdomain.com/callback
```
```
curl https://your-worker.workers.dev/health# Should return: {"status": "ok"}
```
```
curl https://your-worker.workers.dev/health# Should return: {"status": "ok"}
```
```
+++
```
```
collections:  - name: posts    folder: content/posts    format: yaml  # or md (Markdown with YAML frontmatter)    # NOT: format: toml
```
```
collections:  - name: posts    folder: content/posts    format: yaml  # or md (Markdown with YAML frontmatter)    # NOT: format: toml
```
```
pip install yamllintfind content -name "*.md" -exec yamllint {} \;
```
```
pip install yamllintfind content -name "*.md" -exec yamllint {} \;
```
```
# ❌ Bad - smart quotes from copy-pastetitle: "Hello World"  # Curly quotes# ✅ Good - straight quotestitle: "Hello World"  # Straight quotes
```
```
# ❌ Bad - smart quotes from copy-pastetitle: "Hello World"  # Curly quotes# ✅ Good - straight quotestitle: "Hello World"  # Straight quotes
```
```
go install github.com/google/yamlfmt/cmd/yamlfmt@latestfind content -name "*.md" -exec yamlfmt {} \;
```
```
go install github.com/google/yamlfmt/cmd/yamlfmt@latestfind content -name "*.md" -exec yamlfmt {} \;
```
```
# Config says:collections:  - name: posts    folder: content/posts  # Expects files here# Check actual location:ls -la content/posts  # Files must exist here
```
```
# Config says:collections:  - name: posts    folder: content/posts  # Expects files here# Check actual location:ls -la content/posts  # Files must exist here
```
```
# If files are: content/posts/hello.md with YAML frontmattercollections:  - name: posts    folder: content/posts    format: yaml  # or md (same as yaml for .md files)
```
```
# If files are: content/posts/hello.md with YAML frontmattercollections:  - name: posts    folder: content/posts    format: yaml  # or md (same as yaml for .md files)
```
```
Uncaught ReferenceError: SVELTIA is not defined
```
```
type="module"
```
```
<!-- ✅ Correct --><script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script><!-- ❌ Wrong - missing type="module" --><script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```
```
<!-- ✅ Correct --><script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js" type="module"></script><!-- ❌ Wrong - missing type="module" --><script src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
```
```
<script src="https://unpkg.com/@sveltia/cms@0.128.5/dist/sveltia-cms.js" type="module"></script>
```
```
<script src="https://unpkg.com/@sveltia/cms@0.128.5/dist/sveltia-cms.js" type="module"></script>
```
```
/admin/
```
```
static/
```
```
_config.yml
```
```
include:  - admin
```
```
include:  - admin
```
```
.eleventy.js
```
```
module.exports = function(eleventyConfig) {  eleventyConfig.addPassthroughCopy('admin');};
```
```
module.exports = function(eleventyConfig) {  eleventyConfig.addPassthroughCopy('admin');};
```
```
public/
```
```
media_libraries:  default:    config:      max_file_size: 10485760  # 10 MB      transformations:        raster_image:          format: webp  # Auto-converts to WebP          quality: 85
```
```
media_libraries:  default:    config:      max_file_size: 10485760  # 10 MB      transformations:        raster_image:          format: webp  # Auto-converts to WebP          quality: 85
```
```
format
```
```
format
```
```
fields:  - label: Date    name: date    widget: datetime    picker_utc: true  # Most flexible - outputs with timezone
```
```
fields:  - label: Date    name: date    widget: datetime    picker_utc: true  # Most flexible - outputs with timezone
```
```
fields:  - label: Date    name: date    widget: datetime    format: "YYYY-MM-DDTHH:mm:ss.SSSZ"  # Only if ALL existing dates match this format
```
```
fields:  - label: Date    name: date    widget: datetime    format: "YYYY-MM-DDTHH:mm:ss.SSSZ"  # Only if ALL existing dates match this format
```
```
# config.toml[frontmatter]  date = [":default", ":fileModTime"]
```
```
# config.toml[frontmatter]  date = [":default", ":fileModTime"]
```
```
format
```
```
format
```
```
picker_utc: true
```
```
// vite.config.tsimport { defineConfig, type Plugin } from 'vite'function ensureGDPRCompliantFonts(): Plugin {  const fontsURLRegex = /fonts\.googleapis\.com\/css2/g  const replacement = 'fonts.bunny.net/css'  return {    name: 'gdpr-compliant-fonts',    enforce: 'post',    transform(code) {      if (fontsURLRegex.test(code)) {        return code.replaceAll(fontsURLRegex, replacement)      }    },  }}export default defineConfig({  plugins: [ensureGDPRCompliantFonts()],})
```
```
// vite.config.tsimport { defineConfig, type Plugin } from 'vite'function ensureGDPRCompliantFonts(): Plugin {  const fontsURLRegex = /fonts\.googleapis\.com\/css2/g  const replacement = 'fonts.bunny.net/css'  return {    name: 'gdpr-compliant-fonts',    enforce: 'post',    transform(code) {      if (fontsURLRegex.test(code)) {        return code.replaceAll(fontsURLRegex, replacement)      }    },  }}export default defineConfig({  plugins: [ensureGDPRCompliantFonts()],})
```
```
@fontsource
```
```
Cross-Origin-Opener-Policy
```
```
/*  Cross-Origin-Opener-Policy: same-origin-allow-popups  # NOT: same-origin (this breaks OAuth)
```
```
/*  Cross-Origin-Opener-Policy: same-origin-allow-popups  # NOT: same-origin (this breaks OAuth)
```
```
/*  Cross-Origin-Opener-Policy: same-origin-allow-popups
```
```
/*  Cross-Origin-Opener-Policy: same-origin-allow-popups
```
```
{  "headers": [    {      "source": "/(.*)",      "headers": [        {          "key": "Cross-Origin-Opener-Policy",          "value": "same-origin-allow-popups"        }      ]    }  ]}
```
```
{  "headers": [    {      "source": "/(.*)",      "headers": [        {          "key": "Cross-Origin-Opener-Policy",          "value": "same-origin-allow-popups"        }      ]    }  ]}
```
```
path
```
```
()
```
```
app/(content)/(writing)/
```
```
collections:  - name: pages    folder: app/(pages)    path: "{{slug}}/page"  # ← Failed to load existing entries    extension: mdx
```
```
collections:  - name: pages    folder: app/(pages)    path: "{{slug}}/page"  # ← Failed to load existing entries    extension: mdx
```
```
folder: ""
```
```
folder: "."
```
```
folder: "/"
```
```
/
```
```
collections:  - name: root-pages    folder: ""  # or "." or "/"    # ← Broke when creating entries via GitHub backend
```
```
collections:  - name: root-pages    folder: ""  # or "." or "/"    # ← Broke when creating entries via GitHub backend
```
```
<!-- OLD: Decap CMS --><script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script><!-- NEW: Sveltia CMS --><script src="https://unpkg.com/@sveltia/cms@0.128.5/dist/sveltia-cms.js" type="module"></script>
```
```
<!-- OLD: Decap CMS --><script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script><!-- NEW: Sveltia CMS --><script src="https://unpkg.com/@sveltia/cms@0.128.5/dist/sveltia-cms.js" type="module"></script>
```
This specialized AI agent skill empowers coding assistants like Claude Code to seamlessly integrate Sveltia CMS into diverse static website projects. Designed for developers and content managers seeking a lightweight, Git-based content management solution, it streamlines the setup and configuration process. The skill provides comprehensive support for common tasks, from initial setup to handling content collections and understanding deprecation notices. It's particularly valuable for projects requiring a robust yet easy-to-manage CMS that leverages Markdown, YAML, or JSON for content storage, making content updates intuitive for even non-technical contributors within a version-controlled environment.

# When to Use This Skill
- •When a Git-based content workflow is desired, storing content as Markdown, YAML, TOML, or JSON directly in the repository.
- •For projects requiring a lightweight CMS solution (<500 KB) to ensure fast load times and minimal overhead.
- •When migrating existing projects from Decap CMS or Netlify CMS, as Sveltia CMS serves as a drop-in replacement.
- •To provide non-technical editors with access to manage website content without requiring Git command-line knowledge.

# Pro Tips
- 💡Leverage Sveltia's exceptionally small footprint (<500 KB) for faster deployments and improved site performance compared to heavier CMS alternatives.
- 💡When migrating from Decap/Netlify CMS, treat Sveltia as a near drop-in replacement; focus on verifying existing collection configurations and fields rather than a complete rewrite.
- 💡Stay informed about breaking changes and deprecation notices (e.g., `slug_length` option) by consulting the skill's update section to ensure forward compatibility and smooth upgrades.

