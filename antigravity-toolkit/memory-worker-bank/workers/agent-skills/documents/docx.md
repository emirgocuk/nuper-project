# docx
Source: https://antigravity.codes/agent-skills/documents/docx

## AI Worker Instructions
When the user requests functionality related to docx, follow these guidelines and utilize this context.

## Scraped Content

# docx
```
# Convert document to markdown with tracked changespandoc --track-changes=all path-to-file.docx -o output.md# Options: --track-changes=accept/reject/all
```
```
# Convert document to markdown with tracked changespandoc --track-changes=all path-to-file.docx -o output.md# Options: --track-changes=accept/reject/all
```
```
python ooxml/scripts/unpack.py <office_file> <output_directory>
```
```
word/document.xml
```
```
word/comments.xml
```
```
word/media/
```
```
<w:ins>
```
```
<w:del>
```
```
docx-js.md
```
```
ooxml.md
```
```
python ooxml/scripts/unpack.py <office_file> <output_directory>
```
```
python ooxml/scripts/pack.py <input_directory> <office_file>
```
```
<w:r>
```
```
# BAD - Replaces entire sentence'<w:del><w:r><w:delText>The term is 30 days.</w:delText></w:r></w:del><w:ins><w:r><w:t>The term is 60 days.</w:t></w:r></w:ins>'# GOOD - Only marks what changed, preserves original <w:r> for unchanged text'<w:r w:rsidR="00AB12CD"><w:t>The term is </w:t></w:r><w:del><w:r><w:delText>30</w:delText></w:r></w:del><w:ins><w:r><w:t>60</w:t></w:r></w:ins><w:r w:rsidR="00AB12CD"><w:t> days.</w:t></w:r>'
```
```
# BAD - Replaces entire sentence'<w:del><w:r><w:delText>The term is 30 days.</w:delText></w:r></w:del><w:ins><w:r><w:t>The term is 60 days.</w:t></w:r></w:ins>'# GOOD - Only marks what changed, preserves original <w:r> for unchanged text'<w:r w:rsidR="00AB12CD"><w:t>The term is </w:t></w:r><w:del><w:r><w:delText>30</w:delText></w:r></w:del><w:ins><w:r><w:t>60</w:t></w:r></w:ins><w:r w:rsidR="00AB12CD"><w:t> days.</w:t></w:r>'
```
```
pandoc --track-changes=all path-to-file.docx -o current.md
```
```
pandoc --track-changes=all path-to-file.docx -o current.md
```
```
ooxml.md
```
```
python ooxml/scripts/unpack.py <file.docx> <dir>
```
```
word/document.xml
```
```
<w:r>
```
```
get_node
```
```
doc.save()
```
```
word/document.xml
```
```
python ooxml/scripts/pack.py unpacked reviewed-document.docx
```
```
python ooxml/scripts/pack.py unpacked reviewed-document.docx
```
```
pandoc --track-changes=all reviewed-document.docx -o verification.md
```
```
pandoc --track-changes=all reviewed-document.docx -o verification.md
```
```
grep "original phrase" verification.md  # Should NOT find it     grep "replacement phrase" verification.md  # Should find it
```
```
grep "original phrase" verification.md  # Should NOT find it     grep "replacement phrase" verification.md  # Should find it
```
```
soffice --headless --convert-to pdf document.docx
```
```
soffice --headless --convert-to pdf document.docx
```
```
pdftoppm -jpeg -r 150 document.pdf page
```
```
pdftoppm -jpeg -r 150 document.pdf page
```
```
page-1.jpg
```
```
page-2.jpg
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
page
```
```
pdftoppm -jpeg -r 150 -f 2 -l 5 document.pdf page  # Converts only pages 2-5
```
```
pdftoppm -jpeg -r 150 -f 2 -l 5 document.pdf page  # Converts only pages 2-5
```
```
sudo apt-get install pandoc
```
```
npm install -g docx
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
This DOCX Agent Skill empowers AI coding assistants to proficiently interact with Microsoft Word documents, a cornerstone of professional communication. Beyond simple text processing, it enables complex operations like tracking changes, managing comments, and preserving intricate formatting. Developers leveraging this skill can automate document generation, facilitate collaborative content review within their workflows, and extract structured information from reports directly, bridging the gap between code and content. It's an an indispensable tool for agents needing to operate effectively in environments where formal documentation is paramount, significantly enhancing an AI's utility in business and academic contexts.

# When to Use This Skill
- •Automatically generating new professional reports, proposals, or contracts based on provided data or templates.
- •Editing existing Word documents, applying updates, correcting errors, or integrating new content while preserving formatting.
- •Reviewing and analyzing legal, academic, or business documents, including identifying and processing tracked changes and comments.
- •Extracting specific text, data, or structural information from complex DOCX files for further processing or database integration.

# Pro Tips
- 💡For basic text extraction without full formatting, use `pandoc` to convert DOCX to Markdown; leverage `--track-changes=all` for review workflows.
- 💡When dealing with existing documents from others, always default to the 'Redlining workflow' to ensure changes are tracked and visible for collaborative review.
- 💡For creating new documents or making simple changes to your own, consider the 'Basic OOXML editing' workflow for direct, efficient manipulation of the underlying XML structure.

