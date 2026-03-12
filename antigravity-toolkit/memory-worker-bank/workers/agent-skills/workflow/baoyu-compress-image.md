# baoyu-compress-image
Source: https://antigravity.codes/agent-skills/workflow/baoyu-compress-image

## AI Worker Instructions
When the user requests functionality related to baoyu-compress-image, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-compress-image
```
scripts/
```
```
SKILL_DIR
```
```
${SKILL_DIR}/scripts/<script-name>.ts
```
```
${SKILL_DIR}
```
```
scripts/main.ts
```
```
# Compress to WebP (default)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png# Keep original format (PNG → PNG)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png --format png# Custom qualitynpx -y bun ${SKILL_DIR}/scripts/main.ts image.png -q 75# Process directorynpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/ -r
```
```
# Compress to WebP (default)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png# Keep original format (PNG → PNG)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png --format png# Custom qualitynpx -y bun ${SKILL_DIR}/scripts/main.ts image.png -q 75# Process directorynpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/ -r
```
```
# Basic (converts to WebP, replaces original)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png# Custom output pathnpx -y bun ${SKILL_DIR}/scripts/main.ts image.png -o compressed.webp# Keep original filenpx -y bun ${SKILL_DIR}/scripts/main.ts image.png --keep# Custom quality (0-100, default: 80)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png -q 75# Keep original formatnpx -y bun ${SKILL_DIR}/scripts/main.ts image.png -f png
```
```
# Basic (converts to WebP, replaces original)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png# Custom output pathnpx -y bun ${SKILL_DIR}/scripts/main.ts image.png -o compressed.webp# Keep original filenpx -y bun ${SKILL_DIR}/scripts/main.ts image.png --keep# Custom quality (0-100, default: 80)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png -q 75# Keep original formatnpx -y bun ${SKILL_DIR}/scripts/main.ts image.png -f png
```
```
# Process all images in directorynpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/# Recursive processingnpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/ -r# With custom qualitynpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/ -r -q 75
```
```
# Process all images in directorynpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/# Recursive processingnpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/ -r# With custom qualitynpx -y bun ${SKILL_DIR}/scripts/main.ts ./images/ -r -q 75
```
```
# Plain text (default)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts image.png --json
```
```
# Plain text (default)npx -y bun ${SKILL_DIR}/scripts/main.ts image.png# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts image.png --json
```
```
<input>
```
```
--output <path>
```
```
-o
```
```
--format <fmt>
```
```
-f
```
```
--quality <n>
```
```
-q
```
```
--keep
```
```
-k
```
```
--recursive
```
```
-r
```
```
--json
```
```
--help
```
```
-h
```
```
convert
```
```
image.png → image.webp (245KB → 89KB, 64% reduction)
```
```
image.png → image.webp (245KB → 89KB, 64% reduction)
```
```
{  "input": "image.png",  "output": "image.webp",  "inputSize": 250880,  "outputSize": 91136,  "ratio": 0.36,  "compressor": "sips"}
```
```
{  "input": "image.png",  "output": "image.webp",  "inputSize": 250880,  "outputSize": 91136,  "ratio": 0.36,  "compressor": "sips"}
```
```
{  "files": [...],  "summary": {    "totalFiles": 10,    "totalInputSize": 2508800,    "totalOutputSize": 911360,    "ratio": 0.36,    "compressor": "sips"  }}
```
```
{  "files": [...],  "summary": {    "totalFiles": 10,    "totalInputSize": 2508800,    "totalOutputSize": 911360,    "ratio": 0.36,    "compressor": "sips"  }}
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts photo.png# photo.png → photo.webp (1.2MB → 340KB, 72% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts photo.png# photo.png → photo.webp (1.2MB → 340KB, 72% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts photo.png -q 60# photo.png → photo.webp (1.2MB → 280KB, 77% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts photo.png -q 60# photo.png → photo.webp (1.2MB → 280KB, 77% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts screenshot.png -f png --keep# screenshot.png → screenshot-compressed.png (500KB → 380KB, 24% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts screenshot.png -f png --keep# screenshot.png → screenshot-compressed.png (500KB → 380KB, 24% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts ./screenshots/ -r# Processed 15 files: 12.5MB → 4.2MB (66% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts ./screenshots/ -r# Processed 15 files: 12.5MB → 4.2MB (66% reduction)
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts image.png --json | jq '.ratio'
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts image.png --json | jq '.ratio'
```
```
.baoyu-skills/baoyu-compress-image/EXTEND.md
```
```
~/.baoyu-skills/baoyu-compress-image/EXTEND.md
```
Unlock powerful image optimization capabilities directly within your coding environment. This skill equips AI agents like Claude Code with the ability to swiftly compress image files, making your web projects load faster and consume less bandwidth. Whether you're dealing with a single asset or an entire directory, this tool intelligently handles various formats, prioritizing modern standards like WebP while maintaining compatibility with traditional formats. Elevate your development workflow by automating a critical performance enhancement step, ensuring your visual content is always delivered efficiently.

# When to Use This Skill
- •Optimizing website image assets before deployment to improve page load speed.
- •Batch processing an entire directory of images to convert them to WebP or compress existing PNGs.
- •Converting design mockups or screenshots to a more web-friendly format and size for documentation or presentations.
- •Integrating image compression into a build process or CI/CD pipeline for automated asset optimization.

# Pro Tips
- 💡Always test compressed images across different devices and browsers to ensure visual quality meets your standards, especially when adjusting the `--quality` parameter.
- 💡Utilize the `--recursive` (`-r`) flag when processing entire image directories to efficiently optimize all images in one command.
- 💡Leverage the `--format png` option when transparency is critical and the target environment requires PNGs, or when converting existing PNGs without changing their format.

