# favicon-gen
Source: https://antigravity.codes/agent-skills/ui-design/favicon-gen

## AI Worker Instructions
When the user requests functionality related to favicon-gen, follow these guidelines and utilize this context.

## Scraped Content

# favicon-gen
```
Do you have a logo with an icon element?├─ YES → Extract icon from logo (Method 1)└─ NO   ├─ Do you have text/initials?   │  ├─ YES → Create monogram favicon (Method 2)   │  └─ NO → Use branded shape (Method 3)
```
```
Do you have a logo with an icon element?├─ YES → Extract icon from logo (Method 1)└─ NO   ├─ Do you have text/initials?   │  ├─ YES → Create monogram favicon (Method 2)   │  └─ NO → Use branded shape (Method 3)
```
```
# 1. Identify the icon element in your logo SVG# 2. Copy just the icon paths/shapes# 3. Center in 32x32 viewBox# 4. Simplify for small sizes (remove fine details)
```
```
# 1. Identify the icon element in your logo SVG# 2. Copy just the icon paths/shapes# 3. Center in 32x32 viewBox# 4. Simplify for small sizes (remove fine details)
```
```
# 1. Choose 1-2 letters (initials or brand abbreviation)# 2. Pick shape template (circle, rounded square, shield)# 3. Set brand colors# 4. Generate SVG
```
```
# 1. Choose 1-2 letters (initials or brand abbreviation)# 2. Pick shape template (circle, rounded square, shield)# 3. Set brand colors# 4. Generate SVG
```
```
# 1. Choose industry-relevant shape# 2. Apply brand colors# 3. Generate SVG
```
```
# 1. Choose industry-relevant shape# 2. Apply brand colors# 3. Generate SVG
```
```
favicon.svg
```
```
favicon.ico
```
```
apple-touch-icon.png
```
```
icon-192.png
```
```
icon-512.png
```
```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">  <!-- Extracted icon paths here -->  <!-- Keep design simple, center in viewBox -->  <!-- Use brand colors --></svg>
```
```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">  <!-- Extracted icon paths here -->  <!-- Keep design simple, center in viewBox -->  <!-- Use brand colors --></svg>
```
```
templates/
```
```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">  <circle cx="16" cy="16" r="16" fill="#0066cc"/>  <text x="16" y="21" font-size="16" font-weight="bold"        text-anchor="middle" fill="#ffffff" font-family="sans-serif">AC</text></svg>
```
```
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">  <circle cx="16" cy="16" r="16" fill="#0066cc"/>  <text x="16" y="21" font-size="16" font-weight="bold"        text-anchor="middle" fill="#ffffff" font-family="sans-serif">AC</text></svg>
```
```
favicon.svg
```
```
favicon.ico
```
```
convert favicon.svg -define icon:auto-resize=16,32 favicon.ico
```
```
convert favicon.svg -define icon:auto-resize=16,32 favicon.ico
```
```
# Using ImageMagickconvert favicon.svg -resize 180x180 -background "#0066cc" -alpha remove apple-touch-icon.png# Or manually in Figma/Illustrator:# 1. Create 180x180 artboard with solid background color# 2. Center icon at appropriate size (~120x120)# 3. Export as PNG
```
```
# Using ImageMagickconvert favicon.svg -resize 180x180 -background "#0066cc" -alpha remove apple-touch-icon.png# Or manually in Figma/Illustrator:# 1. Create 180x180 artboard with solid background color# 2. Center icon at appropriate size (~120x120)# 3. Export as PNG
```
```
convert favicon.svg -resize 192x192 -background transparent icon-192.pngconvert favicon.svg -resize 512x512 -background transparent icon-512.png
```
```
convert favicon.svg -resize 192x192 -background transparent icon-192.pngconvert favicon.svg -resize 512x512 -background transparent icon-512.png
```
```
site.webmanifest
```
```
manifest.json
```
```
{  "name": "Your Business Name",  "short_name": "Business",  "icons": [    {      "src": "/icon-192.png",      "sizes": "192x192",      "type": "image/png"    },    {      "src": "/icon-512.png",      "sizes": "512x512",      "type": "image/png"    }  ],  "theme_color": "#0066cc",  "background_color": "#ffffff",  "display": "standalone"}
```
```
{  "name": "Your Business Name",  "short_name": "Business",  "icons": [    {      "src": "/icon-192.png",      "sizes": "192x192",      "type": "image/png"    },    {      "src": "/icon-512.png",      "sizes": "512x512",      "type": "image/png"    }  ],  "theme_color": "#0066cc",  "background_color": "#ffffff",  "display": "standalone"}
```
```
<head>
```
```
<!-- Modern browsers (SVG preferred) --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Legacy fallback (ICO) --><link rel="icon" type="image/x-icon" href="/favicon.ico"><!-- Apple Touch Icon (iOS) --><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><!-- Web App Manifest (Android, PWA) --><link rel="manifest" href="/site.webmanifest"><!-- Theme color (browser UI) --><meta name="theme-color" content="#0066cc">
```
```
<!-- Modern browsers (SVG preferred) --><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!-- Legacy fallback (ICO) --><link rel="icon" type="image/x-icon" href="/favicon.ico"><!-- Apple Touch Icon (iOS) --><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><!-- Web App Manifest (Android, PWA) --><link rel="manifest" href="/site.webmanifest"><!-- Theme color (browser UI) --><meta name="theme-color" content="#0066cc">
```
```
/public/
```
```
font-family="Arial, sans-serif"
```
```
font-family="Helvetica, sans-serif"
```
```
font-family="Verdana, sans-serif"
```
```
font-weight="bold"
```
```
font-weight="700"
```
```
templates/
```
```
favicon-svg-circle.svg
```
```
favicon-svg-square.svg
```
```
favicon-svg-shield.svg
```
```
<!-- ❌ WRONG (appears as black square on iOS) --><circle cx="16" cy="16" r="16" fill="transparent"/><!-- ✅ CORRECT (solid background) --><circle cx="16" cy="16" r="16" fill="#0066cc"/>
```
```
<!-- ❌ WRONG (appears as black square on iOS) --><circle cx="16" cy="16" r="16" fill="transparent"/><!-- ✅ CORRECT (solid background) --><circle cx="16" cy="16" r="16" fill="#0066cc"/>
```
```
favicon.svg
```
```
favicon.ico
```
```
apple-touch-icon.png
```
```
icon-192.png
```
```
icon-512.png
```
```
site.webmanifest
```
```
<link>
```
```
favicon-svg-circle.svg
```
```
favicon-svg-square.svg
```
```
favicon-svg-shield.svg
```
```
manifest.webmanifest
```
```
# Copy templatecp ~/.claude/skills/favicon-gen/templates/favicon-svg-circle.svg favicon.svg# Edit in text editor or Figma# Change colors, text, and customize# Generate ICO and PNGs from customized SVG
```
```
# Copy templatecp ~/.claude/skills/favicon-gen/templates/favicon-svg-circle.svg favicon.svg# Edit in text editor or Figma# Change colors, text, and customize# Generate ICO and PNGs from customized SVG
```
```
references/format-guide.md
```
```
references/extraction-methods.md
```
```
references/monogram-patterns.md
```
```
references/shape-templates.md
```
```
# Check SVG is valid XMLxmllint --noout favicon.svg# Or online: https://validator.w3.org/
```
```
# Check SVG is valid XMLxmllint --noout favicon.svg# Or online: https://validator.w3.org/
```
```
# Check ICO contains multiple sizesidentify favicon.ico# Should show:# favicon.ico[0] ICO 16x16# favicon.ico[1] ICO 32x32
```
```
# Check ICO contains multiple sizesidentify favicon.ico# Should show:# favicon.ico[0] ICO 16x16# favicon.ico[1] ICO 32x32
```
```
<link>
```
```
# Re-generate with solid backgroundconvert favicon.svg -resize 180x180 -background "#0066cc" -alpha remove apple-touch-icon.png
```
```
# Re-generate with solid backgroundconvert favicon.svg -resize 180x180 -background "#0066cc" -alpha remove apple-touch-icon.png
```
```
<head>
```
```
favicon.svg
```
```
favicon.ico
```
```
apple-touch-icon.png
```
```
icon-192.png
```
```
icon-512.png
```
```
site.webmanifest
```
```
references/format-guide.md
```
```
templates/
```
```
favicon.svg
```
```
favicon.ico
```
```
apple-touch-icon.png
```
```
icon-192.png
```
```
icon-512.png
```
```
site.webmanifest
```
```
convert favicon.svg -resize 180x180 apple-touch-icon.png
```
```
-background "#color" -alpha remove
```
```
# ❌ WRONG - will show black squareconvert favicon.svg -resize 180x180 apple-touch-icon.png# ✅ CORRECT - solid backgroundconvert favicon.svg -resize 180x180 -background "#0066cc" -alpha remove apple-touch-icon.png
```
```
# ❌ WRONG - will show black squareconvert favicon.svg -resize 180x180 apple-touch-icon.png# ✅ CORRECT - solid backgroundconvert favicon.svg -resize 180x180 -background "#0066cc" -alpha remove apple-touch-icon.png
```
```
convert favicon.svg -resize 16x16 favicon.ico
```
```
-define icon:auto-resize=16,32
```
```
# ❌ WRONG - only one sizeconvert favicon.svg -resize 16x16 favicon.ico# ✅ CORRECT - both sizesconvert favicon.svg -define icon:auto-resize=16,32 favicon.ico
```
```
# ❌ WRONG - only one sizeconvert favicon.svg -resize 16x16 favicon.ico# ✅ CORRECT - both sizesconvert favicon.svg -define icon:auto-resize=16,32 favicon.ico
```
```
identify favicon.ico# Should show TWO lines:# favicon.ico[0] ICO 16x16# favicon.ico[1] ICO 32x32
```
```
identify favicon.ico# Should show TWO lines:# favicon.ico[0] ICO 16x16# favicon.ico[1] ICO 32x32
```
```
font-weight="normal"
```
```
font-weight="400"
```
```
font-weight="bold"
```
```
font-weight="700"
```
```
<!-- ❌ WRONG - letters disappear at 16x16 --><text x="16" y="21" font-size="18" font-family="Arial">A</text><!-- ✅ CORRECT - bold weight required --><text x="16" y="21" font-size="18" font-weight="bold" font-family="Arial">A</text>
```
```
<!-- ❌ WRONG - letters disappear at 16x16 --><text x="16" y="21" font-size="18" font-family="Arial">A</text><!-- ✅ CORRECT - bold weight required --><text x="16" y="21" font-size="18" font-weight="bold" font-family="Arial">A</text>
```
```
<!-- ✅ CORRECT ORDER --><link rel="icon" type="image/svg+xml" href="/favicon.svg">  <!-- 1. Modern first --><link rel="icon" type="image/x-icon" href="/favicon.ico">   <!-- 2. Legacy fallback --><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">  <!-- 3. iOS --><link rel="manifest" href="/site.webmanifest">  <!-- 4. Android/PWA --><!-- ❌ WRONG ORDER --><link rel="icon" href="/favicon.ico">  <!-- Legacy first = modern browsers use ICO --><link rel="icon" href="/favicon.svg">  <!-- Too late, already loaded ICO -->
```
```
<!-- ✅ CORRECT ORDER --><link rel="icon" type="image/svg+xml" href="/favicon.svg">  <!-- 1. Modern first --><link rel="icon" type="image/x-icon" href="/favicon.ico">   <!-- 2. Legacy fallback --><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">  <!-- 3. iOS --><link rel="manifest" href="/site.webmanifest">  <!-- 4. Android/PWA --><!-- ❌ WRONG ORDER --><link rel="icon" href="/favicon.ico">  <!-- Legacy first = modern browsers use ICO --><link rel="icon" href="/favicon.svg">  <!-- Too late, already loaded ICO -->
```
```
<link>
```
```
{  "name": "Business Name",  "short_name": "Business",  "icons": [    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }  ],  "theme_color": "#0066cc",  "background_color": "#ffffff",  "display": "standalone"}
```
```
{  "name": "Business Name",  "short_name": "Business",  "icons": [    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }  ],  "theme_color": "#0066cc",  "background_color": "#ffffff",  "display": "standalone"}
```
```
/assets/favicon.svg
```
```
/favicon.svg
```
```
/images/icons/favicon.ico
```
```
/favicon.ico
```
```
/assets/favicon.svg
```
```
/public/  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/public/  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/public/  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/public/  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/  (root)  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/  (root)  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/wp-content/themes/your-theme/  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/wp-content/themes/your-theme/  ├── favicon.svg  ├── favicon.ico  ├── apple-touch-icon.png  ├── icon-192.png  ├── icon-512.png  └── site.webmanifest
```
```
/wp-content/uploads/favicon/
```
```
# Installnpm install -g svgo# Optimizesvgo favicon.svg# Before: 3,245 bytes → After: 892 bytes (typical)
```
```
# Installnpm install -g svgo# Optimizesvgo favicon.svg# Before: 3,245 bytes → After: 892 bytes (typical)
```
```
favicon.svg
```
```
favicon.ico
```
```
apple-touch-icon.png
```
```
icon-192.png
```
```
icon-512.png
```
```
site.webmanifest
```
```
<link>
```
```
<head>
```
```
<meta name="theme-color">
```
```
identify favicon.ico
```
In today's digital landscape, a favicon is crucial for brand recognition and user experience, yet often overlooked due to design complexities. This AI Agent Skill simplifies the entire favicon creation process, empowering developers and designers to quickly generate high-quality favicons directly within their coding environment. Whether extracting an icon from an existing logo, crafting a custom monogram from text, or designing a branded shape, this skill provides a streamlined, decision-tree-guided approach. It handles the nuances of SVG, ICO, and PNG conversions, ensuring your brand's smallest visual element is perfectly optimized for all browsers and devices.

# When to Use This Skill
- •Quickly generating a favicon when initiating a new web development project.
- •Extracting a standalone icon element from an existing SVG logo to create a simplified favicon.
- •Creating a monogram-style favicon for brands that primarily use text or initials in their identity.
- •Converting a generated SVG favicon into various necessary formats like ICO and PNG for broad browser compatibility.

# Pro Tips
- 💡Always simplify your icon designs; intricate details become indistinguishable at favicon sizes (e.g., 16x16px). Focus on clarity.
- 💡Leverage SVG as the primary source for your favicon, then use conversion tools to generate ICO and PNG formats for wider compatibility.
- 💡Ensure your generated favicon contrasts well against typical browser tab backgrounds (white/grey/dark mode) for optimal visibility and brand recognition.

