# obsidian-bases
Source: https://antigravity.codes/agent-skills/database/obsidian-bases

## AI Worker Instructions
When the user requests functionality related to obsidian-bases, follow these guidelines and utilize this context.

## Scraped Content

# obsidian-bases
```
.base
```
```
.base
```
```
# Global filters apply to ALL views in the basefilters:  # Can be a single filter string  # OR a recursive filter object with and/or/not  and: []  or: []  not: []# Define formula properties that can be used across all viewsformulas:  formula_name: 'expression'# Configure display names and settings for propertiesproperties:  property_name:    displayName: "Display Name"  formula.formula_name:    displayName: "Formula Display Name"  file.ext:    displayName: "Extension"# Define custom summary formulassummaries:  custom_summary_name: 'values.mean().round(3)'# Define one or more viewsviews:  - type: table | cards | list | map    name: "View Name"    limit: 10                    # Optional: limit results    groupBy:                     # Optional: group results      property: property_name      direction: ASC | DESC    filters:                     # View-specific filters      and: []    order:                       # Properties to display in order      - file.name      - property_name      - formula.formula_name    summaries:                   # Map properties to summary formulas      property_name: Average
```
```
# Global filters apply to ALL views in the basefilters:  # Can be a single filter string  # OR a recursive filter object with and/or/not  and: []  or: []  not: []# Define formula properties that can be used across all viewsformulas:  formula_name: 'expression'# Configure display names and settings for propertiesproperties:  property_name:    displayName: "Display Name"  formula.formula_name:    displayName: "Formula Display Name"  file.ext:    displayName: "Extension"# Define custom summary formulassummaries:  custom_summary_name: 'values.mean().round(3)'# Define one or more viewsviews:  - type: table | cards | list | map    name: "View Name"    limit: 10                    # Optional: limit results    groupBy:                     # Optional: group results      property: property_name      direction: ASC | DESC    filters:                     # View-specific filters      and: []    order:                       # Properties to display in order      - file.name      - property_name      - formula.formula_name    summaries:                   # Map properties to summary formulas      property_name: Average
```
```
# Single filterfilters: 'status == "done"'# AND - all conditions must be truefilters:  and:    - 'status == "done"'    - 'priority > 3'# OR - any condition can be truefilters:  or:    - 'file.hasTag("book")'    - 'file.hasTag("article")'# NOT - exclude matching itemsfilters:  not:    - 'file.hasTag("archived")'# Nested filtersfilters:  or:    - file.hasTag("tag")    - and:        - file.hasTag("book")        - file.hasLink("Textbook")    - not:        - file.hasTag("book")        - file.inFolder("Required Reading")
```
```
# Single filterfilters: 'status == "done"'# AND - all conditions must be truefilters:  and:    - 'status == "done"'    - 'priority > 3'# OR - any condition can be truefilters:  or:    - 'file.hasTag("book")'    - 'file.hasTag("article")'# NOT - exclude matching itemsfilters:  not:    - 'file.hasTag("archived")'# Nested filtersfilters:  or:    - file.hasTag("tag")    - and:        - file.hasTag("book")        - file.hasLink("Textbook")    - not:        - file.hasTag("book")        - file.inFolder("Required Reading")
```
```
==
```
```
!=
```
```
>
```
```
<
```
```
>=
```
```
<=
```
```
&&
```
```
\|\|
```
```
note.author
```
```
author
```
```
file.name
```
```
file.mtime
```
```
formula.my_formula
```
```
file.name
```
```
file.basename
```
```
file.path
```
```
file.folder
```
```
file.ext
```
```
file.size
```
```
file.ctime
```
```
file.mtime
```
```
file.tags
```
```
file.links
```
```
file.backlinks
```
```
file.embeds
```
```
file.properties
```
```
this
```
```
formulas
```
```
formulas:  # Simple arithmetic  total: "price * quantity"    # Conditional logic  status_icon: 'if(done, "✅", "⏳")'    # String formatting  formatted_price: 'if(price, price.toFixed(2) + " dollars")'    # Date formatting  created: 'file.ctime.format("YYYY-MM-DD")'    # Complex expressions  days_old: '((now() - file.ctime) / 86400000).round(0)'
```
```
formulas:  # Simple arithmetic  total: "price * quantity"    # Conditional logic  status_icon: 'if(done, "✅", "⏳")'    # String formatting  formatted_price: 'if(price, price.toFixed(2) + " dollars")'    # Date formatting  created: 'file.ctime.format("YYYY-MM-DD")'    # Complex expressions  days_old: '((now() - file.ctime) / 86400000).round(0)'
```
```
date()
```
```
date(string): date
```
```
YYYY-MM-DD HH:mm:ss
```
```
duration()
```
```
duration(string): duration
```
```
now()
```
```
now(): date
```
```
today()
```
```
today(): date
```
```
if()
```
```
if(condition, trueResult, falseResult?)
```
```
min()
```
```
min(n1, n2, ...): number
```
```
max()
```
```
max(n1, n2, ...): number
```
```
number()
```
```
number(any): number
```
```
link()
```
```
link(path, display?): Link
```
```
list()
```
```
list(element): List
```
```
file()
```
```
file(path): file
```
```
image()
```
```
image(path): image
```
```
icon()
```
```
icon(name): icon
```
```
html()
```
```
html(string): html
```
```
escapeHTML()
```
```
escapeHTML(string): string
```
```
isTruthy()
```
```
any.isTruthy(): boolean
```
```
isType()
```
```
any.isType(type): boolean
```
```
toString()
```
```
any.toString(): string
```
```
date.year
```
```
date.month
```
```
date.day
```
```
date.hour
```
```
date.minute
```
```
date.second
```
```
date.millisecond
```
```
date()
```
```
date.date(): date
```
```
format()
```
```
date.format(string): string
```
```
time()
```
```
date.time(): string
```
```
relative()
```
```
date.relative(): string
```
```
isEmpty()
```
```
date.isEmpty(): boolean
```
```
# Duration units: y/year/years, M/month/months, d/day/days, #                 w/week/weeks, h/hour/hours, m/minute/minutes, s/second/seconds# Add/subtract durations"date + \"1M\""           # Add 1 month"date - \"2h\""           # Subtract 2 hours"now() + \"1 day\""       # Tomorrow"today() + \"7d\""        # A week from today# Subtract dates for millisecond difference"now() - file.ctime"# Complex duration arithmetic"now() + (duration('1d') * 2)"
```
```
# Duration units: y/year/years, M/month/months, d/day/days, #                 w/week/weeks, h/hour/hours, m/minute/minutes, s/second/seconds# Add/subtract durations"date + \"1M\""           # Add 1 month"date - \"2h\""           # Subtract 2 hours"now() + \"1 day\""       # Tomorrow"today() + \"7d\""        # A week from today# Subtract dates for millisecond difference"now() - file.ctime"# Complex duration arithmetic"now() + (duration('1d') * 2)"
```
```
string.length
```
```
contains()
```
```
string.contains(value): boolean
```
```
containsAll()
```
```
string.containsAll(...values): boolean
```
```
containsAny()
```
```
string.containsAny(...values): boolean
```
```
startsWith()
```
```
string.startsWith(query): boolean
```
```
endsWith()
```
```
string.endsWith(query): boolean
```
```
isEmpty()
```
```
string.isEmpty(): boolean
```
```
lower()
```
```
string.lower(): string
```
```
title()
```
```
string.title(): string
```
```
trim()
```
```
string.trim(): string
```
```
replace()
```
```
string.replace(pattern, replacement): string
```
```
repeat()
```
```
string.repeat(count): string
```
```
reverse()
```
```
string.reverse(): string
```
```
slice()
```
```
string.slice(start, end?): string
```
```
split()
```
```
string.split(separator, n?): list
```
```
abs()
```
```
number.abs(): number
```
```
ceil()
```
```
number.ceil(): number
```
```
floor()
```
```
number.floor(): number
```
```
round()
```
```
number.round(digits?): number
```
```
toFixed()
```
```
number.toFixed(precision): string
```
```
isEmpty()
```
```
number.isEmpty(): boolean
```
```
list.length
```
```
contains()
```
```
list.contains(value): boolean
```
```
containsAll()
```
```
list.containsAll(...values): boolean
```
```
containsAny()
```
```
list.containsAny(...values): boolean
```
```
filter()
```
```
list.filter(expression): list
```
```
value
```
```
index
```
```
map()
```
```
list.map(expression): list
```
```
value
```
```
index
```
```
reduce()
```
```
list.reduce(expression, initial): any
```
```
value
```
```
index
```
```
acc
```
```
flat()
```
```
list.flat(): list
```
```
join()
```
```
list.join(separator): string
```
```
reverse()
```
```
list.reverse(): list
```
```
slice()
```
```
list.slice(start, end?): list
```
```
sort()
```
```
list.sort(): list
```
```
unique()
```
```
list.unique(): list
```
```
isEmpty()
```
```
list.isEmpty(): boolean
```
```
asLink()
```
```
file.asLink(display?): Link
```
```
hasLink()
```
```
file.hasLink(otherFile): boolean
```
```
hasTag()
```
```
file.hasTag(...tags): boolean
```
```
hasProperty()
```
```
file.hasProperty(name): boolean
```
```
inFolder()
```
```
file.inFolder(folder): boolean
```
```
asFile()
```
```
link.asFile(): file
```
```
linksTo()
```
```
link.linksTo(file): boolean
```
```
isEmpty()
```
```
object.isEmpty(): boolean
```
```
keys()
```
```
object.keys(): list
```
```
values()
```
```
object.values(): list
```
```
matches()
```
```
regexp.matches(string): boolean
```
```
views:  - type: table    name: "My Table"    order:      - file.name      - status      - due_date    summaries:      price: Sum      count: Average
```
```
views:  - type: table    name: "My Table"    order:      - file.name      - status      - due_date    summaries:      price: Sum      count: Average
```
```
views:  - type: cards    name: "Gallery"    order:      - file.name      - cover_image      - description
```
```
views:  - type: cards    name: "Gallery"    order:      - file.name      - cover_image      - description
```
```
views:  - type: list    name: "Simple List"    order:      - file.name      - status
```
```
views:  - type: list    name: "Simple List"    order:      - file.name      - status
```
```
views:  - type: map    name: "Locations"    # Map-specific settings for lat/lng properties
```
```
views:  - type: map    name: "Locations"    # Map-specific settings for lat/lng properties
```
```
Average
```
```
Min
```
```
Max
```
```
Sum
```
```
Range
```
```
Median
```
```
Stddev
```
```
Earliest
```
```
Latest
```
```
Range
```
```
Checked
```
```
Unchecked
```
```
Empty
```
```
Filled
```
```
Unique
```
```
filters:  and:    - file.hasTag("task")    - 'file.ext == "md"'formulas:  days_until_due: 'if(due, ((date(due) - today()) / 86400000).round(0), "")'  is_overdue: 'if(due, date(due) < today() && status != "done", false)'  priority_label: 'if(priority == 1, "🔴 High", if(priority == 2, "🟡 Medium", "🟢 Low"))'properties:  status:    displayName: Status  formula.days_until_due:    displayName: "Days Until Due"  formula.priority_label:    displayName: Priorityviews:  - type: table    name: "Active Tasks"    filters:      and:        - 'status != "done"'    order:      - file.name      - status      - formula.priority_label      - due      - formula.days_until_due    groupBy:      property: status      direction: ASC    summaries:      formula.days_until_due: Average  - type: table    name: "Completed"    filters:      and:        - 'status == "done"'    order:      - file.name      - completed_date
```
```
filters:  and:    - file.hasTag("task")    - 'file.ext == "md"'formulas:  days_until_due: 'if(due, ((date(due) - today()) / 86400000).round(0), "")'  is_overdue: 'if(due, date(due) < today() && status != "done", false)'  priority_label: 'if(priority == 1, "🔴 High", if(priority == 2, "🟡 Medium", "🟢 Low"))'properties:  status:    displayName: Status  formula.days_until_due:    displayName: "Days Until Due"  formula.priority_label:    displayName: Priorityviews:  - type: table    name: "Active Tasks"    filters:      and:        - 'status != "done"'    order:      - file.name      - status      - formula.priority_label      - due      - formula.days_until_due    groupBy:      property: status      direction: ASC    summaries:      formula.days_until_due: Average  - type: table    name: "Completed"    filters:      and:        - 'status == "done"'    order:      - file.name      - completed_date
```
```
filters:  or:    - file.hasTag("book")    - file.hasTag("article")formulas:  reading_time: 'if(pages, (pages * 2).toString() + " min", "")'  status_icon: 'if(status == "reading", "📖", if(status == "done", "✅", "📚"))'  year_read: 'if(finished_date, date(finished_date).year, "")'properties:  author:    displayName: Author  formula.status_icon:    displayName: ""  formula.reading_time:    displayName: "Est. Time"views:  - type: cards    name: "Library"    order:      - cover      - file.name      - author      - formula.status_icon    filters:      not:        - 'status == "dropped"'  - type: table    name: "Reading List"    filters:      and:        - 'status == "to-read"'    order:      - file.name      - author      - pages      - formula.reading_time
```
```
filters:  or:    - file.hasTag("book")    - file.hasTag("article")formulas:  reading_time: 'if(pages, (pages * 2).toString() + " min", "")'  status_icon: 'if(status == "reading", "📖", if(status == "done", "✅", "📚"))'  year_read: 'if(finished_date, date(finished_date).year, "")'properties:  author:    displayName: Author  formula.status_icon:    displayName: ""  formula.reading_time:    displayName: "Est. Time"views:  - type: cards    name: "Library"    order:      - cover      - file.name      - author      - formula.status_icon    filters:      not:        - 'status == "dropped"'  - type: table    name: "Reading List"    filters:      and:        - 'status == "to-read"'    order:      - file.name      - author      - pages      - formula.reading_time
```
```
filters:  and:    - file.inFolder("Projects")    - 'file.ext == "md"'formulas:  last_updated: 'file.mtime.relative()'  link_count: 'file.links.length'  summaries:  avgLinks: 'values.filter(value.isType("number")).mean().round(1)'properties:  formula.last_updated:    displayName: "Updated"  formula.link_count:    displayName: "Links"views:  - type: table    name: "All Projects"    order:      - file.name      - status      - formula.last_updated      - formula.link_count    summaries:      formula.link_count: avgLinks    groupBy:      property: status      direction: ASC  - type: list    name: "Quick List"    order:      - file.name      - status
```
```
filters:  and:    - file.inFolder("Projects")    - 'file.ext == "md"'formulas:  last_updated: 'file.mtime.relative()'  link_count: 'file.links.length'  summaries:  avgLinks: 'values.filter(value.isType("number")).mean().round(1)'properties:  formula.last_updated:    displayName: "Updated"  formula.link_count:    displayName: "Links"views:  - type: table    name: "All Projects"    order:      - file.name      - status      - formula.last_updated      - formula.link_count    summaries:      formula.link_count: avgLinks    groupBy:      property: status      direction: ASC  - type: list    name: "Quick List"    order:      - file.name      - status
```
```
filters:  and:    - file.inFolder("Daily Notes")    - '/^\d{4}-\d{2}-\d{2}$/.matches(file.basename)'formulas:  word_estimate: '(file.size / 5).round(0)'  day_of_week: 'date(file.basename).format("dddd")'properties:  formula.day_of_week:    displayName: "Day"  formula.word_estimate:    displayName: "~Words"views:  - type: table    name: "Recent Notes"    limit: 30    order:      - file.name      - formula.day_of_week      - formula.word_estimate      - file.mtime
```
```
filters:  and:    - file.inFolder("Daily Notes")    - '/^\d{4}-\d{2}-\d{2}$/.matches(file.basename)'formulas:  word_estimate: '(file.size / 5).round(0)'  day_of_week: 'date(file.basename).format("dddd")'properties:  formula.day_of_week:    displayName: "Day"  formula.word_estimate:    displayName: "~Words"views:  - type: table    name: "Recent Notes"    limit: 30    order:      - file.name      - formula.day_of_week      - formula.word_estimate      - file.mtime
```
```
![[MyBase.base]]<!-- Specific view -->![[MyBase.base#View Name]]
```
```
![[MyBase.base]]<!-- Specific view -->![[MyBase.base#View Name]]
```
```
'if(done, "Yes", "No")'
```
```
"My View Name"
```
```
filters:  and:    - file.hasTag("project")
```
```
filters:  and:    - file.hasTag("project")
```
```
filters:  and:    - file.inFolder("Notes")
```
```
filters:  and:    - file.inFolder("Notes")
```
```
filters:  and:    - 'file.mtime > now() - "7d"'
```
```
filters:  and:    - 'file.mtime > now() - "7d"'
```
```
filters:  and:    - 'status == "active"'    - 'priority >= 3'
```
```
filters:  and:    - 'status == "active"'    - 'priority >= 3'
```
```
filters:  or:    - and:        - file.hasTag("important")        - 'status != "done"'    - and:        - 'priority == 1'        - 'due != ""'
```
```
filters:  or:    - and:        - file.hasTag("important")        - 'status != "done"'    - and:        - 'priority == 1'        - 'due != ""'
```
This AI agent skill empowers your coding assistant to expertly manage and generate Obsidian Bases. Designed for users who leverage Obsidian for structured data and complex note organization, it allows for the programmatic creation and manipulation of .base files. Agents can define powerful views, global filters, custom formulas, and tailored summaries, transforming your vault into a dynamic information hub. Say goodbye to manual YAML editing; let your AI seamlessly build and maintain your data-driven Obsidian workflows, enhancing productivity and consistency across your knowledge base.

# When to Use This Skill
- •Automatically generate a new `.base` file with predefined table views and filters for a project tracking system in Obsidian.
- •Modify an existing Obsidian Base to add a new formula property that calculates progress or status across multiple notes.
- •Troubleshoot and correct syntax errors within a `.base` file, ensuring views, filters, and summaries function as intended.
- •Create a custom card view for a collection of research notes, including specific properties and a summary formula.

# Pro Tips
- 💡Always specify the `type` for each view (e.g., `table`, `card`) to ensure proper rendering and avoid common configuration errors.
- 💡Experiment with nested `and`/`or`/`not` structures within global filters to create highly precise data subsets for your Base views.
- 💡Integrate formula properties for dynamic calculations (e.g., progress tracking, due date reminders) directly into your views for powerful data insights.

