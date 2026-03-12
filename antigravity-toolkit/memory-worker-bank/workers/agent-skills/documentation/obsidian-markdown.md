# obsidian-markdown
Source: https://antigravity.codes/agent-skills/documentation/obsidian-markdown

## AI Worker Instructions
When the user requests functionality related to obsidian-markdown, follow these guidelines and utilize this context.

## Scraped Content

# obsidian-markdown
```
This is a paragraph.This is another paragraph (blank line between creates separate paragraphs).For a line break within a paragraph, add two spaces at the end  or use Shift+Enter.
```
```
This is a paragraph.This is another paragraph (blank line between creates separate paragraphs).For a line break within a paragraph, add two spaces at the end  or use Shift+Enter.
```
```
# Heading 1## Heading 2### Heading 3#### Heading 4##### Heading 5###### Heading 6
```
```
# Heading 1## Heading 2### Heading 3#### Heading 4##### Heading 5###### Heading 6
```
```
**text**
```
```
__text__
```
```
**Bold**
```
```
*text*
```
```
_text_
```
```
*Italic*
```
```
***text***
```
```
***Both***
```
```
~~text~~
```
```
~~Striked~~
```
```
==text==
```
```
==Highlighted==
```
```

```
```

```
```
|
```
```

```
```

```
```
|
```
```
|### Escaping FormattingUse backslash to escape special characters:\*This won't be italic\*\#This won't be a heading1\. This won't be a list itemCommon characters to escape:
```
```
\*This won't be italic\*\#This won't be a heading1\. This won't be a list item
```
```
\*This won't be italic\*\#This won't be a heading1\. This won't be a list item
```
```
,
```
```
,
```
```
,
```
```
\
```
```
,
```
```
,
```
```
## Internal Links (Wikilinks)### Basic Links[[Note Name]][[Note Name.md]][[Note Name|Display Text]]### Link to Headings[[Note Name#Heading]][[Note Name#Heading|Custom Text]][[#Heading in same note]][[##Search all headings in vault]]### Link to Blocks[[Note Name#^block-id]][[Note Name#^block-id|Custom Text]]Define a block ID by adding
```
```
[[Note Name]][[Note Name.md]][[Note Name|Display Text]]
```
```
[[Note Name]][[Note Name.md]][[Note Name|Display Text]]
```
```
[[Note Name#Heading]][[Note Name#Heading|Custom Text]][[#Heading in same note]][[##Search all headings in vault]]
```
```
[[Note Name#Heading]][[Note Name#Heading|Custom Text]][[#Heading in same note]][[##Search all headings in vault]]
```
```
[[Note Name#^block-id]][[Note Name#^block-id|Custom Text]]
```
```
[[Note Name#^block-id]][[Note Name#^block-id|Custom Text]]
```
```
at the end of a paragraph:This is a paragraph that can be linked to. ^my-block-idFor lists and quotes, add the block ID on a separate line:> This is a quote> With multiple lines^quote-id### Search Links[[##heading]]     Search for headings containing "heading"[[^^block]]       Search for blocks containing "block"## Markdown-Style Links[Display Text](Note%20Name.md)[Display Text](Note%20Name.md#Heading)[Display Text](https://example.com)[Note](obsidian://open?vault=VaultName&file=Note.md)Note: Spaces must be URL-encoded as
```
```
This is a paragraph that can be linked to. ^my-block-id
```
```
This is a paragraph that can be linked to. ^my-block-id
```
```
> This is a quote> With multiple lines^quote-id
```
```
> This is a quote> With multiple lines^quote-id
```
```
[[##heading]]     Search for headings containing "heading"[[^^block]]       Search for blocks containing "block"
```
```
[[##heading]]     Search for headings containing "heading"[[^^block]]       Search for blocks containing "block"
```
```
[Display Text](Note%20Name.md)[Display Text](Note%20Name.md#Heading)[Display Text](https://example.com)[Note](obsidian://open?vault=VaultName&file=Note.md)
```
```
[Display Text](Note%20Name.md)[Display Text](Note%20Name.md#Heading)[Display Text](https://example.com)[Note](obsidian://open?vault=VaultName&file=Note.md)
```
```
in Markdown links.## Embeds### Embed Notes![[Note Name]]![[Note Name#Heading]]![[Note Name#^block-id]]### Embed Images![[image.png]]![[image.png|640x480]]    Width x Height![[image.png|300]]        Width only (maintains aspect ratio)### External Images![Alt text](https://example.com/image.png)![Alt text|300](https://example.com/image.png)### Embed Audio![[audio.mp3]]![[audio.ogg]]### Embed PDF![[document.pdf]]![[document.pdf#page=3]]![[document.pdf#height=400]]### Embed Lists![[Note#^list-id]]Where the list has been defined with a block ID:- Item 1- Item 2- Item 3^list-id### Embed Search Results
```
```
![[Note Name]]![[Note Name#Heading]]![[Note Name#^block-id]]
```
```
![[Note Name]]![[Note Name#Heading]]![[Note Name#^block-id]]
```
```
![[image.png]]![[image.png|640x480]]    Width x Height![[image.png|300]]        Width only (maintains aspect ratio)
```
```
![[image.png]]![[image.png|640x480]]    Width x Height![[image.png|300]]        Width only (maintains aspect ratio)
```
```
![Alt text](https://example.com/image.png)![Alt text|300](https://example.com/image.png)
```
```
![Alt text](https://example.com/image.png)![Alt text|300](https://example.com/image.png)
```
```
![[audio.mp3]]![[audio.ogg]]
```
```
![[audio.mp3]]![[audio.ogg]]
```
```
![[document.pdf]]![[document.pdf#page=3]]![[document.pdf#height=400]]
```
```
![[document.pdf]]![[document.pdf#page=3]]![[document.pdf#height=400]]
```
```
![[Note#^list-id]]
```
```
![[Note#^list-id]]
```
```
- Item 1- Item 2- Item 3^list-id
```
```
- Item 1- Item 2- Item 3^list-id
```
```

```
```

```
```

```
```

```
```
## Callouts### Basic Callout> [!note]> This is a note callout.> [!info] Custom Title> This callout has a custom title.> [!tip] Title Only### Foldable Callouts> [!faq]- Collapsed by default> This content is hidden until expanded.> [!faq]+ Expanded by default> This content is visible but can be collapsed.### Nested Callouts> [!question] Outer callout> > [!note] Inner callout> > Nested content### Supported Callout Types| Type | Aliases | Description ||------|---------|-------------||
```
```
> [!note]> This is a note callout.> [!info] Custom Title> This callout has a custom title.> [!tip] Title Only
```
```
> [!note]> This is a note callout.> [!info] Custom Title> This callout has a custom title.> [!tip] Title Only
```
```
> [!faq]- Collapsed by default> This content is hidden until expanded.> [!faq]+ Expanded by default> This content is visible but can be collapsed.
```
```
> [!faq]- Collapsed by default> This content is hidden until expanded.> [!faq]+ Expanded by default> This content is visible but can be collapsed.
```
```
> [!question] Outer callout> > [!note] Inner callout> > Nested content
```
```
> [!question] Outer callout> > [!note] Inner callout> > Nested content
```
```
| - | Blue, pencil icon ||
```
```
|
```
```
,
```
```
| Teal, clipboard icon ||
```
```
| - | Blue, info icon ||
```
```
| - | Blue, checkbox icon ||
```
```
|
```
```
,
```
```
| Cyan, flame icon ||
```
```
|
```
```
,
```
```
| Green, checkmark icon ||
```
```
|
```
```
,
```
```
| Yellow, question mark ||
```
```
|
```
```
,
```
```
| Orange, warning icon ||
```
```
|
```
```
,
```
```
| Red, X icon ||
```
```
|
```
```
| Red, zap icon ||
```
```
| - | Red, bug icon ||
```
```
| - | Purple, list icon ||
```
```
|
```
```
| Gray, quote icon |### Custom Callouts (CSS).callout[data-callout="custom-type"] {  --callout-color: 255, 0, 0;  --callout-icon: lucide-alert-circle;}## Lists### Unordered Lists- Item 1- Item 2  - Nested item  - Another nested- Item 3* Also works with asterisks+ Or plus signs### Ordered Lists1. First item2. Second item   1. Nested numbered   2. Another nested3. Third item1) Alternative syntax2) With parentheses### Task Lists- [ ] Incomplete task- [x] Completed task- [ ] Task with sub-tasks  - [ ] Subtask 1  - [x] Subtask 2## Quotes> This is a blockquote.> It can span multiple lines.>> And include multiple paragraphs.>> > Nested quotes work too.## Code### Inline CodeUse backticks for inline code.Use double backticks for code with a  backtick inside`.### Code Blocks
```
```
.callout[data-callout="custom-type"] {  --callout-color: 255, 0, 0;  --callout-icon: lucide-alert-circle;}
```
```
.callout[data-callout="custom-type"] {  --callout-color: 255, 0, 0;  --callout-icon: lucide-alert-circle;}
```
```
- Item 1- Item 2  - Nested item  - Another nested- Item 3* Also works with asterisks+ Or plus signs
```
```
- Item 1- Item 2  - Nested item  - Another nested- Item 3* Also works with asterisks+ Or plus signs
```
```
1. First item2. Second item   1. Nested numbered   2. Another nested3. Third item1) Alternative syntax2) With parentheses
```
```
1. First item2. Second item   1. Nested numbered   2. Another nested3. Third item1) Alternative syntax2) With parentheses
```
```
```
```
```
```
> This is a blockquote.> It can span multiple lines.>> And include multiple paragraphs.>> > Nested quotes work too.
```
```
> This is a blockquote.> It can span multiple lines.>> And include multiple paragraphs.>> > Nested quotes work too.
```
```
Use backticks for inline code.Use double backticks for code with a  backtick inside`.
```
```
Use
```
```
for inline code.Use double backticks for
```
```
code with a
```
```
.
```
```

```
```

```
```

```
```

```
```

```
```

```
```

```
```

```
```
### Nesting Code BlocksUse more backticks or tildes for the outer block:
```
```

```
```

```
```

```
```
console.log("Hello")
```
```
console.log("Hello")
```
```

```
```

```
```

```
```
## Tables| Header 1 | Header 2 | Header 3 ||----------|----------|----------|| Cell 1   | Cell 2   | Cell 3   || Cell 4   | Cell 5   | Cell 6   |### Alignment| Left     | Center   | Right    ||:---------|:--------:|---------:|| Left     | Center   | Right    |### Using Pipes in TablesEscape pipes with backslash:| Column 1 | Column 2 ||----------|----------|| [[Link\|Display]] | ![[Image\|100]] |## Math (LaTeX)### Inline MathThis is inline math: $e^{i\pi} + 1 = 0$### Block Math$$\begin{vmatrix}a & b \\c & d\end{vmatrix} = ad - bc$$### Common Math Syntax$x^2$              Superscript$x_i$              Subscript$\frac{a}{b}$      Fraction$\sqrt{x}$         Square root$\sum_{i=1}^{n}$   Summation$\int_a^b$         Integral$\alpha, \beta$    Greek letters## Diagrams (Mermaid)
```
```
| Header 1 | Header 2 | Header 3 ||----------|----------|----------|| Cell 1   | Cell 2   | Cell 3   || Cell 4   | Cell 5   | Cell 6   |
```
```
| Header 1 | Header 2 | Header 3 ||----------|----------|----------|| Cell 1   | Cell 2   | Cell 3   || Cell 4   | Cell 5   | Cell 6   |
```
```
| Left     | Center   | Right    ||:---------|:--------:|---------:|| Left     | Center   | Right    |
```
```
| Left     | Center   | Right    ||:---------|:--------:|---------:|| Left     | Center   | Right    |
```
```
| Column 1 | Column 2 ||----------|----------|| [[Link\|Display]] | ![[Image\|100]] |
```
```
| Column 1 | Column 2 ||----------|----------|| [[Link\|Display]] | ![[Image\|100]] |
```
```
This is inline math: $e^{i\pi} + 1 = 0$
```
```
This is inline math: $e^{i\pi} + 1 = 0$
```
```
$$\begin{vmatrix}a & b \\c & d\end{vmatrix} = ad - bc$$
```
```
$$\begin{vmatrix}a & b \\c & d\end{vmatrix} = ad - bc$$
```
```
$x^2$              Superscript$x_i$              Subscript$\frac{a}{b}$      Fraction$\sqrt{x}$         Square root$\sum_{i=1}^{n}$   Summation$\int_a^b$         Integral$\alpha, \beta$    Greek letters
```
```
$x^2$              Superscript$x_i$              Subscript$\frac{a}{b}$      Fraction$\sqrt{x}$         Square root$\sum_{i=1}^{n}$   Summation$\int_a^b$         Integral$\alpha, \beta$    Greek letters
```
```

```
```

```
```

```
```

```
```
### Sequence Diagrams
```
```

```
```

```
```

```
```

```
```
### Linking in Diagrams
```
```

```
```

```
```

```
```

```
```
## FootnotesThis sentence has a footnote[^1].[^1]: This is the footnote content.You can also use named footnotes[^note].[^note]: Named footnotes still appear as numbers.Inline footnotes are also supported.^[This is an inline footnote.]## CommentsThis is visible %%but this is hidden%% text.%%This entire block is hidden.It won't appear in reading view.%%## Horizontal Rules---***___- - -* * *## Properties (Frontmatter)Properties use YAML frontmatter at the start of a note:---title: My Note Titledate: 2024-01-15tags:  - project  - importantaliases:  - My Note  - Alternative Namecssclasses:  - custom-classstatus: in-progressrating: 4.5completed: falsedue: 2024-02-01T14:30:00---### Property Types| Type | Example ||------|---------|| Text |
```
```
This sentence has a footnote[^1].[^1]: This is the footnote content.You can also use named footnotes[^note].[^note]: Named footnotes still appear as numbers.Inline footnotes are also supported.^[This is an inline footnote.]
```
```
This sentence has a footnote[^1].[^1]: This is the footnote content.You can also use named footnotes[^note].[^note]: Named footnotes still appear as numbers.Inline footnotes are also supported.^[This is an inline footnote.]
```
```
This is visible %%but this is hidden%% text.%%This entire block is hidden.It won't appear in reading view.%%
```
```
This is visible %%but this is hidden%% text.%%This entire block is hidden.It won't appear in reading view.%%
```
```
---***___- - -* * *
```
```
---***___- - -* * *
```
```
---title: My Note Titledate: 2024-01-15tags:  - project  - importantaliases:  - My Note  - Alternative Namecssclasses:  - custom-classstatus: in-progressrating: 4.5completed: falsedue: 2024-02-01T14:30:00---
```
```
---title: My Note Titledate: 2024-01-15tags:  - project  - importantaliases:  - My Note  - Alternative Namecssclasses:  - custom-classstatus: in-progressrating: 4.5completed: falsedue: 2024-02-01T14:30:00---
```
```
|| Number |
```
```
|| Checkbox |
```
```
|| Date |
```
```
|| Date & Time |
```
```
|| List |
```
```
or YAML list || Links |
```
```
|### Default Properties-
```
```
- Note tags-
```
```
- Alternative names for the note-
```
```
- CSS classes applied to the note## Tags#tag#nested/tag#tag-with-dashes#tag_with_underscoresIn frontmatter:---tags:  - tag1  - nested/tag2---Tags can contain:- Letters (any language)- Numbers (not as first character)- Underscores
```
```
#tag#nested/tag#tag-with-dashes#tag_with_underscoresIn frontmatter:---tags:  - tag1  - nested/tag2---
```
```
#tag#nested/tag#tag-with-dashes#tag_with_underscoresIn frontmatter:---tags:  - tag1  - nested/tag2---
```
```
- Hyphens
```
```
- Forward slashes
```
```
(for nesting)## HTML ContentObsidian supports HTML within Markdown:<div class="custom-container">  <span style="color: red;">Colored text</span></div><details>  <summary>Click to expand</summary>  Hidden content here.</details><kbd>Ctrl</kbd> + <kbd>C</kbd>## Complete Example
```
```
<div class="custom-container">  <span style="color: red;">Colored text</span></div><details>  <summary>Click to expand</summary>  Hidden content here.</details><kbd>Ctrl</kbd> + <kbd>C</kbd>
```
```
<div class="custom-container">  <span style="color: red;">Colored text</span></div><details>  <summary>Click to expand</summary>  Hidden content here.</details><kbd>Ctrl</kbd> + <kbd>C</kbd>
```
```
---title: Project Alphadate: 2024-01-15tags:  - project  - activestatus: in-progresspriority: high---# Project Alpha## OverviewThis project aims to [[improve workflow]] using modern techniques.> [!important] Key Deadline> The first milestone is due on ==January 30th==.## Tasks- [x] Initial planning- [x] Resource allocation- [ ] Development phase  - [ ] Backend implementation  - [ ] Frontend design- [ ] Testing- [ ] Deployment## Technical NotesThe main algorithm uses the formula $O(n \log n)$ for sorting.
```
```
---title: Project Alphadate: 2024-01-15tags:  - project  - activestatus: in-progresspriority: high---# Project Alpha## OverviewThis project aims to [[improve workflow]] using modern techniques.> [!important] Key Deadline> The first milestone is due on ==January 30th==.## Tasks- [x] Initial planning- [x] Resource allocation- [ ] Development phase  - [ ] Backend implementation  - [ ] Frontend design- [ ] Testing- [ ] Deployment## Technical NotesThe main algorithm uses the formula $O(n \log n)$ for sorting.
```
```
## Architecture
```
```
## Architecture
```
```
## Related Documents- ![[Meeting Notes 2024-01-10#Decisions]]- [[Budget Allocation|Budget]]- [[Team Members]]## ReferencesFor more details, see the official documentation[^1].[^1]: https://example.com/docs%%Internal notes:- Review with team on Friday- Consider alternative approaches%%
```
```
## Related Documents- ![[Meeting Notes 2024-01-10#Decisions]]- [[Budget Allocation|Budget]]- [[Team Members]]## ReferencesFor more details, see the official documentation[^1].[^1]: https://example.com/docs%%Internal notes:- Review with team on Friday- Consider alternative approaches%%
```
The Obsidian Markdown Agent Skill is an essential tool for anyone working within the Obsidian ecosystem. It extends your AI assistant's capabilities to flawlessly understand and generate content using Obsidian-specific syntax, including unique features like wikilinks, callouts, and frontmatter. This ensures that your AI-generated text seamlessly integrates into your existing knowledge base, maintaining consistency and leveraging the full power of Obsidian's interconnected notes. From drafting new documents to refining complex interlinked ideas, this skill makes your AI an expert in crafting high-quality Obsidian-flavored content.

# When to Use This Skill
- •Drafting new notes, articles, or documentation directly in Obsidian Flavored Markdown, complete with internal links and embeds.
- •Refactoring existing Obsidian notes to standardize callouts, properties, or tag usage.
- •Generating summaries or outlines of content, ensuring all Obsidian-specific elements are correctly preserved.
- •Converting plain text or generic Markdown into Obsidian's rich syntax, adding wikilinks or properties where appropriate.

# Pro Tips
- 💡When requesting content, explicitly mention Obsidian-specific features you want to use (e.g., "Use a `[!note]` callout for this section," or "Link to `[[Another Note]]`").
- 💡Utilize the skill for property management by asking the AI to add or update frontmatter properties in your `.md` files.
- 💡Combine with a file reading skill to analyze existing Obsidian vault structure and suggest new links or content improvements based on relationships.

