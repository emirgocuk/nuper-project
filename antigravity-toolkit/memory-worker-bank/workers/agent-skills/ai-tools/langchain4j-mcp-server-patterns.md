# langchain4j-mcp-server-patterns
Source: https://antigravity.codes/agent-skills/ai-tools/langchain4j-mcp-server-patterns

## AI Worker Instructions
When the user requests functionality related to langchain4j-mcp-server-patterns, follow these guidelines and utilize this context.

## Scraped Content

# langchain4j-mcp-server-patterns
```
MCPServer server = MCPServer.builder()    .server(new StdioServer.Builder())    .addToolProvider(new SimpleWeatherToolProvider())    .build();server.start();
```
```
MCPServer server = MCPServer.builder()    .server(new StdioServer.Builder())    .addToolProvider(new SimpleWeatherToolProvider())    .build();server.start();
```
```
@Beanpublic MCPSpringConfig mcpServer(List<ToolProvider> tools) {    return MCPSpringConfig.builder()        .tools(tools)        .server(new StdioServer.Builder())        .build();}
```
```
@Beanpublic MCPSpringConfig mcpServer(List<ToolProvider> tools) {    return MCPSpringConfig.builder()        .tools(tools)        .server(new StdioServer.Builder())        .build();}
```
```
AI Application ←→ MCP Client ←→ Transport ←→ MCP Server ←→ External Service
```
```
AI Application ←→ MCP Client ←→ Transport ←→ MCP Server ←→ External Service
```
```
class WeatherToolProvider implements ToolProvider {    @Override    public List<ToolSpecification> listTools() {        return List.of(ToolSpecification.builder()            .name("get_weather")            .description("Get weather for a city")            .inputSchema(Map.of(                "type", "object",                "properties", Map.of(                    "city", Map.of("type", "string", "description", "City name")                ),                "required", List.of("city")            ))            .build());    }    @Override    public String executeTool(String name, String arguments) {        // Parse arguments and execute tool logic        return "Weather data result";    }}
```
```
class WeatherToolProvider implements ToolProvider {    @Override    public List<ToolSpecification> listTools() {        return List.of(ToolSpecification.builder()            .name("get_weather")            .description("Get weather for a city")            .inputSchema(Map.of(                "type", "object",                "properties", Map.of(                    "city", Map.of("type", "string", "description", "City name")                ),                "required", List.of("city")            ))            .build());    }    @Override    public String executeTool(String name, String arguments) {        // Parse arguments and execute tool logic        return "Weather data result";    }}
```
```
class CompanyResourceProvider    implements ResourceListProvider, ResourceReadHandler {    @Override    public List<McpResource> listResources() {        return List.of(            McpResource.builder()                .uri("policies")                .name("Company Policies")                .mimeType("text/plain")                .build()        );    }    @Override    public String readResource(String uri) {        return loadResourceContent(uri);    }}
```
```
class CompanyResourceProvider    implements ResourceListProvider, ResourceReadHandler {    @Override    public List<McpResource> listResources() {        return List.of(            McpResource.builder()                .uri("policies")                .name("Company Policies")                .mimeType("text/plain")                .build()        );    }    @Override    public String readResource(String uri) {        return loadResourceContent(uri);    }}
```
```
class PromptTemplateProvider    implements PromptListProvider, PromptGetHandler {    @Override    public List<Prompt> listPrompts() {        return List.of(            Prompt.builder()                .name("code-review")                .description("Review code for quality")                .build()        );    }    @Override    public String getPrompt(String name, Map<String, String> args) {        return applyTemplate(name, args);    }}
```
```
class PromptTemplateProvider    implements PromptListProvider, PromptGetHandler {    @Override    public List<Prompt> listPrompts() {        return List.of(            Prompt.builder()                .name("code-review")                .description("Review code for quality")                .build()        );    }    @Override    public String getPrompt(String name, Map<String, String> args) {        return applyTemplate(name, args);    }}
```
```
McpTransport transport = new StdioMcpTransport.Builder()    .command(List.of("npm", "exec", "@modelcontextprotocol/server-everything"))    .logEvents(true)    .build();
```
```
McpTransport transport = new StdioMcpTransport.Builder()    .command(List.of("npm", "exec", "@modelcontextprotocol/server-everything"))    .logEvents(true)    .build();
```
```
McpTransport transport = new HttpMcpTransport.Builder()    .sseUrl("http://localhost:3001/sse")    .logRequests(true)    .logResponses(true)    .build();
```
```
McpTransport transport = new HttpMcpTransport.Builder()    .sseUrl("http://localhost:3001/sse")    .logRequests(true)    .logResponses(true)    .build();
```
```
McpClient client = new DefaultMcpClient.Builder()    .key("my-client")    .transport(transport)    .cacheToolList(true)    .build();// List available toolsList<ToolSpecification> tools = client.listTools();
```
```
McpClient client = new DefaultMcpClient.Builder()    .key("my-client")    .transport(transport)    .cacheToolList(true)    .build();// List available toolsList<ToolSpecification> tools = client.listTools();
```
```
McpToolProvider provider = McpToolProvider.builder()    .mcpClients(mcpClient)    .failIfOneServerFails(false)    .filter((client, tool) -> filterByPermissions(tool))    .build();// Integrate with AI serviceAIAssistant assistant = AiServices.builder(AIAssistant.class)    .chatModel(chatModel)    .toolProvider(provider)    .build();
```
```
McpToolProvider provider = McpToolProvider.builder()    .mcpClients(mcpClient)    .failIfOneServerFails(false)    .filter((client, tool) -> filterByPermissions(tool))    .build();// Integrate with AI serviceAIAssistant assistant = AiServices.builder(AIAssistant.class)    .chatModel(chatModel)    .toolProvider(provider)    .build();
```
```
McpToolProvider secureProvider = McpToolProvider.builder()    .mcpClients(mcpClient)    .filter((client, tool) -> {        if (tool.name().startsWith("admin_") && !isAdmin()) {            return false;        }        return true;    })    .build();
```
```
McpToolProvider secureProvider = McpToolProvider.builder()    .mcpClients(mcpClient)    .filter((client, tool) -> {        if (tool.name().startsWith("admin_") && !isAdmin()) {            return false;        }        return true;    })    .build();
```
```
public boolean canAccessResource(String uri, User user) {    return resourceService.hasAccess(uri, user);}
```
```
public boolean canAccessResource(String uri, User user) {    return resourceService.hasAccess(uri, user);}
```
```
try {    String result = mcpClient.executeTool(request);} catch (McpException e) {    log.error("MCP execution failed: {}", e.getMessage());    return fallbackResult();}
```
```
try {    String result = mcpClient.executeTool(request);} catch (McpException e) {    log.error("MCP execution failed: {}", e.getMessage());    return fallbackResult();}
```
```
@Beanpublic List<McpClient> mcpClients(List<ServerConfig> configs) {    return configs.stream()        .map(this::createMcpClient)        .collect(Collectors.toList());}@Beanpublic McpToolProvider multiServerProvider(List<McpClient> clients) {    return McpToolProvider.builder()        .mcpClients(clients)        .failIfOneServerFails(false)        .build();}
```
```
@Beanpublic List<McpClient> mcpClients(List<ServerConfig> configs) {    return configs.stream()        .map(this::createMcpClient)        .collect(Collectors.toList());}@Beanpublic McpToolProvider multiServerProvider(List<McpClient> clients) {    return McpToolProvider.builder()        .mcpClients(clients)        .failIfOneServerFails(false)        .build();}
```
```
McpToolProvider contextualProvider = McpToolProvider.builder()    .mcpClients(clients)    .filter((client, tool) -> isToolAllowed(user, tool, context))    .build();
```
```
McpToolProvider contextualProvider = McpToolProvider.builder()    .mcpClients(clients)    .filter((client, tool) -> isToolAllowed(user, tool, context))    .build();
```
```
@Componentpublic class McpHealthChecker {    @Scheduled(fixedRate = 30000) // 30 seconds    public void checkServers() {        mcpClients.forEach(client -> {            try {                client.listTools();                markHealthy(client.key());            } catch (Exception e) {                markUnhealthy(client.key(), e.getMessage());            }        });    }}
```
```
@Componentpublic class McpHealthChecker {    @Scheduled(fixedRate = 30000) // 30 seconds    public void checkServers() {        mcpClients.forEach(client -> {            try {                client.listTools();                markHealthy(client.key());            } catch (Exception e) {                markUnhealthy(client.key(), e.getMessage());            }        });    }}
```
```
mcp:  servers:    github:      type: docker      command: ["/usr/local/bin/docker", "run", "-e", "GITHUB_TOKEN", "-i", "mcp/github"]      log-events: true    database:      type: stdio      command: ["/usr/bin/npm", "exec", "@modelcontextprotocol/server-sqlite"]      log-events: false
```
```
mcp:  servers:    github:      type: docker      command: ["/usr/local/bin/docker", "run", "-e", "GITHUB_TOKEN", "-i", "mcp/github"]      log-events: true    database:      type: stdio      command: ["/usr/bin/npm", "exec", "@modelcontextprotocol/server-sqlite"]      log-events: false
```
```
@Configuration@EnableConfigurationProperties(McpProperties.class)public class McpConfiguration {    @Bean    public MCPServer mcpServer(List<ToolProvider> providers) {        return MCPServer.builder()            .server(new StdioServer.Builder())            .addToolProvider(providers)            .enableLogging(true)            .build();    }}
```
```
@Configuration@EnableConfigurationProperties(McpProperties.class)public class McpConfiguration {    @Bean    public MCPServer mcpServer(List<ToolProvider> providers) {        return MCPServer.builder()            .server(new StdioServer.Builder())            .addToolProvider(providers)            .enableLogging(true)            .build();    }}
```
This skill delves into the architectural patterns for building sophisticated AI agents capable of interacting with the real world through custom tools and resources. By leveraging LangChain4j with the Model Context Protocol (MCP), developers can craft highly extensible and context-aware AI solutions. It's crucial for integrating external data sources, orchestrating complex workflows, and ensuring your AI assistant can adapt to specific enterprise environments, moving beyond generic responses to truly intelligent actions. This empowers the creation of robust, production-ready AI systems.

# When to Use This Skill
- •Integrating external APIs and databases into AI agent workflows for dynamic data access.
- •Building multi-domain AI agents for enterprise environments (e.g., GitHub, CRM, internal systems).
- •Creating standardized, context-aware prompt template servers for consistent and controlled AI interactions.
- •Developing scalable and resilient AI agents and their custom tools within Spring Boot architectures.

# Pro Tips
- 💡Design tool providers with clear, single responsibilities and modularity to simplify maintenance, testing, and scalability as your AI agent's capabilities grow.
- 💡Prioritize robust error handling, logging, and observability within your MCP server to ensure reliable tool execution and quick debugging in production environments.
- 💡Leverage MCP's resource-based access control to securely manage and filter data sources, ensuring AI models receive relevant context without overexposure to sensitive information.

