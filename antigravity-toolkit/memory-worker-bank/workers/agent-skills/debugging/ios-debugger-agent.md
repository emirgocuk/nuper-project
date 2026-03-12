# ios-debugger-agent
Source: https://antigravity.codes/agent-skills/debugging/ios-debugger-agent

## AI Worker Instructions
When the user requests functionality related to ios-debugger-agent, follow these guidelines and utilize this context.

## Scraped Content

# ios-debugger-agent
```
mcp__XcodeBuildMCP__list_sims
```
```
Booted
```
```
mcp__XcodeBuildMCP__session-set-defaults
```
```
projectPath
```
```
workspacePath
```
```
scheme
```
```
simulatorId
```
```
configuration: "Debug"
```
```
useLatestOS: true
```
```
mcp__XcodeBuildMCP__build_run_sim
```
```
mcp__XcodeBuildMCP__launch_app_sim
```
```
mcp__XcodeBuildMCP__get_sim_app_path
```
```
mcp__XcodeBuildMCP__get_app_bundle_id
```
```
mcp__XcodeBuildMCP__describe_ui
```
```
mcp__XcodeBuildMCP__tap
```
```
id
```
```
label
```
```
mcp__XcodeBuildMCP__type_text
```
```
mcp__XcodeBuildMCP__gesture
```
```
mcp__XcodeBuildMCP__screenshot
```
```
mcp__XcodeBuildMCP__start_sim_log_cap
```
```
mcp__XcodeBuildMCP__stop_sim_log_cap
```
```
captureConsole: true
```
```
preferXcodebuild: true
```
```
describe_ui
```
Navigating the complexities of iOS app development, especially during the debugging phase, often requires meticulous attention to simulator interaction and log analysis. This powerful agent skill streamlines the entire process, empowering AI coding assistants to take direct control of your iOS development environment. It leverages advanced XcodeBuildMCP tools to not only launch and run applications but also to deeply inspect their runtime behavior, making the diagnostic workflow significantly more efficient for developers. This skill is indispensable for accelerating bug fixes and validating app functionality on the simulator.

# When to Use This Skill
- •Automatically build and launch an iOS application on a booted simulator when a new feature is implemented or tested.
- •Diagnose a crash by capturing simulator logs and console output after running a specific user interaction sequence.
- •Inspect the on-screen UI state of a running iOS app to verify component rendering and data presentation.
- •Interact with the iOS simulator, such as tapping buttons or navigating screens, to reproduce bugs or test user flows.

# Pro Tips
- 💡Always ensure an iOS simulator is pre-booted to expedite the debugging process; the skill can discover existing booted instances.
- 💡Leverage the `session-set-defaults` function to define your project path, scheme, and simulator ID once per session to reduce repetitive inputs.
- 💡Combine UI interaction requests with log capture to get a comprehensive view of what happened leading up to an issue.

