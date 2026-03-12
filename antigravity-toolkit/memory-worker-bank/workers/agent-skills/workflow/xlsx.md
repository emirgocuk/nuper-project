# xlsx
Source: https://antigravity.codes/agent-skills/workflow/xlsx

## AI Worker Instructions
When the user requests functionality related to xlsx, follow these guidelines and utilize this context.

## Scraped Content

# xlsx
```
recalc.py
```
```
import pandas as pd# Read Exceldf = pd.read_excel('file.xlsx')  # Default: first sheetall_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # All sheets as dict# Analyzedf.head()      # Preview datadf.info()      # Column infodf.describe()  # Statistics# Write Exceldf.to_excel('output.xlsx', index=False)
```
```
import pandas as pd# Read Exceldf = pd.read_excel('file.xlsx')  # Default: first sheetall_sheets = pd.read_excel('file.xlsx', sheet_name=None)  # All sheets as dict# Analyzedf.head()      # Preview datadf.info()      # Column infodf.describe()  # Statistics# Write Exceldf.to_excel('output.xlsx', index=False)
```
```
# Bad: Calculating in Python and hardcoding resulttotal = df['Sales'].sum()sheet['B10'] = total  # Hardcodes 5000# Bad: Computing growth rate in Pythongrowth = (df.iloc[-1]['Revenue'] - df.iloc[0]['Revenue']) / df.iloc[0]['Revenue']sheet['C5'] = growth  # Hardcodes 0.15# Bad: Python calculation for averageavg = sum(values) / len(values)sheet['D20'] = avg  # Hardcodes 42.5
```
```
# Bad: Calculating in Python and hardcoding resulttotal = df['Sales'].sum()sheet['B10'] = total  # Hardcodes 5000# Bad: Computing growth rate in Pythongrowth = (df.iloc[-1]['Revenue'] - df.iloc[0]['Revenue']) / df.iloc[0]['Revenue']sheet['C5'] = growth  # Hardcodes 0.15# Bad: Python calculation for averageavg = sum(values) / len(values)sheet['D20'] = avg  # Hardcodes 42.5
```
```
# Good: Let Excel calculate the sumsheet['B10'] = '=SUM(B2:B9)'# Good: Growth rate as Excel formulasheet['C5'] = '=(C4-C2)/C2'# Good: Average using Excel functionsheet['D20'] = '=AVERAGE(D2:D19)'
```
```
# Good: Let Excel calculate the sumsheet['B10'] = '=SUM(B2:B9)'# Good: Growth rate as Excel formulasheet['C5'] = '=(C4-C2)/C2'# Good: Average using Excel functionsheet['D20'] = '=AVERAGE(D2:D19)'
```
```
python recalc.py output.xlsx
```
```
python recalc.py output.xlsx
```
```
status
```
```
errors_found
```
```
error_summary
```
```
#REF!
```
```
#DIV/0!
```
```
#VALUE!
```
```
#NAME?
```
```
# Using openpyxl for formulas and formattingfrom openpyxl import Workbookfrom openpyxl.styles import Font, PatternFill, Alignmentwb = Workbook()sheet = wb.active# Add datasheet['A1'] = 'Hello'sheet['B1'] = 'World'sheet.append(['Row', 'of', 'data'])# Add formulasheet['B2'] = '=SUM(A1:A10)'# Formattingsheet['A1'].font = Font(bold=True, color='FF0000')sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')sheet['A1'].alignment = Alignment(horizontal='center')# Column widthsheet.column_dimensions['A'].width = 20wb.save('output.xlsx')
```
```
# Using openpyxl for formulas and formattingfrom openpyxl import Workbookfrom openpyxl.styles import Font, PatternFill, Alignmentwb = Workbook()sheet = wb.active# Add datasheet['A1'] = 'Hello'sheet['B1'] = 'World'sheet.append(['Row', 'of', 'data'])# Add formulasheet['B2'] = '=SUM(A1:A10)'# Formattingsheet['A1'].font = Font(bold=True, color='FF0000')sheet['A1'].fill = PatternFill('solid', start_color='FFFF00')sheet['A1'].alignment = Alignment(horizontal='center')# Column widthsheet.column_dimensions['A'].width = 20wb.save('output.xlsx')
```
```
# Using openpyxl to preserve formulas and formattingfrom openpyxl import load_workbook# Load existing filewb = load_workbook('existing.xlsx')sheet = wb.active  # or wb['SheetName'] for specific sheet# Working with multiple sheetsfor sheet_name in wb.sheetnames:    sheet = wb[sheet_name]    print(f"Sheet: {sheet_name}")# Modify cellssheet['A1'] = 'New Value'sheet.insert_rows(2)  # Insert row at position 2sheet.delete_cols(3)  # Delete column 3# Add new sheetnew_sheet = wb.create_sheet('NewSheet')new_sheet['A1'] = 'Data'wb.save('modified.xlsx')
```
```
# Using openpyxl to preserve formulas and formattingfrom openpyxl import load_workbook# Load existing filewb = load_workbook('existing.xlsx')sheet = wb.active  # or wb['SheetName'] for specific sheet# Working with multiple sheetsfor sheet_name in wb.sheetnames:    sheet = wb[sheet_name]    print(f"Sheet: {sheet_name}")# Modify cellssheet['A1'] = 'New Value'sheet.insert_rows(2)  # Insert row at position 2sheet.delete_cols(3)  # Delete column 3# Add new sheetnew_sheet = wb.create_sheet('NewSheet')new_sheet['A1'] = 'Data'wb.save('modified.xlsx')
```
```
recalc.py
```
```
python recalc.py <excel_file> [timeout_seconds]
```
```
python recalc.py <excel_file> [timeout_seconds]
```
```
python recalc.py output.xlsx 30
```
```
python recalc.py output.xlsx 30
```
```
pd.notna()
```
```
/
```
```
{  "status": "success",           // or "errors_found"  "total_errors": 0,              // Total error count  "total_formulas": 42,           // Number of formulas in file  "error_summary": {              // Only present if errors found    "#REF!": {      "count": 2,      "locations": ["Sheet1!B5", "Sheet1!C10"]    }  }}
```
```
{  "status": "success",           // or "errors_found"  "total_errors": 0,              // Total error count  "total_formulas": 42,           // Number of formulas in file  "error_summary": {              // Only present if errors found    "#REF!": {      "count": 2,      "locations": ["Sheet1!B5", "Sheet1!C10"]    }  }}
```
```
data_only=True
```
```
load_workbook('file.xlsx', data_only=True)
```
```
data_only=True
```
```
read_only=True
```
```
write_only=True
```
```
pd.read_excel('file.xlsx', dtype={'id': str})
```
```
pd.read_excel('file.xlsx', usecols=['A', 'C', 'E'])
```
```
pd.read_excel('file.xlsx', parse_dates=['date_column'])
```
This skill transforms your AI agent into a sophisticated spreadsheet expert, capable of more than just basic data entry. It enables deep interaction with Excel and other tabular data formats, allowing for complex analysis, dynamic formula management, and precise formatting. By adhering to industry-standard conventions and ensuring data integrity, this skill empowers your AI to generate professional-grade reports, financial models, and detailed data visualizations, significantly enhancing productivity for any data-intensive task.

# When to Use This Skill
- •Automating the creation of monthly financial reports with dynamic formulas and specific color-coding standards.
- •Analyzing large datasets from a CSV file, identifying trends, and generating visualizations within a new Excel workbook.
- •Updating an existing budget template by inserting new data rows while preserving all formulas and conditional formatting.
- •Recalculating and validating complex financial models to ensure zero formula errors before presentation.

# Pro Tips
- 💡Prioritize Template Preservation: Always instruct the AI to study and exactly match existing format, style, and conventions when modifying spreadsheets to maintain consistency.
- 💡Explicitly State Output Requirements: For financial models, clearly define desired color-coding (e.g., blue for inputs, black for formulas) and number formatting (e.g., "$#,##0" for currency, text for years).
- 💡Request Formula Error Checks: Emphasize the need for zero formula errors in any delivered Excel file to ensure data integrity and reliability.

