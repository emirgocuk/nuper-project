# lorem-ipsum
Source: https://antigravity.codes/agent-skills/workflow/lorem-ipsum

## AI Worker Instructions
When the user requests functionality related to lorem-ipsum, follow these guidelines and utilize this context.

## Scraped Content

# lorem-ipsum
```
scripts/generate.py
```
```
# Generate 3 paragraphs (default)uv run scripts/generate.py# Generate 5 paragraphs with 4 sentences eachuv run scripts/generate.py --paragraphs 5 --sentences 4# Generate approximately 500 wordsuv run scripts/generate.py --words 500# Generate exactly 1000 charactersuv run scripts/generate.py --characters 1000# Generate approximately 200 LLM tokens (~800 characters)uv run scripts/generate.py --tokens 200# Continuous text without paragraph breaksuv run scripts/generate.py --paragraphs 4 --continuous
```
```
# Generate 3 paragraphs (default)uv run scripts/generate.py# Generate 5 paragraphs with 4 sentences eachuv run scripts/generate.py --paragraphs 5 --sentences 4# Generate approximately 500 wordsuv run scripts/generate.py --words 500# Generate exactly 1000 charactersuv run scripts/generate.py --characters 1000# Generate approximately 200 LLM tokens (~800 characters)uv run scripts/generate.py --tokens 200# Continuous text without paragraph breaksuv run scripts/generate.py --paragraphs 4 --continuous
```
```
# 3 sections with headings and 2 paragraphs eachuv run scripts/generate.py --headings 3 --paragraphs 6# 4 sections with bullet points (5 bullets each)uv run scripts/generate.py --headings 4 --bullets 5# Numbered lists instead of bulletsuv run scripts/generate.py --headings 3 --bullets 6 --numbered# Realistic mixed document with 5 sections (varied content types)uv run scripts/generate.py --mixed 5
```
```
# 3 sections with headings and 2 paragraphs eachuv run scripts/generate.py --headings 3 --paragraphs 6# 4 sections with bullet points (5 bullets each)uv run scripts/generate.py --headings 4 --bullets 5# Numbered lists instead of bulletsuv run scripts/generate.py --headings 3 --bullets 6 --numbered# Realistic mixed document with 5 sections (varied content types)uv run scripts/generate.py --mixed 5
```
```
--mixed
```
```
# Write to fileuv run scripts/generate.py --paragraphs 3 --output ~/Desktop/placeholder.txt# HTML formatuv run scripts/generate.py --headings 2 --format html --output page.html# Plain text (no markdown formatting)uv run scripts/generate.py --format text# Copy to clipboarduv run scripts/generate.py --words 200 | pbcopy
```
```
# Write to fileuv run scripts/generate.py --paragraphs 3 --output ~/Desktop/placeholder.txt# HTML formatuv run scripts/generate.py --headings 2 --format html --output page.html# Plain text (no markdown formatting)uv run scripts/generate.py --format text# Copy to clipboarduv run scripts/generate.py --words 200 | pbcopy
```
```
--paragraphs N
```
```
--sentences N
```
```
--words N
```
```
--characters N
```
```
--tokens N
```
```
--continuous
```
```
--headings N
```
```
--bullets N
```
```
--numbered
```
```
--mixed N
```
```
--output FILE
```
```
--format FORMAT
```
```
scripts/generate.py
```
```
--output
```
```
pbcopy
```
```
uv run scripts/generate.py --paragraphs 3
```
```
uv run scripts/generate.py --paragraphs 3
```
```
uv run scripts/generate.py --headings 3 --paragraphs 6
```
```
uv run scripts/generate.py --headings 3 --paragraphs 6
```
```
uv run scripts/generate.py --headings 3 --bullets 5
```
```
uv run scripts/generate.py --headings 3 --bullets 5
```
```
uv run scripts/generate.py --words 500 --continuous --output ~/Desktop/placeholder.txt
```
```
uv run scripts/generate.py --words 500 --continuous --output ~/Desktop/placeholder.txt
```
```
uv run scripts/generate.py --headings 4 --bullets 5 --numbered --format html
```
```
uv run scripts/generate.py --headings 4 --bullets 5 --numbered --format html
```
```
uv run scripts/generate.py --characters 500
```
```
uv run scripts/generate.py --characters 500
```
```
uv run scripts/generate.py --tokens 100 --headings 2
```
```
uv run scripts/generate.py --tokens 100 --headings 2
```
```
uv run scripts/generate.py --mixed 5
```
```
uv run scripts/generate.py --mixed 5
```
In the realm of web design and development, the need for realistic yet meaningless placeholder text is constant. This AI agent skill for generating lorem ipsum streamlines the process, ensuring consistent, authentic-looking content for your mockups, prototypes, and staging environments. Instead of manually copying random text, leverage this tool to quickly populate layouts, test responsiveness, and visualize data flow without the distraction of meaningful content. It's an indispensable asset for designers, developers, and content creators looking to accelerate their workflow and focus on structure rather than prose.

# When to Use This Skill
- •Populating UI/UX mockups and prototypes to visualize layout and content flow before final copy is available.
- •Testing responsiveness of web pages or applications with varying text lengths and structures.
- •Creating temporary content for staging environments or demos where real data is not yet integrated.
- •Generating filler text for documentation templates or boilerplate files during development.

# Pro Tips
- 💡Always specify `uv run scripts/generate.py` as instructed, avoiding direct manual input of lorem ipsum to ensure authenticity and consistency.
- 💡Utilize the `--continuous` flag when you need a single block of text without paragraph breaks, ideal for single large text areas or specific design elements.
- 💡For highly structured content, combine options like `--sections`, `--paragraphs`, and `--lists` to simulate complex page layouts rapidly.

