# youtube-transcript
Source: https://antigravity.codes/agent-skills/workflow/youtube-transcript

## AI Worker Instructions
When the user requests functionality related to youtube-transcript, follow these guidelines and utilize this context.

## Scraped Content

# youtube-transcript
```
uv run scripts/get_transcript.py "VIDEO_URL_OR_ID"
```
```
uv run scripts/get_transcript.py "VIDEO_URL_OR_ID"
```
```
uv run scripts/get_transcript.py "VIDEO_URL_OR_ID" --timestamps
```
```
uv run scripts/get_transcript.py "VIDEO_URL_OR_ID" --timestamps
```
```
[MM:SS] text
```
```
[HH:MM:SS]
```
```
https://www.youtube.com/watch?v=VIDEO_ID
```
```
https://youtu.be/VIDEO_ID
```
```
https://youtube.com/embed/VIDEO_ID
```
```
-transcript.txt
```
This agent skill provides a powerful solution for instantly obtaining text transcripts from YouTube videos. Whether you need precise captions with timestamps for detailed analysis or clean, paragraph-formatted text for readability, this tool streamlines the process. It's an indispensable asset for content creators, researchers, and anyone looking to repurpose video content or glean insights from spoken words without manual transcription. Enhance your workflow by integrating this skill to quickly transform auditory information into accessible, searchable text.

# When to Use This Skill
- •Generating text summaries or articles from long video lectures or presentations.
- •Creating accessible versions of video content for users with hearing impairments.
- •Analyzing video content for specific keywords, topics, or sentiment.
- •Translating video dialogue by using the extracted text as a base for language models.

# Pro Tips
- 💡Always specify `--timestamps` if precise timing for each caption segment is crucial for your task, such as video editing or detailed indexing.
- 💡Leverage the default output (without timestamps) for tasks requiring clean, readable text, and consider piping it directly into another AI agent for summarization or rephrasing.
- 💡Combine this skill with a file saving agent to automatically archive transcripts for a series of videos, facilitating batch processing and content management.

