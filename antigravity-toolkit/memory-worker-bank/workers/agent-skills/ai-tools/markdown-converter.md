# markdown-converter
Source: https://antigravity.codes/agent-skills/ai-tools/markdown-converter

## AI Worker Instructions
When the user requests functionality related to markdown-converter, follow these guidelines and utilize this context.

## Scraped Content

# markdown-converter
```
uvx markitdown
```
```
# Convert to stdoutuvx markitdown input.pdf# Save to fileuvx markitdown input.pdf -o output.mduvx markitdown input.docx > output.md# From stdincat input.pdf | uvx markitdown
```
```
# Convert to stdoutuvx markitdown input.pdf# Save to fileuvx markitdown input.pdf -o output.mduvx markitdown input.docx > output.md# From stdincat input.pdf | uvx markitdown
```
```
-o OUTPUT      # Output file-x EXTENSION   # Hint file extension (for stdin)-m MIME_TYPE   # Hint MIME type-c CHARSET     # Hint charset (e.g., UTF-8)-d             # Use Azure Document Intelligence-e ENDPOINT    # Document Intelligence endpoint--use-plugins  # Enable 3rd-party plugins--list-plugins # Show installed plugins
```
```
-o OUTPUT      # Output file-x EXTENSION   # Hint file extension (for stdin)-m MIME_TYPE   # Hint MIME type-c CHARSET     # Hint charset (e.g., UTF-8)-d             # Use Azure Document Intelligence-e ENDPOINT    # Document Intelligence endpoint--use-plugins  # Enable 3rd-party plugins--list-plugins # Show installed plugins
```
```
# Convert Word documentuvx markitdown report.docx -o report.md# Convert Excel spreadsheetuvx markitdown data.xlsx > data.md# Convert PowerPoint presentationuvx markitdown slides.pptx -o slides.md# Convert with file type hint (for stdin)cat document | uvx markitdown -x .pdf > output.md# Use Azure Document Intelligence for better PDF extractionuvx markitdown scan.pdf -d -e "https://your-resource.cognitiveservices.azure.com/"
```
```
# Convert Word documentuvx markitdown report.docx -o report.md# Convert Excel spreadsheetuvx markitdown data.xlsx > data.md# Convert PowerPoint presentationuvx markitdown slides.pptx -o slides.md# Convert with file type hint (for stdin)cat document | uvx markitdown -x .pdf > output.md# Use Azure Document Intelligence for better PDF extractionuvx markitdown scan.pdf -d -e "https://your-resource.cognitiveservices.azure.com/"
```
```
-d
```
Unlock the power of your diverse data sources by seamlessly transforming them into structured Markdown, perfect for AI processing. This robust agent skill bridges the gap between various file formats—from complex PDFs and Word documents to spreadsheets, web content, and even multimedia—and the text-based input required by large language models. Streamline your data preparation workflows, extract key information with ease, and ensure consistent, high-quality input for enhanced analysis and generation tasks, all without manual conversion headaches. Empower your AI to comprehend and utilize information from virtually any file type.

# When to Use This Skill
- •Processing legal contracts or research papers to extract key clauses or summary points for AI analysis.
- •Converting website HTML content or EPubs into a uniform text format for chatbot training or content summarization.
- •Extracting structured data from Excel spreadsheets or JSON/XML files into Markdown tables for quick review and LLM ingestion.
- •Preparing image descriptions via OCR or audio transcriptions for contextual understanding within an AI-driven knowledge base.

# Pro Tips
- 💡For conversions from `stdin` where the file type isn't obvious (e.g., piped content), always use `-x` or `-m` options to hint the extension or MIME type for more accurate parsing.
- 💡Combine this skill with a text summarization agent to automatically distill converted documents, providing concise outputs from complex source material.
- 💡When dealing with scanned documents or challenging PDFs, leverage the `-d` flag to utilize Azure Document Intelligence for superior OCR and layout understanding, significantly improving Markdown quality.

