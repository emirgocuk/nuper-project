# Cache Repeated Function Calls
Source: https://antigravity.codes/agent-skills/js/js-cache-function-results

## AI Worker Instructions
When the user requests functionality related to Cache Repeated Function Calls, follow these guidelines and utilize this context.

## Scraped Content

# Cache Repeated Function Calls
```
function ProjectList({ projects }: { projects: Project[] }) {  return (    <div>      {projects.map(project => {        // slugify() called 100+ times for same project names        const slug = slugify(project.name)                return <ProjectCard key={project.id} slug={slug} />      })}    </div>  )}
```
```
function ProjectList({ projects }: { projects: Project[] }) {  return (    <div>      {projects.map(project => {        // slugify() called 100+ times for same project names        const slug = slugify(project.name)                return <ProjectCard key={project.id} slug={slug} />      })}    </div>  )}
```
```
// Module-level cacheconst slugifyCache = new Map<string, string>()function cachedSlugify(text: string): string {  if (slugifyCache.has(text)) {    return slugifyCache.get(text)!  }  const result = slugify(text)  slugifyCache.set(text, result)  return result}function ProjectList({ projects }: { projects: Project[] }) {  return (    <div>      {projects.map(project => {        // Computed only once per unique project name        const slug = cachedSlugify(project.name)                return <ProjectCard key={project.id} slug={slug} />      })}    </div>  )}
```
```
// Module-level cacheconst slugifyCache = new Map<string, string>()function cachedSlugify(text: string): string {  if (slugifyCache.has(text)) {    return slugifyCache.get(text)!  }  const result = slugify(text)  slugifyCache.set(text, result)  return result}function ProjectList({ projects }: { projects: Project[] }) {  return (    <div>      {projects.map(project => {        // Computed only once per unique project name        const slug = cachedSlugify(project.name)                return <ProjectCard key={project.id} slug={slug} />      })}    </div>  )}
```
```
let isLoggedInCache: boolean | null = nullfunction isLoggedIn(): boolean {  if (isLoggedInCache !== null) {    return isLoggedInCache  }    isLoggedInCache = document.cookie.includes('auth=')  return isLoggedInCache}// Clear cache when auth changesfunction onAuthChange() {  isLoggedInCache = null}
```
```
let isLoggedInCache: boolean | null = nullfunction isLoggedIn(): boolean {  if (isLoggedInCache !== null) {    return isLoggedInCache  }    isLoggedInCache = document.cookie.includes('auth=')  return isLoggedInCache}// Clear cache when auth changesfunction onAuthChange() {  isLoggedInCache = null}
```

