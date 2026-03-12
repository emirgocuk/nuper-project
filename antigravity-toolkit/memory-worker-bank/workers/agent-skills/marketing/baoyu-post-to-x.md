# baoyu-post-to-x
Source: https://antigravity.codes/agent-skills/marketing/baoyu-post-to-x

## AI Worker Instructions
When the user requests functionality related to baoyu-post-to-x, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-post-to-x
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
scripts/x-browser.ts
```
```
scripts/x-video.ts
```
```
scripts/x-quote.ts
```
```
scripts/x-article.ts
```
```
scripts/md-to-html.ts
```
```
scripts/copy-to-clipboard.ts
```
```
scripts/paste-from-clipboard.ts
```
```
bun
```
```
references/regular-posts.md
```
```
references/articles.md
```
```
# Preview mode (doesn't post)npx -y bun ${SKILL_DIR}/scripts/x-browser.ts "Hello from Claude!" --image ./screenshot.png# Actually postnpx -y bun ${SKILL_DIR}/scripts/x-browser.ts "Hello!" --image ./photo.png --submit
```
```
# Preview mode (doesn't post)npx -y bun ${SKILL_DIR}/scripts/x-browser.ts "Hello from Claude!" --image ./screenshot.png# Actually postnpx -y bun ${SKILL_DIR}/scripts/x-browser.ts "Hello!" --image ./photo.png --submit
```
```
${SKILL_DIR}
```
```
<text>
```
```
--image <path>
```
```
--submit
```
```
--profile <dir>
```
```
# Preview mode (doesn't post)npx -y bun ${SKILL_DIR}/scripts/x-video.ts "Check out this video!" --video ./clip.mp4# Actually postnpx -y bun ${SKILL_DIR}/scripts/x-video.ts "Amazing content" --video ./demo.mp4 --submit
```
```
# Preview mode (doesn't post)npx -y bun ${SKILL_DIR}/scripts/x-video.ts "Check out this video!" --video ./clip.mp4# Actually postnpx -y bun ${SKILL_DIR}/scripts/x-video.ts "Amazing content" --video ./demo.mp4 --submit
```
```
<text>
```
```
--video <path>
```
```
--submit
```
```
--profile <dir>
```
```
# Preview mode (doesn't post)npx -y bun ${SKILL_DIR}/scripts/x-quote.ts https://x.com/user/status/123456789 "Great insight!"# Actually postnpx -y bun ${SKILL_DIR}/scripts/x-quote.ts https://x.com/user/status/123456789 "I agree!" --submit
```
```
# Preview mode (doesn't post)npx -y bun ${SKILL_DIR}/scripts/x-quote.ts https://x.com/user/status/123456789 "Great insight!"# Actually postnpx -y bun ${SKILL_DIR}/scripts/x-quote.ts https://x.com/user/status/123456789 "I agree!" --submit
```
```
<tweet-url>
```
```
<comment>
```
```
--submit
```
```
--profile <dir>
```
```
# Preview modenpx -y bun ${SKILL_DIR}/scripts/x-article.ts article.md# With cover imagenpx -y bun ${SKILL_DIR}/scripts/x-article.ts article.md --cover ./cover.jpg# Publishnpx -y bun ${SKILL_DIR}/scripts/x-article.ts article.md --submit
```
```
# Preview modenpx -y bun ${SKILL_DIR}/scripts/x-article.ts article.md# With cover imagenpx -y bun ${SKILL_DIR}/scripts/x-article.ts article.md --cover ./cover.jpg# Publishnpx -y bun ${SKILL_DIR}/scripts/x-article.ts article.md --submit
```
```
<markdown>
```
```
--cover <path>
```
```
--title <text>
```
```
--submit
```
```
---title: My Article Titlecover_image: /path/to/cover.jpg---
```
```
---title: My Article Titlecover_image: /path/to/cover.jpg---
```
```
--submit
```
```
.baoyu-skills/baoyu-post-to-x/EXTEND.md
```
```
~/.baoyu-skills/baoyu-post-to-x/EXTEND.md
```
Unlock advanced social media capabilities for your AI coding assistant with this powerful X (Twitter) posting skill. Designed to handle everything from quick text updates to comprehensive long-form articles, it leverages a real Chrome browser to seamlessly bypass typical anti-automation measures. This means your agent can manage complex content strategies, share rich media, and publish in-depth posts directly to X, ensuring your message reaches your audience without friction. Ideal for developers looking to integrate robust social sharing into their AI-driven workflows.

# When to Use This Skill
- •Automate daily or scheduled marketing tweets/posts with images or videos.
- •Publish long-form Markdown articles directly to X Articles from your content management system.
- •Distribute real-time news updates or code release announcements instantly.
- •Generate and quote-tweet relevant content, adding commentary or insights.

# Pro Tips
- 💡Ensure Google Chrome and `bun` are installed on the execution environment and perform a manual login to X on the first run to avoid automation blocks.
- 💡Leverage the `x-article.ts` script for in-depth content distribution, transforming your Markdown into engaging long-form posts directly on X.
- 💡Integrate this skill with content generation agents to create a full pipeline from content creation to automated social media publishing.

