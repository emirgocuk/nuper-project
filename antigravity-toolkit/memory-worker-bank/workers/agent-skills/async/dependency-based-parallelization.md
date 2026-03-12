# Dependency-Based Parallelization
Source: https://antigravity.codes/agent-skills/async/async-dependencies

## AI Worker Instructions
When the user requests functionality related to Dependency-Based Parallelization, follow these guidelines and utilize this context.

## Scraped Content

# Dependency-Based Parallelization
```
better-all
```
```
const [user, config] = await Promise.all([  fetchUser(),  fetchConfig()])const profile = await fetchProfile(user.id)
```
```
const [user, config] = await Promise.all([  fetchUser(),  fetchConfig()])const profile = await fetchProfile(user.id)
```
```
import { all } from 'better-all'const { user, config, profile } = await all({  async user() { return fetchUser() },  async config() { return fetchConfig() },  async profile() {    return fetchProfile((await this.$.user).id)  }})
```
```
import { all } from 'better-all'const { user, config, profile } = await all({  async user() { return fetchUser() },  async config() { return fetchConfig() },  async profile() {    return fetchProfile((await this.$.user).id)  }})
```

