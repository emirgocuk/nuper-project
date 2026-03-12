# pdf
Source: https://antigravity.codes/agent-skills/python/pdf

## AI Worker Instructions
When the user requests functionality related to pdf, follow these guidelines and utilize this context.

## Scraped Content

# pdf
```
from pypdf import PdfReader, PdfWriter# Read a PDFreader = PdfReader("document.pdf")print(f"Pages: {len(reader.pages)}")# Extract texttext = ""for page in reader.pages:    text += page.extract_text()
```
```
from pypdf import PdfReader, PdfWriter# Read a PDFreader = PdfReader("document.pdf")print(f"Pages: {len(reader.pages)}")# Extract texttext = ""for page in reader.pages:    text += page.extract_text()
```
```
from pypdf import PdfWriter, PdfReaderwriter = PdfWriter()for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:    reader = PdfReader(pdf_file)    for page in reader.pages:        writer.add_page(page)with open("merged.pdf", "wb") as output:    writer.write(output)
```
```
from pypdf import PdfWriter, PdfReaderwriter = PdfWriter()for pdf_file in ["doc1.pdf", "doc2.pdf", "doc3.pdf"]:    reader = PdfReader(pdf_file)    for page in reader.pages:        writer.add_page(page)with open("merged.pdf", "wb") as output:    writer.write(output)
```
```
reader = PdfReader("input.pdf")for i, page in enumerate(reader.pages):    writer = PdfWriter()    writer.add_page(page)    with open(f"page_{i+1}.pdf", "wb") as output:        writer.write(output)
```
```
reader = PdfReader("input.pdf")for i, page in enumerate(reader.pages):    writer = PdfWriter()    writer.add_page(page)    with open(f"page_{i+1}.pdf", "wb") as output:        writer.write(output)
```
```
reader = PdfReader("document.pdf")meta = reader.metadataprint(f"Title: {meta.title}")print(f"Author: {meta.author}")print(f"Subject: {meta.subject}")print(f"Creator: {meta.creator}")
```
```
reader = PdfReader("document.pdf")meta = reader.metadataprint(f"Title: {meta.title}")print(f"Author: {meta.author}")print(f"Subject: {meta.subject}")print(f"Creator: {meta.creator}")
```
```
reader = PdfReader("input.pdf")writer = PdfWriter()page = reader.pages[0]page.rotate(90)  # Rotate 90 degrees clockwisewriter.add_page(page)with open("rotated.pdf", "wb") as output:    writer.write(output)
```
```
reader = PdfReader("input.pdf")writer = PdfWriter()page = reader.pages[0]page.rotate(90)  # Rotate 90 degrees clockwisewriter.add_page(page)with open("rotated.pdf", "wb") as output:    writer.write(output)
```
```
import pdfplumberwith pdfplumber.open("document.pdf") as pdf:    for page in pdf.pages:        text = page.extract_text()        print(text)
```
```
import pdfplumberwith pdfplumber.open("document.pdf") as pdf:    for page in pdf.pages:        text = page.extract_text()        print(text)
```
```
with pdfplumber.open("document.pdf") as pdf:    for i, page in enumerate(pdf.pages):        tables = page.extract_tables()        for j, table in enumerate(tables):            print(f"Table {j+1} on page {i+1}:")            for row in table:                print(row)
```
```
with pdfplumber.open("document.pdf") as pdf:    for i, page in enumerate(pdf.pages):        tables = page.extract_tables()        for j, table in enumerate(tables):            print(f"Table {j+1} on page {i+1}:")            for row in table:                print(row)
```
```
import pandas as pdwith pdfplumber.open("document.pdf") as pdf:    all_tables = []    for page in pdf.pages:        tables = page.extract_tables()        for table in tables:            if table:  # Check if table is not empty                df = pd.DataFrame(table[1:], columns=table[0])                all_tables.append(df)# Combine all tablesif all_tables:    combined_df = pd.concat(all_tables, ignore_index=True)    combined_df.to_excel("extracted_tables.xlsx", index=False)
```
```
import pandas as pdwith pdfplumber.open("document.pdf") as pdf:    all_tables = []    for page in pdf.pages:        tables = page.extract_tables()        for table in tables:            if table:  # Check if table is not empty                df = pd.DataFrame(table[1:], columns=table[0])                all_tables.append(df)# Combine all tablesif all_tables:    combined_df = pd.concat(all_tables, ignore_index=True)    combined_df.to_excel("extracted_tables.xlsx", index=False)
```
```
from reportlab.lib.pagesizes import letterfrom reportlab.pdfgen import canvasc = canvas.Canvas("hello.pdf", pagesize=letter)width, height = letter# Add textc.drawString(100, height - 100, "Hello World!")c.drawString(100, height - 120, "This is a PDF created with reportlab")# Add a linec.line(100, height - 140, 400, height - 140)# Savec.save()
```
```
from reportlab.lib.pagesizes import letterfrom reportlab.pdfgen import canvasc = canvas.Canvas("hello.pdf", pagesize=letter)width, height = letter# Add textc.drawString(100, height - 100, "Hello World!")c.drawString(100, height - 120, "This is a PDF created with reportlab")# Add a linec.line(100, height - 140, 400, height - 140)# Savec.save()
```
```
from reportlab.lib.pagesizes import letterfrom reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreakfrom reportlab.lib.styles import getSampleStyleSheetdoc = SimpleDocTemplate("report.pdf", pagesize=letter)styles = getSampleStyleSheet()story = []# Add contenttitle = Paragraph("Report Title", styles['Title'])story.append(title)story.append(Spacer(1, 12))body = Paragraph("This is the body of the report. " * 20, styles['Normal'])story.append(body)story.append(PageBreak())# Page 2story.append(Paragraph("Page 2", styles['Heading1']))story.append(Paragraph("Content for page 2", styles['Normal']))# Build PDFdoc.build(story)
```
```
from reportlab.lib.pagesizes import letterfrom reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreakfrom reportlab.lib.styles import getSampleStyleSheetdoc = SimpleDocTemplate("report.pdf", pagesize=letter)styles = getSampleStyleSheet()story = []# Add contenttitle = Paragraph("Report Title", styles['Title'])story.append(title)story.append(Spacer(1, 12))body = Paragraph("This is the body of the report. " * 20, styles['Normal'])story.append(body)story.append(PageBreak())# Page 2story.append(Paragraph("Page 2", styles['Heading1']))story.append(Paragraph("Content for page 2", styles['Normal']))# Build PDFdoc.build(story)
```
```
# Extract textpdftotext input.pdf output.txt# Extract text preserving layoutpdftotext -layout input.pdf output.txt# Extract specific pagespdftotext -f 1 -l 5 input.pdf output.txt  # Pages 1-5
```
```
# Extract textpdftotext input.pdf output.txt# Extract text preserving layoutpdftotext -layout input.pdf output.txt# Extract specific pagespdftotext -f 1 -l 5 input.pdf output.txt  # Pages 1-5
```
```
# Merge PDFsqpdf --empty --pages file1.pdf file2.pdf -- merged.pdf# Split pagesqpdf input.pdf --pages . 1-5 -- pages1-5.pdfqpdf input.pdf --pages . 6-10 -- pages6-10.pdf# Rotate pagesqpdf input.pdf output.pdf --rotate=+90:1  # Rotate page 1 by 90 degrees# Remove passwordqpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```
```
# Merge PDFsqpdf --empty --pages file1.pdf file2.pdf -- merged.pdf# Split pagesqpdf input.pdf --pages . 1-5 -- pages1-5.pdfqpdf input.pdf --pages . 6-10 -- pages6-10.pdf# Rotate pagesqpdf input.pdf output.pdf --rotate=+90:1  # Rotate page 1 by 90 degrees# Remove passwordqpdf --password=mypassword --decrypt encrypted.pdf decrypted.pdf
```
```
# Mergepdftk file1.pdf file2.pdf cat output merged.pdf# Splitpdftk input.pdf burst# Rotatepdftk input.pdf rotate 1east output rotated.pdf
```
```
# Mergepdftk file1.pdf file2.pdf cat output merged.pdf# Splitpdftk input.pdf burst# Rotatepdftk input.pdf rotate 1east output rotated.pdf
```
```
# Requires: pip install pytesseract pdf2imageimport pytesseractfrom pdf2image import convert_from_path# Convert PDF to imagesimages = convert_from_path('scanned.pdf')# OCR each pagetext = ""for i, image in enumerate(images):    text += f"Page {i+1}:\n"    text += pytesseract.image_to_string(image)    text += "\n\n"print(text)
```
```
# Requires: pip install pytesseract pdf2imageimport pytesseractfrom pdf2image import convert_from_path# Convert PDF to imagesimages = convert_from_path('scanned.pdf')# OCR each pagetext = ""for i, image in enumerate(images):    text += f"Page {i+1}:\n"    text += pytesseract.image_to_string(image)    text += "\n\n"print(text)
```
```
from pypdf import PdfReader, PdfWriter# Create watermark (or load existing)watermark = PdfReader("watermark.pdf").pages[0]# Apply to all pagesreader = PdfReader("document.pdf")writer = PdfWriter()for page in reader.pages:    page.merge_page(watermark)    writer.add_page(page)with open("watermarked.pdf", "wb") as output:    writer.write(output)
```
```
from pypdf import PdfReader, PdfWriter# Create watermark (or load existing)watermark = PdfReader("watermark.pdf").pages[0]# Apply to all pagesreader = PdfReader("document.pdf")writer = PdfWriter()for page in reader.pages:    page.merge_page(watermark)    writer.add_page(page)with open("watermarked.pdf", "wb") as output:    writer.write(output)
```
```
# Using pdfimages (poppler-utils)pdfimages -j input.pdf output_prefix# This extracts all images as output_prefix-000.jpg, output_prefix-001.jpg, etc.
```
```
# Using pdfimages (poppler-utils)pdfimages -j input.pdf output_prefix# This extracts all images as output_prefix-000.jpg, output_prefix-001.jpg, etc.
```
```
from pypdf import PdfReader, PdfWriterreader = PdfReader("input.pdf")writer = PdfWriter()for page in reader.pages:    writer.add_page(page)# Add passwordwriter.encrypt("userpassword", "ownerpassword")with open("encrypted.pdf", "wb") as output:    writer.write(output)
```
```
from pypdf import PdfReader, PdfWriterreader = PdfReader("input.pdf")writer = PdfWriter()for page in reader.pages:    writer.add_page(page)# Add passwordwriter.encrypt("userpassword", "ownerpassword")with open("encrypted.pdf", "wb") as output:    writer.write(output)
```
```
writer.add_page(page)
```
```
page.extract_text()
```
```
page.extract_tables()
```
```
qpdf --empty --pages ...
```
Unlock the full potential of your AI coding assistant in handling PDF documents. This skill equips your agent with robust capabilities to programmatically interact with PDFs, from sophisticated data extraction and content generation to seamless document management. Whether you're automating report generation, processing invoices, or managing digital archives, this comprehensive toolkit ensures your agent can navigate the complexities of PDF files with precision and efficiency, transforming static documents into dynamic, actionable data. It's an indispensable asset for any AI requiring deep document understanding and manipulation.

# When to Use This Skill
- •Automate data extraction from large batches of invoices, reports, or legal documents.
- •Generate personalized PDF reports, certificates, or contracts by merging data with templates.
- •Programmatically fill out and submit PDF forms for applications or regulatory compliance.
- •Merge multiple individual PDF files into a single document or split large PDFs into smaller, manageable parts.

# Pro Tips
- 💡For challenging text or table extraction from scanned PDFs, combine this skill with an OCR (Optical Character Recognition) tool to first convert images to searchable text.
- 💡When dealing with sensitive information, always ensure proper handling of password-protected PDFs and consider encryption for newly generated documents.
- 💡Optimize performance for large-scale PDF operations by processing documents in chunks and implementing robust error handling for corrupted files.

