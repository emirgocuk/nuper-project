# pptx
Source: https://antigravity.codes/agent-skills/documents/pptx

## AI Worker Instructions
When the user requests functionality related to pptx, follow these guidelines and utilize this context.

## Scraped Content

# pptx
```
# Convert document to markdownpython -m markitdown path-to-file.pptx
```
```
# Convert document to markdownpython -m markitdown path-to-file.pptx
```
```
python ooxml/scripts/unpack.py <office_file> <output_dir>
```
```
skills/pptx/ooxml/scripts/unpack.py
```
```
find . -name "unpack.py"
```
```
ppt/presentation.xml
```
```
ppt/slides/slide{N}.xml
```
```
ppt/notesSlides/notesSlide{N}.xml
```
```
ppt/comments/modernComment_*.xml
```
```
ppt/slideLayouts/
```
```
ppt/slideMasters/
```
```
ppt/theme/
```
```
ppt/media/
```
```
ppt/theme/theme1.xml
```
```
<a:clrScheme>
```
```
<a:fontScheme>
```
```
ppt/slides/slide1.xml
```
```
<a:rPr>
```
```
<a:solidFill>
```
```
<a:srgbClr>
```
```
html2pptx.md
```
```
<p>
```
```
<h1>
```
```
<h6>
```
```
<ul>
```
```
<ol>
```
```
class="placeholder"
```
```
html2pptx.js
```
```
html2pptx()
```
```
pptx.writeFile()
```
```
python scripts/thumbnail.py output.pptx workspace/thumbnails --cols 4
```
```
ooxml.md
```
```
python ooxml/scripts/unpack.py <office_file> <output_dir>
```
```
ppt/slides/slide{N}.xml
```
```
python ooxml/scripts/validate.py <dir> --original <file>
```
```
python ooxml/scripts/pack.py <input_directory> <office_file>
```
```
python -m markitdown template.pptx > template-content.md
```
```
template-content.md
```
```
python scripts/thumbnail.py template.pptx
```
```
template-inventory.md
```
```
# Template Inventory Analysis     **Total Slides: [count]**     **IMPORTANT: Slides are 0-indexed (first slide = 0, last slide = count-1)**     ## [Category Name]     - Slide 0: [Layout code if available] - Description/purpose     - Slide 1: [Layout code] - Description/purpose     - Slide 2: [Layout code] - Description/purpose     [... EVERY slide must be listed individually with its index ...]
```
```
# Template Inventory Analysis     **Total Slides: [count]**     **IMPORTANT: Slides are 0-indexed (first slide = 0, last slide = count-1)**     ## [Category Name]     - Slide 0: [Layout code if available] - Description/purpose     - Slide 1: [Layout code] - Description/purpose     - Slide 2: [Layout code] - Description/purpose     [... EVERY slide must be listed individually with its index ...]
```
```
outline.md
```
```
# Template slides to use (0-based indexing)      # WARNING: Verify indices are within range! Template with 73 slides has indices 0-72      # Mapping: slide numbers from outline -> template slide indices      template_mapping = [          0,   # Use slide 0 (Title/Cover)          34,  # Use slide 34 (B1: Title and body)          34,  # Use slide 34 again (duplicate for second B1)          50,  # Use slide 50 (E1: Quote)          54,  # Use slide 54 (F2: Closing + Text)      ]
```
```
# Template slides to use (0-based indexing)      # WARNING: Verify indices are within range! Template with 73 slides has indices 0-72      # Mapping: slide numbers from outline -> template slide indices      template_mapping = [          0,   # Use slide 0 (Title/Cover)          34,  # Use slide 34 (B1: Title and body)          34,  # Use slide 34 again (duplicate for second B1)          50,  # Use slide 50 (E1: Quote)          54,  # Use slide 54 (F2: Closing + Text)      ]
```
```
rearrange.py
```
```
scripts/rearrange.py
```
```
python scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52
```
```
python scripts/rearrange.py template.pptx working.pptx 0,34,34,50,52
```
```
inventory.py
```
```
python scripts/inventory.py working.pptx text-inventory.json
```
```
python scripts/inventory.py working.pptx text-inventory.json
```
```
{          "slide-0": {            "shape-0": {              "placeholder_type": "TITLE",  // or null for non-placeholders              "left": 1.5,                  // position in inches              "top": 2.0,              "width": 7.5,              "height": 1.2,              "paragraphs": [                {                  "text": "Paragraph text",                  // Optional properties (only included when non-default):                  "bullet": true,           // explicit bullet detected                  "level": 0,               // only included when bullet is true                  "alignment": "CENTER",    // CENTER, RIGHT (not LEFT)                  "space_before": 10.0,     // space before paragraph in points                  "space_after": 6.0,       // space after paragraph in points                  "line_spacing": 22.4,     // line spacing in points                  "font_name": "Arial",     // from first run                  "font_size": 14.0,        // in points                  "bold": true,                  "italic": false,                  "underline": false,                  "color": "FF0000"         // RGB color                }              ]            }          }        }
```
```
{          "slide-0": {            "shape-0": {              "placeholder_type": "TITLE",  // or null for non-placeholders              "left": 1.5,                  // position in inches              "top": 2.0,              "width": 7.5,              "height": 1.2,              "paragraphs": [                {                  "text": "Paragraph text",                  // Optional properties (only included when non-default):                  "bullet": true,           // explicit bullet detected                  "level": 0,               // only included when bullet is true                  "alignment": "CENTER",    // CENTER, RIGHT (not LEFT)                  "space_before": 10.0,     // space before paragraph in points                  "space_after": 6.0,       // space after paragraph in points                  "line_spacing": 22.4,     // line spacing in points                  "font_name": "Arial",     // from first run                  "font_size": 14.0,        // in points                  "bold": true,                  "italic": false,                  "underline": false,                  "color": "FF0000"         // RGB color                }              ]            }          }        }
```
```
default_font_size
```
```
bullet: true
```
```
level
```
```
space_before
```
```
space_after
```
```
line_spacing
```
```
color
```
```
theme_color
```
```
alignment
```
```
"bullet": true
```
```
"bold": true
```
```
"bullet": true, "level": 0
```
```
"alignment": "CENTER"
```
```
"font_size": 14.0
```
```
"font_name": "Lora"
```
```
"color": "FF0000"
```
```
"theme_color": "DARK_1"
```
```
replacement-text.json
```
```
"paragraphs": [     {       "text": "New presentation title text",       "alignment": "CENTER",       "bold": true     },     {       "text": "Section Header",       "bold": true     },     {       "text": "First bullet point without bullet symbol",       "bullet": true,       "level": 0     },     {       "text": "Red colored text",       "color": "FF0000"     },     {       "text": "Theme colored text",       "theme_color": "DARK_1"     },     {       "text": "Regular paragraph text without special formatting"     }   ]
```
```
"paragraphs": [     {       "text": "New presentation title text",       "alignment": "CENTER",       "bold": true     },     {       "text": "Section Header",       "bold": true     },     {       "text": "First bullet point without bullet symbol",       "bullet": true,       "level": 0     },     {       "text": "Red colored text",       "color": "FF0000"     },     {       "text": "Theme colored text",       "theme_color": "DARK_1"     },     {       "text": "Regular paragraph text without special formatting"     }   ]
```
```
{     "slide-0": {       "shape-0": {         "paragraphs": [...] // This shape gets new text       }       // shape-1 and shape-2 from inventory will be cleared automatically     }   }
```
```
{     "slide-0": {       "shape-0": {         "paragraphs": [...] // This shape gets new text       }       // shape-1 and shape-2 from inventory will be cleared automatically     }   }
```
```
"bullet": true, "level": 0
```
```
replace.py
```
```
python scripts/replace.py working.pptx replacement-text.json output.pptx
```
```
python scripts/replace.py working.pptx replacement-text.json output.pptx
```
```
ERROR: Invalid shapes in replacement JSON:     - Shape 'shape-99' not found on 'slide-0'. Available shapes: shape-0, shape-1, shape-4     - Slide 'slide-999' not found in inventory
```
```
ERROR: Invalid shapes in replacement JSON:     - Shape 'shape-99' not found on 'slide-0'. Available shapes: shape-0, shape-1, shape-4     - Slide 'slide-999' not found in inventory
```
```
ERROR: Replacement text made overflow worse in these shapes:     - slide-0/shape-2: overflow worsened by 1.25" (was 0.00", now 1.25")
```
```
ERROR: Replacement text made overflow worse in these shapes:     - slide-0/shape-2: overflow worsened by 1.25" (was 0.00", now 1.25")
```
```
python scripts/thumbnail.py template.pptx [output_prefix]
```
```
python scripts/thumbnail.py template.pptx [output_prefix]
```
```
thumbnails.jpg
```
```
thumbnails-1.jpg
```
```
thumbnails-2.jpg
```
```
python scripts/thumbnail.py template.pptx my-grid
```
```
workspace/my-grid
```
```
--cols 4
```
```
# Basic usagepython scripts/thumbnail.py presentation.pptx# Combine options: custom name, columnspython scripts/thumbnail.py template.pptx analysis --cols 4
```
```
# Basic usagepython scripts/thumbnail.py presentation.pptx# Combine options: custom name, columnspython scripts/thumbnail.py template.pptx analysis --cols 4
```
```
soffice --headless --convert-to pdf template.pptx
```
```
soffice --headless --convert-to pdf template.pptx
```
```
pdftoppm -jpeg -r 150 template.pdf slide
```
```
pdftoppm -jpeg -r 150 template.pdf slide
```
```
slide-1.jpg
```
```
slide-2.jpg
```
```
-r 150
```
```
-jpeg
```
```
-png
```
```
-f N
```
```
-f 2
```
```
-l N
```
```
-l 5
```
```
slide
```
```
pdftoppm -jpeg -r 150 -f 2 -l 5 template.pdf slide  # Converts only pages 2-5
```
```
pdftoppm -jpeg -r 150 -f 2 -l 5 template.pdf slide  # Converts only pages 2-5
```
```
pip install "markitdown[pptx]"
```
```
npm install -g pptxgenjs
```
```
npm install -g playwright
```
```
npm install -g react-icons react react-dom
```
```
npm install -g sharp
```
```
sudo apt-get install libreoffice
```
```
sudo apt-get install poppler-utils
```
```
pip install defusedxml
```
Empower your AI assistant to seamlessly interact with PowerPoint presentations. This skill equips agents with the ability to not only generate and modify .pptx files but also to delve into their intricate XML structures for advanced tasks like managing speaker notes or customizing slide layouts. From simple text extraction to complex content manipulation, the PPTX skill transforms your AI into a powerful presentation co-pilot, streamlining workflows for report generation, content updates, and data visualization within a presentation format.

# When to Use This Skill
- •Automating report generation by populating presentation templates with data.
- •Extracting key insights and text content from multiple presentations for summarization.
- •Modifying presentation layouts or adding speaker notes programmatically based on user instructions.
- •Creating new presentation drafts from scratch with specific content and design requirements.

# Pro Tips
- 💡For simple text extraction, prioritize the `markitdown` tool to quickly convert PPTX to markdown, saving computational resources compared to full XML parsing.
- 💡When dealing with complex formatting, comments, or speaker notes, always default to unpacking the PPTX file to access its raw XML structure for precise manipulation.
- 💡Leverage the `ooxml/scripts/unpack.py` script as a first step for any deep analysis or modification, as it provides the granular access needed for advanced tasks.

