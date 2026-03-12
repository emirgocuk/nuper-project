# image-gen
Source: https://antigravity.codes/agent-skills/ai-tools/image-gen

## AI Worker Instructions
When the user requests functionality related to image-gen, follow these guidelines and utilize this context.

## Scraped Content

# image-gen
```
@google/generative-ai
```
```
@google/genai
```
```
// ❌ OLD (deprecated, support ended Nov 30, 2025)import { GoogleGenerativeAI } from "@google/generative-ai";const genAI = new GoogleGenerativeAI(API_KEY);// ✅ NEW (required)import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: API_KEY });
```
```
// ❌ OLD (deprecated, support ended Nov 30, 2025)import { GoogleGenerativeAI } from "@google/generative-ai";const genAI = new GoogleGenerativeAI(API_KEY);// ✅ NEW (required)import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: API_KEY });
```
```
gemini-3-pro-image-preview
```
```
gemini-2.5-flash-image
```
```
imagen-4.0-generate-001
```
```
gemini-2.0-flash-exp-image-generation
```
```
gemini-2.0-flash-preview-image-generation
```
```
gemini-2.5-flash-image-preview
```
```
1:1   | 2:3  | 3:2  | 3:4  | 4:34:5   | 5:4  | 9:16 | 16:9 | 21:9
```
```
1:1   | 2:3  | 3:2  | 3:4  | 4:34:5   | 5:4  | 9:16 | 16:9 | 21:9
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Generate new imageconst response = await ai.models.generateContent({  model: "gemini-2.5-flash-image",  contents: "A professional plumber in hi-vis working in modern Australian home",  config: {    responseModalities: ["TEXT", "IMAGE"],  // BOTH required - cannot use ["IMAGE"] alone    imageGenerationConfig: {      aspectRatio: "16:9",    },  },});// Extract imagefor (const part of response.candidates[0].content.parts) {  if (part.inlineData) {    const buffer = Buffer.from(part.inlineData.data, "base64");    fs.writeFileSync("hero.png", buffer);  }}
```
```
import { GoogleGenAI } from "@google/genai";const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });// Generate new imageconst response = await ai.models.generateContent({  model: "gemini-2.5-flash-image",  contents: "A professional plumber in hi-vis working in modern Australian home",  config: {    responseModalities: ["TEXT", "IMAGE"],  // BOTH required - cannot use ["IMAGE"] alone    imageGenerationConfig: {      aspectRatio: "16:9",    },  },});// Extract imagefor (const part of response.candidates[0].content.parts) {  if (part.inlineData) {    const buffer = Buffer.from(part.inlineData.data, "base64");    fs.writeFileSync("hero.png", buffer);  }}
```
```
responseModalities
```
```
["TEXT", "IMAGE"]
```
```
["IMAGE"]
```
```
"4K"
```
```
"2K"
```
```
"1K"
```
```
"4k"
```
```
// ❌ WRONG - causes request failureconfig: { imageGenerationConfig: { resolution: "4k" } }// ✅ CORRECT - uppercase requiredconfig: { imageGenerationConfig: { resolution: "4K" } }
```
```
// ❌ WRONG - causes request failureconfig: { imageGenerationConfig: { resolution: "4k" } }// ✅ CORRECT - uppercase requiredconfig: { imageGenerationConfig: { resolution: "4K" } }
```
```
// May ignore aspectRatio on Gemini 2.5 Flash Imagemodel: "gemini-2.5-flash-image",config: { imageGenerationConfig: { aspectRatio: "16:9" } }// More reliable for aspect ratio controlmodel: "gemini-3-pro-image-preview",config: { imageGenerationConfig: { aspectRatio: "16:9" } }
```
```
// May ignore aspectRatio on Gemini 2.5 Flash Imagemodel: "gemini-2.5-flash-image",config: { imageGenerationConfig: { aspectRatio: "16:9" } }// More reliable for aspect ratio controlmodel: "gemini-3-pro-image-preview",config: { imageGenerationConfig: { aspectRatio: "16:9" } }
```
```
// ❌ WRONG - 7 human images exceeds limitconst humanImages = [img1, img2, img3, img4, img5, img6, img7];const prompt = [  { text: "Generate consistent characters" },  ...humanImages.map(img => ({ inlineData: { data: img, mimeType: "image/png" }})),];// ✅ CORRECT - max 5 human imagesconst humanImages = images.slice(0, 5);  // Limit to 5const objectImages = images.slice(5, 14);  // Up to 9 more for objectsconst prompt = [  { text: "Generate consistent characters" },  ...humanImages.map(img => ({ inlineData: { data: img, mimeType: "image/png" }})),  ...objectImages.map(img => ({ inlineData: { data: img, mimeType: "image/png" }})),];
```
```
// ❌ WRONG - 7 human images exceeds limitconst humanImages = [img1, img2, img3, img4, img5, img6, img7];const prompt = [  { text: "Generate consistent characters" },  ...humanImages.map(img => ({ inlineData: { data: img, mimeType: "image/png" }})),];// ✅ CORRECT - max 5 human imagesconst humanImages = images.slice(0, 5);  // Limit to 5const objectImages = images.slice(5, 14);  // Up to 9 more for objectsconst prompt = [  { text: "Generate consistent characters" },  ...humanImages.map(img => ({ inlineData: { data: img, mimeType: "image/png" }})),  ...objectImages.map(img => ({ inlineData: { data: img, mimeType: "image/png" }})),];
```
```
// Google Search tool enabledconst response = await ai.models.generateContent({  model: "gemini-3-pro-image-preview",  contents: "Generate image of latest iPhone design",  tools: [{ googleSearch: {} }],  config: { responseModalities: ["TEXT", "IMAGE"] },});// Result: Only text search results used, not image results from web search
```
```
// Google Search tool enabledconst response = await ai.models.generateContent({  model: "gemini-3-pro-image-preview",  contents: "Generate image of latest iPhone design",  tools: [{ googleSearch: {} }],  config: { responseModalities: ["TEXT", "IMAGE"] },});// Result: Only text search results used, not image results from web search
```
```
generateImages
```
```
usageMetadata
```
```
references/prompting.md
```
```
references/website-images.md
```
```
references/editing.md
```
```
references/local-imagery.md
```
```
references/integration.md
```
```
gemini-pro-vision
```
```
gemini-3-flash-image-generation
```
```
gemini-3-pro-image-generation
```
```
generateImage()
```
```
generateContent()
```
```
responseModalities: ["TEXT", "IMAGE"]
```
```
responseModalities
```
```
responseModalities: ["TEXT", "IMAGE"]
```
```
imageConfig
```
```
imageGenerationConfig
```
```
size: "1024x1024"
```
```
aspectRatio: "1:1"
```
```
const response = await ai.models.generateContent({  model: "gemini-3-flash-image-generation",  contents: prompt,  config: {    responseModalities: ["TEXT", "IMAGE"],    imageGenerationConfig: {      aspectRatio: "16:9",      // imageSize: "2K", // Pro only    },  },});
```
```
const response = await ai.models.generateContent({  model: "gemini-3-flash-image-generation",  contents: prompt,  config: {    responseModalities: ["TEXT", "IMAGE"],    imageGenerationConfig: {      aspectRatio: "16:9",      // imageSize: "2K", // Pro only    },  },});
```
```
const chat = client.chats.create({ model: "...", config: { ... } });// Turn 1: Generateconst response1 = await chat.send_message("Create a hero image...");// Turn 2: Editconst response2 = await chat.send_message("Change the vest color to green");// Turn 3: Refineconst response3 = await chat.send_message("Widen the image to 21:9");
```
```
const chat = client.chats.create({ model: "...", config: { ... } });// Turn 1: Generateconst response1 = await chat.send_message("Create a hero image...");// Turn 2: Editconst response2 = await chat.send_message("Change the vest color to green");// Turn 3: Refineconst response3 = await chat.send_message("Widen the image to 21:9");
```
```
inlineData
```
```
Buffer.from(data, "base64")
```
Elevate your web development projects with custom, AI-generated imagery. This skill empowers coding assistants like Claude Code to produce diverse visual assets, from stunning hero banners to detailed infographics complete with legible text. Designed to overcome the limitations of generic stock photos, it ensures your digital content is visually consistent and on-brand. With features like multi-turn editing and specific patterns for Australian imagery, this tool is invaluable for creating engaging and tailored visuals that truly resonate with your audience, streamlining the design process directly within your development workflow. Say goodbye to generic visuals and hello to bespoke creativity.

# When to Use This Skill
- •Creating custom hero banners and service cards for new website sections.
- •Generating infographics with embedded, legible text for blog posts or educational content.
- •Developing a consistent visual style across multiple digital assets for a brand refresh.
- •Rapidly prototyping visual concepts for client presentations or internal reviews.

# Pro Tips
- 💡Leverage multi-turn editing to refine generated images iteratively, guiding the AI to your precise vision.
- 💡Specify regional aesthetics, like 'Australian imagery patterns,' in your prompts for locally relevant visuals.
- 💡For complex text in images, break down your prompt into smaller, more focused requests to ensure legibility.

