# async-python-patterns
Source: https://antigravity.codes/agent-skills/python/async-python-patterns

## AI Worker Instructions
When the user requests functionality related to async-python-patterns, follow these guidelines and utilize this context.

## Scraped Content

# async-python-patterns
```
async def
```
```
async def my_coroutine():    result = await some_async_operation()    return result
```
```
async def my_coroutine():    result = await some_async_operation()    return result
```
```
async with
```
```
async for
```
```
import asyncioasync def main():    print("Hello")    await asyncio.sleep(1)    print("World")# Python 3.7+asyncio.run(main())
```
```
import asyncioasync def main():    print("Hello")    await asyncio.sleep(1)    print("World")# Python 3.7+asyncio.run(main())
```
```
import asyncioasync def fetch_data(url: str) -> dict:    """Fetch data from URL asynchronously."""    await asyncio.sleep(1)  # Simulate I/O    return {"url": url, "data": "result"}async def main():    result = await fetch_data("https://api.example.com")    print(result)asyncio.run(main())
```
```
import asyncioasync def fetch_data(url: str) -> dict:    """Fetch data from URL asynchronously."""    await asyncio.sleep(1)  # Simulate I/O    return {"url": url, "data": "result"}async def main():    result = await fetch_data("https://api.example.com")    print(result)asyncio.run(main())
```
```
import asynciofrom typing import Listasync def fetch_user(user_id: int) -> dict:    """Fetch user data."""    await asyncio.sleep(0.5)    return {"id": user_id, "name": f"User {user_id}"}async def fetch_all_users(user_ids: List[int]) -> List[dict]:    """Fetch multiple users concurrently."""    tasks = [fetch_user(uid) for uid in user_ids]    results = await asyncio.gather(*tasks)    return resultsasync def main():    user_ids = [1, 2, 3, 4, 5]    users = await fetch_all_users(user_ids)    print(f"Fetched {len(users)} users")asyncio.run(main())
```
```
import asynciofrom typing import Listasync def fetch_user(user_id: int) -> dict:    """Fetch user data."""    await asyncio.sleep(0.5)    return {"id": user_id, "name": f"User {user_id}"}async def fetch_all_users(user_ids: List[int]) -> List[dict]:    """Fetch multiple users concurrently."""    tasks = [fetch_user(uid) for uid in user_ids]    results = await asyncio.gather(*tasks)    return resultsasync def main():    user_ids = [1, 2, 3, 4, 5]    users = await fetch_all_users(user_ids)    print(f"Fetched {len(users)} users")asyncio.run(main())
```
```
import asyncioasync def background_task(name: str, delay: int):    """Long-running background task."""    print(f"{name} started")    await asyncio.sleep(delay)    print(f"{name} completed")    return f"Result from {name}"async def main():    # Create tasks    task1 = asyncio.create_task(background_task("Task 1", 2))    task2 = asyncio.create_task(background_task("Task 2", 1))    # Do other work    print("Main: doing other work")    await asyncio.sleep(0.5)    # Wait for tasks    result1 = await task1    result2 = await task2    print(f"Results: {result1}, {result2}")asyncio.run(main())
```
```
import asyncioasync def background_task(name: str, delay: int):    """Long-running background task."""    print(f"{name} started")    await asyncio.sleep(delay)    print(f"{name} completed")    return f"Result from {name}"async def main():    # Create tasks    task1 = asyncio.create_task(background_task("Task 1", 2))    task2 = asyncio.create_task(background_task("Task 2", 1))    # Do other work    print("Main: doing other work")    await asyncio.sleep(0.5)    # Wait for tasks    result1 = await task1    result2 = await task2    print(f"Results: {result1}, {result2}")asyncio.run(main())
```
```
import asynciofrom typing import List, Optionalasync def risky_operation(item_id: int) -> dict:    """Operation that might fail."""    await asyncio.sleep(0.1)    if item_id % 3 == 0:        raise ValueError(f"Item {item_id} failed")    return {"id": item_id, "status": "success"}async def safe_operation(item_id: int) -> Optional[dict]:    """Wrapper with error handling."""    try:        return await risky_operation(item_id)    except ValueError as e:        print(f"Error: {e}")        return Noneasync def process_items(item_ids: List[int]):    """Process multiple items with error handling."""    tasks = [safe_operation(iid) for iid in item_ids]    results = await asyncio.gather(*tasks, return_exceptions=True)    # Filter out failures    successful = [r for r in results if r is not None and not isinstance(r, Exception)]    failed = [r for r in results if isinstance(r, Exception)]    print(f"Success: {len(successful)}, Failed: {len(failed)}")    return successfulasyncio.run(process_items([1, 2, 3, 4, 5, 6]))
```
```
import asynciofrom typing import List, Optionalasync def risky_operation(item_id: int) -> dict:    """Operation that might fail."""    await asyncio.sleep(0.1)    if item_id % 3 == 0:        raise ValueError(f"Item {item_id} failed")    return {"id": item_id, "status": "success"}async def safe_operation(item_id: int) -> Optional[dict]:    """Wrapper with error handling."""    try:        return await risky_operation(item_id)    except ValueError as e:        print(f"Error: {e}")        return Noneasync def process_items(item_ids: List[int]):    """Process multiple items with error handling."""    tasks = [safe_operation(iid) for iid in item_ids]    results = await asyncio.gather(*tasks, return_exceptions=True)    # Filter out failures    successful = [r for r in results if r is not None and not isinstance(r, Exception)]    failed = [r for r in results if isinstance(r, Exception)]    print(f"Success: {len(successful)}, Failed: {len(failed)}")    return successfulasyncio.run(process_items([1, 2, 3, 4, 5, 6]))
```
```
import asyncioasync def slow_operation(delay: int) -> str:    """Operation that takes time."""    await asyncio.sleep(delay)    return f"Completed after {delay}s"async def with_timeout():    """Execute operation with timeout."""    try:        result = await asyncio.wait_for(slow_operation(5), timeout=2.0)        print(result)    except asyncio.TimeoutError:        print("Operation timed out")asyncio.run(with_timeout())
```
```
import asyncioasync def slow_operation(delay: int) -> str:    """Operation that takes time."""    await asyncio.sleep(delay)    return f"Completed after {delay}s"async def with_timeout():    """Execute operation with timeout."""    try:        result = await asyncio.wait_for(slow_operation(5), timeout=2.0)        print(result)    except asyncio.TimeoutError:        print("Operation timed out")asyncio.run(with_timeout())
```
```
import asynciofrom typing import Optionalclass AsyncDatabaseConnection:    """Async database connection context manager."""    def __init__(self, dsn: str):        self.dsn = dsn        self.connection: Optional[object] = None    async def __aenter__(self):        print("Opening connection")        await asyncio.sleep(0.1)  # Simulate connection        self.connection = {"dsn": self.dsn, "connected": True}        return self.connection    async def __aexit__(self, exc_type, exc_val, exc_tb):        print("Closing connection")        await asyncio.sleep(0.1)  # Simulate cleanup        self.connection = Noneasync def query_database():    """Use async context manager."""    async with AsyncDatabaseConnection("postgresql://localhost") as conn:        print(f"Using connection: {conn}")        await asyncio.sleep(0.2)  # Simulate query        return {"rows": 10}asyncio.run(query_database())
```
```
import asynciofrom typing import Optionalclass AsyncDatabaseConnection:    """Async database connection context manager."""    def __init__(self, dsn: str):        self.dsn = dsn        self.connection: Optional[object] = None    async def __aenter__(self):        print("Opening connection")        await asyncio.sleep(0.1)  # Simulate connection        self.connection = {"dsn": self.dsn, "connected": True}        return self.connection    async def __aexit__(self, exc_type, exc_val, exc_tb):        print("Closing connection")        await asyncio.sleep(0.1)  # Simulate cleanup        self.connection = Noneasync def query_database():    """Use async context manager."""    async with AsyncDatabaseConnection("postgresql://localhost") as conn:        print(f"Using connection: {conn}")        await asyncio.sleep(0.2)  # Simulate query        return {"rows": 10}asyncio.run(query_database())
```
```
import asynciofrom typing import AsyncIteratorasync def async_range(start: int, end: int, delay: float = 0.1) -> AsyncIterator[int]:    """Async generator that yields numbers with delay."""    for i in range(start, end):        await asyncio.sleep(delay)        yield iasync def fetch_pages(url: str, max_pages: int) -> AsyncIterator[dict]:    """Fetch paginated data asynchronously."""    for page in range(1, max_pages + 1):        await asyncio.sleep(0.2)  # Simulate API call        yield {            "page": page,            "url": f"{url}?page={page}",            "data": [f"item_{page}_{i}" for i in range(5)]        }async def consume_async_iterator():    """Consume async iterator."""    async for number in async_range(1, 5):        print(f"Number: {number}")    print("\nFetching pages:")    async for page_data in fetch_pages("https://api.example.com/items", 3):        print(f"Page {page_data['page']}: {len(page_data['data'])} items")asyncio.run(consume_async_iterator())
```
```
import asynciofrom typing import AsyncIteratorasync def async_range(start: int, end: int, delay: float = 0.1) -> AsyncIterator[int]:    """Async generator that yields numbers with delay."""    for i in range(start, end):        await asyncio.sleep(delay)        yield iasync def fetch_pages(url: str, max_pages: int) -> AsyncIterator[dict]:    """Fetch paginated data asynchronously."""    for page in range(1, max_pages + 1):        await asyncio.sleep(0.2)  # Simulate API call        yield {            "page": page,            "url": f"{url}?page={page}",            "data": [f"item_{page}_{i}" for i in range(5)]        }async def consume_async_iterator():    """Consume async iterator."""    async for number in async_range(1, 5):        print(f"Number: {number}")    print("\nFetching pages:")    async for page_data in fetch_pages("https://api.example.com/items", 3):        print(f"Page {page_data['page']}: {len(page_data['data'])} items")asyncio.run(consume_async_iterator())
```
```
import asynciofrom asyncio import Queuefrom typing import Optionalasync def producer(queue: Queue, producer_id: int, num_items: int):    """Produce items and put them in queue."""    for i in range(num_items):        item = f"Item-{producer_id}-{i}"        await queue.put(item)        print(f"Producer {producer_id} produced: {item}")        await asyncio.sleep(0.1)    await queue.put(None)  # Signal completionasync def consumer(queue: Queue, consumer_id: int):    """Consume items from queue."""    while True:        item = await queue.get()        if item is None:            queue.task_done()            break        print(f"Consumer {consumer_id} processing: {item}")        await asyncio.sleep(0.2)  # Simulate work        queue.task_done()async def producer_consumer_example():    """Run producer-consumer pattern."""    queue = Queue(maxsize=10)    # Create tasks    producers = [        asyncio.create_task(producer(queue, i, 5))        for i in range(2)    ]    consumers = [        asyncio.create_task(consumer(queue, i))        for i in range(3)    ]    # Wait for producers    await asyncio.gather(*producers)    # Wait for queue to be empty    await queue.join()    # Cancel consumers    for c in consumers:        c.cancel()asyncio.run(producer_consumer_example())
```
```
import asynciofrom asyncio import Queuefrom typing import Optionalasync def producer(queue: Queue, producer_id: int, num_items: int):    """Produce items and put them in queue."""    for i in range(num_items):        item = f"Item-{producer_id}-{i}"        await queue.put(item)        print(f"Producer {producer_id} produced: {item}")        await asyncio.sleep(0.1)    await queue.put(None)  # Signal completionasync def consumer(queue: Queue, consumer_id: int):    """Consume items from queue."""    while True:        item = await queue.get()        if item is None:            queue.task_done()            break        print(f"Consumer {consumer_id} processing: {item}")        await asyncio.sleep(0.2)  # Simulate work        queue.task_done()async def producer_consumer_example():    """Run producer-consumer pattern."""    queue = Queue(maxsize=10)    # Create tasks    producers = [        asyncio.create_task(producer(queue, i, 5))        for i in range(2)    ]    consumers = [        asyncio.create_task(consumer(queue, i))        for i in range(3)    ]    # Wait for producers    await asyncio.gather(*producers)    # Wait for queue to be empty    await queue.join()    # Cancel consumers    for c in consumers:        c.cancel()asyncio.run(producer_consumer_example())
```
```
import asynciofrom typing import Listasync def api_call(url: str, semaphore: asyncio.Semaphore) -> dict:    """Make API call with rate limiting."""    async with semaphore:        print(f"Calling {url}")        await asyncio.sleep(0.5)  # Simulate API call        return {"url": url, "status": 200}async def rate_limited_requests(urls: List[str], max_concurrent: int = 5):    """Make multiple requests with rate limiting."""    semaphore = asyncio.Semaphore(max_concurrent)    tasks = [api_call(url, semaphore) for url in urls]    results = await asyncio.gather(*tasks)    return resultsasync def main():    urls = [f"https://api.example.com/item/{i}" for i in range(20)]    results = await rate_limited_requests(urls, max_concurrent=3)    print(f"Completed {len(results)} requests")asyncio.run(main())
```
```
import asynciofrom typing import Listasync def api_call(url: str, semaphore: asyncio.Semaphore) -> dict:    """Make API call with rate limiting."""    async with semaphore:        print(f"Calling {url}")        await asyncio.sleep(0.5)  # Simulate API call        return {"url": url, "status": 200}async def rate_limited_requests(urls: List[str], max_concurrent: int = 5):    """Make multiple requests with rate limiting."""    semaphore = asyncio.Semaphore(max_concurrent)    tasks = [api_call(url, semaphore) for url in urls]    results = await asyncio.gather(*tasks)    return resultsasync def main():    urls = [f"https://api.example.com/item/{i}" for i in range(20)]    results = await rate_limited_requests(urls, max_concurrent=3)    print(f"Completed {len(results)} requests")asyncio.run(main())
```
```
import asyncioclass AsyncCounter:    """Thread-safe async counter."""    def __init__(self):        self.value = 0        self.lock = asyncio.Lock()    async def increment(self):        """Safely increment counter."""        async with self.lock:            current = self.value            await asyncio.sleep(0.01)  # Simulate work            self.value = current + 1    async def get_value(self) -> int:        """Get current value."""        async with self.lock:            return self.valueasync def worker(counter: AsyncCounter, worker_id: int):    """Worker that increments counter."""    for _ in range(10):        await counter.increment()        print(f"Worker {worker_id} incremented")async def test_counter():    """Test concurrent counter."""    counter = AsyncCounter()    workers = [asyncio.create_task(worker(counter, i)) for i in range(5)]    await asyncio.gather(*workers)    final_value = await counter.get_value()    print(f"Final counter value: {final_value}")asyncio.run(test_counter())
```
```
import asyncioclass AsyncCounter:    """Thread-safe async counter."""    def __init__(self):        self.value = 0        self.lock = asyncio.Lock()    async def increment(self):        """Safely increment counter."""        async with self.lock:            current = self.value            await asyncio.sleep(0.01)  # Simulate work            self.value = current + 1    async def get_value(self) -> int:        """Get current value."""        async with self.lock:            return self.valueasync def worker(counter: AsyncCounter, worker_id: int):    """Worker that increments counter."""    for _ in range(10):        await counter.increment()        print(f"Worker {worker_id} incremented")async def test_counter():    """Test concurrent counter."""    counter = AsyncCounter()    workers = [asyncio.create_task(worker(counter, i)) for i in range(5)]    await asyncio.gather(*workers)    final_value = await counter.get_value()    print(f"Final counter value: {final_value}")asyncio.run(test_counter())
```
```
import asyncioimport aiohttpfrom typing import List, Dictasync def fetch_url(session: aiohttp.ClientSession, url: str) -> Dict:    """Fetch single URL."""    try:        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:            text = await response.text()            return {                "url": url,                "status": response.status,                "length": len(text)            }    except Exception as e:        return {"url": url, "error": str(e)}async def scrape_urls(urls: List[str]) -> List[Dict]:    """Scrape multiple URLs concurrently."""    async with aiohttp.ClientSession() as session:        tasks = [fetch_url(session, url) for url in urls]        results = await asyncio.gather(*tasks)        return resultsasync def main():    urls = [        "https://httpbin.org/delay/1",        "https://httpbin.org/delay/2",        "https://httpbin.org/status/404",    ]    results = await scrape_urls(urls)    for result in results:        print(result)asyncio.run(main())
```
```
import asyncioimport aiohttpfrom typing import List, Dictasync def fetch_url(session: aiohttp.ClientSession, url: str) -> Dict:    """Fetch single URL."""    try:        async with session.get(url, timeout=aiohttp.ClientTimeout(total=10)) as response:            text = await response.text()            return {                "url": url,                "status": response.status,                "length": len(text)            }    except Exception as e:        return {"url": url, "error": str(e)}async def scrape_urls(urls: List[str]) -> List[Dict]:    """Scrape multiple URLs concurrently."""    async with aiohttp.ClientSession() as session:        tasks = [fetch_url(session, url) for url in urls]        results = await asyncio.gather(*tasks)        return resultsasync def main():    urls = [        "https://httpbin.org/delay/1",        "https://httpbin.org/delay/2",        "https://httpbin.org/status/404",    ]    results = await scrape_urls(urls)    for result in results:        print(result)asyncio.run(main())
```
```
import asynciofrom typing import List, Optional# Simulated async database clientclass AsyncDB:    """Simulated async database."""    async def execute(self, query: str) -> List[dict]:        """Execute query."""        await asyncio.sleep(0.1)        return [{"id": 1, "name": "Example"}]    async def fetch_one(self, query: str) -> Optional[dict]:        """Fetch single row."""        await asyncio.sleep(0.1)        return {"id": 1, "name": "Example"}async def get_user_data(db: AsyncDB, user_id: int) -> dict:    """Fetch user and related data concurrently."""    user_task = db.fetch_one(f"SELECT * FROM users WHERE id = {user_id}")    orders_task = db.execute(f"SELECT * FROM orders WHERE user_id = {user_id}")    profile_task = db.fetch_one(f"SELECT * FROM profiles WHERE user_id = {user_id}")    user, orders, profile = await asyncio.gather(user_task, orders_task, profile_task)    return {        "user": user,        "orders": orders,        "profile": profile    }async def main():    db = AsyncDB()    user_data = await get_user_data(db, 1)    print(user_data)asyncio.run(main())
```
```
import asynciofrom typing import List, Optional# Simulated async database clientclass AsyncDB:    """Simulated async database."""    async def execute(self, query: str) -> List[dict]:        """Execute query."""        await asyncio.sleep(0.1)        return [{"id": 1, "name": "Example"}]    async def fetch_one(self, query: str) -> Optional[dict]:        """Fetch single row."""        await asyncio.sleep(0.1)        return {"id": 1, "name": "Example"}async def get_user_data(db: AsyncDB, user_id: int) -> dict:    """Fetch user and related data concurrently."""    user_task = db.fetch_one(f"SELECT * FROM users WHERE id = {user_id}")    orders_task = db.execute(f"SELECT * FROM orders WHERE user_id = {user_id}")    profile_task = db.fetch_one(f"SELECT * FROM profiles WHERE user_id = {user_id}")    user, orders, profile = await asyncio.gather(user_task, orders_task, profile_task)    return {        "user": user,        "orders": orders,        "profile": profile    }async def main():    db = AsyncDB()    user_data = await get_user_data(db, 1)    print(user_data)asyncio.run(main())
```
```
import asynciofrom typing import Set# Simulated WebSocket connectionclass WebSocket:    """Simulated WebSocket."""    def __init__(self, client_id: str):        self.client_id = client_id    async def send(self, message: str):        """Send message."""        print(f"Sending to {self.client_id}: {message}")        await asyncio.sleep(0.01)    async def recv(self) -> str:        """Receive message."""        await asyncio.sleep(1)        return f"Message from {self.client_id}"class WebSocketServer:    """Simple WebSocket server."""    def __init__(self):        self.clients: Set[WebSocket] = set()    async def register(self, websocket: WebSocket):        """Register new client."""        self.clients.add(websocket)        print(f"Client {websocket.client_id} connected")    async def unregister(self, websocket: WebSocket):        """Unregister client."""        self.clients.remove(websocket)        print(f"Client {websocket.client_id} disconnected")    async def broadcast(self, message: str):        """Broadcast message to all clients."""        if self.clients:            tasks = [client.send(message) for client in self.clients]            await asyncio.gather(*tasks)    async def handle_client(self, websocket: WebSocket):        """Handle individual client connection."""        await self.register(websocket)        try:            async for message in self.message_iterator(websocket):                await self.broadcast(f"{websocket.client_id}: {message}")        finally:            await self.unregister(websocket)    async def message_iterator(self, websocket: WebSocket):        """Iterate over messages from client."""        for _ in range(3):  # Simulate 3 messages            yield await websocket.recv()
```
```
import asynciofrom typing import Set# Simulated WebSocket connectionclass WebSocket:    """Simulated WebSocket."""    def __init__(self, client_id: str):        self.client_id = client_id    async def send(self, message: str):        """Send message."""        print(f"Sending to {self.client_id}: {message}")        await asyncio.sleep(0.01)    async def recv(self) -> str:        """Receive message."""        await asyncio.sleep(1)        return f"Message from {self.client_id}"class WebSocketServer:    """Simple WebSocket server."""    def __init__(self):        self.clients: Set[WebSocket] = set()    async def register(self, websocket: WebSocket):        """Register new client."""        self.clients.add(websocket)        print(f"Client {websocket.client_id} connected")    async def unregister(self, websocket: WebSocket):        """Unregister client."""        self.clients.remove(websocket)        print(f"Client {websocket.client_id} disconnected")    async def broadcast(self, message: str):        """Broadcast message to all clients."""        if self.clients:            tasks = [client.send(message) for client in self.clients]            await asyncio.gather(*tasks)    async def handle_client(self, websocket: WebSocket):        """Handle individual client connection."""        await self.register(websocket)        try:            async for message in self.message_iterator(websocket):                await self.broadcast(f"{websocket.client_id}: {message}")        finally:            await self.unregister(websocket)    async def message_iterator(self, websocket: WebSocket):        """Iterate over messages from client."""        for _ in range(3):  # Simulate 3 messages            yield await websocket.recv()
```
```
import asyncioimport aiohttpasync def with_connection_pool():    """Use connection pool for efficiency."""    connector = aiohttp.TCPConnector(limit=100, limit_per_host=10)    async with aiohttp.ClientSession(connector=connector) as session:        tasks = [session.get(f"https://api.example.com/item/{i}") for i in range(50)]        responses = await asyncio.gather(*tasks)        return responses
```
```
import asyncioimport aiohttpasync def with_connection_pool():    """Use connection pool for efficiency."""    connector = aiohttp.TCPConnector(limit=100, limit_per_host=10)    async with aiohttp.ClientSession(connector=connector) as session:        tasks = [session.get(f"https://api.example.com/item/{i}") for i in range(50)]        responses = await asyncio.gather(*tasks)        return responses
```
```
async def batch_process(items: List[str], batch_size: int = 10):    """Process items in batches."""    for i in range(0, len(items), batch_size):        batch = items[i:i + batch_size]        tasks = [process_item(item) for item in batch]        await asyncio.gather(*tasks)        print(f"Processed batch {i // batch_size + 1}")async def process_item(item: str):    """Process single item."""    await asyncio.sleep(0.1)    return f"Processed: {item}"
```
```
async def batch_process(items: List[str], batch_size: int = 10):    """Process items in batches."""    for i in range(0, len(items), batch_size):        batch = items[i:i + batch_size]        tasks = [process_item(item) for item in batch]        await asyncio.gather(*tasks)        print(f"Processed batch {i // batch_size + 1}")async def process_item(item: str):    """Process single item."""    await asyncio.sleep(0.1)    return f"Processed: {item}"
```
```
import asyncioimport concurrent.futuresfrom typing import Anydef blocking_operation(data: Any) -> Any:    """CPU-intensive blocking operation."""    import time    time.sleep(1)    return data * 2async def run_in_executor(data: Any) -> Any:    """Run blocking operation in thread pool."""    loop = asyncio.get_event_loop()    with concurrent.futures.ThreadPoolExecutor() as pool:        result = await loop.run_in_executor(pool, blocking_operation, data)        return resultasync def main():    results = await asyncio.gather(*[run_in_executor(i) for i in range(5)])    print(results)asyncio.run(main())
```
```
import asyncioimport concurrent.futuresfrom typing import Anydef blocking_operation(data: Any) -> Any:    """CPU-intensive blocking operation."""    import time    time.sleep(1)    return data * 2async def run_in_executor(data: Any) -> Any:    """Run blocking operation in thread pool."""    loop = asyncio.get_event_loop()    with concurrent.futures.ThreadPoolExecutor() as pool:        result = await loop.run_in_executor(pool, blocking_operation, data)        return resultasync def main():    results = await asyncio.gather(*[run_in_executor(i) for i in range(5)])    print(results)asyncio.run(main())
```
```
# Wrong - returns coroutine object, doesn't executeresult = async_function()# Correctresult = await async_function()
```
```
# Wrong - returns coroutine object, doesn't executeresult = async_function()# Correctresult = await async_function()
```
```
# Wrong - blocks event loopimport timeasync def bad():    time.sleep(1)  # Blocks!# Correctasync def good():    await asyncio.sleep(1)  # Non-blocking
```
```
# Wrong - blocks event loopimport timeasync def bad():    time.sleep(1)  # Blocks!# Correctasync def good():    await asyncio.sleep(1)  # Non-blocking
```
```
async def cancelable_task():    """Task that handles cancellation."""    try:        while True:            await asyncio.sleep(1)            print("Working...")    except asyncio.CancelledError:        print("Task cancelled, cleaning up...")        # Perform cleanup        raise  # Re-raise to propagate cancellation
```
```
async def cancelable_task():    """Task that handles cancellation."""    try:        while True:            await asyncio.sleep(1)            print("Working...")    except asyncio.CancelledError:        print("Task cancelled, cleaning up...")        # Perform cleanup        raise  # Re-raise to propagate cancellation
```
```
# Wrong - can't call async from sync directlydef sync_function():    result = await async_function()  # SyntaxError!# Correctdef sync_function():    result = asyncio.run(async_function())
```
```
# Wrong - can't call async from sync directlydef sync_function():    result = await async_function()  # SyntaxError!# Correctdef sync_function():    result = asyncio.run(async_function())
```
```
import asyncioimport pytest# Using pytest-asyncio@pytest.mark.asyncioasync def test_async_function():    """Test async function."""    result = await fetch_data("https://api.example.com")    assert result is not None@pytest.mark.asyncioasync def test_with_timeout():    """Test with timeout."""    with pytest.raises(asyncio.TimeoutError):        await asyncio.wait_for(slow_operation(5), timeout=1.0)
```
```
import asyncioimport pytest# Using pytest-asyncio@pytest.mark.asyncioasync def test_async_function():    """Test async function."""    result = await fetch_data("https://api.example.com")    assert result is not None@pytest.mark.asyncioasync def test_with_timeout():    """Test with timeout."""    with pytest.raises(asyncio.TimeoutError):        await asyncio.wait_for(slow_operation(5), timeout=1.0)
```
Dive deep into the world of asynchronous Python with this comprehensive agent skill, designed to elevate your coding efficiency and application performance. Mastering `asyncio` and `async/await` patterns is crucial for developing responsive, I/O-bound applications that don't block the main thread. This skill provides a structured approach to understanding event loops, coroutines, and tasks, empowering you to build scalable web APIs, real-time systems, and concurrent data processors. Leverage its insights to architect robust, non-blocking solutions that maximize resource utilization and deliver a superior user experience, making your Python applications faster and more efficient.

# When to Use This Skill
- •Building high-performance async web APIs using frameworks like FastAPI, aiohttp, or Sanic.
- •Implementing concurrent I/O operations for databases, file systems, or network requests efficiently.
- •Developing real-time applications such as WebSocket servers, chat systems, or live dashboards.
- •Optimizing I/O-bound workloads by processing multiple independent tasks simultaneously, like web scraping.

# Pro Tips
- 💡**Leverage `asyncio.gather()` for Parallel Execution:** When you have multiple independent coroutines, use `asyncio.gather()` to run them concurrently. This significantly reduces total execution time compared to awaiting them sequentially, making your application more efficient.
- 💡**Avoid Blocking Calls in Coroutines:** Never perform blocking I/O (e.g., `requests.get()`, `time.sleep()`) directly within an `async def` function. Instead, wrap them using `loop.run_in_executor()` to offload the blocking work to a separate thread pool, preventing your event loop from freezing.
- 💡**Handle Task Exceptions Gracefully:** Always ensure you await tasks created with `asyncio.create_task()`. Unawaited tasks might swallow exceptions, making debugging difficult. Consider using `try...except` blocks within your coroutines or gathering tasks to catch and manage errors effectively.

