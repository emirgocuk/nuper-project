# cloudflare-python-workers
Source: https://antigravity.codes/agent-skills/python/cloudflare-python-workers

## AI Worker Instructions
When the user requests functionality related to cloudflare-python-workers, follow these guidelines and utilize this context.

## Scraped Content

# cloudflare-python-workers
```
python_workers
```
```
# Create project directorymkdir my-python-worker && cd my-python-worker# Initialize Python projectuv init# Install pywrangleruv tool install workers-py# Initialize Worker configurationuv run pywrangler init
```
```
# Create project directorymkdir my-python-worker && cd my-python-worker# Initialize Python projectuv init# Install pywrangleruv tool install workers-py# Initialize Worker configurationuv run pywrangler init
```
```
src/entry.py
```
```
from workers import WorkerEntrypoint, Responseclass Default(WorkerEntrypoint):    async def fetch(self, request):        return Response("Hello from Python Worker!")
```
```
from workers import WorkerEntrypoint, Responseclass Default(WorkerEntrypoint):    async def fetch(self, request):        return Response("Hello from Python Worker!")
```
```
{  "name": "my-python-worker",  "main": "src/entry.py",  "compatibility_date": "2025-12-01",  "compatibility_flags": ["python_workers"]}
```
```
{  "name": "my-python-worker",  "main": "src/entry.py",  "compatibility_date": "2025-12-01",  "compatibility_flags": ["python_workers"]}
```
```
uv run pywrangler dev# Visit http://localhost:8787
```
```
uv run pywrangler dev# Visit http://localhost:8787
```
```
uv run pywrangler deploy
```
```
uv run pywrangler deploy
```
```
# Limited to built-in packages only# Could only use httpx, aiohttp, beautifulsoup4, etc.# Error: "You cannot yet deploy Python Workers that depend on# packages defined in requirements.txt [code: 10021]"
```
```
# Limited to built-in packages only# Could only use httpx, aiohttp, beautifulsoup4, etc.# Error: "You cannot yet deploy Python Workers that depend on# packages defined in requirements.txt [code: 10021]"
```
```
# pyproject.toml[project]dependencies = ["fastapi", "any-pyodide-compatible-package"]
```
```
# pyproject.toml[project]dependencies = ["fastapi", "any-pyodide-compatible-package"]
```
```
uv tool install workers-pyuv run pywrangler deploy  # Now works!
```
```
uv tool install workers-pyuv run pywrangler deploy  # Now works!
```
```
from workers import WorkerEntrypoint, Responseclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Access bindings via self.env        value = await self.env.MY_KV.get("key")        # Parse request        url = request.url        method = request.method        return Response(f"Method: {method}, URL: {url}")
```
```
from workers import WorkerEntrypoint, Responseclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Access bindings via self.env        value = await self.env.MY_KV.get("key")        # Parse request        url = request.url        method = request.method        return Response(f"Method: {method}, URL: {url}")
```
```
self.env
```
```
class Default(WorkerEntrypoint):    async def fetch(self, request):        # D1 Database        result = await self.env.DB.prepare("SELECT * FROM users").all()        # KV Storage        value = await self.env.MY_KV.get("key")        await self.env.MY_KV.put("key", "value")        # R2 Object Storage        obj = await self.env.MY_BUCKET.get("file.txt")        # Workers AI        response = await self.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {            "prompt": "Hello!"        })        return Response("OK")
```
```
class Default(WorkerEntrypoint):    async def fetch(self, request):        # D1 Database        result = await self.env.DB.prepare("SELECT * FROM users").all()        # KV Storage        value = await self.env.MY_KV.get("key")        await self.env.MY_KV.put("key", "value")        # R2 Object Storage        obj = await self.env.MY_BUCKET.get("file.txt")        # Workers AI        response = await self.env.AI.run("@cf/meta/llama-2-7b-chat-int8", {            "prompt": "Hello!"        })        return Response("OK")
```
```
from workers import WorkerEntrypoint, Responseimport jsonclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Parse JSON body        if request.method == "POST":            body = await request.json()            return Response(                json.dumps({"received": body}),                headers={"Content-Type": "application/json"}            )        # Query parameters        url = URL(request.url)        name = url.searchParams.get("name", "World")        return Response(f"Hello, {name}!")
```
```
from workers import WorkerEntrypoint, Responseimport jsonclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Parse JSON body        if request.method == "POST":            body = await request.json()            return Response(                json.dumps({"received": body}),                headers={"Content-Type": "application/json"}            )        # Query parameters        url = URL(request.url)        name = url.searchParams.get("name", "World")        return Response(f"Hello, {name}!")
```
```
from workers import handler@handlerasync def on_scheduled(event, env, ctx):    # Run on cron schedule    print(f"Cron triggered at {event.scheduledTime}")    # Do work...    await env.MY_KV.put("last_run", str(event.scheduledTime))
```
```
from workers import handler@handlerasync def on_scheduled(event, env, ctx):    # Run on cron schedule    print(f"Cron triggered at {event.scheduledTime}")    # Do work...    await env.MY_KV.put("last_run", str(event.scheduledTime))
```
```
{  "triggers": {    "crons": ["*/5 * * * *"]  // Every 5 minutes  }}
```
```
{  "triggers": {    "crons": ["*/5 * * * *"]  // Every 5 minutes  }}
```
```
@step.do()
```
```
await step.do("my step", async () => {  // Inline callback  return result;});
```
```
await step.do("my step", async () => {  // Inline callback  return result;});
```
```
@step.do("my step")async def my_step():    # Named function with decorator    return resultresult = await my_step()
```
```
@step.do("my step")async def my_step():    # Named function with decorator    return resultresult = await my_step()
```
```
Promise.all
```
```
import asyncio@step.do("step_a")async def step_a():    return "A"@step.do("step_b")async def step_b():    return "B"# Concurrent execution (like Promise.all)results = await asyncio.gather(step_a(), step_b())# results = ["A", "B"]
```
```
import asyncio@step.do("step_a")async def step_a():    return "A"@step.do("step_b")async def step_b():    return "B"# Concurrent execution (like Promise.all)results = await asyncio.gather(step_a(), step_b())# results = ["A", "B"]
```
```
from workers import WorkflowEntrypoint, WorkerEntrypoint, Responseclass MyWorkflow(WorkflowEntrypoint):    async def run(self, event, step):        # Step 1        @step.do("fetch data")        async def fetch_data():            response = await fetch("https://api.example.com/data")            return await response.json()        data = await fetch_data()        # Step 2: Sleep        await step.sleep("wait", "10 seconds")        # Step 3: Process        @step.do("process data")        async def process_data():            return {"processed": True, "count": len(data)}        result = await process_data()        return resultclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Create workflow instance        instance = await self.env.MY_WORKFLOW.create()        return Response(f"Workflow started: {instance.id}")
```
```
from workers import WorkflowEntrypoint, WorkerEntrypoint, Responseclass MyWorkflow(WorkflowEntrypoint):    async def run(self, event, step):        # Step 1        @step.do("fetch data")        async def fetch_data():            response = await fetch("https://api.example.com/data")            return await response.json()        data = await fetch_data()        # Step 2: Sleep        await step.sleep("wait", "10 seconds")        # Step 3: Process        @step.do("process data")        async def process_data():            return {"processed": True, "count": len(data)}        result = await process_data()        return resultclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Create workflow instance        instance = await self.env.MY_WORKFLOW.create()        return Response(f"Workflow started: {instance.id}")
```
```
class MyWorkflow(WorkflowEntrypoint):    async def run(self, event, step):        @step.do("step_a")        async def step_a():            return "A done"        @step.do("step_b")        async def step_b():            return "B done"        # step_c waits for both step_a and step_b        @step.do("step_c", depends=[step_a, step_b], concurrent=True)        async def step_c(result_a, result_b):            return f"C received: {result_a}, {result_b}"        return await step_c()
```
```
class MyWorkflow(WorkflowEntrypoint):    async def run(self, event, step):        @step.do("step_a")        async def step_a():            return "A done"        @step.do("step_b")        async def step_b():            return "B done"        # step_c waits for both step_a and step_b        @step.do("step_c", depends=[step_a, step_b], concurrent=True)        async def step_c(result_a, result_b):            return f"C received: {result_a}, {result_b}"        return await step_c()
```
```
{  "compatibility_flags": ["python_workers", "python_workflows"],  "compatibility_date": "2025-12-01",  "workflows": [    {      "name": "my-workflow",      "binding": "MY_WORKFLOW",      "class_name": "MyWorkflow"    }  ]}
```
```
{  "compatibility_flags": ["python_workers", "python_workflows"],  "compatibility_date": "2025-12-01",  "workflows": [    {      "name": "my-workflow",      "binding": "MY_WORKFLOW",      "class_name": "MyWorkflow"    }  ]}
```
```
[project]name = "my-python-worker"version = "0.1.0"requires-python = ">=3.12"dependencies = [    "beautifulsoup4",    "httpx"][dependency-groups]dev = [    "workers-py",    "workers-runtime-sdk"]
```
```
[project]name = "my-python-worker"version = "0.1.0"requires-python = ">=3.12"dependencies = [    "beautifulsoup4",    "httpx"][dependency-groups]dev = [    "workers-py",    "workers-runtime-sdk"]
```
```
# ✅ WORKS - httpx (async)import httpxasync with httpx.AsyncClient() as client:    response = await client.get("https://api.example.com")# ✅ WORKS - aiohttpimport aiohttpasync with aiohttp.ClientSession() as session:    async with session.get("https://api.example.com") as response:        data = await response.json()# ❌ DOES NOT WORK - requests (sync)import requests  # Will fail!
```
```
# ✅ WORKS - httpx (async)import httpxasync with httpx.AsyncClient() as client:    response = await client.get("https://api.example.com")# ✅ WORKS - aiohttpimport aiohttpasync with aiohttp.ClientSession() as session:    async with session.get("https://api.example.com") as response:        data = await response.json()# ❌ DOES NOT WORK - requests (sync)import requests  # Will fail!
```
```
from js import fetch, console, Response as JSResponseclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Use JavaScript fetch        response = await fetch("https://api.example.com")        data = await response.json()        # Console logging        console.log("Fetched data:", data)        # Return JavaScript Response        return JSResponse.new("Hello!")
```
```
from js import fetch, console, Response as JSResponseclass Default(WorkerEntrypoint):    async def fetch(self, request):        # Use JavaScript fetch        response = await fetch("https://api.example.com")        data = await response.json()        # Console logging        console.log("Fetched data:", data)        # Return JavaScript Response        return JSResponse.new("Hello!")
```
```
to_py()
```
```
to_js()
```
```
from js import Objectfrom pyodide.ffi import to_js# ❌ WRONG - ImportError!from pyodide.ffi import to_pypython_data = to_py(js_data)# ✅ CORRECT - to_py() is a methodasync def fetch(self, request):    data = await request.json()  # Returns JS object    python_data = data.to_py()   # Convert to Python dict# Convert Python dict to JavaScript objectpython_dict = {"name": "test", "count": 42}js_object = to_js(python_dict, dict_converter=Object.fromEntries)# Use in Responsereturn Response(to_js({"status": "ok"}))
```
```
from js import Objectfrom pyodide.ffi import to_js# ❌ WRONG - ImportError!from pyodide.ffi import to_pypython_data = to_py(js_data)# ✅ CORRECT - to_py() is a methodasync def fetch(self, request):    data = await request.json()  # Returns JS object    python_data = data.to_py()   # Convert to Python dict# Convert Python dict to JavaScript objectpython_dict = {"name": "test", "count": 42}js_object = to_js(python_dict, dict_converter=Object.fromEntries)# Use in Responsereturn Response(to_js({"status": "ok"}))
```
```
TypeError: on_fetch is not defined
```
```
# ❌ OLD (deprecated)@handlerasync def on_fetch(request):    return Response("Hello")# ✅ NEW (current)class Default(WorkerEntrypoint):    async def fetch(self, request):        return Response("Hello")
```
```
# ❌ OLD (deprecated)@handlerasync def on_fetch(request):    return Response("Hello")# ✅ NEW (current)class Default(WorkerEntrypoint):    async def fetch(self, request):        return Response("Hello")
```
```
RuntimeError: cannot use blocking call in async context
```
```
# ❌ FAILSimport requestsresponse = requests.get("https://api.example.com")# ✅ WORKSimport httpxasync with httpx.AsyncClient() as client:    response = await client.get("https://api.example.com")
```
```
# ❌ FAILSimport requestsresponse = requests.get("https://api.example.com")# ✅ WORKSimport httpxasync with httpx.AsyncClient() as client:    response = await client.get("https://api.example.com")
```
```
ModuleNotFoundError: No module named 'numpy'
```
```
Error: Python Workers require the python_workers compatibility flag
```
```
{  "compatibility_flags": ["python_workers"]}
```
```
{  "compatibility_flags": ["python_workers"]}
```
```
"python_workflows"
```
```
@step.do
```
```
# ❌ BAD - fetch outside stepresponse = await fetch("https://api.example.com")@step.do("use data")async def use_data():    return await response.json()  # response may be stale on retry# ✅ GOOD - fetch inside step@step.do("fetch and use")async def fetch_and_use():    response = await fetch("https://api.example.com")    return await response.json()
```
```
# ❌ BAD - fetch outside stepresponse = await fetch("https://api.example.com")@step.do("use data")async def use_data():    return await response.json()  # response may be stale on retry# ✅ GOOD - fetch inside step@step.do("fetch and use")async def fetch_and_use():    response = await fetch("https://api.example.com")    return await response.json()
```
```
TypeError: Object of type X is not JSON serializable
```
```
@step.do("process")async def process():    # Convert datetime to string    return {"timestamp": datetime.now().isoformat()}
```
```
@step.do("process")async def process():    # Convert datetime to string    return {"timestamp": datetime.now().isoformat()}
```
```
Failed to install package X
```
```
Network connection lost
```
```
# ❌ Doesn't work - separate terminals# Terminal 1: npx wrangler dev (JS worker)# Terminal 2: npx wrangler dev (Python worker)# Result: Network connection lost error# ✅ Works - single wrangler instancenpx wrangler dev -c ts/wrangler.jsonc -c py/wrangler.jsonc
```
```
# ❌ Doesn't work - separate terminals# Terminal 1: npx wrangler dev (JS worker)# Terminal 2: npx wrangler dev (Python worker)# Result: Network connection lost error# ✅ Works - single wrangler instancenpx wrangler dev -c ts/wrangler.jsonc -c py/wrangler.jsonc
```
```
TypeError: Parser error: The memory limit has been exceeded
```
```
data:
```
```
# ❌ FAILS - HTMLRewriter triggered on notebook HTML with data: URLsresponse = await fetch("https://origin.example.com/notebook.html")return response  # Crashes if HTML contains large data: URLs# ✅ WORKS - Stream directly or use text/plainresponse = await fetch("https://origin.example.com/notebook.html")headers = {"Content-Type": "text/plain"}  # Bypass parserreturn Response(await response.text(), headers=headers)
```
```
# ❌ FAILS - HTMLRewriter triggered on notebook HTML with data: URLsresponse = await fetch("https://origin.example.com/notebook.html")return response  # Crashes if HTML contains large data: URLs# ✅ WORKS - Stream directly or use text/plainresponse = await fetch("https://origin.example.com/notebook.html")headers = {"Content-Type": "text/plain"}  # Bypass parserreturn Response(await response.text(), headers=headers)
```
```
text/plain
```
```
random.seed()
```
```
import random# ❌ FAILS deployment - module-level PRNG callrandom.seed(42)class Default(WorkerEntrypoint):    async def fetch(self, request):        return Response(str(random.randint(1, 100)))# ✅ WORKS - PRNG calls inside handlersclass Default(WorkerEntrypoint):    async def fetch(self, request):        random.seed(42)  # Initialize inside handler        return Response(str(random.randint(1, 100)))
```
```
import random# ❌ FAILS deployment - module-level PRNG callrandom.seed(42)class Default(WorkerEntrypoint):    async def fetch(self, request):        return Response(str(random.randint(1, 100)))# ✅ WORKS - PRNG calls inside handlersclass Default(WorkerEntrypoint):    async def fetch(self, request):        random.seed(42)  # Initialize inside handler        return Response(str(random.randint(1, 100)))
```
```
WorkerEntrypoint
```
```
python_workers
```
```
self.env
```
```
@handler
```
```
from fastapi import FastAPIfrom workers import WorkerEntrypointapp = FastAPI()@app.get("/")async def root():    return {"message": "Hello from FastAPI"}class Default(WorkerEntrypoint):    async def fetch(self, request):        # Route through FastAPI        return await app(request)
```
```
from fastapi import FastAPIfrom workers import WorkerEntrypointapp = FastAPI()@app.get("/")async def root():    return {"message": "Hello from FastAPI"}class Default(WorkerEntrypoint):    async def fetch(self, request):        # Route through FastAPI        return await app(request)
```
```
{  "workers-py": "1.7.0",  "workers-runtime-sdk": "0.3.1",  "wrangler": "4.58.0"}
```
```
{  "workers-py": "1.7.0",  "workers-runtime-sdk": "0.3.1",  "wrangler": "4.58.0"}
```
```
2025-12-01
```
```
2025-08-01
```
This specialized agent skill empowers you to seamlessly build and deploy serverless functions on Cloudflare's edge network using Python. Leveraging Pyodide, it transforms your Python code into WebAssembly, enabling high-performance, low-latency applications directly at the CDN. Whether you're extending existing Cloudflare services or developing new serverless APIs, this skill streamlines the entire development lifecycle, from project initialization and dependency management with `uv` to local testing and production deployment. Unlock the full potential of Python for global-scale, event-driven architectures with unparalleled ease and efficiency using this powerful coding assistant skill.

# When to Use This Skill
- •Deploying high-performance API endpoints at the edge using Python for minimal latency.
- •Building serverless functions for data processing, authentication, or content manipulation on Cloudflare's global network.
- •Creating event-driven microservices that respond to webhooks, database changes, or other Cloudflare events.
- •Migrating existing Python backend logic to a serverless, edge-computed environment for improved scalability and cost-efficiency.

# Pro Tips
- 💡Always leverage `uv` for efficient dependency management and `uv run pywrangler` for consistent execution within your project environment, ensuring all tools are properly isolated.
- 💡Familiarize yourself with the `workers-py` library's `WorkerEntrypoint` and `Response` objects for robust request handling and custom logic in your Python Worker.
- 💡Utilize `wrangler.jsonc`'s `compatibility_flags` to explicitly enable `python_workers` and other experimental features as needed, staying up-to-date with Cloudflare's offerings.

