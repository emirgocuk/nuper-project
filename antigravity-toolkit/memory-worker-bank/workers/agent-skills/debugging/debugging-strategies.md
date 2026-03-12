# debugging-strategies
Source: https://antigravity.codes/agent-skills/debugging/debugging-strategies

## AI Worker Instructions
When the user requests functionality related to debugging-strategies, follow these guidelines and utilize this context.

## Scraped Content

# debugging-strategies
```
## Reproduction Checklist1. **Can you reproduce it?**   - Always? Sometimes? Randomly?   - Specific conditions needed?   - Can others reproduce it?2. **Create minimal reproduction**   - Simplify to smallest example   - Remove unrelated code   - Isolate the problem3. **Document steps**   - Write down exact steps   - Note environment details   - Capture error messages
```
```
## Reproduction Checklist1. **Can you reproduce it?**   - Always? Sometimes? Randomly?   - Specific conditions needed?   - Can others reproduce it?2. **Create minimal reproduction**   - Simplify to smallest example   - Remove unrelated code   - Isolate the problem3. **Document steps**   - Write down exact steps   - Note environment details   - Capture error messages
```
```
## Information Collection1. **Error Messages**   - Full stack trace   - Error codes   - Console/log output2. **Environment**   - OS version   - Language/runtime version   - Dependencies versions   - Environment variables3. **Recent Changes**   - Git history   - Deployment timeline   - Configuration changes4. **Scope**   - Affects all users or specific ones?   - All browsers or specific ones?   - Production only or also dev?
```
```
## Information Collection1. **Error Messages**   - Full stack trace   - Error codes   - Console/log output2. **Environment**   - OS version   - Language/runtime version   - Dependencies versions   - Environment variables3. **Recent Changes**   - Git history   - Deployment timeline   - Configuration changes4. **Scope**   - Affects all users or specific ones?   - All browsers or specific ones?   - Production only or also dev?
```
```
## Hypothesis FormationBased on gathered info, ask:1. **What changed?**   - Recent code changes   - Dependency updates   - Infrastructure changes2. **What's different?**   - Working vs broken environment   - Working vs broken user   - Before vs after3. **Where could this fail?**   - Input validation   - Business logic   - Data layer   - External services
```
```
## Hypothesis FormationBased on gathered info, ask:1. **What changed?**   - Recent code changes   - Dependency updates   - Infrastructure changes2. **What's different?**   - Working vs broken environment   - Working vs broken user   - Before vs after3. **Where could this fail?**   - Input validation   - Business logic   - Data layer   - External services
```
```
## Testing Strategies1. **Binary Search**   - Comment out half the code   - Narrow down problematic section   - Repeat until found2. **Add Logging**   - Strategic console.log/print   - Track variable values   - Trace execution flow3. **Isolate Components**   - Test each piece separately   - Mock dependencies   - Remove complexity4. **Compare Working vs Broken**   - Diff configurations   - Diff environments   - Diff data
```
```
## Testing Strategies1. **Binary Search**   - Comment out half the code   - Narrow down problematic section   - Repeat until found2. **Add Logging**   - Strategic console.log/print   - Track variable values   - Trace execution flow3. **Isolate Components**   - Test each piece separately   - Mock dependencies   - Remove complexity4. **Compare Working vs Broken**   - Diff configurations   - Diff environments   - Diff data
```
```
// Chrome DevTools Debuggerfunction processOrder(order: Order) {  debugger; // Execution pauses here  const total = calculateTotal(order);  console.log("Total:", total);  // Conditional breakpoint  if (order.items.length > 10) {    debugger; // Only breaks if condition true  }  return total;}// Console debugging techniquesconsole.log("Value:", value); // Basicconsole.table(arrayOfObjects); // Table formatconsole.time("operation");/* code */ console.timeEnd("operation"); // Timingconsole.trace(); // Stack traceconsole.assert(value > 0, "Value must be positive"); // Assertion// Performance profilingperformance.mark("start-operation");// ... operation codeperformance.mark("end-operation");performance.measure("operation", "start-operation", "end-operation");console.log(performance.getEntriesByType("measure"));
```
```
// Chrome DevTools Debuggerfunction processOrder(order: Order) {  debugger; // Execution pauses here  const total = calculateTotal(order);  console.log("Total:", total);  // Conditional breakpoint  if (order.items.length > 10) {    debugger; // Only breaks if condition true  }  return total;}// Console debugging techniquesconsole.log("Value:", value); // Basicconsole.table(arrayOfObjects); // Table formatconsole.time("operation");/* code */ console.timeEnd("operation"); // Timingconsole.trace(); // Stack traceconsole.assert(value > 0, "Value must be positive"); // Assertion// Performance profilingperformance.mark("start-operation");// ... operation codeperformance.mark("end-operation");performance.measure("operation", "start-operation", "end-operation");console.log(performance.getEntriesByType("measure"));
```
```
// .vscode/launch.json{  "version": "0.2.0",  "configurations": [    {      "type": "node",      "request": "launch",      "name": "Debug Program",      "program": "${workspaceFolder}/src/index.ts",      "preLaunchTask": "tsc: build - tsconfig.json",      "outFiles": ["${workspaceFolder}/dist/**/*.js"],      "skipFiles": ["<node_internals>/**"]    },    {      "type": "node",      "request": "launch",      "name": "Debug Tests",      "program": "${workspaceFolder}/node_modules/jest/bin/jest",      "args": ["--runInBand", "--no-cache"],      "console": "integratedTerminal"    }  ]}
```
```
// .vscode/launch.json{  "version": "0.2.0",  "configurations": [    {      "type": "node",      "request": "launch",      "name": "Debug Program",      "program": "${workspaceFolder}/src/index.ts",      "preLaunchTask": "tsc: build - tsconfig.json",      "outFiles": ["${workspaceFolder}/dist/**/*.js"],      "skipFiles": ["<node_internals>/**"]    },    {      "type": "node",      "request": "launch",      "name": "Debug Tests",      "program": "${workspaceFolder}/node_modules/jest/bin/jest",      "args": ["--runInBand", "--no-cache"],      "console": "integratedTerminal"    }  ]}
```
```
# Built-in debugger (pdb)import pdbdef calculate_total(items):    total = 0    pdb.set_trace()  # Debugger starts here    for item in items:        total += item.price * item.quantity    return total# Breakpoint (Python 3.7+)def process_order(order):    breakpoint()  # More convenient than pdb.set_trace()    # ... code# Post-mortem debuggingtry:    risky_operation()except Exception:    import pdb    pdb.post_mortem()  # Debug at exception point# IPython debugging (ipdb)from ipdb import set_traceset_trace()  # Better interface than pdb# Logging for debuggingimport logginglogging.basicConfig(level=logging.DEBUG)logger = logging.getLogger(__name__)def fetch_user(user_id):    logger.debug(f'Fetching user: {user_id}')    user = db.query(User).get(user_id)    logger.debug(f'Found user: {user}')    return user# Profile performanceimport cProfileimport pstatscProfile.run('slow_function()', 'profile_stats')stats = pstats.Stats('profile_stats')stats.sort_stats('cumulative')stats.print_stats(10)  # Top 10 slowest
```
```
# Built-in debugger (pdb)import pdbdef calculate_total(items):    total = 0    pdb.set_trace()  # Debugger starts here    for item in items:        total += item.price * item.quantity    return total# Breakpoint (Python 3.7+)def process_order(order):    breakpoint()  # More convenient than pdb.set_trace()    # ... code# Post-mortem debuggingtry:    risky_operation()except Exception:    import pdb    pdb.post_mortem()  # Debug at exception point# IPython debugging (ipdb)from ipdb import set_traceset_trace()  # Better interface than pdb# Logging for debuggingimport logginglogging.basicConfig(level=logging.DEBUG)logger = logging.getLogger(__name__)def fetch_user(user_id):    logger.debug(f'Fetching user: {user_id}')    user = db.query(User).get(user_id)    logger.debug(f'Found user: {user}')    return user# Profile performanceimport cProfileimport pstatscProfile.run('slow_function()', 'profile_stats')stats = pstats.Stats('profile_stats')stats.sort_stats('cumulative')stats.print_stats(10)  # Top 10 slowest
```
```
// Delve debugger// Install: go install github.com/go-delve/delve/cmd/dlv@latest// Run: dlv debug main.goimport (    "fmt"    "runtime"    "runtime/debug")// Print stack tracefunc debugStack() {    debug.PrintStack()}// Panic recovery with debuggingfunc processRequest() {    defer func() {        if r := recover(); r != nil {            fmt.Println("Panic:", r)            debug.PrintStack()        }    }()    // ... code that might panic}// Memory profilingimport _ "net/http/pprof"// Visit http://localhost:6060/debug/pprof/// CPU profilingimport (    "os"    "runtime/pprof")f, _ := os.Create("cpu.prof")pprof.StartCPUProfile(f)defer pprof.StopCPUProfile()// ... code to profile
```
```
// Delve debugger// Install: go install github.com/go-delve/delve/cmd/dlv@latest// Run: dlv debug main.goimport (    "fmt"    "runtime"    "runtime/debug")// Print stack tracefunc debugStack() {    debug.PrintStack()}// Panic recovery with debuggingfunc processRequest() {    defer func() {        if r := recover(); r != nil {            fmt.Println("Panic:", r)            debug.PrintStack()        }    }()    // ... code that might panic}// Memory profilingimport _ "net/http/pprof"// Visit http://localhost:6060/debug/pprof/// CPU profilingimport (    "os"    "runtime/pprof")f, _ := os.Create("cpu.prof")pprof.StartCPUProfile(f)defer pprof.StopCPUProfile()// ... code to profile
```
```
# Git bisect for finding regressiongit bisect startgit bisect bad                    # Current commit is badgit bisect good v1.0.0            # v1.0.0 was good# Git checks out middle commit# Test it, then:git bisect good   # if it worksgit bisect bad    # if it's broken# Continue until bug foundgit bisect reset  # when done
```
```
# Git bisect for finding regressiongit bisect startgit bisect bad                    # Current commit is badgit bisect good v1.0.0            # v1.0.0 was good# Git checks out middle commit# Test it, then:git bisect good   # if it worksgit bisect bad    # if it's broken# Continue until bug foundgit bisect reset  # when done
```
```
## What's Different?| Aspect       | Working     | Broken         || ------------ | ----------- | -------------- || Environment  | Development | Production     || Node version | 18.16.0     | 18.15.0        || Data         | Empty DB    | 1M records     || User         | Admin       | Regular user   || Browser      | Chrome      | Safari         || Time         | During day  | After midnight |Hypothesis: Time-based issue? Check timezone handling.
```
```
## What's Different?| Aspect       | Working     | Broken         || ------------ | ----------- | -------------- || Environment  | Development | Production     || Node version | 18.16.0     | 18.15.0        || Data         | Empty DB    | 1M records     || User         | Admin       | Regular user   || Browser      | Chrome      | Safari         || Time         | During day  | After midnight |Hypothesis: Time-based issue? Check timezone handling.
```
```
// Function call tracingfunction trace(  target: any,  propertyKey: string,  descriptor: PropertyDescriptor,) {  const originalMethod = descriptor.value;  descriptor.value = function (...args: any[]) {    console.log(Calling ${propertyKey} with args:, args);    const result = originalMethod.apply(this, args);    console.log(${propertyKey} returned:, result);    return result;  };  return descriptor;}class OrderService {  @trace  calculateTotal(items: Item[]): number {    return items.reduce((sum, item) => sum + item.price, 0);  }}
```
```
// Function call tracingfunction trace(  target: any,  propertyKey: string,  descriptor: PropertyDescriptor,) {  const originalMethod = descriptor.value;  descriptor.value = function (...args: any[]) {    console.log(Calling ${propertyKey} with args:, args);    const result = originalMethod.apply(this, args);    console.log(${propertyKey} returned:, result);    return result;  };  return descriptor;}class OrderService {  @trace  calculateTotal(items: Item[]): number {    return items.reduce((sum, item) => sum + item.price, 0);  }}
```
```
Calling ${propertyKey} with args:
```
```
${propertyKey} returned:
```
```
// Chrome DevTools Memory Profiler// 1. Take heap snapshot// 2. Perform action// 3. Take another snapshot// 4. Compare snapshots// Node.js memory debuggingif (process.memoryUsage().heapUsed > 500 * 1024 * 1024) {  console.warn("High memory usage:", process.memoryUsage());  // Generate heap dump  require("v8").writeHeapSnapshot();}// Find memory leaks in testslet beforeMemory: number;beforeEach(() => {  beforeMemory = process.memoryUsage().heapUsed;});afterEach(() => {  const afterMemory = process.memoryUsage().heapUsed;  const diff = afterMemory - beforeMemory;  if (diff > 10 * 1024 * 1024) {    // 10MB threshold    console.warn(Possible memory leak: ${diff / 1024 / 1024}MB);  }});
```
```
// Chrome DevTools Memory Profiler// 1. Take heap snapshot// 2. Perform action// 3. Take another snapshot// 4. Compare snapshots// Node.js memory debuggingif (process.memoryUsage().heapUsed > 500 * 1024 * 1024) {  console.warn("High memory usage:", process.memoryUsage());  // Generate heap dump  require("v8").writeHeapSnapshot();}// Find memory leaks in testslet beforeMemory: number;beforeEach(() => {  beforeMemory = process.memoryUsage().heapUsed;});afterEach(() => {  const afterMemory = process.memoryUsage().heapUsed;  const diff = afterMemory - beforeMemory;  if (diff > 10 * 1024 * 1024) {    // 10MB threshold    console.warn(Possible memory leak: ${diff / 1024 / 1024}MB);  }});
```
```
Possible memory leak: ${diff / 1024 / 1024}MB
```
```
## Strategies for Flaky Bugs1. **Add extensive logging**   - Log timing information   - Log all state transitions   - Log external interactions2. **Look for race conditions**   - Concurrent access to shared state   - Async operations completing out of order   - Missing synchronization3. **Check timing dependencies**   - setTimeout/setInterval   - Promise resolution order   - Animation frame timing4. **Stress test**   - Run many times   - Vary timing   - Simulate load
```
```
## Strategies for Flaky Bugs1. **Add extensive logging**   - Log timing information   - Log all state transitions   - Log external interactions2. **Look for race conditions**   - Concurrent access to shared state   - Async operations completing out of order   - Missing synchronization3. **Check timing dependencies**   - setTimeout/setInterval   - Promise resolution order   - Animation frame timing4. **Stress test**   - Run many times   - Vary timing   - Simulate load
```
```
## Performance Debugging1. **Profile first**   - Don't optimize blindly   - Measure before and after   - Find bottlenecks2. **Common culprits**   - N+1 queries   - Unnecessary re-renders   - Large data processing   - Synchronous I/O3. **Tools**   - Browser DevTools Performance tab   - Lighthouse   - Python: cProfile, line_profiler   - Node: clinic.js, 0x
```
```
## Performance Debugging1. **Profile first**   - Don't optimize blindly   - Measure before and after   - Find bottlenecks2. **Common culprits**   - N+1 queries   - Unnecessary re-renders   - Large data processing   - Synchronous I/O3. **Tools**   - Browser DevTools Performance tab   - Lighthouse   - Python: cProfile, line_profiler   - Node: clinic.js, 0x
```
```
## Production Debugging1. **Gather evidence**   - Error tracking (Sentry, Bugsnag)   - Application logs   - User reports   - Metrics/monitoring2. **Reproduce locally**   - Use production data (anonymized)   - Match environment   - Follow exact steps3. **Safe investigation**   - Don't change production   - Use feature flags   - Add monitoring/logging   - Test fixes in staging
```
```
## Production Debugging1. **Gather evidence**   - Error tracking (Sentry, Bugsnag)   - Application logs   - User reports   - Metrics/monitoring2. **Reproduce locally**   - Use production data (anonymized)   - Match environment   - Follow exact steps3. **Safe investigation**   - Don't change production   - Use feature flags   - Add monitoring/logging   - Test fixes in staging
```
```
## When Stuck, Check:- [ ] Spelling errors (typos in variable names)- [ ] Case sensitivity (fileName vs filename)- [ ] Null/undefined values- [ ] Array index off-by-one- [ ] Async timing (race conditions)- [ ] Scope issues (closure, hoisting)- [ ] Type mismatches- [ ] Missing dependencies- [ ] Environment variables- [ ] File paths (absolute vs relative)- [ ] Cache issues (clear cache)- [ ] Stale data (refresh database)
```
```
## When Stuck, Check:- [ ] Spelling errors (typos in variable names)- [ ] Case sensitivity (fileName vs filename)- [ ] Null/undefined values- [ ] Array index off-by-one- [ ] Async timing (race conditions)- [ ] Scope issues (closure, hoisting)- [ ] Type mismatches- [ ] Missing dependencies- [ ] Environment variables- [ ] File paths (absolute vs relative)- [ ] Cache issues (clear cache)- [ ] Stale data (refresh database)
```
Elevate your troubleshooting game from guesswork to a precise science. This agent skill equips you with a comprehensive toolkit for systematically approaching and resolving even the most stubborn bugs. From understanding fundamental debugging principles like the scientific method and mindset, to leveraging powerful profiling tools, you'll gain the confidence to diagnose and fix issues across diverse codebases. Say goodbye to endless hours of frustration and hello to efficient, methodical problem-solving, transforming you into a more effective and indispensable developer. Master the art of debugging and ensure your applications run flawlessly.

# When to Use This Skill
- •Diagnosing an intermittent bug in a production environment.
- •Optimizing application performance by identifying bottlenecks with profiling tools.
- •Understanding unexpected behavior in an unfamiliar third-party library.
- •Analyzing a crash dump to determine the root cause of an application failure.

# Pro Tips
- 💡Always start by trying to consistently reproduce the bug in the simplest possible scenario before diving into code.
- 💡When stuck, revert to the smallest working state, then reintroduce changes one by one to pinpoint the exact line or commit that introduced the issue.
- 💡Document your observations, hypotheses, and experiments rigorously. This not only helps you but also aids future team members in understanding complex issues.

