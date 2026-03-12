# meme-factory
Source: https://antigravity.codes/agent-skills/creative/meme-factory

## AI Worker Instructions
When the user requests functionality related to meme-factory, follow these guidelines and utilize this context.

## Scraped Content

# meme-factory
```
/meme-factory
```
```
/meme-factory {template} {top} {bottom}
```
```
meme-factory: create a meme about X
```
```
https://api.memegen.link/images/{template}/{top}/{bottom}.png
```
```
?width=1200&height=630
```
```
?style=https://example.com/image.jpg
```
```
https://api.memegen.link/images/{template}/{top_text}/{bottom_text}.{extension}
```
```
https://api.memegen.link/images/{template}/{top_text}/{bottom_text}.{extension}
```
```
https://api.memegen.link/images/buzz/memes/memes_everywhere.png
```
```
https://api.memegen.link/images/buzz/memes/memes_everywhere.png
```
```
_
```
```
-
```
```
~n
```
```
~q
```
```
~p
```
```
~s
```
```
~h
```
```
''
```
```
""
```
```
buzz
```
```
drake
```
```
success
```
```
fine
```
```
fry
```
```
changemind
```
```
distracted
```
```
mordor
```
```
drake
```
```
success
```
```
fine
```
```
fry
```
```
changemind
```
```
buzz
```
```
mordor
```
```
_
```
```
-
```
```
.png
```
```
.jpg
```
```
~q
```
```
~s
```
```
~p
```
```
curl -I "https://api.memegen.link/images/buzz/test/test.png"# Should return: HTTP/2 200
```
```
curl -I "https://api.memegen.link/images/buzz/test/test.png"# Should return: HTTP/2 200
```
```
.png
```
```
.jpg
```
```
.webp
```
```
.gif
```
```
?width=800?height=600?width=800&height=600  (padded to exact)
```
```
?width=800?height=600?width=800&height=600  (padded to exact)
```
```
?layout=top     # Text at top only?layout=bottom  # Text at bottom only?layout=default # Standard top/bottom
```
```
?layout=top     # Text at top only?layout=bottom  # Text at bottom only?layout=default # Standard top/bottom
```
```
?font=impact  (default)
```
```
?font=impact  (default)
```
```
https://api.memegen.link/images/custom/hello/world.png?style=https://example.com/image.jpg
```
```
https://api.memegen.link/images/custom/hello/world.png?style=https://example.com/image.jpg
```
```
Template: fryhttps://api.memegen.link/images/fry/not_sure_if_feature/or_bug.png
```
```
Template: fryhttps://api.memegen.link/images/fry/not_sure_if_feature/or_bug.png
```
```
Template: interestinghttps://api.memegen.link/images/interesting/i_dont_always_test/but_when_i_do_i_do_it_in_production.png
```
```
Template: interestinghttps://api.memegen.link/images/interesting/i_dont_always_test/but_when_i_do_i_do_it_in_production.png
```
```
Template: yodawghttps://api.memegen.link/images/yodawg/yo_dawg_i_heard_you_like_docs/so_i_documented_the_documentation.png
```
```
Template: yodawghttps://api.memegen.link/images/yodawg/yo_dawg_i_heard_you_like_docs/so_i_documented_the_documentation.png
```
```
Template: finehttps://api.memegen.link/images/fine/memory_usage_at_99~/this_is_fine.png
```
```
Template: finehttps://api.memegen.link/images/fine/memory_usage_at_99~/this_is_fine.png
```
```
Template: successhttps://api.memegen.link/images/success/deployed_to_production/zero_downtime.png
```
```
Template: successhttps://api.memegen.link/images/success/deployed_to_production/zero_downtime.png
```
```
Here's a relevant meme:![Meme](https://api.memegen.link/images/buzz/bugs/bugs_everywhere.png)
```
```
Here's a relevant meme:![Meme](https://api.memegen.link/images/buzz/bugs/bugs_everywhere.png)
```
```
def generate_status_meme(status: str, message: str):    template_map = {        "success": "success",        "failure": "fine",        "review": "fry",        "deploy": "interesting"    }    template = template_map.get(status, "buzz")    words = message.split()    top = "_".join(words[0:3])    bottom = "_".join(words[3:6])    return f"https://api.memegen.link/images/{template}/{top}/{bottom}.png"
```
```
def generate_status_meme(status: str, message: str):    template_map = {        "success": "success",        "failure": "fine",        "review": "fry",        "deploy": "interesting"    }    template = template_map.get(status, "buzz")    words = message.split()    top = "_".join(words[0:3])    bottom = "_".join(words[3:6])    return f"https://api.memegen.link/images/{template}/{top}/{bottom}.png"
```
```
from meme_generator import MemeGeneratormeme = MemeGenerator()url = meme.generate("buzz", "features", "features everywhere")print(url)
```
```
from meme_generator import MemeGeneratormeme = MemeGenerator()url = meme.generate("buzz", "features", "features everywhere")print(url)
```
```
/templates/
```
```
/templates/{id}
```
```
/fonts/
```
```
/images/{template}/{top}/{bottom}.{ext}
```
Elevate your digital communication and content creation with the Meme Factory Agent Skill. This powerful tool empowers AI assistants to craft custom memes on demand, leveraging the extensive memegen.link API. Whether you're looking to inject humor into a conversation, create engaging social media posts, or simply visualize a concept with a witty image, this skill provides instant access to a vast library of templates. It's designed for seamless integration, allowing users to generate impactful visual aids effortlessly, making interactions more dynamic and memorable.

# When to Use This Skill
- •Quickly add humor or visual examples to coding discussions or project briefs.
- •Generate engaging social media content for marketing or personal branding.
- •Create internal team jokes or icebreakers during virtual meetings.
- •Illustrate complex ideas with a relatable visual format in presentations.

# Pro Tips
- 💡Explore the `memegen.link/templates` directory regularly to discover new popular meme formats and keep your content fresh.
- 💡Utilize the `?width` and `?height` parameters for optimal image dimensions, especially when embedding memes in specific platforms.
- 💡Combine meme generation with other content creation skills for a multi-modal output, like generating text and then a relevant meme to accompany it.

