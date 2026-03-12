# baoyu-image-gen
Source: https://antigravity.codes/agent-skills/creative/baoyu-image-gen

## AI Worker Instructions
When the user requests functionality related to baoyu-image-gen, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-image-gen
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
# Basic generation (auto-detect provider)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png# With aspect rationpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A landscape" --image landscape.png --ar 16:9# High quality (2k)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --quality 2k# Specific providernpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --provider openai# From prompt filesnpx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image out.png# With reference images (Google multimodal only)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Make blue" --image out.png --ref source.png
```
```
# Basic generation (auto-detect provider)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png# With aspect rationpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A landscape" --image landscape.png --ar 16:9# High quality (2k)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --quality 2k# Specific providernpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --provider openai# From prompt filesnpx -y bun ${SKILL_DIR}/scripts/main.ts --promptfiles system.md content.md --image out.png# With reference images (Google multimodal only)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Make blue" --image out.png --ref source.png
```
```
# Generate with promptnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A sunset over mountains" --image sunset.png# Shorthandnpx -y bun ${SKILL_DIR}/scripts/main.ts -p "A cute robot" --image robot.png
```
```
# Generate with promptnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A sunset over mountains" --image sunset.png# Shorthandnpx -y bun ${SKILL_DIR}/scripts/main.ts -p "A cute robot" --image robot.png
```
```
# Common ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 2.35:1npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A portrait" --image portrait.png --ar 3:4# Or specify exact sizenpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Banner" --image banner.png --size 1792x1024
```
```
# Common ratios: 1:1, 16:9, 9:16, 4:3, 3:4, 2.35:1npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A portrait" --image portrait.png --ar 3:4# Or specify exact sizenpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Banner" --image banner.png --size 1792x1024
```
```
# Image editing with referencenpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Make it blue" --image blue.png --ref original.png# Multiple referencesnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Combine these styles" --image out.png --ref a.png b.png
```
```
# Image editing with referencenpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Make it blue" --image blue.png --ref original.png# Multiple referencesnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "Combine these styles" --image out.png --ref a.png b.png
```
```
# Normal quality (default)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --quality normal# High quality (2k resolution)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --quality 2k
```
```
# Normal quality (default)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --quality normal# High quality (2k resolution)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --quality 2k
```
```
# Plain output (prints saved path)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --json
```
```
# Plain output (prints saved path)npx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png# JSON outputnpx -y bun ${SKILL_DIR}/scripts/main.ts --prompt "A cat" --image cat.png --json
```
```
--prompt <text>
```
```
-p
```
```
--promptfiles <files...>
```
```
--image <path>
```
```
--provider google\|openai
```
```
--model <id>
```
```
-m
```
```
--ar <ratio>
```
```
16:9
```
```
1:1
```
```
4:3
```
```
--size <WxH>
```
```
1024x1024
```
```
--quality normal\|2k
```
```
--ref <files...>
```
```
--n <count>
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
OPENAI_API_KEY
```
```
GOOGLE_API_KEY
```
```
OPENAI_IMAGE_MODEL
```
```
gpt-image-1.5
```
```
GOOGLE_IMAGE_MODEL
```
```
gemini-3-pro-image-preview
```
```
OPENAI_BASE_URL
```
```
GOOGLE_BASE_URL
```
```
process.env
```
```
<cwd>/.baoyu-skills/.env
```
```
~/.baoyu-skills/.env
```
```
--provider
```
```
generateText
```
```
gemini-2.0-flash-exp-image-generation
```
```
experimental_generateImage
```
```
imagen-3.0-generate-002
```
```
experimental_generateImage
```
```
gpt-image-1
```
```
dall-e-3
```
```
gemini-3-pro-image-preview
```
```
gemini-2.0-flash-exp-image-generation
```
```
imagen-3.0-generate-002
```
```
gpt-image-1.5
```
```
gpt-image-1
```
```
dall-e-3
```
```
normal
```
```
2k
```
```
"... aspect ratio 16:9"
```
```
aspectRatio
```
```
size
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts \  --prompt "A minimalist tech illustration with blue gradients" \  --image cover.png --ar 2.35:1 --quality 2k
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts \  --prompt "A minimalist tech illustration with blue gradients" \  --image cover.png --ar 2.35:1 --quality 2k
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts \  --prompt "Instagram post about coffee" \  --image post.png --ar 1:1
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts \  --prompt "Instagram post about coffee" \  --image post.png --ar 1:1
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts \  --prompt "Change the background to sunset" \  --image edited.png --ref original.png --provider google
```
```
npx -y bun ${SKILL_DIR}/scripts/main.ts \  --prompt "Change the background to sunset" \  --image edited.png --ref original.png --provider google
```
```
# Create prompt file with detailed instructionsnpx -y bun ${SKILL_DIR}/scripts/main.ts \  --promptfiles style-guide.md scene-description.md \  --image scene.png
```
```
# Create prompt file with detailed instructionsnpx -y bun ${SKILL_DIR}/scripts/main.ts \  --promptfiles style-guide.md scene-description.md \  --image scene.png
```
```
.baoyu-skills/baoyu-image-gen/EXTEND.md
```
```
~/.baoyu-skills/baoyu-image-gen/EXTEND.md
```
Unleash your creative potential directly within your AI coding assistant with the Baoyu Image Generation Agent Skill. This powerful tool provides a seamless interface to leading AI image generation models from OpenAI and Google, including DALL-E and Imagen. Developers and designers can effortlessly transform text prompts into stunning visuals, experiment with various aspect ratios, and define image quality presets, all through a unified AI SDK. Streamline your workflow by integrating dynamic image creation into your development processes, prototyping, and content generation, empowering your agent to visualize concepts on demand.

# When to Use This Skill
- •Quickly generate placeholder images or mood boards for web design and application prototyping.
- •Create unique visual assets for marketing campaigns, social media posts, or blog articles directly from text prompts.
- •Generate concept art or visual ideas for game development and storytelling based on detailed descriptions.
- •Automate the creation of diverse image variations for A/B testing in design projects.

# Pro Tips
- 💡Leverage prompt files (`--promptfiles`) for intricate descriptions, allowing you to manage complex prompts and iterate on them easily, rather than typing long prompts directly in the command line.
- 💡Experiment with different `--provider` options (e.g., `openai` vs. `google`) to compare output styles and find the best fit for your specific artistic or technical requirements.
- 💡Always specify `--ar` (aspect ratio) and `--quality` parameters to tailor the output precisely for your target platform or use case, whether it's a social media banner or a high-resolution print asset.

