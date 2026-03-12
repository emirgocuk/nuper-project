# Use Loop for Min/Max Instead of Sort
Source: https://antigravity.codes/agent-skills/js/js-min-max-loop

## AI Worker Instructions
When the user requests functionality related to Use Loop for Min/Max Instead of Sort, follow these guidelines and utilize this context.

## Scraped Content

# Use Loop for Min/Max Instead of Sort
```
interface Project {  id: string  name: string  updatedAt: number}function getLatestProject(projects: Project[]) {  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)  return sorted[0]}
```
```
interface Project {  id: string  name: string  updatedAt: number}function getLatestProject(projects: Project[]) {  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)  return sorted[0]}
```
```
function getOldestAndNewest(projects: Project[]) {  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }}
```
```
function getOldestAndNewest(projects: Project[]) {  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }}
```
```
function getLatestProject(projects: Project[]) {  if (projects.length === 0) return null    let latest = projects[0]    for (let i = 1; i < projects.length; i++) {    if (projects[i].updatedAt > latest.updatedAt) {      latest = projects[i]    }  }    return latest}function getOldestAndNewest(projects: Project[]) {  if (projects.length === 0) return { oldest: null, newest: null }    let oldest = projects[0]  let newest = projects[0]    for (let i = 1; i < projects.length; i++) {    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]  }    return { oldest, newest }}
```
```
function getLatestProject(projects: Project[]) {  if (projects.length === 0) return null    let latest = projects[0]    for (let i = 1; i < projects.length; i++) {    if (projects[i].updatedAt > latest.updatedAt) {      latest = projects[i]    }  }    return latest}function getOldestAndNewest(projects: Project[]) {  if (projects.length === 0) return { oldest: null, newest: null }    let oldest = projects[0]  let newest = projects[0]    for (let i = 1; i < projects.length; i++) {    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]  }    return { oldest, newest }}
```
```
const numbers = [5, 2, 8, 1, 9]const min = Math.min(...numbers)const max = Math.max(...numbers)
```
```
const numbers = [5, 2, 8, 1, 9]const min = Math.min(...numbers)const max = Math.max(...numbers)
```

