# office
Source: https://antigravity.codes/agent-skills/documents/office

## AI Worker Instructions
When the user requests functionality related to office, follow these guidelines and utilize this context.

## Scraped Content

# office
```
docx
```
```
xlsx
```
```
pdf-lib
```
```
pptxgenjs
```
```
https
```
```
# Install all four (or pick what you need)npm install docx xlsx pdf-lib pptxgenjs
```
```
# Install all four (or pick what you need)npm install docx xlsx pdf-lib pptxgenjs
```
```
import { Document, Packer, Paragraph, TextRun } from 'docx';import { writeFileSync } from 'fs';const doc = new Document({  sections: [{    children: [      new Paragraph({        children: [          new TextRun({ text: 'Hello World', bold: true, size: 48 }),        ],      }),    ],  }],});// Node.js: Save to fileconst buffer = await Packer.toBuffer(doc);writeFileSync('hello.docx', buffer);// Browser/Workers: Get as blobconst blob = await Packer.toBlob(doc);
```
```
import { Document, Packer, Paragraph, TextRun } from 'docx';import { writeFileSync } from 'fs';const doc = new Document({  sections: [{    children: [      new Paragraph({        children: [          new TextRun({ text: 'Hello World', bold: true, size: 48 }),        ],      }),    ],  }],});// Node.js: Save to fileconst buffer = await Packer.toBuffer(doc);writeFileSync('hello.docx', buffer);// Browser/Workers: Get as blobconst blob = await Packer.toBlob(doc);
```
```
import * as XLSX from 'xlsx';// Create workbook with dataconst data = [  ['Name', 'Amount', 'Date'],  ['Invoice #1', 1500, '2026-01-12'],  ['Invoice #2', 2300, '2026-01-13'],];const worksheet = XLSX.utils.aoa_to_sheet(data);const workbook = XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');// Node.js: Save to fileXLSX.writeFile(workbook, 'invoices.xlsx');// Browser/Workers: Get as bufferconst buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
```
```
import * as XLSX from 'xlsx';// Create workbook with dataconst data = [  ['Name', 'Amount', 'Date'],  ['Invoice #1', 1500, '2026-01-12'],  ['Invoice #2', 2300, '2026-01-13'],];const worksheet = XLSX.utils.aoa_to_sheet(data);const workbook = XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook, worksheet, 'Invoices');// Node.js: Save to fileXLSX.writeFile(workbook, 'invoices.xlsx');// Browser/Workers: Get as bufferconst buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
```
```
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';const pdfDoc = await PDFDocument.create();const page = pdfDoc.addPage([612, 792]); // Letter sizeconst font = await pdfDoc.embedFont(StandardFonts.Helvetica);page.drawText('Hello World', {  x: 50,  y: 700,  size: 24,  font,  color: rgb(0, 0, 0),});// Get as bytes (works everywhere)const pdfBytes = await pdfDoc.save();// Node.js: Save to filewriteFileSync('hello.pdf', pdfBytes);
```
```
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';const pdfDoc = await PDFDocument.create();const page = pdfDoc.addPage([612, 792]); // Letter sizeconst font = await pdfDoc.embedFont(StandardFonts.Helvetica);page.drawText('Hello World', {  x: 50,  y: 700,  size: 24,  font,  color: rgb(0, 0, 0),});// Get as bytes (works everywhere)const pdfBytes = await pdfDoc.save();// Node.js: Save to filewriteFileSync('hello.pdf', pdfBytes);
```
```
import pptxgen from 'pptxgenjs';const pptx = new pptxgen();pptx.author = 'Your Name';pptx.title = 'Sample Presentation';// Add a slideconst slide = pptx.addSlide();slide.addText('Hello World', {  x: 1, y: 1, w: 8, h: 1.5,  fontSize: 36, bold: true, color: '363636',});// Node.js: Save to fileawait pptx.writeFile({ fileName: 'hello.pptx' });// Browser: Trigger downloadawait pptx.writeFile({ fileName: 'hello.pptx' });
```
```
import pptxgen from 'pptxgenjs';const pptx = new pptxgen();pptx.author = 'Your Name';pptx.title = 'Sample Presentation';// Add a slideconst slide = pptx.addSlide();slide.addText('Hello World', {  x: 1, y: 1, w: 8, h: 1.5,  fontSize: 36, bold: true, color: '363636',});// Node.js: Save to fileawait pptx.writeFile({ fileName: 'hello.pptx' });// Browser: Trigger downloadawait pptx.writeFile({ fileName: 'hello.pptx' });
```
```
docx
```
```
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';const doc = new Document({  sections: [{    children: [      new Paragraph({        text: 'Monthly Report',        heading: HeadingLevel.HEADING_1,      }),      new Paragraph({        children: [          new TextRun('This is a '),          new TextRun({ text: 'bold', bold: true }),          new TextRun(' and '),          new TextRun({ text: 'italic', italics: true }),          new TextRun(' text example.'),        ],      }),    ],  }],});
```
```
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';const doc = new Document({  sections: [{    children: [      new Paragraph({        text: 'Monthly Report',        heading: HeadingLevel.HEADING_1,      }),      new Paragraph({        children: [          new TextRun('This is a '),          new TextRun({ text: 'bold', bold: true }),          new TextRun(' and '),          new TextRun({ text: 'italic', italics: true }),          new TextRun(' text example.'),        ],      }),    ],  }],});
```
```
import { Document, Table, TableRow, TableCell, Paragraph, WidthType } from 'docx';const table = new Table({  width: { size: 100, type: WidthType.PERCENTAGE },  rows: [    new TableRow({      children: [        new TableCell({ children: [new Paragraph('Header 1')] }),        new TableCell({ children: [new Paragraph('Header 2')] }),      ],    }),    new TableRow({      children: [        new TableCell({ children: [new Paragraph('Data 1')] }),        new TableCell({ children: [new Paragraph('Data 2')] }),      ],    }),  ],});const doc = new Document({  sections: [{ children: [table] }],});
```
```
import { Document, Table, TableRow, TableCell, Paragraph, WidthType } from 'docx';const table = new Table({  width: { size: 100, type: WidthType.PERCENTAGE },  rows: [    new TableRow({      children: [        new TableCell({ children: [new Paragraph('Header 1')] }),        new TableCell({ children: [new Paragraph('Header 2')] }),      ],    }),    new TableRow({      children: [        new TableCell({ children: [new Paragraph('Data 1')] }),        new TableCell({ children: [new Paragraph('Data 2')] }),      ],    }),  ],});const doc = new Document({  sections: [{ children: [table] }],});
```
```
import { Document, Paragraph, ImageRun } from 'docx';import { readFileSync } from 'fs';const imageBuffer = readFileSync('logo.png');const doc = new Document({  sections: [{    children: [      new Paragraph({        children: [          new ImageRun({            data: imageBuffer,            transformation: { width: 200, height: 100 },            type: 'png',          }),        ],      }),    ],  }],});
```
```
import { Document, Paragraph, ImageRun } from 'docx';import { readFileSync } from 'fs';const imageBuffer = readFileSync('logo.png');const doc = new Document({  sections: [{    children: [      new Paragraph({        children: [          new ImageRun({            data: imageBuffer,            transformation: { width: 200, height: 100 },            type: 'png',          }),        ],      }),    ],  }],});
```
```
// Node.js - Save to fileimport { writeFileSync } from 'fs';const buffer = await Packer.toBuffer(doc);writeFileSync('document.docx', buffer);// Browser - Downloadconst blob = await Packer.toBlob(doc);const url = URL.createObjectURL(blob);const a = document.createElement('a');a.href = url;a.download = 'document.docx';a.click();// Cloudflare Workers - Return as Responseconst buffer = await Packer.toBuffer(doc);return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',    'Content-Disposition': 'attachment; filename="document.docx"',  },});
```
```
// Node.js - Save to fileimport { writeFileSync } from 'fs';const buffer = await Packer.toBuffer(doc);writeFileSync('document.docx', buffer);// Browser - Downloadconst blob = await Packer.toBlob(doc);const url = URL.createObjectURL(blob);const a = document.createElement('a');a.href = url;a.download = 'document.docx';a.click();// Cloudflare Workers - Return as Responseconst buffer = await Packer.toBuffer(doc);return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',    'Content-Disposition': 'attachment; filename="document.docx"',  },});
```
```
import * as XLSX from 'xlsx';const data = [  ['Product', 'Price', 'Quantity', 'Total'],  ['Widget A', 10, 5, { f: 'B2*C2' }],  // Formula  ['Widget B', 15, 3, { f: 'B3*C3' }],  ['', '', 'Grand Total:', { f: 'SUM(D2:D3)' }],];const ws = XLSX.utils.aoa_to_sheet(data);const wb = XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb, ws, 'Sales');
```
```
import * as XLSX from 'xlsx';const data = [  ['Product', 'Price', 'Quantity', 'Total'],  ['Widget A', 10, 5, { f: 'B2*C2' }],  // Formula  ['Widget B', 15, 3, { f: 'B3*C3' }],  ['', '', 'Grand Total:', { f: 'SUM(D2:D3)' }],];const ws = XLSX.utils.aoa_to_sheet(data);const wb = XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb, ws, 'Sales');
```
```
const invoices = [  { id: 1, customer: 'Acme Corp', amount: 1500, date: '2026-01-12' },  { id: 2, customer: 'Globex', amount: 2300, date: '2026-01-13' },];const ws = XLSX.utils.json_to_sheet(invoices);const wb = XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
```
```
const invoices = [  { id: 1, customer: 'Acme Corp', amount: 1500, date: '2026-01-12' },  { id: 2, customer: 'Globex', amount: 2300, date: '2026-01-13' },];const ws = XLSX.utils.json_to_sheet(invoices);const wb = XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
```
```
// Set column widths (in characters)ws['!cols'] = [  { wch: 10 },  // Column A  { wch: 20 },  // Column B  { wch: 15 },  // Column C];
```
```
// Set column widths (in characters)ws['!cols'] = [  { wch: 10 },  // Column A  { wch: 20 },  // Column B  { wch: 15 },  // Column C];
```
```
const wb = XLSX.utils.book_new();const summaryData = [['Total Sales', 3800]];const detailData = [['Item', 'Amount'], ['Item 1', 1500], ['Item 2', 2300]];XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Summary');XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(detailData), 'Details');
```
```
const wb = XLSX.utils.book_new();const summaryData = [['Total Sales', 3800]];const detailData = [['Item', 'Amount'], ['Item 1', 1500], ['Item 2', 2300]];XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), 'Summary');XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(detailData), 'Details');
```
```
// Node.js - Save to fileXLSX.writeFile(workbook, 'report.xlsx');// Browser/Workers - Get bufferconst buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });// Cloudflare Workers - Return as Responsereturn new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    'Content-Disposition': 'attachment; filename="report.xlsx"',  },});
```
```
// Node.js - Save to fileXLSX.writeFile(workbook, 'report.xlsx');// Browser/Workers - Get bufferconst buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });// Cloudflare Workers - Return as Responsereturn new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    'Content-Disposition': 'attachment; filename="report.xlsx"',  },});
```
```
// Common sizes in points [width, height]const LETTER = [612, 792];    // 8.5" x 11"const A4 = [595.28, 841.89];  // 210mm x 297mmconst LEGAL = [612, 1008];    // 8.5" x 14"
```
```
// Common sizes in points [width, height]const LETTER = [612, 792];    // 8.5" x 11"const A4 = [595.28, 841.89];  // 210mm x 297mmconst LEGAL = [612, 1008];    // 8.5" x 14"
```
```
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';const pdfDoc = await PDFDocument.create();const page = pdfDoc.addPage([612, 792]);// Embed standard fontsconst helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);// Draw text (y=0 is BOTTOM of page)page.drawText('Invoice #12345', {  x: 50,  y: 750,  // Near top of page  size: 24,  font: helveticaBold,  color: rgb(0, 0, 0),});page.drawText('Thank you for your business!', {  x: 50,  y: 50,  // Near bottom of page  size: 12,  font: helvetica,  color: rgb(0.5, 0.5, 0.5),});
```
```
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';const pdfDoc = await PDFDocument.create();const page = pdfDoc.addPage([612, 792]);// Embed standard fontsconst helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);// Draw text (y=0 is BOTTOM of page)page.drawText('Invoice #12345', {  x: 50,  y: 750,  // Near top of page  size: 24,  font: helveticaBold,  color: rgb(0, 0, 0),});page.drawText('Thank you for your business!', {  x: 50,  y: 50,  // Near bottom of page  size: 12,  font: helvetica,  color: rgb(0.5, 0.5, 0.5),});
```
```
// Rectanglepage.drawRectangle({  x: 50,  y: 600,  width: 200,  height: 100,  borderColor: rgb(0, 0, 0),  borderWidth: 1,  color: rgb(0.95, 0.95, 0.95),  // Fill color});// Linepage.drawLine({  start: { x: 50, y: 500 },  end: { x: 550, y: 500 },  thickness: 1,  color: rgb(0, 0, 0),});
```
```
// Rectanglepage.drawRectangle({  x: 50,  y: 600,  width: 200,  height: 100,  borderColor: rgb(0, 0, 0),  borderWidth: 1,  color: rgb(0.95, 0.95, 0.95),  // Fill color});// Linepage.drawLine({  start: { x: 50, y: 500 },  end: { x: 550, y: 500 },  thickness: 1,  color: rgb(0, 0, 0),});
```
```
// From URL/fetchconst imageBytes = await fetch('https://example.com/logo.png').then(r => r.arrayBuffer());const image = await pdfDoc.embedPng(imageBytes);// Or embedJpg for JPEG// const image = await pdfDoc.embedJpg(imageBytes);page.drawImage(image, {  x: 50,  y: 700,  width: 100,  height: 50,});
```
```
// From URL/fetchconst imageBytes = await fetch('https://example.com/logo.png').then(r => r.arrayBuffer());const image = await pdfDoc.embedPng(imageBytes);// Or embedJpg for JPEG// const image = await pdfDoc.embedJpg(imageBytes);page.drawImage(image, {  x: 50,  y: 700,  width: 100,  height: 50,});
```
```
import { PDFDocument } from 'pdf-lib';// Load existing PDF with formconst existingPdfBytes = await fetch('form.pdf').then(r => r.arrayBuffer());const pdfDoc = await PDFDocument.load(existingPdfBytes);// Get form and fieldsconst form = pdfDoc.getForm();const nameField = form.getTextField('customer_name');const dateField = form.getTextField('date');// Fill fieldsnameField.setText('John Doe');dateField.setText('2026-01-12');// Flatten form (make fields non-editable)form.flatten();const pdfBytes = await pdfDoc.save();
```
```
import { PDFDocument } from 'pdf-lib';// Load existing PDF with formconst existingPdfBytes = await fetch('form.pdf').then(r => r.arrayBuffer());const pdfDoc = await PDFDocument.load(existingPdfBytes);// Get form and fieldsconst form = pdfDoc.getForm();const nameField = form.getTextField('customer_name');const dateField = form.getTextField('date');// Fill fieldsnameField.setText('John Doe');dateField.setText('2026-01-12');// Flatten form (make fields non-editable)form.flatten();const pdfBytes = await pdfDoc.save();
```
```
import { PDFDocument } from 'pdf-lib';const pdf1Bytes = await fetch('doc1.pdf').then(r => r.arrayBuffer());const pdf2Bytes = await fetch('doc2.pdf').then(r => r.arrayBuffer());const mergedPdf = await PDFDocument.create();const pdf1 = await PDFDocument.load(pdf1Bytes);const pdf2 = await PDFDocument.load(pdf2Bytes);// Copy all pages from both documentsconst pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());pages1.forEach(page => mergedPdf.addPage(page));pages2.forEach(page => mergedPdf.addPage(page));const mergedBytes = await mergedPdf.save();
```
```
import { PDFDocument } from 'pdf-lib';const pdf1Bytes = await fetch('doc1.pdf').then(r => r.arrayBuffer());const pdf2Bytes = await fetch('doc2.pdf').then(r => r.arrayBuffer());const mergedPdf = await PDFDocument.create();const pdf1 = await PDFDocument.load(pdf1Bytes);const pdf2 = await PDFDocument.load(pdf2Bytes);// Copy all pages from both documentsconst pages1 = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());const pages2 = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());pages1.forEach(page => mergedPdf.addPage(page));pages2.forEach(page => mergedPdf.addPage(page));const mergedBytes = await mergedPdf.save();
```
```
import pptxgen from 'pptxgenjs';const pptx = new pptxgen();pptx.author = 'Author Name';pptx.title = 'Presentation Title';pptx.subject = 'Subject';pptx.company = 'Company';// Title slideconst titleSlide = pptx.addSlide();titleSlide.addText('Quarterly Report', {  x: 0.5, y: 2, w: 9, h: 1,  fontSize: 44, bold: true, color: '0066CC', align: 'center',});titleSlide.addText('Q1 2026', {  x: 0.5, y: 3.5, w: 9, h: 0.5,  fontSize: 24, color: '666666', align: 'center',});
```
```
import pptxgen from 'pptxgenjs';const pptx = new pptxgen();pptx.author = 'Author Name';pptx.title = 'Presentation Title';pptx.subject = 'Subject';pptx.company = 'Company';// Title slideconst titleSlide = pptx.addSlide();titleSlide.addText('Quarterly Report', {  x: 0.5, y: 2, w: 9, h: 1,  fontSize: 44, bold: true, color: '0066CC', align: 'center',});titleSlide.addText('Q1 2026', {  x: 0.5, y: 3.5, w: 9, h: 0.5,  fontSize: 24, color: '666666', align: 'center',});
```
```
const contentSlide = pptx.addSlide();// TitlecontentSlide.addText('Key Highlights', {  x: 0.5, y: 0.5, w: 9, h: 0.8,  fontSize: 32, bold: true, color: '333333',});// Bullet pointscontentSlide.addText([  { text: 'Revenue up 25% YoY', options: { bullet: true, fontSize: 20 } },  { text: 'Customer base grew to 10,000', options: { bullet: true, fontSize: 20 } },  { text: 'New product launch successful', options: { bullet: true, fontSize: 20 } },  { text: 'Expanded to 5 new markets', options: { bullet: true, fontSize: 20 } },], { x: 0.5, y: 1.5, w: 8, h: 4, valign: 'top' });
```
```
const contentSlide = pptx.addSlide();// TitlecontentSlide.addText('Key Highlights', {  x: 0.5, y: 0.5, w: 9, h: 0.8,  fontSize: 32, bold: true, color: '333333',});// Bullet pointscontentSlide.addText([  { text: 'Revenue up 25% YoY', options: { bullet: true, fontSize: 20 } },  { text: 'Customer base grew to 10,000', options: { bullet: true, fontSize: 20 } },  { text: 'New product launch successful', options: { bullet: true, fontSize: 20 } },  { text: 'Expanded to 5 new markets', options: { bullet: true, fontSize: 20 } },], { x: 0.5, y: 1.5, w: 8, h: 4, valign: 'top' });
```
```
const tableSlide = pptx.addSlide();tableSlide.addText('Sales Summary', {  x: 0.5, y: 0.5, w: 9, h: 0.8,  fontSize: 28, bold: true,});const tableData = [  [{ text: 'Region', options: { bold: true, fill: '0066CC', color: 'FFFFFF' } },   { text: 'Q1', options: { bold: true, fill: '0066CC', color: 'FFFFFF' } },   { text: 'Q2', options: { bold: true, fill: '0066CC', color: 'FFFFFF' } }],  ['North America', '$2.5M', '$2.8M'],  ['Europe', '$1.8M', '$2.1M'],  ['Asia Pacific', '$1.2M', '$1.5M'],];tableSlide.addTable(tableData, {  x: 0.5, y: 1.5, w: 9,  border: { pt: 1, color: 'CCCCCC' },  fontFace: 'Arial',  fontSize: 14,  align: 'center',  valign: 'middle',});
```
```
const tableSlide = pptx.addSlide();tableSlide.addText('Sales Summary', {  x: 0.5, y: 0.5, w: 9, h: 0.8,  fontSize: 28, bold: true,});const tableData = [  [{ text: 'Region', options: { bold: true, fill: '0066CC', color: 'FFFFFF' } },   { text: 'Q1', options: { bold: true, fill: '0066CC', color: 'FFFFFF' } },   { text: 'Q2', options: { bold: true, fill: '0066CC', color: 'FFFFFF' } }],  ['North America', '$2.5M', '$2.8M'],  ['Europe', '$1.8M', '$2.1M'],  ['Asia Pacific', '$1.2M', '$1.5M'],];tableSlide.addTable(tableData, {  x: 0.5, y: 1.5, w: 9,  border: { pt: 1, color: 'CCCCCC' },  fontFace: 'Arial',  fontSize: 14,  align: 'center',  valign: 'middle',});
```
```
const chartSlide = pptx.addSlide();chartSlide.addText('Revenue Trend', {  x: 0.5, y: 0.5, w: 9, h: 0.6,  fontSize: 28, bold: true,});chartSlide.addChart(pptx.ChartType.line, [  { name: 'Revenue', labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [100, 120, 150, 180] },  { name: 'Expenses', labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [80, 85, 90, 95] },], {  x: 0.5, y: 1.2, w: 9, h: 4,  showLegend: true,  legendPos: 'b',  showTitle: false,});
```
```
const chartSlide = pptx.addSlide();chartSlide.addText('Revenue Trend', {  x: 0.5, y: 0.5, w: 9, h: 0.6,  fontSize: 28, bold: true,});chartSlide.addChart(pptx.ChartType.line, [  { name: 'Revenue', labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [100, 120, 150, 180] },  { name: 'Expenses', labels: ['Jan', 'Feb', 'Mar', 'Apr'], values: [80, 85, 90, 95] },], {  x: 0.5, y: 1.2, w: 9, h: 4,  showLegend: true,  legendPos: 'b',  showTitle: false,});
```
```
import { readFileSync } from 'fs';const imageSlide = pptx.addSlide();// From file (Node.js)imageSlide.addImage({  path: 'logo.png',  x: 0.5, y: 0.5, w: 2, h: 1,});// From base64const imageBase64 = readFileSync('chart.png').toString('base64');imageSlide.addImage({  data: image/png;base64,${imageBase64},  x: 0.5, y: 2, w: 4, h: 3,});// From URL (Node.js only - uses https module)imageSlide.addImage({  path: 'https://example.com/image.png',  x: 5, y: 2, w: 4, h: 3,});
```
```
import { readFileSync } from 'fs';const imageSlide = pptx.addSlide();// From file (Node.js)imageSlide.addImage({  path: 'logo.png',  x: 0.5, y: 0.5, w: 2, h: 1,});// From base64const imageBase64 = readFileSync('chart.png').toString('base64');imageSlide.addImage({  data: image/png;base64,${imageBase64},  x: 0.5, y: 2, w: 4, h: 3,});// From URL (Node.js only - uses https module)imageSlide.addImage({  path: 'https://example.com/image.png',  x: 5, y: 2, w: 4, h: 3,});
```
```
image/png;base64,${imageBase64}
```
```
const shapeSlide = pptx.addSlide();// RectangleshapeSlide.addShape(pptx.ShapeType.rect, {  x: 0.5, y: 0.5, w: 3, h: 2,  fill: { color: '0066CC' },  line: { color: '004499', pt: 2 },});// Circle/OvalshapeSlide.addShape(pptx.ShapeType.ellipse, {  x: 4, y: 0.5, w: 2, h: 2,  fill: { color: '00AA00' },});// ArrowshapeSlide.addShape(pptx.ShapeType.rightArrow, {  x: 1, y: 3, w: 3, h: 1,  fill: { color: 'FF6600' },});
```
```
const shapeSlide = pptx.addSlide();// RectangleshapeSlide.addShape(pptx.ShapeType.rect, {  x: 0.5, y: 0.5, w: 3, h: 2,  fill: { color: '0066CC' },  line: { color: '004499', pt: 2 },});// Circle/OvalshapeSlide.addShape(pptx.ShapeType.ellipse, {  x: 4, y: 0.5, w: 2, h: 2,  fill: { color: '00AA00' },});// ArrowshapeSlide.addShape(pptx.ShapeType.rightArrow, {  x: 1, y: 3, w: 3, h: 1,  fill: { color: 'FF6600' },});
```
```
// Define a master slidepptx.defineSlideMaster({  title: 'COMPANY_MASTER',  background: { color: 'FFFFFF' },  objects: [    { text: { text: 'Company Name', options: { x: 0.5, y: 0.2, w: 4, h: 0.3, fontSize: 10, color: '999999' } } },    { line: { x: 0.5, y: 0.6, w: 9, h: 0, line: { color: '0066CC', pt: 2 } } },  ],});// Use the masterconst slide = pptx.addSlide({ masterName: 'COMPANY_MASTER' });
```
```
// Define a master slidepptx.defineSlideMaster({  title: 'COMPANY_MASTER',  background: { color: 'FFFFFF' },  objects: [    { text: { text: 'Company Name', options: { x: 0.5, y: 0.2, w: 4, h: 0.3, fontSize: 10, color: '999999' } } },    { line: { x: 0.5, y: 0.6, w: 9, h: 0, line: { color: '0066CC', pt: 2 } } },  ],});// Use the masterconst slide = pptx.addSlide({ masterName: 'COMPANY_MASTER' });
```
```
// Node.js - Save to fileawait pptx.writeFile({ fileName: 'presentation.pptx' });// Browser - Trigger downloadawait pptx.writeFile({ fileName: 'presentation.pptx' });// Get as base64 (for email, API, etc.)const base64 = await pptx.write({ outputType: 'base64' });// Get as Blob (browser)const blob = await pptx.write({ outputType: 'blob' });// Get as ArrayBufferconst arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });// Cloudflare Workers - Return as Responseconst arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });return new Response(arrayBuffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',    'Content-Disposition': 'attachment; filename="presentation.pptx"',  },});
```
```
// Node.js - Save to fileawait pptx.writeFile({ fileName: 'presentation.pptx' });// Browser - Trigger downloadawait pptx.writeFile({ fileName: 'presentation.pptx' });// Get as base64 (for email, API, etc.)const base64 = await pptx.write({ outputType: 'base64' });// Get as Blob (browser)const blob = await pptx.write({ outputType: 'blob' });// Get as ArrayBufferconst arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });// Cloudflare Workers - Return as Responseconst arrayBuffer = await pptx.write({ outputType: 'arraybuffer' });return new Response(arrayBuffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',    'Content-Disposition': 'attachment; filename="presentation.pptx"',  },});
```
```
import { Hono } from 'hono';import { Document, Packer, Paragraph, TextRun } from 'docx';const app = new Hono();app.get('/api/invoice/:id', async (c) => {  const invoiceId = c.req.param('id');  const doc = new Document({    sections: [{      children: [        new Paragraph({          children: [new TextRun({ text: Invoice #${invoiceId}, bold: true, size: 48 })],        }),      ],    }],  });  const buffer = await Packer.toBuffer(doc);  return new Response(buffer, {    headers: {      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',      'Content-Disposition': attachment; filename="invoice-${invoiceId}.docx",    },  });});export default app;
```
```
import { Hono } from 'hono';import { Document, Packer, Paragraph, TextRun } from 'docx';const app = new Hono();app.get('/api/invoice/:id', async (c) => {  const invoiceId = c.req.param('id');  const doc = new Document({    sections: [{      children: [        new Paragraph({          children: [new TextRun({ text: Invoice #${invoiceId}, bold: true, size: 48 })],        }),      ],    }],  });  const buffer = await Packer.toBuffer(doc);  return new Response(buffer, {    headers: {      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',      'Content-Disposition': attachment; filename="invoice-${invoiceId}.docx",    },  });});export default app;
```
```
Invoice #${invoiceId}
```
```
attachment; filename="invoice-${invoiceId}.docx"
```
```
import puppeteer from '@cloudflare/puppeteer';export default {  async fetch(request, env) {    const browser = await puppeteer.launch(env.BROWSER);    const page = await browser.newPage();    // Set HTML content    await page.setContent(      <html>        <head>          <style>            body { font-family: Arial, sans-serif; padding: 40px; }            h1 { color: #333; }            table { width: 100%; border-collapse: collapse; }            td, th { border: 1px solid #ddd; padding: 8px; }          </style>        </head>        <body>          <h1>Invoice #12345</h1>          <table>            <tr><th>Item</th><th>Amount</th></tr>            <tr><td>Service</td><td>$500</td></tr>          </table>        </body>      </html>    );    const pdf = await page.pdf({ format: 'A4' });    await browser.close();    return new Response(pdf, {      headers: {        'Content-Type': 'application/pdf',        'Content-Disposition': 'attachment; filename="invoice.pdf"',      },    });  },};
```
```
import puppeteer from '@cloudflare/puppeteer';export default {  async fetch(request, env) {    const browser = await puppeteer.launch(env.BROWSER);    const page = await browser.newPage();    // Set HTML content    await page.setContent(      <html>        <head>          <style>            body { font-family: Arial, sans-serif; padding: 40px; }            h1 { color: #333; }            table { width: 100%; border-collapse: collapse; }            td, th { border: 1px solid #ddd; padding: 8px; }          </style>        </head>        <body>          <h1>Invoice #12345</h1>          <table>            <tr><th>Item</th><th>Amount</th></tr>            <tr><td>Service</td><td>$500</td></tr>          </table>        </body>      </html>    );    const pdf = await page.pdf({ format: 'A4' });    await browser.close();    return new Response(pdf, {      headers: {        'Content-Type': 'application/pdf',        'Content-Disposition': 'attachment; filename="invoice.pdf"',      },    });  },};
```
```
<html>        <head>          <style>            body { font-family: Arial, sans-serif; padding: 40px; }            h1 { color: #333; }            table { width: 100%; border-collapse: collapse; }            td, th { border: 1px solid #ddd; padding: 8px; }          </style>        </head>        <body>          <h1>Invoice #12345</h1>          <table>            <tr><th>Item</th><th>Amount</th></tr>            <tr><td>Service</td><td>$500</td></tr>          </table>        </body>      </html>
```
```
{  "browser": {    "binding": "BROWSER"  }}
```
```
{  "browser": {    "binding": "BROWSER"  }}
```
```
await Packer.toBuffer()
```
```
type: 'buffer'
```
```
await pptx.writeFile()
```
```
await pptx.write()
```
```
Packer.toBuffer()
```
```
writeFile
```
```
[object Promise]
```
```
Packer.toBuffer()
```
```
await Packer.toBuffer(doc)
```
```
https is not defined
```
```
https
```
```
docx-basic.ts
```
```
xlsx-basic.ts
```
```
pdf-basic.ts
```
```
pptx-basic.ts
```
```
workers-pdf.ts
```
```
docx-api.md
```
```
xlsx-api.md
```
```
pdf-lib-api.md
```
```
pptxgenjs-api.md
```
```
verify-deps.sh
```
```
{  "dependencies": {    "docx": "^9.5.0",    "xlsx": "^0.18.5",    "pdf-lib": "^1.17.1",    "pptxgenjs": "^4.0.1"  }}
```
```
{  "dependencies": {    "docx": "^9.5.0",    "xlsx": "^0.18.5",    "pdf-lib": "^1.17.1",    "pptxgenjs": "^4.0.1"  }}
```
```
npm install docx xlsx pdf-lib
```
```
const buffer = Packer.toBuffer(doc)
```
```
const buffer = await Packer.toBuffer(doc)
```
```
Packer.toBlob(doc)
```
```
await Packer.toBlob(doc)
```
```
Packer.toBuffer()
```
```
Packer.toBlob()
```
```
[object Promise]
```
```
// ❌ Missing image typenew ImageRun({ data: buffer, transformation: { width: 100, height: 50 } })// ✅ Specify image typenew ImageRun({ data: buffer, transformation: { width: 100, height: 50 }, type: 'png' })
```
```
// ❌ Missing image typenew ImageRun({ data: buffer, transformation: { width: 100, height: 50 } })// ✅ Specify image typenew ImageRun({ data: buffer, transformation: { width: 100, height: 50 }, type: 'png' })
```
```
writeFileSync()
```
```
new Response(buffer, { headers })
```
```
fs.writeFile()
```
```
Packer.toBlob()
```
```
XLSX.writeFile(wb, 'file.xlsx')
```
```
XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
```
```
XLSX.write(wb, { type: 'binary' })
```
```
XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
```
```
writeFile
```
```
fs
```
```
write
```
```
type: 'buffer'
```
```
// This is correct - formula calculates when opened in Excelconst data = [['A', 'B', 'Sum'], [1, 2, { f: 'A2+B2' }]];// Cell will show the formula result (3) when opened in Excel, not in raw output
```
```
// This is correct - formula calculates when opened in Excelconst data = [['A', 'B', 'Sum'], [1, 2, { f: 'A2+B2' }]];// Cell will show the formula result (3) when opened in Excel, not in raw output
```
```
// Set column widths (wch = width in characters)ws['!cols'] = [  { wch: 10 },  // Column A  { wch: 20 },  // Column B];
```
```
// Set column widths (wch = width in characters)ws['!cols'] = [  { wch: 10 },  // Column A  { wch: 20 },  // Column B];
```
```
y: 50
```
```
y: 750
```
```
y: pageHeight - 50
```
```
page.getHeight() - 50
```
```
// ❌ Using font without embeddingpage.drawText('Hello', { font: StandardFonts.Helvetica });// ✅ Embed font firstconst font = await pdfDoc.embedFont(StandardFonts.Helvetica);page.drawText('Hello', { font });
```
```
// ❌ Using font without embeddingpage.drawText('Hello', { font: StandardFonts.Helvetica });// ✅ Embed font firstconst font = await pdfDoc.embedFont(StandardFonts.Helvetica);page.drawText('Hello', { font });
```
```
// ❌ Using raw bytes directlypage.drawImage(imageBytes, { x: 50, y: 700 });// ✅ Embed image firstconst image = await pdfDoc.embedPng(imageBytes); // or embedJpgpage.drawImage(image, { x: 50, y: 700, width: 100, height: 50 });
```
```
// ❌ Using raw bytes directlypage.drawImage(imageBytes, { x: 50, y: 700 });// ✅ Embed image firstconst image = await pdfDoc.embedPng(imageBytes); // or embedJpgpage.drawImage(image, { x: 50, y: 700, width: 100, height: 50 });
```
```
color: '#0066CC'
```
```
color: '0066CC'
```
```
fill: { color: '#FF0000' }
```
```
fill: { color: 'FF0000' }
```
```
#
```
```
#
```
```
x: 100, y: 50
```
```
x: 1, y: 0.5
```
```
pptx.writeFile('file.pptx')
```
```
await pptx.writeFile({ fileName: 'file.pptx' })
```
```
pptx.write('base64')
```
```
await pptx.write({ outputType: 'base64' })
```
```
writeFile
```
```
write
```
```
await
```
```
[object Promise]
```
```
https
```
```
// ❌ Doesn't work in Workersslide.addImage({ path: 'https://example.com/image.png', x: 1, y: 1, w: 4, h: 3 });// ✅ Fetch first, then use base64const imageResponse = await fetch('https://example.com/image.png');const imageBuffer = await imageResponse.arrayBuffer();const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));slide.addImage({ data: image/png;base64,${base64}, x: 1, y: 1, w: 4, h: 3 });
```
```
// ❌ Doesn't work in Workersslide.addImage({ path: 'https://example.com/image.png', x: 1, y: 1, w: 4, h: 3 });// ✅ Fetch first, then use base64const imageResponse = await fetch('https://example.com/image.png');const imageBuffer = await imageResponse.arrayBuffer();const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBuffer)));slide.addImage({ data: image/png;base64,${base64}, x: 1, y: 1, w: 4, h: 3 });
```
```
image/png;base64,${base64}
```
```
pptxgen.ChartType.line
```
```
pptx.ChartType.line
```
```
import pptxgen from 'pptxgenjs';const pptx = new pptxgen();// Use pptx.ChartType, NOT pptxgen.ChartTypeslide.addChart(pptx.ChartType.line, data, options);
```
```
import pptxgen from 'pptxgenjs';const pptx = new pptxgen();// Use pptx.ChartType, NOT pptxgen.ChartTypeslide.addChart(pptx.ChartType.line, data, options);
```
```
// ❌ Trying to pass bullet option to addText stringslide.addText('Item 1', { bullet: true });  // Only one line// ✅ Use array of text objects for multiple bulletsslide.addText([  { text: 'Item 1', options: { bullet: true } },  { text: 'Item 2', options: { bullet: true } },], { x: 1, y: 1, w: 8, h: 3 });
```
```
// ❌ Trying to pass bullet option to addText stringslide.addText('Item 1', { bullet: true });  // Only one line// ✅ Use array of text objects for multiple bulletsslide.addText([  { text: 'Item 1', options: { bullet: true } },  { text: 'Item 2', options: { bullet: true } },], { x: 1, y: 1, w: 8, h: 3 });
```
```
return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',    'Content-Disposition': 'attachment; filename="document.docx"',  },});
```
```
return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',    'Content-Disposition': 'attachment; filename="document.docx"',  },});
```
```
return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    'Content-Disposition': 'attachment; filename="spreadsheet.xlsx"',  },});
```
```
return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    'Content-Disposition': 'attachment; filename="spreadsheet.xlsx"',  },});
```
```
return new Response(pdfBytes, {  headers: {    'Content-Type': 'application/pdf',    'Content-Disposition': 'attachment; filename="document.pdf"',  },});
```
```
return new Response(pdfBytes, {  headers: {    'Content-Type': 'application/pdf',    'Content-Disposition': 'attachment; filename="document.pdf"',  },});
```
```
return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',    'Content-Disposition': 'attachment; filename="presentation.pptx"',  },});
```
```
return new Response(buffer, {  headers: {    'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',    'Content-Disposition': 'attachment; filename="presentation.pptx"',  },});
```
```
**/*.ts
```
Unlock the power of automated document creation within your coding workflows. This specialized agent skill equips AI assistants with the capability to programmatically generate various Microsoft Office formats—DOCX, XLSX, PPTX—alongside PDFs. Built on robust, pure JavaScript libraries, it ensures seamless integration and execution across diverse environments, from browsers to Node.js. Whether you need to produce dynamic reports, custom invoices, or data-driven presentations, this skill streamlines complex document generation tasks, allowing developers to focus on core logic while the AI handles the intricacies of file formatting and content assembly.

# When to Use This Skill
- •Generating automated monthly or quarterly business reports in DOCX or PDF format.
- •Creating customized invoices or receipts as PDF or XLSX files based on transactional data.
- •Programmatically generating personalized marketing presentations (PPTX) for different client segments.
- •Exporting large datasets to formatted XLSX spreadsheets for further analysis or sharing.

# Pro Tips
- 💡For complex documents, consider using templating engines in conjunction with this skill to separate content from presentation logic, making maintenance easier.
- 💡Optimize performance for large XLSX files by using streaming writes if the chosen library supports it, to avoid high memory consumption.
- 💡Integrate with external data sources (databases, APIs) to dynamically populate documents, ensuring up-to-date and accurate information in generated files.

