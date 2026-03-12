# draw-io
Source: https://antigravity.codes/agent-skills/documentation/draw-io

## AI Worker Instructions
When the user requests functionality related to draw-io, follow these guidelines and utilize this context.

## Scraped Content

# draw-io
```
.drawio
```
```
.drawio.png
```
```
.drawio.png
```
```
defaultFontFamily
```
```
<mxGraphModel defaultFontFamily="Noto Sans JP" ...>
```
```
<mxGraphModel defaultFontFamily="Noto Sans JP" ...>
```
```
fontFamily
```
```
style="text;html=1;fontSize=27;fontFamily=Noto Sans JP;"
```
```
style="text;html=1;fontSize=27;fontFamily=Noto Sans JP;"
```
```
# Convert all .drawio filesmise exec -- pre-commit run --all-files# Convert specific .drawio filemise exec -- pre-commit run convert-drawio-to-png --files assets/my-diagram.drawio# Run script directly (using skill's script)bash ~/.claude/skills/draw-io/scripts/convert-drawio-to-png.sh assets/diagram1.drawio
```
```
# Convert all .drawio filesmise exec -- pre-commit run --all-files# Convert specific .drawio filemise exec -- pre-commit run convert-drawio-to-png --files assets/my-diagram.drawio# Run script directly (using skill's script)bash ~/.claude/skills/draw-io/scripts/convert-drawio-to-png.sh assets/diagram1.drawio
```
```
drawio -x -f png -s 2 -t -o output.drawio.png input.drawio
```
```
drawio -x -f png -s 2 -t -o output.drawio.png input.drawio
```
```
-x
```
```
-f png
```
```
-s 2
```
```
-t
```
```
-o
```
```
.drawio
```
```
mxCell
```
```
value
```
```
mxGeometry
```
```
x
```
```
y
```
```
width
```
```
height
```
```
y + (height / 2)
```
```
background="#ffffff"
```
```
<!-- For 10-character text, allow 300-400px --><mxGeometry x="140" y="60" width="400" height="40" />
```
```
<!-- For 10-character text, allow 300-400px --><mxGeometry x="140" y="60" width="400" height="40" />
```
```
<!-- Title --><mxCell id="title" value="..." .../><!-- Arrows (back layer) --><mxCell id="arrow1" style="edgeStyle=..." .../><!-- Other elements (front layer) --><mxCell id="box1" .../>
```
```
<!-- Title --><mxCell id="title" value="..." .../><!-- Arrows (back layer) --><mxCell id="arrow1" style="edgeStyle=..." .../><!-- Other elements (front layer) --><mxCell id="box1" .../>
```
```
<!-- Good: Explicit coordinates with sourcePoint/targetPoint --><mxCell id="arrow" style="..." edge="1" parent="1">  <mxGeometry relative="1" as="geometry">    <mxPoint x="1279" y="500" as="sourcePoint"/>    <mxPoint x="119" y="500" as="targetPoint"/>    <Array as="points">      <mxPoint x="1279" y="560"/>      <mxPoint x="119" y="560"/>    </Array>  </mxGeometry></mxCell>
```
```
<!-- Good: Explicit coordinates with sourcePoint/targetPoint --><mxCell id="arrow" style="..." edge="1" parent="1">  <mxGeometry relative="1" as="geometry">    <mxPoint x="1279" y="500" as="sourcePoint"/>    <mxPoint x="119" y="500" as="targetPoint"/>    <Array as="points">      <mxPoint x="1279" y="560"/>      <mxPoint x="119" y="560"/>    </Array>  </mxGeometry></mxCell>
```
```
<!-- Place above arrow (negative value to distance) --><mxPoint x="0" y="-40" as="offset"/><!-- Place below arrow (positive value to distance) --><mxPoint x="0" y="40" as="offset"/>
```
```
<!-- Place above arrow (negative value to distance) --><mxPoint x="0" y="-40" as="offset"/><!-- Place below arrow (positive value to distance) --><mxPoint x="0" y="40" as="offset"/>
```
```
&lt;br&gt;
```
```
rounded=1
```
```
Background frame: y=20, height=400 -> range is y=20-420Internal element top: frame y + 30 or more (e.g., y=50)Internal element bottom: frame y + height - 30 or less (e.g., up to y=390)
```
```
Background frame: y=20, height=400 -> range is y=20-420Internal element top: frame y + 30 or more (e.g., y=50)Internal element bottom: frame y + height - 30 or less (e.g., up to y=390)
```
```
<!-- Background frame --><mxCell id="bg" style="rounded=1;strokeWidth=3;...">  <mxGeometry x="500" y="20" width="560" height="400" /></mxCell><!-- Text: y=30 is too close to frame top (y=20) --><mxCell id="label" value="Title" style="text;...">  <mxGeometry x="510" y="30" width="540" height="35" /></mxCell>
```
```
<!-- Background frame --><mxCell id="bg" style="rounded=1;strokeWidth=3;...">  <mxGeometry x="500" y="20" width="560" height="400" /></mxCell><!-- Text: y=30 is too close to frame top (y=20) --><mxCell id="label" value="Title" style="text;...">  <mxGeometry x="510" y="30" width="540" height="35" /></mxCell>
```
```
<!-- Background frame --><mxCell id="bg" style="rounded=1;strokeWidth=3;...">  <mxGeometry x="500" y="20" width="560" height="430" /></mxCell><!-- Text: y=50 is 30px from frame top (y=20) --><mxCell id="label" value="Title" style="text;...">  <mxGeometry x="510" y="50" width="540" height="35" /></mxCell>
```
```
<!-- Background frame --><mxCell id="bg" style="rounded=1;strokeWidth=3;...">  <mxGeometry x="500" y="20" width="560" height="430" /></mxCell><!-- Text: y=50 is 30px from frame top (y=20) --><mxCell id="label" value="Title" style="text;...">  <mxGeometry x="510" y="50" width="540" height="35" /></mxCell>
```
```
python ~/.claude/skills/draw-io/scripts/find_aws_icon.py ec2python ~/.claude/skills/draw-io/scripts/find_aws_icon.py lambda
```
```
python ~/.claude/skills/draw-io/scripts/find_aws_icon.py ec2python ~/.claude/skills/draw-io/scripts/find_aws_icon.py lambda
```
```
auto-stretch: false
```
```
---title: "Your Presentation"format:  revealjs:    auto-stretch: false---
```
```
---title: "Your Presentation"format:  revealjs:    auto-stretch: false---
```
Unlock the full potential of draw.io diagrams directly within your coding environment. This agent skill empowers you to efficiently manage and refine your visual documentation, from intricate architectural layouts to simple flowcharts. By offering direct manipulation of .drawio XML files and robust conversion capabilities, it ensures your diagrams are always precise, up-to-date, and presentation-ready. Whether you're adjusting font families for consistency, converting to high-resolution PNGs, or integrating specific iconography like AWS, this skill provides the tools to maintain clarity and professionalism in your technical assets, saving valuable time and reducing manual errors.

# When to Use This Skill
- •Creating and refining architectural diagrams (e.g., AWS infrastructure) directly from .drawio XML.
- •Automating the conversion of .drawio files to high-resolution PNGs for documentation or presentations.
- •Ensuring consistent font styles and layout across multiple diagrams in a project.
- •Reviewing and suggesting precise XML edits for complex diagram adjustments and iconography usage.

# Pro Tips
- 💡Always specify `defaultFontFamily` in the `mxGraphModel` tag for project-wide consistency and ensure individual text elements explicitly define `fontFamily` to prevent rendering issues.
- 💡Utilize the `-s 2` option during PNG conversion to generate high-resolution images, perfect for retina displays or print, ensuring clarity without manual scaling.
- 💡Integrate the conversion script into your pre-commit hooks to automatically update PNGs whenever `.drawio` files are modified, maintaining up-to-date visuals effortlessly.

