# baoyu-post-to-wechat
Source: https://antigravity.codes/agent-skills/marketing/baoyu-post-to-wechat

## AI Worker Instructions
When the user requests functionality related to baoyu-post-to-wechat, follow these guidelines and utilize this context.

## Scraped Content

# baoyu-post-to-wechat
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
scripts/wechat-browser.ts
```
```
scripts/wechat-article.ts
```
```
scripts/md-to-wechat.ts
```
```
scripts/copy-to-clipboard.ts
```
```
scripts/paste-from-clipboard.ts
```
```
# From markdown file and image directorynpx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --markdown article.md --images ./images/# With explicit parametersnpx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --title "标题" --content "内容" --image img1.png --image img2.png --submit
```
```
# From markdown file and image directorynpx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --markdown article.md --images ./images/# With explicit parametersnpx -y bun ${SKILL_DIR}/scripts/wechat-browser.ts --title "标题" --content "内容" --image img1.png --image img2.png --submit
```
```
# Post markdown articlenpx -y bun ${SKILL_DIR}/scripts/wechat-article.ts --markdown article.md --theme grace
```
```
# Post markdown articlenpx -y bun ${SKILL_DIR}/scripts/wechat-article.ts --markdown article.md --theme grace
```
```
${SKILL_DIR}
```
```
references/image-text-posting.md
```
```
references/article-posting.md
```
```
bun
```
```
npx -y bun
```
```
WECHAT_BROWSER_CHROME_PATH
```
```
.baoyu-skills/baoyu-post-to-wechat/EXTEND.md
```
```
~/.baoyu-skills/baoyu-post-to-wechat/EXTEND.md
```
Unlock seamless content publishing to WeChat Official Accounts with the baoyu-post-to-wechat agent skill. Designed for efficiency, this powerful tool leverages Chrome DevTools Protocol (CDP) automation to handle both image-text (图文) and full article (文章) posts. Developers and marketers can integrate this skill into their workflows to programmatically manage their WeChat presence, reducing manual effort and ensuring consistent content delivery. It provides the programmatic control needed to maintain an active and engaging WeChat footprint.

# When to Use This Skill
- •Automating daily or weekly content updates to a WeChat Official Account.
- •Programmatically publishing blog posts or articles directly from a CMS to WeChat.
- •Cross-posting marketing campaigns or announcements from other social media platforms to WeChat.
- •Streamlining content delivery for scheduled promotional events or product launches.

# Pro Tips
- 💡Utilize the `md-to-wechat.ts` script for seamless Markdown content conversion, ensuring proper formatting and styling within WeChat.
- 💡Integrate this skill into CI/CD pipelines for automated, scheduled content releases, leveraging its Chrome CDP foundation for robust execution.
- 💡Always test content formatting and image display in a draft post before final submission, especially when dealing with complex layouts.

