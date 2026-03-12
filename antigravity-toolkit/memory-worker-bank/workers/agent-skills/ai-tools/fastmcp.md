# fastmcp
Source: https://antigravity.codes/agent-skills/ai-tools/fastmcp

## AI Worker Instructions
When the user requests functionality related to fastmcp, follow these guidelines and utilize this context.

## Scraped Content

# fastmcp
```
pip install fastmcp# oruv pip install fastmcp
```
```
pip install fastmcp# oruv pip install fastmcp
```
```
from fastmcp import FastMCP# MUST be at module level for FastMCP Cloudmcp = FastMCP("My Server")@mcp.tool()async def hello(name: str) -> str:    """Say hello to someone."""    return f"Hello, {name}!"if __name__ == "__main__":    mcp.run()
```
```
from fastmcp import FastMCP# MUST be at module level for FastMCP Cloudmcp = FastMCP("My Server")@mcp.tool()async def hello(name: str) -> str:    """Say hello to someone."""    return f"Hello, {name}!"if __name__ == "__main__":    mcp.run()
```
```
# Local developmentpython server.py# With FastMCP CLIfastmcp dev server.py# HTTP modepython server.py --transport http --port 8000
```
```
# Local developmentpython server.py# With FastMCP CLIfastmcp dev server.py# HTTP modepython server.py --transport http --port 8000
```
```
auth_route
```
```
$ref
```
```
ctx.sample()
```
```
AnthropicSamplingHandler
```
```
ctx.sample_step()
```
```
SampleStep
```
```
task=True
```
```
BearerAuthProvider
```
```
JWTVerifier
```
```
OAuthProxy
```
```
Context.get_http_request()
```
```
fastmcp.Image
```
```
from fastmcp.utilities import Image
```
```
enable_docket
```
```
enable_tasks
```
```
run_streamable_http_async()
```
```
sse_app()
```
```
streamable_http_app()
```
```
run_sse_async()
```
```
dependencies
```
```
output_schema=False
```
```
FASTMCP_SERVER_
```
```
FileSystemProvider
```
```
SkillsProvider
```
```
OpenAPIProvider
```
```
ProxyProvider
```
```
from fastmcp import FastMCPfrom fastmcp.providers import FileSystemProvidermcp = FastMCP("server")mcp.add_provider(FileSystemProvider(path="./tools", reload=True))
```
```
from fastmcp import FastMCPfrom fastmcp.providers import FileSystemProvidermcp = FastMCP("server")mcp.add_provider(FileSystemProvider(path="./tools", reload=True))
```
```
ResourcesAsTools
```
```
PromptsAsTools
```
```
from fastmcp.transforms import Namespace, VersionFiltermcp.add_transform(Namespace(prefix="api"))mcp.add_transform(VersionFilter(min_version="2.0"))
```
```
from fastmcp.transforms import Namespace, VersionFiltermcp.add_transform(Namespace(prefix="api"))mcp.add_transform(VersionFilter(min_version="2.0"))
```
```
@mcp.tool(version="2.0")async def fetch_data(query: str) -> dict:    # Clients see highest version by default    # Can request specific version    return {"data": [...]}
```
```
@mcp.tool(version="2.0")async def fetch_data(query: str) -> dict:    # Clients see highest version by default    # Can request specific version    return {"data": [...]}
```
```
@mcp.tool()async def set_preference(key: str, value: str, ctx: Context) -> dict:    await ctx.set_state(key, value)  # Persists across session    return {"saved": True}@mcp.tool()async def get_preference(key: str, ctx: Context) -> dict:    value = await ctx.get_state(key, default=None)    return {"value": value}
```
```
@mcp.tool()async def set_preference(key: str, value: str, ctx: Context) -> dict:    await ctx.set_state(key, value)  # Persists across session    return {"saved": True}@mcp.tool()async def get_preference(key: str, ctx: Context) -> dict:    value = await ctx.get_state(key, default=None)    return {"value": value}
```
```
--reload
```
```
@tool(auth=require_scopes("admin"))
```
```
# requirements.txtfastmcp<3
```
```
# requirements.txtfastmcp<3
```
```
# v2.x and v3.0 compatiblefrom fastmcp import FastMCPmcp = FastMCP("server")# ... rest of code works the same
```
```
# v2.x and v3.0 compatiblefrom fastmcp import FastMCPmcp = FastMCP("server")# ... rest of code works the same
```
```
@mcp.tool()async def async_tool(url: str) -> dict:  # Use async for I/O    async with httpx.AsyncClient() as client:        return (await client.get(url)).json()
```
```
@mcp.tool()async def async_tool(url: str) -> dict:  # Use async for I/O    async with httpx.AsyncClient() as client:        return (await client.get(url)).json()
```
```
data://
```
```
file://
```
```
resource://
```
```
info://
```
```
api://
```
```
@mcp.resource("user://{user_id}/profile")  # Template with parametersasync def get_user(user_id: str) -> dict:  # CRITICAL: param names must match    return await fetch_user_from_db(user_id)
```
```
@mcp.resource("user://{user_id}/profile")  # Template with parametersasync def get_user(user_id: str) -> dict:  # CRITICAL: param names must match    return await fetch_user_from_db(user_id)
```
```
@mcp.prompt("analyze")def analyze_prompt(topic: str) -> str:    return f"Analyze {topic} considering: state, challenges, opportunities, recommendations."
```
```
@mcp.prompt("analyze")def analyze_prompt(topic: str) -> str:    return f"Analyze {topic} considering: state, challenges, opportunities, recommendations."
```
```
Context
```
```
from fastmcp import Context@mcp.tool()async def confirm_action(action: str, context: Context) -> dict:    confirmed = await context.request_elicitation(prompt=f"Confirm {action}?", response_type=str)    return {"status": "completed" if confirmed.lower() == "yes" else "cancelled"}
```
```
from fastmcp import Context@mcp.tool()async def confirm_action(action: str, context: Context) -> dict:    confirmed = await context.request_elicitation(prompt=f"Confirm {action}?", response_type=str)    return {"status": "completed" if confirmed.lower() == "yes" else "cancelled"}
```
```
@mcp.tool()async def batch_import(file_path: str, context: Context) -> dict:    data = await read_file(file_path)    for i, item in enumerate(data):        await context.report_progress(i + 1, len(data), f"Importing {i + 1}/{len(data)}")        await import_item(item)    return {"imported": len(data)}
```
```
@mcp.tool()async def batch_import(file_path: str, context: Context) -> dict:    data = await read_file(file_path)    for i, item in enumerate(data):        await context.report_progress(i + 1, len(data), f"Importing {i + 1}/{len(data)}")        await import_item(item)    return {"imported": len(data)}
```
```
@mcp.tool()async def enhance_text(text: str, context: Context) -> str:    response = await context.request_sampling(        messages=[{"role": "user", "content": f"Enhance: {text}"}],        temperature=0.7    )    return response["content"]
```
```
@mcp.tool()async def enhance_text(text: str, context: Context) -> str:    response = await context.request_sampling(        messages=[{"role": "user", "content": f"Enhance: {text}"}],        temperature=0.7    )    return response["content"]
```
```
@mcp.tool(task=True)  # Enable background task modeasync def analyze_large_dataset(dataset_id: str, context: Context) -> dict:    """Analyze large dataset with progress tracking."""    data = await fetch_dataset(dataset_id)    for i, chunk in enumerate(data.chunks):        # Report progress to client        await context.report_progress(            current=i + 1,            total=len(data.chunks),            message=f"Processing chunk {i + 1}/{len(data.chunks)}"        )        await process_chunk(chunk)    return {"status": "complete", "records_processed": len(data)}
```
```
@mcp.tool(task=True)  # Enable background task modeasync def analyze_large_dataset(dataset_id: str, context: Context) -> dict:    """Analyze large dataset with progress tracking."""    data = await fetch_dataset(dataset_id)    for i, chunk in enumerate(data.chunks):        # Report progress to client        await context.report_progress(            current=i + 1,            total=len(data.chunks),            message=f"Processing chunk {i + 1}/{len(data.chunks)}"        )        await process_chunk(chunk)    return {"status": "complete", "records_processed": len(data)}
```
```
pending
```
```
running
```
```
completed
```
```
failed
```
```
cancelled
```
```
statusMessage
```
```
ctx.report_progress()
```
```
mcp>=1.10.0
```
```
ctx.sample()
```
```
from fastmcp import Contextfrom fastmcp.sampling import AnthropicSamplingHandler# Configure sampling handlermcp = FastMCP("Agent Server")mcp.add_sampling_handler(AnthropicSamplingHandler(api_key=os.getenv("ANTHROPIC_API_KEY")))@mcp.tool()async def research_topic(topic: str, context: Context) -> dict:    """Research a topic using agentic sampling with tools."""    # Define tools available during sampling    research_tools = [        {            "name": "search_web",            "description": "Search the web for information",            "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}}}        },        {            "name": "fetch_url",            "description": "Fetch content from a URL",            "inputSchema": {"type": "object", "properties": {"url": {"type": "string"}}}        }    ]    # Sample with tools - LLM can call these tools during reasoning    result = await context.sample(        messages=[{"role": "user", "content": f"Research: {topic}"}],        tools=research_tools,        max_tokens=4096    )    return {"research": result.content, "tools_used": result.tool_calls}
```
```
from fastmcp import Contextfrom fastmcp.sampling import AnthropicSamplingHandler# Configure sampling handlermcp = FastMCP("Agent Server")mcp.add_sampling_handler(AnthropicSamplingHandler(api_key=os.getenv("ANTHROPIC_API_KEY")))@mcp.tool()async def research_topic(topic: str, context: Context) -> dict:    """Research a topic using agentic sampling with tools."""    # Define tools available during sampling    research_tools = [        {            "name": "search_web",            "description": "Search the web for information",            "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}}}        },        {            "name": "fetch_url",            "description": "Fetch content from a URL",            "inputSchema": {"type": "object", "properties": {"url": {"type": "string"}}}        }    ]    # Sample with tools - LLM can call these tools during reasoning    result = await context.sample(        messages=[{"role": "user", "content": f"Research: {topic}"}],        tools=research_tools,        max_tokens=4096    )    return {"research": result.content, "tools_used": result.tool_calls}
```
```
@mcp.tool()async def get_single_response(prompt: str, context: Context) -> dict:    """Get a single LLM response without tool loop."""    # sample_step() returns SampleStep for inspection    step = await context.sample_step(        messages=[{"role": "user", "content": prompt}],        temperature=0.7    )    return {        "content": step.content,        "model": step.model,        "stop_reason": step.stop_reason    }
```
```
@mcp.tool()async def get_single_response(prompt: str, context: Context) -> dict:    """Get a single LLM response without tool loop."""    # sample_step() returns SampleStep for inspection    step = await context.sample_step(        messages=[{"role": "user", "content": prompt}],        temperature=0.7    )    return {        "content": step.content,        "model": step.model,        "stop_reason": step.stop_reason    }
```
```
AnthropicSamplingHandler
```
```
OpenAISamplingHandler
```
```
ctx.sample()
```
```
py-key-value-aio
```
```
FernetEncryptionWrapper
```
```
from key_value.stores import DiskStore, RedisStorefrom key_value.encryption import FernetEncryptionWrapperfrom cryptography.fernet import Fernet# Disk (persistent, single instance)mcp = FastMCP("Server", storage=DiskStore(path="/app/data/storage"))# Redis (distributed, production)mcp = FastMCP("Server", storage=RedisStore(    host=os.getenv("REDIS_HOST"), password=os.getenv("REDIS_PASSWORD")))# Encrypted storage (recommended)mcp = FastMCP("Server", storage=FernetEncryptionWrapper(    key_value=DiskStore(path="/app/data"),    fernet=Fernet(os.getenv("STORAGE_ENCRYPTION_KEY"))))
```
```
from key_value.stores import DiskStore, RedisStorefrom key_value.encryption import FernetEncryptionWrapperfrom cryptography.fernet import Fernet# Disk (persistent, single instance)mcp = FastMCP("Server", storage=DiskStore(path="/app/data/storage"))# Redis (distributed, production)mcp = FastMCP("Server", storage=RedisStore(    host=os.getenv("REDIS_HOST"), password=os.getenv("REDIS_PASSWORD")))# Encrypted storage (recommended)mcp = FastMCP("Server", storage=FernetEncryptionWrapper(    key_value=DiskStore(path="/app/data"),    fernet=Fernet(os.getenv("STORAGE_ENCRYPTION_KEY"))))
```
```
storage
```
```
from contextlib import asynccontextmanagerfrom dataclasses import dataclass@dataclassclass AppContext:    db: Database    api_client: httpx.AsyncClient@asynccontextmanagerasync def app_lifespan(server: FastMCP):    """Runs ONCE per server instance."""    db = await Database.connect(os.getenv("DATABASE_URL"))    api_client = httpx.AsyncClient(base_url=os.getenv("API_BASE_URL"), timeout=30.0)    try:        yield AppContext(db=db, api_client=api_client)    finally:        await db.disconnect()        await api_client.aclose()mcp = FastMCP("Server", lifespan=app_lifespan)# Access in tools@mcp.tool()async def query_db(sql: str, context: Context) -> list:    app_ctx = context.fastmcp_context.lifespan_context    return await app_ctx.db.query(sql)
```
```
from contextlib import asynccontextmanagerfrom dataclasses import dataclass@dataclassclass AppContext:    db: Database    api_client: httpx.AsyncClient@asynccontextmanagerasync def app_lifespan(server: FastMCP):    """Runs ONCE per server instance."""    db = await Database.connect(os.getenv("DATABASE_URL"))    api_client = httpx.AsyncClient(base_url=os.getenv("API_BASE_URL"), timeout=30.0)    try:        yield AppContext(db=db, api_client=api_client)    finally:        await db.disconnect()        await api_client.aclose()mcp = FastMCP("Server", lifespan=app_lifespan)# Access in tools@mcp.tool()async def query_db(sql: str, context: Context) -> list:    app_ctx = context.fastmcp_context.lifespan_context    return await app_ctx.db.query(sql)
```
```
mcp = FastMCP("Server", lifespan=mcp_lifespan)app = FastAPI(lifespan=mcp.lifespan)  # ✅ MUST pass lifespan!
```
```
mcp = FastMCP("Server", lifespan=mcp_lifespan)app = FastAPI(lifespan=mcp.lifespan)  # ✅ MUST pass lifespan!
```
```
context.fastmcp_context.set_state(key, value)  # Storecontext.fastmcp_context.get_state(key, default=None)  # Retrieve
```
```
context.fastmcp_context.set_state(key, value)  # Storecontext.fastmcp_context.get_state(key, default=None)  # Retrieve
```
```
Request Flow:  → ErrorHandlingMiddleware (catches errors)    → TimingMiddleware (starts timer)      → LoggingMiddleware (logs request)        → RateLimitingMiddleware (checks rate limit)          → ResponseCachingMiddleware (checks cache)            → Tool/Resource Handler
```
```
Request Flow:  → ErrorHandlingMiddleware (catches errors)    → TimingMiddleware (starts timer)      → LoggingMiddleware (logs request)        → RateLimitingMiddleware (checks rate limit)          → ResponseCachingMiddleware (checks cache)            → Tool/Resource Handler
```
```
from fastmcp.middleware import ErrorHandlingMiddleware, TimingMiddleware, LoggingMiddlewaremcp.add_middleware(ErrorHandlingMiddleware())  # First: catch errorsmcp.add_middleware(TimingMiddleware())         # Second: time requestsmcp.add_middleware(LoggingMiddleware(level="INFO"))mcp.add_middleware(RateLimitingMiddleware(max_requests=100, window_seconds=60))mcp.add_middleware(ResponseCachingMiddleware(ttl_seconds=300, storage=RedisStore()))
```
```
from fastmcp.middleware import ErrorHandlingMiddleware, TimingMiddleware, LoggingMiddlewaremcp.add_middleware(ErrorHandlingMiddleware())  # First: catch errorsmcp.add_middleware(TimingMiddleware())         # Second: time requestsmcp.add_middleware(LoggingMiddleware(level="INFO"))mcp.add_middleware(RateLimitingMiddleware(max_requests=100, window_seconds=60))mcp.add_middleware(ResponseCachingMiddleware(ttl_seconds=300, storage=RedisStore()))
```
```
from fastmcp.middleware import BaseMiddlewareclass AccessControlMiddleware(BaseMiddleware):    async def on_call_tool(self, tool_name, arguments, context):        user = context.fastmcp_context.get_state("user_id")        if user not in self.allowed_users:            raise PermissionError(f"User not authorized")        return await self.next(tool_name, arguments, context)
```
```
from fastmcp.middleware import BaseMiddlewareclass AccessControlMiddleware(BaseMiddleware):    async def on_call_tool(self, tool_name, arguments, context):        user = context.fastmcp_context.get_state("user_id")        if user not in self.allowed_users:            raise PermissionError(f"User not authorized")        return await self.next(tool_name, arguments, context)
```
```
on_message
```
```
on_request
```
```
on_notification
```
```
on_call_tool
```
```
on_read_resource
```
```
on_get_prompt
```
```
on_list_*
```
```
import_server()
```
```
mount()
```
```
# Import (static)main_server.import_server(api_server)  # One-time copy# Mount (dynamic)main_server.mount(api_server, prefix="api")  # Tools: api.fetch_datamain_server.mount(db_server, prefix="db")    # Resources: resource://db/path
```
```
# Import (static)main_server.import_server(api_server)  # One-time copy# Mount (dynamic)main_server.mount(api_server, prefix="api")  # Tools: api.fetch_datamain_server.mount(db_server, prefix="db")    # Resources: resource://db/path
```
```
@api_server.tool(tags=["public"])def public_api(): passmain_server.import_server(api_server, include_tags=["public"])  # Only publicmain_server.mount(api_server, prefix="api", exclude_tags=["admin"])  # No admin
```
```
@api_server.tool(tags=["public"])def public_api(): passmain_server.import_server(api_server, include_tags=["public"])  # Only publicmain_server.mount(api_server, prefix="api", exclude_tags=["admin"])  # No admin
```
```
resource://prefix/path
```
```
prefix+resource://path
```
```
main_server.mount(subserver, prefix="api", resource_prefix_format="path")
```
```
main_server.mount(subserver, prefix="api", resource_prefix_format="path")
```
```
JWTVerifier
```
```
RemoteAuthProvider
```
```
OAuthProxy
```
```
OAuthProvider
```
```
from fastmcp.auth import JWTVerifierauth = JWTVerifier(issuer="https://auth.example.com", audience="my-server",                   public_key=os.getenv("JWT_PUBLIC_KEY"))mcp = FastMCP("Server", auth=auth)
```
```
from fastmcp.auth import JWTVerifierauth = JWTVerifier(issuer="https://auth.example.com", audience="my-server",                   public_key=os.getenv("JWT_PUBLIC_KEY"))mcp = FastMCP("Server", auth=auth)
```
```
from fastmcp.auth import OAuthProxyfrom key_value.stores import RedisStorefrom key_value.encryption import FernetEncryptionWrapperfrom cryptography.fernet import Fernetauth = OAuthProxy(    jwt_signing_key=os.environ["JWT_SIGNING_KEY"],    client_storage=FernetEncryptionWrapper(        key_value=RedisStore(host=os.getenv("REDIS_HOST"), password=os.getenv("REDIS_PASSWORD")),        fernet=Fernet(os.environ["STORAGE_ENCRYPTION_KEY"])    ),    upstream_authorization_endpoint="https://github.com/login/oauth/authorize",    upstream_token_endpoint="https://github.com/login/oauth/access_token",    upstream_client_id=os.getenv("GITHUB_CLIENT_ID"),    upstream_client_secret=os.getenv("GITHUB_CLIENT_SECRET"),    enable_consent_screen=True  # CRITICAL: Prevents confused deputy attacks)mcp = FastMCP("GitHub Auth", auth=auth)
```
```
from fastmcp.auth import OAuthProxyfrom key_value.stores import RedisStorefrom key_value.encryption import FernetEncryptionWrapperfrom cryptography.fernet import Fernetauth = OAuthProxy(    jwt_signing_key=os.environ["JWT_SIGNING_KEY"],    client_storage=FernetEncryptionWrapper(        key_value=RedisStore(host=os.getenv("REDIS_HOST"), password=os.getenv("REDIS_PASSWORD")),        fernet=Fernet(os.environ["STORAGE_ENCRYPTION_KEY"])    ),    upstream_authorization_endpoint="https://github.com/login/oauth/authorize",    upstream_token_endpoint="https://github.com/login/oauth/access_token",    upstream_client_id=os.getenv("GITHUB_CLIENT_ID"),    upstream_client_secret=os.getenv("GITHUB_CLIENT_SECRET"),    enable_consent_screen=True  # CRITICAL: Prevents confused deputy attacks)mcp = FastMCP("GitHub Auth", auth=auth)
```
```
from fastmcp.auth import SupabaseProviderauth = SupabaseProvider(    auth_route="/custom-auth",  # Custom auth route (new in v2.14.2)    # ... other config)
```
```
from fastmcp.auth import SupabaseProviderauth = SupabaseProvider(    auth_route="/custom-auth",  # Custom auth route (new in v2.14.2)    # ... other config)
```
```
Icon(url, size)
```
```
Icon.from_file()
```
```
Image.to_data_uri()
```
```
httpx.AsyncClient
```
```
FastMCP.from_openapi(spec, client, route_maps)
```
```
FastMCP.from_fastapi(app, httpx_client_kwargs)
```
```
mcp
```
```
server
```
```
app
```
```
# ✅ CORRECT: Module-level exportmcp = FastMCP("server")  # At module level!# ❌ WRONG: Function-wrappeddef create_server():    return FastMCP("server")  # Too late for cloud!
```
```
# ✅ CORRECT: Module-level exportmcp = FastMCP("server")  # At module level!# ❌ WRONG: Function-wrappeddef create_server():    return FastMCP("server")  # Too late for cloud!
```
```
{"mcpServers": {"my-server": {"url": "https://project.fastmcp.app/mcp", "transport": "http"}}}
```
```
{"mcpServers": {"my-server": {"url": "https://project.fastmcp.app/mcp", "transport": "http"}}}
```
```
RuntimeError: No server object found at module level
```
```
mcp = FastMCP("server")
```
```
RuntimeError: no running event loop
```
```
TypeError: object coroutine can't be used in 'await'
```
```
async def
```
```
await
```
```
def
```
```
TypeError: missing 1 required positional argument: 'context'
```
```
Context
```
```
async def tool(context: Context)
```
```
ValueError: Invalid resource URI: missing scheme
```
```
@mcp.resource("data://config")
```
```
@mcp.resource("config")
```
```
TypeError: get_user() missing 1 required positional argument
```
```
@mcp.resource("user://{user_id}/profile")
```
```
def get_user(user_id: str)
```
```
ValidationError: value is not a valid integer
```
```
class Params(BaseModel): query: str = Field(min_length=1)
```
```
ConnectionError: Server using different transport
```
```
mcp.run()
```
```
{"command": "python", "args": ["server.py"]}
```
```
mcp.run(transport="http", port=8000)
```
```
{"url": "http://localhost:8000/mcp", "transport": "http"}
```
```
ModuleNotFoundError: No module named 'my_package'
```
```
pip install -e .
```
```
export PYTHONPATH="/path/to/project"
```
```
DeprecationWarning: 'mcp.settings' is deprecated
```
```
os.getenv("API_KEY")
```
```
mcp.settings.get("API_KEY")
```
```
OSError: [Errno 48] Address already in use
```
```
--port 8001
```
```
lsof -ti:8000 | xargs kill -9
```
```
TypeError: Object of type 'ndarray' is not JSON serializable
```
```
list[float]
```
```
{"values": np_array.tolist()}
```
```
# ❌ NOT SUPPORTEDclass MyCustomClass:    def __init__(self, value: str):        self.value = value@mcp.tool()async def get_custom() -> MyCustomClass:    return MyCustomClass("test")  # Serialization error# ✅ SUPPORTED - Use dict or Pydantic@mcp.tool()async def get_custom() -> dict[str, str]:    obj = MyCustomClass("test")    return {"value": obj.value}# OR use Pydantic BaseModelfrom pydantic import BaseModelclass MyModel(BaseModel):    value: str@mcp.tool()async def get_model() -> MyModel:    return MyModel(value="test")  # Works!
```
```
# ❌ NOT SUPPORTEDclass MyCustomClass:    def __init__(self, value: str):        self.value = value@mcp.tool()async def get_custom() -> MyCustomClass:    return MyCustomClass("test")  # Serialization error# ✅ SUPPORTED - Use dict or Pydantic@mcp.tool()async def get_custom() -> dict[str, str]:    obj = MyCustomClass("test")    return {"value": obj.value}# OR use Pydantic BaseModelfrom pydantic import BaseModelclass MyModel(BaseModel):    value: str@mcp.tool()async def get_model() -> MyModel:    return MyModel(value="test")  # Works!
```
```
$ref
```
```
outputSchema
```
```
TypeError: Object of type 'datetime' is not JSON serializable
```
```
datetime.now().isoformat()
```
```
.decode('utf-8')
```
```
ImportError: cannot import name 'X' from partially initialized module
```
```
__init__.py
```
```
from .api_client import APIClient
```
```
DeprecationWarning: datetime.utcnow() is deprecated
```
```
datetime.now(timezone.utc)
```
```
datetime.utcnow()
```
```
RuntimeError: Event loop is closed
```
```
connect()
```
```
RuntimeError: OAuth tokens lost on restart
```
```
ValueError: Cache not persisting
```
```
FernetEncryptionWrapper
```
```
RuntimeError: Database connection never initialized
```
```
Warning: MCP lifespan hooks not running
```
```
app = FastAPI(lifespan=mcp.lifespan)
```
```
RuntimeError: Rate limit not checked before caching
```
```
RecursionError: maximum recursion depth exceeded
```
```
self.next()
```
```
result = await self.next(tool_name, arguments, context)
```
```
RuntimeError: Subserver changes not reflected
```
```
ValueError: Unexpected tool namespacing
```
```
import_server()
```
```
mount()
```
```
import_server()
```
```
mount()
```
```
ValueError: Resource not found: resource://api/users
```
```
resource://prefix/path
```
```
prefix+resource://path
```
```
resource_prefix_format="path"
```
```
SecurityWarning: Authorization bypass possible
```
```
enable_consent_screen=True
```
```
ValueError: JWT signing key required for OAuth Proxy
```
```
jwt_signing_key
```
```
secrets.token_urlsafe(32)
```
```
FASTMCP_JWT_SIGNING_KEY
```
```
OAuthProxy(jwt_signing_key=...)
```
```
ValueError: Invalid data URI format
```
```
Icon.from_file("/path/icon.png", size="medium")
```
```
Image.to_data_uri()
```
```
Warning: Lifespan runs per-server, not per-session
```
```
ImportError: cannot import name 'BearerAuthProvider' from 'fastmcp.auth'
```
```
BearerAuthProvider
```
```
JWTVerifier
```
```
OAuthProxy
```
```
# Before (v2.13.x)from fastmcp.auth import BearerAuthProvider# After (v2.14.0+)from fastmcp.auth import JWTVerifierauth = JWTVerifier(issuer="...", audience="...", public_key="...")
```
```
# Before (v2.13.x)from fastmcp.auth import BearerAuthProvider# After (v2.14.0+)from fastmcp.auth import JWTVerifierauth = JWTVerifier(issuer="...", audience="...", public_key="...")
```
```
AttributeError: 'Context' object has no attribute 'get_http_request'
```
```
Context.get_http_request()
```
```
InitializeResult
```
```
ImportError: cannot import name 'Image' from 'fastmcp'
```
```
fastmcp.Image
```
```
# Before (v2.13.x)from fastmcp import Image# After (v2.14.0+)from fastmcp.utilities import Image
```
```
# Before (v2.13.x)from fastmcp import Image# After (v2.14.0+)from fastmcp.utilities import Image
```
```
/mcp
```
```
/mcp
```
```
/mcp/mcp
```
```
/
```
```
# ❌ WRONG - Creates /mcp/mcp endpointfrom fastapi import FastAPIfrom fastmcp import FastMCPmcp = FastMCP("server")app = FastAPI(lifespan=mcp.lifespan)app.mount("/mcp", mcp)  # Endpoint becomes /mcp/mcp# ✅ CORRECT - Mount at rootapp.mount("/", mcp)  # Endpoint is /mcp# ✅ OR adjust client config# In claude_desktop_config.json:{"url": "http://localhost:8000/mcp/mcp", "transport": "http"}
```
```
# ❌ WRONG - Creates /mcp/mcp endpointfrom fastapi import FastAPIfrom fastmcp import FastMCPmcp = FastMCP("server")app = FastAPI(lifespan=mcp.lifespan)app.mount("/mcp", mcp)  # Endpoint becomes /mcp/mcp# ✅ CORRECT - Mount at rootapp.mount("/", mcp)  # Endpoint is /mcp# ✅ OR adjust client config# In claude_desktop_config.json:{"url": "http://localhost:8000/mcp/mcp", "transport": "http"}
```
```
lifespan=mcp.lifespan
```
```
RuntimeError: No active context found
```
```
task=True
```
```
# In v2.14.2 and earlier - FAILSfrom fastapi import FastAPIfrom fastmcp import FastMCP, Contextmcp = FastMCP("server")app = FastAPI(lifespan=mcp.lifespan)@mcp.tool(task=True)async def sample(name: str, ctx: Context) -> dict:    # RuntimeError: No active context found    await ctx.report_progress(1, 1, "Processing")    return {"status": "OK"}app.mount("/", mcp)# ✅ FIXED in v2.14.3# pip install fastmcp>=2.14.3
```
```
# In v2.14.2 and earlier - FAILSfrom fastapi import FastAPIfrom fastmcp import FastMCP, Contextmcp = FastMCP("server")app = FastAPI(lifespan=mcp.lifespan)@mcp.tool(task=True)async def sample(name: str, ctx: Context) -> dict:    # RuntimeError: No active context found    await ctx.report_progress(1, 1, "Processing")    return {"status": "OK"}app.mount("/", mcp)# ✅ FIXED in v2.14.3# pip install fastmcp>=2.14.3
```
```
utils.py
```
```
httpx.AsyncClient
```
```
get_client()
```
```
retry_with_backoff(func, max_retries=3, initial_delay=1.0, exponential_base=2.0)
```
```
TimeBasedCache(ttl=300)
```
```
.get()
```
```
.set()
```
```
pytest
```
```
create_test_client(test_server)
```
```
await client.call_tool()
```
```
Client("server.py")
```
```
list_tools()
```
```
call_tool()
```
```
list_resources()
```
```
fastmcp dev server.py                # Run with inspectorfastmcp install server.py             # Install to Claude DesktopFASTMCP_LOG_LEVEL=DEBUG fastmcp dev  # Debug logging
```
```
fastmcp dev server.py                # Run with inspectorfastmcp install server.py             # Install to Claude DesktopFASTMCP_LOG_LEVEL=DEBUG fastmcp dev  # Debug logging
```
```
server.py
```
```
requirements.txt
```
```
.env
```
```
README.md
```
```
src/
```
```
tests/
```
```
pyproject.toml
```
```
/jlowin/fastmcp
```
```
import_server()
```
```
mount()
```
```
fastmcp dev
```
```
task=True
```
```
ctx.sample(tools=[...])
```
```
# ❌ Server inside function (Cloud can't find it)def create_server():    mcp = FastMCP("my-server")    return mcp# ✅ Module-level exportmcp = FastMCP("my-server")@mcp.tool()def my_tool():    pass
```
```
# ❌ Server inside function (Cloud can't find it)def create_server():    mcp = FastMCP("my-server")    return mcp# ✅ Module-level exportmcp = FastMCP("my-server")@mcp.tool()def my_tool():    pass
```
```
# ❌ Missing scheme@mcp.resource("users")def get_users():    pass# ✅ Include scheme prefix@mcp.resource("data://users")def get_users():    pass@mcp.resource("user://{user_id}")def get_user(user_id: str):    pass
```
```
# ❌ Missing scheme@mcp.resource("users")def get_users():    pass# ✅ Include scheme prefix@mcp.resource("data://users")def get_users():    pass@mcp.resource("user://{user_id}")def get_user(user_id: str):    pass
```
```
# ❌ Parameter name mismatch@mcp.resource("user://{user_id}")def get_user(id: str):  # Wrong param name!    pass# ✅ Names must match exactly@mcp.resource("user://{user_id}")def get_user(user_id: str):  # Matches template    pass
```
```
# ❌ Parameter name mismatch@mcp.resource("user://{user_id}")def get_user(id: str):  # Wrong param name!    pass# ✅ Names must match exactly@mcp.resource("user://{user_id}")def get_user(user_id: str):  # Matches template    pass
```
```
# ⚠️ Breaking change in v2.13.0# Lifespan now runs once per server instance, not per session# ✅ Use for server-wide initialization@mcp.lifespanasync def lifespan(context):    db = await init_database()    yield {"db": db}    await db.close()
```
```
# ⚠️ Breaking change in v2.13.0# Lifespan now runs once per server instance, not per session# ✅ Use for server-wide initialization@mcp.lifespanasync def lifespan(context):    db = await init_database()    yield {"db": db}    await db.close()
```
```
# ❌ Database never initializesapp = FastAPI()# ✅ Pass MCP lifespan to FastAPIapp = FastAPI(lifespan=mcp.lifespan)
```
```
# ❌ Database never initializesapp = FastAPI()# ✅ Pass MCP lifespan to FastAPIapp = FastAPI(lifespan=mcp.lifespan)
```
```
# ❌ Memory storage (data lost on restart)# Default behavior# ✅ Use persistent storage in productionfrom fastmcp.storage import DiskStorefrom fastmcp.security import FernetEncryptionWrapperstorage = FernetEncryptionWrapper(    DiskStore("/data/mcp"),    key=os.getenv("ENCRYPTION_KEY"))
```
```
# ❌ Memory storage (data lost on restart)# Default behavior# ✅ Use persistent storage in productionfrom fastmcp.storage import DiskStorefrom fastmcp.security import FernetEncryptionWrapperstorage = FernetEncryptionWrapper(    DiskStore("/data/mcp"),    key=os.getenv("ENCRYPTION_KEY"))
```
```
# ❌ Security vulnerability (confused deputy attack)auth = OAuthProxy(...)# ✅ Enable consent screenauth = OAuthProxy(    ...,    enable_consent_screen=True  # Required for security!)
```
```
# ❌ Security vulnerability (confused deputy attack)auth = OAuthProxy(...)# ✅ Enable consent screenauth = OAuthProxy(    ...,    enable_consent_screen=True  # Required for security!)
```
```
mcp = FastMCP()
```
```
@mcp.resource("users")
```
```
@mcp.resource("data://users")
```
```
FastAPI(lifespan=mcp.lifespan)
```
```
enable_consent_screen=True
```
Dive into FastMCP, a powerful Python framework designed for crafting sophisticated Model Context Protocol (MCP) servers. This skill empowers developers to seamlessly integrate custom tools, external resources, and tailored prompts directly into large language models like Claude. By streamlining the development of production-ready AI agents, FastMCP offers a structured approach to extending LLM functionalities, ensuring robust error handling, efficient deployment strategies, and a clear path to exposing complex operations. Leverage FastMCP to transform your Python applications into intelligent, interactive AI agent components, enhancing the capabilities of conversational AI systems.

# When to Use This Skill
- •Automating internal business processes by exposing proprietary APIs or microservices to an LLM agent for task execution.
- •Developing data-driven AI assistants capable of fetching, processing, and summarizing real-time information from databases or external APIs.
- •Building complex multi-step AI workflows where an LLM orchestrates a sequence of tool calls and data manipulations to achieve specific outcomes.
- •Creating interactive diagnostic or configuration tools that guide users through complex processes, with the LLM invoking backend tools based on user input.

# Pro Tips
- 💡Always write clear, concise docstrings for your `@mcp.tool()` functions; these descriptions are crucial for the LLM to accurately understand and invoke your tools.
- 💡Utilize the `fastmcp dev` CLI command during development to benefit from hot-reloading and automatic server restarts, significantly speeding up your iteration cycle.
- 💡For scalable production deployments, consider running FastMCP servers in HTTP mode and deploying behind a robust ASGI server like Uvicorn or Gunicorn, ensuring better performance and integration with existing infrastructure.

