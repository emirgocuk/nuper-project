# code-review-excellence
Source: https://antigravity.codes/agent-skills/workflow/code-review-excellence

## AI Worker Instructions
When the user requests functionality related to code-review-excellence, follow these guidelines and utilize this context.

## Scraped Content

# code-review-excellence
```
❌ Bad: "This is wrong."✅ Good: "This could cause a race condition when multiple usersaccess simultaneously. Consider using a mutex here."❌ Bad: "Why didn't you use X pattern?"✅ Good: "Have you considered the Repository pattern? It wouldmake this easier to test. Here's an example: [link]"❌ Bad: "Rename this variable."✅ Good: "[nit] Consider userCount instead of uc forclarity. Not blocking if you prefer to keep it."
```
```
❌ Bad: "This is wrong."✅ Good: "This could cause a race condition when multiple usersaccess simultaneously. Consider using a mutex here."❌ Bad: "Why didn't you use X pattern?"✅ Good: "Have you considered the Repository pattern? It wouldmake this easier to test. Here's an example: [link]"❌ Bad: "Rename this variable."✅ Good: "[nit] Consider userCount instead of uc forclarity. Not blocking if you prefer to keep it."
```
```
userCount
```
```
uc
```
```
Before diving into code, understand:1. Read PR description and linked issue2. Check PR size (>400 lines? Ask to split)3. Review CI/CD status (tests passing?)4. Understand the business requirement5. Note any relevant architectural decisions
```
```
Before diving into code, understand:1. Read PR description and linked issue2. Check PR size (>400 lines? Ask to split)3. Review CI/CD status (tests passing?)4. Understand the business requirement5. Note any relevant architectural decisions
```
```
1. **Architecture & Design**   - Does the solution fit the problem?   - Are there simpler approaches?   - Is it consistent with existing patterns?   - Will it scale?2. **File Organization**   - Are new files in the right places?   - Is code grouped logically?   - Are there duplicate files?3. **Testing Strategy**   - Are there tests?   - Do tests cover edge cases?   - Are tests readable?
```
```
1. **Architecture & Design**   - Does the solution fit the problem?   - Are there simpler approaches?   - Is it consistent with existing patterns?   - Will it scale?2. **File Organization**   - Are new files in the right places?   - Is code grouped logically?   - Are there duplicate files?3. **Testing Strategy**   - Are there tests?   - Do tests cover edge cases?   - Are tests readable?
```
```
For each file:1. **Logic & Correctness**   - Edge cases handled?   - Off-by-one errors?   - Null/undefined checks?   - Race conditions?2. **Security**   - Input validation?   - SQL injection risks?   - XSS vulnerabilities?   - Sensitive data exposure?3. **Performance**   - N+1 queries?   - Unnecessary loops?   - Memory leaks?   - Blocking operations?4. **Maintainability**   - Clear variable names?   - Functions doing one thing?   - Complex code commented?   - Magic numbers extracted?
```
```
For each file:1. **Logic & Correctness**   - Edge cases handled?   - Off-by-one errors?   - Null/undefined checks?   - Race conditions?2. **Security**   - Input validation?   - SQL injection risks?   - XSS vulnerabilities?   - Sensitive data exposure?3. **Performance**   - N+1 queries?   - Unnecessary loops?   - Memory leaks?   - Blocking operations?4. **Maintainability**   - Clear variable names?   - Functions doing one thing?   - Complex code commented?   - Magic numbers extracted?
```
```
1. Summarize key concerns2. Highlight what you liked3. Make clear decision:   - ✅ Approve   - 💬 Comment (minor suggestions)   - 🔄 Request Changes (must address)4. Offer to pair if complex
```
```
1. Summarize key concerns2. Highlight what you liked3. Make clear decision:   - ✅ Approve   - 💬 Comment (minor suggestions)   - 🔄 Request Changes (must address)4. Offer to pair if complex
```
```
## Security Checklist- [ ] User input validated and sanitized- [ ] SQL queries use parameterization- [ ] Authentication/authorization checked- [ ] Secrets not hardcoded- [ ] Error messages don't leak info## Performance Checklist- [ ] No N+1 queries- [ ] Database queries indexed- [ ] Large lists paginated- [ ] Expensive operations cached- [ ] No blocking I/O in hot paths## Testing Checklist- [ ] Happy path tested- [ ] Edge cases covered- [ ] Error cases tested- [ ] Test names are descriptive- [ ] Tests are deterministic
```
```
## Security Checklist- [ ] User input validated and sanitized- [ ] SQL queries use parameterization- [ ] Authentication/authorization checked- [ ] Secrets not hardcoded- [ ] Error messages don't leak info## Performance Checklist- [ ] No N+1 queries- [ ] Database queries indexed- [ ] Large lists paginated- [ ] Expensive operations cached- [ ] No blocking I/O in hot paths## Testing Checklist- [ ] Happy path tested- [ ] Edge cases covered- [ ] Error cases tested- [ ] Test names are descriptive- [ ] Tests are deterministic
```
```
❌ "This will fail if the list is empty."✅ "What happens if items is an empty array?"❌ "You need error handling here."✅ "How should this behave if the API call fails?"❌ "This is inefficient."✅ "I see this loops through all users. Have we consideredthe performance impact with 100k users?"
```
```
❌ "This will fail if the list is empty."✅ "What happens if items is an empty array?"❌ "You need error handling here."✅ "How should this behave if the API call fails?"❌ "This is inefficient."✅ "I see this loops through all users. Have we consideredthe performance impact with 100k users?"
```
```
items
```
```
## Use Collaborative Language❌ "You must change this to use async/await"✅ "Suggestion: async/await might make this more readable:typescript    async function fetchUser(id: string) {        const user = await db.query('SELECT * FROM users WHERE id = ?', id);        return user;    }    What do you think?"❌ "Extract this into a function"✅ "This logic appears in 3 places. Would it make sense toextract it into a shared utility function?"
```
```
## Use Collaborative Language❌ "You must change this to use async/await"✅ "Suggestion: async/await might make this more readable:typescript    async function fetchUser(id: string) {        const user = await db.query('SELECT * FROM users WHERE id = ?', id);        return user;    }    What do you think?"❌ "Extract this into a function"✅ "This logic appears in 3 places. Would it make sense toextract it into a shared utility function?"
```
```
## Use Collaborative Language❌ "You must change this to use async/await"✅ "Suggestion: async/await might make this more readable:
```
```
What do you think?"❌ "Extract this into a function"✅ "This logic appears in 3 places. Would it make sense toextract it into a shared utility function?"
```
```
Use labels to indicate priority:🔴 [blocking] - Must fix before merge🟡 [important] - Should fix, discuss if disagree🟢 [nit] - Nice to have, not blocking💡 [suggestion] - Alternative approach to consider📚 [learning] - Educational comment, no action needed🎉 [praise] - Good work, keep it up!Example:"🔴 [blocking] This SQL query is vulnerable to injection.Please use parameterized queries.""🟢 [nit] Consider renaming data to userData for clarity.""🎉 [praise] Excellent test coverage! This will catch edge cases."
```
```
Use labels to indicate priority:🔴 [blocking] - Must fix before merge🟡 [important] - Should fix, discuss if disagree🟢 [nit] - Nice to have, not blocking💡 [suggestion] - Alternative approach to consider📚 [learning] - Educational comment, no action needed🎉 [praise] - Good work, keep it up!Example:"🔴 [blocking] This SQL query is vulnerable to injection.Please use parameterized queries.""🟢 [nit] Consider renaming data to userData for clarity.""🎉 [praise] Excellent test coverage! This will catch edge cases."
```
```
data
```
```
userData
```
```
# Check for Python-specific issues# ❌ Mutable default argumentsdef add_item(item, items=[]):  # Bug! Shared across calls    items.append(item)    return items# ✅ Use None as defaultdef add_item(item, items=None):    if items is None:        items = []    items.append(item)    return items# ❌ Catching too broadtry:    result = risky_operation()except:  # Catches everything, even KeyboardInterrupt!    pass# ✅ Catch specific exceptionstry:    result = risky_operation()except ValueError as e:    logger.error(f"Invalid value: {e}")    raise# ❌ Using mutable class attributesclass User:    permissions = []  # Shared across all instances!# ✅ Initialize in __init__class User:    def __init__(self):        self.permissions = []
```
```
# Check for Python-specific issues# ❌ Mutable default argumentsdef add_item(item, items=[]):  # Bug! Shared across calls    items.append(item)    return items# ✅ Use None as defaultdef add_item(item, items=None):    if items is None:        items = []    items.append(item)    return items# ❌ Catching too broadtry:    result = risky_operation()except:  # Catches everything, even KeyboardInterrupt!    pass# ✅ Catch specific exceptionstry:    result = risky_operation()except ValueError as e:    logger.error(f"Invalid value: {e}")    raise# ❌ Using mutable class attributesclass User:    permissions = []  # Shared across all instances!# ✅ Initialize in __init__class User:    def __init__(self):        self.permissions = []
```
```
// Check for TypeScript-specific issues// ❌ Using any defeats type safetyfunction processData(data: any) {  // Avoid any    return data.value;}// ✅ Use proper typesinterface DataPayload {    value: string;}function processData(data: DataPayload) {    return data.value;}// ❌ Not handling async errorsasync function fetchUser(id: string) {    const response = await fetch(/api/users/${id});    return response.json();  // What if network fails?}// ✅ Handle errors properlyasync function fetchUser(id: string): Promise<User> {    try {        const response = await fetch(/api/users/${id});        if (!response.ok) {            throw new Error(HTTP ${response.status});        }        return await response.json();    } catch (error) {        console.error('Failed to fetch user:', error);        throw error;    }}// ❌ Mutation of propsfunction UserProfile({ user }: Props) {    user.lastViewed = new Date();  // Mutating prop!    return <div>{user.name}</div>;}// ✅ Don't mutate propsfunction UserProfile({ user, onView }: Props) {    useEffect(() => {        onView(user.id);  // Notify parent to update    }, [user.id]);    return <div>{user.name}</div>;}
```
```
// Check for TypeScript-specific issues// ❌ Using any defeats type safetyfunction processData(data: any) {  // Avoid any    return data.value;}// ✅ Use proper typesinterface DataPayload {    value: string;}function processData(data: DataPayload) {    return data.value;}// ❌ Not handling async errorsasync function fetchUser(id: string) {    const response = await fetch(/api/users/${id});    return response.json();  // What if network fails?}// ✅ Handle errors properlyasync function fetchUser(id: string): Promise<User> {    try {        const response = await fetch(/api/users/${id});        if (!response.ok) {            throw new Error(HTTP ${response.status});        }        return await response.json();    } catch (error) {        console.error('Failed to fetch user:', error);        throw error;    }}// ❌ Mutation of propsfunction UserProfile({ user }: Props) {    user.lastViewed = new Date();  // Mutating prop!    return <div>{user.name}</div>;}// ✅ Don't mutate propsfunction UserProfile({ user, onView }: Props) {    useEffect(() => {        onView(user.id);  // Notify parent to update    }, [user.id]);    return <div>{user.name}</div>;}
```
```
/api/users/${id}
```
```
/api/users/${id}
```
```
HTTP ${response.status}
```
```
When reviewing significant changes:1. **Design Document First**   - For large features, request design doc before code   - Review design with team before implementation   - Agree on approach to avoid rework2. **Review in Stages**   - First PR: Core abstractions and interfaces   - Second PR: Implementation   - Third PR: Integration and tests   - Easier to review, faster to iterate3. **Consider Alternatives**   - "Have we considered using [pattern/library]?"   - "What's the tradeoff vs. the simpler approach?"   - "How will this evolve as requirements change?"
```
```
When reviewing significant changes:1. **Design Document First**   - For large features, request design doc before code   - Review design with team before implementation   - Agree on approach to avoid rework2. **Review in Stages**   - First PR: Core abstractions and interfaces   - Second PR: Implementation   - Third PR: Integration and tests   - Easier to review, faster to iterate3. **Consider Alternatives**   - "Have we considered using [pattern/library]?"   - "What's the tradeoff vs. the simpler approach?"   - "How will this evolve as requirements change?"
```
```
// ❌ Poor test: Implementation detail testingtest('increments counter variable', () => {    const component = render(<Counter />);    const button = component.getByRole('button');    fireEvent.click(button);    expect(component.state.counter).toBe(1);  // Testing internal state});// ✅ Good test: Behavior testingtest('displays incremented count when clicked', () => {    render(<Counter />);    const button = screen.getByRole('button', { name: /increment/i });    fireEvent.click(button);    expect(screen.getByText('Count: 1')).toBeInTheDocument();});// Review questions for tests:// - Do tests describe behavior, not implementation?// - Are test names clear and descriptive?// - Do tests cover edge cases?// - Are tests independent (no shared state)?// - Can tests run in any order?
```
```
// ❌ Poor test: Implementation detail testingtest('increments counter variable', () => {    const component = render(<Counter />);    const button = component.getByRole('button');    fireEvent.click(button);    expect(component.state.counter).toBe(1);  // Testing internal state});// ✅ Good test: Behavior testingtest('displays incremented count when clicked', () => {    render(<Counter />);    const button = screen.getByRole('button', { name: /increment/i });    fireEvent.click(button);    expect(screen.getByText('Count: 1')).toBeInTheDocument();});// Review questions for tests:// - Do tests describe behavior, not implementation?// - Are test names clear and descriptive?// - Do tests cover edge cases?// - Are tests independent (no shared state)?// - Can tests run in any order?
```
```
## Security Review Checklist### Authentication & Authorization- [ ] Is authentication required where needed?- [ ] Are authorization checks before every action?- [ ] Is JWT validation proper (signature, expiry)?- [ ] Are API keys/secrets properly secured?### Input Validation- [ ] All user inputs validated?- [ ] File uploads restricted (size, type)?- [ ] SQL queries parameterized?- [ ] XSS protection (escape output)?### Data Protection- [ ] Passwords hashed (bcrypt/argon2)?- [ ] Sensitive data encrypted at rest?- [ ] HTTPS enforced for sensitive data?- [ ] PII handled according to regulations?### Common Vulnerabilities- [ ] No eval() or similar dynamic execution?- [ ] No hardcoded secrets?- [ ] CSRF protection for state-changing operations?- [ ] Rate limiting on public endpoints?
```
```
## Security Review Checklist### Authentication & Authorization- [ ] Is authentication required where needed?- [ ] Are authorization checks before every action?- [ ] Is JWT validation proper (signature, expiry)?- [ ] Are API keys/secrets properly secured?### Input Validation- [ ] All user inputs validated?- [ ] File uploads restricted (size, type)?- [ ] SQL queries parameterized?- [ ] XSS protection (escape output)?### Data Protection- [ ] Passwords hashed (bcrypt/argon2)?- [ ] Sensitive data encrypted at rest?- [ ] HTTPS enforced for sensitive data?- [ ] PII handled according to regulations?### Common Vulnerabilities- [ ] No eval() or similar dynamic execution?- [ ] No hardcoded secrets?- [ ] CSRF protection for state-changing operations?- [ ] Rate limiting on public endpoints?
```
```
Traditional: Praise + Criticism + Praise (feels fake)Better: Context + Specific Issue + Helpful SolutionExample:"I noticed the payment processing logic is inline in thecontroller. This makes it harder to test and reuse.[Specific Issue]The calculateTotal() function mixes tax calculation,discount logic, and database queries, making it difficultto unit test and reason about.[Helpful Solution]Could we extract this into a PaymentService class? Thatwould make it testable and reusable. I can pair with youon this if helpful."
```
```
Traditional: Praise + Criticism + Praise (feels fake)Better: Context + Specific Issue + Helpful SolutionExample:"I noticed the payment processing logic is inline in thecontroller. This makes it harder to test and reuse.[Specific Issue]The calculateTotal() function mixes tax calculation,discount logic, and database queries, making it difficultto unit test and reason about.[Helpful Solution]Could we extract this into a PaymentService class? Thatwould make it testable and reusable. I can pair with youon this if helpful."
```
```
When author disagrees with your feedback:1. **Seek to Understand**   "Help me understand your approach. What led you to   choose this pattern?"2. **Acknowledge Valid Points**   "That's a good point about X. I hadn't considered that."3. **Provide Data**   "I'm concerned about performance. Can we add a benchmark   to validate the approach?"4. **Escalate if Needed**   "Let's get [architect/senior dev] to weigh in on this."5. **Know When to Let Go**   If it's working and not a critical issue, approve it.   Perfection is the enemy of progress.
```
```
When author disagrees with your feedback:1. **Seek to Understand**   "Help me understand your approach. What led you to   choose this pattern?"2. **Acknowledge Valid Points**   "That's a good point about X. I hadn't considered that."3. **Provide Data**   "I'm concerned about performance. Can we add a benchmark   to validate the approach?"4. **Escalate if Needed**   "Let's get [architect/senior dev] to weigh in on this."5. **Know When to Let Go**   If it's working and not a critical issue, approve it.   Perfection is the enemy of progress.
```
```
## Summary[Brief overview of what was reviewed]## Strengths- [What was done well]- [Good patterns or approaches]## Required Changes🔴 [Blocking issue 1]🔴 [Blocking issue 2]## Suggestions💡 [Improvement 1]💡 [Improvement 2]## Questions❓ [Clarification needed on X]❓ [Alternative approach consideration]## Verdict✅ Approve after addressing required changes
```
```
## Summary[Brief overview of what was reviewed]## Strengths- [What was done well]- [Good patterns or approaches]## Required Changes🔴 [Blocking issue 1]🔴 [Blocking issue 2]## Suggestions💡 [Improvement 1]💡 [Improvement 2]## Questions❓ [Clarification needed on X]❓ [Alternative approach consideration]## Verdict✅ Approve after addressing required changes
```
Elevate your team's code quality and foster a culture of continuous improvement with the Code Review Excellence Agent Skill. This powerful tool guides you through best practices for conducting insightful and impactful code reviews. Move beyond simple bug catching to systematically enhance maintainability, share critical knowledge, and strengthen team dynamics. Whether you're a seasoned lead or a new contributor, leveraging this skill ensures every review contributes to a robust, high-performing codebase and a more collaborative development environment.

# When to Use This Skill
- •Reviewing pull requests and code changes efficiently and constructively.
- •Establishing clear, consistent code review standards for your development teams.
- •Mentoring junior developers by providing structured and educational feedback.
- •Conducting in-depth architecture reviews to ensure system integrity and future scalability.

# Pro Tips
- 💡**Prioritize Feedback**: Focus on critical issues (bugs, security, architecture) first, addressing minor suggestions or style preferences afterwards or via automated tools.
- 💡**Frame Feedback as Questions**: Instead of declarative statements like 'This is wrong,' ask 'Have you considered X?' or 'What happens if Y occurs?' to encourage critical thinking and learning.
- 💡**Balance Praise and Critique**: Always acknowledge good solutions, well-written sections, or effective problem-solving to maintain morale and reinforce positive coding habits.

