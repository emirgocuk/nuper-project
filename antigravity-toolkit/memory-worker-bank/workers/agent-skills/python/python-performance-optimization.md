# python-performance-optimization
Source: https://antigravity.codes/agent-skills/python/python-performance-optimization

## AI Worker Instructions
When the user requests functionality related to python-performance-optimization, follow these guidelines and utilize this context.

## Scraped Content

# python-performance-optimization
```
import timedef measure_time():    """Simple timing measurement."""    start = time.time()    # Your code here    result = sum(range(1000000))    elapsed = time.time() - start    print(f"Execution time: {elapsed:.4f} seconds")    return result# Better: use timeit for accurate measurementsimport timeitexecution_time = timeit.timeit(    "sum(range(1000000))",    number=100)print(f"Average time: {execution_time/100:.6f} seconds")
```
```
import timedef measure_time():    """Simple timing measurement."""    start = time.time()    # Your code here    result = sum(range(1000000))    elapsed = time.time() - start    print(f"Execution time: {elapsed:.4f} seconds")    return result# Better: use timeit for accurate measurementsimport timeitexecution_time = timeit.timeit(    "sum(range(1000000))",    number=100)print(f"Average time: {execution_time/100:.6f} seconds")
```
```
import cProfileimport pstatsfrom pstats import SortKeydef slow_function():    """Function to profile."""    total = 0    for i in range(1000000):        total += i    return totaldef another_function():    """Another function."""    return [i**2 for i in range(100000)]def main():    """Main function to profile."""    result1 = slow_function()    result2 = another_function()    return result1, result2# Profile the codeif __name__ == "__main__":    profiler = cProfile.Profile()    profiler.enable()    main()    profiler.disable()    # Print stats    stats = pstats.Stats(profiler)    stats.sort_stats(SortKey.CUMULATIVE)    stats.print_stats(10)  # Top 10 functions    # Save to file for later analysis    stats.dump_stats("profile_output.prof")
```
```
import cProfileimport pstatsfrom pstats import SortKeydef slow_function():    """Function to profile."""    total = 0    for i in range(1000000):        total += i    return totaldef another_function():    """Another function."""    return [i**2 for i in range(100000)]def main():    """Main function to profile."""    result1 = slow_function()    result2 = another_function()    return result1, result2# Profile the codeif __name__ == "__main__":    profiler = cProfile.Profile()    profiler.enable()    main()    profiler.disable()    # Print stats    stats = pstats.Stats(profiler)    stats.sort_stats(SortKey.CUMULATIVE)    stats.print_stats(10)  # Top 10 functions    # Save to file for later analysis    stats.dump_stats("profile_output.prof")
```
```
# Profile a scriptpython -m cProfile -o output.prof script.py# View resultspython -m pstats output.prof# In pstats:# sort cumtime# stats 10
```
```
# Profile a scriptpython -m cProfile -o output.prof script.py# View resultspython -m pstats output.prof# In pstats:# sort cumtime# stats 10
```
```
# Install: pip install line-profiler# Add @profile decorator (line_profiler provides this)@profiledef process_data(data):    """Process data with line profiling."""    result = []    for item in data:        processed = item * 2        result.append(processed)    return result# Run with:# kernprof -l -v script.py
```
```
# Install: pip install line-profiler# Add @profile decorator (line_profiler provides this)@profiledef process_data(data):    """Process data with line profiling."""    result = []    for item in data:        processed = item * 2        result.append(processed)    return result# Run with:# kernprof -l -v script.py
```
```
from line_profiler import LineProfilerdef process_data(data):    """Function to profile."""    result = []    for item in data:        processed = item * 2        result.append(processed)    return resultif __name__ == "__main__":    lp = LineProfiler()    lp.add_function(process_data)    data = list(range(100000))    lp_wrapper = lp(process_data)    lp_wrapper(data)    lp.print_stats()
```
```
from line_profiler import LineProfilerdef process_data(data):    """Function to profile."""    result = []    for item in data:        processed = item * 2        result.append(processed)    return resultif __name__ == "__main__":    lp = LineProfiler()    lp.add_function(process_data)    data = list(range(100000))    lp_wrapper = lp(process_data)    lp_wrapper(data)    lp.print_stats()
```
```
# Install: pip install memory-profilerfrom memory_profiler import profile@profiledef memory_intensive():    """Function that uses lots of memory."""    # Create large list    big_list = [i for i in range(1000000)]    # Create large dict    big_dict = {i: i**2 for i in range(100000)}    # Process data    result = sum(big_list)    return resultif __name__ == "__main__":    memory_intensive()# Run with:# python -m memory_profiler script.py
```
```
# Install: pip install memory-profilerfrom memory_profiler import profile@profiledef memory_intensive():    """Function that uses lots of memory."""    # Create large list    big_list = [i for i in range(1000000)]    # Create large dict    big_dict = {i: i**2 for i in range(100000)}    # Process data    result = sum(big_list)    return resultif __name__ == "__main__":    memory_intensive()# Run with:# python -m memory_profiler script.py
```
```
# Install: pip install py-spy# Profile a running Python processpy-spy top --pid 12345# Generate flamegraphpy-spy record -o profile.svg --pid 12345# Profile a scriptpy-spy record -o profile.svg -- python script.py# Dump current call stackpy-spy dump --pid 12345
```
```
# Install: pip install py-spy# Profile a running Python processpy-spy top --pid 12345# Generate flamegraphpy-spy record -o profile.svg --pid 12345# Profile a scriptpy-spy record -o profile.svg -- python script.py# Dump current call stackpy-spy dump --pid 12345
```
```
import timeit# Slow: Traditional loopdef slow_squares(n):    """Create list of squares using loop."""    result = []    for i in range(n):        result.append(i**2)    return result# Fast: List comprehensiondef fast_squares(n):    """Create list of squares using comprehension."""    return [i**2 for i in range(n)]# Benchmarkn = 100000slow_time = timeit.timeit(lambda: slow_squares(n), number=100)fast_time = timeit.timeit(lambda: fast_squares(n), number=100)print(f"Loop: {slow_time:.4f}s")print(f"Comprehension: {fast_time:.4f}s")print(f"Speedup: {slow_time/fast_time:.2f}x")# Even faster for simple operations: mapdef faster_squares(n):    """Use map for even better performance."""    return list(map(lambda x: x**2, range(n)))
```
```
import timeit# Slow: Traditional loopdef slow_squares(n):    """Create list of squares using loop."""    result = []    for i in range(n):        result.append(i**2)    return result# Fast: List comprehensiondef fast_squares(n):    """Create list of squares using comprehension."""    return [i**2 for i in range(n)]# Benchmarkn = 100000slow_time = timeit.timeit(lambda: slow_squares(n), number=100)fast_time = timeit.timeit(lambda: fast_squares(n), number=100)print(f"Loop: {slow_time:.4f}s")print(f"Comprehension: {fast_time:.4f}s")print(f"Speedup: {slow_time/fast_time:.2f}x")# Even faster for simple operations: mapdef faster_squares(n):    """Use map for even better performance."""    return list(map(lambda x: x**2, range(n)))
```
```
import sysdef list_approach():    """Memory-intensive list."""    data = [i**2 for i in range(1000000)]    return sum(data)def generator_approach():    """Memory-efficient generator."""    data = (i**2 for i in range(1000000))    return sum(data)# Memory comparisonlist_data = [i for i in range(1000000)]gen_data = (i for i in range(1000000))print(f"List size: {sys.getsizeof(list_data)} bytes")print(f"Generator size: {sys.getsizeof(gen_data)} bytes")# Generators use constant memory regardless of size
```
```
import sysdef list_approach():    """Memory-intensive list."""    data = [i**2 for i in range(1000000)]    return sum(data)def generator_approach():    """Memory-efficient generator."""    data = (i**2 for i in range(1000000))    return sum(data)# Memory comparisonlist_data = [i for i in range(1000000)]gen_data = (i for i in range(1000000))print(f"List size: {sys.getsizeof(list_data)} bytes")print(f"Generator size: {sys.getsizeof(gen_data)} bytes")# Generators use constant memory regardless of size
```
```
import timeitdef slow_concat(items):    """Slow string concatenation."""    result = ""    for item in items:        result += str(item)    return resultdef fast_concat(items):    """Fast string concatenation with join."""    return "".join(str(item) for item in items)def faster_concat(items):    """Even faster with list."""    parts = [str(item) for item in items]    return "".join(parts)items = list(range(10000))# Benchmarkslow = timeit.timeit(lambda: slow_concat(items), number=100)fast = timeit.timeit(lambda: fast_concat(items), number=100)faster = timeit.timeit(lambda: faster_concat(items), number=100)print(f"Concatenation (+): {slow:.4f}s")print(f"Join (generator): {fast:.4f}s")print(f"Join (list): {faster:.4f}s")
```
```
import timeitdef slow_concat(items):    """Slow string concatenation."""    result = ""    for item in items:        result += str(item)    return resultdef fast_concat(items):    """Fast string concatenation with join."""    return "".join(str(item) for item in items)def faster_concat(items):    """Even faster with list."""    parts = [str(item) for item in items]    return "".join(parts)items = list(range(10000))# Benchmarkslow = timeit.timeit(lambda: slow_concat(items), number=100)fast = timeit.timeit(lambda: fast_concat(items), number=100)faster = timeit.timeit(lambda: faster_concat(items), number=100)print(f"Concatenation (+): {slow:.4f}s")print(f"Join (generator): {fast:.4f}s")print(f"Join (list): {faster:.4f}s")
```
```
import timeit# Create test datasize = 10000items = list(range(size))lookup_dict = {i: i for i in range(size)}def list_search(items, target):    """O(n) search in list."""    return target in itemsdef dict_search(lookup_dict, target):    """O(1) search in dict."""    return target in lookup_dicttarget = size - 1  # Worst case for list# Benchmarklist_time = timeit.timeit(    lambda: list_search(items, target),    number=1000)dict_time = timeit.timeit(    lambda: dict_search(lookup_dict, target),    number=1000)print(f"List search: {list_time:.6f}s")print(f"Dict search: {dict_time:.6f}s")print(f"Speedup: {list_time/dict_time:.0f}x")
```
```
import timeit# Create test datasize = 10000items = list(range(size))lookup_dict = {i: i for i in range(size)}def list_search(items, target):    """O(n) search in list."""    return target in itemsdef dict_search(lookup_dict, target):    """O(1) search in dict."""    return target in lookup_dicttarget = size - 1  # Worst case for list# Benchmarklist_time = timeit.timeit(    lambda: list_search(items, target),    number=1000)dict_time = timeit.timeit(    lambda: dict_search(lookup_dict, target),    number=1000)print(f"List search: {list_time:.6f}s")print(f"Dict search: {dict_time:.6f}s")print(f"Speedup: {list_time/dict_time:.0f}x")
```
```
import timeit# Global variable (slow)GLOBAL_VALUE = 100def use_global():    """Access global variable."""    total = 0    for i in range(10000):        total += GLOBAL_VALUE    return totaldef use_local():    """Use local variable."""    local_value = 100    total = 0    for i in range(10000):        total += local_value    return total# Local is fasterglobal_time = timeit.timeit(use_global, number=1000)local_time = timeit.timeit(use_local, number=1000)print(f"Global access: {global_time:.4f}s")print(f"Local access: {local_time:.4f}s")print(f"Speedup: {global_time/local_time:.2f}x")
```
```
import timeit# Global variable (slow)GLOBAL_VALUE = 100def use_global():    """Access global variable."""    total = 0    for i in range(10000):        total += GLOBAL_VALUE    return totaldef use_local():    """Use local variable."""    local_value = 100    total = 0    for i in range(10000):        total += local_value    return total# Local is fasterglobal_time = timeit.timeit(use_global, number=1000)local_time = timeit.timeit(use_local, number=1000)print(f"Global access: {global_time:.4f}s")print(f"Local access: {local_time:.4f}s")print(f"Speedup: {global_time/local_time:.2f}x")
```
```
import timeitdef calculate_inline():    """Inline calculation."""    total = 0    for i in range(10000):        total += i * 2 + 1    return totaldef helper_function(x):    """Helper function."""    return x * 2 + 1def calculate_with_function():    """Calculation with function calls."""    total = 0    for i in range(10000):        total += helper_function(i)    return total# Inline is faster due to no call overheadinline_time = timeit.timeit(calculate_inline, number=1000)function_time = timeit.timeit(calculate_with_function, number=1000)print(f"Inline: {inline_time:.4f}s")print(f"Function calls: {function_time:.4f}s")
```
```
import timeitdef calculate_inline():    """Inline calculation."""    total = 0    for i in range(10000):        total += i * 2 + 1    return totaldef helper_function(x):    """Helper function."""    return x * 2 + 1def calculate_with_function():    """Calculation with function calls."""    total = 0    for i in range(10000):        total += helper_function(i)    return total# Inline is faster due to no call overheadinline_time = timeit.timeit(calculate_inline, number=1000)function_time = timeit.timeit(calculate_with_function, number=1000)print(f"Inline: {inline_time:.4f}s")print(f"Function calls: {function_time:.4f}s")
```
```
import timeitimport numpy as npdef python_sum(n):    """Sum using pure Python."""    return sum(range(n))def numpy_sum(n):    """Sum using NumPy."""    return np.arange(n).sum()n = 1000000python_time = timeit.timeit(lambda: python_sum(n), number=100)numpy_time = timeit.timeit(lambda: numpy_sum(n), number=100)print(f"Python: {python_time:.4f}s")print(f"NumPy: {numpy_time:.4f}s")print(f"Speedup: {python_time/numpy_time:.2f}x")# Vectorized operationsdef python_multiply():    """Element-wise multiplication in Python."""    a = list(range(100000))    b = list(range(100000))    return [x * y for x, y in zip(a, b)]def numpy_multiply():    """Vectorized multiplication in NumPy."""    a = np.arange(100000)    b = np.arange(100000)    return a * bpy_time = timeit.timeit(python_multiply, number=100)np_time = timeit.timeit(numpy_multiply, number=100)print(f"\nPython multiply: {py_time:.4f}s")print(f"NumPy multiply: {np_time:.4f}s")print(f"Speedup: {py_time/np_time:.2f}x")
```
```
import timeitimport numpy as npdef python_sum(n):    """Sum using pure Python."""    return sum(range(n))def numpy_sum(n):    """Sum using NumPy."""    return np.arange(n).sum()n = 1000000python_time = timeit.timeit(lambda: python_sum(n), number=100)numpy_time = timeit.timeit(lambda: numpy_sum(n), number=100)print(f"Python: {python_time:.4f}s")print(f"NumPy: {numpy_time:.4f}s")print(f"Speedup: {python_time/numpy_time:.2f}x")# Vectorized operationsdef python_multiply():    """Element-wise multiplication in Python."""    a = list(range(100000))    b = list(range(100000))    return [x * y for x, y in zip(a, b)]def numpy_multiply():    """Vectorized multiplication in NumPy."""    a = np.arange(100000)    b = np.arange(100000)    return a * bpy_time = timeit.timeit(python_multiply, number=100)np_time = timeit.timeit(numpy_multiply, number=100)print(f"\nPython multiply: {py_time:.4f}s")print(f"NumPy multiply: {np_time:.4f}s")print(f"Speedup: {py_time/np_time:.2f}x")
```
```
from functools import lru_cacheimport timeitdef fibonacci_slow(n):    """Recursive fibonacci without caching."""    if n < 2:        return n    return fibonacci_slow(n-1) + fibonacci_slow(n-2)@lru_cache(maxsize=None)def fibonacci_fast(n):    """Recursive fibonacci with caching."""    if n < 2:        return n    return fibonacci_fast(n-1) + fibonacci_fast(n-2)# Massive speedup for recursive algorithmsn = 30slow_time = timeit.timeit(lambda: fibonacci_slow(n), number=1)fast_time = timeit.timeit(lambda: fibonacci_fast(n), number=1000)print(f"Without cache (1 run): {slow_time:.4f}s")print(f"With cache (1000 runs): {fast_time:.4f}s")# Cache infoprint(f"Cache info: {fibonacci_fast.cache_info()}")
```
```
from functools import lru_cacheimport timeitdef fibonacci_slow(n):    """Recursive fibonacci without caching."""    if n < 2:        return n    return fibonacci_slow(n-1) + fibonacci_slow(n-2)@lru_cache(maxsize=None)def fibonacci_fast(n):    """Recursive fibonacci with caching."""    if n < 2:        return n    return fibonacci_fast(n-1) + fibonacci_fast(n-2)# Massive speedup for recursive algorithmsn = 30slow_time = timeit.timeit(lambda: fibonacci_slow(n), number=1)fast_time = timeit.timeit(lambda: fibonacci_fast(n), number=1000)print(f"Without cache (1 run): {slow_time:.4f}s")print(f"With cache (1000 runs): {fast_time:.4f}s")# Cache infoprint(f"Cache info: {fibonacci_fast.cache_info()}")
```
```
import sysclass RegularClass:    """Regular class with __dict__."""    def __init__(self, x, y, z):        self.x = x        self.y = y        self.z = zclass SlottedClass:    """Class with __slots__ for memory efficiency."""    __slots__ = ['x', 'y', 'z']    def __init__(self, x, y, z):        self.x = x        self.y = y        self.z = z# Memory comparisonregular = RegularClass(1, 2, 3)slotted = SlottedClass(1, 2, 3)print(f"Regular class size: {sys.getsizeof(regular)} bytes")print(f"Slotted class size: {sys.getsizeof(slotted)} bytes")# Significant savings with many instancesregular_objects = [RegularClass(i, i+1, i+2) for i in range(10000)]slotted_objects = [SlottedClass(i, i+1, i+2) for i in range(10000)]print(f"\nMemory for 10000 regular objects: ~{sys.getsizeof(regular) * 10000} bytes")print(f"Memory for 10000 slotted objects: ~{sys.getsizeof(slotted) * 10000} bytes")
```
```
import sysclass RegularClass:    """Regular class with __dict__."""    def __init__(self, x, y, z):        self.x = x        self.y = y        self.z = zclass SlottedClass:    """Class with __slots__ for memory efficiency."""    __slots__ = ['x', 'y', 'z']    def __init__(self, x, y, z):        self.x = x        self.y = y        self.z = z# Memory comparisonregular = RegularClass(1, 2, 3)slotted = SlottedClass(1, 2, 3)print(f"Regular class size: {sys.getsizeof(regular)} bytes")print(f"Slotted class size: {sys.getsizeof(slotted)} bytes")# Significant savings with many instancesregular_objects = [RegularClass(i, i+1, i+2) for i in range(10000)]slotted_objects = [SlottedClass(i, i+1, i+2) for i in range(10000)]print(f"\nMemory for 10000 regular objects: ~{sys.getsizeof(regular) * 10000} bytes")print(f"Memory for 10000 slotted objects: ~{sys.getsizeof(slotted) * 10000} bytes")
```
```
import multiprocessing as mpimport timedef cpu_intensive_task(n):    """CPU-intensive calculation."""    return sum(i**2 for i in range(n))def sequential_processing():    """Process tasks sequentially."""    start = time.time()    results = [cpu_intensive_task(1000000) for _ in range(4)]    elapsed = time.time() - start    return elapsed, resultsdef parallel_processing():    """Process tasks in parallel."""    start = time.time()    with mp.Pool(processes=4) as pool:        results = pool.map(cpu_intensive_task, [1000000] * 4)    elapsed = time.time() - start    return elapsed, resultsif __name__ == "__main__":    seq_time, seq_results = sequential_processing()    par_time, par_results = parallel_processing()    print(f"Sequential: {seq_time:.2f}s")    print(f"Parallel: {par_time:.2f}s")    print(f"Speedup: {seq_time/par_time:.2f}x")
```
```
import multiprocessing as mpimport timedef cpu_intensive_task(n):    """CPU-intensive calculation."""    return sum(i**2 for i in range(n))def sequential_processing():    """Process tasks sequentially."""    start = time.time()    results = [cpu_intensive_task(1000000) for _ in range(4)]    elapsed = time.time() - start    return elapsed, resultsdef parallel_processing():    """Process tasks in parallel."""    start = time.time()    with mp.Pool(processes=4) as pool:        results = pool.map(cpu_intensive_task, [1000000] * 4)    elapsed = time.time() - start    return elapsed, resultsif __name__ == "__main__":    seq_time, seq_results = sequential_processing()    par_time, par_results = parallel_processing()    print(f"Sequential: {seq_time:.2f}s")    print(f"Parallel: {par_time:.2f}s")    print(f"Speedup: {seq_time/par_time:.2f}x")
```
```
import asyncioimport aiohttpimport timeimport requestsurls = [    "https://httpbin.org/delay/1",    "https://httpbin.org/delay/1",    "https://httpbin.org/delay/1",    "https://httpbin.org/delay/1",]def synchronous_requests():    """Synchronous HTTP requests."""    start = time.time()    results = []    for url in urls:        response = requests.get(url)        results.append(response.status_code)    elapsed = time.time() - start    return elapsed, resultsasync def async_fetch(session, url):    """Async HTTP request."""    async with session.get(url) as response:        return response.statusasync def asynchronous_requests():    """Asynchronous HTTP requests."""    start = time.time()    async with aiohttp.ClientSession() as session:        tasks = [async_fetch(session, url) for url in urls]        results = await asyncio.gather(*tasks)    elapsed = time.time() - start    return elapsed, results# Async is much faster for I/O-bound worksync_time, sync_results = synchronous_requests()async_time, async_results = asyncio.run(asynchronous_requests())print(f"Synchronous: {sync_time:.2f}s")print(f"Asynchronous: {async_time:.2f}s")print(f"Speedup: {sync_time/async_time:.2f}x")
```
```
import asyncioimport aiohttpimport timeimport requestsurls = [    "https://httpbin.org/delay/1",    "https://httpbin.org/delay/1",    "https://httpbin.org/delay/1",    "https://httpbin.org/delay/1",]def synchronous_requests():    """Synchronous HTTP requests."""    start = time.time()    results = []    for url in urls:        response = requests.get(url)        results.append(response.status_code)    elapsed = time.time() - start    return elapsed, resultsasync def async_fetch(session, url):    """Async HTTP request."""    async with session.get(url) as response:        return response.statusasync def asynchronous_requests():    """Asynchronous HTTP requests."""    start = time.time()    async with aiohttp.ClientSession() as session:        tasks = [async_fetch(session, url) for url in urls]        results = await asyncio.gather(*tasks)    elapsed = time.time() - start    return elapsed, results# Async is much faster for I/O-bound worksync_time, sync_results = synchronous_requests()async_time, async_results = asyncio.run(asynchronous_requests())print(f"Synchronous: {sync_time:.2f}s")print(f"Asynchronous: {async_time:.2f}s")print(f"Speedup: {sync_time/async_time:.2f}x")
```
```
import sqlite3import timedef create_db():    """Create test database."""    conn = sqlite3.connect(":memory:")    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")    return conndef slow_inserts(conn, count):    """Insert records one at a time."""    start = time.time()    cursor = conn.cursor()    for i in range(count):        cursor.execute("INSERT INTO users (name) VALUES (?)", (f"User {i}",))        conn.commit()  # Commit each insert    elapsed = time.time() - start    return elapseddef fast_inserts(conn, count):    """Batch insert with single commit."""    start = time.time()    cursor = conn.cursor()    data = [(f"User {i}",) for i in range(count)]    cursor.executemany("INSERT INTO users (name) VALUES (?)", data)    conn.commit()  # Single commit    elapsed = time.time() - start    return elapsed# Benchmarkconn1 = create_db()slow_time = slow_inserts(conn1, 1000)conn2 = create_db()fast_time = fast_inserts(conn2, 1000)print(f"Individual inserts: {slow_time:.4f}s")print(f"Batch insert: {fast_time:.4f}s")print(f"Speedup: {slow_time/fast_time:.2f}x")
```
```
import sqlite3import timedef create_db():    """Create test database."""    conn = sqlite3.connect(":memory:")    conn.execute("CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)")    return conndef slow_inserts(conn, count):    """Insert records one at a time."""    start = time.time()    cursor = conn.cursor()    for i in range(count):        cursor.execute("INSERT INTO users (name) VALUES (?)", (f"User {i}",))        conn.commit()  # Commit each insert    elapsed = time.time() - start    return elapseddef fast_inserts(conn, count):    """Batch insert with single commit."""    start = time.time()    cursor = conn.cursor()    data = [(f"User {i}",) for i in range(count)]    cursor.executemany("INSERT INTO users (name) VALUES (?)", data)    conn.commit()  # Single commit    elapsed = time.time() - start    return elapsed# Benchmarkconn1 = create_db()slow_time = slow_inserts(conn1, 1000)conn2 = create_db()fast_time = fast_inserts(conn2, 1000)print(f"Individual inserts: {slow_time:.4f}s")print(f"Batch insert: {fast_time:.4f}s")print(f"Speedup: {slow_time/fast_time:.2f}x")
```
```
# Use indexes for frequently queried columns"""-- Slow: No indexSELECT * FROM users WHERE email = 'user@example.com';-- Fast: With indexCREATE INDEX idx_users_email ON users(email);SELECT * FROM users WHERE email = 'user@example.com';"""# Use query planningimport sqlite3conn = sqlite3.connect("example.db")cursor = conn.cursor()# Analyze query performancecursor.execute("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?", ("test@example.com",))print(cursor.fetchall())# Use SELECT only needed columns# Slow: SELECT *# Fast: SELECT id, name
```
```
# Use indexes for frequently queried columns"""-- Slow: No indexSELECT * FROM users WHERE email = 'user@example.com';-- Fast: With indexCREATE INDEX idx_users_email ON users(email);SELECT * FROM users WHERE email = 'user@example.com';"""# Use query planningimport sqlite3conn = sqlite3.connect("example.db")cursor = conn.cursor()# Analyze query performancecursor.execute("EXPLAIN QUERY PLAN SELECT * FROM users WHERE email = ?", ("test@example.com",))print(cursor.fetchall())# Use SELECT only needed columns# Slow: SELECT *# Fast: SELECT id, name
```
```
import tracemallocimport gcdef memory_leak_example():    """Example that leaks memory."""    leaked_objects = []    for i in range(100000):        # Objects added but never removed        leaked_objects.append([i] * 100)    # In real code, this would be an unintended referencedef track_memory_usage():    """Track memory allocations."""    tracemalloc.start()    # Take snapshot before    snapshot1 = tracemalloc.take_snapshot()    # Run code    memory_leak_example()    # Take snapshot after    snapshot2 = tracemalloc.take_snapshot()    # Compare    top_stats = snapshot2.compare_to(snapshot1, 'lineno')    print("Top 10 memory allocations:")    for stat in top_stats[:10]:        print(stat)    tracemalloc.stop()# Monitor memorytrack_memory_usage()# Force garbage collectiongc.collect()
```
```
import tracemallocimport gcdef memory_leak_example():    """Example that leaks memory."""    leaked_objects = []    for i in range(100000):        # Objects added but never removed        leaked_objects.append([i] * 100)    # In real code, this would be an unintended referencedef track_memory_usage():    """Track memory allocations."""    tracemalloc.start()    # Take snapshot before    snapshot1 = tracemalloc.take_snapshot()    # Run code    memory_leak_example()    # Take snapshot after    snapshot2 = tracemalloc.take_snapshot()    # Compare    top_stats = snapshot2.compare_to(snapshot1, 'lineno')    print("Top 10 memory allocations:")    for stat in top_stats[:10]:        print(stat)    tracemalloc.stop()# Monitor memorytrack_memory_usage()# Force garbage collectiongc.collect()
```
```
import sysdef process_file_list(filename):    """Load entire file into memory."""    with open(filename) as f:        lines = f.readlines()  # Loads all lines        return sum(1 for line in lines if line.strip())def process_file_iterator(filename):    """Process file line by line."""    with open(filename) as f:        return sum(1 for line in f if line.strip())# Iterator uses constant memory# List loads entire file into memory
```
```
import sysdef process_file_list(filename):    """Load entire file into memory."""    with open(filename) as f:        lines = f.readlines()  # Loads all lines        return sum(1 for line in lines if line.strip())def process_file_iterator(filename):    """Process file line by line."""    with open(filename) as f:        return sum(1 for line in f if line.strip())# Iterator uses constant memory# List loads entire file into memory
```
```
import weakrefclass CachedResource:    """Resource that can be garbage collected."""    def __init__(self, data):        self.data = data# Regular cache prevents garbage collectionregular_cache = {}def get_resource_regular(key):    """Get resource from regular cache."""    if key not in regular_cache:        regular_cache[key] = CachedResource(f"Data for {key}")    return regular_cache[key]# Weak reference cache allows garbage collectionweak_cache = weakref.WeakValueDictionary()def get_resource_weak(key):    """Get resource from weak cache."""    resource = weak_cache.get(key)    if resource is None:        resource = CachedResource(f"Data for {key}")        weak_cache[key] = resource    return resource# When no strong references exist, objects can be GC'd
```
```
import weakrefclass CachedResource:    """Resource that can be garbage collected."""    def __init__(self, data):        self.data = data# Regular cache prevents garbage collectionregular_cache = {}def get_resource_regular(key):    """Get resource from regular cache."""    if key not in regular_cache:        regular_cache[key] = CachedResource(f"Data for {key}")    return regular_cache[key]# Weak reference cache allows garbage collectionweak_cache = weakref.WeakValueDictionary()def get_resource_weak(key):    """Get resource from weak cache."""    resource = weak_cache.get(key)    if resource is None:        resource = CachedResource(f"Data for {key}")        weak_cache[key] = resource    return resource# When no strong references exist, objects can be GC'd
```
```
import timefrom functools import wrapsdef benchmark(func):    """Decorator to benchmark function execution."""    @wraps(func)    def wrapper(*args, **kwargs):        start = time.perf_counter()        result = func(*args, **kwargs)        elapsed = time.perf_counter() - start        print(f"{func.__name__} took {elapsed:.6f} seconds")        return result    return wrapper@benchmarkdef slow_function():    """Function to benchmark."""    time.sleep(0.5)    return sum(range(1000000))result = slow_function()
```
```
import timefrom functools import wrapsdef benchmark(func):    """Decorator to benchmark function execution."""    @wraps(func)    def wrapper(*args, **kwargs):        start = time.perf_counter()        result = func(*args, **kwargs)        elapsed = time.perf_counter() - start        print(f"{func.__name__} took {elapsed:.6f} seconds")        return result    return wrapper@benchmarkdef slow_function():    """Function to benchmark."""    time.sleep(0.5)    return sum(range(1000000))result = slow_function()
```
```
# Install: pip install pytest-benchmarkdef test_list_comprehension(benchmark):    """Benchmark list comprehension."""    result = benchmark(lambda: [i**2 for i in range(10000)])    assert len(result) == 10000def test_map_function(benchmark):    """Benchmark map function."""    result = benchmark(lambda: list(map(lambda x: x**2, range(10000))))    assert len(result) == 10000# Run with: pytest test_performance.py --benchmark-compare
```
```
# Install: pip install pytest-benchmarkdef test_list_comprehension(benchmark):    """Benchmark list comprehension."""    result = benchmark(lambda: [i**2 for i in range(10000)])    assert len(result) == 10000def test_map_function(benchmark):    """Benchmark map function."""    result = benchmark(lambda: list(map(lambda x: x**2, range(10000))))    assert len(result) == 10000# Run with: pytest test_performance.py --benchmark-compare
```
Unlock the full potential of your Python applications with this comprehensive AI agent skill designed for performance optimization. Whether you're battling slow execution times, high memory consumption, or elusive bottlenecks, this skill provides the tools and strategies to diagnose and resolve performance issues. Leverage advanced profiling techniques and established best practices to make your Python code run faster and more efficiently. This skill empowers developers to build high-performance systems, reduce operational costs, and deliver a superior user experience by transforming sluggish scripts into optimized powerhouses.

# When to Use This Skill
- •Diagnosing slow API endpoints in a Django/Flask application.
- •Optimizing a data analytics script that processes large datasets in Pandas.
- •Reducing memory footprint and preventing leaks in long-running background services.
- •Improving the execution speed of machine learning model training loops.

# Pro Tips
- 💡Always start with profiling before attempting any optimizations; guesswork often leads to wasted effort or introducing new bugs.
- 💡Prioritize optimizing the biggest bottlenecks identified by your profiler. A small improvement in a frequently called, slow function yields more impact than a large improvement in a rarely called one.
- 💡Consider using C extensions (like Cython or Numba) for critical, CPU-bound sections after Python-level optimizations have been exhausted.

