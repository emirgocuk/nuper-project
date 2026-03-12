# slack-gif-creator
Source: https://antigravity.codes/agent-skills/creative/slack-gif-creator

## AI Worker Instructions
When the user requests functionality related to slack-gif-creator, follow these guidelines and utilize this context.

## Scraped Content

# slack-gif-creator
```
from core.gif_builder import GIFBuilderfrom PIL import Image, ImageDraw# 1. Create builderbuilder = GIFBuilder(width=128, height=128, fps=10)# 2. Generate framesfor i in range(12):    frame = Image.new('RGB', (128, 128), (240, 248, 255))    draw = ImageDraw.Draw(frame)    # Draw your animation using PIL primitives    # (circles, polygons, lines, etc.)    builder.add_frame(frame)# 3. Save with optimizationbuilder.save('output.gif', num_colors=48, optimize_for_emoji=True)
```
```
from core.gif_builder import GIFBuilderfrom PIL import Image, ImageDraw# 1. Create builderbuilder = GIFBuilder(width=128, height=128, fps=10)# 2. Generate framesfor i in range(12):    frame = Image.new('RGB', (128, 128), (240, 248, 255))    draw = ImageDraw.Draw(frame)    # Draw your animation using PIL primitives    # (circles, polygons, lines, etc.)    builder.add_frame(frame)# 3. Save with optimizationbuilder.save('output.gif', num_colors=48, optimize_for_emoji=True)
```
```
from PIL import Imageuploaded = Image.open('file.png')# Use directly, or just as reference for colors/style
```
```
from PIL import Imageuploaded = Image.open('file.png')# Use directly, or just as reference for colors/style
```
```
from PIL import ImageDrawdraw = ImageDraw.Draw(frame)# Circles/ovalsdraw.ellipse([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)# Stars, triangles, any polygonpoints = [(x1, y1), (x2, y2), (x3, y3), ...]draw.polygon(points, fill=(r, g, b), outline=(r, g, b), width=3)# Linesdraw.line([(x1, y1), (x2, y2)], fill=(r, g, b), width=5)# Rectanglesdraw.rectangle([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)
```
```
from PIL import ImageDrawdraw = ImageDraw.Draw(frame)# Circles/ovalsdraw.ellipse([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)# Stars, triangles, any polygonpoints = [(x1, y1), (x2, y2), (x3, y3), ...]draw.polygon(points, fill=(r, g, b), outline=(r, g, b), width=3)# Linesdraw.line([(x1, y1), (x2, y2)], fill=(r, g, b), width=5)# Rectanglesdraw.rectangle([x1, y1, x2, y2], fill=(r, g, b), outline=(r, g, b), width=3)
```
```
width=2
```
```
create_gradient_background
```
```
core.gif_builder
```
```
builder = GIFBuilder(width=128, height=128, fps=10)builder.add_frame(frame)  # Add PIL Imagebuilder.add_frames(frames)  # Add list of framesbuilder.save('out.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
```
```
builder = GIFBuilder(width=128, height=128, fps=10)builder.add_frame(frame)  # Add PIL Imagebuilder.add_frames(frames)  # Add list of framesbuilder.save('out.gif', num_colors=48, optimize_for_emoji=True, remove_duplicates=True)
```
```
core.validators
```
```
from core.validators import validate_gif, is_slack_ready# Detailed validationpasses, info = validate_gif('my.gif', is_emoji=True, verbose=True)# Quick checkif is_slack_ready('my.gif'):    print("Ready!")
```
```
from core.validators import validate_gif, is_slack_ready# Detailed validationpasses, info = validate_gif('my.gif', is_emoji=True, verbose=True)# Quick checkif is_slack_ready('my.gif'):    print("Ready!")
```
```
core.easing
```
```
from core.easing import interpolate# Progress from 0.0 to 1.0t = i / (num_frames - 1)# Apply easingy = interpolate(start=0, end=400, t=t, easing='ease_out')# Available: linear, ease_in, ease_out, ease_in_out,#           bounce_out, elastic_out, back_out
```
```
from core.easing import interpolate# Progress from 0.0 to 1.0t = i / (num_frames - 1)# Apply easingy = interpolate(start=0, end=400, t=t, easing='ease_out')# Available: linear, ease_in, ease_out, ease_in_out,#           bounce_out, elastic_out, back_out
```
```
core.frame_composer
```
```
from core.frame_composer import (    create_blank_frame,         # Solid color background    create_gradient_background,  # Vertical gradient    draw_circle,                # Helper for circles    draw_text,                  # Simple text rendering    draw_star                   # 5-pointed star)
```
```
from core.frame_composer import (    create_blank_frame,         # Solid color background    create_gradient_background,  # Vertical gradient    draw_circle,                # Helper for circles    draw_text,                  # Simple text rendering    draw_star                   # 5-pointed star)
```
```
math.sin()
```
```
math.cos()
```
```
math.sin(t * frequency * 2 * math.pi)
```
```
interpolate()
```
```
easing='bounce_out'
```
```
easing='ease_in'
```
```
image.rotate(angle, resample=Image.BICUBIC)
```
```
Image.blend(image1, image2, alpha)
```
```
interpolate()
```
```
easing='ease_out'
```
```
easing='back_out'
```
```
x += vx
```
```
y += vy
```
```
vy += gravity_constant
```
```
num_colors=48
```
```
remove_duplicates=True
```
```
optimize_for_emoji=True
```
```
# Maximum optimization for emojibuilder.save(    'emoji.gif',    num_colors=48,    optimize_for_emoji=True,    remove_duplicates=True)
```
```
# Maximum optimization for emojibuilder.save(    'emoji.gif',    num_colors=48,    optimize_for_emoji=True,    remove_duplicates=True)
```
```
pip install pillow imageio numpy
```
```
pip install pillow imageio numpy
```
Unlock the full potential of visual communication within Slack by leveraging this specialized AI Agent Skill for GIF creation. Designed to streamline the process of generating animated content, it equips your coding assistant with the precise knowledge and tools to craft GIFs that meet Slack's specific technical requirements. From tiny emoji GIFs to larger message animations, this skill ensures optimal dimensions, frame rates, and color palettes, empowering users to express complex ideas or add a touch of humor with perfectly formatted visuals, enhancing collaboration and engagement across all Slack channels with ease and efficiency.

# When to Use This Skill
- •Creating a custom animated emoji for a team's inside joke or event.
- •Generating a short, looping tutorial GIF to explain a new UI feature or code snippet.
- •Animate a series of still images or user-uploaded graphics into a concise Slack-optimized GIF.
- •Responding to prompts like "make me a 128x128 GIF of a cat typing for Slack."

# Pro Tips
- 💡Always prioritize Slack's specific constraints (dimensions, FPS, colors) for maximum compatibility and smallest file size, especially for emoji GIFs.
- 💡Encourage users to describe the *mood* or *purpose* of the GIF, not just the content, to better inform animation style (e.g., "a playful GIF" vs. "a fast-paced GIF").
- 💡When working with user-provided images, clarify whether they want the image animated *directly* or used as *inspiration* for a new animation.

