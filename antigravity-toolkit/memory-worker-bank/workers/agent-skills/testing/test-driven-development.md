# test-driven-development
Source: https://antigravity.codes/agent-skills/testing/test-driven-development

## AI Worker Instructions
When the user requests functionality related to test-driven-development, follow these guidelines and utilize this context.

## Scraped Content

# test-driven-development
```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```
```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```
```
digraph tdd_cycle {    rankdir=LR;    red [label="RED\nWrite failing test", shape=box, style=filled, fillcolor="#ffcccc"];    verify_red [label="Verify fails\ncorrectly", shape=diamond];    green [label="GREEN\nMinimal code", shape=box, style=filled, fillcolor="#ccffcc"];    verify_green [label="Verify passes\nAll green", shape=diamond];    refactor [label="REFACTOR\nClean up", shape=box, style=filled, fillcolor="#ccccff"];    next [label="Next", shape=ellipse];    red -> verify_red;    verify_red -> green [label="yes"];    verify_red -> red [label="wrong\nfailure"];    green -> verify_green;    verify_green -> refactor [label="yes"];    verify_green -> green [label="no"];    refactor -> verify_green [label="stay\ngreen"];    verify_green -> next;    next -> red;}
```
```
digraph tdd_cycle {    rankdir=LR;    red [label="RED\nWrite failing test", shape=box, style=filled, fillcolor="#ffcccc"];    verify_red [label="Verify fails\ncorrectly", shape=diamond];    green [label="GREEN\nMinimal code", shape=box, style=filled, fillcolor="#ccffcc"];    verify_green [label="Verify passes\nAll green", shape=diamond];    refactor [label="REFACTOR\nClean up", shape=box, style=filled, fillcolor="#ccccff"];    next [label="Next", shape=ellipse];    red -> verify_red;    verify_red -> green [label="yes"];    verify_red -> red [label="wrong\nfailure"];    green -> verify_green;    verify_green -> refactor [label="yes"];    verify_green -> green [label="no"];    refactor -> verify_green [label="stay\ngreen"];    verify_green -> next;    next -> red;}
```
```
test('retries failed operations 3 times', async () => {  let attempts = 0;  const operation = () => {    attempts++;    if (attempts < 3) throw new Error('fail');    return 'success';  };  const result = await retryOperation(operation);  expect(result).toBe('success');  expect(attempts).toBe(3);});
```
```
test('retries failed operations 3 times', async () => {  let attempts = 0;  const operation = () => {    attempts++;    if (attempts < 3) throw new Error('fail');    return 'success';  };  const result = await retryOperation(operation);  expect(result).toBe('success');  expect(attempts).toBe(3);});
```
```
test('retry works', async () => {  const mock = jest.fn()    .mockRejectedValueOnce(new Error())    .mockRejectedValueOnce(new Error())    .mockResolvedValueOnce('success');  await retryOperation(mock);  expect(mock).toHaveBeenCalledTimes(3);});
```
```
test('retry works', async () => {  const mock = jest.fn()    .mockRejectedValueOnce(new Error())    .mockRejectedValueOnce(new Error())    .mockResolvedValueOnce('success');  await retryOperation(mock);  expect(mock).toHaveBeenCalledTimes(3);});
```
```
npm test path/to/test.test.ts
```
```
npm test path/to/test.test.ts
```
```
async function retryOperation<T>(fn: () => Promise<T>): Promise<T> {  for (let i = 0; i < 3; i++) {    try {      return await fn();    } catch (e) {      if (i === 2) throw e;    }  }  throw new Error('unreachable');}
```
```
async function retryOperation<T>(fn: () => Promise<T>): Promise<T> {  for (let i = 0; i < 3; i++) {    try {      return await fn();    } catch (e) {      if (i === 2) throw e;    }  }  throw new Error('unreachable');}
```
```
async function retryOperation<T>(  fn: () => Promise<T>,  options?: {    maxRetries?: number;    backoff?: 'linear' | 'exponential';    onRetry?: (attempt: number) => void;  }): Promise<T> {  // YAGNI}
```
```
async function retryOperation<T>(  fn: () => Promise<T>,  options?: {    maxRetries?: number;    backoff?: 'linear' | 'exponential';    onRetry?: (attempt: number) => void;  }): Promise<T> {  // YAGNI}
```
```
npm test path/to/test.test.ts
```
```
npm test path/to/test.test.ts
```
```
test('validates email and domain and whitespace')
```
```
test('test1')
```
```
test('rejects empty email', async () => {  const result = await submitForm({ email: '' });  expect(result.error).toBe('Email required');});
```
```
test('rejects empty email', async () => {  const result = await submitForm({ email: '' });  expect(result.error).toBe('Email required');});
```
```
$ npm testFAIL: expected 'Email required', got undefined
```
```
$ npm testFAIL: expected 'Email required', got undefined
```
```
function submitForm(data: FormData) {  if (!data.email?.trim()) {    return { error: 'Email required' };  }  // ...}
```
```
function submitForm(data: FormData) {  if (!data.email?.trim()) {    return { error: 'Email required' };  }  // ...}
```
```
$ npm testPASS
```
```
$ npm testPASS
```
```
Production code → test exists and failed firstOtherwise → not TDD
```
```
Production code → test exists and failed firstOtherwise → not TDD
```
Leverage the power of Test-Driven Development (TDD) with this specialized AI agent skill. TDD transforms the coding process into a structured, quality-first approach, ensuring that every piece of code serves a verified purpose. By guiding the AI to write failing tests *before* implementation, this skill instills a discipline that minimizes bugs, clarifies requirements, and fosters a robust, maintainable codebase. It's not just about finding errors; it's about proactively designing for correctness and understanding the intended behavior, empowering the agent to build highly reliable software components efficiently and effectively.

# When to Use This Skill
- •Implementing new features to ensure all intended behaviors are covered and verified.
- •Addressing and preventing regressions during bug fixes by first writing tests that expose the bug.
- •Refactoring existing code while preserving functionality, using tests as a safety net.
- •Developing new behaviors or modifying existing ones in a controlled, verifiable manner.

# Pro Tips
- 💡Always break down complex features into the smallest possible testable units to maintain a fast and effective Red-Green-Refactor cycle.
- 💡Utilize the 'Iron Law' religiously: if production code exists without a preceding failing test, delete and restart with TDD for maximum discipline and clarity.
- 💡After achieving green, dedicate sufficient time to the 'Refactor' step to improve code design, readability, and performance, ensuring tests remain green throughout.

