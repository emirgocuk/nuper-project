# mermaid-diagrams
Source: https://antigravity.codes/agent-skills/documentation/mermaid-diagrams

## AI Worker Instructions
When the user requests functionality related to mermaid-diagrams, follow these guidelines and utilize this context.

## Scraped Content

# mermaid-diagrams
```
diagramType  definition content
```
```
diagramType  definition content
```
```
classDiagram
```
```
sequenceDiagram
```
```
flowchart
```
```
%%
```
```
classDiagram    Title -- Genre    Title *-- Season    Title *-- Review    User --> Review : creates        class Title {        +string name        +int releaseYear        +play()    }        class Genre {        +string name        +getTopTitles()    }
```
```
classDiagram    Title -- Genre    Title *-- Season    Title *-- Review    User --> Review : creates        class Title {        +string name        +int releaseYear        +play()    }        class Genre {        +string name        +getTopTitles()    }
```
```
sequenceDiagram    participant User    participant API    participant Database        User->>API: POST /login    API->>Database: Query credentials    Database-->>API: Return user data    alt Valid credentials        API-->>User: 200 OK + JWT token    else Invalid credentials        API-->>User: 401 Unauthorized    end
```
```
sequenceDiagram    participant User    participant API    participant Database        User->>API: POST /login    API->>Database: Query credentials    Database-->>API: Return user data    alt Valid credentials        API-->>User: 200 OK + JWT token    else Invalid credentials        API-->>User: 401 Unauthorized    end
```
```
flowchart TD    Start([User visits site]) --> Auth{Authenticated?}    Auth -->|No| Login[Show login page]    Auth -->|Yes| Dashboard[Show dashboard]    Login --> Creds[Enter credentials]    Creds --> Validate{Valid?}    Validate -->|Yes| Dashboard    Validate -->|No| Error[Show error]    Error --> Login
```
```
flowchart TD    Start([User visits site]) --> Auth{Authenticated?}    Auth -->|No| Login[Show login page]    Auth -->|Yes| Dashboard[Show dashboard]    Login --> Creds[Enter credentials]    Creds --> Validate{Valid?}    Validate -->|Yes| Dashboard    Validate -->|No| Error[Show error]    Error --> Login
```
```
erDiagram    USER ||--o{ ORDER : places    ORDER ||--|{ LINE_ITEM : contains    PRODUCT ||--o{ LINE_ITEM : includes        USER {        int id PK        string email UK        string name        datetime created_at    }        ORDER {        int id PK        int user_id FK        decimal total        datetime created_at    }
```
```
erDiagram    USER ||--o{ ORDER : places    ORDER ||--|{ LINE_ITEM : contains    PRODUCT ||--o{ LINE_ITEM : includes        USER {        int id PK        string email UK        string name        datetime created_at    }        ORDER {        int id PK        int user_id FK        decimal total        datetime created_at    }
```
```
%%
```
```
.mmd
```
```
---config:  theme: base  themeVariables:    primaryColor: "#ff6b6b"---flowchart LR    A --> B
```
```
---config:  theme: base  themeVariables:    primaryColor: "#ff6b6b"---flowchart LR    A --> B
```
```
layout: dagre
```
```
layout: elk
```
```
look: classic
```
```
look: handDrawn
```
```
npm install -g @mermaid-js/mermaid-cli
```
```
mmdc -i input.mmd -o output.png
```
```
docker run --rm -v $(pwd):/data minlag/mermaid-cli -i /data/input.mmd -o /data/output.png
```
```
{}
```
This powerful AI Agent Skill unlocks the full potential of Mermaid for developers and architects. Seamlessly transform textual descriptions into professional, insightful diagrams directly within your coding environment. Whether you're mapping intricate system interactions, designing robust database schemas, or illustrating complex algorithms, this skill ensures your visual documentation is always clear, consistent, and perfectly aligned with your code. Enhance collaboration and understanding across your team by making sophisticated diagramming accessible and efficient, fostering better design and development practices.

# When to Use This Skill
- •Visually model object-oriented designs and entity relationships for new software modules.
- •Document the sequence of interactions between microservices or API endpoints within an application.
- •Illustrate complex user journeys or algorithmic decision processes as flowcharts.
- •Design and visualize database schemas using Entity Relationship Diagrams (ERD).

# Pro Tips
- 💡Use `%%` for comments within your Mermaid syntax to add context and explanations, making diagrams more readable and maintainable for your team.
- 💡Leverage live Mermaid renderers in your IDE or documentation platform to get instant visual feedback as you define your diagrams.
- 💡For complex architecture, break down C4 diagrams into separate context, container, and component views to manage detail and improve clarity.

