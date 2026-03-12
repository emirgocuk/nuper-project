# Narrow Effect Dependencies
Source: https://antigravity.codes/agent-skills/rerender/rerender-dependencies

## AI Worker Instructions
When the user requests functionality related to Narrow Effect Dependencies, follow these guidelines and utilize this context.

## Scraped Content

# Narrow Effect Dependencies
```
useEffect(() => {  console.log(user.id)}, [user])
```
```
useEffect(() => {  console.log(user.id)}, [user])
```
```
useEffect(() => {  console.log(user.id)}, [user.id])
```
```
useEffect(() => {  console.log(user.id)}, [user.id])
```
```
// Incorrect: runs on width=767, 766, 765...useEffect(() => {  if (width < 768) {    enableMobileMode()  }}, [width])// Correct: runs only on boolean transitionconst isMobile = width < 768useEffect(() => {  if (isMobile) {    enableMobileMode()  }}, [isMobile])
```
```
// Incorrect: runs on width=767, 766, 765...useEffect(() => {  if (width < 768) {    enableMobileMode()  }}, [width])// Correct: runs only on boolean transitionconst isMobile = width < 768useEffect(() => {  if (isMobile) {    enableMobileMode()  }}, [isMobile])
```

