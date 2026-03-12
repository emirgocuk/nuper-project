# algorithmic-art
Source: https://antigravity.codes/agent-skills/creative/algorithmic-art

## AI Worker Instructions
When the user requests functionality related to algorithmic-art, follow these guidelines and utilize this context.

## Scraped Content

# algorithmic-art
```
templates/viewer.html
```
```
// ALWAYS use a seed for reproducibilitylet seed = 12345; // or hash from user inputrandomSeed(seed);noiseSeed(seed);
```
```
// ALWAYS use a seed for reproducibilitylet seed = 12345; // or hash from user inputrandomSeed(seed);noiseSeed(seed);
```
```
let params = {  seed: 12345,  // Always include seed for reproducibility  // colors  // Add parameters that control YOUR algorithm:  // - Quantities (how many?)  // - Scales (how big? how fast?)  // - Probabilities (how likely?)  // - Ratios (what proportions?)  // - Angles (what direction?)  // - Thresholds (when does behavior change?)};
```
```
let params = {  seed: 12345,  // Always include seed for reproducibility  // colors  // Add parameters that control YOUR algorithm:  // - Quantities (how many?)  // - Scales (how big? how fast?)  // - Probabilities (how likely?)  // - Ratios (what proportions?)  // - Angles (what direction?)  // - Thresholds (when does behavior change?)};
```
```
function setup() {  createCanvas(1200, 1200);  // Initialize your system}function draw() {  // Your generative algorithm  // Can be static (noLoop) or animated}
```
```
function setup() {  createCanvas(1200, 1200);  // Initialize your system}function draw() {  // Your generative algorithm  // Can be static (noLoop) or animated}
```
```
templates/viewer.html
```
```
templates/viewer.html
```
```
templates/viewer.html
```
```
<!DOCTYPE html><html><head>  <!-- p5.js from CDN - always available -->  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>  <style>    /* All styling inline - clean, minimal */    /* Canvas on top, controls below */  </style></head><body>  <div id="canvas-container"></div>  <div id="controls">    <!-- All parameter controls -->  </div>  <script>    // ALL p5.js code inline here    // Parameter objects, classes, functions    // setup() and draw()    // UI handlers    // Everything self-contained  </script></body></html>
```
```
<!DOCTYPE html><html><head>  <!-- p5.js from CDN - always available -->  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>  <style>    /* All styling inline - clean, minimal */    /* Canvas on top, controls below */  </style></head><body>  <div id="canvas-container"></div>  <div id="controls">    <!-- All parameter controls -->  </div>  <script>    // ALL p5.js code inline here    // Parameter objects, classes, functions    // setup() and draw()    // UI handlers    // Everything self-contained  </script></body></html>
```
```
<div class="control-group">    <label>Parameter Name</label>    <input type="range" id="param" min="..." max="..." step="..." value="..." oninput="updateParam('param', this.value)">    <span class="value-display" id="param-value">...</span></div>
```
```
<div class="control-group">    <label>Parameter Name</label>    <input type="range" id="param" min="..." max="..." step="..." value="..." oninput="updateParam('param', this.value)">    <span class="value-display" id="param-value">...</span></div>
```
Explore the fascinating world where code meets creativity with the Algorithmic Art agent skill. This powerful tool empowers you to transform abstract concepts into visually stunning generative art. By leveraging computational processes, seeded randomness, and interactive parameters, you can craft unique digital masterpieces, from intricate flow fields to dynamic particle systems. It encourages an original approach, moving beyond mere replication to establish new aesthetic movements within your code, providing a limitless canvas for digital expression and artistic exploration through p5.js.

# When to Use This Skill
- •When a user requests to create art using code or generative art.
- •For developing interactive visual experiences and digital installations.
- •To generate dynamic backgrounds or unique UI elements for web projects.
- •When exploring complex visual systems like flow fields or particle simulations.

# Pro Tips
- 💡Start by clearly defining an 'algorithmic philosophy' – a conceptual framework for your art – before writing any code to guide the generative process.
- 💡Extensively experiment with seeded randomness and noise functions to discover emergent patterns and organic behaviors in your p5.js sketches.
- 💡Design your p5.js code to expose essential parameters for easy interactive exploration, allowing users to 'play' with and customize the generative output.

