# gpt-image-1-5
Source: https://antigravity.codes/agent-skills/creative/gpt-image-1-5

## AI Worker Instructions
When the user requests functionality related to gpt-image-1-5, follow these guidelines and utilize this context.

## Scraped Content

# gpt-image-1-5
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "your image description" --filename "output-name.png" [--quality low|medium|high] [--size 1024x1024|1024x1536|1536x1024|auto] [--background transparent|opaque|auto] [--api-key KEY]
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "your image description" --filename "output-name.png" [--quality low|medium|high] [--size 1024x1024|1024x1536|1536x1024|auto] [--background transparent|opaque|auto] [--api-key KEY]
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "editing instructions" --filename "output-name.png" --input-image "path/to/input.png" [--size 1024x1024|1024x1536|1536x1024|auto] [--api-key KEY]
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "editing instructions" --filename "output-name.png" --input-image "path/to/input.png" [--size 1024x1024|1024x1536|1536x1024|auto] [--api-key KEY]
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "what to put in masked area" --filename "output-name.png" --input-image "path/to/input.png" --mask "path/to/mask.png" [--size 1024x1024|1024x1536|1536x1024|auto] [--api-key KEY]
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "what to put in masked area" --filename "output-name.png" --input-image "path/to/input.png" --mask "path/to/mask.png" [--size 1024x1024|1024x1536|1536x1024|auto] [--api-key KEY]
```
```
medium
```
```
low
```
```
high
```
```
1024x1024
```
```
1024x1024
```
```
1024x1536
```
```
1536x1024
```
```
--api-key
```
```
OPENAI_API_KEY
```
```
yyyy-mm-dd-hh-mm-ss-name.png
```
```
{timestamp}-{descriptive-name}.png
```
```
yyyy-mm-dd-hh-mm-ss
```
```
x9k2
```
```
a7b3
```
```
2025-12-17-14-23-05-japanese-garden.png
```
```
2025-12-17-15-30-12-sunset-mountains.png
```
```
2025-12-17-16-45-33-robot.png
```
```
2025-12-17-17-12-48-x9k2.png
```
```
--input-image
```
```
--input-image
```
```
--mask
```
```
--prompt
```
```
--prompt
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "A serene Japanese garden with cherry blossoms" --filename "2025-12-17-14-23-05-japanese-garden.png" --quality high --size 1536x1024
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "A serene Japanese garden with cherry blossoms" --filename "2025-12-17-14-23-05-japanese-garden.png" --quality high --size 1536x1024
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "A cute cartoon cat mascot" --filename "2025-12-17-14-25-30-cat-mascot.png" --background transparent --quality high
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "A cute cartoon cat mascot" --filename "2025-12-17-14-25-30-cat-mascot.png" --background transparent --quality high
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "make the sky more dramatic with storm clouds" --filename "2025-12-17-14-27-00-dramatic-sky.png" --input-image "original-photo.jpg"
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "make the sky more dramatic with storm clouds" --filename "2025-12-17-14-27-00-dramatic-sky.png" --input-image "original-photo.jpg"
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "a flamingo swimming" --filename "2025-12-17-14-30-00-lounge-flamingo.png" --input-image "lounge.png" --mask "mask.png"
```
```
uv run ~/.claude/skills/gpt-image-1-5/scripts/generate_image.py --prompt "a flamingo swimming" --filename "2025-12-17-14-30-00-lounge-flamingo.png" --input-image "lounge.png" --mask "mask.png"
```
Unlock advanced visual capabilities directly within your coding environment with the GPT Image 1.5 Agent Skill. This powerful tool leverages OpenAI's cutting-edge model to transform your textual prompts into stunning visuals or meticulously refine existing images. Whether you need to rapidly prototype UI elements, create engaging content for documentation, or simply experiment with creative concepts, this skill provides seamless integration for both image generation and precise, mask-based editing. Empower your workflow to bridge the gap between code and captivating imagery effortlessly, enhancing productivity for developers and designers alike.

# When to Use This Skill
- •Generate placeholder images or mockups for web and app development based on textual descriptions.
- •Edit existing screenshots or UI elements to modify specific components or backgrounds without leaving the editor.
- •Create unique marketing assets or social media graphics from scratch using text prompts.
- •Perform precise image inpainting, replacing specific objects or areas within an image using a provided mask.

# Pro Tips
- 💡Utilize the `--mask` parameter for highly targeted edits, ensuring only the specified area is modified for precise control over your image manipulations.
- 💡Experiment with the `--quality` and `--size` parameters to balance output fidelity with generation time, especially for prototyping or final asset creation.
- 💡When editing, ensure your `--prompt` clearly describes the desired changes or what should appear in the masked area for optimal results.

