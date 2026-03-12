# Combine Multiple Array Iterations
Source: https://antigravity.codes/agent-skills/js/js-combine-iterations

## AI Worker Instructions
When the user requests functionality related to Combine Multiple Array Iterations, follow these guidelines and utilize this context.

## Scraped Content

# Combine Multiple Array Iterations
```
.filter()
```
```
.map()
```
```
const admins = users.filter(u => u.isAdmin)const testers = users.filter(u => u.isTester)const inactive = users.filter(u => !u.isActive)
```
```
const admins = users.filter(u => u.isAdmin)const testers = users.filter(u => u.isTester)const inactive = users.filter(u => !u.isActive)
```
```
const admins: User[] = []const testers: User[] = []const inactive: User[] = []for (const user of users) {  if (user.isAdmin) admins.push(user)  if (user.isTester) testers.push(user)  if (!user.isActive) inactive.push(user)}
```
```
const admins: User[] = []const testers: User[] = []const inactive: User[] = []for (const user of users) {  if (user.isAdmin) admins.push(user)  if (user.isTester) testers.push(user)  if (!user.isActive) inactive.push(user)}
```

