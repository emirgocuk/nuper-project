# testing-handbook-generator
Source: https://antigravity.codes/agent-skills/security/testing-handbook-generator

## AI Worker Instructions
When the user requests functionality related to testing-handbook-generator, follow these guidelines and utilize this context.

## Scraped Content

# testing-handbook-generator
```
./testing-handbook
```
```
../testing-handbook
```
```
~/testing-handbook
```
```
https://github.com/trailofbits/testing-handbook
```
```
Phase 0: Setup              Phase 1: Discovery┌─────────────────┐        ┌─────────────────┐│ Locate handbook │   →    │ Analyze handbook││ - Find or clone │        │ - Scan sections ││ - Confirm path  │        │ - Classify types│└─────────────────┘        └─────────────────┘         ↓                          ↓Phase 3: Generation        Phase 2: Planning┌─────────────────┐        ┌─────────────────┐│ TWO-PASS GEN    │   ←    │ Generate plan   ││ Pass 1: Content │        │ - New skills    ││ Pass 2: X-refs  │        │ - Updates       ││ - Write to gen/ │        │ - Present user  │└─────────────────┘        └─────────────────┘         ↓Phase 4: Testing           Phase 5: Finalize┌─────────────────┐        ┌─────────────────┐│ Validate skills │   →    │ Post-generation ││ - Run validator │        │ - Update README ││ - Test activation│       │ - Update X-refs ││ - Fix issues    │        │ - Self-improve  │└─────────────────┘        └─────────────────┘
```
```
Phase 0: Setup              Phase 1: Discovery┌─────────────────┐        ┌─────────────────┐│ Locate handbook │   →    │ Analyze handbook││ - Find or clone │        │ - Scan sections ││ - Confirm path  │        │ - Classify types│└─────────────────┘        └─────────────────┘         ↓                          ↓Phase 3: Generation        Phase 2: Planning┌─────────────────┐        ┌─────────────────┐│ TWO-PASS GEN    │   ←    │ Generate plan   ││ Pass 1: Content │        │ - New skills    ││ Pass 2: X-refs  │        │ - Updates       ││ - Write to gen/ │        │ - Present user  │└─────────────────┘        └─────────────────┘         ↓Phase 4: Testing           Phase 5: Finalize┌─────────────────┐        ┌─────────────────┐│ Validate skills │   →    │ Post-generation ││ - Run validator │        │ - Update README ││ - Test activation│       │ - Update X-refs ││ - Fix issues    │        │ - Self-improve  │└─────────────────┘        └─────────────────┘
```
```
plugins/testing-handbook-skills/skills/[skill-name]/*
```
```
plugins/testing-handbook-skills/skills/testing-handbook-generator/*
```
```
README.md
```
```
plugins/property-based-testing/
```
```
plugins/static-analysis/
```
```
testing-handbook-skills/
```
```
/static-analysis/[tool]/
```
```
/fuzzing/[lang]/[fuzzer]/
```
```
/fuzzing/techniques/
```
```
/crypto/[tool]/
```
```
/web/[tool]/
```
```
_index.md
```
```
bookCollapseSection: true
```
```
techniques/
```
```
99-resources.md
```
```
91-resources.md
```
```
draft: true
```
```
web/burp/
```
```
├─ Need to analyze handbook and build plan?│  └─ Read: discovery.md│     (Handbook analysis methodology, plan format)│├─ Spawning skill generation agents?│  └─ Read: agent-prompt.md│     (Full prompt template, variable reference, validation checklist)│├─ Generating a specific skill type?│  └─ Read appropriate template:│     ├─ Tool (Semgrep, CodeQL) → templates/tool-skill.md│     ├─ Fuzzer (libFuzzer, AFL++) → templates/fuzzer-skill.md│     ├─ Technique (harness, coverage) → templates/technique-skill.md│     └─ Domain (crypto, web) → templates/domain-skill.md│├─ Validating generated skills?│  └─ Run: scripts/validate-skills.py│     Then read: testing.md for activation testing│├─ Finalizing after generation?│  └─ See: Post-Generation Tasks below│     (Update main README, update Skills Cross-Reference, self-improvement)│└─ Quick generation from specific section?   └─ Use Quick Reference above, apply template directly
```
```
├─ Need to analyze handbook and build plan?│  └─ Read: discovery.md│     (Handbook analysis methodology, plan format)│├─ Spawning skill generation agents?│  └─ Read: agent-prompt.md│     (Full prompt template, variable reference, validation checklist)│├─ Generating a specific skill type?│  └─ Read appropriate template:│     ├─ Tool (Semgrep, CodeQL) → templates/tool-skill.md│     ├─ Fuzzer (libFuzzer, AFL++) → templates/fuzzer-skill.md│     ├─ Technique (harness, coverage) → templates/technique-skill.md│     └─ Domain (crypto, web) → templates/domain-skill.md│├─ Validating generated skills?│  └─ Run: scripts/validate-skills.py│     Then read: testing.md for activation testing│├─ Finalizing after generation?│  └─ See: Post-Generation Tasks below│     (Update main README, update Skills Cross-Reference, self-improvement)│└─ Quick generation from specific section?   └─ Use Quick Reference above, apply template directly
```
```
Pass 1 - Generating 5 skills in parallel:├─ Agent 1: libfuzzer (fuzzer) → skills/libfuzzer/SKILL.md├─ Agent 2: aflpp (fuzzer) → skills/aflpp/SKILL.md├─ Agent 3: semgrep (tool) → skills/semgrep/SKILL.md├─ Agent 4: harness-writing (technique) → skills/harness-writing/SKILL.md└─ Agent 5: wycheproof (domain) → skills/wycheproof/SKILL.mdEach agent uses: pass=1 (content only, Related Skills left empty)
```
```
Pass 1 - Generating 5 skills in parallel:├─ Agent 1: libfuzzer (fuzzer) → skills/libfuzzer/SKILL.md├─ Agent 2: aflpp (fuzzer) → skills/aflpp/SKILL.md├─ Agent 3: semgrep (tool) → skills/semgrep/SKILL.md├─ Agent 4: harness-writing (technique) → skills/harness-writing/SKILL.md└─ Agent 5: wycheproof (domain) → skills/wycheproof/SKILL.mdEach agent uses: pass=1 (content only, Related Skills left empty)
```
```
## Related Skills\n\n<!-- PASS2: populate after all skills exist -->
```
```
references: DEFERRED
```
```
Pass 2 - Populating cross-references:├─ Read all generated skill names from skills/*/SKILL.md├─ For each skill, determine related skills based on:│   ├─ related_sections from discovery (handbook structure)│   ├─ Skill type relationships (fuzzers → techniques)│   └─ Explicit mentions in content└─ Update each SKILL.md's Related Skills section
```
```
Pass 2 - Populating cross-references:├─ Read all generated skill names from skills/*/SKILL.md├─ For each skill, determine related skills based on:│   ├─ related_sections from discovery (handbook structure)│   ├─ Skill type relationships (fuzzers → techniques)│   └─ Explicit mentions in content└─ Update each SKILL.md's Related Skills section
```
```
ls -d skills/*/SKILL.md
```
```
pass
```
```
type
```
```
related_sections
```
```
# Regenerate single skill (Pass 1 - content only)"Use testing-handbook-generator to regenerate the {skill-name} skill from section {section_path}"# Example:"Use testing-handbook-generator to regenerate the libfuzzer skill from section fuzzing/c-cpp/10-libfuzzer"
```
```
# Regenerate single skill (Pass 1 - content only)"Use testing-handbook-generator to regenerate the {skill-name} skill from section {section_path}"# Example:"Use testing-handbook-generator to regenerate the libfuzzer skill from section fuzzing/c-cpp/10-libfuzzer"
```
```
skills/{skill-name}/SKILL.md
```
```
uv run scripts/validate-skills.py --skill {skill-name}
```
```
skills/[skill-name]/SKILL.md
```
```
skills/[skill-name]/SKILL.md
```
```
uv run scripts/validate-skills.py
```
```
README.md
```
```
README.md
```
```
README.md
```
```
testing-handbook-skills
```
```
testing-handbook-generator
```
```
| Plugin | Description | Author ||--------|-------------|--------|| ... other plugins ... || [testing-handbook-skills](plugins/testing-handbook-skills/) | Meta-skill that generates skills from the Testing Handbook | Paweł Płatek || [libfuzzer](plugins/testing-handbook-skills/skills/libfuzzer/) | Coverage-guided fuzzing with libFuzzer for C/C++ | testing-handbook-generator || [aflpp](plugins/testing-handbook-skills/skills/aflpp/) | Multi-core fuzzing with AFL++ | testing-handbook-generator || [semgrep](plugins/testing-handbook-skills/skills/semgrep/) | Fast static analysis for finding bugs | testing-handbook-generator |
```
```
| Plugin | Description | Author ||--------|-------------|--------|| ... other plugins ... || [testing-handbook-skills](plugins/testing-handbook-skills/) | Meta-skill that generates skills from the Testing Handbook | Paweł Płatek || [libfuzzer](plugins/testing-handbook-skills/skills/libfuzzer/) | Coverage-guided fuzzing with libFuzzer for C/C++ | testing-handbook-generator || [aflpp](plugins/testing-handbook-skills/skills/aflpp/) | Multi-core fuzzing with AFL++ | testing-handbook-generator || [semgrep](plugins/testing-handbook-skills/skills/semgrep/) | Fast static analysis for finding bugs | testing-handbook-generator |
```
```
README.md
```
```
SKILL.md
```
```
## Related Skills
```
```
-->
```
```
-.->
```
```
-->
```
```
libfuzzer --> harness-writing
```
```
-.->
```
```
semgrep -.-> codeql
```
```
-.->
```
```
libfuzzer -.-> aflpp
```
```
-->
```
```
harness-writing --> coverage-analysis
```
```
validate-skills.py
```
```
SKILL.md
```
```
templates/*.md
```
```
discovery.md
```
```
testing.md
```
```
Issue: libFuzzer skill missing sanitizer flags tableFix: Updated templates/fuzzer-skill.md to include ## Compiler Flags section
```
```
Issue: libFuzzer skill missing sanitizer flags tableFix: Updated templates/fuzzer-skill.md to include ## Compiler Flags section
```
```
User: "Generate skills from the testing handbook"1. Locate handbook (check common locations, ask user, or clone)2. Read discovery.md for methodology3. Scan handbook at {handbook_path}/content/docs/4. Build candidate list with types5. Present plan to user6. On approval, generate each skill using appropriate template7. Validate generated skills8. Update main README.md with generated skills table9. Update README.md Skills Cross-Reference graph from Related Skills sections10. Self-improve: note any template/discovery issues for future runs11. Report results
```
```
User: "Generate skills from the testing handbook"1. Locate handbook (check common locations, ask user, or clone)2. Read discovery.md for methodology3. Scan handbook at {handbook_path}/content/docs/4. Build candidate list with types5. Present plan to user6. On approval, generate each skill using appropriate template7. Validate generated skills8. Update main README.md with generated skills table9. Update README.md Skills Cross-Reference graph from Related Skills sections10. Self-improve: note any template/discovery issues for future runs11. Report results
```
```
User: "Create a skill for the libFuzzer section"1. Read /testing-handbook/content/docs/fuzzing/c-cpp/10-libfuzzer/2. Identify type: Fuzzer Skill3. Read templates/fuzzer-skill.md4. Extract content, apply template5. Write to skills/libfuzzer/SKILL.md6. Validate and report
```
```
User: "Create a skill for the libFuzzer section"1. Read /testing-handbook/content/docs/fuzzing/c-cpp/10-libfuzzer/2. Identify type: Fuzzer Skill3. Read templates/fuzzer-skill.md4. Extract content, apply template5. Write to skills/libfuzzer/SKILL.md6. Validate and report
```
This AI Agent skill is expertly designed to streamline the process of transforming comprehensive security testing knowledge into actionable agent capabilities. By leveraging the extensive Trail of Bits Testing Handbook, it ensures that all derived skills are consistently up-to-date and robust. Developers and security professionals can utilize this tool to rapidly deploy specialized agents capable of addressing various application security challenges, thereby significantly enhancing workflow efficiency and maintaining a high standard of security practice. This automation reduces the manual effort involved in skill creation and upkeep.

# When to Use This Skill
- •Generating new AI agent skills for specific security testing methodologies derived directly from the Trail of Bits Testing Handbook.
- •Automating the periodic refresh and update of existing security skills to reflect the latest content within the handbook.
- •Responding to explicit user queries about 'testing handbook' or 'appsec.guide' by offering to create relevant, targeted skills.
- •Onboarding new team members by providing pre-generated, context-specific security testing skills tailored to project needs.

# Pro Tips
- 💡Ensure the `trailofbits/testing-handbook` repository is locally accessible to the agent for optimal performance and accurate skill generation.
- 💡After generating new skills, remember to test them thoroughly to confirm they address specific security testing scenarios as intended.
- 💡Leverage this skill for bulk generation to quickly populate your agent with a comprehensive suite of specialized security testing capabilities from the handbook.
- 💡Keep the local handbook repository updated to ensure the generated skills incorporate the latest security testing methodologies.

