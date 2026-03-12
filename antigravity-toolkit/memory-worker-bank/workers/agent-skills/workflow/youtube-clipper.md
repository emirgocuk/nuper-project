# youtube-clipper
Source: https://antigravity.codes/agent-skills/workflow/op7418-youtube-clipper-skill

## AI Worker Instructions
When the user requests functionality related to youtube-clipper, follow these guidelines and utilize this context.

## Scraped Content

# youtube-clipper
```
npx skills add https://github.com/op7418/Youtube-clipper-skill
```
```
yt-dlp --version
```
```
yt-dlp --version
```
```
# 优先检查 ffmpeg-full（macOS）   /opt/homebrew/opt/ffmpeg-full/bin/ffmpeg -version   # 检查标准 FFmpeg   ffmpeg -version   # 验证 libass 支持（字幕烧录必需）   ffmpeg -filters 2>&1 | grep subtitles
```
```
# 优先检查 ffmpeg-full（macOS）   /opt/homebrew/opt/ffmpeg-full/bin/ffmpeg -version   # 检查标准 FFmpeg   ffmpeg -version   # 验证 libass 支持（字幕烧录必需）   ffmpeg -filters 2>&1 | grep subtitles
```
```
python3 -c "import yt_dlp; print('✅ yt-dlp available')"   python3 -c "import pysrt; print('✅ pysrt available')"
```
```
python3 -c "import yt_dlp; print('✅ yt-dlp available')"   python3 -c "import pysrt; print('✅ pysrt available')"
```
```
brew install yt-dlp
```
```
pip install yt-dlp
```
```
brew install ffmpeg-full  # macOS
```
```
brew install ffmpeg-full  # macOS
```
```
pip install pysrt python-dotenv
```
```
/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg
```
```
cd ~/.claude/skills/youtube-clipper   python3 scripts/download_video.py <youtube_url>
```
```
cd ~/.claude/skills/youtube-clipper   python3 scripts/download_video.py <youtube_url>
```
```
<id>.mp4
```
```
<id>.en.vtt
```
```
python3 scripts/analyze_subtitles.py <subtitle_path>
```
```
python3 scripts/analyze_subtitles.py <subtitle_path>
```
```
📊 分析完成，生成 X 个章节：   1. [00:00 - 03:15] AGI 不是时间点，是指数曲线      核心: AI 模型能力每 4-12 月翻倍，工程师已用 Claude 写代码      关键词: AGI、指数增长、Claude Code   2. [03:15 - 06:30] 中国在 AI 上的差距      核心: 芯片禁运卡住中国，DeepSeek benchmark 优化不代表实力      关键词: 中国、芯片禁运、DeepSeek   ... (所有章节)   ✓ 所有内容已覆盖，无遗漏
```
```
📊 分析完成，生成 X 个章节：   1. [00:00 - 03:15] AGI 不是时间点，是指数曲线      核心: AI 模型能力每 4-12 月翻倍，工程师已用 Claude 写代码      关键词: AGI、指数增长、Claude Code   2. [03:15 - 06:30] 中国在 AI 上的差距      核心: 芯片禁运卡住中国，DeepSeek benchmark 优化不代表实力      关键词: 中国、芯片禁运、DeepSeek   ... (所有章节)   ✓ 所有内容已覆盖，无遗漏
```
```
python3 scripts/clip_video.py <video_path> <start_time> <end_time> <output_path>
```
```
python3 scripts/clip_video.py <video_path> <start_time> <end_time> <output_path>
```
```
<章节标题>_clip.mp4
```
```
<章节标题>_original.srt
```
```
python3 scripts/translate_subtitles.py <subtitle_path>
```
```
python3 scripts/translate_subtitles.py <subtitle_path>
```
```
<章节标题>_translated.srt
```
```
<章节标题>_bilingual.srt
```
```
python3 scripts/burn_subtitles.py <video_path> <subtitle_path> <output_path>
```
```
python3 scripts/burn_subtitles.py <video_path> <subtitle_path> <output_path>
```
```
<章节标题>_with_subtitles.mp4
```
```
python3 scripts/generate_summary.py <chapter_info>
```
```
python3 scripts/generate_summary.py <chapter_info>
```
```
<章节标题>_summary.md
```
```
🎬 开始处理章节 1/3: AGI 不是时间点，是指数曲线1/6 剪辑视频片段... ✅2/6 提取字幕片段... ✅3/6 翻译字幕为中文... [=====>    ] 50% (26/52)4/6 生成双语字幕文件... ✅5/6 烧录字幕到视频... ✅6/6 生成总结文案... ✅✨ 章节 1 处理完成
```
```
🎬 开始处理章节 1/3: AGI 不是时间点，是指数曲线1/6 剪辑视频片段... ✅2/6 提取字幕片段... ✅3/6 翻译字幕为中文... [=====>    ] 50% (26/52)4/6 生成双语字幕文件... ✅5/6 烧录字幕到视频... ✅6/6 生成总结文案... ✅✨ 章节 1 处理完成
```
```
./youtube-clips/<日期时间>/
```
```
./youtube-clips/<日期时间>/
```
```
<章节标题>/   ├── <章节标题>_clip.mp4              # 原始剪辑（无字幕）   ├── <章节标题>_with_subtitles.mp4   # 烧录字幕版本   ├── <章节标题>_bilingual.srt        # 双语字幕文件   └── <章节标题>_summary.md           # 总结文案
```
```
<章节标题>/   ├── <章节标题>_clip.mp4              # 原始剪辑（无字幕）   ├── <章节标题>_with_subtitles.mp4   # 烧录字幕版本   ├── <章节标题>_bilingual.srt        # 双语字幕文件   └── <章节标题>_summary.md           # 总结文案
```
```
✨ 处理完成！   📁 输出目录: ./youtube-clips/20260121_143022/   文件列表:     🎬 AGI_指数曲线_双语硬字幕.mp4 (14 MB)     📄 AGI_指数曲线_双语字幕.srt (2.3 KB)     📝 AGI_指数曲线_总结.md (3.2 KB)   快速预览:   open ./youtube-clips/20260121_143022/AGI_指数曲线_双语硬字幕.mp4
```
```
✨ 处理完成！   📁 输出目录: ./youtube-clips/20260121_143022/   文件列表:     🎬 AGI_指数曲线_双语硬字幕.mp4 (14 MB)     📄 AGI_指数曲线_双语字幕.srt (2.3 KB)     📝 AGI_指数曲线_总结.md (3.2 KB)   快速预览:   open ./youtube-clips/20260121_143022/AGI_指数曲线_双语硬字幕.mp4
```
```
/opt/homebrew/bin/ffmpeg
```
```
/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg
```
```
<章节标题>_clip.mp4
```
```
<章节标题>_bilingual.srt
```
```
<章节标题>_with_subtitles.mp4
```
```
<章节标题>_summary.md
```
```
/
```
```
\
```
```
:
```
```
*
```
```
?
```
```
"
```
```
<
```
```
>
```
```
|
```
This skill empowers your AI agent to automate the often-tedious process of extracting specific segments from YouTube videos. Leveraging robust command-line tools like `yt-dlp` and `FFmpeg`, it handles everything from environment setup and video download to intelligent clipping and subtitle integration. Ideal for content creators, researchers, or anyone needing precise video excerpts, this tool ensures a streamlined and efficient workflow for managing YouTube content directly from your coding assistant, enhancing productivity and content reuse.

# When to Use This Skill
- •Extracting key segments from long educational YouTube videos for study notes or presentations.
- •Creating short, shareable clips from webinars or interviews for social media promotion.
- •Archiving specific scenes or discussions from YouTube documentaries with burned-in subtitles for reference.
- •Automating the creation of highlight reels from live streams or VODs for content repurposing.

# Pro Tips
- 💡Ensure your system has `ffmpeg-full` installed on macOS for optimal subtitle burning, as standard FFmpeg might lack `libass` support required for this feature.
- 💡Leverage the built-in environmental detection phase to proactively resolve any dependency issues (like `yt-dlp` or `pysrt`), saving time during complex clipping tasks.
- 💡For best results with intelligent clipping and subtitle integration, confirm the target YouTube video has available English subtitles that `yt-dlp` can reliably download.

