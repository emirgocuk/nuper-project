# firecrawl-scraper
Source: https://antigravity.codes/agent-skills/ai-tools/firecrawl-scraper

## AI Worker Instructions
When the user requests functionality related to firecrawl-scraper, follow these guidelines and utilize this context.

## Scraped Content

# firecrawl-scraper
```
/scrape
```
```
/crawl
```
```
/map
```
```
/search
```
```
/extract
```
```
/agent
```
```
/batch-scrape
```
```
/v2/scrape
```
```
from firecrawl import Firecrawlimport osapp = Firecrawl(api_key=os.environ.get("FIRECRAWL_API_KEY"))# Basic scrapedoc = app.scrape(    url="https://example.com/article",    formats=["markdown", "html"],    only_main_content=True)print(doc.markdown)print(doc.metadata)
```
```
from firecrawl import Firecrawlimport osapp = Firecrawl(api_key=os.environ.get("FIRECRAWL_API_KEY"))# Basic scrapedoc = app.scrape(    url="https://example.com/article",    formats=["markdown", "html"],    only_main_content=True)print(doc.markdown)print(doc.metadata)
```
```
import FirecrawlApp from '@mendable/firecrawl-js';const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });const result = await app.scrapeUrl('https://example.com/article', {  formats: ['markdown', 'html'],  onlyMainContent: true});console.log(result.markdown);
```
```
import FirecrawlApp from '@mendable/firecrawl-js';const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });const result = await app.scrapeUrl('https://example.com/article', {  formats: ['markdown', 'html'],  onlyMainContent: true});console.log(result.markdown);
```
```
markdown
```
```
html
```
```
rawHtml
```
```
screenshot
```
```
links
```
```
json
```
```
summary
```
```
branding
```
```
changeTracking
```
```
doc = app.scrape(    url="https://example.com",    formats=["markdown", "screenshot"],    only_main_content=True,    remove_base64_images=True,    wait_for=5000,  # Wait 5s for JS    timeout=30000,    # Location & language    location={"country": "AU", "languages": ["en-AU"]},    # Cache control    max_age=0,  # Fresh content (no cache)    store_in_cache=True,    # Stealth mode for complex sites    stealth=True,    # Custom headers    headers={"User-Agent": "Custom Bot 1.0"})
```
```
doc = app.scrape(    url="https://example.com",    formats=["markdown", "screenshot"],    only_main_content=True,    remove_base64_images=True,    wait_for=5000,  # Wait 5s for JS    timeout=30000,    # Location & language    location={"country": "AU", "languages": ["en-AU"]},    # Cache control    max_age=0,  # Fresh content (no cache)    store_in_cache=True,    # Stealth mode for complex sites    stealth=True,    # Custom headers    headers={"User-Agent": "Custom Bot 1.0"})
```
```
doc = app.scrape(    url="https://example.com",    actions=[        {"type": "click", "selector": "button.load-more"},        {"type": "wait", "milliseconds": 2000},        {"type": "scroll", "direction": "down"},        {"type": "write", "selector": "input#search", "text": "query"},        {"type": "press", "key": "Enter"},        {"type": "screenshot"}  # Capture state mid-action    ])
```
```
doc = app.scrape(    url="https://example.com",    actions=[        {"type": "click", "selector": "button.load-more"},        {"type": "wait", "milliseconds": 2000},        {"type": "scroll", "direction": "down"},        {"type": "write", "selector": "input#search", "text": "query"},        {"type": "press", "key": "Enter"},        {"type": "screenshot"}  # Capture state mid-action    ])
```
```
# With schemadoc = app.scrape(    url="https://example.com/product",    formats=["json"],    json_options={        "schema": {            "type": "object",            "properties": {                "title": {"type": "string"},                "price": {"type": "number"},                "in_stock": {"type": "boolean"}            }        }    })# Without schema (prompt-only)doc = app.scrape(    url="https://example.com/product",    formats=["json"],    json_options={        "prompt": "Extract the product name, price, and availability"    })
```
```
# With schemadoc = app.scrape(    url="https://example.com/product",    formats=["json"],    json_options={        "schema": {            "type": "object",            "properties": {                "title": {"type": "string"},                "price": {"type": "number"},                "in_stock": {"type": "boolean"}            }        }    })# Without schema (prompt-only)doc = app.scrape(    url="https://example.com/product",    formats=["json"],    json_options={        "prompt": "Extract the product name, price, and availability"    })
```
```
doc = app.scrape(    url="https://example.com",    formats=["branding"])# Returns:# - Color schemes and palettes# - Typography (fonts, sizes, weights)# - Spacing and layout metrics# - UI component styles# - Logo and imagery URLs# - Brand personality traits
```
```
doc = app.scrape(    url="https://example.com",    formats=["branding"])# Returns:# - Color schemes and palettes# - Typography (fonts, sizes, weights)# - Spacing and layout metrics# - UI component styles# - Logo and imagery URLs# - Brand personality traits
```
```
/v2/crawl
```
```
result = app.crawl(    url="https://docs.example.com",    limit=100,    max_depth=3,    allowed_domains=["docs.example.com"],    exclude_paths=["/api/*", "/admin/*"],    scrape_options={        "formats": ["markdown"],        "only_main_content": True    })for page in result.data:    print(f"Scraped: {page.metadata.source_url}")    print(f"Content: {page.markdown[:200]}...")
```
```
result = app.crawl(    url="https://docs.example.com",    limit=100,    max_depth=3,    allowed_domains=["docs.example.com"],    exclude_paths=["/api/*", "/admin/*"],    scrape_options={        "formats": ["markdown"],        "only_main_content": True    })for page in result.data:    print(f"Scraped: {page.metadata.source_url}")    print(f"Content: {page.markdown[:200]}...")
```
```
# Start crawl (returns immediately)job = app.start_crawl(    url="https://docs.example.com",    limit=1000,    webhook="https://your-domain.com/webhook")print(f"Job ID: {job.id}")# Or poll for statusstatus = app.check_crawl_status(job.id)
```
```
# Start crawl (returns immediately)job = app.start_crawl(    url="https://docs.example.com",    limit=1000,    webhook="https://your-domain.com/webhook")print(f"Job ID: {job.id}")# Or poll for statusstatus = app.check_crawl_status(job.id)
```
```
/v2/map
```
```
urls = app.map(url="https://example.com")print(f"Found {len(urls)} pages")for url in urls[:10]:    print(url)
```
```
urls = app.map(url="https://example.com")print(f"Found {len(urls)} pages")for url in urls[:10]:    print(url)
```
```
/search
```
```
# Basic searchresults = app.search(    query="best practices for React server components",    limit=10)for result in results:    print(f"{result.title}: {result.url}")# Search + scrape resultsresults = app.search(    query="React server components tutorial",    limit=5,    scrape_options={        "formats": ["markdown"],        "only_main_content": True    })for result in results:    print(f"{result.title}")    print(result.markdown[:500])
```
```
# Basic searchresults = app.search(    query="best practices for React server components",    limit=10)for result in results:    print(f"{result.title}: {result.url}")# Search + scrape resultsresults = app.search(    query="React server components tutorial",    limit=5,    scrape_options={        "formats": ["markdown"],        "only_main_content": True    })for result in results:    print(f"{result.title}")    print(result.markdown[:500])
```
```
results = app.search(    query="machine learning papers",    limit=20,    # Filter by source type    sources=["web", "news", "images"],    # Filter by category    categories=["github", "research", "pdf"],    # Location    location={"country": "US"},    # Time filter    tbs="qdr:m",  # Past month (qdr:h=hour, qdr:d=day, qdr:w=week, qdr:y=year)    timeout=30000)
```
```
results = app.search(    query="machine learning papers",    limit=20,    # Filter by source type    sources=["web", "news", "images"],    # Filter by category    categories=["github", "research", "pdf"],    # Location    location={"country": "US"},    # Time filter    tbs="qdr:m",  # Past month (qdr:h=hour, qdr:d=day, qdr:w=week, qdr:y=year)    timeout=30000)
```
```
/v2/extract
```
```
from pydantic import BaseModelclass Product(BaseModel):    name: str    price: float    description: str    in_stock: boolresult = app.extract(    urls=["https://example.com/product"],    schema=Product,    system_prompt="Extract product information")print(result.data)
```
```
from pydantic import BaseModelclass Product(BaseModel):    name: str    price: float    description: str    in_stock: boolresult = app.extract(    urls=["https://example.com/product"],    schema=Product,    system_prompt="Extract product information")print(result.data)
```
```
# Extract from entire domain using wildcardresult = app.extract(    urls=["example.com/*"],  # All pages on domain    schema=Product,    system_prompt="Extract all products")# Enable web search for additional contextresult = app.extract(    urls=["example.com/products"],    schema=Product,    enable_web_search=True  # Follow external links)
```
```
# Extract from entire domain using wildcardresult = app.extract(    urls=["example.com/*"],  # All pages on domain    schema=Product,    system_prompt="Extract all products")# Enable web search for additional contextresult = app.extract(    urls=["example.com/products"],    schema=Product,    enable_web_search=True  # Follow external links)
```
```
result = app.extract(    urls=["https://example.com/about"],    prompt="Extract the company name, founding year, and key executives")# LLM determines output structure
```
```
result = app.extract(    urls=["https://example.com/about"],    prompt="Extract the company name, founding year, and key executives")# LLM determines output structure
```
```
/agent
```
```
# Basic agent usageresult = app.agent(    prompt="Find the pricing plans for the top 3 headless CMS platforms and compare their features")print(result.data)# With schema for structured outputfrom pydantic import BaseModelfrom typing import Listclass CMSPricing(BaseModel):    name: str    free_tier: bool    starter_price: float    features: List[str]result = app.agent(    prompt="Find pricing for Contentful, Sanity, and Strapi",    schema=CMSPricing)# Optional: focus on specific URLsresult = app.agent(    prompt="Extract the enterprise pricing details",    urls=["https://contentful.com/pricing", "https://sanity.io/pricing"])
```
```
# Basic agent usageresult = app.agent(    prompt="Find the pricing plans for the top 3 headless CMS platforms and compare their features")print(result.data)# With schema for structured outputfrom pydantic import BaseModelfrom typing import Listclass CMSPricing(BaseModel):    name: str    free_tier: bool    starter_price: float    features: List[str]result = app.agent(    prompt="Find pricing for Contentful, Sanity, and Strapi",    schema=CMSPricing)# Optional: focus on specific URLsresult = app.agent(    prompt="Extract the enterprise pricing details",    urls=["https://contentful.com/pricing", "https://sanity.io/pricing"])
```
```
spark-1-mini
```
```
spark-1-pro
```
```
result = app.agent(    prompt="Analyze competitive positioning...",    model="spark-1-pro"  # For complex tasks)
```
```
result = app.agent(    prompt="Analyze competitive positioning...",    model="spark-1-pro"  # For complex tasks)
```
```
# Start agent (returns immediately)job = app.start_agent(    prompt="Research market trends...")# Poll for resultsstatus = app.check_agent_status(job.id)if status.status == "completed":    print(status.data)
```
```
# Start agent (returns immediately)job = app.start_agent(    prompt="Research market trends...")# Poll for resultsstatus = app.check_agent_status(job.id)if status.status == "completed":    print(status.data)
```
```
results = app.batch_scrape(    urls=[        "https://example.com/page1",        "https://example.com/page2",        "https://example.com/page3"    ],    formats=["markdown"],    only_main_content=True)for page in results.data:    print(f"{page.metadata.source_url}: {len(page.markdown)} chars")
```
```
results = app.batch_scrape(    urls=[        "https://example.com/page1",        "https://example.com/page2",        "https://example.com/page3"    ],    formats=["markdown"],    only_main_content=True)for page in results.data:    print(f"{page.metadata.source_url}: {len(page.markdown)} chars")
```
```
job = app.start_batch_scrape(    urls=url_list,    formats=["markdown"],    webhook="https://your-domain.com/webhook")# Webhook receives events: started, page, completed, failed
```
```
job = app.start_batch_scrape(    urls=url_list,    formats=["markdown"],    webhook="https://your-domain.com/webhook")# Webhook receives events: started, page, completed, failed
```
```
const job = await app.startBatchScrape(urls, {  formats: ['markdown'],  webhook: 'https://your-domain.com/webhook'});// Poll for statusconst status = await app.checkBatchScrapeStatus(job.id);
```
```
const job = await app.startBatchScrape(urls, {  formats: ['markdown'],  webhook: 'https://your-domain.com/webhook'});// Poll for statusconst status = await app.checkBatchScrapeStatus(job.id);
```
```
# Enable change trackingdoc = app.scrape(    url="https://example.com/pricing",    formats=["markdown", "changeTracking"])# Response includes:print(doc.change_tracking.status)  # new, same, changed, removedprint(doc.change_tracking.previous_scrape_at)print(doc.change_tracking.visibility)  # visible, hidden
```
```
# Enable change trackingdoc = app.scrape(    url="https://example.com/pricing",    formats=["markdown", "changeTracking"])# Response includes:print(doc.change_tracking.status)  # new, same, changed, removedprint(doc.change_tracking.previous_scrape_at)print(doc.change_tracking.visibility)  # visible, hidden
```
```
# Git-diff mode (default)doc = app.scrape(    url="https://example.com/docs",    formats=["markdown", "changeTracking"],    change_tracking_options={        "mode": "diff"    })print(doc.change_tracking.diff)  # Line-by-line changes# JSON mode (structured comparison)doc = app.scrape(    url="https://example.com/pricing",    formats=["markdown", "changeTracking"],    change_tracking_options={        "mode": "json",        "schema": {"type": "object", "properties": {"price": {"type": "number"}}}    })# Costs 5 credits per page
```
```
# Git-diff mode (default)doc = app.scrape(    url="https://example.com/docs",    formats=["markdown", "changeTracking"],    change_tracking_options={        "mode": "diff"    })print(doc.change_tracking.diff)  # Line-by-line changes# JSON mode (structured comparison)doc = app.scrape(    url="https://example.com/pricing",    formats=["markdown", "changeTracking"],    change_tracking_options={        "mode": "json",        "schema": {"type": "object", "properties": {"price": {"type": "number"}}}    })# Costs 5 credits per page
```
```
new
```
```
same
```
```
changed
```
```
removed
```
```
# Get API key from https://www.firecrawl.dev/app# Store in environmentFIRECRAWL_API_KEY=fc-your-api-key-here
```
```
# Get API key from https://www.firecrawl.dev/app# Store in environmentFIRECRAWL_API_KEY=fc-your-api-key-here
```
```
interface Env {  FIRECRAWL_API_KEY: string;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { url } = await request.json<{ url: string }>();    const response = await fetch('https://api.firecrawl.dev/v2/scrape', {      method: 'POST',      headers: {        'Authorization': Bearer ${env.FIRECRAWL_API_KEY},        'Content-Type': 'application/json',      },      body: JSON.stringify({        url,        formats: ['markdown'],        onlyMainContent: true      })    });    const result = await response.json();    return Response.json(result);  }};
```
```
interface Env {  FIRECRAWL_API_KEY: string;}export default {  async fetch(request: Request, env: Env): Promise<Response> {    const { url } = await request.json<{ url: string }>();    const response = await fetch('https://api.firecrawl.dev/v2/scrape', {      method: 'POST',      headers: {        'Authorization': Bearer ${env.FIRECRAWL_API_KEY},        'Content-Type': 'application/json',      },      body: JSON.stringify({        url,        formats: ['markdown'],        onlyMainContent: true      })    });    const result = await response.json();    return Response.json(result);  }};
```
```
Bearer ${env.FIRECRAWL_API_KEY}
```
```
# Use auto mode (default) - only charges 5 credits if stealth is neededdoc = app.scrape(url, formats=["markdown"])# Or conditionally enable stealth for specific errorsif error_status_code in [401, 403, 500]:    doc = app.scrape(url, formats=["markdown"], proxy="stealth")
```
```
# Use auto mode (default) - only charges 5 credits if stealth is neededdoc = app.scrape(url, formats=["markdown"])# Or conditionally enable stealth for specific errorsif error_status_code in [401, 403, 500]:    doc = app.scrape(url, formats=["markdown"], proxy="stealth")
```
```
wait_for: 5000
```
```
actions
```
```
timeout
```
```
stealth: true
```
```
stealth: true
```
```
location
```
```
fc-
```
```
# RECOMMENDED: Use auto mode (default)doc = app.scrape(url, formats=['markdown'])# Auto retries with stealth (5 credits) only if basic fails# Or conditionally enable based on error statustry:    doc = app.scrape(url, formats=['markdown'], proxy='basic')except Exception as e:    if e.status_code in [401, 403, 500]:        doc = app.scrape(url, formats=['markdown'], proxy='stealth')
```
```
# RECOMMENDED: Use auto mode (default)doc = app.scrape(url, formats=['markdown'])# Auto retries with stealth (5 credits) only if basic fails# Or conditionally enable based on error statustry:    doc = app.scrape(url, formats=['markdown'], proxy='basic')except Exception as e:    if e.status_code in [401, 403, 500]:        doc = app.scrape(url, formats=['markdown'], proxy='stealth')
```
```
auto
```
```
basic
```
```
stealth
```
```
AttributeError: 'FirecrawlApp' object has no attribute 'scrape_url'
```
```
scrapeUrl()
```
```
scrape()
```
```
crawlUrl()
```
```
crawl()
```
```
startCrawl()
```
```
asyncCrawlUrl()
```
```
startCrawl()
```
```
checkCrawlStatus()
```
```
getCrawlStatus()
```
```
scrape_url()
```
```
scrape()
```
```
crawl_url()
```
```
crawl()
```
```
start_crawl()
```
```
# OLD (v1)doc = app.scrape_url("https://example.com")# NEW (v2)doc = app.scrape("https://example.com")
```
```
# OLD (v1)doc = app.scrape_url("https://example.com")# NEW (v2)doc = app.scrape("https://example.com")
```
```
'extract' is not a valid format
```
```
"extract"
```
```
"json"
```
```
# OLD (v1)doc = app.scrape_url(    url="https://example.com",    params={        "formats": ["extract"],        "extract": {"prompt": "Extract title"}    })# NEW (v2)doc = app.scrape(    url="https://example.com",    formats=[{"type": "json", "prompt": "Extract title"}])# With schemadoc = app.scrape(    url="https://example.com",    formats=[{        "type": "json",        "prompt": "Extract product info",        "schema": {            "type": "object",            "properties": {                "title": {"type": "string"},                "price": {"type": "number"}            }        }    }])
```
```
# OLD (v1)doc = app.scrape_url(    url="https://example.com",    params={        "formats": ["extract"],        "extract": {"prompt": "Extract title"}    })# NEW (v2)doc = app.scrape(    url="https://example.com",    formats=[{"type": "json", "prompt": "Extract title"}])# With schemadoc = app.scrape(    url="https://example.com",    formats=[{        "type": "json",        "prompt": "Extract product info",        "schema": {            "type": "object",            "properties": {                "title": {"type": "string"},                "price": {"type": "number"}            }        }    }])
```
```
# NEW: Screenshot as objectformats=[{    "type": "screenshot",    "fullPage": True,    "quality": 80,    "viewport": {"width": 1920, "height": 1080}}]
```
```
# NEW: Screenshot as objectformats=[{    "type": "screenshot",    "fullPage": True,    "quality": 80,    "viewport": {"width": 1920, "height": 1080}}]
```
```
'allowBackwardCrawling' is not a valid parameter
```
```
allowBackwardCrawling
```
```
crawlEntireDomain
```
```
maxDepth
```
```
maxDiscoveryDepth
```
```
ignoreSitemap
```
```
sitemap
```
```
# OLD (v1)app.crawl_url(    url="https://docs.example.com",    params={        "allowBackwardCrawling": True,        "maxDepth": 3,        "ignoreSitemap": False    })# NEW (v2)app.crawl(    url="https://docs.example.com",    crawl_entire_domain=True,    max_discovery_depth=3,    sitemap="include"  # "only", "skip", or "include")
```
```
# OLD (v1)app.crawl_url(    url="https://docs.example.com",    params={        "allowBackwardCrawling": True,        "maxDepth": 3,        "ignoreSitemap": False    })# NEW (v2)app.crawl(    url="https://docs.example.com",    crawl_entire_domain=True,    max_discovery_depth=3,    sitemap="include"  # "only", "skip", or "include")
```
```
maxAge
```
```
blockAds
```
```
skipTlsVerification
```
```
removeBase64Images
```
```
# Force fresh data if neededdoc = app.scrape(url, formats=['markdown'], max_age=0)# Disable cache entirelydoc = app.scrape(url, formats=['markdown'], store_in_cache=False)
```
```
# Force fresh data if neededdoc = app.scrape(url, formats=['markdown'], max_age=0)# Disable cache entirelydoc = app.scrape(url, formats=['markdown'], store_in_cache=False)
```
```
"Job not found"
```
```
import time# Start crawljob = app.start_crawl(url="https://docs.example.com")print(f"Job ID: {job.id}")# REQUIRED: Wait before first status checktime.sleep(2)  # 1-3 seconds recommended# Now status check succeedsstatus = app.get_crawl_status(job.id)# Or implement retry logicdef get_status_with_retry(job_id, max_retries=3, delay=1):    for attempt in range(max_retries):        try:            return app.get_crawl_status(job_id)        except Exception as e:            if "Job not found" in str(e) and attempt < max_retries - 1:                time.sleep(delay)                continue            raisestatus = get_status_with_retry(job.id)
```
```
import time# Start crawljob = app.start_crawl(url="https://docs.example.com")print(f"Job ID: {job.id}")# REQUIRED: Wait before first status checktime.sleep(2)  # 1-3 seconds recommended# Now status check succeedsstatus = app.get_crawl_status(job.id)# Or implement retry logicdef get_status_with_retry(job_id, max_retries=3, delay=1):    for attempt in range(max_retries):        try:            return app.get_crawl_status(job_id)        except Exception as e:            if "Job not found" in str(e) and attempt < max_retries - 1:                time.sleep(delay)                continue            raisestatus = get_status_with_retry(job.id)
```
```
success: false
```
```
success
```
```
code
```
```
const result = await app.scrape('https://nonexistent-domain-xyz.com');// DON'T rely on HTTP status code// Response: HTTP 200 with { success: false, code: "SCRAPE_DNS_RESOLUTION_ERROR" }// DO check success fieldif (!result.success) {    if (result.code === 'SCRAPE_DNS_RESOLUTION_ERROR') {        console.error('DNS resolution failed');    }    throw new Error(result.error);}
```
```
const result = await app.scrape('https://nonexistent-domain-xyz.com');// DON'T rely on HTTP status code// Response: HTTP 200 with { success: false, code: "SCRAPE_DNS_RESOLUTION_ERROR" }// DO check success fieldif (!result.success) {    if (result.code === 'SCRAPE_DNS_RESOLUTION_ERROR') {        console.error('DNS resolution failed');    }    throw new Error(result.error);}
```
```
# First attempt without stealthdoc = app.scrape(url="https://protected-site.com", formats=["markdown"])# Validate content isn't an error pageif "cloudflare" in doc.markdown.lower() or "access denied" in doc.markdown.lower():    # Retry with stealth (costs 5 credits if successful)    doc = app.scrape(url, formats=["markdown"], stealth=True)
```
```
# First attempt without stealthdoc = app.scrape(url="https://protected-site.com", formats=["markdown"])# Validate content isn't an error pageif "cloudflare" in doc.markdown.lower() or "access denied" in doc.markdown.lower():    # Retry with stealth (costs 5 credits if successful)    doc = app.scrape(url, formats=["markdown"], stealth=True)
```
```
"All scraping engines failed!"
```
```
# Self-hosted fails on Cloudflare-protected sitescurl -X POST 'http://localhost:3002/v2/scrape' \-H 'Authorization: Bearer YOUR_API_KEY' \-d '{  "url": "https://www.example.com/",  "pageOptions": { "engine": "playwright" }}'# Error: "All scraping engines failed!"# Workaround: Use cloud service instead# Cloud service has better anti-fingerprinting
```
```
# Self-hosted fails on Cloudflare-protected sitescurl -X POST 'http://localhost:3002/v2/scrape' \-H 'Authorization: Bearer YOUR_API_KEY' \-d '{  "url": "https://www.example.com/",  "pageOptions": { "engine": "playwright" }}'# Error: "All scraping engines failed!"# Workaround: Use cloud service instead# Cloud service has better anti-fingerprinting
```
```
maxAge
```
```
# Fresh data (real-time pricing, stock prices)doc = app.scrape(url, formats=["markdown"], max_age=0)# 10-minute cache (news, blogs)doc = app.scrape(url, formats=["markdown"], max_age=600000)  # milliseconds# Use default cache (2 days) for static contentdoc = app.scrape(url, formats=["markdown"])  # maxAge defaults to 172800000# Don't store in cache (one-time scrape)doc = app.scrape(url, formats=["markdown"], store_in_cache=False)# Require minimum age before re-scraping (v2.7.0+)doc = app.scrape(url, formats=["markdown"], min_age=3600000)  # 1 hour minimum
```
```
# Fresh data (real-time pricing, stock prices)doc = app.scrape(url, formats=["markdown"], max_age=0)# 10-minute cache (news, blogs)doc = app.scrape(url, formats=["markdown"], max_age=600000)  # milliseconds# Use default cache (2 days) for static contentdoc = app.scrape(url, formats=["markdown"])  # maxAge defaults to 172800000# Don't store in cache (one-time scrape)doc = app.scrape(url, formats=["markdown"], store_in_cache=False)# Require minimum age before re-scraping (v2.7.0+)doc = app.scrape(url, formats=["markdown"], min_age=3600000)  # 1 hour minimum
```
The Firecrawl Scraper skill empowers AI agents to seamlessly interact with the vastness of the web, transforming dynamic websites into structured, LLM-ready content. Beyond simple fetches, it intelligently navigates complex web landscapes, handling JavaScript rendering and anti-bot mechanisms with ease. This skill is indispensable for agents requiring up-to-the-minute web data, whether for content generation, research, or real-time monitoring, ensuring reliable access to information previously inaccessible to automated systems. It truly bridges the gap between raw web content and actionable AI insights.

# When to Use This Skill
- •Extracting specific article content or product details from a single web page for summarization or analysis.
- •Indexing an entire documentation site or archiving web content for offline access or historical data.
- •Conducting real-time web research, combining search capabilities with immediate data scraping for current events or market analysis.
- •Monitoring competitor websites or news sources for content changes and updates over time.

# Pro Tips
- 💡Strategically choose between `/scrape` for single-page data, `/crawl` for full site indexing, or `/search` for integrated web search and scraping, based on your agent's objective.
- 💡Leverage Firecrawl's built-in JavaScript rendering and anti-bot bypass capabilities to confidently extract data from highly dynamic or protected websites.
- 💡Specify the desired output format (markdown, HTML, JSON) to ensure the extracted data is perfectly optimized for your specific LLM task or downstream processing.

