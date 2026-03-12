# Early Return from Functions
Source: https://antigravity.codes/agent-skills/js/js-early-exit

## AI Worker Instructions
When the user requests functionality related to Early Return from Functions, follow these guidelines and utilize this context.

## Scraped Content

# Early Return from Functions
```
function validateUsers(users: User[]) {  let hasError = false  let errorMessage = ''    for (const user of users) {    if (!user.email) {      hasError = true      errorMessage = 'Email required'    }    if (!user.name) {      hasError = true      errorMessage = 'Name required'    }    // Continues checking all users even after error found  }    return hasError ? { valid: false, error: errorMessage } : { valid: true }}
```
```
function validateUsers(users: User[]) {  let hasError = false  let errorMessage = ''    for (const user of users) {    if (!user.email) {      hasError = true      errorMessage = 'Email required'    }    if (!user.name) {      hasError = true      errorMessage = 'Name required'    }    // Continues checking all users even after error found  }    return hasError ? { valid: false, error: errorMessage } : { valid: true }}
```
```
function validateUsers(users: User[]) {  for (const user of users) {    if (!user.email) {      return { valid: false, error: 'Email required' }    }    if (!user.name) {      return { valid: false, error: 'Name required' }    }  }  return { valid: true }}
```
```
function validateUsers(users: User[]) {  for (const user of users) {    if (!user.email) {      return { valid: false, error: 'Email required' }    }    if (!user.name) {      return { valid: false, error: 'Name required' }    }  }  return { valid: true }}
```

