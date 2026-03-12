# baoyu-comic
Source: https://antigravity.codes/agent-skills/creative/baoyu-comic

## AI Worker Instructions
When the user requests functionality related to baoyu-comic, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-comic
```
/baoyu-comic posts/turing-story/source.md/baoyu-comic  # then paste content
```
```
/baoyu-comic posts/turing-story/source.md/baoyu-comic  # then paste content
```
```
--style
```
```
--layout
```
```
--aspect
```
```
--lang
```
```
scripts/
```
```
SKILL_DIR
```
```
${SKILL_DIR}/scripts/<script-name>.ts
```
```
${SKILL_DIR}
```
```
scripts/merge-to-pdf.ts
```
```
comic/{topic-slug}/├── source-{slug}.{ext}            # Source files (text, images, etc.)├── analysis.md                    # Deep analysis results (YAML+MD)├── storyboard-chronological.md    # Variant A (preserved)├── storyboard-thematic.md         # Variant B (preserved)├── storyboard-character.md        # Variant C (preserved)├── characters-chronological/      # Variant A chars (preserved)│   ├── characters.md│   └── characters.png├── characters-thematic/           # Variant B chars (preserved)│   ├── characters.md│   └── characters.png├── characters-character/          # Variant C chars (preserved)│   ├── characters.md│   └── characters.png├── storyboard.md                  # Final selected├── characters/                    # Final selected│   ├── characters.md│   └── characters.png├── prompts/│   ├── 00-cover-[slug].md│   └── NN-page-[slug].md├── 00-cover-[slug].png├── NN-page-[slug].png└── {topic-slug}.pdf
```
```
comic/{topic-slug}/├── source-{slug}.{ext}            # Source files (text, images, etc.)├── analysis.md                    # Deep analysis results (YAML+MD)├── storyboard-chronological.md    # Variant A (preserved)├── storyboard-thematic.md         # Variant B (preserved)├── storyboard-character.md        # Variant C (preserved)├── characters-chronological/      # Variant A chars (preserved)│   ├── characters.md│   └── characters.png├── characters-thematic/           # Variant B chars (preserved)│   ├── characters.md│   └── characters.png├── characters-character/          # Variant C chars (preserved)│   ├── characters.md│   └── characters.png├── storyboard.md                  # Final selected├── characters/                    # Final selected│   ├── characters.md│   └── characters.png├── prompts/│   ├── 00-cover-[slug].md│   └── NN-page-[slug].md├── 00-cover-[slug].png├── NN-page-[slug].png└── {topic-slug}.pdf
```
```
alan-turing-bio
```
```
comic/{topic-slug}/
```
```
{topic-slug}-YYYYMMDD-HHMMSS
```
```
turing-story
```
```
turing-story-20260118-143052
```
```
source-{slug}.{ext}
```
```
source-biography.md
```
```
source-portrait.jpg
```
```
source-timeline.png
```
```
analysis.md
```
```
source.md
```
```
references/analysis-framework.md
```
```
analysis.md
```
```
---title: "Alan Turing: Father of Computing"topic: Biographytime_span: 1912-1954source_language: enuser_language: zhaspect_ratio: "3:4"recommended_page_count: 12---## Target Audience- **Primary**: Tech enthusiasts curious about computing history- **Secondary**: Students learning about scientific breakthroughs- **Tertiary**: General readers interested in biographical stories## Value PropositionWhat readers will gain:1. Understanding of how modern computing was born2. Emotional connection to a brilliant but tragic figure3. Appreciation for the human cost of innovation## Core Themes| Theme | Narrative Potential | Visual Opportunity ||-------|--------------------|--------------------|| Genius vs. Society | High conflict, dramatic arcs | Contrast scenes || Code-breaking | Mystery, tension | Technical diagrams as art || Personal tragedy | Emotional depth | Intimate, somber panels |## Key Figures & Story Arcs### Alan Turing (Protagonist)- **Arc**: Misunderstood genius → War hero → Tragic end- **Visual identity**: Disheveled academic, intense eyes- **Key moments**: Enigma breakthrough, arrest, final days### Christopher Morcom (Catalyst)- **Role**: Early friend whose death shaped Turing- **Visual identity**: Youthful, bright- **Key moments**: School friendship, sudden death## Content Signals- "biography" → classic + mixed- "computing history" → ohmsha + dense- "personal tragedy" → dramatic + splash## Recommended Approaches1. **Chronological** - follow life timeline (recommended for biography)2. **Thematic** - organize by contributions (good for educational focus)3. **Character-focused** - relationships drive narrative (good for emotional impact)
```
```
---title: "Alan Turing: Father of Computing"topic: Biographytime_span: 1912-1954source_language: enuser_language: zhaspect_ratio: "3:4"recommended_page_count: 12---## Target Audience- **Primary**: Tech enthusiasts curious about computing history- **Secondary**: Students learning about scientific breakthroughs- **Tertiary**: General readers interested in biographical stories## Value PropositionWhat readers will gain:1. Understanding of how modern computing was born2. Emotional connection to a brilliant but tragic figure3. Appreciation for the human cost of innovation## Core Themes| Theme | Narrative Potential | Visual Opportunity ||-------|--------------------|--------------------|| Genius vs. Society | High conflict, dramatic arcs | Contrast scenes || Code-breaking | Mystery, tension | Technical diagrams as art || Personal tragedy | Emotional depth | Intimate, somber panels |## Key Figures & Story Arcs### Alan Turing (Protagonist)- **Arc**: Misunderstood genius → War hero → Tragic end- **Visual identity**: Disheveled academic, intense eyes- **Key moments**: Enigma breakthrough, arrest, final days### Christopher Morcom (Catalyst)- **Role**: Early friend whose death shaped Turing- **Visual identity**: Youthful, bright- **Key moments**: School friendship, sudden death## Content Signals- "biography" → classic + mixed- "computing history" → ohmsha + dense- "personal tragedy" → dramatic + splash## Recommended Approaches1. **Chronological** - follow life timeline (recommended for biography)2. **Thematic** - organize by contributions (good for educational focus)3. **Character-focused** - relationships drive narrative (good for emotional impact)
```
```
storyboard-{approach}.md
```
```
references/storyboard-template.md
```
```
characters-{approach}/
```
```
characters.md
```
```
characters.png
```
```
references/character-template.md
```
```
source_language ≠ user_language
```
```
Question 1 (Storyboard): Which storyboard variant?- A: Chronological + sepia (Recommended)- B: Thematic + ohmsha- C: Character-focused + warm- CustomQuestion 2 (Style): Which visual style?- sepia (Recommended from variant)- classic / dramatic / warm / sepia / vibrant / ohmsha / realistic / wuxia- Custom descriptionQuestion 3 (Language) - only if mismatch:- Chinese (source material language)- English (your preference)Question 4 (Aspect) - only if relevant:- 3:4 Portrait (Recommended)- 4:3 Landscape- 16:9 Widescreen
```
```
Question 1 (Storyboard): Which storyboard variant?- A: Chronological + sepia (Recommended)- B: Thematic + ohmsha- C: Character-focused + warm- CustomQuestion 2 (Style): Which visual style?- sepia (Recommended from variant)- classic / dramatic / warm / sepia / vibrant / ohmsha / realistic / wuxia- Custom descriptionQuestion 3 (Language) - only if mismatch:- Chinese (source material language)- English (your preference)Question 4 (Aspect) - only if relevant:- 3:4 Portrait (Recommended)- 4:3 Landscape- 16:9 Widescreen
```
```
storyboard.md
```
```
characters/
```
```
characters/characters.png
```
```
prompts/NN-{cover|page}-[slug].md
```
```
characters/characters.png
```
```
characters/characters.md
```
```
--sessionId
```
```
comic-{topic-slug}-{timestamp}
```
```
npx -y bun ${SKILL_DIR}/scripts/merge-to-pdf.ts <comic-dir>
```
```
npx -y bun ${SKILL_DIR}/scripts/merge-to-pdf.ts <comic-dir>
```
```
{topic-slug}.pdf
```
```
Comic Complete!Title: [title] | Style: [style] | Pages: [count] | Aspect: [ratio] | Language: [lang]Location: [path]✓ analysis.md✓ characters.png✓ 00-cover-[slug].png ... NN-page-[slug].png✓ {topic-slug}.pdf
```
```
Comic Complete!Title: [title] | Style: [style] | Pages: [count] | Aspect: [ratio] | Language: [lang]Location: [path]✓ analysis.md✓ characters.png✓ 00-cover-[slug].png ... NN-page-[slug].png✓ {topic-slug}.pdf
```
```
03-page-enigma-machine.png
```
```
prompts/03-page-enigma-machine.md
```
```
04-page-bletchley-park.md
```
```
04-page-tragedy.png
```
```
05-page-tragedy.png
```
```
storyboard.md
```
```
03-page-enigma-machine.png
```
```
04-page-tragedy.png
```
```
03-page-tragedy.png
```
```
storyboard.md
```
```
NN-cover-[slug].png / NN-page-[slug].pngNN-cover-[slug].md / NN-page-[slug].md (in prompts/)
```
```
NN-cover-[slug].png / NN-page-[slug].pngNN-cover-[slug].md / NN-page-[slug].md (in prompts/)
```
```
00-cover-turing-story.png
```
```
01-page-early-life.png
```
```
02-page-cambridge-years.png
```
```
03-page-enigma-machine.png
```
```
--style ohmsha
```
```
--characters "Student:小明,Mentor:教授"
```
```
references/ohmsha-guide.md
```
```
references/
```
```
analysis-framework.md
```
```
character-template.md
```
```
storyboard-template.md
```
```
ohmsha-guide.md
```
```
styles/
```
```
layouts/
```
```
.baoyu-skills/baoyu-comic/EXTEND.md
```
```
~/.baoyu-skills/baoyu-comic/EXTEND.md
```
Unleash your inner storyteller and educator with the Baoyu-Comic skill. This powerful AI agent is designed to transform complex information into visually captivating knowledge comics. Whether you're explaining a historical event, a scientific concept, or a software tutorial, Baoyu-Comic crafts original narratives with customizable styles and layouts. It intelligently interprets your content to produce engaging sequential art, making learning accessible and fun. Perfect for teachers, content creators, and anyone looking to present information in an innovative, comic-book format.

# When to Use This Skill
- •Explaining complex technical concepts (e.g., AI, programming) in an accessible comic format.
- •Creating engaging educational materials for students, like history biographies or science tutorials.
- •Visualizing step-by-step guides or how-to instructions with a clear, sequential flow.
- •Developing biographical comics about historical figures or personal journeys in a visual narrative style.

# Pro Tips
- 💡Experiment with 'custom description' for the `--style` option to achieve highly specific artistic visions not covered by presets.
- 💡Leverage the auto-selection table for initial guidance, but override `--layout` or `--style` for creative twists, e.g., using 'cinematic' for a 'how-to' to add drama.
- 💡For multi-page comics, prepare your content in a structured Markdown file (e.g., `posts/turing-story/source.md`) to maintain consistency and simplify generation.

